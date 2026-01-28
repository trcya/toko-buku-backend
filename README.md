# ⚙️ Toko Buku API (Backend)

Sisi server dari aplikasi Toko Buku. Bertanggung jawab mengelola database PostgreSQL dan menyediakan RESTful API untuk dikonsumsi oleh client.

## 🛠️ Teknologi
- **Node.js** & **Express.js**: Web server dan routing.
- **PostgreSQL**: Database relasional.
- **pg (node-postgres)**: Database driver.
- **CORS**: Mengizinkan akses dari domain frontend yang berbeda.

## 🚀 API Endpoints
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/buku` | Mengambil daftar semua buku. |
| `POST` | `/buku` | Menambahkan buku baru. |
| `PUT` | `/buku/:id` | Mengupdate buku berdasarkan ID. |
| `DELETE` | `/buku/:id` | Menghapus buku berdasarkan ID. |



## ⚙️ Cara Instalasi
1. Clone repo: `git clone <url-repo-backend>`
2. Install library: `npm install`
3. Konfigurasi Database di `src/index.js`:
   ```javascript
   {
     user: 'postgres',
     password: 'your_password',
     database: 'toko_buku',
     port: 5432
   }
