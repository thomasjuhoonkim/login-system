const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const mysql = require("mysql");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "thomas1010",
  database: "LoginSystem",
});

// register
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");

  db.query(
    "INSERT INTO users (username, password) VALUES (?,?)",
    [username, passwordHash],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, passwordHash],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send({ message: "Wrong username/password combination." });
        }
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
