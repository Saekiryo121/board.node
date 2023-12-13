const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "RyoArata0213",
  database: "express_db",
});

app.get("/", (req, res) => {
  con.query("SELECT * FROM board ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error('MySQLクエリエラー: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render("index", { threads: results });
    }
  });
});

app.get("/new-thread", (req, res) => {
  res.render("new-thread");
});

app.get('/edit/:id', (req, res) => {
  const threadId = req.params.id;

  con.query('SELECT * FROM board WHERE id = ?', [threadId], (err, results) => {
    if (err) {
      console.error('MySQLクエリエラー: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      const thread = results[0];
      if (!thread) {
        res.status(404).send('Thread not found');
      } else {
        res.render('edit-thread', { thread });
      }
    }
  });
});

app.post('/edit/:id', (req, res) => {
  const threadId = req.params.id;
  const newName = req.body.name;
  const newUserName = req.body.userName;
  const newContent = req.body.content;

  con.query(
    'UPDATE board SET name = ?, userName = ?, content = ? WHERE id = ?',
    [newName, newUserName, newContent, threadId],
    (err, results) => {
      if (err) {
        console.error('MySQLクエリエラー: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/');
      }
    }
  );
});


app.post("/create-thread", (req, res) => {
  const threadTitle = req.body.threadTitle;
  const content = req.body.content;
  const username = req.body.username;

  con.query(
    "INSERT INTO threads (title, content, username) VALUES (?, ?, ?)",
    [threadTitle, content, username],
    (err, results) => {
      if (err) {
        console.error('MySQLクエリエラー: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect("/");
      }
    }
  );
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.get('/register-success', (req, res) => {
  const username = req.query.username;
  res.render('newuser-success', { username });
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
