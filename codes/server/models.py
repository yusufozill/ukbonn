from sqlalchemy import Table, Column, Integer, Text, Date, MetaData
from pydantic import BaseModel
from datetime import date

metadata = MetaData()
words = Table(
    "words",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("de", Text, nullable=False),
    Column("en", Text, nullable=False),
    Column("tr", Text, nullable=False),
    Column("sentence", Text, nullable=False),
    Column("hardness", Integer, nullable=False),
    Column("date", Date, nullable=False)
)

class WordIn(BaseModel):
    de: str
    en: str
    tr: str
    sentence: str
    hardness: int
    date: date

class WordOut(WordIn):
    id: int

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