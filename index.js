const express = require('express');
const app = express();
const connection = require('./database/connection');

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static("public"));
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
  connection.query("SELECT * FROM tarefa", (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
      return res.status(500).send("Erro no servidor");
    }
    res.render("index", { tarefas : results })
  })
});


app.get('/deletar/:id', (req, res) =>{
    let id = req.params.id
    connection.query('delete from tarefa where tarefa_id = ?', [id], (err, results) => {
        if (err) throw err
        res.redirect('/')
    })
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    let {titulo, descricao, data_criacao, data_finalizacao} = req.body
    connection.query('insert into tarefa(titulo, descricao, data_criacao, data_finalizacao) values (?,?,?,?)'
        , [titulo, descricao, data_criacao, data_finalizacao]
        , (err, result) => {
            if(err) throw err
            res.redirect('/')
        })

})

app.get('/edit/:id', (req, res)=> {
    let id = req.params.id;
    connection.query('select * from tarefa where tarefa_id = ?', [id], (err, results) => {
        if (err) {
          console.error("Erro ao buscar a tarefa:", err);
          return res.status(500).send("Erro no servidor");
        }

        if (results.length === 0) {
          return res.status(404).send("Tarefa não encontrada");
        }

        res.render('edit', { tarefa: results[0] });
    });

})

app.post('/edit/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let {titulo, descricao, data_criacao, data_finalizacao} = req.body
    connection.query(
      'update tarefa set titulo = ?, descricao = ?, data_criacao = ?, data_finalizacao = ? where tarefa_id = ?'
      , [titulo, descricao, data_criacao, data_finalizacao, id],
      (err, result) => {
        if (err) throw err;
        console.log("Tarefa atualizada com sucesso!");
        res.redirect('/');
      }
    );
});


app.listen(3007, () => {
  console.log("executando...");
});