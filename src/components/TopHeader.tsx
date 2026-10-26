import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, BookOpen, Users, ShieldAlert } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TopHeaderProps {
  currentView: 'identity' | 'exam' | 'result' | 'recap';
  onNavigate: (view: 'identity' | 'exam' | 'result' | 'recap') => void;
  isExamActive: boolean;
  onOpenRules: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  onNavigate,
  isExamActive,
  onOpenRules,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [muted, setMuted] = React.useState(soundManager.getIsMuted());

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    soundManager.setMuted(next);
    if (!next) {
      soundManager.playSingleBeep(700, 0.15, 0.05);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#164b62] text-white border-b border-[#0f3546] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#e4ad49] text-[#142b3c] font-bold flex items-center justify-center text-lg shadow-sm">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-base sm:text-lg leading-tight whitespace-nowrap">
              TJKT · Ruang Ujian
            </span>
            <span className="text-[11px] text-[#b3ced9] tracking-wider font-medium hidden sm:inline">
              Kecakapan Kerja Dasar · 50 Soal
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#d8e8ee]">
          <button
            onClick={() => {
              if (isExamActive && currentView === 'exam') return;
              onNavigate(isExamActive ? 'exam' : 'identity');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'exam' || currentView === 'identity' ? 'text-[#e4ad49] font-semibold' : ''
            }`}
          >
            {isExamActive ? 'Ujian Berlangsung' : 'Halaman Ujian'}
          </button>

          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white"
          >
            <BookOpen className="w-4 h-4 text-[#e4ad49]" />
            <span>Petunjuk & Aturan</span>
          </button>

          <button
            onClick={() => onNavigate('recap')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'recap' ? 'text-[#e4ad49] font-semibold' : ''
            }`}
          >
            <Users className="w-4 h-4 text-[#e4ad49]" />
            <span>Rekap Nilai Guru</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Sound toggle, Fullscreen, Status) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={muted ? 'Aktifkan suara alarm' : 'Senyapkan suara alarm'}
            title={muted ? 'Suara alarm dibisukan' : 'Suara alarm aktif'}
            className="p-2 rounded-lg bg-[#0e3647] hover:bg-[#1a556f] text-[#d8e8ee] hover:text-white transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-[#f87171]" /> : <Volume2 className="w-4 h-4 text-[#4ade80]" />}
          </button>

          <button
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
            title="Layar penuh (Proctor Mode)"
            className="p-2 rounded-lg bg-[#0e3647] hover:bg-[#1a556f] text-[#d8e8ee] hover:text-white transition-colors hidden sm:flex items-center"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isExamActive && currentView === 'exam' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c2f3f] text-[#fcd34d] text-xs font-semibold border border-[#235870]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#e4ad49]" />
              <span className="hidden sm:inline">Pengawasan Aktif</span>
            </div>
          ) : (
            <button
              onClick={() => onNavigate(isExamActive ? 'exam' : 'identity')}
              className="px-4 py-2 text-xs font-bold text-[#142b3c] bg-[#e4ad49] rounded-lg hover:bg-[#f0be62] transition-colors whitespace-nowrap shadow-sm"
            >
              {isExamActive ? 'Lanjutkan Ujian' : 'Mulai Ujian'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
