from validation.validations import  (

    verificar_contraseña,
    verificar_usuario_existente,
    validar_usuario,
    validar_correo,
    validar_contraseña
)
from config.database_nosql import pwd_context
from datetime import datetime
from sqlalchemy.orm import Session
from models.models_sql import  Usuario


def crear_usuario(db: Session, nombre: str, email: str, contraseña: str):
    # Realiza las validaciones
    verificar_usuario_existente(db, email)
    validar_usuario(nombre)
    validar_correo( email)
    validar_contraseña(contraseña)
    # Hashear la contraseña antes de almacenarla
    hashed_contraseña = pwd_context.hash(contraseña)
    fecha_registro= datetime.now().date()

    # Crear nuevo usuario
    nuevo_usuario = Usuario(nombre=nombre, email=email, contraseña=hashed_contraseña, fecha_registro=fecha_registro)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

def login_usuario(db: Session, email: str, contraseña: str):
    # Buscar al usuario por correo
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    
    # Si el usuario no existe o la contraseña es incorrecta
    if usuario is None or not verificar_contraseña(usuario.contraseña, contraseña):
        return None  # O lanzar un error de autenticación
    return {"message": "Login exitoso", "id": usuario.usuario_id}


