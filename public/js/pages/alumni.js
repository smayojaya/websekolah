// alumni.js

export function renderAlumni() {
    // Generate mock data if local storage is empty, so stats look good initially
    let alumniList = JSON.parse(localStorage.getItem('smayo_tracer') || 'null');
    if (!alumniList) {
        alumniList = [
            { id: 1, nama: "Andi Saputra", tahun: "2018", status: "Kuliah", instansi: "Universitas Airlangga" },
            { id: 2, nama: "Sari Puspita", tahun: "2015", status: "Bekerja", instansi: "PT Tokopedia" },
            { id: 3, nama: "Budi Santoso", tahun: "2019", status: "Kuliah", instansi: "Institut Teknologi Sepuluh Nopember" },
            { id: 4, nama: "Dewi Lestari", tahun: "2017", status: "Wirausaha", instansi: "Dewi Fashion Shop" },
            { id: 5, nama: "Rahmat Hidayat", tahun: "2020", status: "Bekerja", instansi: "Bank Mandiri" }
        ];
        localStorage.setItem('smayo_tracer', JSON.stringify(alumniList));
    }

    // Calculate statistics
    const total = alumniList.length;
    const stats = { Kuliah: 0, Bekerja: 0, Wirausaha: 0 };
    alumniList.forEach(item => {
        if (stats[item.status] !== undefined) stats[item.status]++;
    });

    const getPercentage = (count) => total === 0 ? 0 : Math.round((count / total) * 100);

    // Generate table rows
    const tableRows = alumniList.slice().reverse().slice(0, 10).map(alumni => `
        <tr>
            <td>${alumni.nama}</td>
            <td>${alumni.tahun}</td>
            <td><span class="badge ${alumni.status === 'Kuliah' ? 'badge-primary' : (alumni.status === 'Bekerja' ? 'badge-warning' : '')}" style="background-color: ${alumni.status === 'Wirausaha' ? 'var(--color-secondary)' : ''}; color: ${alumni.status === 'Wirausaha' ? 'white' : ''}">${alumni.status}</span></td>
            <td>${alumni.instansi}</td>
        </tr>
    `).join('');

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Pojok Alumni</h1>
                    <p>Wadah silaturahmi, berbagi kisah sukses, dan pendataan jejak alumni (Tracer Study) SMAYO.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-2">
                    <div class="fade-in">
                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)">Formulir Tracer Study</h2>
                        <p style="margin-bottom: var(--space-6);">Bantu kami melacak jejak kesuksesan Anda. Data yang masuk akan digunakan untuk peningkatan mutu sekolah dan akreditasi.</p>
                        
                        <div class="card" id="tracer-form-container">
                            <div id="tracer-success" style="display: none; text-align: center; padding: var(--space-4);">
                                <i class="ph ph-check-circle" style="font-size: 3rem; color: var(--color-primary); margin-bottom: var(--space-2);"></i>
                                <h4 style="color: var(--color-primary);">Terima kasih!</h4>
                                <p>Data Anda telah berhasil dikirimkan ke database alumni.</p>
                                <button class="btn btn-outline" onclick="location.reload()" style="margin-top: var(--space-4)">Isi Data Baru</button>
                            </div>

                            <form id="form-tracer">
                                <div class="form-group">
                                    <label class="form-label">Nama Lengkap</label>
                                    <input type="text" id="tracer-nama" class="form-control" required>
                                </div>
                                <div class="grid-2">
                                    <div class="form-group">
                                        <label class="form-label">Tahun Lulus</label>
                                        <input type="number" id="tracer-tahun" class="form-control" min="1985" max="2026" required placeholder="Contoh: 2020">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Status Saat Ini</label>
                                        <select id="tracer-status" class="form-control" required>
                                            <option value="" disabled selected>Pilih Status</option>
                                            <option value="Kuliah">Kuliah / Studi Lanjut</option>
                                            <option value="Bekerja">Bekerja</option>
                                            <option value="Wirausaha">Wirausaha</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Nama Instansi / Universitas / Perusahaan</label>
                                    <input type="text" id="tracer-instansi" class="form-control" required>
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="ph ph-paper-plane-right"></i> Kirim Data Alumni</button>
                            </form>
                        </div>
                    </div>

                    <div class="fade-in">
                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)">Statistik Sebaran Alumni</h2>
                        <div class="card" style="margin-bottom: var(--space-6);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-4);">
                                <div>
                                    <h1 style="font-size: 3rem; color: var(--color-primary); line-height: 1;">${total}</h1>
                                    <p style="color: var(--color-text-muted);">Total Alumni Terdata</p>
                                </div>
                                <i class="ph ph-users-three" style="font-size: 3rem; color: var(--color-border);"></i>
                            </div>

                            <!-- Bar Chart CSS -->
                            <div style="margin-bottom: var(--space-4);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-1); font-size: 0.875rem; font-weight: 600;">
                                    <span>Kuliah / Studi Lanjut (${stats.Kuliah})</span>
                                    <span>${getPercentage(stats.Kuliah)}%</span>
                                </div>
                                <div style="width: 100%; height: 12px; background: var(--color-border); border-radius: var(--radius-full); overflow: hidden;">
                                    <div style="width: ${getPercentage(stats.Kuliah)}%; height: 100%; background: var(--color-primary); border-radius: var(--radius-full);"></div>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: var(--space-4);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-1); font-size: 0.875rem; font-weight: 600;">
                                    <span>Bekerja (${stats.Bekerja})</span>
                                    <span>${getPercentage(stats.Bekerja)}%</span>
                                </div>
                                <div style="width: 100%; height: 12px; background: var(--color-border); border-radius: var(--radius-full); overflow: hidden;">
                                    <div style="width: ${getPercentage(stats.Bekerja)}%; height: 100%; background: #b45309; border-radius: var(--radius-full);"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-1); font-size: 0.875rem; font-weight: 600;">
                                    <span>Wirausaha (${stats.Wirausaha})</span>
                                    <span>${getPercentage(stats.Wirausaha)}%</span>
                                </div>
                                <div style="width: 100%; height: 12px; background: var(--color-border); border-radius: var(--radius-full); overflow: hidden;">
                                    <div style="width: ${getPercentage(stats.Wirausaha)}%; height: 100%; background: var(--color-secondary); border-radius: var(--radius-full);"></div>
                                </div>
                            </div>
                        </div>

                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)">Kisah Sukses</h2>
                        
                        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                            <div class="card" style="display: flex; gap: var(--space-4); align-items: flex-start;">
                                <img src="https://ui-avatars.com/api/?name=Andi+S&background=random" style="width: 60px; height: 60px; border-radius: 50%;">
                                <div>
                                    <h4 style="margin-bottom: 0;">Andi Saputra</h4>
                                    <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: var(--space-2);">Alumni 2018 - Kedokteran UNAIR</p>
                                    <p style="font-size: 0.875rem; font-style: italic;">"Pendidikan di SMAYO membentuk karakter disiplin yang sangat berguna di dunia perkuliahan."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tabel Data Alumni -->
            <section class="section container" style="padding-top: 0;">
                <div class="fade-in">
                    <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)">Direktori Data Alumni Terbaru</h2>
                    <div class="card table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nama Lengkap</th>
                                    <th>Tahun Lulus</th>
                                    <th>Status</th>
                                    <th>Instansi / Tempat</th>
                                </tr>
                            </thead>
                            <tbody id="alumni-table-body">
                                ${tableRows}
                            </tbody>
                        </table>
                        ${alumniList.length === 0 ? '<p style="text-align: center; padding: var(--space-4); color: var(--color-text-muted);">Belum ada data alumni.</p>' : ''}
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function setupAlumniEvents() {
    const form = document.getElementById('form-tracer');
    const successMsg = document.getElementById('tracer-success');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nama = document.getElementById('tracer-nama').value;
            const tahun = document.getElementById('tracer-tahun').value;
            const status = document.getElementById('tracer-status').value;
            const instansi = document.getElementById('tracer-instansi').value;

            const tracerData = { id: Date.now(), nama, tahun, status, instansi };

            let alumniList = JSON.parse(localStorage.getItem('smayo_tracer') || '[]');
            alumniList.push(tracerData);
            localStorage.setItem('smayo_tracer', JSON.stringify(alumniList));

            form.style.display = 'none';
            successMsg.style.display = 'block';
            
            // Note: Since this is an SPA, the user has to click the reload button 
            // shown in the success message to see the updated table and stats, 
            // or navigate away and back.
        });
    }
}
