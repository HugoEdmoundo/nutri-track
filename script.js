// Data penyimpanan lokal
let grafikMakro = null;
let grafikKalori = null;
let riwayatKalori = JSON.parse(localStorage.getItem('riwayatKalori')) || [];
let targetGizi = JSON.parse(localStorage.getItem('targetGizi')) || {
    kalori: 2000,
    karbo: 250,
    protein: 150,
    lemak: 65
};

// Saran makanan
const saranMakanan = {
    seimbang: [
        { nama: "Salmon Panggang", kalori: 280, karbo: 5, protein: 34, lemak: 15, gambar: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2" },
        { nama: "Quinoa Bowl", kalori: 320, karbo: 45, protein: 12, lemak: 8, gambar: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" },
        { nama: "Alpukat & Telur", kalori: 250, karbo: 9, protein: 13, lemak: 18, gambar: "https://images.unsplash.com/photo-1551183053-bf91a1d81141" }
    ],
    rendahKarbo: [
        { nama: "Dada Ayam Panggang", kalori: 165, karbo: 0, protein: 31, lemak: 3.6, gambar: "https://images.unsplash.com/photo-1532550907401-a500c9a57435" },
        { nama: "Brokoli Kukus", kalori: 55, karbo: 11, protein: 4, lemak: 0.6, gambar: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c" },
        { nama: "Telur Rebus", kalori: 78, karbo: 0.6, protein: 6, lemak: 5, gambar: "https://images.unsplash.com/photo-1587486913049-53fc88980dfa" }
    ],
    tinggiProtein: [
        { nama: "Greek Yogurt", kalori: 100, karbo: 6, protein: 17, lemak: 0.7, gambar: "https://images.unsplash.com/photo-1550583724-b2692b85b150" },
        { nama: "Daging Sapi Tanpa Lemak", kalori: 250, karbo: 0, protein: 36, lemak: 12, gambar: "https://images.unsplash.com/photo-1600891964092-4316c288032e" },
        { nama: "Tahu Panggang", kalori: 144, karbo: 5, protein: 15, lemak: 9, gambar: "https://images.unsplash.com/photo-1604977046806-87d5c7d1b931" }
    ]
};

// Hitung makronutrien
function hitungMakro() {
    const karbo = parseFloat(document.getElementById('input-karbo').value) || 0;
    const protein = parseFloat(document.getElementById('input-protein').value) || 0;
    const lemak = parseFloat(document.getElementById('input-lemak').value) || 0;
    
    const kaloriKarbo = karbo * 4;
    const kaloriProtein = protein * 4;
    const kaloriLemak = lemak * 9;
    const totalKalori = kaloriKarbo + kaloriProtein + kaloriLemak;
    
    if (totalKalori === 0) {
        alert('Masukin dulu nilai gizinya!');
        return;
    }
    
    const persenKarbo = (kaloriKarbo / totalKalori) * 100;
    const persenProtein = (kaloriProtein / totalKalori) * 100;
    const persenLemak = (kaloriLemak / totalKalori) * 100;
    
    const rekomendasi = {
        karbo: { min: 45, max: 65 },
        protein: { min: 10, max: 35 },
        lemak: { min: 20, max: 35 }
    };
    
    // Cek status
    const cekStatus = (nilai, min, max) => {
        if (nilai < min) return { teks: "Kurang", kelas: "badge-kuning" };
        if (nilai > max) return { teks: "Kebanyakan", kelas: "badge-kuning" };
        return { teks: "Pas", kelas: "badge-ijo" };
    };
    
    const statusKarbo = cekStatus(persenKarbo, rekomendasi.karbo.min, rekomendasi.karbo.max);
    const statusProtein = cekStatus(persenProtein, rekomendasi.protein.min, rekomendasi.protein.max);
    const statusLemak = cekStatus(persenLemak, rekomendasi.lemak.min, rekomendasi.lemak.max);
    
    // Tampilkan hasil
    document.getElementById('isi-hasil-makro').innerHTML = `
        <div class="col-md-3 mb-3">
            <div class="p-3 bg-light rounded">
                <div class="fw-bold">Total Kalori</div>
                <div class="h4">${totalKalori.toFixed(0)} <small class="fs-6">kkal</small></div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="p-3 bg-light rounded">
                <div class="fw-bold">Karbo</div>
                <div class="h4">${persenKarbo.toFixed(1)}% <span class="fs-6">${statusKarbo.teks}</span></div>
                <span class="${statusKarbo.kelas} badge">${rekomendasi.karbo.min}-${rekomendasi.karbo.max}% ideal</span>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="p-3 bg-light rounded">
                <div class="fw-bold">Protein</div>
                <div class="h4">${persenProtein.toFixed(1)}% <span class="fs-6">${statusProtein.teks}</span></div>
                <span class="${statusProtein.kelas} badge">${rekomendasi.protein.min}-${rekomendasi.protein.max}% ideal</span>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="p-3 bg-light rounded">
                <div class="fw-bold">Lemak</div>
                <div class="h4">${persenLemak.toFixed(1)}% <span class="fs-6">${statusLemak.teks}</span></div>
                <span class="${statusLemak.kelas} badge">${rekomendasi.lemak.min}-${rekomendasi.lemak.max}% ideal</span>
            </div>
        </div>
    `;
    
    document.getElementById('hasil-makro').classList.remove('sembunyi');
    updateGrafikMakro([persenKarbo, persenProtein, persenLemak]);
    tampilkanSaranMakanan(persenKarbo, persenProtein, persenLemak);
    
    // Simpan data
    localStorage.setItem('asupanTerakhir', JSON.stringify({
        karbo, protein, lemak, kalori: totalKalori
    }));
    
    // Update progress di tab target
    if (document.getElementById('tab-target').classList.contains('aktif')) {
        updateProgressTarget();
    }
}

// Tampilkan saran makanan
function tampilkanSaranMakanan(persenKarbo, persenProtein, persenLemak) {
    let saran = [];
    const gridSaran = document.getElementById('saran-makanan');
    gridSaran.innerHTML = '';
    
    if (persenKarbo < 45) {
        saran = [...saranMakanan.seimbang, ...saranMakanan.rendahKarbo];
    } else if (persenProtein < 15) {
        saran = [...saranMakanan.tinggiProtein, ...saranMakanan.seimbang];
    } else {
        saran = saranMakanan.seimbang;
    }
    
    // Hanya tampilkan 3 saran
    saran.slice(0, 3).forEach(makanan => {
        gridSaran.innerHTML += `
            <div class="col-md-4">
                <div class="card-saran card h-100">
                    <div class="gambar-saran card-img-top" style="background-image: url('${makanan.gambar}')"></div>
                    <div class="card-body">
                        <h5 class="card-title">${makanan.nama}</h5>
                        <div class="d-flex justify-content-between text-muted small">
                            <span>${makanan.kalori} kkal</span>
                            <span>C:${makanan.karbo}g P:${makanan.protein}g F:${makanan.lemak}g</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Update grafik makro
function updateGrafikMakro(persen) {
    const ctx = document.getElementById('grafik-makro').getContext('2d');
    if (grafikMakro) grafikMakro.destroy();
    
    grafikMakro = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Karbo', 'Protein', 'Lemak'],
            datasets: [{
                data: persen,
                backgroundColor: ['#3498db', '#2ecc71', '#f39c12'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw.toFixed(1)}%`
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Hitung kalori
function hitungKalori() {
    const umur = parseInt(document.getElementById('input-umur').value) || 0;
    const berat = parseFloat(document.getElementById('input-berat').value) || 0;
    const tinggi = parseFloat(document.getElementById('input-tinggi').value) || 0;
    const jenisKelamin = document.getElementById('select-jenis-kelamin').value;
    const aktivitas = document.getElementById('select-aktivitas').value;
    const asupanKalori = parseFloat(document.getElementById('input-kalori').value) || 0;
    const target = document.getElementById('select-target').value;
    
    if (umur < 10 || umur > 100 || berat < 30 || tinggi < 100) {
        alert('Masukin data yang bener dong!');
        return;
    }
    
    // Hitung BMR (Basal Metabolic Rate)
    let bmr = (jenisKelamin === 'cowo') 
        ? 10 * berat + 6.25 * tinggi - 5 * umur + 5 
        : 10 * berat + 6.25 * tinggi - 5 * umur - 161;
    
    // Hitung TDEE (Total Daily Energy Expenditure)
    const faktorAktivitas = {
        malas: 1.2, ringan: 1.375, sedang: 1.55, aktif: 1.725, 'sangat-aktif': 1.9
    };
    const tdee = bmr * faktorAktivitas[aktivitas];
    
    // Sesuaikan dengan target
    let targetKalori, teksTarget;
    if (target === 'turun') {
        targetKalori = tdee * 0.85;
        teksTarget = 'Turunin Berat';
    } else if (target === 'naik') {
        targetKalori = tdee * 1.15;
        teksTarget = 'Naikin Berat';
    } else {
        targetKalori = tdee;
        teksTarget = 'Jaga Berat';
    }
    
    // Cek status
    const selisih = asupanKalori - targetKalori;
    let status, kelasStatus, saran;
    
    if (Math.abs(selisih) < 100) {
        status = 'Pas';
        kelasStatus = 'badge-ijo';
        saran = 'Kalori udah sesuai target';
    } else if (selisih > 0) {
        status = 'Kebanyakan';
        kelasStatus = 'badge-kuning';
        saran = `Kurangin sekitar ${Math.abs(selisih).toFixed(0)} kkal`;
    } else {
        status = 'Kurang';
        kelasStatus = 'badge-kuning';
        saran = `Tambahin sekitar ${Math.abs(selisih).toFixed(0)} kkal`;
    }
    
    // Tampilkan hasil
    document.getElementById('isi-hasil-kalori').innerHTML = `
    <div class="col-md-3 mb-3">
        <div class="p-3 bg-light rounded">
            <div class="fw-bold">BMR</div>
            <div class="h4">${bmr.toFixed(0)} <small class="fs-6">kkal/hari</small></div>
            <small class="text-abu">Kalori dasar</small>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="p-3 bg-light rounded">
            <div class="fw-bold">TDEE</div>
            <div class="h4">${tdee.toFixed(0)} <small class="fs-6">kkal/hari</small></div>
            <small class="text-abu">Kalori aktif</small>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="p-3 bg-light rounded">
            <div class="fw-bold">Target</div>
            <div class="h4">${targetKalori.toFixed(0)} <small class="fs-6">kkal</small></div>
            <span class="badge bg-primary">${teksTarget}</span>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="p-3 bg-light rounded">
            <div class="fw-bold">Status</div>
            <div class="h4">${status}</div>
            <span class="${kelasStatus} badge">${saran}</span>
        </div>
    </div>
    `;

    document.getElementById('hasil-kalori').classList.remove('sembunyi');
    updateGrafikKalori(asupanKalori, targetKalori);

    // Simpan ke riwayat
    const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
    const dataHariIni = {
    tanggal: new Date().toISOString().split('T')[0],
    hari: hariIni,
    kalori: asupanKalori,
    target: targetKalori,
    status: status,
    saran: saran
    };

    // Cek apakah sudah ada data hari ini
    const indexHariIni = riwayatKalori.findIndex(item => item.tanggal === dataHariIni.tanggal);
    if (indexHariIni >= 0) {
    riwayatKalori[indexHariIni] = dataHariIni;
    } else {
    riwayatKalori.push(dataHariIni);
    // Hanya simpan 7 hari terakhir
    if (riwayatKalori.length > 7) {
        riwayatKalori.shift();
    }
    }
    

    localStorage.setItem('riwayatKalori', JSON.stringify(riwayatKalori));
    tampilkanRiwayat();

    // Update progress di tab target
    if (document.getElementById('tab-target').classList.contains('aktif')) {
    updateProgressTarget();
    }
    }

    // Update grafik kalori
    function updateGrafikKalori(asupan, target) {
    const ctx = document.getElementById('grafik-kalori').getContext('2d');
    if (grafikKalori) grafikKalori.destroy();

    grafikKalori = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Asupan', 'Target'],
        datasets: [{
            label: 'Kalori',
            data: [asupan, target],
            backgroundColor: ['#3498db', '#2ecc71'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Kalori (kkal)'
                }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => `${ctx.raw.toFixed(0)} kkal`
                }
            }
        }
    }
    });
    }

    // Tampilkan riwayat
    function tampilkanRiwayat() {
    const riwayatContainer = document.getElementById('isi-riwayat');
    const riwayatKosong = document.getElementById('riwayat-kosong');

    if (riwayatKalori.length === 0) {
    riwayatContainer.innerHTML = '';
    riwayatKosong.classList.remove('sembunyi');
    return;
    }

    riwayatKosong.classList.add('sembunyi');
    riwayatContainer.innerHTML = '';

    // Urutkan dari yang terbaru
    const riwayatTerurut = [...riwayatKalori].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    riwayatTerurut.forEach(item => {
    const persen = (item.kalori / item.target) * 100;
    let kelasStatus = '';

    if (item.status === 'Pas') kelasStatus = 'badge-ijo';
    else if (item.status === 'Kebanyakan') kelasStatus = 'badge-kuning';
    else kelasStatus = 'badge-merah';

    riwayatContainer.innerHTML += `
        <tr>
            <td>${item.hari}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="progress flex-grow-1 me-2" style="height: 10px;">
                        <div class="progress-bar" role="progressbar" style="width: ${Math.min(persen, 100)}%"></div>
                    </div>
                    <span>${item.kalori.toFixed(0)}</span>
                </div>
            </td>
            <td><span class="${kelasStatus} badge">${item.status}</span></td>
            <td><small>${item.saran}</small></td>
        </tr>
    `;
    });
    }

    // Hapus riwayat
    function hapusRiwayat() {
    if (confirm('Yakin mau hapus semua riwayat?')) {
    riwayatKalori = [];
    localStorage.removeItem('riwayatKalori');
    tampilkanRiwayat();
    }
    }

    // Simpan target
    function simpanTarget() {
    const targetKalori = parseFloat(document.getElementById('target-kalori').value) || 0;
    const targetKarbo = parseFloat(document.getElementById('target-karbo').value) || 0;
    const targetProtein = parseFloat(document.getElementById('target-protein').value) || 0;
    const targetLemak = parseFloat(document.getElementById('target-lemak').value) || 0;

    if (targetKalori <= 0 || targetKarbo <= 0 || targetProtein <= 0 || targetLemak <= 0) {
    alert('Masukin target yang valid dong!');
    return;
    }

    targetGizi = {
    kalori: targetKalori,
    karbo: targetKarbo,
    protein: targetProtein,
    lemak: targetLemak
    };

    localStorage.setItem('targetGizi', JSON.stringify(targetGizi));
    alert('Target berhasil disimpan!');
    updateProgressTarget();
    }

    // Update progress target
    function updateProgressTarget() {
    const asupanTerakhir = JSON.parse(localStorage.getItem('asupanTerakhir')) || {
    kalori: 0, karbo: 0, protein: 0, lemak: 0
    };

    const updateProgress = (elemen, teksElemen, nilai, target) => {
    const persen = (nilai / target) * 100;
    document.getElementById(elemen).style.width = `${Math.min(persen, 100)}%`;
    document.getElementById(teksElemen).textContent = `${nilai.toFixed(0)}/${target.toFixed(0)} ${elemen.includes('kalori') ? 'kkal' : 'g'}`;

    if (persen > 100) {
        document.getElementById(elemen).classList.add('bg-warning');
    } else {
        document.getElementById(elemen).classList.remove('bg-warning');
    }
    };

    updateProgress('progress-kalori', 'teks-progress-kalori', asupanTerakhir.kalori, targetGizi.kalori);
    updateProgress('progress-karbo', 'teks-progress-karbo', asupanTerakhir.karbo, targetGizi.karbo);
    updateProgress('progress-protein', 'teks-progress-protein', asupanTerakhir.protein, targetGizi.protein);
    updateProgress('progress-lemak', 'teks-progress-lemak', asupanTerakhir.lemak, targetGizi.lemak);
    }

    // Inisialisasi saat halaman dimuat
    document.addEventListener('DOMContentLoaded', function() {
    // Load target jika ada
    if (localStorage.getItem('targetGizi')) {
    const target = JSON.parse(localStorage.getItem('targetGizi'));
    document.getElementById('target-kalori').value = target.kalori;
    document.getElementById('target-karbo').value = target.karbo;
    document.getElementById('target-protein').value = target.protein;
    document.getElementById('target-lemak').value = target.lemak;
    }

    // Load riwayat
    tampilkanRiwayat();

    // Update progress target
    updateProgressTarget();

    // Event listener untuk tab
    document.querySelectorAll('#tabMenu button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('#tabMenu button').forEach(btn => {
            btn.classList.remove('aktif');
        });
        this.classList.add('aktif');
        
        if (this.id === 'tab-target') {
            updateProgressTarget();
        }
    });
    });
    });