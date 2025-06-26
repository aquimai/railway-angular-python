"""
FastAPI Backend Template for Railway
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import redis
import psycopg2
from psycopg2.extras import RealDictCursor
import uvicorn

# Configuração da aplicação
app = FastAPI(
    title="Railway Full Stack API",
    description="Template de API completa para Railway",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure conforme necessário
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL")

# Conexões
def get_db_connection():
    """Conecta ao PostgreSQL"""
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na conexão com banco: {str(e)}")

def get_redis_connection():
    """Conecta ao Redis"""
    try:
        r = redis.from_url(REDIS_URL)
        return r
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na conexão com Redis: {str(e)}")

# Rotas

@app.get("/")
async def root():
    """Rota principal"""
    return {
        "message": "Railway Full Stack Template API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check com verificação de serviços"""
    status = {"api": "online"}
    
    # Testa PostgreSQL
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        status["database"] = "online"
    except Exception as e:
        status["database"] = f"offline: {str(e)}"
    
    # Testa Redis
    try:
        r = get_redis_connection()
        r.ping()
        status["redis"] = "online"
    except Exception as e:
        status["redis"] = f"offline: {str(e)}"
    
    return status

@app.get("/api/users")
async def get_users():
    """Exemplo de rota com banco de dados"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Cria tabela se não existir
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insere usuário exemplo se tabela vazia
        cursor.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()['count']
        
        if count == 0:
            cursor.execute("""
                INSERT INTO users (name, email) VALUES 
                ('Usuario Exemplo', 'exemplo@email.com')
            """)
        
        # Busca usuários
        cursor.execute("SELECT * FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {"users": users}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cache/{key}")
async def set_cache(key: str, value: dict):
    """Exemplo de rota com Redis"""
    try:
        r = get_redis_connection()
        r.setex(key, 3600, str(value))  # Expira em 1 hora
        return {"message": f"Cache definido para {key}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cache/{key}")
async def get_cache(key: str):
    """Busca valor no cache"""
    try:
        r = get_redis_connection()
        value = r.get(key)
        if value:
            return {"key": key, "value": value.decode()}
        else:
            raise HTTPException(status_code=404, detail="Chave não encontrada")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)