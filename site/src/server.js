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

server.get('/login-account', (req, res) => {
  // Serve o arquivo HTML
  return res.render("login-account.htm",{
    title: 'Home Principal'
  })
});

server.get('/send-money', (req, res) => {
  // Serve o arquivo HTML
  return res.render("send-money.htm",{
    saldo: dados.saldo
  })
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
      return res.render("see-balance.htm",{
        informacao:info, found
      })
    }
  )
  
});

server.post('/send', async (req, res) => {
  console.log(dados)

  await db.select()
  .from('Cliente')
  .where({
    userName: req.body.userSend
  })
  .limit(1)
  .one()
  .then((result) => {
    if(result){
      novoBalance = result.balance + parseFloat(req.body.valueSend);
      console.log("Valor 1:", novoBalance);

      db.update('Cliente')
      .set({balance: novoBalance})
      .where({
        userName: req.body.userSend
      })
      .one();
    }
  }).catch((error) => {
    return res.status(404).send('Error:' + error);
  });

  novoBalance = dados.saldo - parseFloat(req.body.valueSend);

  await db.update('Cliente')
  .set({ 
    balance: novoBalance 
  })
  .where({
    userName: dados.nomeUsuario
  })
  .one()
  .then(()=>{
    dados.saldo = novoBalance;
  })
  .catch((error) => {
    console.log(error)
    return res.status(500).send("Erro ao atualizar o balance \n Error:" + error)
  });
  
  return res.render('index.htm');

});

server.post('/loginaccount', (req, res) => {
  console.log(req.body)

  db.select()
    .from('Cliente')
    .where(`userName = "${req.body.userName}"`)
    .one()
    .then((value) => {
      if(value.password == req.body.password){
        dados = {
          nomeUsuario: req.body.userName,
          saldo: value.balance
        }
        console.log('Login realizado com sucesso!')
        return res.render("index.htm");
      }else{
        return res.status(404).send("Semja incorreta")
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send('Usuario não encontrado');
    });
});

server.get('/saveaccount', (req, res) => {
  console.log(req.body);

  // Verifica se já existe um usuário com o mesmo nome
  db.select()
    .from('Cliente')
    .where(`userName = "${req.body.userName}"`)
    .one()
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).send('Erro: Nome de usuário já existe.');
      }

      // Se não encontrar um usuário com o mesmo nome, cria o novo 
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
          dados = {
            nomeUsuario: result.userName,
            saldo: result.balance
          };
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

server.listen(port)