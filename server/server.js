import express from "express";
import cors from "cors";
import pg from "pg";
const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
const { Pool } = pg;
const port = 3000;

app.use(cors());
app.use(express.json());

// PostgreSQL client setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Documentaries",
  password: "Moomin2612",
  port: 5432,
});

// API endpoint to search movies
app.get("/api/movies", async (req, res) => {
  try {
    const { title } = req.query;
    const result = await pool.query(
      "SELECT * FROM docos where name ilike ($1)",
      [`%${title}%`]
    );
    res.json(result.rows);
    console.log(title);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
