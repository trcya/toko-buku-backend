const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// 1. Middleware CORS Standar
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Hardcoded Headers (TAMBAHAN UNTUK VERCEL)
// Ini memaksa header keluar meskipun ada masalah di preflight request
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Tangani metode OPTIONS (Preflight) secara langsung
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// --- KONFIGURASI DATABASE ---
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Zbz9aUuiM5fX@ep-jolly-forest-a12pk4ce-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

// Route Utama
app.get('/', (req, res) => {
  res.status(200).send('API Toko Buku Berhasil Berjalan! 🚀');
});

// [READ]
app.get('/buku', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buku ORDER BY judul ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [CREATE]
app.post('/buku', async (req, res) => {
  const { judul, penulis } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO buku (judul, penulis) VALUES ($1, $2) RETURNING *',
      [judul, penulis]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [UPDATE]
app.put('/buku/:id', async (req, res) => {
  const { id } = req.params;
  const { judul, penulis } = req.body;
  try {
    await pool.query('UPDATE buku SET judul = $1, penulis = $2 WHERE id = $3', [judul, penulis, id]);
    res.json({ message: "Berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [DELETE]
app.delete('/buku/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM buku WHERE id = $1', [req.params.id]);
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}