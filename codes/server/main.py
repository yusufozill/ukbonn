from fastapi import FastAPI, HTTPException
from databases import Database
from sqlalchemy import create_engine, MetaData
from pydantic import BaseModel
from contextlib import asynccontextmanager
from models import users

DATABASE_URL = "mysql://root:Password@mysql/wordsdb"

database = Database(DATABASE_URL)

# Pydantic model for request validation
class UserIn(BaseModel):
    username: str
    email: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

# Database status check endpoint
@app.get("/status/")
async def check_database_status():
    try:
        await database.execute("SELECT 1")  # Basit bir sorgu
        return {"status": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Veri ekleme fonksiyonu
@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn):
    query = users.insert().values(username=user.username, email=user.email)
    last_record_id = await database.execute(query)
    
    return {**user.dict(), "id": last_record_id}

# Veri listeleme fonksiyonu
@app.get("/users/", response_model=list[UserOut])
async def list_users():
    query = users.select()
    return await database.fetch_all(query)
