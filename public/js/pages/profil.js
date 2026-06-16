// profil.js
import { siteData } from '../data.js';

export function renderProfil() {
    const guruCards = (siteData.guru || []).map(guru => `
        <div class="card fade-in" style="text-align: center; padding: var(--space-6);">
            <div style="width: 150px; height: 150px; border-radius: 50%; background-color: var(--color-border); margin: 0 auto var(--space-4); overflow: hidden; box-shadow: var(--shadow-md);">
                <img src="${guru.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(guru.nama)}&background=random&size=150`}" alt="${guru.nama}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h4 style="font-size: 1.125rem; margin-bottom: var(--space-1)">${guru.nama}</h4>
            <p style="color: var(--color-text-muted); font-size: 0.875rem;">Guru ${guru.mapel}</p>
        </div>
    `).join('');

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Profil Sekolah</h1>
                    <p>Mengenal lebih dekat sejarah, visi, misi, dan tenaga pendidik SMA Negeri 1 Yosowilangun.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-2" style="margin-bottom: var(--space-16); align-items: center;">
                    <div>
                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4)">Sejarah Singkat</h2>
                        <p style="margin-bottom: var(--space-4); text-align: justify; white-space: pre-wrap;">
                            ${siteData.sekolah.sejarah || 'Belum ada sejarah sekolah.'}
                        </p>
                    </div>
                    <div>
                        <img src="${siteData.sekolah.fotoProfil || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800'}" alt="Gedung Sekolah" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); width: 100%; height: auto; object-fit: cover;">
                    </div>
                </div>

                <div class="card" style="background: linear-gradient(135deg, var(--color-primary-light), var(--color-bg)); margin-bottom: var(--space-16);">
                    <div class="grid-2">
                        <div>
                            <h3 style="color: var(--color-primary-dark); margin-bottom: var(--space-4)"><i class="ph ph-target"></i> Visi</h3>
                            <p style="font-size: 1.125rem; font-weight: 500; font-style: italic; white-space: pre-wrap;">"${siteData.sekolah.visi || 'Belum ada visi.'}"</p>
                        </div>
                        <div>
                            <h3 style="color: var(--color-primary-dark); margin-bottom: var(--space-4)"><i class="ph ph-list-checks"></i> Misi</h3>
                            <div style="white-space: pre-wrap;">
                                ${siteData.sekolah.misi ? siteData.sekolah.misi : 'Belum ada misi.'}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 style="text-align: center; color: var(--color-primary); margin-bottom: var(--space-8)">Tenaga Pendidik & Kependidikan</h2>
                    <div class="grid-4">
                        ${guruCards}
                    </div>
                </div>
            </section>
        </div>
    `;
}
