const express = require('express');
const { Pool } = require('pg'); // Panggil library Postgres
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Konfigurasi koneksi ke pgAdmin
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'toko_buku',
  password: '040309', 
  port: 5432,
});

// [READ] Ambil data dari Postgres
app.get('/buku', async (req, res) => {
  const result = await pool.query('SELECT * FROM buku');
  res.json(result.rows);
});

// [CREATE] Simpan ke Postgres
app.post('/buku', async (req, res) => {
  const { judul, penulis } = req.body;
  const result = await pool.query(
    'INSERT INTO buku (judul, penulis) VALUES ($1, $2) RETURNING *',
    [judul, penulis]
  );
  res.json(result.rows[0]);
});

app.listen(3000, () => console.log("Server jalan di port 3000 dan terkoneksi ke Postgres"));