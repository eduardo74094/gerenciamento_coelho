
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
app.use("/front_end", express.static(frontendDir));

app.use((req, res, next) => {
  console.log('REQ', req.method, req.url);
  next();
});

app.get('/health', (req, res) => res.json({ok: true}));
rotas(app);

const PORT = process.env.PORT || 3000;


const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})











