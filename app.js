const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Setting up the database connection
const conetion = mysql.createConnection({
  host: "localhost",
  database: "PARCIAL_2",
  user: "root",
  password: "dockerMauro123",
});

// Routes to get all the clients
app.get("/api/clients", (req, res) => {
  conetion.query("SELECT * FROM CLIENTS", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

// Routes to post
app.post(
  "/api/clients",
  // Here you pass a callback as a parameter where you will pass the body of the query and the result of said query.
  (req, res) => {
    const data = req.body;
    conetion.query(
      "SELECT id FROM CLIENTS WHERE email = ?",
      [data.email],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        // Validation if a record is already found!
        if (results.length > 0) {
          return res
            .status(400)
            .json({ message: `El usuario con ID ${results[0].id} ya existe!` });
        }

        conetion.query("INSERT INTO CLIENTS SET ?", data, (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res
            .status(201)
            .json({ message: "CLIENT ADDED", id: results.insertId });
        });
      }
    );
  }
);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
