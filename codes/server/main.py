import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from databases import Database
from sqlalchemy import Table, Column, Integer, String, Date, Text, MetaData
from contextlib import asynccontextmanager
from typing import List
from datetime import datetime

# FastAPI uygulaması
@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

# CORS middleware ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Veritabanı URL'si
DATABASE_URL = "mysql://root:Password@mysql/wordsdb"
database = Database(DATABASE_URL)

metadata = MetaData()

# movements tablosunu tanımla
movements = Table(
    "movements",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("prompt", Text, nullable=False),
    Column("date", Date, nullable=False),
    Column("sentence", Text, nullable=False)
)


# Movement model
class MovementIn(BaseModel):
    prompt: str
    sentence: str

class MovementOut(MovementIn):
    id: int

# Hareket ekle
@app.post("/movements/", response_model=MovementOut)
async def create_movement(movement: MovementIn):
    current_date = str(datetime.now().date())  # Tarihi sunucuda al
    query = movements.insert().values(prompt=movement.prompt, date=current_date, sentence=movement.sentence)
    last_record_id = await database.execute(query)
    return {**movement.dict(), "id": last_record_id, "date": str(current_date)}

# Hareketleri listele
@app.get("/movements/", response_model=List[MovementOut])
async def list_movements():
    query = movements.select()
    return await database.fetch_all(query)

# Hareket sil
@app.delete("/movements/{movement_id}")
async def delete_movement(movement_id: int):
    query = movements.delete().where(movements.c.id == movement_id)
    result = await database.execute(query)
    if result:
        return {"message": "Movement deleted successfully."}
    raise HTTPException(status_code=404, detail="Movement not found")

# Hareket güncelle
@app.put("/movements/{movement_id}", response_model=MovementOut)
async def update_movement(movement_id: int, movement: MovementIn):
    current_date = datetime.now().date()  # Güncel tarih
    query = movements.update().where(movements.c.id == movement_id).values(prompt=movement.prompt, date=current_date, sentence=movement.sentence)
    result = await database.execute(query)
    if result:
        return {**movement.dict(), "id": movement_id, "date": str(current_date)}
    raise HTTPException(status_code=404, detail="Movement not found")


class ChatRequest(BaseModel):
    prompt: str

async def call_ollama_model(prompt: str) -> str:
    # Burada Ollama modelinizi çağırmak için gerekli kodu ekleyin
    # Örneğin, modelden gelen yanıtı simüle etme
    await asyncio.sleep(5)  # Simüle edilen gecikme
    response_message = f"Model response for: {prompt}"  # Gerçek yanıtı burada alacaksınız
    return response_message

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Ollama modelini çağır ve sonucu al
        response_message = await call_ollama_model(request.prompt)

        return {
            "prompt": request.prompt,
            "sentence": response_message
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))