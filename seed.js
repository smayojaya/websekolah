const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const siteData = {
    sekolah: {
        nama: "SMA Negeri 1 Yosowilangun",
        npsn: "20521453",
        alamat: "Jl. Kebonsari No. 1, Yosowilangun, Kab. Lumajang, Jawa Timur",
        telepon: "(0334) 393245",
        email: "info@sman1yosowilangun.sch.id",
        akreditasi: "A",
        koordinatX: -8.212041,
        koordinatY: 113.298285,
        sejarah: "SMA Negeri 1 Yosowilangun berdiri sejak tahun 1985 dengan tujuan mulia untuk memfasilitasi pendidikan tingkat menengah atas bagi masyarakat Yosowilangun dan sekitarnya. Seiring berjalannya waktu, SMAYO terus berkembang pesat dalam hal infrastruktur dan kualitas pendidikan.\n\nKini, SMAYO telah menjelma menjadi salah satu sekolah menengah atas rujukan di Kabupaten Lumajang, dengan predikat Akreditasi A dan berbagai prestasi baik di tingkat kabupaten, provinsi, hingga nasional.",
        visi: "Terwujudnya insan akademis yang beriman, bertakwa, berprestasi unggul, berwawasan lingkungan, dan berdaya saing global.",
        misi: "1. Menumbuhkan penghayatan terhadap ajaran agama.\n2. Melaksanakan pembelajaran aktif, inovatif, kreatif, efektif, dan menyenangkan.\n3. Mendorong prestasi akademik and non-academic.\n4. Mewujudkan lingkungan sekolah yang bersih, sehat, dan asri.",
        ppdbAktif: true
    },
    berita: [
        {
            kategori: "Prestasi",
            judul: "Tim Robotik SMAYO Juara 1 Tingkat Provinsi",
            tanggal: new Date("2026-05-15"),
            ringkasan: "Tim ekstrakurikuler robotik SMAN 1 Yosowilangun berhasil menyabet medali emas dalam kompetisi Inovasi Teknologi tingkat Jawa Timur.",
            konten: "Tim ekstrakurikuler robotik SMAN 1 Yosowilangun berhasil menyabet medali emas dalam kompetisi Inovasi Teknologi tingkat Jawa Timur...",
            gambar: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=800"
        },
        {
            kategori: "Pengumuman",
            judul: "Jadwal Ujian Akhir Semester Genap 2026",
            tanggal: new Date("2026-05-10"),
            ringkasan: "Informasi mengenai jadwal lengkap Pelaksanaan Ujian Akhir Semester Genap tahun ajaran 2025/2026 untuk seluruh siswa.",
            konten: "Pelaksanaan Ujian Akhir Semester (UAS) Genap akan dimulai pada tanggal 10 Juni 2026...",
            gambar: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
        },
        {
            kategori: "Kegiatan",
            judul: "Perayaan Hari Pendidikan Nasional di SMAYO",
            tanggal: new Date("2026-05-02"),
            ringkasan: "Semarak peringatan Hardiknas dengan berbagai lomba edukatif dan upacara bendera menggunakan pakaian adat nusantara.",
            konten: "Pada tanggal 2 Mei 2026, seluruh warga SMAN 1 Yosowilangun mengadakan upacara bendera...",
            gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800"
        }
    ],
    fasilitas: [
        { nama: "Laboratorium Komputer", deskripsi: "Dilengkapi 40 unit PC spesifikasi tinggi dan akses internet 100Mbps.", ikon: "ph-desktop" },
        { nama: "Perpustakaan Digital", deskripsi: "Koleksi ribuan buku cetak dan e-book dengan ruang baca yang nyaman ber-AC.", ikon: "ph-books" },
        { nama: "Laboratorium IPA", deskripsi: "Fasilitas lab Fisika, Kimia, dan Biologi dengan peralatan praktikum standar.", ikon: "ph-flask" },
        { nama: "Lapangan Olahraga", deskripsi: "Lapangan basket, voli, dan futsal terpadu di area terbuka yang luas.", ikon: "ph-basketball" },
        { nama: "Masjid Sekolah", deskripsi: "Tempat ibadah yang luas dan nyaman untuk kegiatan kerohanian siswa.", ikon: "ph-mosque" },
        { nama: "Green House", deskripsi: "Area hijau untuk pembelajaran biologi dan budidaya tanaman hidroponik.", ikon: "ph-plant" }
    ],
    guru: [
        { nama: "Budi Santoso, S.Pd., M.Pd.", mapel: "Matematika", telepon: "08111111111" },
        { nama: "Siti Aminah, M.Si.", mapel: "Biologi", telepon: "08222222222" },
        { nama: "Ahmad Riyadi, S.Kom.", mapel: "Informatika", telepon: "08333333333" },
        { nama: "Rina Wijayanti, S.Pd.", mapel: "Bahasa Inggris", telepon: "08444444444" }
    ],
    ekstrakurikuler: [
        { nama: "Pramuka", kategori: "Wajib" },
        { nama: "OSIS", kategori: "Organisasi" },
        { nama: "PMR (Palang Merah Remaja)", kategori: "Kemanusiaan" },
        { nama: "Klub Sains", kategori: "Akademik" },
        { nama: "Basket", kategori: "Olahraga" },
        { nama: "Paduan Suara", kategori: "Seni" }
    ],
    unduhan: [
        { nama: "Kalender Akademik 2025/2026", tipe: "PDF", ukuran: "1.2 MB", link: "#" },
        { nama: "Brosur PPDB 2026", tipe: "PDF", ukuran: "2.5 MB", link: "#" },
        { nama: "Formulir Pendaftaran Ekskul", tipe: "DOCX", ukuran: "45 KB", link: "#" },
        { nama: "Tata Tertib Siswa SMAYO", tipe: "PDF", ukuran: "800 KB", link: "#" }
    ],
    piala: [
        { nama: "Juara 1 OSN Matematika Tingkat Kabupaten", tahun: "2025" },
        { nama: "Juara Umum Lomba Baris Berbaris", tahun: "2024" },
        { nama: "Medali Emas Pencak Silat Popda Jatim", tahun: "2025" }
    ],
    carousel: [
        {
            gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1600",
            judul: "Selamat Datang di SMA Negeri 1 Yosowilangun",
            deskripsi: "Unggul dalam Mutu, Berpijak pada Iman dan Takwa. Mewujudkan generasi emas Indonesia yang berprestasi."
        },
        {
            gambar: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=1600",
            judul: "Fasilitas Belajar Modern",
            deskripsi: "Didukung laboratorium lengkap dan perpustakaan digital untuk kenyamanan siswa."
        },
        {
            gambar: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1600",
            judul: "Pendaftaran Peserta Didik Baru",
            deskripsi: "Mari bergabung bersama kami untuk meraih masa depan yang gemilang."
        }
    ],
    infoPenting: [
        {
            tanggal: new Date("2026-06-01"),
            judul: "Pengumuman Kelulusan Siswa Kelas XII",
            link: "#/berita"
        },
        {
            tanggal: new Date("2026-06-10"),
            judul: "Jadwal Pengembalian Buku Perpustakaan",
            link: "#/berita"
        },
        {
            tanggal: new Date("2026-06-15"),
            judul: "Pendaftaran Ulang Siswa Baru Jalur Zonasi",
            link: "#/ppdb"
        }
    ],
    galeri: [
        {
            judul: "Kegiatan Lomba 17 Agustus",
            tipe: "FOTO",
            url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
            thumbnail: ""
        },
        {
            judul: "Upacara Bendera Senin",
            tipe: "FOTO",
            url: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=800",
            thumbnail: ""
        },
        {
            judul: "Profil SMAYO 2025",
            tipe: "VIDEO",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Dummy link
            thumbnail: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"
        }
    ],
    kalenderAkademik: [
        { tanggal: new Date("2026-07-15"), agenda: "Hari Pertama Masuk Sekolah Tahun Ajaran Baru" },
        { tanggal: new Date("2026-08-17"), agenda: "Upacara Peringatan Hari Kemerdekaan RI" },
        { tanggal: new Date("2026-09-20"), agenda: "Penilaian Tengah Semester (PTS) Ganjil" }
    ],
    ppdb: [
        {
            nama: "Ahmad Fauzi",
            nisn: "0091234567",
            asalSekolah: "SMP Negeri 1 Yosowilangun",
            jalur: "Zonasi",
            telepon: "081234567890",
            tanggalDaftar: new Date()
        },
        {
            nama: "Siti Nurhaliza",
            nisn: "0098765432",
            asalSekolah: "SMP Negeri 2 Yosowilangun",
            jalur: "Prestasi",
            telepon: "089876543210",
            tanggalDaftar: new Date()
        }
    ],
    tracerStudy: [
        {
            nama: "Bima Arya",
            tahun: "2022",
            status: "Kuliah",
            instansi: "Universitas Brawijaya"
        },
        {
            nama: "Diana Putri",
            tahun: "2023",
            status: "Kerja",
            instansi: "PT. Gudang Garam Tbk."
        }
    ],
    absensi: [
        { nisn: "123456", semester: "Genap", hadir: 40, izin: 2, sakit: 1, alpa: 0 }
    ],
    jadwalPelajaran: [
        { kelas: "X-1", hari: "Senin", mapel: "Matematika", guru: "Budi Santoso, S.Pd., M.Pd.", jamMulai: "07:00", jamSelesai: "08:30" },
        { kelas: "X-1", hari: "Senin", mapel: "Biologi", guru: "Siti Aminah, M.Si.", jamMulai: "08:30", jamSelesai: "10:00" },
        { kelas: "X-1", hari: "Senin", mapel: "Bahasa Inggris", guru: "Rina Wijayanti, S.Pd.", jamMulai: "10:30", jamSelesai: "12:00" }
    ]
};

async function main() {
    console.log(`Start seeding ...`);

    // Create Admins with specific roles
    const roles = [
        { username: 'superadmin', role: 'SUPER_ADMIN', password: 'admin' },
        { username: 'adminkesiswaan', role: 'ADMIN_KESISWAAN', password: 'admin' },
        { username: 'adminhumas', role: 'ADMIN_HUMAS', password: 'admin' },
        { username: 'adminkurikulum', role: 'ADMIN_KURIKULUM', password: 'admin' },
        { username: 'adminsarpras', role: 'ADMIN_SARPRAS', password: 'admin' }
    ];

    for (const r of roles) {
        const hashedPassword = await bcrypt.hash(r.password, 10);
        await prisma.admin.upsert({
            where: { username: r.username },
            update: { role: r.role },
            create: {
                username: r.username,
                password: hashedPassword,
                role: r.role
            },
        });
    }

    // Create Sekolah
    await prisma.sekolah.upsert({
        where: { id: 1 },
        update: siteData.sekolah,
        create: { id: 1, ...siteData.sekolah },
    });

    // Create Content (Using deleteMany to reset data first)
    await prisma.berita.deleteMany({});
    for (const b of siteData.berita) await prisma.berita.create({ data: b });

    await prisma.fasilitas.deleteMany({});
    for (const f of siteData.fasilitas) await prisma.fasilitas.create({ data: f });

    await prisma.guru.deleteMany({});
    for (const g of siteData.guru) await prisma.guru.create({ data: g });

    await prisma.ekstrakurikuler.deleteMany({});
    for (const e of siteData.ekstrakurikuler) await prisma.ekstrakurikuler.create({ data: e });

    await prisma.unduhan.deleteMany({});
    for (const u of siteData.unduhan) await prisma.unduhan.create({ data: u });

    await prisma.piala.deleteMany({});
    for (const p of siteData.piala) await prisma.piala.create({ data: p });

    await prisma.carousel.deleteMany({});
    for (const c of siteData.carousel) await prisma.carousel.create({ data: c });

    await prisma.infoPenting.deleteMany({});
    for (const i of siteData.infoPenting) await prisma.infoPenting.create({ data: i });

    await prisma.galeri.deleteMany({});
    for (const g of siteData.galeri) await prisma.galeri.create({ data: g });

    await prisma.kalenderAkademik.deleteMany({});
    for (const k of siteData.kalenderAkademik) await prisma.kalenderAkademik.create({ data: k });

    await prisma.ppdb.deleteMany({});
    for (const p of siteData.ppdb) await prisma.ppdb.create({ data: p });

    await prisma.tracerStudy.deleteMany({});
    for (const t of siteData.tracerStudy) await prisma.tracerStudy.create({ data: t });

    await prisma.siswa.deleteMany({});
    await prisma.siswa.create({ data: { nama: "Siswa Contoh", nisn: "123456", kelas: "X-1", telepon: "08999999999" }});

    await prisma.orangTua.deleteMany({});
    await prisma.orangTua.create({ data: { nama: "Wali Contoh", namaSiswa: "Siswa Contoh", telepon: "08888888888" }});

    await prisma.absensi.deleteMany({});
    for (const a of siteData.absensi) await prisma.absensi.create({ data: a });

    await prisma.jadwalPelajaran.deleteMany({});
    for (const j of siteData.jadwalPelajaran) await prisma.jadwalPelajaran.create({ data: j });

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
