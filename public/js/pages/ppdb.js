// ppdb.js

export function renderPPDB() {
    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1510531704581-5b2870972060?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Penerimaan Peserta Didik Baru (PPDB) 2026</h1>
                    <p>Mari bergabung menjadi bagian dari generasi berprestasi SMAYO.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-2">
                    <!-- Info PPDB -->
                    <div class="fade-in">
                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)">Informasi Pendaftaran</h2>
                        
                        <div class="card" style="margin-bottom: var(--space-6); background: var(--color-primary-light); border: none;">
                            <h4 style="color: var(--color-primary-dark); margin-bottom: var(--space-2)"><i class="ph ph-info"></i> Status PPDB</h4>
                            <p style="font-size: 1.125rem; font-weight: 600; color: var(--color-primary-dark);">Pendaftaran Gelombang 1 Dibuka</p>
                            <p style="color: var(--color-primary-dark);">10 Mei 2026 - 30 Juni 2026</p>
                        </div>
                        
                        <h3 style="margin-bottom: var(--space-4)">Jalur Pendaftaran</h3>
                        <ul style="list-style: none; margin-bottom: var(--space-6);">
                            <li style="margin-bottom: var(--space-3); padding: var(--space-3); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                                <strong>1. Jalur Zonasi (50%)</strong><br>
                                <span style="font-size: 0.875rem; color: var(--color-text-muted);">Diperuntukkan bagi calon peserta didik yang berdomisili di dalam wilayah zonasi.</span>
                            </li>
                            <li style="margin-bottom: var(--space-3); padding: var(--space-3); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                                <strong>2. Jalur Prestasi (30%)</strong><br>
                                <span style="font-size: 0.875rem; color: var(--color-text-muted);">Berdasarkan nilai rapor atau prestasi kejuaraan akademik/non-akademik.</span>
                            </li>
                            <li style="margin-bottom: var(--space-3); padding: var(--space-3); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                                <strong>3. Jalur Afirmasi (15%)</strong><br>
                                <span style="font-size: 0.875rem; color: var(--color-text-muted);">Bagi calon peserta didik dari keluarga tidak mampu secara ekonomi.</span>
                            </li>
                            <li style="margin-bottom: var(--space-3); padding: var(--space-3); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                                <strong>4. Jalur Pindah Tugas Orang Tua (5%)</strong>
                            </li>
                        </ul>
                    </div>

                    <!-- Formulir Pendaftaran -->
                    <div class="card fade-in" id="ppdb-form-container" style="position: relative; overflow: hidden;">
                        <h3 style="margin-bottom: var(--space-6); text-align: center;">Formulir Pendaftaran Online</h3>
                        
                        <div id="ppdb-success-message" style="display: none; text-align: center; padding: var(--space-8) 0;">
                            <i class="ph ph-check-circle" style="font-size: 4rem; color: var(--color-primary); margin-bottom: var(--space-4);"></i>
                            <h3 style="color: var(--color-primary); margin-bottom: var(--space-2);">Pendaftaran Berhasil!</h3>
                            <p style="color: var(--color-text-muted); margin-bottom: var(--space-6);">Data Anda telah tersimpan di sistem kami. Panitia akan segera menghubungi Anda.</p>
                            <button id="btn-reset-ppdb" class="btn btn-outline">Daftar Lagi</button>
                        </div>

                        <form id="form-ppdb">
                            <div class="form-group">
                                <label class="form-label">Nama Lengkap Siswa</label>
                                <input type="text" id="ppdb-nama" class="form-control" required placeholder="Masukkan nama lengkap sesuai ijazah">
                            </div>
                            
                            <div class="grid-2">
                                <div class="form-group">
                                    <label class="form-label">NISN</label>
                                    <input type="text" id="ppdb-nisn" class="form-control" required placeholder="Nomor Induk Siswa Nasional">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Asal Sekolah (SMP/MTs)</label>
                                    <input type="text" id="ppdb-asal" class="form-control" required placeholder="Contoh: SMPN 1 Yosowilangun">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Jalur Pendaftaran</label>
                                <select id="ppdb-jalur" class="form-control" required>
                                    <option value="" disabled selected>Pilih Jalur</option>
                                    <option value="Zonasi">Zonasi</option>
                                    <option value="Prestasi">Prestasi</option>
                                    <option value="Afirmasi">Afirmasi</option>
                                    <option value="Pindah Tugas">Pindah Tugas Orang Tua</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Nomor WhatsApp / HP (Aktif)</label>
                                <input type="tel" id="ppdb-telepon" class="form-control" required placeholder="Contoh: 081234567890">
                            </div>

                            <div style="margin-top: var(--space-8);">
                                <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1.125rem;">
                                    <i class="ph ph-paper-plane-right"></i> Kirim Formulir Pendaftaran
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function setupPPDBEvents() {
    const form = document.getElementById('form-ppdb');
    const successMessage = document.getElementById('ppdb-success-message');
    const resetBtn = document.getElementById('btn-reset-ppdb');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Ambil data form
            const nama = document.getElementById('ppdb-nama').value;
            const nisn = document.getElementById('ppdb-nisn').value;
            const asalSekolah = document.getElementById('ppdb-asal').value;
            const jalur = document.getElementById('ppdb-jalur').value;
            const telepon = document.getElementById('ppdb-telepon').value;
            const tanggalDaftar = new Date().toISOString().split('T')[0];

            const pendaftarBaru = { id: Date.now(), nama, nisn, asalSekolah, jalur, telepon, tanggalDaftar };

            // Simpan ke localStorage
            let dataPPDB = JSON.parse(localStorage.getItem('smayo_ppdb') || '[]');
            dataPPDB.push(pendaftarBaru);
            localStorage.setItem('smayo_ppdb', JSON.stringify(dataPPDB));

            // Tampilkan pesan sukses
            form.style.display = 'none';
            successMessage.style.display = 'block';
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
        });
    }
}
