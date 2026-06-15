require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'smayo-secret-key-super-safe';

// --- WHATSAPP BOT SETUP ---
let waReady = false;
const waClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        timeout: 60000
    }
});

waClient.on('qr', (qr) => {
    console.log('\n--- SCAN QR CODE INI UNTUK WHATSAPP BOT ---');
    qrcode.generate(qr, { small: true });
    console.log('------------------------------------------\n');
});

waClient.on('ready', () => {
    console.log('WhatsApp Bot is ready! Siap mengirim notifikasi.');
    waReady = true;
});

waClient.initialize().catch(err => {
    console.error('[WA BOT] Gagal menginisialisasi WhatsApp:', err.message);
    console.log('[WA BOT] Server tetap berjalan, namun fitur notifikasi WA sedang tidak aktif.');
});

// WA Bot Chat Auto-Responder
waClient.on('message', async (msg) => {
    try {
        const chat = await msg.getChat();
        if (chat.isGroup) return; // Hanya merespon pesan pribadi

        const pesanMasuk = msg.body.toLowerCase().trim();
        
        // 1. Menu Utama
        if (pesanMasuk === 'menu' || pesanMasuk === '!menu' || pesanMasuk === 'help') {
            const balasan = `🤖 *Asisten Virtual SMAYO*\n\nHalo! Saya adalah bot asisten resmi SMA 1 Yosowilangun. Balas pesan ini dengan mengetik kata kunci berikut untuk mendapatkan informasi:\n\n📖 *profil* - Sejarah Singkat Sekolah\n🎯 *visi* - Visi & Misi Sekolah\n📝 *ppdb* - Info Pendaftaran Siswa Baru\n🗓️ *agenda* - Kalender Kegiatan Sekolah\n📞 *kontak* - Hubungi Kami & Alamat\n📊 *absen <NISN>* - Cek Kehadiran Siswa\n📅 *jadwal <Kelas>* - Cek Jadwal Pelajaran\n⚽ *ekskul* - Daftar Ekstrakurikuler\n🏆 *prestasi* - Daftar Prestasi\n🏢 *fasilitas* - Fasilitas Sekolah\n👨‍💻 *cs* - Hubungi Admin/Humas\n\n_Ketik salah satu kata kunci di atas untuk memulai._`;
            await msg.reply(balasan);
        }
        // 2. Profil
        else if (pesanMasuk === 'profil' || pesanMasuk === '!profil') {
            const sekolah = await prisma.sekolah.findUnique({ where: { id: 1 } });
            await msg.reply(`📖 *Profil & Sejarah SMAYO*\n\n${sekolah?.sejarah || 'Belum diisi.'}\n\n✨ Kunjungi website kami untuk profil selengkapnya!`);
        }
        // 3. Visi
        else if (pesanMasuk === 'visi' || pesanMasuk === '!visi' || pesanMasuk === 'misi') {
            const sekolah = await prisma.sekolah.findUnique({ where: { id: 1 } });
            await msg.reply(`🎯 *Visi SMAYO:*\n${sekolah?.visi || '-'}\n\n*Misi SMAYO:*\n${sekolah?.misi || '-'}`);
        }
        // 4. PPDB
        else if (pesanMasuk === 'ppdb' || pesanMasuk === '!ppdb') {
            const sekolah = await prisma.sekolah.findUnique({ where: { id: 1 } });
            if (sekolah?.ppdbAktif) {
                await msg.reply(`📝 *Pendaftaran Peserta Didik Baru (PPDB) SMAYO SEDANG DIBUKA! 🎉*\n\nSegera daftarkan diri Anda dan raih masa depan gemilang bersama kami. Hubungi CS atau kunjungi sekolah untuk info lebih lanjut.`);
            } else {
                await msg.reply(`📝 *PPDB SMAYO*\n\nMohon maaf, saat ini pendaftaran siswa baru belum dibuka. Terus ikuti informasi terbaru di website resmi kami!`);
            }
        }
        // 5. Agenda
        else if (pesanMasuk === 'agenda' || pesanMasuk === '!agenda') {
            const agenda = await prisma.kalenderAkademik.findMany({ take: 3, orderBy: { tanggal: 'asc' } });
            if (agenda.length > 0) {
                let pesan = `🗓️ *Agenda Terdekat SMAYO:*\n\n`;
                agenda.forEach((a, i) => {
                    const tgl = a.tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                    pesan += `${i+1}. ${a.agenda} (${tgl})\n`;
                });
                await msg.reply(pesan);
            } else {
                await msg.reply(`🗓️ *Agenda*\nBelum ada agenda terdekat.`);
            }
        }
        // 6. Kontak
        else if (pesanMasuk === 'kontak' || pesanMasuk === '!kontak') {
            const sekolah = await prisma.sekolah.findUnique({ where: { id: 1 } });
            await msg.reply(`📞 *Hubungi Kami SMAYO:*\n\n📍 Alamat: ${sekolah?.alamat}\n☎️ Telepon: ${sekolah?.telepon}\n📧 Email: ${sekolah?.email}\n\n🗺️ Peta: https://www.google.com/maps/search/?api=1&query=${sekolah?.koordinatX},${sekolah?.koordinatY}`);
        }
        // 7. Absen (misal: absen 123456)
        else if (pesanMasuk.startsWith('absen ')) {
            const nisn = pesanMasuk.split(' ')[1];
            const siswa = await prisma.siswa.findFirst({ where: { nisn } });
            if (!siswa) {
                await msg.reply(`❌ Siswa dengan NISN *${nisn}* tidak ditemukan.`);
                return;
            }
            const absen = await prisma.absensi.findFirst({ where: { nisn } });
            if (!absen) {
                await msg.reply(`📊 *Kehadiran ${siswa.nama}*\n\nData absensi belum tersedia untuk semester ini.`);
            } else {
                const total = absen.hadir + absen.izin + absen.sakit + absen.alpa;
                const persentase = total > 0 ? Math.round((absen.hadir / total) * 100) : 0;
                await msg.reply(`📊 *Laporan Kehadiran*\n\n👤 Nama: *${siswa.nama}*\n🏫 Kelas: ${siswa.kelas}\nSemester: ${absen.semester}\n\n✅ Hadir: ${absen.hadir}\n💌 Izin: ${absen.izin}\n🤒 Sakit: ${absen.sakit}\n❌ Alpa: ${absen.alpa}\n\n*Persentase Kehadiran: ${persentase}%*`);
            }
        }
        else if (pesanMasuk === 'absen') {
            await msg.reply(`Ketik *absen <NISN>* untuk melihat data absensi.\nContoh: *absen 123456*`);
        }
        // 8. Jadwal (misal: jadwal x-1)
        else if (pesanMasuk.startsWith('jadwal ')) {
            const kelas = pesanMasuk.substring(7).trim().toUpperCase(); // X-1
            const jadwalList = await prisma.jadwalPelajaran.findMany({ where: { kelas } });
            if (jadwalList.length === 0) {
                await msg.reply(`❌ Jadwal pelajaran untuk kelas *${kelas}* tidak ditemukan.`);
            } else {
                let pesan = `📅 *Jadwal Pelajaran Kelas ${kelas}*\n\n`;
                // Kelompokkan berdasar hari
                const days = [...new Set(jadwalList.map(j => j.hari))];
                for (const d of days) {
                    pesan += `*${d}*\n`;
                    const jHari = jadwalList.filter(j => j.hari === d).sort((a,b) => a.jamMulai.localeCompare(b.jamMulai));
                    jHari.forEach(j => {
                        pesan += `⏰ ${j.jamMulai}-${j.jamSelesai} | ${j.mapel} (${j.guru})\n`;
                    });
                    pesan += '\n';
                }
                await msg.reply(pesan.trim());
            }
        }
        else if (pesanMasuk === 'jadwal') {
            await msg.reply(`Ketik *jadwal <Kelas>* untuk melihat jadwal pelajaran.\nContoh: *jadwal X-1*`);
        }
        // 9. Ekskul
        else if (pesanMasuk === 'ekskul' || pesanMasuk === '!ekskul') {
            const ekskulList = await prisma.ekstrakurikuler.findMany();
            if (ekskulList.length === 0) {
                await msg.reply(`Belum ada data ekstrakurikuler.`);
            } else {
                let pesan = `⚽ *Daftar Ekstrakurikuler SMAYO*\n\n`;
                ekskulList.forEach(e => {
                    pesan += `- ${e.nama} (${e.kategori})\n`;
                });
                await msg.reply(pesan);
            }
        }
        // 10. Prestasi
        else if (pesanMasuk === 'prestasi' || pesanMasuk === '!prestasi') {
            const prestasiList = await prisma.piala.findMany({ take: 5, orderBy: { tahun: 'desc' } });
            if (prestasiList.length === 0) {
                await msg.reply(`Belum ada data prestasi.`);
            } else {
                let pesan = `🏆 *Prestasi Terbaru SMAYO*\n\n`;
                prestasiList.forEach(p => {
                    pesan += `- ${p.nama} (${p.tahun})\n`;
                });
                await msg.reply(pesan);
            }
        }
        // 11. Fasilitas
        else if (pesanMasuk === 'fasilitas' || pesanMasuk === '!fasilitas') {
            const fasilitas = await prisma.fasilitas.findMany();
            if (fasilitas.length === 0) {
                await msg.reply(`Belum ada data fasilitas.`);
            } else {
                let pesan = `🏢 *Fasilitas Unggulan SMAYO*\n\n`;
                fasilitas.forEach(f => {
                    pesan += `✅ *${f.nama}*\n_${f.deskripsi}_\n\n`;
                });
                await msg.reply(pesan.trim());
            }
        }
        // 12. CS / Admin
        else if (pesanMasuk === 'cs' || pesanMasuk === '!cs') {
            // Bisa menggunakan nomor admin dari db, atau statis
            const sekolah = await prisma.sekolah.findUnique({ where: { id: 1 } });
            await msg.reply(`👨‍💻 *Layanan Admin/Humas SMAYO*\n\nUntuk kendala rumit atau pertanyaan lebih lanjut, silakan hubungi langsung staf kami melalui nomor berikut:\n\n📱 *Admin/Humas:* ${sekolah?.telepon || '08123456789'}\n\nAtau kunjungi ruang Tata Usaha pada jam kerja (07.00 - 15.00 WIB).`);
        }

    } catch (err) {
        console.error('[WA BOT CHAT] Gagal memproses pesan:', err.message);
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files untuk backend uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Serve static files untuk frontend (Aplikasi Utama)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route untuk root URL (Frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// JWT Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // { id, email, nama, role }
        next();
    });
};

// Role Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || (!allowedRoles.includes(req.user.role) && req.user.role !== 'SUPER_ADMIN')) {
            return res.status(403).json({ error: 'Akses ditolak: Peran tidak memiliki izin' });
        }
        next();
    };
};

// Daftar seluruh role admin biasa
const ALL_ADMINS = ['ADMIN_HUMAS', 'ADMIN_KESISWAAN', 'ADMIN_KURIKULUM', 'ADMIN_SARPRAS'];

// ================= API ROUTES =================

// --- Auth (Google OAuth) ---
app.post('/api/auth/google', async (req, res) => {
    try {
        const { credential, emailMock } = req.body;
        
        // 1. Verifikasi Google ID Token
        let payload;
        try {
            if (!credential && GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
                throw new Error("MOCK_MODE");
            }
            const ticket = await oauthClient.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (err) {
            // Jika CLIENT_ID masih placeholder, kita buat mock verifikasi untuk tahap awal developer mode
            if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
                console.warn("[AUTH] MOCK LOGIN AKTIF KARENA GOOGLE_CLIENT_ID BELUM DIATUR");
                payload = { email: emailMock || 'sman01yosowilangun@gmail.com', name: 'Mock Admin User' };
            } else {
                return res.status(401).json({ error: 'Token Google tidak valid.' });
            }
        }

        const { email, name } = payload;

        // 2. Cek apakah ini Superadmin absolut
        if (email === 'sman01yosowilangun@gmail.com') {
            // Cek jika Superadmin belum ada di database, kita buat otomatis untuk mencegah error list admin
            let superAdmin = await prisma.admin.findUnique({ where: { email } });
            if (!superAdmin) {
                superAdmin = await prisma.admin.create({
                    data: { email, nama: name, role: 'SUPER_ADMIN' }
                });
            }
            const token = jwt.sign({ id: superAdmin.id, email: superAdmin.email, nama: superAdmin.nama, role: 'SUPER_ADMIN' }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, role: 'SUPER_ADMIN', email: superAdmin.email, nama: superAdmin.nama });
        }

        // 3. Cek apakah admin terdaftar di database
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(403).json({ error: 'Akses Ditolak: Email Anda belum didaftarkan oleh Superadmin.' });
        }

        // 4. Jika terdaftar, berikan token
        const token = jwt.sign({ id: admin.id, email: admin.email, nama: admin.nama, role: admin.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, role: admin.role, email: admin.email, nama: admin.nama });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Upload Endpoint ---
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// --- User/Admin Management (Khusus SUPER_ADMIN) ---
app.get('/api/admin/users', authenticateToken, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
    const users = await prisma.admin.findMany({ select: { id: true, email: true, nama: true, role: true } });
    res.json(users);
});
app.post('/api/admin/users', authenticateToken, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
    try {
        const { email, nama, role } = req.body;
        const user = await prisma.admin.create({ data: { email, nama, role } });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: "Gagal: Email mungkin sudah terdaftar" });
    }
});
app.delete('/api/admin/users/:id', authenticateToken, authorizeRoles('SUPER_ADMIN'), async (req, res) => {
    await prisma.admin.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
});

// --- Sekolah ---
app.get('/api/sekolah', async (req, res) => {
    try {
        const sekolah = await prisma.sekolah.findUnique({ where: { id: 1 } });
        res.json(sekolah);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/sekolah', authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.koordinatX) data.koordinatX = parseFloat(data.koordinatX);
        if (data.koordinatY) data.koordinatY = parseFloat(data.koordinatY);
        
        const result = await prisma.sekolah.upsert({
            where: { id: 1 },
            update: data,
            create: { 
                id: 1, 
                akreditasi: "A",
                koordinatX: -8.212041,
                koordinatY: 113.298285,
                ...data 
            }
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Custom POST Berita & Info Penting (Dengan Notif WA) ---
// Notifikasi dikirimkan jika ada info penting baru atau pengumuman.
const broadcastWhatsapp = async (pesan, target = 'SEMUA') => {
    if (!waReady) return;
    try {
        let phoneNumbers = [];
        
        // Kumpulkan nomor berdasarkan target
        if (target === 'SEMUA' || target === 'GURU') {
            const guruList = await prisma.guru.findMany();
            guruList.forEach(g => g.telepon && phoneNumbers.push(g.telepon));
        }
        if (target === 'SEMUA' || target === 'SISWA') {
            const siswaList = await prisma.siswa.findMany();
            siswaList.forEach(s => s.telepon && phoneNumbers.push(s.telepon));
        }
        if (target === 'SEMUA' || target === 'ORANG_TUA') {
            const ortuList = await prisma.orangTua.findMany();
            ortuList.forEach(o => o.telepon && phoneNumbers.push(o.telepon));
        }

        // Hapus nomor duplikat (unik)
        phoneNumbers = [...new Set(phoneNumbers)];

        let sentCount = 0;
        for (const telepon of phoneNumbers) {
            if (telepon) {
                try {
                    let noHp = telepon.replace(/\D/g, '');
                    if (noHp.startsWith('0')) noHp = '62' + noHp.substring(1);
                    const chatId = noHp + '@c.us';
                    
                    const isRegistered = await waClient.isRegisteredUser(chatId);
                    if (isRegistered) {
                        await waClient.sendMessage(chatId, pesan);
                        sentCount++;
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } else {
                        console.log(`[WA BOT] Nomor ${noHp} tidak terdaftar di WhatsApp, dilewati.`);
                    }
                } catch (sendErr) {
                    console.error(`[WA BOT] Gagal mengirim ke nomor ${telepon}:`, sendErr.message);
                }
            }
        }
        console.log(`[WA BOT] Selesai. Broadcast berhasil terkirim ke ${sentCount} nomor valid (Target: ${target}).`);
    } catch (err) {
        console.error('[WA BOT] Kesalahan sistem saat broadcast:', err.message);
    }
};

// --- Endpoint Khusus WA Blast ---
app.post('/api/wa-blast', authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    try {
        const { pesan, target } = req.body;
        if (!pesan) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
        }
        if (!waReady) {
            return res.status(400).json({ error: 'WhatsApp Bot belum siap atau belum di-scan' });
        }
        
        // Panggil fungsi broadcastWhatsapp secara asinkron tanpa menunggu selesai agar response tidak timeout
        broadcastWhatsapp(pesan, target || 'SEMUA');
        
        res.json({ success: true, message: 'Proses Blast WhatsApp sedang berjalan di latar belakang...' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/info-penting', authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.tanggal) data.tanggal = new Date(data.tanggal);
        const result = await prisma.infoPenting.create({ data });
        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/berita', authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.tanggal) data.tanggal = new Date(data.tanggal);
        const result = await prisma.berita.create({ data });
        
        // Broadcast WA untuk Berita dinonaktifkan karena sudah ada fitur WA Blast terpisah
        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Generic CRUD Factory ---
const createCrudRoutes = (entityName, modelName, allowedRoles) => {
    // GET All
    app.get(`/api/${entityName}`, async (req, res) => {
        try {
            const data = await prisma[modelName].findMany();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET One
    app.get(`/api/${entityName}/:id`, async (req, res) => {
        try {
            const data = await prisma[modelName].findUnique({ where: { id: parseInt(req.params.id) } });
            if (data) res.json(data);
            else res.status(404).json({ error: 'Not found' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // POST (Create)
    app.post(`/api/${entityName}`, authenticateToken, authorizeRoles(...allowedRoles), async (req, res) => {
        try {
            const data = { ...req.body };
            if (data.tanggal) data.tanggal = new Date(data.tanggal);
            const result = await prisma[modelName].create({ data });
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // PUT (Update)
    app.put(`/api/${entityName}/:id`, authenticateToken, authorizeRoles(...allowedRoles), async (req, res) => {
        try {
            const data = { ...req.body };
            if (data.tanggal) data.tanggal = new Date(data.tanggal);
            const result = await prisma[modelName].update({
                where: { id: parseInt(req.params.id) },
                data
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE
    app.delete(`/api/${entityName}/:id`, authenticateToken, authorizeRoles(...allowedRoles), async (req, res) => {
        try {
            await prisma[modelName].delete({ where: { id: parseInt(req.params.id) } });
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// --- Setup CRUD for Entities (Exclude custom POSTs already defined) ---
// We redefine generic PUT and DELETE for berita & info-penting
app.put(`/api/berita/:id`, authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    const data = { ...req.body };
    if (data.tanggal) data.tanggal = new Date(data.tanggal);
    const result = await prisma.berita.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(result);
});
app.delete(`/api/berita/:id`, authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    await prisma.berita.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
});
app.get(`/api/berita`, async (req, res) => { res.json(await prisma.berita.findMany()); });
app.get(`/api/berita/:id`, async (req, res) => { res.json(await prisma.berita.findUnique({ where: { id: parseInt(req.params.id) } })); });

app.put(`/api/info-penting/:id`, authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    const data = { ...req.body };
    if (data.tanggal) data.tanggal = new Date(data.tanggal);
    const result = await prisma.infoPenting.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(result);
});
app.delete(`/api/info-penting/:id`, authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    await prisma.infoPenting.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
});
app.get(`/api/info-penting`, async (req, res) => { res.json(await prisma.infoPenting.findMany()); });
app.get(`/api/info-penting/:id`, async (req, res) => { res.json(await prisma.infoPenting.findUnique({ where: { id: parseInt(req.params.id) } })); });

createCrudRoutes('fasilitas', 'fasilitas', ALL_ADMINS);
createCrudRoutes('guru', 'guru', ALL_ADMINS);
createCrudRoutes('ekstrakurikuler', 'ekstrakurikuler', ALL_ADMINS);
createCrudRoutes('unduhan', 'unduhan', ALL_ADMINS);
createCrudRoutes('piala', 'piala', ALL_ADMINS);
createCrudRoutes('carousel', 'carousel', ALL_ADMINS);
createCrudRoutes('galeri', 'galeri', ALL_ADMINS);
createCrudRoutes('kalender-akademik', 'kalenderAkademik', ALL_ADMINS);

// Tracer Study & Siswa
createCrudRoutes('tracer-study', 'tracerStudy', ALL_ADMINS);
createCrudRoutes('siswa', 'siswa', ALL_ADMINS);
createCrudRoutes('orang-tua', 'orangTua', ALL_ADMINS);
createCrudRoutes('karya-siswa', 'karyaSiswa', ALL_ADMINS);

// --- Buku Tamu ---
app.post('/api/buku-tamu', async (req, res) => {
    try {
        const { nama, email, pesan } = req.body;
        if (!nama || !pesan) return res.status(400).json({ error: 'Nama dan pesan wajib diisi' });
        const result = await prisma.bukuTamu.create({ data: { nama, email, pesan } });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/buku-tamu', async (req, res) => {
    try {
        const data = await prisma.bukuTamu.findMany({ orderBy: { tanggal: 'desc' } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/buku-tamu/:id', authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    try {
        await prisma.bukuTamu.delete({ where: { id: parseInt(req.params.id) } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
