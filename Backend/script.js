// ============================================
// BACKEND SERVER - Express Configuration (FIXED FOR RAILWAY)
// ============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const db = require("./src/config/db"); // Jalur config database yang benar

const app = express();
// MEMPERBAIKI SYNTAX PORT YANG KOSONG
const PORT = process.env.PORT || 5001;

// ============================================
// Middleware & CORS Dynamic
// ============================================
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://127.0.0.1:5500", "http://localhost:5500"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes
// ============================================
app.use("/api/auth", authRoutes);

// Tambahan: Tambahkan endpoint dummy/route artikel jika CMS-mu butuh rute /api/articles
// Jika kamu punya rute artikel asli di folder routes, silakan panggil di sini.
// Ini ditambahkan agar CMS saat fetch data /api/articles tidak error 404.
app.get("/api/articles", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM articles ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("Gagal mengambil artikel:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data dari database cloud" });
  }
});

app.post("/api/articles", async (req, res) => {
  const { judul, konten } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO articles (judul, konten) VALUES (?, ?)",
      [judul, konten],
    );
    res.status(201).json({ id: result.insertId, judul, konten });
  } catch (error) {
    console.error("Gagal menyimpan artikel:", error);
    res.status(500).json({ message: "Gagal menyimpan data ke database cloud" });
  }
});

app.put("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { judul, konten } = req.body;
  try {
    await db.query("UPDATE articles SET judul = ?, konten = ? WHERE id = ?", [
      judul,
      konten,
      id,
    ]);
    res.json({ message: "Artikel berhasil di-update" });
  } catch (error) {
    console.error("Gagal update artikel:", error);
    res.status(500).json({ message: "Gagal update data" });
  }
});

app.delete("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM articles WHERE id = ?", [id]);
    res.json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus artikel:", error);
    res.status(500).json({ message: "Gagal menghapus data" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend server is running on Railway" });
});

// Database connection test endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 as test");
    res.json({
      status: "ok",
      message: "Database connection successful to Aiven Cloud",
      database: process.env.DB_NAME,
    });
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ============================================
// Server Startup
// ============================================
const startServer = async () => {
  try {
    let connected = false;
    let attempts = 0;
    const maxAttempts = parseInt(process.env.DB_RETRY_ATTEMPTS) || 3;
    const retryDelay = parseInt(process.env.DB_RETRY_DELAY) || 1000;

    console.log("📝 Starting backend server...\n");

    while (!connected && attempts < maxAttempts) {
      try {
        console.log(
          `🔄 Database connection attempt ${attempts + 1}/${maxAttempts}...`,
        );
        const [rows] = await db.query("SELECT 1 as test");
        console.log("✓ Database connected successfully to Aiven Cloud");
        connected = true;
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          console.warn(
            `⚠️ Connection attempt ${attempts} failed, retrying in ${retryDelay}ms...`,
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          throw error;
        }
      }
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`\n✓ Backend server berjalan di port: ${PORT}`);
      console.log(
        `✓ Database: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`,
      );
      console.log(`🔧 Environment: ${process.env.NODE_ENV || "production"}`);
      console.log(`📍 API Health Check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:");
    console.error("Error:", error.message);
    process.exit(1);
  }
};

startServer();
