
from typing import Optional, List
from fastapi import HTTPException, UploadFile
from validation.validations import validar_contraseña, validar_correo, validar_usuario, verificar_contraseña, verificar_usuario_existente
from models.models import Usuario  # Importar modelos
from config.database import db
from config.aws_client import upload_to_s3  # Importar la función para subir a AWS S3
from bson import ObjectId
from datetime import datetime
from config.database import pwd_context


# Función de login
async def login(usuario: Usuario):
    # Verificar si el usuario existe en la base de datos
    usuario_db = db["usuarios"].find_one({"email": usuario.email})

    if usuario_db is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar la contraseña
    if not verificar_contraseña(usuario_db["contraseña"], usuario.contraseña):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {"message": "Login exitoso", "id": str(usuario_db["_id"])}


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


# Función para crear un usuario
async def crear_usuario(usuario: Usuario):
    
    usuario.email = usuario.email.lower() # Convertir el correo a minúsculas
    # Validar la contraseña y el correo
    validar_contraseña(usuario.contraseña)
    validar_correo(usuario.email)
    validar_usuario(usuario.nombre)
    verificar_usuario_existente(usuario.email)

    # Crear un diccionario con los datos del usuario
    usuario_data = usuario.dict(exclude_unset=True)
    
    # Hacer el hash de la contraseña antes de insertarla
    hashed_password = pwd_context.hash(usuario.contraseña)
    
    # Reemplazar la contraseña con el hash
    usuario_data["contraseña"] = hashed_password
    
    # Establecer la fecha de registro
    usuario_data["fecha_registro"] = datetime.now()

    try:
        # Insertar el documento en la colección de usuarios
        result = db["usuarios"].insert_one(usuario_data)
        
        # Retornar el resultado con el ID del nuevo usuario
        return {"message": "Usuario creado con éxito", "id": str(result.inserted_id)}
    except Exception as e:
        # En caso de error en la inserción, lanzar una excepción
        raise HTTPException(status_code=500, detail=f"Error al crear el usuario: {str(e)}")


# Función para crear un meme
async def crear_meme(usuario_id: str, formato: str, estado: Optional[bool] = False):
    if not ObjectId.is_valid(usuario_id):
        raise HTTPException(status_code=400, detail="Usuario ID inválido")
    meme_data = {
        "usuario_id": ObjectId(usuario_id),
        "fecha_subida": datetime.now(),
        "formato": formato,
        "estado": estado
    }
    result = db["memes"].insert_one(meme_data)
    return {"message": "Meme creado con éxito", "id": str(result.inserted_id)}
