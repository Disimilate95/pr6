const jwt = require('jsonwebtoken');

// Основная проверка авторизации (токен)
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;   // { id, role }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Неверный или истёкший токен' });
    }
};

// Проверка роли (можно передавать несколько ролей)
const roleCheck = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Доступ запрещён. Недостаточно прав.' 
            });
        }
        next();
    };
};

module.exports = { auth, roleCheck };