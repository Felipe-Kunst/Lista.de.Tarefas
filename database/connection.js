const mysql = require("mysql2");
const dotenv = require("dotenv").config();

const connection = mysql.createConnection({
  host: '',
  user: '',
  database: '',
  password:''
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados!");
});

module.exports = connection

