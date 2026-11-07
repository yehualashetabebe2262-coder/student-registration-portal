const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "university",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL database successfully!");
});

// GET: Fetch all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ message: "Error fetching students" });
    }
    res.json(results);
  });
});

// POST: Add a new student
app.post("/students", (req, res) => {
  const { name, age, phone } = req.body;
  const query = "INSERT INTO students (name, age, phone) VALUES (?, ?, ?)";

  db.execute(query, [name, Number(age), phone], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res
        .status(500)
        .json({ message: "Error saving student: " + err.message });
    }
    res.status(201).json({ message: "Student registered successfully!" });
  });
});

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Use backticks here
});
