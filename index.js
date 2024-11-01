const express = require('express');
const csv = require('csv-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connection = require('./database/connection');

const app = express();
const upload = multer({ dest: 'upload/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  connection.query("SELECT * FROM tarefa", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      return res.status(500).send("Erro no servidor");
    }
    res.render("index", { tarefas: results });
  });
});

app.get('/deletar/:id', (req, res) => {
  let id = req.params.id;
  connection.query('DELETE FROM tarefa WHERE tarefa_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  let { titulo, descricao, data_criacao, data_finalizacao } = req.body;
  connection.query(
    'INSERT INTO tarefa (titulo, descricao, data_criacao, data_finalizacao) VALUES (?, ?, ?, ?)',
    [titulo, descricao, data_criacao, data_finalizacao],
    (err, result) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  let id = req.params.id;
  connection.query('SELECT * FROM tarefa WHERE tarefa_id = ?', [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar a tarefa:", err);
      return res.status(500).send("Erro no servidor");
    }

    if (results.length === 0) {
      return res.status(404).send("Tarefa não encontrada");
    }

    res.render('edit', { tarefa: results[0] });
  });
});

app.post('/edit/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let { titulo, descricao, data_criacao, data_finalizacao } = req.body;
  connection.query(
    'UPDATE tarefa SET titulo = ?, descricao = ?, data_criacao = ?, data_finalizacao = ? WHERE tarefa_id = ?',
    [titulo, descricao, data_criacao, data_finalizacao, id],
    (err, result) => {
      if (err) throw err;
      console.log("Tarefa atualizada com sucesso!");
      res.redirect('/');
    }
  );
});

app.post('/upload-csv', upload.single('file'), (req, res) => {
  const filepath = req.file.path;
  const results = [];

  fs.createReadStream(filepath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      fs.unlinkSync(filepath);

      const sql = 'INSERT INTO tarefa (titulo, descricao, data_criacao,data_finalizacao) VALUES ?';
      const values = results.map(item => [item.titulo, item.descricao, item.data_criacao,item.data_finalizacao]);

      connection.query(sql, [values], (err) => {
        if (err) throw err;
        res.redirect('/');
      });
    });
});

app.get('/upload-csv', (req, res) => {
  res.render('upload-csv');
});

app.listen(3007, () => {
  console.log("Servidor executando na porta 3007...");
});
