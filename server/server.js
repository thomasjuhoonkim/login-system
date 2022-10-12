// server dependencies
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// session dependencies
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// hashing dependencies
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: "abcdefghijklmnopqrstuvwxyz",
    resave: false,
    saveUninitialized: false,
    cookies: {
      expires: 60 * 60 * 24,
    },
  })
);

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

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  });
});

// check if logged in
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (err, response) => {
            if (response) {
              req.session.user = result;
              res.send(result);
            } else {
              res.send({ message: "Wrong username/password combination!" });
            }
          });
        } else {
          res.send({ message: "User doesn't exist!" });
        }
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
