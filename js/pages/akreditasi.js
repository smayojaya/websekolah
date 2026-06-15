// akreditasi.js
import { siteData } from '../data.js';

export function renderAkreditasi() {
    const pialaList = siteData.piala.map(p => `
        <div class="card fade-in" style="display: flex; align-items: center; gap: var(--space-4); padding: ${p.foto ? 'var(--space-3)' : 'var(--space-4)'}">
            <div style="font-size: 3rem; color: var(--color-accent); flex-shrink: 0;">
                ${p.foto ? `<img src="${p.foto}" alt="${p.nama}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-md); border: 2px solid var(--color-border);">` : `<i class="ph ph-trophy"></i>`}
            </div>
            <div>
                <h4 style="margin-bottom: var(--space-1); font-size: 1.125rem;">${p.nama}</h4>
                <div class="badge badge-warning">Tahun ${p.tahun}</div>
            </div>
        </div>
    `).join('');

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Akreditasi & Prestasi</h1>
                    <p>Bukti dedikasi kami dalam mencetak generasi unggul yang berprestasi di berbagai bidang.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-2" style="margin-bottom: var(--space-16); align-items: center;">
                    <div style="text-align: center;">
                        <div style="background: var(--color-surface); padding: var(--space-6); border-radius: var(--radius-2xl); box-shadow: var(--shadow-lg); display: inline-block;">
                            ${siteData.sekolah.fotoAkreditasi ? `<img src="${siteData.sekolah.fotoAkreditasi}" alt="Sertifikat Akreditasi" style="max-width: 100%; height: auto; max-height: 350px; border-radius: var(--radius-lg); margin-bottom: var(--space-4);">` : `<i class="ph ph-certificate" style="font-size: 6rem; color: var(--color-primary); margin-bottom: var(--space-4);"></i>`}
                            <h2 style="font-size: 3rem; margin-bottom: var(--space-2); color: var(--color-accent)">Akreditasi A</h2>
                            <p style="font-weight: 600;">(Sangat Baik)</p>
                            <p style="color: var(--color-text-muted); margin-top: var(--space-4);">Berdasarkan Keputusan Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M)</p>
                        </div>
                    </div>
                    <div>
                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)">Sertifikasi Unggul</h2>
                        <p style="margin-bottom: var(--space-4); text-align: justify;">
                            Akreditasi A yang diraih oleh SMA Negeri 1 Yosowilangun merupakan wujud komitmen seluruh elemen sekolah—mulai dari manajemen, guru, siswa, hingga komite sekolah—dalam menjaga standar mutu pendidikan.
                        </p>
                        <p style="text-align: justify;">
                            Penilaian mencakup 8 Standar Nasional Pendidikan, termasuk Standar Isi, Proses, Kompetensi Lulusan, Pendidik, Sarana Prasarana, Pengelolaan, Pembiayaan, dan Penilaian Pendidikan.
                        </p>
                    </div>
                </div>

                <hr style="border-top: 1px solid var(--color-border); margin-bottom: var(--space-12);">

                <h2 style="text-align: center; color: var(--color-primary); margin-bottom: var(--space-2)">Galeri Prestasi</h2>
                <p style="text-align: center; color: var(--color-text-muted); margin-bottom: var(--space-8)">Daftar penghargaan terbaru yang diraih oleh siswa-siswi kebanggaan SMAYO.</p>
                
                <div class="grid-2">
                    ${pialaList}
                </div>
            </section>
        </div>
    `;
}
