require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ←←←←←←←←←← ИСПРАВЛЕНИЕ ЗДЕСЬ ←←←←←←←←←←
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
connectDB();   // ← должно работать теперь

// Маршруты
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('✅ Сервер работает!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});