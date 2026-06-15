// tamu.js
import { siteData } from '../data.js';

export function renderTamu() {
    const API_URL = '/api';
    
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
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=1600')">
                <div class="container text-center">
                    <h1>Buku Tamu</h1>
                    <p>Tinggalkan jejak, kesan, atau pesan manis Anda untuk SMA Negeri 1 Yosowilangun.</p>
                </div>
            </div>

            <section class="section container" style="display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-8); align-items: start;">
                <!-- Form Pengisian -->
                <div class="card" style="position: sticky; top: 100px;">
                    <h3 style="margin-bottom: var(--space-4); color: var(--color-primary-dark);"><i class="ph ph-pencil-simple-line"></i> Isi Buku Tamu</h3>
                    <form id="form-tamu">
                        <div class="form-group">
                            <label>Nama Anda <span style="color: red;">*</span></label>
                            <input type="text" id="tamu_nama" class="form-control" placeholder="Nama lengkap..." required>
                        </div>
                        <div class="form-group">
                            <label>Alamat / Instansi / Email (Opsional)</label>
                            <input type="text" id="tamu_email" class="form-control" placeholder="Dari mana Anda berasal?">
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
            </section>
        </div>
    `;
}

export function setupTamuEvents() {
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
                    // Reload the page to fetch the new data gracefully
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
