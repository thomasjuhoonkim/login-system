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

// authentication dependencies
const jwt = require("jsonwebtoken");

// greeting page dependencies
const path = require("path");

// environment variables
require("dotenv").config();
const sessionSecret = process.env.SESSION_SECRET;
const jwtSecret = process.env.JWT_SECRET;

const app = express();
const port = process.env.PORT || 5000;
const link = "https://login-system-1010.web.app";

app.use(express.json());
app.use(
  cors({
    origin: [link, "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookies: {
      expires: 60 * 5,
    },
  })
);

const db = mysql.createConnection({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// greeting page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/assets/index.html"));
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
      "INSERT INTO users (username, password) VALUES (?,?);",
      [username, hash],
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({ registered: false });
          return;
        }
        res.json({ registered: true, username: username });
      }
    );
  });
});

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.json({ auth: false, message: "No token provided." });
    return;
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.json({ auth: false, message: "Authentication failed." });
      return;
    }
    req.userId = decoded.id;
    next();
  });
};

// authentication
app.get("/auth", verifyJWT, (req, res) => {
  res.json({ auth: true, message: "Authentication successful." });
});

// check if logged in
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user[0].username });
  } else {
    res.json({ loggedIn: false });
  }
});

// login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
        return;
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (err, response) => {
          if (response) {
            req.session.user = result;

            // make jsonwebtoken on successful authorization
            const id = result[0].id;
            const token = jwt.sign({ id }, jwtSecret, {
              expiresIn: 60 * 5,
            });
            req.session.user = result;

            res.json({ auth: true, token: token, result: result });
            return;
          }
          res.send({
            auth: false,
            message: "Wrong username/password combination.",
          });
        });
        return;
      }
      res.send({ auth: false, message: "No user exists!" });
    }
  );
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
