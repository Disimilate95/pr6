
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB подключен успешно');
    } catch (error) {
        console.error(' Ошибка MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;  