// karya.js
import { siteData } from '../data.js';

export function renderKarya() {
    const karyaItems = siteData.karyaSiswa && siteData.karyaSiswa.length > 0 
        ? siteData.karyaSiswa.map(item => `
            <div class="card fade-in" style="padding: 0; overflow: hidden; border-radius: var(--radius-lg); display: flex; flex-direction: column;">
                <img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: 250px; object-fit: cover; border-bottom: 3px solid var(--color-accent);">
                <div style="padding: var(--space-4); display: flex; flex-direction: column; flex-grow: 1;">
                    <h3 style="color: var(--color-primary-dark); margin-bottom: 8px;">${item.judul}</h3>
                    <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
                        <span class="badge" style="background: var(--color-primary-light); color: var(--color-primary-dark); font-size: 0.8rem;"><i class="ph ph-user"></i> ${item.siswa}</span>
                        <span class="badge" style="background: var(--color-primary-light); color: var(--color-primary-dark); font-size: 0.8rem;"><i class="ph ph-users-three"></i> Kelas ${item.kelas}</span>
                    </div>
                    <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; flex-grow: 1;">${item.deskripsi}</p>
                </div>
            </div>
        `).join('')
        : '<div style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted); padding: var(--space-8); background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">Belum ada pameran karya siswa.</div>';

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1600')">
                <div class="container text-center">
                    <h1>Mading Digital & Karya Siswa</h1>
                    <p>Ruang apresiasi untuk menyajikan kreasi, proyek, dan inovasi membanggakan dari siswa-siswi SMAYO.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-3" style="gap: var(--space-6);">
                    ${karyaItems}
                </div>
            </section>
        </div>
    `;
}
