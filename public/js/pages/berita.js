// berita.js
import { siteData } from '../data.js';

export function renderBerita() {
    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Berita & Pengumuman</h1>
                    <p>Dapatkan informasi terbaru mengenai kegiatan, pengumuman akademik, dan prestasi sekolah.</p>
                </div>
            </div>

            <section class="section container">
                <div style="margin-bottom: var(--space-8); max-width: 600px; margin-left: auto; margin-right: auto;">
                    <div style="position: relative;">
                        <i class="ph ph-magnifying-glass" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); font-size: 1.25rem;"></i>
                        <input type="text" id="search-berita" class="form-control" placeholder="Cari berita atau pengumuman..." style="padding-left: 48px; border-radius: var(--radius-full);">
                    </div>
                </div>

                <div class="grid-3" id="berita-container">
                    <!-- Data will be populated via JS or pre-rendered here for simplicity -->
                    ${siteData.berita.map(news => `
                        <div class="card berita-card fade-in">
                            <img src="${news.gambar}" alt="${news.judul}" class="card-img-top">
                            <div class="badge badge-primary" style="margin-bottom: var(--space-2)">${news.kategori}</div>
                            <h3 style="margin-bottom: var(--space-2)">${news.judul}</h3>
                            <p style="color: var(--color-text-muted); font-size: 0.875rem; margin-bottom: var(--space-3)"><i class="ph ph-calendar"></i> ${news.tanggal}</p>
                            <p style="margin-bottom: var(--space-4);">${news.ringkasan}</p>
                            <a href="#" class="btn btn-outline" style="width: 100%; font-size: 0.875rem;">Baca Selengkapnya</a>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `;
}
