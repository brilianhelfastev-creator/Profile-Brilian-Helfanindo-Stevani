// ============================================
// Database Setup Script
// ============================================
// Jalankan script ini sekali untuk setup database:
// node setup-db.js

require("dotenv").config();
const mysql = require("mysql2/promise");

// Koneksi awal tanpa database
const initialConnection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Setup database: buat database dan tabel jika belum ada
 */
const setupDatabase = async () => {
  try {
    const connection = await initialConnection.getConnection();
    console.log("📝 Memulai setup database...\n");

    // Buat database jika belum ada
    await connection.query(
      "CREATE DATABASE IF NOT EXISTS " + (process.env.DB_NAME || "profile_db"),
    );
    console.log(
      "✓ Database " + (process.env.DB_NAME || "profile_db") + " sudah siap",
    );

    // Ganti ke database yang baru dibuat
    await connection.query("USE " + (process.env.DB_NAME || "profile_db"));

    // Buat tabel users jika belum ada
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Tabel users sudah siap");

    // Add created_at column jika belum ada (untuk backward compatibility)
    try {
      await connection.query(`
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log("✓ Kolom created_at ditambahkan");
    } catch (error) {
      // Kolom sudah ada, tidak perlu tambah
      if (!error.message.includes("Duplicate column")) {
        console.warn(
          "⚠️ Warning: Could not add created_at column:",
          error.message,
        );
      }
    }

    // Check dan insert default user jika belum ada
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE username = "admin"',
    );
    if (rows.length === 0) {
      await connection.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        ["admin", "admin123"],
      );
      console.log(
        "✓ User admin berhasil ditambahkan (username: admin, password: admin123)",
      );
    } else {
      console.log("✓ User admin sudah ada");
    }

    connection.release();
    console.log("\n✓ Setup database selesai! Database siap digunakan.\n");
    initialConnection.end();
  } catch (error) {
    console.error("✗ Setup database gagal:", error.message);
    process.exit(1);
  }
};

// Jalankan setup
setupDatabase();
