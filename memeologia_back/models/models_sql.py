from typing import List
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from config.database_sql import Base, declarative_base


Base = declarative_base()
class Usuario(Base):
    __tablename__ = "usuario"
    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(20), nullable=False, unique=True)
    email = Column(String(255), nullable=False)  # Especificar longitud
    contraseña = Column(String(60), nullable=False)
    fecha_registro = Column(Date, nullable=False)
    foto_perfil = Column(String(255), default="jpg", nullable=False)  # Especificar longitud

class UsuarioCreate(BaseModel):
    nombre: str
    email: str 
    contraseña: str 

    class Config:
        orm_mode = True  # Esto es necesario para que Pydantic pueda trabajar con SQLAlchemy


class LoginRequest(BaseModel):
    email: str
    contraseña: str

class MemeOut(BaseModel):
    _id: str
    url_s3: str  # Asumiendo que cada meme tiene un campo 'url'

class UsuarioOut(BaseModel):
    nombre: str
    foto_perfil: str
    memes: List[MemeOut]  # Agrega una lista de memes
    




