from fastapi import FastAPI
from routes.routes import router  # Importar tus rutas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia "*" por el dominio específico en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas del proyecto
app.include_router(router)

# Endpoint básico para comprobar que el servidor está funcionando
@app.get("/")
def read_root():
    return {"message": "Bienvenido a Memeología API. El servidor está activo."}
