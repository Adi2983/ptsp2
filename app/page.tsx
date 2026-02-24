'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ArrowRight, FileText, FileBadge, AlertTriangle, 
  Users, Wrench, GraduationCap, ShieldCheck, Moon, Sun 
} from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: 'surat-keterangan',
      title: 'Surat Keterangan',
      description: 'Pengajuan Surat Keterangan Aktif, Kelakuan Baik, dll.',
      icon: <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />,
      delay: 0.1,
    },
    {
      id: 'legalisir',
      title: 'Legalisir Ijazah/Rapor',
      description: 'Pengajuan legalisir dokumen resmi madrasah.',
      icon: <FileBadge className="w-8 h-8 text-primary-600 dark:text-primary-400" />,
      delay: 0.2,
    },
    {
      id: 'izin-kbm',
      title: 'Izin Tidak Masuk KBM / Guru Kosong',
      description: 'Permohonan izin tidak masuk KBM atau laporan guru tidak masuk kelas.',
      icon: <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />,
      delay: 0.3,
    },
    {
      id: 'aduan-siswa',
      title: 'Aduan Pelanggaran Siswa',
      description: 'Laporan siswa bolos, berkelahi, atau pelanggaran tata tertib lainnya.',
      icon: <AlertTriangle className="w-8 h-8 text-primary-600 dark:text-primary-400" />,
      delay: 0.4,
    },
    {
      id: 'sarpras',
      title: 'Laporan Kerusakan / Peminjaman',
      description: 'Laporan meja rusak, fasilitas rusak, atau peminjaman barang/ruangan.',
      icon: <Wrench className="w-8 h-8 text-primary-600 dark:text-primary-400" />,
      delay: 0.5,
    },
    {
      id: 'kerjasama',
      title: 'Permohonan Kerjasama / Kunjungan',
      description: 'Pengajuan MoU kerjasama atau permohonan kunjungan ke Madrasah.',
      icon: <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />,
      delay: 0.6,
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      
      {/* Sticky Navbar with Glassmorphism */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl shadow-lg shadow-primary-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white leading-tight">PTSP Digital</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">MTsN 2 Kotawaringin Timur</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {['Beranda', 'Layanan', 'Informasi'].map((item, i) => (
              <Link 
                key={i}
                href={item === 'Beranda' ? '/' : `#${item.toLowerCase()}`} 
                className="relative text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link 
              href="/login" 
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-gray-900/20 dark:hover:shadow-white/20"
            >
              Masuk Sistem
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax & Floating Elements */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-400/20 dark:bg-primary-900/20 blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ y: y1, opacity }}
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 text-primary-700 dark:text-primary-400 text-xs font-semibold tracking-wide uppercase mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              Pelayanan Terpadu Satu Pintu
            </span>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-[1.1]">
              Layanan Cepat, Mudah, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
                dan Transparan
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Sistem informasi layanan terpadu untuk mempermudah civitas akademika MTsN 2 Kotawaringin Timur dalam mengurus berbagai keperluan administrasi.
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link 
                href="#layanan" 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium transition-all shadow-lg shadow-primary-600/30 flex items-center gap-2 group"
              >
                Jelajahi Layanan 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section with Reveal Animation & Glassmorphism */}
      <section id="layanan" className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Pilih Layanan</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Proses pengajuan dapat dilakukan secara online tanpa harus datang ke ruang Tata Usaha. Pilih layanan sesuai kebutuhan Anda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: service.delay }}
                whileHover={{ y: -8 }}
                className="group relative h-full"
              >
                {/* Gradient Border Accent */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                {/* Glassmorphism Card */}
                <div className="relative h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex flex-col transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">{service.description}</p>
                  
                  <Link 
                    href={`/pengajuan?layanan=${service.id}`}
                    className="inline-flex items-center justify-between w-full py-3 px-5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium group-hover:bg-primary-600 group-hover:text-white transition-all duration-300"
                  >
                    <span>Ajukan Layanan</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-16 mt-auto relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">PTSP Digital</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">MTsN 2 Kotawaringin Timur</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Sistem Pelayanan Terpadu Satu Pintu untuk mempermudah layanan administrasi madrasah berbasis digital.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Kontak</h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></div>
                <span>Jl. Tjilik Riwut Km. 2.5, Sampit</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></div>
                <span>Kotawaringin Timur, Kalimantan Tengah</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></div>
                <span>Email: info@mtsn2kotim.sch.id</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Jam Layanan</h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span>Senin - Kamis</span>
                <span className="font-medium text-gray-900 dark:text-white">07:00 - 15:00 WIB</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span>Jumat</span>
                <span className="font-medium text-gray-900 dark:text-white">07:00 - 14:00 WIB</span>
              </li>
              <li className="flex justify-between items-center pt-1">
                <span>Sabtu - Minggu</span>
                <span className="font-medium text-red-500">Tutup</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} MTsN 2 Kotawaringin Timur. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
