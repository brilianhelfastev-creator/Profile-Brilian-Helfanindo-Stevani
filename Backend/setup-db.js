const mysql = require("mysql2/promise");

// Koneksi awal tanpa database
const initialConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Sesuaikan jika ada password
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fungsi untuk setup database
const setupDatabase = async () => {
  try {
    const connection = await initialConnection.getConnection();

    // Buat database jika belum ada
    await connection.query("CREATE DATABASE IF NOT EXISTS profile_db");
    console.log("✓ Database profile_db sudah siap");

    // Ganti ke database profile_db
    await connection.query("USE profile_db");

    // Buat tabel users jika belum ada
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      )
    `);
    console.log("✓ Tabel users sudah siap");

    // Check dan insert default user jika belum ada
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE username = "admin"',
    );
    if (rows.length === 0) {
      await connection.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        ["admin", "admin123"],
      );
      console.log("✓ User admin berhasil ditambahkan");
    } else {
      console.log("✓ User admin sudah ada");
    }

    connection.release();
    console.log("✓ Setup database selesai!\n");
    initialConnection.end();
  } catch (error) {
    console.error("✗ Setup database gagal:", error.message);
    process.exit(1);
  }
};

setupDatabase();
