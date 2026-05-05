// Mobile menu toggle
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

if (hamburger && menu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
  });

  // Close menu when clicking a link
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      menu.classList.remove("active");
    });
  });
}

// Smooth scrolling for navigation links
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

// Initial styles for reveal animation
revealElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "all 0.8s ease-out";
});

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // Trigger once on load

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

// Load articles from CMS (LocalStorage)
const muatArtikel = () => {
  const container = document.getElementById("daftarArtikelProfil");
  if (!container) return;

  const STORAGE_KEY = "CMS_ARTIKEL_APP";
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (data.length === 0) {
    container.innerHTML = `
      <div class="no-articles-msg">
        <p>Belum ada artikel yang dipublikasikan.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  // Tampilkan maksimal 6 artikel terbaru
  const displayData = data.slice().reverse().slice(0, 6);

  displayData.forEach((item) => {
    const card = document.createElement("div");
    card.className = "article-card";
    
    // Format tanggal jika ada (menggunakan ID sebagai timestamp jika tidak ada field tanggal)
    const date = new Date(item.id).toLocaleDateString("id-ID", {
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
};

// Initial calls
window.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  muatArtikel();
});
