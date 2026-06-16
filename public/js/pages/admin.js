// admin.js

// Callback global untuk Google Login
window.handleCredentialResponse = async (response) => {
    try {
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        if (res.ok) {
            sessionStorage.setItem('jwt_token', data.token);
            sessionStorage.setItem('jwt_role', data.role);
            sessionStorage.setItem('jwt_username', data.nama);
            window.location.reload();
        } else {
            alert('Login Gagal: ' + data.error);
        }
    } catch (err) {
        alert('Error menghubungi server: ' + err.message);
    }
};

export function renderAdmin() {
    const token = sessionStorage.getItem('jwt_token');
    const role = sessionStorage.getItem('jwt_role') || 'UNKNOWN';
    const username = sessionStorage.getItem('jwt_username') || 'Admin';
    const isLoggedIn = !!token;

    if (!isLoggedIn) {
        return `
            <div style="max-width: 450px; margin: 100px auto; text-align: center;" class="card fade-in">
                <i class="ph ph-shield-check" style="font-size: 4rem; color: var(--color-primary); margin-bottom: var(--space-4);"></i>
                <h2 style="margin-bottom: var(--space-2);">Portal Administrator</h2>
                <p style="color: var(--color-text-muted); margin-bottom: var(--space-6);">Silakan masuk menggunakan akun Google Anda.</p>
                
                <div id="google-signin-btn" style="display: flex; justify-content: center; margin-bottom: var(--space-6);"></div>

            </div>
        `;
    }

    // Role-based menu generation
    const menus = [
        { id: 'berita', label: 'Berita & Pengumuman', icon: 'ph-article' },
        { id: 'karya-siswa', label: 'Karya Siswa', icon: 'ph-palette' },
        { id: 'guru', label: 'Guru & Staf', icon: 'ph-users' },
        { id: 'kalender-akademik', label: 'Kalender Akademik', icon: 'ph-calendar' },
        { id: 'ekstrakurikuler', label: 'Ekstrakurikuler', icon: 'ph-basketball' },
        { id: 'piala', label: 'Prestasi', icon: 'ph-medal' },
        { id: 'fasilitas', label: 'Fasilitas', icon: 'ph-building' },
        { id: 'galeri', label: 'Galeri', icon: 'ph-image' },
        { id: 'unduhan', label: 'Unduhan', icon: 'ph-download-simple' },
        { id: 'carousel', label: 'Slide Banner', icon: 'ph-slideshow' },
        { id: 'info-penting', label: 'Info Penting', icon: 'ph-warning-circle' },
        { id: 'wa-blast', label: 'Blast WhatsApp', icon: 'ph-whatsapp-logo' },
        { id: 'tracer-study', label: 'Tracer Study', icon: 'ph-graduation-cap' },
        { id: 'siswa', label: 'Data Siswa Aktif', icon: 'ph-student' },
        { id: 'orang-tua', label: 'Data Orang Tua/Wali', icon: 'ph-users-three' },
        { id: 'buku-tamu', label: 'Buku Tamu', icon: 'ph-book-open-text' },
        { id: 'sekolah', label: 'Profil & Pengaturan', icon: 'ph-gear' }
    ];

    if (role === 'SUPER_ADMIN') {
        menus.push({ id: 'users', label: 'Kelola Admin', icon: 'ph-shield-check' });
    }

    const menuHtml = menus.map((m, idx) => `
        <button class="admin-tab-btn ${idx === 0 ? 'active' : ''}" data-target="${m.id}" data-label="${m.label}" style="display: flex; align-items: center; gap: var(--space-2); width: 100%; padding: var(--space-3); text-align: left; background: none; border: none; border-bottom: 1px solid var(--color-border); cursor: pointer; font-family: inherit; font-size: 1rem; color: ${idx===0 ? 'var(--color-primary)' : 'var(--color-text)'}; font-weight: ${idx===0 ? '600' : '400'}; transition: 0.2s;">
            <i class="ph ${m.icon}"></i> ${m.label}
        </button>
    `).join('');

    return `
        <div class="fade-in">
            <div class="page-header" style="background-image: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600')">
                <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="text-align: left;">
                        <h1>Dashboard Admin</h1>
                        <p>Selamat datang, ${username} <span class="badge badge-warning" style="margin-left:8px;">${role}</span></p>
                    </div>
                    <button id="admin-logout" class="btn btn-outline" style="border-color: white; color: white;">Logout</button>
                </div>
            </div>

            <section class="section container" style="display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: var(--space-8); align-items: start;">
                <!-- Sidebar Menu -->
                <div class="card" style="padding: 0; overflow: hidden; position: sticky; top: 100px;">
                    <div style="padding: var(--space-4); background: var(--color-surface); border-bottom: 1px solid var(--color-border);">
                        <h3 style="font-size: 1rem;">Menu Navigasi</h3>
                    </div>
                    <div id="admin-menu-container">
                        ${menuHtml}
                    </div>
                </div>

                <!-- Content Area -->
                <div class="card" id="admin-content-area" style="min-height: 500px;">
                    <div style="text-align:center; padding: 100px; color: var(--color-text-muted);">
                        <div class="spinner"></div>
                        <p style="margin-top: 1rem;">Memuat modul...</p>
                    </div>
                </div>
            </section>
            
            <!-- Modal Edit -->
            <div id="crud-modal" class="modal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.5);">
                <div class="modal-content card" style="margin: 5% auto; width: 80%; max-width: 600px; animation: slideUp 0.3s;">
                    <span id="close-modal" style="float:right; font-size:1.5rem; cursor:pointer;">&times;</span>
                    <h3 id="modal-title" style="margin-bottom:1rem; color:var(--color-primary);">Form</h3>
                    <form id="crud-form"></form>
                </div>
            </div>
        </div>
    `;
}

// Skema field untuk masing-masing entitas guna membangun form dinamis
const SCHEMAS = {
    'berita': [
        { key: 'judul', label: 'Judul Berita/Pengumuman', type: 'text', required: true },
        { key: 'kategori', label: 'Kategori', type: 'select', options: ['Berita', 'Pengumuman', 'Kegiatan', 'Prestasi'], required: true },
        { key: 'tanggal', label: 'Tanggal (Opsional, format YYYY-MM-DD)', type: 'date', required: false },
        { key: 'ringkasan', label: 'Ringkasan Pendek', type: 'text', required: true },
        { key: 'konten', label: 'Isi Lengkap', type: 'textarea', required: true },
        { key: 'gambar', label: 'URL Gambar (atau upload kosong)', type: 'text', required: false }
    ],
    'guru': [
        { key: 'nama', label: 'Nama Guru', type: 'text', required: true },
        { key: 'mapel', label: 'Mata Pelajaran', type: 'text', required: true },
        { key: 'telepon', label: 'No. WhatsApp', type: 'text', required: false },
        { key: 'foto', label: 'Tautan Foto (URL, opsional)', type: 'text', required: false }
    ],
    'kalender-akademik': [
        { key: 'agenda', label: 'Agenda Kegiatan', type: 'text', required: true },
        { key: 'tanggal', label: 'Tanggal Pelaksanaan', type: 'date', required: true }
    ],
    'ekstrakurikuler': [
        { key: 'nama', label: 'Nama Ekstrakurikuler', type: 'text', required: true },
        { key: 'kategori', label: 'Kategori', type: 'select', options: ['Wajib', 'Organisasi', 'Olahraga', 'Seni', 'Akademik', 'Lainnya'], required: true },
        { key: 'foto', label: 'Tautan Foto (URL, opsional)', type: 'text', required: false }
    ],
    'piala': [
        { key: 'nama', label: 'Nama Prestasi / Kejuaraan', type: 'text', required: true },
        { key: 'tahun', label: 'Tahun', type: 'text', required: true },
        { key: 'foto', label: 'Tautan Foto (URL, opsional)', type: 'text', required: false }
    ],
    'fasilitas': [
        { key: 'nama', label: 'Nama Fasilitas', type: 'text', required: true },
        { key: 'deskripsi', label: 'Deskripsi Singkat', type: 'text', required: true },
        { key: 'ikon', label: 'Class Icon (ex: ph-building)', type: 'text', required: true },
        { key: 'foto', label: 'Tautan Foto (URL, opsional)', type: 'text', required: false }
    ],
    'galeri': [
        { key: 'judul', label: 'Judul Media', type: 'text', required: true },
        { key: 'tipe', label: 'Tipe', type: 'select', options: ['FOTO', 'VIDEO'], required: true },
        { key: 'url', label: 'URL Gambar / YouTube', type: 'text', required: true },
        { key: 'thumbnail', label: 'URL Thumbnail (Jika Video)', type: 'text', required: false }
    ],
    'unduhan': [
        { key: 'nama', label: 'Nama File', type: 'text', required: true },
        { key: 'tipe', label: 'Tipe (PDF/DOC)', type: 'text', required: true },
        { key: 'ukuran', label: 'Ukuran (ex: 2 MB)', type: 'text', required: true },
        { key: 'link', label: 'URL Tautan', type: 'text', required: true }
    ],
    'carousel': [
        { key: 'judul', label: 'Judul Slide', type: 'text', required: true },
        { key: 'deskripsi', label: 'Subjudul', type: 'text', required: true },
        { key: 'gambar', label: 'URL Gambar Background', type: 'text', required: true }
    ],
    'info-penting': [
        { key: 'judul', label: 'Isi Informasi Penting', type: 'text', required: true },
        { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
        { key: 'link', label: 'Tautan Aksi (opsional)', type: 'text', required: false }
    ],
    'karya-siswa': [
        { key: 'judul', label: 'Judul Karya', type: 'text', required: true },
        { key: 'siswa', label: 'Nama Siswa/Kelompok', type: 'text', required: true },
        { key: 'kelas', label: 'Kelas', type: 'text', required: true },
        { key: 'deskripsi', label: 'Deskripsi Singkat', type: 'textarea', required: true },
        { key: 'foto', label: 'Tautan Foto Karya (URL)', type: 'text', required: true }
    ],
    'tracer-study': [
        { key: 'nama', label: 'Nama Alumni', type: 'text', required: true },
        { key: 'tahun', label: 'Tahun Lulus', type: 'text', required: true },
        { key: 'status', label: 'Status Lanjut', type: 'select', options: ['Kuliah', 'Kerja', 'Wirausaha', 'Lainnya'], required: true },
        { key: 'instansi', label: 'Nama Universitas/Perusahaan', type: 'text', required: true }
    ],
    'siswa': [
        { key: 'nama', label: 'Nama Siswa', type: 'text', required: true },
        { key: 'nisn', label: 'NISN', type: 'text', required: true },
        { key: 'kelas', label: 'Kelas', type: 'text', required: true },
        { key: 'telepon', label: 'No. WhatsApp Siswa', type: 'text', required: false }
    ],
    'orang-tua': [
        { key: 'nama', label: 'Nama Orang Tua/Wali', type: 'text', required: true },
        { key: 'namaSiswa', label: 'Nama Anak (Siswa)', type: 'text', required: true },
        { key: 'telepon', label: 'No. WhatsApp Orang Tua', type: 'text', required: false }
    ],
    'users': [
        { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
        { key: 'email', label: 'Email Akun Google (@gmail.com)', type: 'email', required: true },
        { key: 'role', label: 'Hak Akses', type: 'select', options: ['SUPER_ADMIN', 'ADMIN_HUMAS', 'ADMIN_KESISWAAN', 'ADMIN_KURIKULUM', 'ADMIN_SARPRAS'], required: true }
    ]
};

export function setupAdminEvents() {
    const API_URL = '/api';
    const isLoggedIn = !!sessionStorage.getItem('jwt_token');

    if (!isLoggedIn) {
        // Setup Google Sign-In Button
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: '666960979112-uqudnjl8ch0uvjmdqsv1dcc0rv1ckh3s.apps.googleusercontent.com', // Kunci Resmi Google
                callback: window.handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById('google-signin-btn'),
                { theme: 'outline', size: 'large', width: 300 }
            );
        }


        return;
    }

    const logoutBtn = document.getElementById('admin-logout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.reload();
        });
    }

    // Modal logic
    const modal = document.getElementById('crud-modal');
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const contentArea = document.getElementById('admin-content-area');
    const token = sessionStorage.getItem('jwt_token');

    let currentEntity = '';
    let currentDataList = [];

    window.openCrudModal = (id = null) => {
        const schema = SCHEMAS[currentEntity];
        if (!schema) return;

        let record = {};
        if (id !== null) {
            record = currentDataList.find(d => d.id === id) || {};
        }

        const formTitle = id !== null ? 'Edit Data' : 'Tambah Data Baru';
        document.getElementById('modal-title').innerText = formTitle;

        let html = '';
        schema.forEach(field => {
            const val = record[field.key] || '';
            let inputHtml = '';
            
            if (field.type === 'select') {
                const opts = field.options.map(opt => `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`).join('');
                inputHtml = `<select id="field-${field.key}" class="form-control" ${field.required?'required':''}>${opts}</select>`;
            } else if (field.type === 'textarea') {
                inputHtml = `<textarea id="field-${field.key}" class="form-control" rows="4" ${field.required?'required':''}>${val}</textarea>`;
            } else if (field.type === 'date') {
                // Formatting Date properly for input[type="date"]
                let dateVal = val;
                if (dateVal && dateVal.includes('T')) dateVal = dateVal.split('T')[0];
                inputHtml = `<input type="${field.type}" id="field-${field.key}" class="form-control" value="${dateVal}" ${field.required?'required':''}>`;
            } else {
                inputHtml = `<input type="${field.type}" id="field-${field.key}" class="form-control" value="${val}" ${field.required&&field.type!=='password'?'required':''}>`;
            }

            html += `
                <div class="form-group">
                    <label class="form-label">${field.label}</label>
                    ${inputHtml}
                </div>
            `;
        });

        html += `<button type="submit" class="btn btn-primary" style="width:100%;">Simpan</button>`;
        const form = document.getElementById('crud-form');
        form.innerHTML = html;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const payload = {};
            schema.forEach(field => {
                const val = document.getElementById(`field-${field.key}`).value;
                if (val) payload[field.key] = val;
            });

            try {
                let url = `${API_URL}/${currentEntity === 'users' ? 'admin/users' : currentEntity}`;
                let method = id !== null ? 'PUT' : 'POST';
                if (id !== null) url += `/${id}`;

                const res = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    alert('Berhasil disimpan!');
                    modal.style.display = 'none';
                    loadContent(currentEntity, document.querySelector(`button[data-target="${currentEntity}"]`).getAttribute('data-label'));
                } else {
                    const err = await res.json();
                    alert('Gagal: ' + err.error);
                }
            } catch (error) {
                alert('Terjadi kesalahan koneksi.');
            }
        };

        modal.style.display = 'block';
    };

    window.deleteRecord = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
        try {
            let url = `${API_URL}/${currentEntity === 'users' ? 'admin/users' : currentEntity}/${id}`;
            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Data dihapus!');
                loadContent(currentEntity, document.querySelector(`button[data-target="${currentEntity}"]`).getAttribute('data-label'));
            } else {
                alert('Gagal menghapus data.');
            }
        } catch (error) {
            alert('Kesalahan koneksi.');
        }
    };

    const loadContent = async (target, targetLabel) => {
        currentEntity = target;
        contentArea.innerHTML = `<h3 style="margin-bottom: 1rem; text-transform: capitalize;">Modul: ${targetLabel}</h3><div class="spinner"></div>`;
        
        if (target === 'info-penting') {
            contentArea.innerHTML = `<h3 style="margin-bottom: 1rem; text-transform: capitalize;">Modul: ${targetLabel}</h3>
                <div style="background: var(--color-surface); padding: var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-4); border: 1px solid var(--color-border);">
                    <p style="font-size: 0.9rem; color: var(--color-text-muted);"><i class="ph ph-info"></i> Data ini akan tampil di widget Info Penting pada Halaman Beranda (Maksimal 3 terbaru).</p>
                </div>
            `;
        }

        if (target === 'wa-blast') {
            contentArea.innerHTML = `<h3 style="margin-bottom: 1rem; text-transform: capitalize;">Modul: ${targetLabel}</h3>
                <div style="background: var(--color-surface); padding: var(--space-4); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--color-border);">
                    <div style="margin-bottom: var(--space-6); background: var(--color-primary-light); padding: var(--space-4); border-radius: var(--radius-md);">
                        <h4 style="color: var(--color-primary-dark); display: flex; align-items: center; gap: 8px;"><i class="ph ph-whatsapp-logo" style="font-size: 1.5rem;"></i> Kirim Pesan Massal (Blast)</h4>
                        <p style="font-size: 0.9rem; color: var(--color-primary-dark); margin-top: 8px;">Pesan yang dikirim melalui form ini akan disebar ke WhatsApp target sesuai pilihan Anda secara otomatis oleh Bot.</p>
                    </div>
                    <form id="form-wa-blast">
                        <div class="form-group">
                            <label>Target Penerima</label>
                            <select id="wa_target" class="form-control" required>
                                <option value="SEMUA">Semua Terdaftar (Siswa, Guru, Ortu, PPDB)</option>
                                <option value="SISWA">Semua Siswa</option>
                                <option value="GURU">Semua Guru & Staf</option>
                                <option value="ORANG_TUA">Semua Orang Tua/Wali</option>
                                <option value="PPDB">Semua Pendaftar PPDB</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Isi Pesan / Pengumuman</label>
                            <textarea id="wa_pesan" class="form-control" rows="8" placeholder="Ketik pesan WhatsApp di sini..." required></textarea>
                            <small style="color: var(--color-text-muted); display: block; margin-top: 4px;">*Mendukung format WA: *tebal*, _miring_, ~coret~.</small>
                        </div>
                        <button type="submit" id="btn-wa-blast" class="btn btn-primary" style="font-size: 1.1rem; padding: var(--space-3);"><i class="ph ph-paper-plane-right"></i> Kirim Broadcast Sekarang</button>
                    </form>
                </div>
            `;
            
            document.getElementById('form-wa-blast').onsubmit = async (e) => {
                e.preventDefault();
                if (!confirm('Apakah Anda yakin ingin mengirim pesan massal ini ke semua target yang dipilih?')) return;
                
                const btn = document.getElementById('btn-wa-blast');
                btn.disabled = true;
                btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Memproses Pengiriman...';
                
                const payload = {
                    target: document.getElementById('wa_target').value,
                    pesan: document.getElementById('wa_pesan').value
                };
                
                try {
                    const res = await fetch(`${API_URL}/wa-blast`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(payload)
                    });
                    
                    const data = await res.json();
                    if (res.ok) {
                        alert('Berhasil! ' + data.message);
                        document.getElementById('wa_pesan').value = '';
                    } else {
                        alert('Gagal: ' + (data.error || 'Terjadi kesalahan pada bot WA.'));
                    }
                } catch (err) {
                    alert('Kesalahan jaringan: ' + err.message);
                } finally {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="ph ph-paper-plane-right"></i> Kirim Broadcast Sekarang';
                }
            };
            return;
        }

        if (target === 'sekolah') {
            fetch(`${API_URL}/sekolah`)
                .then(res => res.json())
                .then(data => {
                    contentArea.innerHTML = `<h3 style="margin-bottom: 1rem; text-transform: capitalize;">Modul: ${targetLabel}</h3>
                        <form id="form-sekolah">
                            <div class="grid-2">
                                <div class="form-group"><label>Nama Sekolah</label><input type="text" id="s_nama" class="form-control" value="${data.nama}"></div>
                                <div class="form-group"><label>NPSN</label><input type="text" id="s_npsn" class="form-control" value="${data.npsn}"></div>
                            </div>
                            <div class="grid-2">
                                <div class="form-group"><label>Telepon</label><input type="text" id="s_telp" class="form-control" value="${data.telepon}"></div>
                                <div class="form-group"><label>Email</label><input type="email" id="s_email" class="form-control" value="${data.email}"></div>
                            </div>
                            <div class="form-group"><label>Alamat</label><input type="text" id="s_alamat" class="form-control" value="${data.alamat}"></div>
                            <div class="form-group"><label>Visi</label><textarea id="s_visi" class="form-control">${data.visi}</textarea></div>
                            <div class="form-group"><label>Misi</label><textarea id="s_misi" class="form-control" rows="4">${data.misi}</textarea></div>
                            <div class="form-group"><label>Sejarah</label><textarea id="s_sejarah" class="form-control" rows="4">${data.sejarah}</textarea></div>
                            <div class="form-group">
                                <label>Teks Berjalan Beranda (Running Text)</label>
                                <input type="text" id="s_running_text" class="form-control" value="${data.runningText || ''}">
                            </div>
                            <div class="form-group">
                                <label>URL Foto Gedung / Profil (Opsional)</label>
                                <input type="text" id="s_foto_profil" class="form-control" value="${data.fotoProfil || ''}" placeholder="https://...">
                            </div>
                            <div class="form-group">
                                <label>URL Foto Sertifikat Akreditasi (Opsional)</label>
                                <input type="text" id="s_foto_akreditasi" class="form-control" value="${data.fotoAkreditasi || ''}" placeholder="https://...">
                            </div>
                            <button type="submit" class="btn btn-primary">Simpan Profil</button>
                        </form>
                    `;
                    document.getElementById('form-sekolah').onsubmit = async (e) => {
                        e.preventDefault();
                        const payload = {
                            nama: document.getElementById('s_nama').value,
                            npsn: document.getElementById('s_npsn').value,
                            telepon: document.getElementById('s_telp').value,
                            email: document.getElementById('s_email').value,
                            alamat: document.getElementById('s_alamat').value,
                            visi: document.getElementById('s_visi').value,
                            misi: document.getElementById('s_misi').value,
                            sejarah: document.getElementById('s_sejarah').value,
                            fotoAkreditasi: document.getElementById('s_foto_akreditasi').value,
                            fotoProfil: document.getElementById('s_foto_profil').value,
                            runningText: document.getElementById('s_running_text').value
                        };
                        try {
                            const res = await fetch(`${API_URL}/sekolah`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify(payload)
                            });
                            if (res.ok) {
                                alert('Berhasil disimpan!');
                            } else {
                                const errData = await res.json();
                                alert('Gagal menyimpan profil: ' + (errData.error || 'Terjadi kesalahan pada server.'));
                            }
                        } catch (err) { alert('Error: ' + err.message); }
                    };
                });
            return;
        }

        // Generic CRUD Data Fetch
        let url = `${API_URL}/${target === 'users' ? 'admin/users' : target}`;
        try {
            const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Akses ditolak atau data tidak ditemukan.');
            const data = await res.json();
            currentDataList = data;

            const schema = SCHEMAS[target];
            if (!schema) {
                contentArea.innerHTML += `<p>Skema tampilan belum dikonfigurasi untuk modul ini.</p>`;
                return;
            }

            let tableRows = data.map((d, i) => {
                let cols = schema.map(s => {
                    let val = d[s.key];
                    if (s.type === 'password') val = '***';
                    if (val && typeof val === 'string' && val.length > 50) val = val.substring(0, 50) + '...';
                    return `<td>${val || '-'}</td>`;
                }).join('');
                
                return `
                    <tr>
                        <td>${i + 1}</td>
                        ${cols}
                        <td>
                            <button class="btn btn-sm btn-outline" style="padding: 0.2rem 0.5rem;" onclick="window.openCrudModal(${d.id})"><i class="ph ph-pencil"></i> Edit</button>
                            <button class="btn btn-sm" style="padding: 0.2rem 0.5rem; background: var(--color-danger); color: white;" onclick="window.deleteRecord(${d.id})"><i class="ph ph-trash"></i></button>
                        </td>
                    </tr>
                `;
            }).join('');

            if (data.length === 0) tableRows = `<tr><td colspan="${schema.length + 2}" style="text-align:center;">Belum ada data</td></tr>`;

            const tableHeaders = schema.map(s => `<th>${s.label}</th>`).join('');

            contentArea.innerHTML = `
                <h3 style="margin-bottom: 1rem; text-transform: capitalize;">Modul: ${targetLabel}</h3>
                <div style="display:flex; justify-content:flex-end; margin-bottom: 1rem;">
                    <button class="btn btn-primary" onclick="window.openCrudModal()"><i class="ph ph-plus"></i> Tambah Data Baru</button>
                </div>
                <div class="table-responsive" style="overflow-x: auto;">
                    <table class="table" style="font-size: 0.85rem; width: 100%;">
                        <thead>
                            <tr>
                                <th>No</th>
                                ${tableHeaders}
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (error) {
            contentArea.innerHTML = `<h3 style="margin-bottom: 1rem; text-transform: capitalize;">Modul: ${targetLabel}</h3><div style="color:var(--color-danger); padding:1rem; border:1px solid var(--color-danger); border-radius: var(--radius-md);">Error: ${error.message}</div>`;
        }
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.color = 'var(--color-text)';
                b.style.fontWeight = '400';
            });
            btn.classList.add('active');
            btn.style.color = 'var(--color-primary)';
            btn.style.fontWeight = '600';
            loadContent(btn.getAttribute('data-target'), btn.getAttribute('data-label'));
        });
    });

    if (tabBtns.length > 0) {
        loadContent(tabBtns[0].getAttribute('data-target'), tabBtns[0].getAttribute('data-label'));
    }
}
