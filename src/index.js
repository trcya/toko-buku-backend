const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Database (Sesuai gambar image_82b5f1.png)
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

// [READ] Ambil semua buku
app.get('/buku', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buku ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [DELETE] Hapus buku (Perbaikan rute :id agar tidak 404)
app.delete('/buku/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id); // 🔥 PENTING

    console.log("ID yang diterima:", id, typeof id);

    const result = await pool.query(
      'DELETE FROM buku WHERE id = $1',
      [id]
    );

    console.log("Row deleted:", result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    console.error("Error delete:", err);
    res.status(500).json({ error: err.message });
  }
});


// [CREATE] Tambah buku
app.post('/buku', async (req, res) => {
  try {
    const { judul, penulis } = req.body;
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

app.listen(3000, () => console.log('🚀 Server berjalan di http://localhost:3000'));