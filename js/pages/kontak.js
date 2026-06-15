// kontak.js
import { siteData } from '../data.js';

export function renderKontak() {
    const tamuItems = siteData.bukuTamu && siteData.bukuTamu.length > 0
        ? siteData.bukuTamu.map(item => `
            <div class="card fade-in" style="margin-bottom: var(--space-4); border-left: 4px solid var(--color-accent);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <h4 style="color: var(--color-primary-dark); margin: 0; display: flex; align-items: center; gap: 8px;">
                        <div style="width: 35px; height: 35px; background: var(--color-primary-light); color: var(--color-primary-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;">
                            ${item.nama.charAt(0).toUpperCase()}
                        </div>
                        ${item.nama}
                    </h4>
                    <span style="font-size: 0.8rem; color: var(--color-text-muted);">${new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                </div>
                <p style="color: var(--color-text); margin-left: 43px; font-size: 0.95rem; line-height: 1.5;">${item.pesan}</p>
            </div>
        `).join('')
        : '<div style="text-align: center; color: var(--color-text-muted); padding: var(--space-6); background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">Jadilah yang pertama mengisi buku tamu kami!</div>';

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Kontak & Buku Tamu</h1>
                    <p>Hubungi kami, kunjungi kampus kami, atau tinggalkan jejak digital di Buku Tamu SMA Negeri 1 Yosowilangun.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-2">
                    <!-- Informasi -->
                    <div class="fade-in">
                        <div class="card" style="height: 100%;">
                            <h3 style="margin-bottom: var(--space-4); color: var(--color-primary);"><i class="ph ph-address-book"></i> Hubungi Kami</h3>
                            <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-4);">
                                <li style="display: flex; gap: var(--space-4); align-items: flex-start;">
                                    <div style="background: var(--color-primary-light); padding: var(--space-2); border-radius: var(--radius-md); color: var(--color-primary-dark); font-size: 1.5rem;">
                                        <i class="ph ph-map-pin"></i>
                                    </div>
                                    <div>
                                        <h4 style="margin-bottom: var(--space-1)">Alamat</h4>
                                        <p style="color: var(--color-text-muted)">${siteData.sekolah.alamat}</p>
                                    </div>
                                </li>
                                <li style="display: flex; gap: var(--space-4); align-items: flex-start;">
                                    <div style="background: var(--color-primary-light); padding: var(--space-2); border-radius: var(--radius-md); color: var(--color-primary-dark); font-size: 1.5rem;">
                                        <i class="ph ph-phone"></i>
                                    </div>
                                    <div>
                                        <h4 style="margin-bottom: var(--space-1)">Telepon</h4>
                                        <p style="color: var(--color-text-muted)">${siteData.sekolah.telepon}</p>
                                    </div>
                                </li>
                                <li style="display: flex; gap: var(--space-4); align-items: flex-start;">
                                    <div style="background: var(--color-primary-light); padding: var(--space-2); border-radius: var(--radius-md); color: var(--color-primary-dark); font-size: 1.5rem;">
                                        <i class="ph ph-envelope-simple"></i>
                                    </div>
                                    <div>
                                        <h4 style="margin-bottom: var(--space-1)">Email</h4>
                                        <p style="color: var(--color-text-muted)">${siteData.sekolah.email}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Peta Leaflet -->
                    <div class="fade-in">
                        <div class="card" style="padding: 0; overflow: hidden; height: 100%; min-height: 400px; border: 1px solid var(--color-border);">
                            <div id="map-container" style="width: 100%; height: 100%;"></div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: var(--space-12); padding-top: var(--space-6); border-top: 2px dashed var(--color-border);">
                    <h2 style="color: var(--color-primary); margin-bottom: var(--space-6); text-align: center;"><i class="ph ph-book-open-text"></i> Buku Tamu Digital</h2>
                    <div class="grid-2" style="align-items: start;">
                        <!-- Form Pengisian -->
                        <div class="card" style="position: sticky; top: 100px;">
                            <h3 style="margin-bottom: var(--space-4); color: var(--color-primary-dark);"><i class="ph ph-pencil-simple-line"></i> Isi Buku Tamu</h3>
                            <form id="form-tamu">
                                <div class="form-group">
                                    <label>Nama Lengkap <span style="color: red;">*</span></label>
                                    <input type="text" id="tamu_nama" class="form-control" placeholder="Nama..." required>
                                </div>
                                <div class="form-group">
                                    <label>Alamat Email</label>
                                    <input type="email" id="tamu_email" class="form-control" placeholder="Email Anda (Opsional)">
                                </div>
                                <div class="form-group">
                                    <label>Nomor WhatsApp (WA) <span style="color: red;">*</span></label>
                                    <input type="text" id="tamu_wa" class="form-control" placeholder="Misal: 08123456789" required>
                                </div>
                                <div class="form-group">
                                    <label>Kesan / Pesan <span style="color: red;">*</span></label>
                                    <textarea id="tamu_pesan" class="form-control" rows="5" placeholder="Tulis pesan Anda di sini..." required></textarea>
                                </div>
                                <button type="submit" id="btn-submit-tamu" class="btn btn-primary" style="width: 100%;">
                                    <i class="ph ph-paper-plane-right"></i> Kirim Pesan
                                </button>
                            </form>
                        </div>

                        <!-- Daftar Tamu -->
                        <div>
                            <h3 style="margin-bottom: var(--space-4); color: var(--color-primary-dark); border-bottom: 2px solid var(--color-primary-light); padding-bottom: 8px;">Daftar Kunjungan</h3>
                            <div id="tamu-list">
                                ${tamuItems}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function setupKontakEvents() {
    // Inisialisasi Peta
    setTimeout(() => {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer && typeof L !== 'undefined') {
            const coords = siteData.sekolah.koordinat;
            const map = L.map('map-container').setView(coords, 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker(coords).addTo(map)
                .bindPopup(`<b>${siteData.sekolah.nama}</b><br>${siteData.sekolah.alamat}`)
                .openPopup();
        }
    }, 100);

    // Inisialisasi Form Buku Tamu
    const API_URL = '/api';
    const form = document.getElementById('form-tamu');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-submit-tamu');
            btn.disabled = true;
            btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Mengirim...';

            const payload = {
                nama: document.getElementById('tamu_nama').value,
                email: document.getElementById('tamu_email').value,
                wa: document.getElementById('tamu_wa').value,
                pesan: document.getElementById('tamu_pesan').value
            };

            try {
                const res = await fetch(`${API_URL}/buku-tamu`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    alert('Terima kasih! Pesan Anda telah tersimpan di Buku Tamu.');
                    window.location.reload();
                } else {
                    const data = await res.json();
                    alert('Gagal: ' + (data.error || 'Terjadi kesalahan'));
                }
            } catch (err) {
                alert('Kesalahan jaringan: ' + err.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="ph ph-paper-plane-right"></i> Kirim Pesan';
            }
        });
    }
}
