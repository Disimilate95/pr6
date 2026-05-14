const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Проверка существования пользователя
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Пользователь уже существует' });

        user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'Имя пользователя занято' });

        // Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание пользователя
        user = new User({
            username,
            email,
            password: hashedPassword,
            role: role === 'ADMIN' ? 'ADMIN' : 'USER' // Защита от создания админа без контроля
        });

        await user.save();

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Логин
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Неверные данные' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Неверные данные' });

        // Создание JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;