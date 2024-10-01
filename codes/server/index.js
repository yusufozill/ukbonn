const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // CORS middleware'ını içe aktar
const app = express();

app.use(cors()); // CORS middleware'ını kullan
app.use(express.json());

// MySQL bağlantısını oluştur
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password', // kendi şifreni gir
    database: 'wordsdb',  // kendi veritabanı adını gir
    port: 3306
});

// Veritabanına bağlan
db.connect(err => {
    if (err) {
        console.error('Veritabanı bağlantısı başarısız:', err.stack);
        return;
    }
    console.log('Veritabanına bağlanıldı.');
});

// Yeni kelime ekleme (POST)
app.post('/send', (req, res) => {
    const { word } = req.body;
    if (!word) {
        return res.status(400).send('Kelime gereklidir');
    }
    const sql = 'INSERT INTO words (word) VALUES (?)';
    db.query(sql, [word], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Kelime başarıyla eklendi');
    });
});

// Son 10 kelimeyi getirme (GET)
app.get('/get', (req, res) => {
    const sql = 'SELECT * FROM words ORDER BY id DESC LIMIT 10';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Kelime silme (DELETE)
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM words WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Kelime başarıyla silindi');
    });
});

// Sunucuyu başlat
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});