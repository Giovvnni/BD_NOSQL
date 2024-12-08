
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, Form
from models.models import Usuario
from schema.schemas import (
    crear_usuario,
    login,
    subir_meme_a_s3  # Importar la función de subida de memes a S3
)


router = APIRouter()


# Login
@router.post("/login", summary="Iniciar sesión")
async def login_usuario(usuario: Usuario):
    return await login(usuario)

# Insertar un usuario
@router.post("/usuarios", summary="Crear un nuevo usuario")
async def insert_usuario(usuario: Usuario):
    try:
        return await crear_usuario(usuario)
    except ValueError as e:
        if str(e) == "correo_existente":
            raise HTTPException(status_code=409, detail="El correo electrónico ya está registrado.")
        raise HTTPException(status_code=500, detail="Error en el servidor al registrar el usuario.")



# Subir un meme
@router.post("/upload")
async def upload_meme(
    usuario_id: str = Form(...),
    categoria: str = Form(...),
    etiquetas: List[str] = Form(...),
    archivo: UploadFile = Form(...)
):
    """
    Endpoint para subir un meme, validarlo, subirlo a AWS S3
    y registrar la información en la base de datos.
    """
    return await subir_meme_a_s3(usuario_id, categoria, etiquetas, archivo)



