// akademik.js
import { siteData } from '../data.js';

export function renderAkademik() {
    const ekskulList = siteData.ekstrakurikuler.map(e => `
        <div class="card fade-in" style="border-left: 4px solid var(--color-accent); padding: ${e.foto ? '0' : 'var(--space-4)'}; overflow: hidden; display: flex; flex-direction: column;">
            ${e.foto ? `<img src="${e.foto}" alt="${e.nama}" style="width: 100%; height: 160px; object-fit: cover;">` : ''}
            <div style="${e.foto ? 'padding: var(--space-4); flex-grow: 1;' : ''}">
                <h4 style="margin-bottom: var(--space-1);">${e.nama}</h4>
                <span class="badge badge-primary">${e.kategori}</span>
            </div>
        </div>
    `).join('');

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Informasi Akademik & Kesiswaan</h1>
                    <p>Pusat informasi kurikulum, kegiatan kesiswaan, dan agenda sekolah sehari-hari.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-2" style="margin-bottom: var(--space-12);">
                    <!-- Kurikulum -->
                    <div class="card fade-in">
                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)"><i class="ph ph-books"></i> Kurikulum Merdeka</h2>
                        <p style="margin-bottom: var(--space-4); text-align: justify;">
                            SMA Negeri 1 Yosowilangun menerapkan <strong>Kurikulum Merdeka</strong> yang berfokus pada materi esensial dan pengembangan karakter Profil Pelajar Pancasila. 
                        </p>
                        <ul style="list-style: none;">
                            <li style="margin-bottom: var(--space-2); padding-left: var(--space-6); position: relative;">
                                <i class="ph ph-check-circle" style="position: absolute; left: 0; top: 4px; color: var(--color-primary);"></i>
                                <strong>Fase E (Kelas X)</strong>: Mata pelajaran umum untuk eksplorasi minat.
                            </li>
                            <li style="margin-bottom: var(--space-2); padding-left: var(--space-6); position: relative;">
                                <i class="ph ph-check-circle" style="position: absolute; left: 0; top: 4px; color: var(--color-primary);"></i>
                                <strong>Fase F (Kelas XI & XII)</strong>: Pemilihan mata pelajaran sesuai minat dan bakat (MIPA, IPS, Bahasa).
                            </li>
                            <li style="margin-bottom: var(--space-2); padding-left: var(--space-6); position: relative;">
                                <i class="ph ph-check-circle" style="position: absolute; left: 0; top: 4px; color: var(--color-primary);"></i>
                                <strong>P5</strong>: Projek Penguatan Profil Pelajar Pancasila.
                            </li>
                        </ul>
                    </div>

                    <!-- E-Learning -->
                    <!-- Kalender Akademik Baru -->
                <div class="card fade-in" style="margin-bottom: var(--space-16);">
                    <h3 style="color: var(--color-primary); margin-bottom: var(--space-4)"><i class="ph ph-calendar"></i> Kalender Akademik</h3>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="width: 25%;">Tanggal</th>
                                    <th>Agenda Kegiatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${siteData.kalenderAkademik.length > 0 ? siteData.kalenderAkademik.map(k => `
                                    <tr>
                                        <td><strong>${new Date(k.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></td>
                                        <td>${k.agenda}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="2" style="text-align:center;">Belum ada agenda</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card" style="background: linear-gradient(135deg, var(--color-primary-light), var(--color-bg));">
                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)"><i class="ph ph-laptop"></i> E-Learning & LMS</h2>
                        <p style="margin-bottom: var(--space-6);">Akses platform pembelajaran digital untuk mempermudah kegiatan belajar mengajar dari mana saja.</p>
                        
                        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                            <a href="#" class="btn btn-outline" style="justify-content: flex-start; text-align: left; padding: var(--space-4);">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png" alt="GC" style="width: 24px; height: 24px; object-fit: contain; margin-right: var(--space-2);">
                                Google Classroom SMAYO
                            </a>
                            <a href="#" class="btn btn-outline" style="justify-content: flex-start; text-align: left; padding: var(--space-4);">
                                <i class="ph ph-exam" style="font-size: 1.5rem; margin-right: var(--space-2);"></i>
                                CBT / Portal Ujian Online
                            </a>
                            <a href="#" class="btn btn-outline" style="justify-content: flex-start; text-align: left; padding: var(--space-4);">
                                <i class="ph ph-book-open-text" style="font-size: 1.5rem; margin-right: var(--space-2);"></i>
                                Perpustakaan Digital (E-Library)
                            </a>
                        </div>
                    </div>
                </div>

                <hr style="border-top: 1px solid var(--color-border); margin-bottom: var(--space-12);">

                <!-- Ekstrakurikuler -->
                <h2 style="text-align: center; color: var(--color-primary); margin-bottom: var(--space-2)">Kegiatan Ekstrakurikuler</h2>
                <p style="text-align: center; color: var(--color-text-muted); margin-bottom: var(--space-8)">Wadah pengembangan bakat dan minat non-akademis siswa.</p>
                
                <div class="grid-3" style="margin-bottom: var(--space-12);">
                    ${ekskulList}
                </div>
            </section>
        </div>
    `;
}
