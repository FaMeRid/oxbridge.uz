const express = require('express');
const router = express.Router();

const { 
  saveTestResult, 
  getUserTestResults 
} = require('../controllers/testResultController');

const authMiddleware = require('../middleware/auth');

// Сохранение результата
router.post('/save', authMiddleware, saveTestResult);

// Получение результатов текущего пользователя
router.get('/my-results', authMiddleware, getUserTestResults);

module.exports = router;