import React, { useState } from 'react';
import { 
  Users, 
  Download, 
  Trash2, 
  Search, 
  ArrowLeft, 
  Award, 
  Clock, 
  ShieldAlert, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { ExamSubmission } from '../data/questions';
import { exportSubmissionsToCSV } from '../utils/storage';

interface TeacherRecapViewProps {
  submissions: ExamSubmission[];
  onBack: () => void;
  onClearAll: () => void;
  onSelectSubmission: (sub: ExamSubmission) => void;
}

export const TeacherRecapView: React.FC<TeacherRecapViewProps> = ({
  submissions,
  onBack,
  onClearAll,
  onSelectSubmission,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  // Extract unique classes
  const classes = Array.from(new Set(submissions.map(s => s.kelas))).filter(Boolean);

  const filtered = submissions.filter(s => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.no_absen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || s.kelas === selectedClass;
    return matchesSearch && matchesClass;
  });

  const avgScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, s) => acc + s.skor, 0) / submissions.length)
    : 0;
  const passCount = submissions.filter(s => s.skor >= 75).length;
  const passRate = submissions.length > 0 ? Math.round((passCount / submissions.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 sm:px-6">
      {/* Header bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs flex items-center justify-center cursor-pointer"
            title="Kembali ke Halaman Ujian"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#164b62]" />
              <span>Rekap Nilai Guru & Asesor</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar rekam hasil asesmen seluruh siswa yang telah menyelesaikan ujian di perangkat ini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportSubmissionsToCSV(filtered)}
            disabled={filtered.length === 0}
            className="px-4 py-2 rounded-xl bg-[#164b62] hover:bg-[#1f5c76] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh CSV / Excel</span>
          </button>

          {submissions.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
              title="Kosongkan Semua Catatan Ujian"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Peserta Selesai</span>
          <span className="text-3xl font-extrabold text-slate-900 tabular-nums mt-1 block">
            {submissions.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Rata-rata Skor</span>
          <span className="text-3xl font-extrabold text-[#164b62] tabular-nums mt-1 block">
            {avgScore} <span className="text-sm font-normal text-slate-400">/100</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Tuntas KKM (&ge;75)</span>
          <span className="text-3xl font-extrabold text-emerald-700 tabular-nums mt-1 block">
            {passCount} <span className="text-sm font-normal text-slate-400">({passRate}%)</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Butuh Remidial (&lt;75)</span>
          <span className="text-3xl font-extrabold text-amber-700 tabular-nums mt-1 block">
            {submissions.length - passCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa atau no absen..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#164b62] focus:ring-2 focus:ring-[#164b62]/20 text-xs outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Kelas:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-hidden cursor-pointer"
          >
            <option value="all">Semua Kelas ({submissions.length})</option>
            {classes.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-sm text-slate-700">Belum Ada Rekaman Ujian</p>
            <p className="text-xs text-slate-400">
              Hasil ujian siswa akan otomatis tercatat di halaman ini setelah dikumpulkan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Peserta</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4 text-center">Absen</th>
                  <th className="py-3 px-4 text-center">Benar</th>
                  <th className="py-3 px-4 text-center">Skor Akhir</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Pelanggaran</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((s, idx) => {
                  const passed = s.skor >= 75;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center tabular-nums text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.nama}</td>
                      <td className="py-3 px-4">{s.kelas}</td>
                      <td className="py-3 px-4 text-center tabular-nums">{s.no_absen}</td>
                      <td className="py-3 px-4 text-center tabular-nums">{s.total_benar} / 50</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-extrabold text-sm tabular-nums text-[#164b62]">{s.skor}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {passed ? 'KOMPETEN' : 'REMIDIAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center tabular-nums">
                        {s.pelanggaran_tab > 0 ? (
                          <span className="text-amber-700 font-bold">{s.pelanggaran_tab}x</span>
                        ) : (
                          <span className="text-emerald-700">0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectSubmission(s)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#164b62] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          Lihat Slip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal to Clear All */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Kosongkan Semua Data?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini akan menghapus seluruh catatan nilai siswa dari penyimpanan browser ini. Pastikan Anda telah mengunduh CSV jika masih dibutuhkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setConfirmClear(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
