# Brilian.dev - Portfolio Website with CMS

A modern portfolio website built with HTML/CSS/JavaScript frontend and Node.js/Express backend with MySQL database. Features user authentication and a CMS for article management.

## Features

✨ **Frontend**

- Responsive portfolio website
- Modern authentication (Login/Register)
- Smooth animations and scroll effects
- Mobile-friendly design

🛠️ **CMS Dashboard**

- Create, read, update, delete articles
- Secure login-protected dashboard
- Article management interface

🔐 **Backend API**

- Express.js REST API
- MySQL database
- User authentication and registration
- CORS enabled for development

## Quick Start

### 1. Install Dependencies

```bash
npm install
cd Backend && npm install && cd ..
```

### 2. Setup Database

```bash
cd Backend
node setup-db.js
cd ..
```

### 3. Run Backend

```bash
cd Backend
npm start
# or npm run dev (with auto-reload)
```

### 4. Open Frontend

```bash
# Option 1: Open in browser
start index.html

# Option 2: Use local server
npm install -g http-server
http-server -p 8000
```

Visit `http://localhost:8000` or open `index.html` in your browser.

## Login Credentials

- **Username:** admin
- **Password:** admin123

## Project Structure

```
.
├── index.html              # Main portfolio page with auth
├── profil.html            # Profile page (not used)
├── script.js              # Frontend logic
├── style.css              # Styling
├── CMS/                   # CMS Dashboard
│   ├── index.html
│   ├── script.js
│   └── style.css
├── Backend/               # Node.js server
│   ├── script.js
│   ├── setup-db.js
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── config/db.js
│       ├── controller/authController.js
│       └── routes/authRoutes.js
└── docs/                  # Documentation
    ├── SETUP.md           # Detailed setup guide
    └── DEPLOYMENT.md      # Production deployment guide
```

## Technologies

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL 8
- **Styling:** Custom CSS with modern design
- **Authentication:** Session-based (sessionStorage)

## API Endpoints

```
POST   /api/auth/login           # Login user
POST   /api/auth/register        # Register new user
GET    /api/auth/users           # Get all users (dev only)
GET    /api/health               # Health check
```

## Environment Variables

**Frontend (.env)**

```
VITE_API_URL=http://localhost:5001
VITE_API_TIMEOUT=30000
```

**Backend (Backend/.env)**

```
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=profile_db
```

## Key Features

### Authentication System

- Secure login/register
- Password validation (min 6 characters)
- Username uniqueness check
- Session-based authentication

### CMS Dashboard

- Protected routes (require login)
- Create articles with title and content
- Edit existing articles
- Delete articles with confirmation
- Data persisted in localStorage

### Responsive Design

- Mobile-first approach
- Hamburger menu
- Smooth animations
- Accessible forms

## Common Commands

```bash
# Frontend
npm install                 # Install frontend dependencies
npm start                   # Not applicable (static files)

# Backend
cd Backend
npm install                 # Install backend dependencies
npm start                   # Start backend server
npm run dev                 # Start with auto-reload (nodemon)
node setup-db.js            # Initialize database

# Database
mysql -u root               # Connect to MySQL
node Backend/setup-db.js    # Setup database
```

## Troubleshooting

**Backend connection error?**

- Make sure backend is running: `npm start` in Backend folder
- Check if MySQL is running
- Verify .env configuration in Backend/

**Database error?**

- Run: `node Backend/setup-db.js`
- Check MySQL credentials in Backend/.env

**Login not working?**

- Ensure backend server is running
- Check browser console for errors
- Try default credentials: admin / admin123

## Documentation

- **Setup Guide:** See [docs/SETUP.md](docs/SETUP.md)
- **Deployment Guide:** See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Next Steps

1. ✅ Install dependencies
2. ✅ Setup database
3. ✅ Run backend server
4. ✅ Open frontend in browser
5. 🔄 Login with admin account
6. 🔄 Test CMS dashboard
7. 📝 Create articles
8. 🚀 Customize and deploy

## Author

Brilian Helfanindo Stevani

- Email: brilianhelfastev@gmail.com
- Education: Mahasiswa Teknologi Informatika

## Version

- Current: 1.0.0
- Last Updated: 2024

## License

ISC

---

For detailed setup and deployment instructions, see the [docs](docs/) folder.
