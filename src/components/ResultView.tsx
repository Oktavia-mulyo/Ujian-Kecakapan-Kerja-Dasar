import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  RotateCcw, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ExamSubmission, Question } from '../data/questions';

interface ResultViewProps {
  submission: ExamSubmission;
  questions: Question[];
  onRetake: () => void;
  onViewRecap: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  submission,
  questions,
  onRetake,
  onViewRecap,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

  const isPassed = submission.skor >= 75;
  const minutes = Math.floor(submission.durasi_detik / 60);
  const seconds = submission.durasi_detik % 60;

  const toggleExplanation = (idx: number) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to test if question was answered correctly in this submission
  const isAnswerCorrect = (q: Question, answer: unknown): boolean => {
    if (answer === null || answer === undefined) return false;
    if (q.type === 'PG') {
      return answer === q.correct;
    }
    if (q.type === 'PGK Kategori') {
      return (
        Array.isArray(answer) &&
        answer.length === 3 &&
        answer.every((val, i) => val === q.correct[i])
      );
    }
    if (q.type === 'PGK MCMA') {
      if (!Array.isArray(answer)) return false;
      if (answer.length !== q.correct.length) return false;
      return answer.every((val, i) => val === q.correct[i]);
    }
    return false;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12 px-4 sm:px-6">
      {/* Screen-Only Result Presentation */}
      <div className="print:hidden space-y-8">
        {/* Main Result Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#164b62] via-[#e4ad49] to-emerald-500" />

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-[#164b62] bg-[#eef5f7] px-3 py-1 rounded-full uppercase tracking-wider">
                Laporan Hasil Ujian
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Asesmen Selesai Dikerjakan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Data jawaban dan perolehan nilai telah tersimpan di sistem basis data lokal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{isPassed ? 'KOMPETEN (LULUS KKM)' : 'BELUM KOMPETEN (REMIDIAL)'}</span>
              </span>
            </div>
          </div>

          {/* Participant Info Strip */}
          <div className="grid sm:grid-cols-3 gap-4 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Nama Peserta</span>
              <span className="font-bold text-slate-900 text-sm">{submission.nama}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Kelas & Nomor Absen</span>
              <span className="font-bold text-slate-900 text-sm">
                {submission.kelas} · Absen {submission.no_absen}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Waktu Selesai</span>
              <span className="font-semibold text-slate-900">
                {new Date(submission.waktu_selesai).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>

          {/* Score & Metric Highlights */}
          <div className="grid sm:grid-cols-4 gap-4 my-6">
            <div className="p-5 rounded-2xl bg-[#edf5f8] border border-[#bed8e2] flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#164b62]">Nilai Akhir</span>
              <div className="text-4xl sm:text-5xl font-black text-[#164b62] tabular-nums mt-1">
                {submission.skor}
                <span className="text-base font-normal text-slate-500">/100</span>
              </div>
              <span className="text-[11px] text-[#164b62] mt-2 font-medium">
                Standar KKM: 75 poin
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <span className="text-xs font-semibold text-emerald-800">Jumlah Jawaban Benar</span>
              <div className="text-4xl font-bold text-emerald-900 tabular-nums mt-1">
                {submission.total_benar}
                <span className="text-base font-normal text-emerald-700">/{submission.total_soal}</span>
              </div>
              <span className="text-[11px] text-emerald-700 mt-2 font-medium">
                Tingkat Akurasi: {Math.round((submission.total_benar / submission.total_soal) * 100)}%
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Durasi Pengerjaan
              </span>
              <div className="text-3xl font-bold text-slate-900 tabular-nums mt-1">
                {minutes}m {seconds}s
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">
                Kecepatan: ~{Math.round(submission.durasi_detik / 50)} detik/soal
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                Pelanggaran Tab
              </span>
              <div className={`text-3xl font-bold tabular-nums mt-1 ${submission.pelanggaran_tab > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {submission.pelanggaran_tab}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">
                {submission.pelanggaran_tab === 0 ? 'Tertib penuh' : 'Tercatat dalam log'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-[#164b62] hover:bg-[#1f5c76] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Unduh Slip Nilai</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReview(!showReview)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#164b62]" />
                <span>{showReview ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan & Kunci'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onViewRecap}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-slate-500" />
                <span>Rekap Guru</span>
              </button>

              <button
                type="button"
                onClick={onRetake}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Ujian Ulang</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Question Review Section */}
        {showReview && (
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pembahasan & Analisis Soal</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tinjau jawaban Anda, kunci jawaban yang benar, dan penjelasan teknis setiap materi.
                </p>
              </div>

              {/* Review Filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua (50)
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reviewFilter === 'correct' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Benar ({submission.total_benar})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    reviewFilter === 'incorrect' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Salah ({50 - submission.total_benar})
                </button>
              </div>
            </div>

            {/* List of reviewed questions */}
            <div className="space-y-4">
              {questions
                .filter((q, idx) => {
                  const correct = isAnswerCorrect(q, submission.answers[idx]);
                  if (reviewFilter === 'correct') return correct;
                  if (reviewFilter === 'incorrect') return !correct;
                  return true;
                })
                .map((q) => {
                  const idx = q.id - 1;
                  const userAns = submission.answers[idx];
                  const correct = isAnswerCorrect(q, userAns);
                  const isExpanded = expandedExplanations[idx] ?? true;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        correct
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-rose-200 bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              correct ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                            }`}
                          >
                            {correct ? '✓' : '✕'}
                          </span>
                          <span className="font-bold text-sm text-slate-900">
                            Soal {q.id}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            · {q.topic}
                          </span>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            correct
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {correct ? '+2 Poin' : '0 Poin'}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-800 leading-snug">
                        {q.text}
                      </p>

                      {/* Detail Answer View per Type */}
                      <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                        {q.type === 'PG' && (
                          <div className="space-y-1">
                            <div>
                              <span className="text-slate-500 font-medium">Jawaban Anda: </span>
                              <span
                                className={`font-bold ${
                                  userAns === q.correct ? 'text-emerald-700' : 'text-rose-700'
                                }`}
                              >
                                {userAns !== null && typeof userAns === 'number'
                                  ? `${String.fromCharCode(65 + userAns)}. ${q.options[userAns]}`
                                  : 'Tidak dijawab'}
                              </span>
                            </div>
                            {userAns !== q.correct && (
                              <div>
                                <span className="text-slate-500 font-medium">Kunci Jawaban Benar: </span>
                                <span className="font-bold text-emerald-700">
                                  {String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {q.type === 'PGK Kategori' && (
                          <div className="space-y-2">
                            {q.statements.map((stmt, sIdx) => {
                              const sLetter = String.fromCharCode(65 + sIdx);
                              const uVal = Array.isArray(userAns) ? userAns[sIdx] : null;
                              const cVal = q.correct[sIdx];
                              const isStatementMatch = uVal === cVal;
                              return (
                                <div key={sIdx} className="border-t border-slate-100 pt-1.5">
                                  <div className="text-slate-800 font-medium mb-1">
                                    <span className="font-bold mr-1">[{sLetter}]</span>
                                    {stmt}
                                  </div>
                                  <div className="flex items-center gap-3 text-[11px]">
                                    <span className={isStatementMatch ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                                      Pilihan Anda: {uVal === true ? 'Benar' : uVal === false ? 'Salah' : 'Kosong'}
                                    </span>
                                    <span className="text-slate-400">·</span>
                                    <span className="text-slate-600 font-semibold">
                                      Kunci: {cVal ? 'Benar' : 'Salah'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {q.type === 'PGK MCMA' && (
                          <div className="space-y-1">
                            <div>
                              <span className="text-slate-500 font-medium">Pilihan Anda: </span>
                              <span className={correct ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                                {Array.isArray(userAns) && userAns.length > 0
                                  ? (userAns as unknown[])
                                      .filter((v): v is number => typeof v === 'number')
                                      .map(v => String.fromCharCode(65 + v))
                                      .join(', ')
                                  : 'Tidak dijawab'}
                              </span>
                            </div>
                            {!correct && (
                              <div>
                                <span className="text-slate-500 font-medium">Kunci Pilihan Benar: </span>
                                <span className="font-bold text-emerald-700">
                                  {q.correct.map(v => `${String.fromCharCode(65 + v)}. ${q.options[v]}`).join(' | ')}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Explanation Callout */}
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => toggleExplanation(idx)}
                          className="text-[11px] font-bold text-[#164b62] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Penjelasan Konsep</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {isExpanded && (
                          <p className="mt-1.5 text-xs text-slate-600 bg-white/80 p-3 rounded-xl border border-slate-200 leading-relaxed">
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Official Printable Score Slip (Visible only on print or ctrl+P) */}
      <div className="hidden print:block p-8 bg-white text-black font-sans leading-relaxed">
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-xl font-bold tracking-wider uppercase">
            SMK TEKNIK JARINGAN KOMPUTER & TELEKOMUNIKASI
          </h1>
          <h2 className="text-base font-semibold mt-1">
            SURAT HASIL UJIAN KECAKAPAN KERJA DASAR (UKK-D)
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Tahun Ajaran 2026/2027 · Standar Kurikulum Merdeka Kejuruan
          </p>
        </div>

        <div className="my-6 grid grid-cols-2 gap-4 text-xs">
          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 font-semibold w-32">Nomor Peserta</td>
                  <td className="py-1">: {submission.id.slice(0, 12)}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Nama Lengkap</td>
                  <td className="py-1 font-bold">: {submission.nama}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Kelas / Rombel</td>
                  <td className="py-1">: {submission.kelas}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Nomor Absen</td>
                  <td className="py-1">: {submission.no_absen}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 font-semibold w-32">Mata Uji</td>
                  <td className="py-1">: Kecakapan Kerja Dasar TJKT</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Jumlah Soal</td>
                  <td className="py-1">: 50 Butir</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Waktu Ujian</td>
                  <td className="py-1">: {new Date(submission.waktu_selesai).toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Durasi Ujian</td>
                  <td className="py-1">: {minutes} Menit {seconds} Detik</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-black my-6">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-black font-bold">
                <th className="p-2 border-r border-black">Jumlah Soal</th>
                <th className="p-2 border-r border-black">Jawaban Benar</th>
                <th className="p-2 border-r border-black">Nilai Akhir (Skor)</th>
                <th className="p-2 border-r border-black">Standar KKM</th>
                <th className="p-2">Status Kelulusan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-semibold text-sm">
                <td className="p-3 border-r border-black">{submission.total_soal}</td>
                <td className="p-3 border-r border-black">{submission.total_benar}</td>
                <td className="p-3 border-r border-black text-xl font-bold">{submission.skor}</td>
                <td className="p-3 border-r border-black">75</td>
                <td className="p-3 font-bold uppercase">{isPassed ? 'KOMPETEN' : 'BELUM KOMPETEN'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <p>Mengetahui,</p>
            <p>Guru Penguji / Pembimbing</p>
            <div className="h-16" />
            <p className="font-bold underline">( ........................................ )</p>
            <p className="text-[10px] text-gray-500">NIP / NUPTK</p>
          </div>

          <div>
            <p>Dicetak Pada: {new Date().toLocaleDateString('id-ID')}</p>
            <p>Peserta Ujian</p>
            <div className="h-16" />
            <p className="font-bold underline">{submission.nama}</p>
            <p className="text-[10px] text-gray-500">NIS / NISN</p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-300 text-[10px] text-gray-500 text-center">
          Dokumen hasil asesmen otomatis digenerate oleh Sistem Ujian Kecakapan Kerja Dasar TJKT.
        </div>
      </div>
    </div>
  );
};
