from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Cargar las variables de entorno del archivo .env
load_dotenv()

# Obtener la URI de conexión de la variable de entorno
mongodb_uri = os.getenv("MONGODB_URI")

# Conectar a la base de datos
client = MongoClient(mongodb_uri)
db = client.memeologia_db
collection_name = db["crud_collection"]
