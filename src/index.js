const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- KONFIGURASI DATABASE CLOUD (NEON.TECH) ---
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Zbz9aUuiM5fX@ep-jolly-forest-a12pk4ce-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test koneksi database saat startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database gagal terhubung:', err.message);
  } else {
    console.log('✅ Database Neon terhubung!');
  }
});

// Route Utama (Landing Page API)
app.get('/', (req, res) => {
  res.status(200).send('API Toko Buku Berhasil Berjalan! 🚀');
});

// [READ] Ambil semua buku
app.get('/buku', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buku ORDER BY judul ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data: " + err.message });
  }
});

// [CREATE] Tambah buku
app.post('/buku', async (req, res) => {
  const { judul, penulis } = req.body;
  if (!judul || !penulis) {
    return res.status(400).json({ error: "Judul dan Penulis wajib diisi!" });
  }
  try {
    const result = await pool.query(
      'INSERT INTO buku (judul, penulis) VALUES ($1, $2) RETURNING *',
      [judul, penulis]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Gagal menambah data: " + err.message });
  }
});

// [UPDATE] Edit buku
app.put('/buku/:id', async (req, res) => {
  const { id } = req.params;
  const { judul, penulis } = req.body;
  try {
    const result = await pool.query(
      'UPDATE buku SET judul = $1, penulis = $2 WHERE id = $3',
      [judul, penulis, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.json({ message: "Berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: "Gagal update data: " + err.message });
  }
});

// [DELETE] Hapus buku
app.delete('/buku/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM buku WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus data: " + err.message });
  }
});

// Export untuk Vercel
module.exports = app;

// Jalankan server jika di Local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
}