
from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, HTTPException, UploadFile, Form
from models.models import Usuario
from schema.schemas import (
    crear_usuario,
    crear_comentario,
    listar_usuarios,
    listar_memes,
    listar_comentarios,
    login,
    actualizar_nombre_usuario,
    actualizar_estado_meme,
    eliminar_meme,
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


# Insertar un comentario
@router.post("/comentarios", summary="Crear un nuevo comentario")
async def insert_comentario(usuario_id: str, meme_id: str, contenido: str):
    try:
        return await crear_comentario(usuario_id, meme_id, contenido)
    except ValueError as e:
        if str(e) == "usuario_o_meme_no_existente":
            raise HTTPException(status_code=404, detail="Usuario o meme no encontrado.")
        raise HTTPException(status_code=500, detail="Error al intentar crear el comentario.")

# Listar usuarios
@router.get("/usuarios", summary="Obtener todos los usuarios")
async def get_usuarios():
    try:
        return await listar_usuarios()
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener la lista de usuarios.")

# Listar memes
@router.get("/memes", summary="Obtener todos los memes")
async def get_memes():
    try:
        return await listar_memes()
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener la lista de memes.")

# Listar comentarios
@router.get("/comentarios", summary="Obtener todos los comentarios")
async def get_comentarios():
    try:
        return await listar_comentarios()
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener la lista de comentarios.")

# Obtener memes con usuario
@router.get("/memes/con-usuario", summary="Obtener memes con información del usuario")
async def get_memes_usuario():

    try:
        return await obtener_memes_con_usuario()
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener los memes con información del usuario.")


# Obtener comentarios con meme y usuario
@router.get("/comentarios/con-meme-usuario", summary="Obtener comentarios con información del meme y usuario")
async def get_comentarios_usuario():

    try:
        return await obtener_comentarios_con_meme_usuario()
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener los comentarios con información del meme y usuario.")


# Actualizar nombre de usuario
@router.put("/usuarios/{usuario_id}", summary="Actualizar el nombre de un usuario")
async def update_usuario(usuario_id: str, nuevo_nombre: str):
    if not ObjectId.is_valid(usuario_id):
        raise HTTPException(status_code=400, detail="ID de usuario inválido")
    try:
        return await actualizar_nombre_usuario(usuario_id, nuevo_nombre)
    except ValueError:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    except Exception:
        raise HTTPException(status_code=500, detail="Error al intentar actualizar el nombre del usuario.")

# Actualizar estado de un meme
@router.put("/memes/{meme_id}", summary="Actualizar el estado de un meme")
async def update_meme(meme_id: str, nuevo_estado: bool):
    if not ObjectId.is_valid(meme_id):
        raise HTTPException(status_code=400, detail="ID de meme inválido")
    try:
        return await actualizar_estado_meme(meme_id, nuevo_estado)
    except ValueError:
        raise HTTPException(status_code=404, detail="Meme no encontrado.")
    except Exception:
        raise HTTPException(status_code=500, detail="Error al intentar actualizar el estado del meme.")

# Eliminar un usuario
@router.delete("/usuarios/{usuario_id}", summary="Eliminar un usuario")
async def delete_usuario(usuario_id: str):
    if not ObjectId.is_valid(usuario_id):
        raise HTTPException(status_code=400, detail="ID de usuario inválido")

    try:
        return await eliminar_usuario(usuario_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    except Exception:
        raise HTTPException(status_code=500, detail="Error al intentar eliminar el usuario.")


# Eliminar un meme
@router.delete("/memes/{meme_id}", summary="Eliminar un meme")
async def delete_meme(meme_id: str):
    if not ObjectId.is_valid(meme_id):
        raise HTTPException(status_code=400, detail="ID de meme inválido")
    try:
        return await eliminar_meme(meme_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Meme no encontrado.")
    except Exception:
        raise HTTPException(status_code=500, detail="Error al intentar eliminar el meme.")
