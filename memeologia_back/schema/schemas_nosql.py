
from typing import Optional, List
from fastapi import HTTPException, UploadFile
from config.database_nosql import db
from config.aws_client import upload_to_s3  # Importar la función para subir a AWS S3
from bson import ObjectId
from datetime import datetime, timedelta
from config.database_nosql import (
    pwd_context,
    memes_collection)

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from models.models_sql import Usuario
from config.database_sql import get_db
from sqlalchemy.orm import Session

# Asumiendo que el JWT contiene el ID del usuario
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "mi_clave_secreta"  # Cambia esto a una clave más segura
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Duración del token en minutos

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Función para obtener el usuario desde el token JWT
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # Decodificar el token JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id: int = payload.get("usuario_id")

        if usuario_id is None:
            raise HTTPException(status_code=401, detail="Usuario no encontrado en el token")

        # Buscar el usuario en la base de datos
        usuario = db.query(Usuario).filter(Usuario.usuario_id == usuario_id).first()
        if usuario is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return usuario  # El usuario es devuelto para usarse en el endpoint

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


# Función para subir un meme con AWS S3
async def subir_meme_a_s3(
    usuario_id: str,  # O tipo int si es un número entero
    categoria: str, 
    etiquetas: List[str], 
    archivo: UploadFile
):
    # Validar que el usuario_id sea un número entero
    try:
        int_usuario_id = int(usuario_id)
    except ValueError:
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
        "usuario_id": int_usuario_id,
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

def get_memes_by_usuario(usuario_id: int) -> List[dict]:
    memes = memes_collection.find({"usuario_id": usuario_id})
    
    # Verificar si hay memes
    memes_list = list(memes)  # Convertir el cursor en una lista
    if len(memes_list) == 0:
        return [
            {
                "url_s3": "https://memeologia.s3.sa-east-1.amazonaws.com/attachment-Walter-Dog-Texas-Meme.jpg",
                "categoria": "Default",
                "etiquetas": ["default"],
                "fecha_subida": "2024-01-01",
                "estado": True
            }
        ]
    
    return memes_list

def get_all_memes_urls() -> List[str]:
    """
    Obtiene todas las URLs de los memes en la base de datos.
    """
    memes_collection = db["memes"]
    # Realiza la consulta para obtener todos los documentos
    memes = memes_collection.find({}, {"url_s3": 1, "_id": 0})  # Solo obtiene el campo 'url_s3'
    
    # Convierte el cursor en una lista de URLs
    meme_urls = [meme["url_s3"] for meme in memes]
    
    return meme_urls
