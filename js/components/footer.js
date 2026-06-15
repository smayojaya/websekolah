// footer.js
import { siteData } from '../data.js';

export function renderFooter() {
    return `
        <div class="footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-about">
                        <h3 style="display: flex; align-items: center; gap: 8px;"><img src="assets/logo.png" alt="SMAYo Logo" style="height: 32px; object-fit: contain;"> ${siteData.sekolah.nama}</h3>
                        <p>Unggul dalam mutu, berpijak pada iman dan takwa. Mencetak generasi bangsa yang berprestasi dan berkarakter.</p>
                        <br>
                        <p><i class="ph ph-map-pin"></i> ${siteData.sekolah.alamat}</p>
                        <p><i class="ph ph-phone"></i> ${siteData.sekolah.telepon}</p>
                        <p><i class="ph ph-envelope-simple"></i> ${siteData.sekolah.email}</p>
                    </div>
                    
                    <div class="footer-links">
                        <h4>Tautan Cepat</h4>
                        <ul>
                            <li><a href="#/profil">Profil Sekolah</a></li>
                            <li><a href="#/galeri">Galeri & Karya</a></li>
                            <li><a href="#/akademik">Info Akademik</a></li>
                            <li><a href="#/unduhan">Pusat Unduhan</a></li>
                            <li><a href="#/alumni">Pojok Alumni</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-links">
                        <h4>Media Sosial</h4>
                        <ul>
                            <li><a href="#"><i class="ph ph-instagram-logo"></i> Instagram</a></li>
                            <li><a href="#"><i class="ph ph-youtube-logo"></i> YouTube</a></li>
                            <li><a href="#"><i class="ph ph-facebook-logo"></i> Facebook</a></li>
                            <li><a href="#"><i class="ph ph-twitter-logo"></i> Twitter</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} ${siteData.sekolah.nama}. Hak Cipta Dilindungi.</p>
                </div>
            </div>
        </div>
    `;
}
