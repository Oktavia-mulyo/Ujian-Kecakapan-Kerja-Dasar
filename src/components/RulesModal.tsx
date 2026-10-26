import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-modal-title"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 bg-[#164b62] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#e4ad49]" />
            <h2 id="rules-modal-title" className="text-lg font-bold">Aturan & Petunjuk Asesmen TJKT</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#164b62]" />
              Struktur & Komposisi Soal (50 Butir)
            </h3>
            <p className="text-slate-600 mb-3">
              Ujian terdiri dari 50 butir soal kecakapan kerja dasar dengan total skor maksimal 100 poin (setiap nomor bernilai 2 poin):
            </p>
            <ul className="grid sm:grid-cols-3 gap-3">
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-[#164b62] block mb-1">Nomor 1 – 30</span>
                <span className="font-semibold block text-slate-900">Pilihan Ganda (PG)</span>
                <span className="text-xs text-slate-500">Pilih 1 jawaban paling tepat dari 5 opsi (A–E). Skor 2 poin.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-[#164b62] block mb-1">Nomor 31 – 40</span>
                <span className="font-semibold block text-slate-900">PGK Kategori</span>
                <span className="text-xs text-slate-500">Tentukan Benar atau Salah pada 3 pernyataan. Seluruh 3 pernyataan harus tepat untuk 2 poin.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-[#164b62] block mb-1">Nomor 41 – 50</span>
                <span className="font-semibold block text-slate-900">PGK MCMA</span>
                <span className="text-xs text-slate-500">Pilihan jamak kompleks. Beri tanda centang pada seluruh pilihan yang benar.</span>
              </li>
            </ul>
          </section>

          <section className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-950 mb-1">Ketentuan Pengawasan Tab & Kejujuran</h4>
                <p className="text-xs leading-relaxed text-amber-800">
                  Dilarang berpindah tab browser atau meminimalkan jendela selama ujian. Sistem dilengkapi sensor otomatis:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-xs text-amber-800">
                  <li>Setiap perpindahan tab / kehilangan fokus jendela akan dicatat sebagai pelanggaran proctoring.</li>
                  <li>Alarm akustik (audio warning) otomatis berbunyi saat jendela ditinggalkan.</li>
                  <li>Dalam Mode Ketat (Strict Reset), berpindah tab dapat menghapus progres jawaban demi menjaga integritas asesmen.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#164b62]" />
              Fitur Navigasi & Penyimpanan Nilai
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><strong>Navigasi Cepat:</strong> Anda dapat melompat ke nomor manapun melalui panel nomor soal di sebelah kanan.</li>
              <li><strong>Tombol Ragu-ragu:</strong> Gunakan tanda ragu-ragu untuk menandai soal yang ingin ditinjau kembali sebelum dikumpulkan.</li>
              <li><strong>Rekap Nilai Otomatis:</strong> Nilai akhir dihitung seketika dan tersimpan di basis data lokal perangkat, dapat dicetak menjadi Slip Nilai resmi serta diekspor ke format CSV oleh guru.</li>
            </ul>
          </section>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#164b62] rounded-xl hover:bg-[#1f5c76] transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
