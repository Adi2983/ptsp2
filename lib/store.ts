import { create } from 'zustand';

export type Role = 
  | 'Siswa' 
  | 'Wali Kelas' 
  | 'Guru' 
  | 'Staff TU' 
  | 'Kepala Madrasah'
  | 'Waka Humas'
  | 'Waka Kurikulum'
  | 'Waka Kesiswaan'
  | 'Waka Sarpras'
  | 'Guru Piket'
  | 'Admin';

export type Status = 'Menunggu Verifikasi' | 'Diproses' | 'Ditolak' | 'Selesai';

export interface User {
  id: string;
  name: string;
  role: Role;
  nis?: string;
  kelas?: string;
}

export interface Pengajuan {
  id: string;
  siswaId: string;
  namaSiswa: string;
  nis: string;
  kelas: string;
  jenisLayanan: string;
  deskripsi: string;
  status: Status;
  tanggalPengajuan: string;
  riwayatVerifikasi: {
    role: Role;
    status: Status;
    catatan?: string;
    tanggal: string;
    namaVerifikator: string;
  }[];
  currentVerifikatorRole: Role | Role[] | null;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  pengajuanList: Pengajuan[];
  guruPiketId: string | null;
  setCurrentUser: (user: User | null) => void;
  setGuruPiket: (userId: string) => void;
  addPengajuan: (pengajuan: Omit<Pengajuan, 'id' | 'status' | 'tanggalPengajuan' | 'riwayatVerifikasi' | 'currentVerifikatorRole'>) => void;
  updateStatusPengajuan: (id: string, status: Status, catatan: string, nextRole: Role | Role[] | null) => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'Ahmad Siswa', role: 'Siswa', nis: '12345', kelas: 'XII IPA 1' },
  { id: '2', name: 'Budi Wali Kelas', role: 'Wali Kelas' },
  { id: '3', name: 'Siti Staff TU', role: 'Staff TU' },
  { id: '4', name: 'Drs. H. Kepala Madrasah', role: 'Kepala Madrasah' },
  { id: '5', name: 'Pak Waka Humas', role: 'Waka Humas' },
  { id: '6', name: 'Bu Waka Kurikulum', role: 'Waka Kurikulum' },
  { id: '7', name: 'Pak Waka Kesiswaan', role: 'Waka Kesiswaan' },
  { id: '8', name: 'Pak Waka Sarpras', role: 'Waka Sarpras' },
  { id: '9', name: 'Guru Piket Hari Ini', role: 'Guru Piket' },
  { id: '10', name: 'System Admin', role: 'Admin' },
];

const mockPengajuan: Pengajuan[] = [
  {
    id: 'P-001',
    siswaId: '1',
    namaSiswa: 'Ahmad Siswa',
    nis: '12345',
    kelas: 'XII IPA 1',
    jenisLayanan: 'Surat Keterangan Aktif',
    deskripsi: 'Untuk keperluan beasiswa',
    status: 'Menunggu Verifikasi',
    tanggalPengajuan: new Date().toISOString(),
    riwayatVerifikasi: [],
    currentVerifikatorRole: 'Wali Kelas',
  }
];

const getInitialRoleForLayanan = (layanan: string): Role | Role[] => {
  if (layanan.includes('Kerusakan') || layanan.includes('Peminjaman')) return 'Waka Sarpras';
  if (layanan.includes('Kerjasama') || layanan.includes('Kunjungan')) return 'Waka Humas';
  if (layanan.includes('Izin Tidak Masuk KBM') || layanan.includes('Guru Kosong')) return ['Waka Kurikulum', 'Guru Piket'];
  if (layanan.includes('Aduan Siswa Bolos') || layanan.includes('Berkelahi')) return 'Waka Kesiswaan';
  return 'Wali Kelas'; // Default
};

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  users: mockUsers,
  pengajuanList: mockPengajuan,
  guruPiketId: '9',
  setCurrentUser: (user) => set({ currentUser: user }),
  setGuruPiket: (userId) => set({ guruPiketId: userId }),
  addPengajuan: (data) => set((state) => ({
    pengajuanList: [
      {
        ...data,
        id: `P-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'Menunggu Verifikasi',
        tanggalPengajuan: new Date().toISOString(),
        riwayatVerifikasi: [],
        currentVerifikatorRole: getInitialRoleForLayanan(data.jenisLayanan),
      },
      ...state.pengajuanList
    ]
  })),
  updateStatusPengajuan: (id, status, catatan, nextRole) => set((state) => ({
    pengajuanList: state.pengajuanList.map((p) => {
      if (p.id === id) {
        const newRiwayat = [
          ...p.riwayatVerifikasi,
          {
            role: state.currentUser?.role || 'Admin',
            status,
            catatan,
            tanggal: new Date().toISOString(),
            namaVerifikator: state.currentUser?.name || 'Sistem'
          }
        ];
        return {
          ...p,
          status,
          currentVerifikatorRole: nextRole,
          riwayatVerifikasi: newRiwayat
        };
      }
      return p;
    })
  }))
}));
