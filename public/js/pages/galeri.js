// galeri.js
import { siteData } from '../data.js';

export function renderGaleri() {
    const galeriItems = siteData.galeri.length > 0 
        ? siteData.galeri.map(item => {
            if (item.tipe === 'FOTO') {
                return `
                    <div class="card fade-in" style="padding: 0; overflow: hidden; border-radius: var(--radius-lg);">
                        <a href="${item.url}" target="_blank">
                            <img src="${item.url}" alt="${item.judul}" style="width: 100%; height: 200px; object-fit: cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        </a>
                        <div style="padding: var(--space-3); text-align: center;">
                            <h4 style="font-size: 1rem; color: var(--color-primary-dark);">${item.judul}</h4>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="card fade-in" style="padding: 0; overflow: hidden; border-radius: var(--radius-lg); position: relative;">
                        <a href="${item.url}" target="_blank" style="display: block; position: relative;">
                            <img src="${item.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800'}" alt="${item.judul}" style="width: 100%; height: 200px; object-fit: cover; opacity: 0.8;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.6); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                <i class="ph ph-play"></i>
                            </div>
                        </a>
                        <div style="padding: var(--space-3); text-align: center;">
                            <h4 style="font-size: 1rem; color: var(--color-primary-dark);">${item.judul} <span style="font-size: 0.75rem; color: var(--color-accent);">(Video)</span></h4>
                        </div>
                    </div>
                `;
            }
        }).join('')
        : '<div style="grid-column: 1 / -1; text-align: center; color: var(--color-text-muted); padding: var(--space-8);">Belum ada media galeri.</div>';

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
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Galeri & Karya Siswa</h1>
                    <p>Kumpulan dokumentasi foto, video kegiatan, serta pameran karya digital dan inovasi dari siswa-siswi SMAYO.</p>
                </div>
            </div>

            <section class="section container">
                <h2 style="color: var(--color-primary); margin-bottom: var(--space-6); text-align: center;"><i class="ph ph-image"></i> Dokumentasi Kegiatan</h2>
                <div class="grid-3" style="gap: var(--space-6);">
                    ${galeriItems}
                </div>
                
                <h2 style="color: var(--color-primary); margin-top: var(--space-12); margin-bottom: var(--space-6); text-align: center;"><i class="ph ph-palette"></i> Pameran Karya Siswa</h2>
                <div class="grid-3" style="gap: var(--space-6);">
                    ${karyaItems}
                </div>
            </section>
        </div>
    `;
}
