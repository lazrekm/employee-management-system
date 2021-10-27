// require('dotenv').config();

// const Sequelize = require('sequelize');

// const sequelize = process.env.JAWSDB_URL
//   ? new Sequelize(process.env.JAWSDB_URL)
//   : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
//       host: 'localhost',
//       dialect: 'mysql',
//       dialectOptions: {
//         decimalNumbers: true,
//       },
//     });

// module.exports = sequelize;

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ucfbootcamp1",
  database: "employees"
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
