// ============================================
// LOGIN SYSTEM & AUTHENTICATION (CONNECTED TO RAILWAY)
// ============================================

// URL BACKEND RAILWAY KAMU
const API_URL =
  "https://profile-brilian-helfanindo-stevani-production.up.railway.app";

// Fungsi async untuk login ke backend Railway
const loginKeBackend = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message:
        "Gagal terhubung ke server cloud. Pastikan server backend online.",
    };
  }
};

// Fungsi async untuk register ke backend Railway
const registerKeBackend = async (username, password, confirmPassword) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, confirmPassword }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message:
        "Gagal terhubung ke server cloud. Pastikan server backend online.",
    };
  }
};

// Fungsi untuk menampilkan pesan login/register
const showAuthMessage = (elementId, message, isError = true) => {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `login-message ${isError ? "error" : "success"}`;
  }
};

// Toggle antara Login dan Register dengan smooth transition
const toggleAuthForms = () => {
  const loginWrapper = document.getElementById("loginForm-wrapper");
  const registerWrapper = document.getElementById("registerForm-wrapper");
  const toggleToRegister = document.getElementById("toggleToRegister");
  const toggleToLogin = document.getElementById("toggleToLogin");

  if (toggleToRegister) {
    toggleToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginWrapper.style.opacity = "0";
      loginWrapper.style.transform = "translateY(20px)";

      setTimeout(() => {
        loginWrapper.style.display = "none";
        registerWrapper.style.display = "block";
        registerWrapper.style.opacity = "0";
        registerWrapper.style.transform = "translateY(20px)";

        setTimeout(() => {
          registerWrapper.style.opacity = "1";
          registerWrapper.style.transform = "translateY(0)";
        }, 10);

        document.getElementById("registerForm").reset();
        document.getElementById("registerMessage").textContent = "";
      }, 300);
    });
  }

  if (toggleToLogin) {
    toggleToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerWrapper.style.opacity = "0";
      registerWrapper.style.transform = "translateY(20px)";

      setTimeout(() => {
        registerWrapper.style.display = "none";
        loginWrapper.style.display = "block";
        loginWrapper.style.opacity = "0";
        loginWrapper.style.transform = "translateY(20px)";

        setTimeout(() => {
          loginWrapper.style.opacity = "1";
          loginWrapper.style.transform = "translateY(0)";
        }, 10);

        document.getElementById("loginForm").reset();
        document.getElementById("loginMessage").textContent = "";
      }, 300);
    });
  }

  loginWrapper.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
  registerWrapper.style.transition =
    "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
};

// Setup login form handler
const setupLoginForm = () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
      showAuthMessage(
        "loginMessage",
        "Username dan password harus diisi!",
        true,
      );
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "Sedang masuk...";

    const result = await loginKeBackend(username, password);

    if (result.success) {
      showAuthMessage(
        "loginMessage",
        "Login berhasil! Memuat halaman...",
        false,
      );
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userInfo", JSON.stringify(result.user));

      setTimeout(() => {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("main-wrapper").style.display = "block";

        revealOnScroll();
        muatArtikel();
      }, 500);
    } else {
      showAuthMessage("loginMessage", result.message || "Login gagal!", true);
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
      document.getElementById("login-password").value = "";
    }
  });
};

// Setup register form handler
const setupRegisterForm = () => {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const confirmPassword = document
      .getElementById("register-confirm")
      .value.trim();

    if (!username || !password || !confirmPassword) {
      showAuthMessage("registerMessage", "Semua field harus diisi!", true);
      return;
    }

    if (password.length < 6) {
      showAuthMessage("registerMessage", "Password minimal 6 karakter!", true);
      return;
    }

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "Sedang daftar...";

    const result = await registerKeBackend(username, password, confirmPassword);

    if (result.success) {
      showAuthMessage(
        "registerMessage",
        result.message || "Pendaftaran sukses!",
        false,
      );
      registerForm.reset();

      setTimeout(() => {
        document.getElementById("registerForm-wrapper").style.display = "none";
        document.getElementById("loginForm-wrapper").style.display = "block";
        document.getElementById("login-username").focus();
      }, 2000);
    } else {
      showAuthMessage(
        "registerMessage",
        result.message || "Pendaftaran gagal!",
        true,
      );
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }
  });
};

// Setup logout button
const setupLogoutBtn = () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Yakin ingin logout?")) {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("userInfo");
        location.reload();
      }
    });
  }
};

// Cek status login saat page load
const checkLoginStatus = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("main-wrapper").style.display = "block";
  } else {
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("main-wrapper").style.display = "none";
  }
};

// ============================================
// MAIN PAGE FUNCTIONALITY
// ============================================

// Mobile menu toggle
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

if (hamburger && menu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      menu.classList.remove("active");
    });
  });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Header scroll effect
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.style.padding = "0.5rem 0";
    header.style.background = "rgba(15, 23, 42, 0.95)";
    header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
  } else {
    header.style.padding = "1.2rem 0";
    header.style.background = "rgba(15, 23, 42, 0.8)";
    header.style.boxShadow = "none";
  }
});

// Simple Scroll Reveal Animation
const revealElements = document.querySelectorAll(
  ".section, .profile-card, .skill-card, .project-showcase",
);

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  revealElements.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerBottom) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
};

revealElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "all 0.8s ease-out";
});

window.addEventListener("scroll", revealOnScroll);

// Form Submission Mockup
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalText = submitBtn.innerText;

    submitBtn.innerText = "Mengirim...";
    submitBtn.disabled = true;

    setTimeout(() => {
      alert(
        "Pesan Anda telah berhasil terkirim! Terima kasih telah menghubungi saya.",
      );
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
      contactForm.reset();
    }, 1500);
  });
}

// Active link highlighting on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// Load articles from Backend (Database Cloud Aiven)
const muatArtikel = async () => {
  const container = document.getElementById("daftarArtikelProfil");
  if (!container) return;

  try {
    container.innerHTML =
      '<div style="color: #94a3b8; text-align: center; padding: 20px;"><p>Memuat artikel dari server...</p></div>';

    const response = await fetch(`${API_URL}/api/articles`);
    const data = await response.json();

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="no-articles-msg">
          <p>Belum ada artikel yang dipublikasikan.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    // Tampilkan maksimal 6 artikel terbaru
    const displayData = data.slice(0, 6);

    displayData.forEach((item) => {
      const card = document.createElement("div");
      card.className = "article-card";

      const tglMentah = item.created_at || item.id;
      const date = new Date(tglMentah).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      card.innerHTML = `
        <span class="date">${date}</span>
        <h3>${item.judul}</h3>
        <p>${item.konten}</p>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Gagal memuat artikel profil:", error);
    container.innerHTML =
      '<div style="color: #ef4444; text-align: center; padding: 20px;"><p>Gagal mengambil artikel dari database.</p></div>';
  }
};

// Initial calls
window.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  toggleAuthForms();
  setupLoginForm();
  setupRegisterForm();
  setupLogoutBtn();
  revealOnScroll();
  muatArtikel();
});
