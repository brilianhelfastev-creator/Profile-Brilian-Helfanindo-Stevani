// script.js

const STORAGE_KEY = 'CMS_ARTIKEL_APP';
let database = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const form = document.getElementById('formArtikel');
const wadah = document.getElementById('wadahArtikel');

// Fungsi Validasi
function validasi(data) {
    let lulus = true;
    document.querySelectorAll('.pesan-error').forEach(e => e.innerText = "");

    if (!data.judul) { 
        document.getElementById('errorJudul').innerText = "Judul tidak boleh kosong!"; 
        lulus = false; 
    }
    if (!data.konten) { 
        document.getElementById('errorKonten').innerText = "Konten artikel masih kosong!"; 
        lulus = false; 
    }
    
    return lulus;
}

// Tampilkan Data (Read)
function renderAplikasi() {
    wadah.innerHTML = "";
    
    if (database.length === 0) {
        wadah.innerHTML = '<p style="color: #94a3b8; grid-column: 1/-1; text-align: center; padding: 40px;">Belum ada artikel. Silakan tambahkan artikel baru di atas.</p>';
        return;
    }

    database.forEach((item) => {
        const kartu = document.createElement('div');
        kartu.className = 'kartu';
        kartu.innerHTML = `
            <span class="badge">Artikel</span>
            <h4>${item.judul}</h4>
            <p>${item.konten.substring(0, 100)}${item.konten.length > 100 ? '...' : ''}</p>
            <div class="aksi-kartu">
                <button onclick="siapkanUpdate('${item.id}')" class="btn-edit">Edit</button>
                <button onclick="hapusData('${item.id}')" class="btn-hapus">Hapus</button>
            </div>
        `;
        wadah.appendChild(kartu);
    });
}

// Operasi Simpan (Create & Update)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('artikelId').value;
    const payload = {
        judul: document.getElementById('judul').value,
        konten: document.getElementById('konten').value
    };

    if (!validasi(payload)) return;

    if (id) {
        // Update
        const index = database.findIndex(a => a.id == id);
        database[index] = { id, ...payload };
    } else {
        // Create
        const dataBaru = { id: +new Date(), ...payload };
        database.push(dataBaru);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    resetFormulir();
    renderAplikasi();
});

// Operasi Delete
window.hapusData = (id) => {
    if(confirm('Yakin ingin menghapus artikel ini?')) {
        database = database.filter(a => a.id != id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
        renderAplikasi();
    }
};

// Fungsi Helper
window.siapkanUpdate = (id) => {
    const data = database.find(a => a.id == id);
    document.getElementById('artikelId').value = data.id;
    document.getElementById('judul').value = data.judul;
    document.getElementById('konten').value = data.konten;
    
    document.getElementById('tombolSimpan').innerText = "Simpan Perubahan";
    document.getElementById('tombolBatal').style.display = "inline-block";
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function resetFormulir() {
    form.reset();
    document.getElementById('artikelId').value = "";
    document.getElementById('tombolSimpan').innerText = "Simpan Artikel";
    document.getElementById('tombolBatal').style.display = "none";
}

document.getElementById('tombolBatal').addEventListener('click', resetFormulir);

// Jalankan saat pertama kali dibuka
renderAplikasi();