import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
const { Pool } = pg;
const port = 3000;
dotenv.config();
app.use(cors());
app.use(express.json());

// PostgreSQL client setup
const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.db_port,
});

const connectionString = process.env.DATABASE_URL;

// API endpoint to search movies
app.get("/api/movies", async (req, res) => {
  try {
    const { title } = req.query;
    const result = await pool.query(
      "SELECT * FROM docos where name ilike ($1)",
      [`%${title}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/random", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM docos ");
    const randomIndex = Math.floor(Math.random() * result.rows.length);
    const randomMovie = result.rows[randomIndex];
    res.json(randomMovie);
    console.log(randomMovie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
