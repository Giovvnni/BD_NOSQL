import re
from typing import Optional, List
from fastapi import HTTPException, UploadFile
from models.models import Usuario, Meme, Comentario  # Importar modelos
from config.database import db
from config.aws_client import upload_to_s3  # Importar la función para subir a AWS S3
from bson import ObjectId
from datetime import datetime

# Función para validar el correo electrónico
def validar_correo(email: str):
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(patron, email):
        raise HTTPException(status_code=400, detail="El correo electrónico no tiene un formato válido")

# Función para serializar objetos
def serialize_object(data):
    if isinstance(data, list):
        return [serialize_object(item) for item in data]
    if isinstance(data, dict):
        return {key: serialize_object(value) for key, value in data.items()}
    if isinstance(data, ObjectId):
        return str(data)
    return data

# Función para validar contraseñas
def validar_contraseña(contraseña: str):
    if len(contraseña) < 8:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 8 caracteres")
    if not re.search("[A-Z]", contraseña):
        raise HTTPException(status_code=400, detail="La contraseña debe contener al menos una letra mayúscula")
    if not re.search("[0-9]", contraseña):
        raise HTTPException(status_code=400, detail="La contraseña debe contener al menos un número")

# Función para subir un meme con AWS S3
async def subir_meme_a_s3(
    usuario_id: str, 
    categoria: str, 
    etiquetas: List[str], 
    archivo: UploadFile
):
    # Validar ID del usuario
    if not ObjectId.is_valid(usuario_id):
        raise HTTPException(status_code=400, detail="ID de usuario inválido")
    
    # Validar formato del archivo
    if archivo.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise HTTPException(status_code=400, detail="Formato de archivo no soportado")

    # Subir el archivo a AWS S3
    try:
        s3_url = upload_to_s3(archivo.file, archivo.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo a S3: {str(e)}")

    # Crear el registro en la base de datos
    meme_data = {
        "usuario_id": ObjectId(usuario_id),
        "url_s3": s3_url,
        "categoria": categoria,
        "etiquetas": etiquetas,
        "fecha_subida": datetime.now(),
        "estado": True  # Por defecto, el meme está activo
    }
    result = db["memes"].insert_one(meme_data)

    return {
        "id": str(result.inserted_id),
        "url_s3": s3_url,
        "mensaje": "Meme subido exitosamente"
    }

# Resto de las funciones (sin cambios)
async def crear_usuario(nombre: str, email: str, contraseña: str, rol: Optional[str] = "usuario"):
    validar_contraseña(contraseña)
    validar_correo(email)
    usuario_data = {
        "nombre": nombre,
        "email": email,
        "contraseña": contraseña,
        "fecha_registro": datetime.now(),
        "rol": rol
    }
    result = db["usuarios"].insert_one(usuario_data)
    return {"id": str(result.inserted_id)}

async def crear_comentario(usuario_id: str, meme_id: str, contenido: str):
    if not ObjectId.is_valid(usuario_id) or not ObjectId.is_valid(meme_id):
        raise HTTPException(status_code=400, detail="ID de usuario o meme inválido")
    comentario_data = {
        "usuario_id": ObjectId(usuario_id),
        "meme_id": ObjectId(meme_id),
        "contenido": contenido,
        "fecha": datetime.now()
    }
    result = db["comentarios"].insert_one(comentario_data)
    return {"id": str(result.inserted_id)}

async def listar_usuarios() -> List[dict]:
    usuarios = list(db["usuarios"].find())
    return serialize_object(usuarios)

async def listar_memes() -> List[dict]:
    memes = list(db["memes"].find())
    return serialize_object(memes)

async def listar_comentarios() -> List[dict]:
    comentarios = list(db["comentarios"].find())
    return serialize_object(comentarios)

async def actualizar_nombre_usuario(usuario_id: str, nuevo_nombre: str):
    if not ObjectId.is_valid(usuario_id):
        raise HTTPException(status_code=400, detail="ID de usuario inválido")
    db["usuarios"].update_one({"_id": ObjectId(usuario_id)}, {"$set": {"nombre": nuevo_nombre}})
    return {"mensaje": "Usuario actualizado"}

async def actualizar_estado_meme(meme_id: str, nuevo_estado: bool):
    if not ObjectId.is_valid(meme_id):
        raise HTTPException(status_code=400, detail="ID de meme inválido")
    db["memes"].update_one({"_id": ObjectId(meme_id)}, {"$set": {"estado": nuevo_estado}})
    return {"mensaje": "Meme actualizado"}

# Eliminar un meme
async def eliminar_meme(meme_id: str):
    if not ObjectId.is_valid(meme_id):
        raise HTTPException(status_code=400, detail="ID de meme inválido")
    db["memes"].delete_one({"_id": ObjectId(meme_id)})
    return {"mensaje": "Meme eliminado correctamente"}
