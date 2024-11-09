from bson import ObjectId
from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional

# Modelo Usuario
class Usuario(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    nombre: str
    email: str
    contraseña: str
    fecha_registro: date
    foto_perfil: Optional[str] = "jpg"
    rol: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Modelo Meme
class Meme(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    usuario_id: ObjectId
    fecha_subida: date
    formato: Optional[str] = None
    estado: bool

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Modelo Comentario
class Comentario(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    usuario_id: ObjectId
    meme_id: ObjectId
    fecha: Optional[date] = None
    contenido: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Modelo Etiqueta
class Etiqueta(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    nombre: Optional[str] = None
    meme_id: ObjectId

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Modelo Categoria
class Categoria(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    nombre: str = "Cualquiera"
    meme_id: ObjectId

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Modelo Voto
class Voto(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    usuario_id: ObjectId
    meme_id: ObjectId
    contador: int = 0

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
