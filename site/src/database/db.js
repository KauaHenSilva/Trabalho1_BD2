const orientjs = require('orientjs');
require('dotenv').config();

// Conectando ao OrientDB
const server = orientjs({
  host: process.env.NAME_DB || 'localhost',
  port: process.env.DB_PORT || 2424,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
});

var db = server.create({
    name:    'ola',
    type:    'graph',
    storage: 'plocal',
    username: "admin",
    password: "admin"
  }
).then(
  (create) => console.log('Created Database:', create.name)
).catch(
  (e) => console.log('Error:', e.name)
);

db = server.use('ola');

module.exports = db;

// db.select('balance')
// .from('Cliente')
// .where({
//   userName: "jonasCesar"
// })
// .limit(1)
// .one().then((result) => {
//   console.log(result)
// });


// console.log("Ola:", search)

// // Exemplo de consulta
// async function queryData() {
//   try {
//     const result = await db.query('SELECT FROM Cliente');
//     console.log(result);
//   } catch (error) {
//     console.error('Erro ao consultar dados:', error.name);
//   }
// }

// db.create("VERTEX", "Cliente").set(
//   {
//     userName: 'Jonas',
//     birthDate: '23/04/2005'
//   }
// ).one().then(
//   (player) => {
//     console.log("Created Vertex:" + player.userName)
//   }
// )

// db.update("Cliente").set(
//   {
//     balance: 123
//   }
// ).where('userName = "jonasCesar"').one().then(
//   (player) => {
//     console.log("Created Vertex:" + player.userName)
//   }
// );

// var results = db.select().from('Cliente')
//    .containsText({
//     userName: 'Jonas'
//    }).all()
//    .then(
//       function(select){
//         console.log('Found Players:');
//         // for (const key in select) {
//         //   console.log(key)
//         //   console.log(key.userName)
//         // }
//         for (const key of select) {
//           console.log(key)
//         }
//       }
//    );
// console.log(results)
// console.log("Resultado:" + results)

// queryData();

