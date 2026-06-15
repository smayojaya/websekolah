// navbar.js
import { siteData } from '../data.js';

export function renderNavbar() {
    return `
        <nav class="navbar">
            <div class="container">
                <a href="#/" class="navbar-brand">
                    <img src="assets/logo.png" alt="SMAYo Logo" style="height: 48px; object-fit: contain;">
                </a>
                
                <div class="nav-links" id="nav-links">
                    <a href="#/" class="nav-link">Beranda</a>
                    <a href="#/profil" class="nav-link">Profil</a>
                    <a href="#/akreditasi" class="nav-link">Akreditasi</a>
                    <a href="#/fasilitas" class="nav-link">Fasilitas</a>
                    <a href="#/akademik" class="nav-link">Akademik</a>
                    <a href="#/galeri" class="nav-link">Galeri & Karya</a>
                    <a href="#/berita" class="nav-link">Berita</a>
                    <a href="#/alumni" class="nav-link">Alumni</a>
                    <a href="#/kontak" class="nav-link">Kontak & Tamu</a>
                    <a href="#/admin" class="nav-link"><i class="ph ph-lock-key"></i></a>
                    
                    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle Theme">
                        <i class="ph ph-moon"></i>
                    </button>
                </div>
                
                <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                    <i class="ph ph-list"></i>
                </button>
            </div>
        </nav>
    `;
}

export function setupNavbarEvents(toggleThemeCallback) {
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('show')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
    }
    
    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                navLinks.classList.remove('show');
                mobileMenuBtn.querySelector('i').classList.replace('ph-x', 'ph-list');
            }
        });
    });
    
    // Theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            toggleThemeCallback();
            
            // Update icon
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const icon = themeToggleBtn.querySelector('i');
            if (currentTheme === 'dark') {
                icon.classList.replace('ph-moon', 'ph-sun');
            } else {
                icon.classList.replace('ph-sun', 'ph-moon');
            }
        });
        
        // Init icon state based on current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = themeToggleBtn.querySelector('i');
        if (currentTheme === 'dark') {
            icon.classList.replace('ph-moon', 'ph-sun');
        }
    }
}
