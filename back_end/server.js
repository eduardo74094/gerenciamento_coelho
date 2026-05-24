require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require("express");
const path = require('path');
const Database = require('./database');
const { rotas } = require("./controller/admin"); 
const cors = require('cors');

const app = express();

app.use(cors());

app.use(cookieParser(process.env.COOKIE_SECRET || 'gc-secret-dev'));

Database.conectar();

app.use(express.json());

app.use("/uploads", express.static("uploads"));

const frontendDir = path.join(__dirname, '..', 'front_end');

app.use(express.static(frontendDir));

app.use((req, res, next) => {
  console.log('REQ', req.method, req.url);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'html', 'login.html'));
});

app.get('/health', (req, res) => res.json({ ok: true }));

rotas(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor ligado!");
});