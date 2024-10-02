from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

# Kullanıcı tablosunu tanımla
users = Table(
    "users",  # Tablo adı
    metadata,  # MetaData nesnesi
    Column("id", Integer, primary_key=True, autoincrement=True),  # Birincil anahtar, otomatik artan
    Column("username", String(100)),  # Kullanıcı adı
    Column("email", String(100), unique=True),  # E-posta, benzersiz
)
