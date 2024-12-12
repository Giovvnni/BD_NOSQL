from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, Date
from sqlalchemy.orm import relationship
from config.database_sql import Base

class Usuario(Base):
    __tablename__ = "usuario"
    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(20), nullable=False, unique=True)
    email = Column(String(255), nullable=False)  # Especificar longitud
    contraseña = Column(String(60), nullable=False)
    fecha_registro = Column(Date, nullable=False)
    foto_perfil = Column(String(255), default="jpg", nullable=False)  # Especificar longitud


