// dependencies
const mysql = require("mysql2");

//define db connnection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ucfbootcamp1",
  database: "employees"
});

connection.connect(function(err) {
  if (err) throw err;
});
module.exports = connection;