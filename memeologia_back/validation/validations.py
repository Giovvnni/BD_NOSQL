import re
from fastapi import HTTPException
from config.database_nosql import pwd_context
from config.database_sql import get_db
from models.models_sql import Usuario
from sqlalchemy.orm import Session


def verificar_usuario_existente(db: Session, email: str):
    """Verifica si un usuario con el correo dado ya existe en la base de datos."""
    usuario_existente = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Este email ya está en uso")

def validar_usuario(nombre: str):
    # Validar que el nombre no esté vacío
    if not nombre:
        raise HTTPException(status_code=400, detail="El nombre no puede estar vacío")
    
def validar_correo(email: str):
    # validar el formato del correo
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(patron, email):
        raise HTTPException(status_code=400, detail="El correo electrónico no tiene un formato válido")
    

# Función para validar la contraseña
def validar_contraseña(contraseña: str):
    if len(contraseña) < 8:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 8 caracteres")
    if not re.search("[A-Z]", contraseña):
        raise HTTPException(status_code=400, detail="La contraseña debe contener al menos una letra mayúscula")
    if not re.search("[0-9]", contraseña):
        raise HTTPException(status_code=400, detail="La contraseña debe contener al menos un número")
    

# Función para verificar la contraseña
def verificar_contraseña(hash_almacenado, contraseña_proporcionada):
    # Verificar si la contraseña proporcionada coincide con el hash almacenado
    return pwd_context.verify(contraseña_proporcionada, hash_almacenado)