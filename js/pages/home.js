// home.js
import { siteData } from '../data.js';

export function renderHome() {
    // Ambil 3 berita terbaru
    const latestNews = (siteData.berita || []).slice(0, 3).map(news => `
        <div class="card fade-in">
            <img src="${news.gambar}" alt="${news.judul}" class="card-img-top">
            <div class="badge badge-primary" style="margin-bottom: var(--space-2)">${news.kategori}</div>
            <h3 style="margin-bottom: var(--space-2)"><a href="#/berita">${news.judul}</a></h3>
            <p style="color: var(--color-text-muted); font-size: 0.875rem; margin-bottom: var(--space-3)"><i class="ph ph-calendar"></i> ${news.tanggal}</p>
            <p>${news.ringkasan}</p>
        </div>
    `).join('');

    // Generate Carousel Slides
    const carouselSlides = (siteData.carousel || []).map((slide, index) => {
        const imageUrl = slide.gambar && slide.gambar.trim() !== '' ? slide.gambar : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1600';
        return `
        <div class="carousel-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${imageUrl}')">
            <div class="carousel-content">
                <h1 class="carousel-title">
                    ${slide.judul}
                </h1>
                <p style="font-size: 1.25rem; max-width: 800px; margin: 0 auto var(--space-8); opacity: 0.95; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
                    ${slide.deskripsi}
                </p>
                ${index === 0 ? `
                <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap;">
                    <a href="#/karya" class="btn btn-primary" style="font-size: 1.125rem; padding: var(--space-3) var(--space-8)">
                        <i class="ph ph-palette"></i> Lihat Karya Siswa
                    </a>
                    <a href="#/profil" class="btn btn-outline" style="border-color: white; color: white; font-size: 1.125rem; padding: var(--space-3) var(--space-8)">
                        <i class="ph ph-info"></i> Profil SMAYO
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
        `;
    }).join('');

    const carouselIndicators = (siteData.carousel || []).map((_, index) => `
        <button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Slide ${index + 1}"></button>
    `).join('');

    // Generate Info Penting (Maksimal 3 Terbaru)
    const infoPentingItems = (siteData.infoPenting || [])
        .sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal))
        .slice(0, 3)
        .map(info => `
        <div class="info-item fade-in">
            <div style="font-size: 0.875rem; color: var(--color-accent); font-weight: 600; margin-bottom: var(--space-1);"><i class="ph ph-calendar"></i> ${info.tanggal}</div>
            <a href="${info.link}" style="font-size: 1.125rem;" target="_blank">${info.judul}</a>
        </div>
    `).join('');

    return `
        <div class="fade-in">
            <!-- Carousel Section -->
            <div class="carousel-container" id="home-carousel">
                ${carouselSlides}
                <button class="carousel-btn prev" aria-label="Previous Slide"><i class="ph ph-caret-left"></i></button>
                <button class="carousel-btn next" aria-label="Next Slide"><i class="ph ph-caret-right"></i></button>
                <div class="carousel-indicators">
                    ${carouselIndicators}
                </div>
            </div>

            <!-- Ticker Running Text -->
            ${siteData.sekolah?.runningText ? (() => {
                const rt = siteData.sekolah.runningText;
                const separator = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                const duplicatedText = `${rt} ${separator} ${rt} ${separator} ${rt} ${separator} ${rt} ${separator}`;
                return `
            <div class="container" style="margin-top: 2rem; margin-bottom: 2rem; position: relative; z-index: 30;">
                <div class="ticker-container" style="border: 1px solid var(--color-border);">
                    <div class="ticker-label"><i class="ph ph-megaphone" style="margin-right: 8px;"></i> INFO</div>
                    <div class="ticker-wrapper">
                        <div class="ticker-track">
                            <span class="ticker-text">${duplicatedText}</span>
                            <span class="ticker-text">${duplicatedText}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
            })() : ''}

            <!-- Info Penting Card -->
            <div class="container fade-in" style="margin-top: 2rem; margin-bottom: 2rem;">
                <div class="card" style="border-top: 4px solid var(--color-primary); background: var(--color-surface); box-shadow: var(--shadow-md);">
                    <h3 style="margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2); color: var(--color-primary);">
                        <i class="ph ph-warning-circle"></i> Info Penting Terbaru
                    </h3>
                    <div class="info-grid">
                        ${infoPentingItems || '<div class="info-item" style="grid-column: 1/-1;">Belum ada informasi terbaru.</div>'}
                    </div>
                </div>
            </div>

            <!-- Visi Misi Singkat -->
            <section class="section container">
                <div class="grid-2" style="align-items: center;">
                    <div>
                        <h2 style="font-size: 2rem; margin-bottom: var(--space-4); color: var(--color-primary)">Sambutan Kepala Sekolah</h2>
                        <p style="margin-bottom: var(--space-4); text-align: justify;">
                            Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas rahmat dan karunia-Nya sehingga website SMA Negeri 1 Yosowilangun ini dapat kami hadirkan. Di era digital ini, website sekolah menjadi gerbang informasi utama yang menghubungkan sekolah dengan siswa, orang tua, alumni, dan masyarakat luas.
                        </p>
                        <p style="margin-bottom: var(--space-6); text-align: justify;">
                            Kami berkomitmen untuk terus meningkatkan mutu pendidikan dan pelayanan melalui inovasi pembelajaran dan kelengkapan fasilitas. Mari bersama-sama mewujudkan SMAYO yang berprestasi dan berkarakter.
                        </p>
                        <div>
                            <h4 style="font-family: var(--font-heading)">Drs. H. Ahmad Fauzi, M.Pd.</h4>
                            <p style="color: var(--color-text-muted)">Kepala Sekolah</p>
                        </div>
                    </div>
                    <div style="position: relative;">
                        <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=600" alt="Kepala Sekolah" style="border-radius: var(--radius-2xl); box-shadow: var(--shadow-lg); width: 100%; max-width: 400px; margin: 0 auto; display: block;">
                        <div style="position: absolute; bottom: -20px; right: 10%; background: var(--color-surface); padding: var(--space-4); border-radius: var(--radius-lg); box-shadow: var(--shadow-md);">
                            <div style="display: flex; gap: var(--space-4); align-items: center;">
                                <i class="ph ph-certificate" style="font-size: 2.5rem; color: var(--color-accent)"></i>
                                <div>
                                    <h4 style="font-weight: 800; font-size: 1.5rem">Akreditasi A</h4>
                                    <p style="font-size: 0.875rem; color: var(--color-text-muted)">Predikat Unggul</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Berita & Pengumuman -->
            <section class="section" style="background-color: var(--color-primary-light);">
                <div class="container">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-8);">
                        <div>
                            <h2 style="font-size: 2rem; color: var(--color-primary-dark);">Kabar SMAYO</h2>
                            <p style="color: var(--color-text-muted)">Berita dan pengumuman terbaru dari sekolah</p>
                        </div>
                        <a href="#/berita" class="btn btn-outline" style="border-color: var(--color-primary-dark); color: var(--color-primary-dark)">Lihat Semua <i class="ph ph-arrow-right"></i></a>
                    </div>
                    
                    <div class="grid-3">
                        ${latestNews}
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function setupHomeEvents() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000); // 5 seconds
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideShow();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideShow();
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetSlideShow();
        });
    });

    startSlideShow();
}
