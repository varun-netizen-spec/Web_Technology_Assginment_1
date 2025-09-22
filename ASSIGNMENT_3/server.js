const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
  )
`);

// Route: Homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Route: Handle form submission
app.post("/register", async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query("INSERT INTO students (name, email) VALUES ($1, $2)", [name, email]);
    res.redirect("/students");
  } catch (err) {
    res.send("Error: " + err);
  }
});

// Route: Display all students
app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
    let html = "<h1>Registered Students</h1><table border='1'><tr><th>ID</th><th>Name</th><th>Email</th></tr>";
    result.rows.forEach(student => {
      html += `<tr><td>${student.id}</td><td>${student.name}</td><td>${student.email}</td></tr>`;
    });
    html += "</table><br><a href='/'>Go Back</a>";
    res.send(html);
  } catch (err) {
    res.send("Error: " + err);
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
