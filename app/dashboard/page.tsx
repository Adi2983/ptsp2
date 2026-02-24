'use client';

import { useStore } from '@/lib/store';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentUser, pengajuanList } = useStore();

  if (!currentUser) return null;

  const isSiswa = currentUser.role === 'Siswa';

  const isAdmin = currentUser.role === 'Admin';

  // Filter pengajuan based on role
  const relevantPengajuan = isAdmin 
    ? pengajuanList
    : isSiswa 
      ? pengajuanList.filter(p => p.siswaId === currentUser.id)
      : pengajuanList.filter(p => {
          const isCurrent = Array.isArray(p.currentVerifikatorRole) 
            ? p.currentVerifikatorRole.includes(currentUser.role)
            : p.currentVerifikatorRole === currentUser.role;
          const hasVerified = p.riwayatVerifikasi.some(r => r.namaVerifikator === currentUser.name);
          return isCurrent || hasVerified;
        });

  const stats = [
    {
      name: 'Total Pengajuan',
      value: relevantPengajuan.length,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      name: 'Menunggu Verifikasi',
      value: relevantPengajuan.filter(p => p.status === 'Menunggu Verifikasi').length,
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      bg: 'bg-yellow-50',
    },
    {
      name: 'Selesai',
      value: relevantPengajuan.filter(p => p.status === 'Selesai').length,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-50',
    },
    {
      name: 'Ditolak',
      value: relevantPengajuan.filter(p => p.status === 'Ditolak').length,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        {isSiswa && (
          <Link 
            href="/pengajuan"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Buat Pengajuan Baru
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 transition-colors">
            <div className={`p-3 rounded-lg ${stat.bg} dark:bg-opacity-20`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {isSiswa ? 'Pengajuan Terakhir Anda' : 'Perlu Tindakan Anda'}
          </h3>
          <Link href="/dashboard/pengajuan" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Layanan
                </th>
                {!isSiswa && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pemohon
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {relevantPengajuan.slice(0, 5).map((pengajuan) => (
                <tr key={pengajuan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {pengajuan.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {pengajuan.jenisLayanan}
                  </td>
                  {!isSiswa && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {pengajuan.namaSiswa}
                      <div className="text-xs text-gray-500 dark:text-gray-400">{pengajuan.kelas}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(pengajuan.tanggalPengajuan).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${pengajuan.status === 'Selesai' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        pengajuan.status === 'Ditolak' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                        pengajuan.status === 'Diproses' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}
                    >
                      {pengajuan.status}
                    </span>
                  </td>
                </tr>
              ))}
              {relevantPengajuan.length === 0 && (
                <tr>
                  <td colSpan={isSiswa ? 4 : 5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Belum ada data pengajuan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
