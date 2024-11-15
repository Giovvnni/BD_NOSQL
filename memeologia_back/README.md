1. **Crea y activa un entorno virtual**:

    python -m venv .\venv
    
    source venv/bin/activate  # En Windows usa `venv\Scripts\activate`

2. **Instala las dependencias:**:

    pip install -r requirements.txt

3. **Inicia el servidor**:

    uvicorn main:app --reload

4. **Abre el localhost:8000 en tu navegador para desplegar la documentacion de la API con Swagger UI:**

[http://localhost:8000/docs](http://localhost:8000/docs)


