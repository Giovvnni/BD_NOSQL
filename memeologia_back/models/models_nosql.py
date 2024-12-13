from bson import ObjectId
from pydantic import BaseModel, Field, root_validator
from datetime import date, datetime
from typing import List, Optional


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
"""class Comentario(BaseModel):
    id: ObjectId = Field(alias="_id")  # Cambiamos a str para la serialización
    usuario_id: str  # Usamos str para representar ObjectId como string
    meme_id: str  # También representamos meme_id como string
    fecha: Optional[datetime] = None
    contenido: Optional[str] = None

    class Config:       
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}"""""

class Comentario(BaseModel):
    usuario_id: str
    meme_id: str
    fecha: datetime
    contenido: str

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
