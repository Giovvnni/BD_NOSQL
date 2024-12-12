
from typing import List
from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form
from sqlalchemy.orm import Session
from schema.schemas_nosql import (
    
    get_memes_by_usuario,
    subir_meme_a_s3  # Importar la función de subida de memes a S3
)
from models.models_sql import LoginRequest, Usuario, UsuarioCreate, UsuarioOut
from schema.schemas_sql import crear_usuario, login_usuario
from config.database_sql import get_db

router = APIRouter()


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Llamar a la función para verificar las credenciales
    auth_data = login_usuario(db, request.email, request.contraseña)
    return auth_data

@router.post("/usuarios")
def insert_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    return crear_usuario(db=db, nombre=usuario.nombre, email=usuario.email, contraseña=usuario.contraseña)



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

@router.get("/api/usuario/{usuario_id}", response_model=UsuarioOut)
async def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    # Obtener solo el nombre y la foto del perfil del usuario desde SQL
    usuario = db.query(Usuario.nombre, Usuario.foto_perfil).filter(Usuario.usuario_id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Obtener los memes desde MongoDB
    memes = get_memes_by_usuario(usuario_id)

    # Puedes agregar los memes a la respuesta
    return UsuarioOut(
        nombre=usuario.nombre,
        foto_perfil=usuario.foto_perfil,
        memes=memes  # Incluye los memes en la respuesta
    )





