require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'smayo-secret-key-super-safe';

// --- WHATSAPP BOT SETUP (NONAKTIF UNTUK VERCEL) ---
// Fitur WA Bot dinonaktifkan sementara untuk menyesuaikan dengan batas ukuran Serverless Vercel.
let waReady = false;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files untuk frontend (Aplikasi Utama)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route untuk root URL (Frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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

// Rute Upload ditiadakan (menggunakan URL Tautan)

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

// --- Custom POST Berita & Info Penting (Tanpa Notif WA) ---
const broadcastWhatsapp = async (pesan, target = 'SEMUA') => {
    console.log('[WA BOT] Mode Serverless: Pesan WA tidak dikirim ->', pesan);
};

// --- Endpoint Khusus WA Blast ---
app.post('/api/wa-blast', authenticateToken, authorizeRoles(...ALL_ADMINS), async (req, res) => {
    res.json({ success: false, message: 'Fitur WA Blast saat ini dinonaktifkan dalam Mode Vercel Serverless.' });
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

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Ekspor app untuk Vercel Serverless
module.exports = app;
