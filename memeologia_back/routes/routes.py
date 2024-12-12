
from typing import List
from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form
from sqlalchemy.orm import Session
from schema.schemas_nosql import (
    
    subir_meme_a_s3  # Importar la función de subida de memes a S3
)
from models.models_sql import Usuario
from schema.schemas_sql import crear_usuario
from config.database_sql import get_db


router = APIRouter()


"""# Login
@router.post("/login", summary="Iniciar sesión")
async def login_usuario(usuario: Usuario):
    return await login(usuario)"""

@router.post("/insert/usuarios_insert/")
def insert_usuario(nombre: str, email: str, contraseña: str, db: Session = Depends(get_db)):
    return crear_usuario(db, nombre, email, contraseña)



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



