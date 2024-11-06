const express = require('express')
const server = express()
const port = 3000

const db = require('./database/db')

server.use(express.static("public"))
server.use(express.urlencoded({ extended:true }))

const nunjucks = require('nunjucks')
nunjucks.configure(
  "src/views",{
    express: server,
    noCache: true
  }
)

let dados = {
  nomeUsuario: '',
  saldo: 0,
};

server.get('/', (req, res) => {
  // Serve o arquivo HTML
  return res.render("index.htm",{
    titulo: 'Home Principal'
  })
});

server.get('/create-account', (req, res) => {
  // Serve o arquivo HTML
  return res.render("create-account.htm",{
    title: 'Home Principal'
  })
});

server.get('/send-money', (req, res) => {
  // Serve o arquivo HTML
  return res.render("send-money.htm",{
    title: 'Home Principal'
  })
});

server.post('/send', async (req, res) => {
  try {
    const cliente = await db.select('balance')
      .from('Cliente')
      .containsText({ userName: req.body.userSend })
      .one();

    if (!cliente) {
      return res.status(404).send('Cliente não encontrado');
    }

    const novoBalance = cliente.balance + parseFloat(req.body.valueSend);

    const player = await db.update('Cliente')
      .set({ balance: novoBalance })
      .where(`userName = "${req.body.userSend}"`)
      .one();

    console.log("Updated Player:", player);
    
  } catch (error) {
    console.log("Erro ao processar a requisição:", error);
    return res.status(500).send("Erro ao atualizar o balance");
  }

  try {

    const novoBalance = dados.saldo - parseFloat(req.body.valueSend);

    const player = await db.update('Cliente')
      .set({ balance: novoBalance })
      .where(`userName = "${dados.nomeUsuario}"`)
      .one();

    console.log("Updated Player:", player);
    
  } catch (error) {
    console.log("Erro ao processar a requisição:", error);
    return res.status(500).send("Erro ao atualizar o balance");
  }

  return res.render('index.htm');

});


server.post('/saveaccount', (req, res) => {
  console.log(req.body);

  // Verifica se já existe um usuário com o mesmo nome
  db.select()
    .from('Cliente')
    .where(`userName = "${req.body.userName}"`)
    .one()
    .then((existingUser) => {
      if (existingUser) {
        // Caso o nome de usuário já exista, retorna um erro
        return res.status(400).send('Erro: Nome de usuário já existe.');
      }

      // Se não encontrar um usuário com o mesmo nome, cria o novo usuário
      db.create('VERTEX', 'Cliente')
        .set({
          userName: req.body.userName,
          datebirth: req.body.datebirth,
          password: req.body.password,
          balance: 1000
        })
        .one()
        .then((result) => {
          console.log(result);
          return res.render('index.htm');
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).send('Erro ao criar a conta');
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send('Erro ao verificar o nome de usuário');
    });
});

server.get('/see-balance', (req, res) => {
  // Serve o arquivo HTML
  const search = dados.nomeUsuario;
  console.log(search)

  if (search == ""){
    return res.render("see-balance.htm",
      {found: 0}
    )
  }

  db.select().from('Cliente').where({
    userName: search
   }).limit(1)
   .one().then(
    (info) => {
      const found = 1;
      console.log(info)
      console.log(found)
      return res.render("see-balance.htm",{
        informacao:info, found
      })
    }
  )
  
});

server.listen(port)