const dotenv = require('dotenv');

// Do khi thực hiện code, có file .cursorignore disable file .env nên không thực hiện load biến môi trường
// Tạm thời khi thực hiện test sẽ sử dụng thêm load path, mong ae thông cảm (toi đã thử tìm cursorignore nhưng không thấy TvT)
const path = require('path');

// Load environment variables from a specific path
dotenv.config({ path: path.resolve(__dirname, '../../configs/.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};