const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 5000;

app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "LoginSystem",
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
