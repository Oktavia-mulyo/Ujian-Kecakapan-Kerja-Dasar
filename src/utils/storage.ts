import { ExamSubmission } from '../data/questions';

const STORAGE_KEY = 'tjkt_exam_submissions_v1';
const DRAFT_KEY = 'tjkt_exam_active_draft_v1';
const SETTINGS_KEY = 'tjkt_exam_settings_v1';

export interface ProctorSettings {
  strictTabReset: boolean; // If true, leaving tab/blur completely wipes answers & returns to start
  enableSoundAlarm: boolean; // Sound alarm on tab switch
  examDurationMinutes: number; // 0 for unlimited, or e.g. 60
}

export const DEFAULT_SETTINGS: ProctorSettings = {
  strictTabReset: true,
  enableSoundAlarm: true,
  examDurationMinutes: 60,
};

export function getSubmissions(): ExamSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSubmission(sub: ExamSubmission): void {
  try {
    const list = getSubmissions();
    const updated = [sub, ...list.filter(item => item.id !== sub.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Clear draft on successful submit
    clearExamDraft();
  } catch (e) {
    console.error('Failed to save submission:', e);
  }
}

export function clearAllSubmissions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear submissions:', e);
  }
}

export function getProctorSettings(): ProctorSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveProctorSettings(settings: ProctorSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export interface ExamDraft {
  identity: {
    nama: string;
    kelas: string;
    no_absen: string;
  };
  answers: (number | (boolean | null)[] | number[] | null)[];
  flagged: boolean[];
  currentQuestion: number;
  startTime: string;
  violations: number;
}

export function saveExamDraft(draft: ExamDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function getExamDraft(): ExamDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearExamDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function exportSubmissionsToCSV(submissions: ExamSubmission[]): void {
  if (submissions.length === 0) return;

  const headers = ['No', 'ID', 'Nama Lengkap', 'Kelas', 'No Absen', 'Skor', 'Total Benar', 'Total Soal', 'Pelanggaran Tab', 'Waktu Mulai', 'Waktu Selesai', 'Durasi (detik)'];
  const rows = submissions.map((s, idx) => [
    idx + 1,
    `"${s.id}"`,
    `"${s.nama.replace(/"/g, '""')}"`,
    `"${s.kelas.replace(/"/g, '""')}"`,
    `"${s.no_absen.replace(/"/g, '""')}"`,
    s.skor,
    s.total_benar,
    s.total_soal,
    s.pelanggaran_tab,
    `"${s.waktu_mulai}"`,
    `"${s.waktu_selesai}"`,
    s.durasi_detik,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rekap_nilai_tjkt_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
