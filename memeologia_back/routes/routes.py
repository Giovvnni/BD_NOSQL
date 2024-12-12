from typing import List
from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form
from sqlalchemy.orm import Session
from config.database_nosql import memes_collection
from bson import ObjectId
from validation.validations import verificar_id
from schema.schemas_nosql import (
    create_access_token,
    get_all_memes_urls,
    get_current_user,
    get_memes_by_usuario,
    subir_meme_a_s3  # Importar la función de subida de memes a S3
)
from models.models_sql import LoginRequest, Usuario, UsuarioCreate, UsuarioOut
from schema.schemas_sql import crear_usuario, login_usuario
from config.database_sql import get_db
from pydantic import BaseModel

router = APIRouter()

# Modelo de comentario
class Comment(BaseModel):
    text: str
    author: str
    authorAvatar: str
    likes: int

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Llamar a la función para verificar las credenciales
    usuario = login_usuario(db, request.email, request.contraseña)
    
    if usuario is None:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    
    # Crear el token JWT
    access_token = create_access_token(data={"usuario_id": usuario.usuario_id})
    
    # Almacenar la información de autenticación
    auth_data = {
        "usuario_id": usuario.usuario_id,
        "access_token": access_token,
        "token_type": "bearer"
    }
    
    # Log para verificar la autenticación
    print(f"Usuario: {usuario.usuario_id}, Token: {access_token}")
    
    # Retornar la información de autenticación
    return auth_data


# Ruta para insertar un usuario
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

# Obtener un usuario y sus memes
@router.get("/api/usuario/{usuario_id}", response_model=UsuarioOut)
async def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    # Obtener solo el nombre y la foto del perfil del usuario desde SQL
    usuario = db.query(Usuario.nombre, Usuario.foto_perfil).filter(Usuario.usuario_id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Obtener los memes desde MongoDB
    memes = get_memes_by_usuario(usuario_id)

    return UsuarioOut(
        nombre=usuario.nombre,
        foto_perfil=usuario.foto_perfil,
        memes=memes
    )

# Obtener memes
@router.get("/memes")
def get_memes(page: int = 1, limit: int = 20):
    skip = (page - 1) * limit
    memes = memes_collection.find().skip(skip).limit(limit)
    memes_list = list(memes)

    # Devolver los memes con una URL y algún identificador
    return [{"id": str(meme["_id"]), "imageUrl": meme["url_s3"]} for meme in memes_list]

# Ruta para obtener comentarios de un meme
@router.get("/memes/{meme_id}/comments", response_model=List[Comment])
async def get_comments(meme_id: str):
    meme = memes_collection.find_one({"_id": ObjectId(meme_id)})
    if not meme:
        raise HTTPException(status_code=404, detail="Meme no encontrado")
    
    # Suponiendo que los comentarios están almacenados en el mismo documento del meme
    comments = meme.get("comments", [])
    return comments

# Ruta para agregar un comentario a un meme
@router.post("/memes/{meme_id}/comments", response_model=Comment)
async def add_comment(meme_id: str, comment: Comment):
    meme = memes_collection.find_one({"_id": ObjectId(meme_id)})
    if not meme:
        raise HTTPException(status_code=404, detail="Meme no encontrado")
    
    # Agregar comentario
    comment_data = {
        "text": comment.text,
        "author": comment.author,
        "authorAvatar": comment.authorAvatar,
        "likes": comment.likes,
    }
    memes_collection.update_one(
        {"_id": ObjectId(meme_id)},
        {"$push": {"comments": comment_data}}
    )
    return comment_data



@router.post("/like-meme/{meme_id}")
async def like_meme(meme_id: str, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        meme_object_id = ObjectId(meme_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"ID de meme inválido: {e}")

    meme = memes_collection.find_one({"_id": meme_object_id})
    if not meme:
        raise HTTPException(status_code=404, detail="Meme no encontrado")

    print("Meme encontrado:", meme)
    print("Usuario actual:", current_user)

    # Verificar que el usuario esté registrado
    verificar_id(current_user.usuario_id, db)

    # Verificar si el usuario ya ha dado like
    if current_user.usuario_id in meme.get("liked_by_users", []):
        # Si el usuario ya ha dado like, quitarlo
        new_like_count = meme.get("likes", 0) - 1
        memes_collection.update_one(
            {"_id": meme_object_id},
            {
                "$set": {"likes": new_like_count},
                "$pull": {"liked_by_users": current_user.usuario_id}
            }
        )
        return {
            "message": "Like eliminado",
            "likes": new_like_count,
            "meme_id": meme_id,
            "liked_by_users": meme.get("liked_by_users", [])
        }
    else:
        # Si el usuario no ha dado like, agregarlo
        new_like_count = meme.get("likes", 0) + 1
        memes_collection.update_one(
            {"_id": meme_object_id},
            {
                "$set": {"likes": new_like_count},
                "$push": {"liked_by_users": current_user.usuario_id}
            }
        )
        return {
            "message": "Like agregado",
            "likes": new_like_count,
            "meme_id": meme_id,
            "liked_by_users": meme.get("liked_by_users", []) + [current_user.usuario_id]
        }



# Ruta para reportar un meme
@router.post("/memes/{meme_id}/report")
async def report_meme(meme_id: str):
    meme = memes_collection.find_one({"_id": ObjectId(meme_id)})
    if not meme:
        raise HTTPException(status_code=404, detail="Meme no encontrado")
    
    # Marcar el meme como reportado
    memes_collection.update_one(
        {"_id": ObjectId(meme_id)},
        {"$set": {"reported": True}}
    )
    
    return {"message": "Meme reportado exitosamente"}
