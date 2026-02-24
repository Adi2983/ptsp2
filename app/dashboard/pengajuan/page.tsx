'use client';

import { useState } from 'react';
import { useStore, Status, Role } from '@/lib/store';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function PengajuanListPage() {
  const { currentUser, pengajuanList, updateStatusPengajuan } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'Semua'>('Semua');
  const [selectedPengajuan, setSelectedPengajuan] = useState<string | null>(null);
  const [catatan, setCatatan] = useState('');

  if (!currentUser) return null;

  const isSiswa = currentUser.role === 'Siswa';

  const isAdmin = currentUser.role === 'Admin';

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

  const filteredPengajuan = relevantPengajuan.filter(p => {
    const matchesSearch = p.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.jenisLayanan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerifikasi = (id: string, action: 'Terima' | 'Tolak' | 'Teruskan', nextRole?: Role | Role[]) => {
    let newStatus: Status = 'Diproses';
    let targetRole: Role | Role[] | null = null;

    if (action === 'Tolak') {
      newStatus = 'Ditolak';
    } else if (action === 'Terima') {
      if (currentUser.role === 'Kepala Madrasah' || currentUser.role === 'Waka Humas' || currentUser.role === 'Waka Sarpras' || currentUser.role === 'Waka Kesiswaan' || currentUser.role === 'Waka Kurikulum' || currentUser.role === 'Admin') {
        newStatus = 'Selesai';
      } else {
        newStatus = 'Diproses';
        targetRole = nextRole || null;
      }
    } else if (action === 'Teruskan') {
      newStatus = 'Diproses';
      targetRole = nextRole || null;
    }

    updateStatusPengajuan(id, newStatus, catatan, targetRole);
    setSelectedPengajuan(null);
    setCatatan('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pengajuan</h1>
        {isSiswa && (
          <Link 
            href="/pengajuan"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            Buat Pengajuan Baru
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari ID, Nama, atau Layanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'Semua')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors appearance-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layanan</th>
                {!isSiswa && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPengajuan.map((pengajuan) => (
                <tr key={pengajuan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pengajuan.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pengajuan.jenisLayanan}</td>
                  {!isSiswa && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pengajuan.namaSiswa}
                      <div className="text-xs text-gray-500">{pengajuan.kelas}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pengajuan.tanggalPengajuan).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${pengajuan.status === 'Selesai' ? 'bg-green-100 text-green-800' : 
                        pengajuan.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 
                        pengajuan.status === 'Diproses' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {pengajuan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedPengajuan(selectedPengajuan === pengajuan.id ? null : pengajuan.id)}
                      className="text-primary-600 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPengajuan.length === 0 && (
                <tr>
                  <td colSpan={isSiswa ? 5 : 6} className="px-6 py-8 text-center text-sm text-gray-500">
                    Tidak ada data pengajuan yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal / Expandable Section */}
      {selectedPengajuan && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedPengajuan(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            {(() => {
              const p = pengajuanList.find(x => x.id === selectedPengajuan);
              if (!p) return null;
              
              const isCurrentVerifikator = isAdmin || (Array.isArray(p.currentVerifikatorRole) 
                ? p.currentVerifikatorRole.includes(currentUser.role)
                : p.currentVerifikatorRole === currentUser.role);

              return (
                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                          Detail Pengajuan {p.id}
                        </h3>
                        
                        <div className="mt-6 border-t border-gray-200 pt-4">
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Pemohon</dt>
                              <dd className="mt-1 text-sm text-gray-900">{p.namaSiswa} ({p.nis})</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Kelas</dt>
                              <dd className="mt-1 text-sm text-gray-900">{p.kelas}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Layanan</dt>
                              <dd className="mt-1 text-sm text-gray-900">{p.jenisLayanan}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Status Saat Ini</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${p.status === 'Selesai' ? 'bg-green-100 text-green-800' : 
                                    p.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 
                                    p.status === 'Diproses' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-yellow-100 text-yellow-800'}`}
                                >
                                  {p.status}
                                </span>
                              </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">Deskripsi / Keperluan</dt>
                              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{p.deskripsi}</dd>
                            </div>
                          </dl>
                        </div>

                        {/* Riwayat Verifikasi */}
                        <div className="mt-8">
                          <h4 className="text-sm font-bold text-gray-900 mb-4">Riwayat Verifikasi</h4>
                          <div className="flow-root">
                            <ul className="-mb-8">
                              {p.riwayatVerifikasi.map((riwayat, idx) => (
                                <li key={idx}>
                                  <div className="relative pb-8">
                                    {idx !== p.riwayatVerifikasi.length - 1 ? (
                                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                      <div>
                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                                          ${riwayat.status === 'Ditolak' ? 'bg-red-500' : 'bg-green-500'}`}>
                                          {riwayat.status === 'Ditolak' ? <XCircle className="h-4 w-4 text-white" /> : <CheckCircle className="h-4 w-4 text-white" />}
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            {riwayat.status} oleh <span className="font-medium text-gray-900">{riwayat.namaVerifikator}</span> ({riwayat.role})
                                          </p>
                                          {riwayat.catatan && (
                                            <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                              &quot;{riwayat.catatan}&quot;
                                            </p>
                                          )}
                                        </div>
                                        <div className="text-right text-xs whitespace-nowrap text-gray-500">
                                          {new Date(riwayat.tanggal).toLocaleString('id-ID')}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                              {p.riwayatVerifikasi.length === 0 && (
                                <li className="text-sm text-gray-500 italic">Belum ada riwayat verifikasi.</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Action Area for Verifikator */}
                        {!isSiswa && isCurrentVerifikator && p.status !== 'Selesai' && p.status !== 'Ditolak' && (
                          <div className="mt-8 border-t border-gray-200 pt-6">
                            <h4 className="text-sm font-bold text-gray-900 mb-4">Tindakan Verifikasi</h4>
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="catatan" className="block text-sm font-medium text-gray-700">
                                  Catatan (Opsional)
                                </label>
                                <textarea
                                  id="catatan"
                                  rows={3}
                                  value={catatan}
                                  onChange={(e) => setCatatan(e.target.value)}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                  placeholder="Tambahkan catatan verifikasi..."
                                />
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {currentUser.role === 'Wali Kelas' && (
                                  <button
                                    onClick={() => handleVerifikasi(p.id, 'Teruskan', 'Staff TU')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Teruskan ke TU
                                  </button>
                                )}
                                {currentUser.role === 'Staff TU' && (
                                  <button
                                    onClick={() => handleVerifikasi(p.id, 'Teruskan', 'Kepala Madrasah')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Teruskan ke Kepala Madrasah
                                  </button>
                                )}
                                {(currentUser.role === 'Kepala Madrasah' || currentUser.role === 'Waka Humas' || currentUser.role === 'Waka Sarpras' || currentUser.role === 'Waka Kesiswaan' || currentUser.role === 'Waka Kurikulum' || currentUser.role === 'Admin' || currentUser.role === 'Guru Piket') && (
                                  <button
                                    onClick={() => handleVerifikasi(p.id, 'Terima')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    Setujui & Selesai
                                  </button>
                                )}
                                <button
                                  onClick={() => handleVerifikasi(p.id, 'Tolak')}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Tolak Pengajuan
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setSelectedPengajuan(null)}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
