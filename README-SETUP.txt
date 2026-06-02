=====================================
INSTRUKSI MENJALANKAN PROJECT
=====================================

Untuk Development (Lokal):

OPSI 1 - MANUAL (Paling Kontrol):
================================
1. Buka 2 Terminal/PowerShell
2. Terminal 1:
   cd Backend
   node script.js
   
3. Terminal 2:
   Buka index.html di VS Code
   Klik "Go Live" (Live Server extension)

Browser akan buka: http://localhost:5500
Backend running di: http://localhost:5001


OPSI 2 - QUICK START (.bat):
=============================
Double-click file: quick-start.bat
- Akan membuka backend di terminal baru otomatis
- Kemudian ikuti instruksi di layar


OPSI 3 - HANYA BACKEND (.bat):
===============================
Double-click file: start-backend.bat
- Backend akan running
- Buka index.html di VS Code
- Klik "Go Live" untuk frontend


TEST LOGIN:
===========
Username: admin
Password: admin123

Jika berhasil → akan redirect ke halaman dashboard/CMS


REQUIREMENTS:
=============
✓ Node.js (install dari https://nodejs.org/)
✓ MySQL (sudah terinstall)
✓ VS Code + Live Server Extension


FOLDER PENTING:
===============
- Backend/           → Kode server Node.js
- index.html         → Form login frontend
- script.js          → Koneksi ke backend
- profile_db.sql     → Database schema


TROUBLESHOOTING:
================
Error: "listen EADDRINUSE"
→ Ada proses Node lain di port 5001
→ Solusi: Buka Task Manager, kill semua node.exe, coba lagi

Error: "Database connection failed"
→ MySQL tidak running
→ Solusi: Buka Services (services.msc), start MySQL

Error: "CORS error" di browser console
→ Backend tidak running
→ Solusi: Jalankan start-backend.bat terlebih dahulu


PRODUCTION DEPLOYMENT:
======================
Nanti saat mau deploy:
1. Backend → Railway / Heroku
2. Frontend → GitHub Pages
3. Database → Aiven Cloud MySQL

=====================================
Happy Coding! 🚀
=====================================
