from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from databases import Database
from sqlalchemy import Table, Column, Integer, String, Date, text, Text, MetaData, Boolean, create_engine
from contextlib import asynccontextmanager
from typing import List, Optional
from datetime import date, datetime
from fastapi.responses import JSONResponse



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
    allow_origins=["http://localhost:8080"],  # Sadece belirli bir kaynağa izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Veritabanı URL'si
DATABASE_URL = "mysql://root:Password@mysql/wordsdb?charset=utf8mb4"
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


# Kelime model sınıfları
class WordIn(BaseModel):
    word: str
    translation: str
    part_of_speech: str
    article: str
    gender: str
    example: str
    learned_date: str  # YYYY-MM-DD formatında tarih

class WordOut(WordIn):
    id: int
    review_count: int = 0
    last_reviewed: Optional[str] = None
    mastered: bool = False

# Kelime tablosunu tanımla
words = Table(
    "learned_words",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("user_id", Integer, default=1),
    Column("word", String, nullable=False),
    Column("translation", String, nullable=False),
    Column("language", String, default='de'),
    Column("part_of_speech", String),
    Column("article", String),
    Column("gender", String),
    Column("example", Text),
    Column("learned_date", Date),
    Column("review_count", Integer, default=0),
    Column("last_reviewed", Date),
    Column("mastered", Boolean, default=False),
)

# Kelimeleri listele
@app.get("/words/", response_model=List[WordOut])
async def list_words():
    query = words.select()
    results = await database.fetch_all(query)
    
    # Tarih alanlarını string'e çevir
    words_list = [
        {
            **word,
            "learned_date": str(word["learned_date"]) if word["learned_date"] else None,
            "last_reviewed": str(word["last_reviewed"]) if word["last_reviewed"] else None
        }
        for word in results
    ]
    return JSONResponse(content=words_list, media_type="application/json; charset=utf-8")


# Kelime sil
@app.delete("/words/{word_id}")
async def delete_word(word_id: int):
    query = words.delete().where(words.c.id == word_id)
    result = await database.execute(query)
    if result:
        return {"message": "Word deleted successfully."}
    raise HTTPException(status_code=404, detail="Word not found")

# Kelime ekle
@app.post("/words/", response_model=WordOut)
async def add_word(word: WordIn):
    query = words.insert().values(**word.dict())
    word_id = await database.execute(query)
    return {**word.dict(), "id": word_id, "review_count": 0, "last_reviewed": None, "mastered": False}

# Kelime güncelle
@app.put("/words/{word_id}", response_model=WordOut)
async def update_word(word_id: int, mastered: bool):
    # Güncellenen alanlar: review_count, last_reviewed, mastered
    current_date = datetime.now().date()  # Güncel tarih
    query = words.update().where(words.c.id == word_id).values(
        review_count=words.c.review_count + 1,   # review_count'u bir arttır
        last_reviewed=current_date,              # last_reviewed'u bugüne ayarla
        mastered=mastered                        # mastered'i verilen parametreye göre güncelle
    )
    
    result = await database.execute(query)
    if result:
        # Güncellenmiş kelimeyi veritabanından getir
        updated_word_query = words.select().where(words.c.id == word_id)
        updated_word = await database.fetch_one(updated_word_query)
        
        # Tarih alanlarını string'e çevir
        return {
            **updated_word,
            "learned_date": str(updated_word["learned_date"]) if updated_word["learned_date"] else None,
            "last_reviewed": str(updated_word["last_reviewed"]) if updated_word["last_reviewed"] else None,
        }
    
    raise HTTPException(status_code=404, detail="Word not found")


@app.get("/search/{which}/{word}")
async def get_words(which: str, word: str):
    which = which.lower()
    word = word.lower()
    if which not in ["der","die","das"]:
        which = which.capitalize()
    
    url = "https://der-artikel.de/${which}/${word}.html"  # İstek yapılacak URL
    try:

        response = requests.get(url)      # GET isteği yapılıyor

        if response.status_code == 200:    # Yanıt başarılıysa (200 OK)
            page = response.text # Yanıt içeriğini yazdır
            body = page.split("<!-- About -->")[1].split("<!-- Services -->")[0]
            return body
        else:
            return "Word not found"
    except Exception as e:
        return "Error is : " + str(e)


@app.get("/artikel/{word}")
async def search_artikel(word):
    async def check_url(url):
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                return response.status == 200

    word = str(word).lower()
    special_cases = {"t-shirt": "das", "u-bahn": "die"}
    if word in special_cases:
        return special_cases[word]
    
    word = word.capitalize()
    urls = [
        (f'https://der-artikel.de/der/{word}.html', "der"),
        (f'https://der-artikel.de/die/{word}.html', "die"),
        (f'https://der-artikel.de/das/{word}.html', "das")
    ]
    
    async with aiohttp.ClientSession() as session:
        tasks = [check_url(url) for url, _ in urls]
        results = await asyncio.gather(*tasks)

    for i, success in enumerate(results):
        if success:
            return urls[i][1]
    
    word_without_umlaut = word.lower().translate(str.maketrans("äöüß", "aous"))
    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://www.qmez.de:8444/v1/scanner/es/s?w={word_without_umlaut}") as response:
            if response.status == 200:
                result = await response.json()
                return result.get("article", f"Substantiv »{word}« wurde nicht gefunden.")
    
    return f"Substantiv »{word}« wurde nicht gefunden."



# FastAPI asenkron execute rotası
@app.get("/execute")

async def execute_query(command: str):
    try:
        # DELETE komutu içerip içermediğini kontrol et
        if command.strip().upper().startswith("DELETE"):
            # Silme işlemini çalıştır ve etkilenen satır sayısını al
            result = await database.execute(text(command))
            
            if result == 0:
                # Hiçbir satır silinmediyse hata döndür
                raise HTTPException(status_code=404, detail={"error": "No rows deleted. Check the condition."})
            
            return JSONResponse(content={"message": f"{result} row(s) deleted."}, media_type="application/json; charset=utf-8")
        
        else:
            # Diğer SQL komutları için fetch_all kullan
            result = await database.fetch_all(text(command))
            # Tarih alanlarını string'e çevirerek JSON formatına çevir
            results_list = [
                {key: str(value) if isinstance(value, date) else value for key, value in dict(row).items()}
                for row in result
            ]
            return JSONResponse(content=results_list, media_type="application/json; charset=utf-8")
    
    except SQLAlchemyError as e:
        raise HTTPException(status_code=400, detail={"error": str(e.orig)})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": str(e)})
    



# Users tablosunu tanımla
users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("user", Text, nullable=False),
    Column("date", Date, nullable=False),
    Column("mail", Text, nullable=False)
)

# User model sınıfları
class UserIn(BaseModel):
    user: str
    mail: str

class UserOut(UserIn):
    id: int
    date: str



# Kullanıcı ekle
@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn):
    current_date = datetime.now().date()  # Güncel tarih
    query = users.insert().values(user=user.user, date=current_date, mail=user.mail)
    user_id = await database.execute(query)
    return {**user.dict(), "id": user_id, "date": str(current_date)}

# Kullanıcıları listele
@app.get("/users/", response_model=List[UserOut])
async def list_users():
    query = users.select()
    results = await database.fetch_all(query)
    
    # Tarih alanını string formatına çevir
    users_list = [
        {
            **user,
            "date": str(user["date"]) if user["date"] else None
        }
        for user in results
    ]
    return JSONResponse(content=users_list, media_type="application/json; charset=utf-8")

# Kullanıcı sil
@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    query = users.delete().where(users.c.id == user_id)
    result = await database.execute(query)
    if result:
        return {"message": "User deleted successfully."}
    raise HTTPException(status_code=404, detail="User not found")
