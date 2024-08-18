const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../server/db');

const router = express.Router();

// Настройка хранения файлов (голосовых сообщений)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Маршрут для загрузки голосового сообщения
router.post('/upload', upload.single('voice'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const result = await pool.query(
      'INSERT INTO voice_messages (filename, created_at) VALUES ($1, NOW()) RETURNING id',
      [filePath]
    );

    const messageId = result.rows[0].id;

    // Уведомляем всех клиентов через WebSocket
    req.app.get('websocket').broadcast({ id: messageId, filePath });

    res.json({ success: true, messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Ошибка при сохранении файла.' });
  }
});

// Маршрут для получения списка всех голосовых сообщений
router.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, filename, created_at FROM voice_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Ошибка при получении сообщений.' });
  }
});

module.exports = router;
