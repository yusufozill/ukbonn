const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const axios = require('axios');

// MySQL bağlantı ayarları
const dbConfig = {
  host: 'mysql',
  user: 'root',
  password: 'Password',
  database: 'wordsdb'
};

// Express uygulamasını oluştur
const app = express();
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: 'http://localhost:8080', // Belirli bir kaynağa izin ver
  credentials: true
}));

// Veritabanı bağlantısını kontrol eden fonksiyon
async function getConnection() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}

// Hareket modeline benzeyen bir yapı
class Movement {
  constructor(id, prompt, date, sentence) {
    this.id = id;
    this.prompt = prompt;
    this.date = date;
    this.sentence = sentence;
  }
}

// Hareket ekle
app.post('/movements', async (req, res) => {
  const { prompt, sentence } = req.body;
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO movements (prompt, date, sentence) VALUES (?, ?, ?)', 
      [prompt, currentDate, sentence]
    );
    await connection.end();
    res.status(201).json(new Movement(result.insertId, prompt, currentDate, sentence));
  } catch (error) {
    console.error('Error while inserting movement:', error);
    res.status(500).send('Error while inserting movement.');
  }
});

// Hareketleri listele
app.get('/movements', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM movements');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error while fetching movements:', error);
    res.status(500).send('Error while fetching movements.');
  }
});

// Hareket sil
app.delete('/movements/:movement_id', async (req, res) => {
  const movementId = req.params.movement_id;

  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      'DELETE FROM movements WHERE id = ?', 
      [movementId]
    );
    await connection.end();

    if (result.affectedRows > 0) {
      res.send({ message: 'Movement deleted successfully.' });
    } else {
      res.status(404).send({ message: 'Movement not found.' });
    }
  } catch (error) {
    console.error('Error while deleting movement:', error);
    res.status(500).send('Error while deleting movement.');
  }
});

// Hareket güncelle
app.put('/movements/:movement_id', async (req, res) => {
  const movementId = req.params.movement_id;
  const { prompt, sentence } = req.body;
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      'UPDATE movements SET prompt = ?, date = ?, sentence = ? WHERE id = ?', 
      [prompt, currentDate, sentence, movementId]
    );
    await connection.end();

    if (result.affectedRows > 0) {
      res.json(new Movement(movementId, prompt, currentDate, sentence));
    } else {
      res.status(404).send({ message: 'Movement not found.' });
    }
  } catch (error) {
    console.error('Error while updating movement:', error);
    res.status(500).send('Error while updating movement.');
  }
});

// Ollama modeline istek yapma
async function callOllamaModel(prompt) {
  console.log(`Calling Ollama model with prompt: ${prompt}`);
  const url = 'http://localhost:11434/api/chat';
  const data = {
    model: "llama3.2",
    messages: [{ role: "user", content: prompt }],
    stream: false
  };

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`Received response with status code: ${response.status}`);
    return response.data.message.content; // Yanıtın message.content alanını döndür
  } catch (error) {
    console.error('Error while calling Ollama model:', error);
    throw new Error('Failed to get response from Ollama model.');
  }
}

// Ollama modeline chat isteği
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  console.log(`Received chat request with prompt: ${prompt}`);

  try {
    const responseMessage = await callOllamaModel(prompt);
    res.json({ prompt, sentence: responseMessage });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
