
const cookieParser = require('cookie-parser');
const express = require("express");
const path = require('path');
const Database = require('./database');
const { rotas } = require("./controller/admin"); 

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET || 'gc-secret-dev'));

Database.conectar(
);


app.use(express.json());


const frontendDir = path.join(__dirname, '..', 'front_end');

app.use(express.static(frontendDir));
app.get('/teste', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'index.html'));
});
app.get('/', (req, res) => {
  res.redirect('/html/index.html');
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front_end', 'html', 'index.html'));
});
app.use((req, res, next) => {
  console.log('REQ', req.method, req.url);
  next();
});

app.get('/health', (req, res) => res.json({ok: true}));
rotas(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor ligado!");
});












