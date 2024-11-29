import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from fastapi import HTTPException

# Configuración del bucket S3
BUCKET_NAME = "memeologia"  # Reemplaza con el nombre de tu bucket
REGION = "sa-east-1"  # Cambia según la región de tu bucket

def upload_to_s3(file, filename):
    """
    Sube un archivo a AWS S3 y devuelve la URL pública.
    """
    # Inicializar cliente de S3
    try:
        s3 = boto3.client('s3')
        print(f"Conectado a S3 en la región {REGION}")
    except Exception as e:
        print("Error al inicializar el cliente de S3:", e)
        raise HTTPException(status_code=500, detail="No se pudo inicializar el cliente de S3")

    try:
        # Subir el archivo al bucket
        print(f"Subiendo archivo al bucket '{BUCKET_NAME}' con nombre '{filename}'")
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            filename,
            ExtraArgs={"ContentType": "image/jpeg"}  # Cambiar ContentType según el archivo
        )
        # Generar URL del archivo subido
        url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{filename}"
        print("Archivo subido exitosamente:", url)
        return url
    except NoCredentialsError:
        print("Error: No se encontraron credenciales de AWS")
        raise HTTPException(status_code=500, detail="Error con las credenciales de AWS")
    except PartialCredentialsError as e:
        print("Error: Credenciales incompletas de AWS", e)
        raise HTTPException(status_code=500, detail="Credenciales incompletas de AWS")
    except Exception as e:
        print("Error inesperado al subir archivo a S3:", e)
        raise HTTPException(status_code=500, detail=f"Error al subir archivo a S3: {str(e)}")
