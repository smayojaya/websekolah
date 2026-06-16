// app.js - Core Router & State Management

import { renderNavbar, setupNavbarEvents } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

// Import pages
import { renderHome, setupHomeEvents } from './pages/home.js';
import { renderProfil } from './pages/profil.js';
import { renderAkreditasi } from './pages/akreditasi.js';
import { renderFasilitas } from './pages/fasilitas.js';
import { renderAkademik } from './pages/akademik.js';
import { renderBerita } from './pages/berita.js';
import { renderUnduhan } from './pages/unduhan.js';
import { renderKontak, setupKontakEvents } from './pages/kontak.js';
import { renderAlumni, setupAlumniEvents } from './pages/alumni.js';
import { renderBlog, setupBlogEvents } from './pages/blog.js';
import { renderAdmin, setupAdminEvents } from './pages/admin.js';
import { renderGaleri } from './pages/galeri.js';
const appRoot = document.getElementById('app-root');

// Router Definition
const routes = {
    '': renderHome,
    '#/': renderHome,
    '#/profil': renderProfil,
    '#/akreditasi': renderAkreditasi,
    '#/fasilitas': renderFasilitas,
    '#/akademik': renderAkademik,
    '#/berita': renderBerita,
    '#/unduhan': renderUnduhan,
    '#/kontak': renderKontak,
    '#/alumni': renderAlumni,
    '#/blog': renderBlog,
    '#/admin': renderAdmin,
    '#/galeri': renderGaleri
};

// Handle Routing
async function router() {
    const hash = window.location.hash;
    
    // Show loader
    appRoot.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';
    
    // Small delay to show smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get page render function
    const renderPage = routes[hash] || renderHome;
    
    // Render content
    appRoot.innerHTML = renderPage();
    
    // Setup specific events/plugins after rendering
    if (hash === '' || hash === '#/') {
        setupHomeEvents();
    } else if (hash === '#/kontak') {
        setupKontakEvents();
    } else if (hash === '#/alumni') {
        setupAlumniEvents();
    } else if (hash === '#/blog') {
        setupBlogEvents();
    } else if (hash === '#/admin') {
        setupAdminEvents();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === (hash || '#/')) {
            link.classList.add('active');
        }
    });
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize App
function initApp() {
    initTheme();
    
    // Render static components
    document.getElementById('navbar-container').innerHTML = renderNavbar();
    document.getElementById('footer-container').innerHTML = renderFooter();
    
    // Setup global events
    setupNavbarEvents(toggleTheme);
    
    // Listen to hash changes for routing
    window.addEventListener('hashchange', router);
    
    // Initial route load
    router();
}

// Boot up
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
