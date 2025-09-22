const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",     // your postgres username
  host: "localhost",
  database: "student_db",
  password: "your_password",
  port: 5432,
});

module.exports = pool;
