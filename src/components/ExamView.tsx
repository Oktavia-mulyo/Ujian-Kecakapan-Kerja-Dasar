import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send, 
  ListFilter,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { Question } from '../data/questions';

export type UserAnswer = number | (boolean | null)[] | number[] | null;

interface ExamViewProps {
  questions: Question[];
  currentQuestion: number;
  onSelectQuestion: (index: number) => void;
  answers: UserAnswer[];
  onAnswerChange: (index: number, answer: UserAnswer) => void;
  flagged: boolean[];
  onToggleFlag: (index: number) => void;
  participant: { nama: string; kelas: string; no_absen: string };
  violations: number;
  elapsedSeconds: number;
  onSubmitExam: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  questions,
  currentQuestion,
  onSelectQuestion,
  answers,
  onAnswerChange,
  flagged,
  onToggleFlag,
  participant,
  violations,
  elapsedSeconds,
  onSubmitExam,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'unanswered' | 'flagged'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const q = questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];

  // Check if a question is answered
  const isQuestionAnswered = (idx: number): boolean => {
    const a = answers[idx];
    if (a === null || a === undefined) return false;
    const targetQ = questions[idx];
    if (targetQ.type === 'PG') {
      return typeof a === 'number';
    }
    if (targetQ.type === 'PGK Kategori') {
      return Array.isArray(a) && a.length === 3 && a.every(val => val !== null);
    }
    if (targetQ.type === 'PGK MCMA') {
      return Array.isArray(a) && a.length > 0;
    }
    return false;
  };

  const answeredCount = questions.filter((_, i) => isQuestionAnswered(i)).length;
  const flaggedCount = flagged.filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or modal
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        if (currentQuestion < questions.length - 1) {
          onSelectQuestion(currentQuestion + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        if (currentQuestion > 0) {
          onSelectQuestion(currentQuestion - 1);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        onToggleFlag(currentQuestion);
      } else if (q.type === 'PG' && ['1', '2', '3', '4', '5'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (optIdx < q.options.length) {
          onAnswerChange(currentQuestion, optIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, questions.length, onSelectQuestion, onToggleFlag, q, onAnswerChange]);

  // Handlers for question answer types
  const handleSelectPG = (optionIndex: number) => {
    onAnswerChange(currentQuestion, optionIndex);
  };

  const handleSelectCategory = (statementIndex: number, value: boolean) => {
    const prev = Array.isArray(currentAnswer)
      ? ([...currentAnswer] as (boolean | null)[])
      : [null, null, null];
    prev[statementIndex] = value;
    onAnswerChange(currentQuestion, prev);
  };

  const handleToggleMCMA = (optionIndex: number) => {
    const prev = Array.isArray(currentAnswer) ? ([...currentAnswer] as number[]) : [];
    let updated: number[];
    if (prev.includes(optionIndex)) {
      updated = prev.filter(x => x !== optionIndex);
    } else {
      updated = [...prev, optionIndex].sort((a, b) => a - b);
    }
    onAnswerChange(currentQuestion, updated);
  };

  // Filtered list of questions for navigation grid
  const filteredIndices = questions
    .map((_, i) => i)
    .filter(i => {
      if (filterMode === 'unanswered') return !isQuestionAnswered(i);
      if (filterMode === 'flagged') return flagged[i];
      return true;
    });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Status Bar: Participant info, Timer, Progress */}
      <div className="mb-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#164b62] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {participant.no_absen || '01'}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              {participant.nama}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{participant.kelas}</span>
              <span>·</span>
              <span>No. Absen {participant.no_absen}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Proctor tab violations monitor */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <ShieldAlert className={`w-4 h-4 ${violations > 0 ? 'text-rose-500' : 'text-emerald-600'}`} />
            <span className="text-slate-600">Pelanggaran Tab:</span>
            <span className={`font-bold tabular-nums ${violations > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {violations}
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f0f6f8] border border-[#bed8e2] text-xs font-semibold text-[#164b62]">
            <Clock className="w-4 h-4 text-[#164b62]" />
            <span className="font-mono tabular-nums text-sm">{formatTime(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        {/* Main Left Zone: Question Card */}
        <main className="space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm relative">
            {/* Header: Question Number & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#164b62] bg-[#e9f3f5] px-3 py-1 rounded-full">
                  Soal {currentQuestion + 1} dari {questions.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {q.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFlag(currentQuestion)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    flagged[currentQuestion]
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${flagged[currentQuestion] ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{flagged[currentQuestion] ? 'Ditandai Ragu' : 'Tandai Ragu-ragu'}</span>
                </button>
              </div>
            </div>

            {/* Linear Progress */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full my-4 overflow-hidden">
              <div 
                className="bg-[#164b62] h-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#164b62] mb-1">
                {q.type === 'PG' && 'PILIHAN GANDA TUNGGAL (PILIH 1 OPSI)'}
                {q.type === 'PGK Kategori' && 'PGK KATEGORI (TENTUKAN BENAR ATAU SALAH)'}
                {q.type === 'PGK MCMA' && 'PGK PILIHAN JAMAK (PILIH SEMUA YANG BENAR)'}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {q.text}
              </h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                {q.type === 'PG' && 'Pilihlah satu opsi yang paling tepat.'}
                {q.type === 'PGK Kategori' && 'Tentukan Benar atau Salah untuk setiap pernyataan di bawah ini.'}
                {q.type === 'PGK MCMA' && 'Beri tanda centang pada opsi yang memenuhi kriteria pertanyaan.'}
              </p>
            </div>

            {/* Answer Options Area */}
            <div className="mt-6 space-y-3">
              {/* Type 1: PG (Single choice radio) */}
              {q.type === 'PG' && (
                <div className="space-y-2.5">
                  {q.options.map((optText, optIdx) => {
                    const isSelected = currentAnswer === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectPG(optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#edf6f9] border-[#164b62] shadow-xs ring-1 ring-[#164b62]'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#164b62] text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {letter}
                        </div>
                        <div className="text-sm font-medium text-slate-800 pt-0.5 leading-relaxed">
                          {optText}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 2: PGK Kategori (Statement True/False) */}
              {q.type === 'PGK Kategori' && (
                <div className="space-y-4">
                  {q.statements.map((stmt, stmtIdx) => {
                    const stmtLetter = String.fromCharCode(65 + stmtIdx);
                    const selectedVal = Array.isArray(currentAnswer)
                      ? currentAnswer[stmtIdx]
                      : null;

                    return (
                      <div
                        key={stmtIdx}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-bold text-xs bg-[#164b62] text-white rounded-lg px-2 py-0.5 shrink-0">
                            Pernyataan {stmtLetter}
                          </span>
                          <p className="text-sm text-slate-800 leading-relaxed font-medium">
                            {stmt}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-1 pl-1">
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(stmtIdx, true)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              selectedVal === true
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-600 hover:text-emerald-700'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current" />
                            <span>Benar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelectCategory(stmtIdx, false)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              selectedVal === false
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-300 hover:border-rose-600 hover:text-rose-700'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current" />
                            <span>Salah</span>
                          </button>

                          <span className="text-[11px] text-slate-400 italic ml-2">
                            {selectedVal === null ? 'Belum ditentukan' : 'Sudah dipilih'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 3: PGK MCMA (Multi-Choice Multi-Answer) */}
              {q.type === 'PGK MCMA' && (
                <div className="space-y-2.5">
                  {q.options.map((optText, optIdx) => {
                    const isSelected = Array.isArray(currentAnswer) && (currentAnswer as number[]).includes(optIdx);
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleToggleMCMA(optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#edf6f9] border-[#164b62] shadow-xs ring-1 ring-[#164b62]'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors border ${
                            isSelected
                              ? 'bg-[#164b62] text-white border-[#164b62]'
                              : 'bg-white text-slate-500 border-slate-300'
                          }`}
                        >
                          {isSelected ? '✓' : letter}
                        </div>
                        <div className="text-sm font-medium text-slate-800 leading-relaxed">
                          <span className="font-bold mr-1.5 text-slate-500">{letter}.</span>
                          {optText}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar inside Question Card */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelectQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-3">
                {currentQuestion < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => onSelectQuestion(currentQuestion + 1)}
                    className="px-6 py-2.5 rounded-xl bg-[#164b62] hover:bg-[#1f5c76] text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kumpulkan Jawaban</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Navigation Grid & Status */}
        <aside className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Navigasi Nomor Soal</h3>
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                {answeredCount} / {questions.length} Terjawab
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl my-3 text-[11px] font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Semua ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('unanswered')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  filterMode === 'unanswered' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Belum ({unansweredCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('flagged')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  filterMode === 'flagged' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Ragu ({flaggedCount})
              </button>
            </div>

            {/* Grid of 50 numbers */}
            <div className="grid grid-cols-5 gap-2 max-h-[340px] overflow-y-auto pr-1 py-1">
              {filteredIndices.map(idx => {
                const isCurrent = idx === currentQuestion;
                const isAnswered = isQuestionAnswered(idx);
                const isFlagged = flagged[idx];

                let btnStyle = 'bg-white text-slate-700 border-slate-200 hover:border-slate-400';
                if (isCurrent) {
                  btnStyle = 'bg-[#164b62] text-white border-[#164b62] ring-2 ring-[#164b62]/30 shadow-xs';
                } else if (isFlagged) {
                  btnStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                } else if (isAnswered) {
                  btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectQuestion(idx)}
                    className={`h-10 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center relative cursor-pointer ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && !isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#164b62]" />
                <span>Sedang aktif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300" />
                <span>Sudah dijawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" />
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-white border border-slate-200" />
                <span>Belum dijawab</span>
              </div>
            </div>

            {/* Quick jump to submit */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kumpulkan Asesmen</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal when Submitting */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f0f6f8] text-[#164b62] flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Konfirmasi Pengumpulan</h3>
                <p className="text-xs text-slate-500">
                  Periksa kembali ringkasan jawaban Anda sebelum mengakhiri ujian.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 block">Terjawab</span>
                <span className="text-xl font-bold text-emerald-900 tabular-nums">{answeredCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs text-amber-800 block">Ragu-ragu</span>
                <span className="text-xl font-bold text-amber-900 tabular-nums">{flaggedCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-xs text-rose-800 block">Belum</span>
                <span className="text-xl font-bold text-rose-900 tabular-nums">{unansweredCount}</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Masih terdapat <strong>{unansweredCount} nomor</strong> yang belum Anda jawab. Setiap jawaban kosong tidak mendapatkan poin.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cek Jawaban Lagi
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  onSubmitExam();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#164b62] hover:bg-[#1f5c76] text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
