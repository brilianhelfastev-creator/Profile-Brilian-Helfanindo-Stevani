const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const db = require('./src/config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rute Auth
app.use('/api/auth', authRoutes);

// Server
const PORT = process.env.PORT || 5001;

// Test koneksi database
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✓ Database connected!');
    connection.release();
    
    app.listen(PORT, () => {
      console.log(`✓ Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
})();
