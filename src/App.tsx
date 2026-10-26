import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QUESTIONS, Question, ExamSubmission } from './data/questions';
import { 
  getSubmissions, 
  saveSubmission, 
  clearAllSubmissions, 
  getProctorSettings, 
  saveProctorSettings, 
  ProctorSettings,
  getExamDraft,
  saveExamDraft,
  clearExamDraft
} from './utils/storage';
import { soundManager } from './utils/audio';
import { TopHeader } from './components/TopHeader';
import { IdentityView } from './components/IdentityView';
import { ExamView, UserAnswer } from './components/ExamView';
import { ResultView } from './components/ResultView';
import { TeacherRecapView } from './components/TeacherRecapView';
import { RulesModal } from './components/RulesModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'identity' | 'exam' | 'result' | 'recap'>('identity');
  const [participant, setParticipant] = useState({ nama: '', kelas: '', no_absen: '' });
  const [answers, setAnswers] = useState<UserAnswer[]>(() => Array(50).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(() => Array(50).fill(false));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [violations, setViolations] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isExamActive, setIsExamActive] = useState(false);
  const [settings, setSettings] = useState<ProctorSettings>(() => getProctorSettings());
  const [activeSubmission, setActiveSubmission] = useState<ExamSubmission | null>(null);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => getSubmissions());
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastViolationNotice, setLastViolationNotice] = useState<string>('');
  const [hasDraft, setHasDraft] = useState<boolean>(() => !!getExamDraft());

  const isExamActiveRef = useRef(isExamActive);
  isExamActiveRef.current = isExamActive;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const isSubmittingRef = useRef(false);

  // Load submissions from storage on mount
  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  // Timer loop for active exam
  useEffect(() => {
    if (!isExamActive) return;

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive]);

  // Periodic autosave of draft while in exam
  useEffect(() => {
    if (isExamActive && participant.nama) {
      saveExamDraft({
        identity: participant,
        answers,
        flagged,
        currentQuestion,
        startTime: new Date().toISOString(),
        violations,
      });
      setHasDraft(true);
    }
  }, [isExamActive, participant, answers, flagged, currentQuestion, violations]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Sound and tab violation proctoring
  const handleTabViolation = useCallback(() => {
    if (!isExamActiveRef.current || isSubmittingRef.current) return;

    setViolations(v => v + 1);

    if (settingsRef.current.enableSoundAlarm) {
      soundManager.startAlarmLoop();
    }

    if (settingsRef.current.strictTabReset) {
      // Strict rule: wipes answers and resets exam to identity view
      setIsExamActive(false);
      clearExamDraft();
      setHasDraft(false);
      setAnswers(Array(50).fill(null));
      setFlagged(Array(50).fill(false));
      setCurrentQuestion(0);
      setCurrentView('identity');
      setLastViolationNotice('Tab ujian ditinggalkan! Jawaban telah dihapus dan ujian harus dimulai dari awal sesuai ketentuan pengawasan.');
    }
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        handleTabViolation();
      } else {
        // Returned to tab: stop alarm
        soundManager.stopAlarmLoop();
      }
    };

    const onBlur = () => {
      if (!document.hidden) {
        handleTabViolation();
      }
    };

    const onFocus = () => {
      soundManager.stopAlarmLoop();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [handleTabViolation]);

  // Start new exam
  const handleStartExam = (
    newIdentity: { nama: string; kelas: string; no_absen: string },
    newSettings: ProctorSettings
  ) => {
    setParticipant(newIdentity);
    setSettings(newSettings);
    saveProctorSettings(newSettings);
    setAnswers(Array(50).fill(null));
    setFlagged(Array(50).fill(false));
    setCurrentQuestion(0);
    setElapsedSeconds(0);
    setViolations(0);
    setLastViolationNotice('');
    setIsExamActive(true);
    setCurrentView('exam');
  };

  // Resume existing draft
  const handleResumeDraft = () => {
    const draft = getExamDraft();
    if (draft) {
      setParticipant(draft.identity);
      setAnswers(draft.answers);
      setFlagged(draft.flagged);
      setCurrentQuestion(draft.currentQuestion);
      setViolations(draft.violations || 0);
      setIsExamActive(true);
      setCurrentView('exam');
    }
  };

  // Discard draft
  const handleDiscardDraft = () => {
    clearExamDraft();
    setHasDraft(false);
  };

  // Answer change handler
  const handleAnswerChange = (index: number, answer: UserAnswer) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[index] = answer;
      return copy;
    });
  };

  // Flag toggle handler
  const handleToggleFlag = (index: number) => {
    setFlagged(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // Submit exam calculation
  const handleSubmitExam = () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    soundManager.stopAlarmLoop();

    let correctCount = 0;
    QUESTIONS.forEach((q, i) => {
      const a = answers[i];
      if (a === null || a === undefined) return;

      if (q.type === 'PG') {
        if (a === q.correct) correctCount++;
      } else if (q.type === 'PGK Kategori') {
        if (Array.isArray(a) && a.length === 3 && a.every((v, j) => v === q.correct[j])) {
          correctCount++;
        }
      } else if (q.type === 'PGK MCMA') {
        if (Array.isArray(a) && a.length === q.correct.length && a.every((v, j) => v === q.correct[j])) {
          correctCount++;
        }
      }
    });

    const score = correctCount * 2;
    const submissionId = 'SUB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const newSubmission: ExamSubmission = {
      id: submissionId,
      nama: participant.nama,
      kelas: participant.kelas,
      no_absen: participant.no_absen,
      skor: score,
      total_benar: correctCount,
      total_soal: 50,
      waktu_mulai: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      waktu_selesai: new Date().toISOString(),
      durasi_detik: elapsedSeconds,
      pelanggaran_tab: violations,
      answers: [...answers],
    };

    saveSubmission(newSubmission);
    setSubmissions(getSubmissions());
    setActiveSubmission(newSubmission);
    setIsExamActive(false);
    clearExamDraft();
    setHasDraft(false);
    isSubmittingRef.current = false;
    setCurrentView('result');
  };

  // Retake exam
  const handleRetake = () => {
    setAnswers(Array(50).fill(null));
    setFlagged(Array(50).fill(false));
    setCurrentQuestion(0);
    setElapsedSeconds(0);
    setViolations(0);
    setIsExamActive(false);
    setCurrentView('identity');
  };

  // Clear all submissions from storage
  const handleClearAllSubmissions = () => {
    clearAllSubmissions();
    setSubmissions([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f0] text-[#142b3c] font-['DM_Sans',sans-serif]">
      {/* Top Navigation */}
      <TopHeader
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        isExamActive={isExamActive}
        onOpenRules={() => setIsRulesOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'identity' && (
          <IdentityView
            initialIdentity={participant}
            onStartExam={handleStartExam}
            settings={settings}
            onUpdateSettings={(newSettings) => {
              setSettings(newSettings);
              saveProctorSettings(newSettings);
            }}
            hasDraft={hasDraft}
            onResumeDraft={handleResumeDraft}
            onDiscardDraft={handleDiscardDraft}
            lastViolationNotice={lastViolationNotice}
          />
        )}

        {currentView === 'exam' && (
          <ExamView
            questions={QUESTIONS}
            currentQuestion={currentQuestion}
            onSelectQuestion={(idx) => setCurrentQuestion(idx)}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            flagged={flagged}
            onToggleFlag={handleToggleFlag}
            participant={participant}
            violations={violations}
            elapsedSeconds={elapsedSeconds}
            onSubmitExam={handleSubmitExam}
          />
        )}

        {currentView === 'result' && activeSubmission && (
          <ResultView
            submission={activeSubmission}
            questions={QUESTIONS}
            onRetake={handleRetake}
            onViewRecap={() => setCurrentView('recap')}
          />
        )}

        {currentView === 'recap' && (
          <TeacherRecapView
            submissions={submissions}
            onBack={() => setCurrentView(isExamActive ? 'exam' : 'identity')}
            onClearAll={handleClearAllSubmissions}
            onSelectSubmission={(sub) => {
              setActiveSubmission(sub);
              setCurrentView('result');
            }}
          />
        )}
      </main>

      {/* Footer (Screen only) */}
      <footer className="print:hidden border-t border-[#d8e2e5] bg-white py-6 px-4 text-center text-xs text-[#587083]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4">
          <span>Asesmen Kecakapan Kerja Dasar · Jurusan TJKT (Teknik Jaringan Komputer & Telekomunikasi)</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Petunjuk Ujian
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentView('recap')}
              className="hover:text-slate-900 transition-colors"
            >
              Rekap Guru ({submissions.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Rules & Help Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
