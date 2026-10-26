import React, { useState } from 'react';
import { Volume2, Play, AlertCircle, RotateCcw, CheckCircle, ShieldCheck, Cpu, HardDrive, Network, Server, Settings } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { ProctorSettings } from '../utils/storage';

interface IdentityViewProps {
  initialIdentity: { nama: string; kelas: string; no_absen: string };
  onStartExam: (identity: { nama: string; kelas: string; no_absen: string }, settings: ProctorSettings) => void;
  settings: ProctorSettings;
  onUpdateSettings: (settings: ProctorSettings) => void;
  hasDraft: boolean;
  onResumeDraft: () => void;
  onDiscardDraft: () => void;
  lastViolationNotice?: string;
}

export const IdentityView: React.FC<IdentityViewProps> = ({
  initialIdentity,
  onStartExam,
  settings,
  onUpdateSettings,
  hasDraft,
  onResumeDraft,
  onDiscardDraft,
  lastViolationNotice,
}) => {
  const [nama, setNama] = useState(initialIdentity.nama || '');
  const [kelas, setKelas] = useState(initialIdentity.kelas || '');
  const [noAbsen, setNoAbsen] = useState(initialIdentity.no_absen || '');
  const [testedAudio, setTestedAudio] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTestAudio = () => {
    soundManager.initUserGesture();
    soundManager.playSingleBeep(740, 0.25, 0.1);
    setTestedAudio(true);
    setTimeout(() => {
      soundManager.playSingleBeep(880, 0.25, 0.1);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !kelas.trim() || !noAbsen.trim()) {
      setErrorMsg('Mohon lengkapi seluruh data identitas peserta sebelum memulai ujian.');
      return;
    }
    soundManager.initUserGesture();
    setErrorMsg('');
    onStartExam({ nama: nama.trim(), kelas: kelas.trim(), no_absen: noAbsen.trim() }, settings);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 sm:px-6">
      {/* Notice if user was returned due to tab switch violation */}
      {lastViolationNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold block">Pemberitahuan Pengawasan:</span>
            <span>{lastViolationNotice}</span>
          </div>
        </div>
      )}

      {/* Resume draft prompt if active draft exists */}
      {hasDraft && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center shrink-0 text-amber-800">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ditemukan Sesi Ujian Tersimpan</h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Ada progres pengerjaan ujian sebelumnya di browser ini. Apakah Anda ingin melanjutkan?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDiscardDraft}
              className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors"
            >
              Hapus Sesi Lalu
            </button>
            <button
              type="button"
              onClick={onResumeDraft}
              className="px-4 py-2 text-xs font-bold text-white bg-[#164b62] hover:bg-[#1f5c76] rounded-xl transition-colors shadow-xs"
            >
              Lanjutkan Sesi
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e4ad49]/20 text-[#164b62] text-xs font-bold tracking-wide uppercase">
          <span>Standar Kompetensi Kejuruan TJKT</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#142b3c]">
          Ujian Kecakapan Kerja Dasar
        </h1>
        <p className="mt-2 text-base text-[#587083] max-w-2xl leading-relaxed">
          Asesmen komprehensif mencakup perangkat keras, sistem operasi Linux, virtualisasi sistem, dan konfigurasi layanan server jaringan.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        {/* Main Panel: Identity Form */}
        <section className="bg-white rounded-3xl p-6 sm:p-9 border border-[#d8e2e5] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eef3f4] pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#142b3c]">Identitas Peserta Ujian</h2>
              <p className="text-xs text-[#587083] mt-0.5">
                Pastikan nama, kelas, dan nomor absen sesuai data presensi resmi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Pengaturan Mode Pengawasan"
            >
              <Settings className="w-4 h-4 text-[#164b62]" />
              <span className="hidden sm:inline">Konfigurasi</span>
            </button>
          </div>

          {/* Config Drawer for Teacher / Student preference */}
          {showSettings && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#164b62]" />
                Opsi Mode Pengawasan (Proctoring Settings)
              </h3>
              
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="font-semibold block text-slate-900">Mode Ketat (Strict Tab Reset)</span>
                  <span className="text-slate-500 text-[11px]">
                    Jika aktif: meninggalkan tab/jendela akan menghapus seluruh jawaban dan restart ujian.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.strictTabReset}
                  onChange={(e) => onUpdateSettings({ ...settings, strictTabReset: e.target.checked })}
                  className="w-4 h-4 accent-[#164b62] rounded"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-200">
                <div>
                  <span className="font-semibold block text-slate-900">Bunyi Alarm Akustik</span>
                  <span className="text-slate-500 text-[11px]">
                    Memutar nada beeper saat tab ditinggalkan.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableSoundAlarm}
                  onChange={(e) => onUpdateSettings({ ...settings, enableSoundAlarm: e.target.checked })}
                  className="w-4 h-4 accent-[#164b62] rounded"
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nama" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Lengkap Peserta
              </label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Muhammad Farhan Pratama"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#164b62] focus:ring-2 focus:ring-[#164b62]/20 text-sm outline-hidden transition-all bg-white"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="kelas" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kelas / Rombel
                </label>
                <input
                  id="kelas"
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: X TJKT 1 / XI TJKT 2"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#164b62] focus:ring-2 focus:ring-[#164b62]/20 text-sm outline-hidden transition-all bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="absen" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nomor Absen
                </label>
                <input
                  id="absen"
                  type="text"
                  value={noAbsen}
                  onChange={(e) => setNoAbsen(e.target.value)}
                  placeholder="Contoh: 18"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#164b62] focus:ring-2 focus:ring-[#164b62]/20 text-sm outline-hidden transition-all bg-white"
                  required
                />
              </div>
            </div>

            {/* Audio Check Affordance */}
            <div className="p-4 rounded-2xl bg-[#f0f6f8] border border-[#d2e4ea] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#bed8e2] flex items-center justify-center text-[#164b62] shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Uji Audio Sistem Pengawas</span>
                  <span className="text-[11px] text-slate-600 block">
                    Klik untuk memastikan speaker dan browser mengizinkan audio alarm aktif.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTestAudio}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#bed8e2] text-xs font-bold text-[#164b62] hover:bg-[#164b62] hover:text-white transition-colors flex items-center gap-1.5"
              >
                {testedAudio ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{testedAudio ? 'Tes Lagi' : 'Tes Suara'}</span>
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {errorMsg}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#164b62] hover:bg-[#1f5c76] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mulai Mengerjakan Ujian</span>
                <Play className="w-4 h-4 fill-white" />
              </button>
            </div>
          </form>
        </section>

        {/* Sidebar: Briefing & Topics */}
        <aside className="space-y-5">
          <div className="rounded-3xl bg-[#e8eeed] p-6 border border-[#cfdfde]">
            <h3 className="font-bold text-[#142b3c] text-base mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#164b62]" />
              Ringkasan Asesmen
            </h3>
            <ul className="space-y-3 text-xs text-[#365469]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#164b62] tabular-nums">50</span>
                <span>Butir soal berstandar UKK TJKT (30 PG, 10 Kategori, 10 Multi-pilihan).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#164b62] tabular-nums">100</span>
                <span>Skor maksimum (2 poin setiap butir soal bernilai tepat).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#164b62] tabular-nums">75</span>
                <span>Kriteria Ketuntasan Minimal (KKM standar kelulusan).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#b91c1c]">⚠</span>
                <span>Tab dilarang diminimalkan atau diganti selama ujian aktif.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-[#d8e2e5] shadow-xs">
            <h3 className="font-bold text-[#142b3c] text-sm mb-3">Cakupan Materi Pokok</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Cpu className="w-3.5 h-3.5 text-[#164b62]" />
                <span>CPU, RAM, Firmware BIOS/UEFI</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <HardDrive className="w-3.5 h-3.5 text-[#164b62]" />
                <span>SSD, Partisi & File System</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Network className="w-3.5 h-3.5 text-[#164b62]" />
                <span>NAT, Bridged & Host-only VM</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Server className="w-3.5 h-3.5 text-[#164b62]" />
                <span>DHCP, DNS, SSH & Web Server</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
