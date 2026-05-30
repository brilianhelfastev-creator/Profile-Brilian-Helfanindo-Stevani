// ============================================
// Database Connection Test Utility
// ============================================
// Gunakan: node db-test.js
// Untuk test koneksi database tanpa menjalankan server

require("dotenv").config();
const mysql = require("mysql2/promise");

console.log("🔍 Testing Database Connection...\n");
console.log("Configuration:");
console.log(`  Host: ${process.env.DB_HOST || "localhost"}`);
console.log(`  Port: ${process.env.DB_PORT || 3306}`);
console.log(`  User: ${process.env.DB_USER || "root"}`);
console.log(`  Database: ${process.env.DB_NAME || "profile_db"}`);
console.log("");

const testConnection = async () => {
  try {
    console.log("⏳ Attempting connection...");

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "profile_db",

      connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
    });

    console.log("✓ Connection successful!");
    console.log("");

    // Test query
    console.log("⏳ Testing query...");
    const [rows] = await connection.query("SELECT * FROM users LIMIT 1");
    console.log("✓ Query successful!");
    console.log(`  Users table exists and contains ${rows.length} records\n`);

    // Count users
    const [countResult] = await connection.query(
      "SELECT COUNT(*) as count FROM users",
    );
    console.log(`📊 Total users in database: ${countResult[0].count}\n`);

    // Show users (without passwords)
    const [allUsers] = await connection.query(
      "SELECT id, username, created_at FROM users",
    );
    console.log("👥 Registered users:");
    allUsers.forEach((user, index) => {
      console.log(
        `  ${index + 1}. ${user.username} (ID: ${user.id}, Created: ${user.created_at})`,
      );
    });

    connection.end();
    console.log("\n✅ All tests passed! Database is working correctly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error("Error:", error.message);
    console.error("");

    // Provide solutions based on error
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Solution: Check username and password in Backend/.env");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("Solution: Database does not exist");
      console.error("  Run: node setup-db.js");
    } else if (error.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Solution: Database server is not running");
      console.error("  Make sure MySQL is running");
    } else if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.error("Solution: Cannot reach database host");
      console.error(`  Check host: ${process.env.DB_HOST || "localhost"}`);
      console.error(`  Check port: ${process.env.DB_PORT || 3306}`);
    } else if (error.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
      console.error("Solution: Connection lost - database may be offline");
      console.error("  Make sure MySQL server is running");
    }

    console.error("\n📝 Common issues and solutions:");
    console.error("1. Database not running");
    console.error("   - Start MySQL server");
    console.error("");
    console.error("2. Wrong credentials");
    console.error("   - Check Backend/.env");
    console.error("   - Verify DB_USER and DB_PASSWORD");
    console.error("");
    console.error("3. Database not created");
    console.error("   - Run: node setup-db.js");
    console.error("");
    console.error("4. Wrong host/port");
    console.error("   - Local: DB_HOST=localhost");
    console.error("   - Remote: DB_HOST=your-database-host.com");

    process.exit(1);
  }
};

testConnection();
