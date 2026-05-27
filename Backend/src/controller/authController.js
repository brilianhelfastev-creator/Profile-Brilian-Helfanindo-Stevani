const db = require("../config/db"); // Mengambil koneksi database MySQL kamu

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validasi apakah inputan kosong
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi!",
      });
    }

    // 2. Cari username di tabel 'users'
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    // Jika username tidak ditemukan di database
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Username tidak ditemukan!" });
    }

    const user = rows[0];

    // 3. Cocokkan password teks biasa
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Password salah!" });
    }

    // 4. Jika username & password cocok, kirim respon sukses
    res.json({
      success: true,
      message: "Login berhasil!",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // 1. Validasi inputan
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Username, password, dan konfirmasi password wajib diisi!",
      });
    }

    // 2. Validasi panjang password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter!",
      });
    }

    // 3. Validasi password cocok
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password dan konfirmasi password tidak cocok!",
      });
    }

    // 4. Check apakah username sudah ada
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username sudah terdaftar!",
      });
    }

    // 5. Simpan user baru ke database
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      password,
    ]);

    res.status(201).json({
      success: true,
      message: "Akun berhasil dibuat! Silakan login.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, username FROM users");
    res.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
