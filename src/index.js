const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'toko_buku',
  password: '040309',
  port: 5432,
});

// Cek koneksi ke PostgreSQL
pool.connect((err) => {
  if (err) console.error('❌ Gagal koneksi database:', err.stack);
  else console.log('✅ Berhasil terhubung ke database PostgreSQL');
});

// [READ] Ambil semua buku - Diurutkan berdasarkan Judul (A-Z)
app.get('/buku', async (req, res) => {
  try {
    // ORDER BY judul ASC membuat daftar buku urut sesuai abjad
    const result = await pool.query('SELECT * FROM buku ORDER BY judul ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [CREATE] Tambah buku dengan Validasi
app.post('/buku', async (req, res) => {
  try {
    const { judul, penulis } = req.body;

    // Validasi: Jangan izinkan input kosong
    if (!judul || !penulis) {
      return res.status(400).json({ error: "Judul dan Penulis tidak boleh kosong!" });
    }

    const result = await pool.query(
      'INSERT INTO buku (judul, penulis) VALUES ($1, $2) RETURNING *',
      [judul, penulis]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [UPDATE] Edit buku berdasarkan ID
app.put('/buku/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, penulis } = req.body;

    // Validasi input edit
    if (!judul || !penulis) {
      return res.status(400).json({ error: "Judul dan Penulis baru tidak boleh kosong!" });
    }
    
    const result = await pool.query(
      'UPDATE buku SET judul = $1, penulis = $2 WHERE id = $3',
      [judul, penulis, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    
    res.json({ message: "Berhasil diperbarui" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// [DELETE] Hapus buku
app.delete('/buku/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query(
      'DELETE FROM buku WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    console.error("Error delete:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('🚀 Server berjalan di http://localhost:3000'));