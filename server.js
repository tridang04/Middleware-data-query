const express = require('express');
const bodyParser = require('body-parser');
const mainRoutes = require('./routes/mainRoutes');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json()); // Middleware xử lý body JSON
app.use(express.urlencoded({ extended: true })); // Middleware xử lý body dạng URL-encoded


app.use(cors({
    origin: 'http://localhost:3000', // Chỉ định origin của client
    credentials: true, // Cho phép gửi thông tin xác thực (cookies, tokens...)
}));
// Sử dụng các route chính
app.use('/', mainRoutes);

// Lắng nghe cổng
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});
