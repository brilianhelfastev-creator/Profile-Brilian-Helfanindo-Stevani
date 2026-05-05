// login.js

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorBox = document.getElementById('errorBox');

    // Data dummy untuk login
    const DUMMY_USER = "admin";
    const DUMMY_PASS = "admin123";

    if (username === DUMMY_USER && password === DUMMY_PASS) {
        // Set status login di localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        
        // Redirect ke CMS
        window.location.href = 'CMS/index.html';
    } else {
        // Tampilkan pesan error
        errorBox.style.display = 'block';
        
        // Reset input password
        document.getElementById('password').value = '';
    }
});

// Cek jika sudah login, langsung arahkan ke CMS
if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'CMS/index.html';
}
