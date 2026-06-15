// data.js - Data dari API Backend

export let siteData = {
    sekolah: {},
    berita: [],
    fasilitas: [],
    guru: [],
    ekstrakurikuler: [],
    unduhan: [],
    piala: [],
    carousel: [],
    infoPenting: [],
    galeri: [],
    kalenderAkademik: [],
    karyaSiswa: [],
    bukuTamu: []
};

try {
    const API_URL = '/api';
    
    // Fetch all required data concurrently
    const responses = await Promise.all([
        fetch(`${API_URL}/sekolah`),
        fetch(`${API_URL}/berita`),
        fetch(`${API_URL}/fasilitas`),
        fetch(`${API_URL}/guru`),
        fetch(`${API_URL}/ekstrakurikuler`),
        fetch(`${API_URL}/unduhan`),
        fetch(`${API_URL}/piala`),
        fetch(`${API_URL}/carousel`),
        fetch(`${API_URL}/info-penting`),
        fetch(`${API_URL}/galeri`),
        fetch(`${API_URL}/kalender-akademik`),
        fetch(`${API_URL}/karya-siswa`),
        fetch(`${API_URL}/buku-tamu`)
    ]);

    const [
        sekolah, 
        berita, 
        fasilitas, 
        guru, 
        ekstrakurikuler, 
        unduhan, 
        piala, 
        carousel, 
        infoPenting,
        galeri,
        kalenderAkademik,
        karyaSiswa,
        bukuTamu
    ] = await Promise.all(responses.map(r => r.json()));

    siteData = {
        sekolah: {
            ...sekolah,
            koordinat: sekolah ? [sekolah.koordinatX, sekolah.koordinatY] : [-8.212041, 113.298285]
        },
        berita: berita || [],
        fasilitas: fasilitas || [],
        guru: guru || [],
        ekstrakurikuler: ekstrakurikuler || [],
        unduhan: unduhan || [],
        piala: piala || [],
        carousel: carousel || [],
        infoPenting: infoPenting || [],
        galeri: galeri || [],
        kalenderAkademik: kalenderAkademik || [],
        karyaSiswa: karyaSiswa || [],
        bukuTamu: bukuTamu || []
    };
} catch (error) {
    console.error("Gagal mengambil data dari server:", error);
}
