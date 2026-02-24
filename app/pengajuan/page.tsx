'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function FormPengajuanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const layananParam = searchParams.get('layanan');
  const { currentUser, addPengajuan } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    jenisLayanan: '',
    deskripsi: '',
  });

  // Initialize form data from URL params once
  useEffect(() => {
    if (layananParam) {
      const layananMap: Record<string, string> = {
        'surat-keterangan': 'Surat Keterangan',
        'legalisir': 'Legalisir Ijazah/Rapor',
        'izin-kbm': 'Izin Tidak Masuk KBM / Guru Kosong',
        'aduan-siswa': 'Aduan Pelanggaran Siswa',
        'sarpras': 'Laporan Kerusakan / Peminjaman',
        'kerjasama': 'Permohonan Kerjasama / Kunjungan',
      };
      if (layananMap[layananParam]) {
        setFormData(prev => ({ ...prev, jenisLayanan: layananMap[layananParam] }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'Siswa') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'Siswa') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addPengajuan({
        siswaId: currentUser.id,
        namaSiswa: currentUser.name,
        nis: currentUser.nis || '-',
        kelas: currentUser.kelas || '-',
        jenisLayanan: formData.jenisLayanan,
        deskripsi: formData.deskripsi,
      });
      
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengajuan Berhasil!</h2>
          <p className="text-gray-600 mb-8">
            Pengajuan Anda telah berhasil dikirim dan sedang menunggu verifikasi dari Wali Kelas.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard/pengajuan"
              className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
            >
              Lihat Status Pengajuan
            </Link>
            <Link 
              href="/dashboard"
              className="w-full py-3 px-4 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-8 sm:p-10 border-b border-gray-200 bg-primary-600 text-white">
            <h2 className="text-2xl font-bold">Form Pengajuan Layanan</h2>
            <p className="mt-2 text-primary-100">
              Silakan lengkapi form di bawah ini untuk mengajukan layanan PTSP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  disabled 
                  value={currentUser.name}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">NIS</label>
                <input 
                  type="text" 
                  disabled 
                  value={currentUser.nis || '-'}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Kelas</label>
                <input 
                  type="text" 
                  disabled 
                  value={currentUser.kelas || '-'}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="jenisLayanan" className="block text-sm font-medium text-gray-700">
                    Jenis Layanan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="jenisLayanan"
                    required
                    value={formData.jenisLayanan}
                    onChange={(e) => setFormData({ ...formData, jenisLayanan: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="" disabled>Pilih Jenis Layanan</option>
                    <option value="Surat Keterangan">Surat Keterangan</option>
                    <option value="Legalisir Ijazah/Rapor">Legalisir Ijazah/Rapor</option>
                    <option value="Izin Tidak Masuk KBM / Guru Kosong">Izin Tidak Masuk KBM / Guru Kosong</option>
                    <option value="Aduan Pelanggaran Siswa">Aduan Pelanggaran Siswa</option>
                    <option value="Laporan Kerusakan / Peminjaman">Laporan Kerusakan / Peminjaman</option>
                    <option value="Permohonan Kerjasama / Kunjungan">Permohonan Kerjasama / Kunjungan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                    Deskripsi / Keperluan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    required
                    rows={4}
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Jelaskan keperluan Anda secara detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Dokumen Pendukung (Opsional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          Upload file
                        </span>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-end gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function FormPengajuan() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Memuat form...</div>}>
      <FormPengajuanContent />
    </Suspense>
  );
}
