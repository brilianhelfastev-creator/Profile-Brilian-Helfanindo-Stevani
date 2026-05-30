// ============================================
// BACKEND SERVER - Express Configuration
// ============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const db = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5001;

// ============================================
// Middleware
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes
// ============================================
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend server is running" });
});

// Database connection test endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query("SELECT 1 as test");
    connection.release();
    res.json({
      status: "ok",
      message: "Database connection successful",
      database: process.env.DB_NAME,
    });
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Check server logs",
    });
  }
});

// ============================================
// Server Startup
// ============================================
const startServer = async () => {
  try {
    // Test database connection with retry logic
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
        const connection = await db.getConnection();
        console.log("✓ Database connected successfully");
        connection.release();
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

    if (!connected) {
      throw new Error("Failed to connect to database after multiple attempts");
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`\n✓ Backend server berjalan di http://localhost:${PORT}`);
      console.log(`✓ API endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
      console.log(`✓ DB test: http://localhost:${PORT}/api/db-test`);
      console.log(
        `\n📊 Database: ${process.env.DB_NAME} @ ${process.env.DB_HOST}`,
      );
      console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}\n`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:");
    console.error("Error:", error.message);
    console.error("\nDatabase Configuration:");
    console.error(`- Host: ${process.env.DB_HOST}`);
    console.error(`- User: ${process.env.DB_USER}`);
    console.error(`- Database: ${process.env.DB_NAME}`);
    console.error(`- Port: ${process.env.DB_PORT}`);
    console.error(
      "\nSolution: Make sure database is running and credentials are correct.",
    );
    console.error("Run: node setup-db.js (to setup database)");
    process.exit(1);
  }
};

startServer();
