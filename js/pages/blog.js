// blog.js

export function renderBlog() {
    const mockBlogs = [
        { judul: "Puisi: Mentari Pagi di Sekolahku", penulis: "Siswa Kelas X-A", tanggal: "1 Juni 2026", konten: "Mentari pagi menyapa hangat lapangan hijau..." },
        { judul: "Opini: Menjaga Lingkungan Lewat Green House", penulis: "Guru Biologi", tanggal: "28 Mei 2026", konten: "Program hidroponik di sekolah merupakan langkah tepat..." }
    ];

    let userBlogs = JSON.parse(localStorage.getItem('smayo_blogs') || '[]');
    const allBlogs = [...userBlogs, ...mockBlogs];

    const blogListHtml = allBlogs.map(b => `
        <div class="card" style="margin-bottom: var(--space-4);">
            <h3 style="margin-bottom: var(--space-2); color: var(--color-primary);">${b.judul}</h3>
            <div style="display: flex; gap: var(--space-4); margin-bottom: var(--space-3); font-size: 0.875rem; color: var(--color-text-muted);">
                <span><i class="ph ph-user"></i> ${b.penulis}</span>
                <span><i class="ph ph-calendar"></i> ${b.tanggal}</span>
            </div>
            <p>${b.konten}</p>
        </div>
    `).join('');

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1600')">
                <div class="container">
                    <h1>Blog & Karya Tulis</h1>
                    <p>Ruang berekspresi bagi guru dan siswa SMAYO.</p>
                </div>
            </div>

            <section class="section container">
                <div class="grid-2" style="align-items: flex-start;">
                    <div>
                        <h2 style="margin-bottom: var(--space-6);">Daftar Artikel</h2>
                        <div id="blog-list-container">
                            ${blogListHtml}
                        </div>
                    </div>
                    
                    <div class="card fade-in" style="position: sticky; top: 100px;">
                        <h3 style="margin-bottom: var(--space-4);">Publikasikan Karya Anda</h3>
                        <form id="form-blog">
                            <div class="form-group">
                                <label class="form-label">Judul Tulisan</label>
                                <input type="text" id="blog-judul" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Penulis</label>
                                <input type="text" id="blog-penulis" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Konten</label>
                                <textarea id="blog-konten" class="form-control" rows="6" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="ph ph-paper-plane-right"></i> Kirim Tulisan</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function setupBlogEvents() {
    const form = document.getElementById('form-blog');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const judul = document.getElementById('blog-judul').value;
            const penulis = document.getElementById('blog-penulis').value;
            const konten = document.getElementById('blog-konten').value;
            const tanggal = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

            const newBlog = { judul, penulis, konten, tanggal };

            let userBlogs = JSON.parse(localStorage.getItem('smayo_blogs') || '[]');
            userBlogs.unshift(newBlog);
            localStorage.setItem('smayo_blogs', JSON.stringify(userBlogs));

            alert('Karya Anda berhasil dipublikasikan!');
            
            // Reload hash to show new blog
            window.location.reload();
        });
    }
}
