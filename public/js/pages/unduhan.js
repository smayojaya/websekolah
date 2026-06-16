// unduhan.js
import { siteData } from '../data.js';

export function renderUnduhan() {
    const tableRows = siteData.unduhan.map(u => {
        let icon = 'ph-file-text';
        if(u.tipe === 'PDF') icon = 'ph-file-pdf';
        if(u.tipe === 'DOCX') icon = 'ph-file-doc';
        
        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                        <i class="ph ${icon}" style="font-size: 1.5rem; color: var(--color-primary);"></i>
                        <span style="font-weight: 500;">${u.nama}</span>
                    </div>
                </td>
                <td><span class="badge badge-warning">${u.tipe}</span></td>
                <td style="color: var(--color-text-muted);">${u.ukuran}</td>
                <td>
                    <a href="${u.link}" class="btn btn-primary" style="padding: var(--space-1) var(--space-3); font-size: 0.875rem;">
                        <i class="ph ph-download-simple"></i> Unduh
                    </a>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Pusat Unduhan</h1>
                    <p>Area publik untuk mengunduh berbagai dokumen administrasi, modul belajar, dan formulir.</p>
                </div>
            </div>

            <section class="section container">
                <div class="card fade-in" style="overflow: hidden;">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nama Dokumen</th>
                                    <th>Tipe</th>
                                    <th>Ukuran</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    `;
}
