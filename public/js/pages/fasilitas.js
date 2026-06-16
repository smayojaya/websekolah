// fasilitas.js
import { siteData } from '../data.js';

export function renderFasilitas() {
    const fasilitasList = siteData.fasilitas.map(f => `
        <div class="card fade-in" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: ${f.foto ? '0' : 'var(--space-8) var(--space-4)'}; overflow: hidden;">
            ${f.foto 
                ? `<img src="${f.foto}" alt="${f.nama}" style="width: 100%; height: 200px; object-fit: cover; border-bottom: 2px solid var(--color-border);">` 
                : `<div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--color-primary-light); color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: var(--space-4);">
                       <i class="ph ${f.ikon}"></i>
                   </div>`
            }
            <div style="${f.foto ? 'padding: var(--space-4);' : ''}">
                <h3 style="margin-bottom: var(--space-2); font-size: 1.25rem;">${f.nama}</h3>
                <p style="color: var(--color-text-muted); font-size: 0.875rem;">${f.deskripsi}</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Fasilitas Sekolah</h1>
                    <p>Infrastruktur dan sarana prasarana modern untuk menunjang kegiatan belajar mengajar yang optimal.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-3">
                    ${fasilitasList}
                </div>
            </section>
        </div>
    `;
}
