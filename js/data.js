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
            ...(sekolah.error ? {} : sekolah),
            koordinat: (sekolah && !sekolah.error) ? [sekolah.koordinatX, sekolah.koordinatY] : [-8.212041, 113.298285]
        },
        berita: Array.isArray(berita) ? berita : [],
        fasilitas: Array.isArray(fasilitas) ? fasilitas : [],
        guru: Array.isArray(guru) ? guru : [],
        ekstrakurikuler: Array.isArray(ekstrakurikuler) ? ekstrakurikuler : [],
        unduhan: Array.isArray(unduhan) ? unduhan : [],
        piala: Array.isArray(piala) ? piala : [],
        carousel: Array.isArray(carousel) ? carousel : [],
        infoPenting: Array.isArray(infoPenting) ? infoPenting : [],
        galeri: Array.isArray(galeri) ? galeri : [],
        kalenderAkademik: Array.isArray(kalenderAkademik) ? kalenderAkademik : [],
        karyaSiswa: Array.isArray(karyaSiswa) ? karyaSiswa : [],
        bukuTamu: Array.isArray(bukuTamu) ? bukuTamu : []
    };
} catch (error) {
    console.error("Gagal mengambil data dari server:", error);
}
