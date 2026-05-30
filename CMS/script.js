// ============================================
// CMS DASHBOARD - ARTIKEL MANAGEMENT
// ============================================

// Proteksi halaman: cek apakah user sudah login
if (sessionStorage.getItem("isLoggedIn") !== "true") {
  // Jika belum login, arahkan ke halaman index.html
  window.location.href = "../index.html";
}

// ============================================
// Data & Elements
// ============================================
const STORAGE_KEY = "CMS_ARTIKEL_APP";
let database = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const form = document.getElementById("formArtikel");
const wadah = document.getElementById("wadahArtikel");

// ============================================
// Validasi Form
// ============================================
/**
 * Validasi data artikel sebelum disimpan
 * @param {Object} data - Object dengan property judul dan konten
 * @returns {Boolean} - True jika valid, False jika ada error
 */
function validasi(data) {
  let lulus = true;
  document.querySelectorAll(".pesan-error").forEach((e) => (e.innerText = ""));

  if (!data.judul || data.judul.trim() === "") {
    document.getElementById("errorJudul").innerText =
      "Judul tidak boleh kosong!";
    lulus = false;
  }
  if (!data.konten || data.konten.trim() === "") {
    document.getElementById("errorKonten").innerText =
      "Konten artikel masih kosong!";
    lulus = false;
  }

  return lulus;
}

// ============================================
// Display & Render Data
// ============================================
/**
 * Render/tampilkan semua artikel di halaman
 */
function renderAplikasi() {
  wadah.innerHTML = "";

  if (database.length === 0) {
    wadah.innerHTML =
      '<p style="color: #94a3b8; grid-column: 1/-1; text-align: center; padding: 40px;">Belum ada artikel. Silakan tambahkan artikel baru di atas.</p>';
    return;
  }

  // Tampilkan artikel dari yang terbaru
  database.reverse().forEach((item) => {
    const kartu = document.createElement("div");
    kartu.className = "kartu";

    // Format tanggal dari ID (timestamp)
    const date = new Date(item.id).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    kartu.innerHTML = `
            <span class="badge">Artikel</span>
            <span class="date-badge">${date}</span>
            <h4>${item.judul}</h4>
            <p>${item.konten.substring(0, 100)}${item.konten.length > 100 ? "..." : ""}</p>
            <div class="aksi-kartu">
                <button onclick="siapkanUpdate('${item.id}')" class="btn-edit">Edit</button>
                <button onclick="hapusData('${item.id}')" class="btn-hapus">Hapus</button>
            </div>
        `;
    wadah.appendChild(kartu);
  });
  database.reverse(); // Kembalikan urutan untuk logic lainnya
}

// ============================================
// CRUD Operations
// ============================================
/**
 * Simpan artikel baru atau update artikel existing
 */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("artikelId").value;
  const payload = {
    judul: document.getElementById("judul").value.trim(),
    konten: document.getElementById("konten").value.trim(),
  };

  // Validasi sebelum simpan
  if (!validasi(payload)) return;

  if (id) {
    // Update artikel existing
    const index = database.findIndex((a) => a.id == id);
    if (index > -1) {
      database[index] = { id, ...payload };
    }
  } else {
    // Tambah artikel baru
    const dataBaru = { id: +new Date(), ...payload };
    database.push(dataBaru);
  }

  // Simpan ke localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  resetFormulir();
  renderAplikasi();

  // Notifikasi ke user
  const successMsg = id
    ? "Artikel berhasil diupdate!"
    : "Artikel berhasil ditambahkan!";
  alert(successMsg);
});

/**
 * Hapus artikel berdasarkan ID
 * @param {String|Number} id - ID artikel yang akan dihapus
 */
window.hapusData = (id) => {
  if (confirm("Yakin ingin menghapus artikel ini?")) {
    database = database.filter((a) => a.id != id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    renderAplikasi();
  }
};

/**
 * Siapkan form untuk edit artikel
 * @param {String|Number} id - ID artikel yang akan diedit
 */
window.siapkanUpdate = (id) => {
  const data = database.find((a) => a.id == id);
  if (!data) {
    alert("Artikel tidak ditemukan!");
    return;
  }

  document.getElementById("artikelId").value = data.id;
  document.getElementById("judul").value = data.judul;
  document.getElementById("konten").value = data.konten;

  // Update label tombol
  document.getElementById("tombolSimpan").innerText = "Simpan Perubahan";
  document.getElementById("tombolBatal").style.display = "inline-block";

  // Scroll ke form
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Reset form ke state awal (untuk buat artikel baru)
 */
function resetFormulir() {
  form.reset();
  document.getElementById("artikelId").value = "";
  document.getElementById("tombolSimpan").innerText = "Simpan Artikel";
  document.getElementById("tombolBatal").style.display = "none";
}

// ============================================
// Event Listeners
// ============================================
document.getElementById("tombolBatal").addEventListener("click", resetFormulir);

/**
 * Logout dan kembali ke halaman login
 */
window.logoutAdmin = () => {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    // Hapus session data
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userInfo");

    // Redirect ke halaman awal
    window.location.href = "../index.html";
  }
};

// ============================================
// Initialization
// ============================================
// Jalankan render saat halaman dimuat
renderAplikasi();
