export type QuestionType = 'PG' | 'PGK Kategori' | 'PGK MCMA';

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  topic: string;
  text: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'PG';
  options: string[];
  correct: number;
}

export interface CategoryQuestion extends BaseQuestion {
  type: 'PGK Kategori';
  statements: string[];
  correct: boolean[];
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'PGK MCMA';
  options: string[];
  correct: number[];
}

export type Question = MultipleChoiceQuestion | CategoryQuestion | MultiSelectQuestion;

export interface ExamSubmission {
  id: string;
  nama: string;
  kelas: string;
  no_absen: string;
  skor: number;
  total_benar: number;
  total_soal: number;
  waktu_mulai: string;
  waktu_selesai: string;
  durasi_detik: number;
  pelanggaran_tab: number;
  answers: (number | (boolean | null)[] | number[] | null)[];
}

export const QUESTIONS: Question[] = [
  // 1-30 Pilihan Ganda (PG)
  {
    id: 1,
    type: 'PG',
    topic: 'Perangkat Keras Komputer',
    text: 'Komponen pemroses instruksi dan operasi logika yang menjadi pusat eksekusi program. Istilah yang paling tepat adalah ...',
    options: ['File System', 'CPU', 'Driver', 'Command Line Linux', 'Partisi'],
    correct: 1,
    explanation: 'CPU (Central Processing Unit) atau prosesor adalah otak komputer yang bertugas memproses instruksi aritmetika, logika, dan kontrol instruksi program.'
  },
  {
    id: 2,
    type: 'PG',
    topic: 'Perangkat Keras Komputer',
    text: 'Memori kerja sementara yang menyimpan data aktif dan akan kehilangan isinya ketika daya mati. Istilah yang paling tepat adalah ...',
    options: ['DNS Server', 'File System', 'NAT pada VM', 'Command Line Linux', 'RAM'],
    correct: 4,
    explanation: 'RAM (Random Access Memory) bersifat volatile, artinya data di dalamnya tersimpan sementara selama ada aliran listrik dan terhapus saat komputer dimatikan.'
  },
  {
    id: 3,
    type: 'PG',
    topic: 'Media Penyimpanan',
    text: 'Media penyimpanan berbasis memori flash yang umumnya memiliki akses lebih cepat daripada harddisk mekanis. Istilah yang paling tepat adalah ...',
    options: ['SSD', 'Service/Daemon', 'Bridged Adapter', 'Web Server', 'Host-only Adapter'],
    correct: 0,
    explanation: 'SSD (Solid State Drive) menggunakan chip NAND flash memory tanpa komponen mekanis berputar, menghasilkan latency jauh lebih rendah dan kecepatan read/write tinggi.'
  },
  {
    id: 4,
    type: 'PG',
    topic: 'Jaringan Dasar',
    text: 'Antarmuka jaringan yang menghubungkan komputer ke media jaringan dan mempunyai alamat MAC. Istilah yang paling tepat adalah ...',
    options: ['BIOS/UEFI', 'DNS Server', 'NIC', 'Backup', 'File System'],
    correct: 2,
    explanation: 'NIC (Network Interface Card) atau network adapter menyediakan koneksi fisik/nirkabel ke jaringan dan memiliki MAC address unik sebagai identitas fisik di layer data link.'
  },
  {
    id: 5,
    type: 'PG',
    topic: 'Firmware & Arsitektur',
    text: 'Firmware yang menginisialisasi perangkat keras dan mengatur proses boot sebelum sistem operasi berjalan. Istilah yang paling tepat adalah ...',
    options: ['BIOS/UEFI', 'Partisi', 'Driver', 'Service/Daemon', 'File System'],
    correct: 0,
    explanation: 'BIOS/UEFI adalah firmware tertanam pada motherboard yang melakukan POST (Power-On Self-Test) dan memuat bootloader OS ke dalam RAM.'
  },
  {
    id: 6,
    type: 'PG',
    topic: 'Media Penyimpanan',
    text: 'Pembagian logis media penyimpanan menjadi beberapa bagian untuk sistem, data, atau kebutuhan lain. Istilah yang paling tepat adalah ...',
    options: ['Driver', 'BIOS/UEFI', 'Partisi', 'Command Line Linux', 'File System'],
    correct: 2,
    explanation: 'Partisi membagi drive fisik menjadi beberapa volume terpisah secara logis (misalnya partisi root /, swap, home, atau drive C: dan D:).'
  },
  {
    id: 7,
    type: 'PG',
    topic: 'Sistem Operasi',
    text: 'Struktur yang mengatur penamaan, penyimpanan, izin, dan pengambilan berkas pada media penyimpanan. Istilah yang paling tepat adalah ...',
    options: ['Driver', 'Command Line Linux', 'File System', 'BIOS/UEFI', 'Service/Daemon'],
    correct: 2,
    explanation: 'File System (seperti ext4, NTFS, Btrfs, FAT32) mengatur metadata, struktur hierarki direktori, permission, dan letak blok penyimpanan file.'
  },
  {
    id: 8,
    type: 'PG',
    topic: 'Sistem Operasi',
    text: 'Perangkat lunak penghubung agar sistem operasi dapat berkomunikasi dengan perangkat keras. Istilah yang paling tepat adalah ...',
    options: ['File System', 'Command Line Linux', 'Driver', 'Service/Daemon', 'BIOS/UEFI'],
    correct: 2,
    explanation: 'Driver (device driver) adalah modul perangkat lunak yang menerjemahkan panggilan umum sistem operasi menjadi sinyal spesifik perangkat keras.'
  },
  {
    id: 9,
    type: 'PG',
    topic: 'Sistem Operasi Linux',
    text: 'Antarmuka berbasis teks untuk menjalankan perintah administrasi, navigasi, konfigurasi, dan diagnosis. Istilah yang paling tepat adalah ...',
    options: ['Command Line Linux', 'Partisi', 'BIOS/UEFI', 'Driver', 'Service/Daemon'],
    correct: 0,
    explanation: 'Command Line Linux (CLI / Shell seperti Bash atau Zsh) memungkinkan administrator berinteraksi langsung dengan sistem melalui instruksi teks yang efisien.'
  },
  {
    id: 10,
    type: 'PG',
    topic: 'Layanan Sistem',
    text: 'Program latar belakang yang menyediakan fungsi tertentu dan dapat diatur mulai, berhenti, atau otomatis saat boot. Istilah yang paling tepat adalah ...',
    options: ['Command Line Linux', 'Driver', 'File System', 'Service/Daemon', 'BIOS/UEFI'],
    correct: 3,
    explanation: 'Service atau Daemon (dikelola oleh init system seperti systemd di Linux) berjalan di latar belakang tanpa interaksi langsung layar pengguna.'
  },
  {
    id: 11,
    type: 'PG',
    topic: 'Virtualisasi',
    text: 'Lapisan perangkat lunak yang membuat dan menjalankan mesin virtual dengan membagi sumber daya host. Istilah yang paling tepat adalah ...',
    options: ['NAT pada VM', 'Bridged Adapter', 'Snapshot', 'Host-only Adapter', 'Hypervisor'],
    correct: 4,
    explanation: 'Hypervisor (Virtual Machine Monitor) seperti KVM, VMware ESXi/Workstation, atau VirtualBox memvirtualisasi CPU, memori, dan I/O untuk menjalankan beberapa OS bersamaan.'
  },
  {
    id: 12,
    type: 'PG',
    topic: 'Virtualisasi',
    text: 'Rekaman keadaan mesin virtual pada suatu waktu yang berguna untuk kembali ke kondisi sebelumnya. Istilah yang paling tepat adalah ...',
    options: ['Snapshot', 'NAT pada VM', 'Hypervisor', 'Bridged Adapter', 'Host-only Adapter'],
    correct: 0,
    explanation: 'Snapshot menyimpan status disk dan memori VM pada waktu tertentu, memungkinkan rollback cepat saat pengujian sistem menghasilkan error.'
  },
  {
    id: 13,
    type: 'PG',
    topic: 'Virtualisasi Jaringan',
    text: 'Mode jaringan yang memberi VM akses keluar melalui host tanpa langsung muncul sebagai perangkat terpisah di LAN. Istilah yang paling tepat adalah ...',
    options: ['NAT pada VM', 'Snapshot', 'Host-only Adapter', 'Bridged Adapter', 'Hypervisor'],
    correct: 0,
    explanation: 'NAT (Network Address Translation) menerjemahkan paket VM menggunakan alamat IP host, sehingga VM dapat mengakses internet tanpa IP tersendiri di jaringan fisik.'
  },
  {
    id: 14,
    type: 'PG',
    topic: 'Virtualisasi Jaringan',
    text: 'Mode jaringan yang membuat mesin virtual terhubung ke LAN seperti perangkat fisik tersendiri. Istilah yang paling tepat adalah ...',
    options: ['Snapshot', 'Hypervisor', 'Bridged Adapter', 'Host-only Adapter', 'NAT pada VM'],
    correct: 2,
    explanation: 'Bridged Adapter menjembatani NIC fisik host sehingga VM tampak seperti komputer independen di switch/LAN dan dapat menerima IP dari DHCP router fisik.'
  },
  {
    id: 15,
    type: 'PG',
    topic: 'Virtualisasi Jaringan',
    text: 'Mode jaringan yang membatasi komunikasi antara host dan VM dalam jaringan virtual lokal. Istilah yang paling tepat adalah ...',
    options: ['Bridged Adapter', 'Hypervisor', 'Host-only Adapter', 'NAT pada VM', 'Snapshot'],
    correct: 2,
    explanation: 'Host-only Adapter menciptakan jaringan privat antara host dan mesin-mesin virtual di dalamnya tanpa akses ke luar LAN fisik.'
  },
  {
    id: 16,
    type: 'PG',
    topic: 'Layanan Jaringan',
    text: 'Layanan yang memberikan konfigurasi IP, subnet mask, gateway, dan DNS kepada klien secara otomatis. Istilah yang paling tepat adalah ...',
    options: ['Backup', 'SSH', 'DNS Server', 'Web Server', 'DHCP Server'],
    correct: 4,
    explanation: 'DHCP (Dynamic Host Configuration Protocol) mengotomatisasi pendistribusian konfigurasi IP dinamis ke perangkat klien di jaringan.'
  },
  {
    id: 17,
    type: 'PG',
    topic: 'Layanan Jaringan',
    text: 'Layanan yang menerjemahkan nama domain menjadi alamat IP atau sebaliknya. Istilah yang paling tepat adalah ...',
    options: ['Backup', 'DNS Server', 'DHCP Server', 'SSH', 'Web Server'],
    correct: 1,
    explanation: 'DNS (Domain Name System) memetakan FQDN (Fully Qualified Domain Name) seperti smk.sch.id ke alamat IP numerik seperti 192.168.1.10.'
  },
  {
    id: 18,
    type: 'PG',
    topic: 'Layanan Server',
    text: 'Layanan yang menyajikan halaman atau aplikasi melalui protokol HTTP atau HTTPS. Istilah yang paling tepat adalah ...',
    options: ['DNS Server', 'DHCP Server', 'SSH', 'Web Server', 'Backup'],
    correct: 3,
    explanation: 'Web Server (seperti Nginx atau Apache) melayani permintaan klien via protokol HTTP (port 80) dan HTTPS (port 443).'
  },
  {
    id: 19,
    type: 'PG',
    topic: 'Administrasi Server',
    text: 'Protokol administrasi jarak jauh terenkripsi untuk masuk dan menjalankan perintah pada perangkat atau server. Istilah yang paling tepat adalah ...',
    options: ['DNS Server', 'Web Server', 'SSH', 'Backup', 'DHCP Server'],
    correct: 2,
    explanation: 'SSH (Secure Shell) menyediakan saluran komunikasi teks terenkripsi (default port 22) untuk remote login aman menggantikan Telnet.'
  },
  {
    id: 20,
    type: 'PG',
    topic: 'Manajemen Data & Keamanan',
    text: 'Salinan data atau konfigurasi yang disiapkan agar sistem dapat dipulihkan setelah kerusakan atau kesalahan. Istilah yang paling tepat adalah ...',
    options: ['Web Server', 'Backup', 'DHCP Server', 'SSH', 'DNS Server'],
    correct: 1,
    explanation: 'Backup adalah salinan redundan dari berkas atau konfigurasi untuk keperluan disaster recovery jika terjadi insiden kegagalan sistem.'
  },
  {
    id: 21,
    type: 'PG',
    topic: 'Troubleshooting Virtualisasi',
    text: 'Instalasi Linux di mesin virtual gagal karena ruang disk tidak cukup. Tindakan paling tepat adalah ...',
    options: [
      'Mengganti ISO menjadi EXE',
      'Memperbesar disk virtual atau membuat VM baru dengan kapasitas disk yang memadai',
      'Mengubah NAT menjadi bridged',
      'Menambah jumlah core CPU maksimum',
      'Menekan refresh berulang kali'
    ],
    correct: 1,
    explanation: 'Jika ruang disk tidak cukup, solusi teknis yang valid adalah memperluas kapasitas virtual disk (VDI/VMDK) atau membuat ulang virtual disk sesuai persyaratan minimum OS.'
  },
  {
    id: 22,
    type: 'PG',
    topic: 'Troubleshooting Perangkat Keras',
    text: 'Komputer baru tidak mendeteksi NIC setelah instalasi sistem operasi. Langkah awal yang paling tepat adalah ...',
    options: [
      'Memeriksa device manager/lspci dan memasang driver NIC yang sesuai',
      'Memformat seluruh disk lagi',
      'Mengganti nama komputer',
      'Mengubah resolusi layar',
      'Menghapus akun pengguna'
    ],
    correct: 0,
    explanation: 'NIC tidak terdeteksi sering kali karena driver yang sesuai belum terpasang. Periksa di Device Manager (Windows) atau lspci (Linux) lalu pasang driver resmi chip NIC.'
  },
  {
    id: 23,
    type: 'PG',
    topic: 'Virtualisasi Jaringan',
    text: 'Sebuah VM harus dapat diakses langsung oleh komputer lain di LAN dan memperoleh IP dari DHCP LAN. Mode yang tepat adalah ...',
    options: ['Internal clipboard', 'Host-only Adapter', 'Disabled', 'Bridged Adapter', 'NAT'],
    correct: 3,
    explanation: 'Mode Bridged Adapter menempatkan antarmuka VM di subnet LAN fisik yang sama sehingga dapat berkomunikasi dua arah dengan perangkat fisik lain di LAN.'
  },
  {
    id: 24,
    type: 'PG',
    topic: 'Praktik Administrasi Server',
    text: 'Siswa akan mencoba perubahan konfigurasi berisiko pada server virtual. Tindakan sebelum perubahan adalah ...',
    options: [
      'Menambah wallpaper',
      'Membuat snapshot dan backup konfigurasi',
      'Menonaktifkan semua keamanan',
      'Menghapus log',
      'Mengganti hostname tanpa catatan'
    ],
    correct: 1,
    explanation: 'Membuat snapshot VM dan mencadangkan file konfigurasi (/etc/...) adalah best practice standar agar sistem dapat segera di-rollback jika terjadi kegagalan.'
  },
  {
    id: 25,
    type: 'PG',
    topic: 'Troubleshooting Layanan Server',
    text: 'Server web gagal berjalan setelah konfigurasi diubah. Prosedur diagnosis yang tepat adalah ...',
    options: [
      'Menghapus seluruh sistem operasi',
      'Mengganti monitor',
      'Memutus semua kabel LAN',
      'Restart terus-menerus tanpa membaca pesan',
      'Memeriksa status layanan dan log, memvalidasi konfigurasi, lalu melakukan perbaikan terukur'
    ],
    correct: 4,
    explanation: 'Langkah diagnosis profesional: periksa status (systemctl status), baca error log (journalctl -xe / /var/log/nginx/error.log), uji sintaks (nginx -t), lalu perbaiki baris konfigurasi yang salah.'
  },
  {
    id: 26,
    type: 'PG',
    topic: 'Keamanan Akun & Hak Akses',
    text: 'Pengguna tidak boleh memasang aplikasi atau mengubah sistem. Jenis akun yang tepat adalah ...',
    options: [
      'Akun tanpa kata sandi',
      'Satu akun bersama administrator',
      'Akun root untuk semua pengguna',
      'Akun BIOS',
      'Akun standar dengan hak minimum'
    ],
    correct: 4,
    explanation: 'Prinsip least privilege (hak akses terkecil): pengguna biasa diberikan akun standar tanpa akses sudo/administrator agar tidak dapat mengubah file sistem atau menginstal paket.'
  },
  {
    id: 27,
    type: 'PG',
    topic: 'Virtualisasi Jaringan',
    text: 'VM dengan NAT dapat mengakses internet tetapi tidak dapat langsung diakses dari LAN. Kondisi tersebut ...',
    options: [
      'Wajar; perlu bridged atau port forwarding sesuai tujuan',
      'Berarti CPU tidak kompatibel',
      'Harus diperbaiki dengan crimping',
      'Membuktikan RAM rusak',
      'Menunjukkan file system salah'
    ],
    correct: 0,
    explanation: 'Karakteristik NAT menyembunyikan IP internal VM di belakang IP host. Untuk menerima koneksi dari LAN luar, diperlukan port forwarding atau beralih ke mode Bridged.'
  },
  {
    id: 28,
    type: 'PG',
    topic: 'Layanan Jaringan',
    text: 'Sebuah server harus memberikan alamat IP otomatis kepada klien. Layanan yang dipasang adalah ...',
    options: ['SSH', 'DHCP Server', 'Web Server', 'FTP client', 'DNS Server'],
    correct: 1,
    explanation: 'DHCP Server (misal isc-dhcp-server atau dnsmasq) bertugas mengalokasikan lease alamat IP dan parameter jaringan otomatis kepada klien.'
  },
  {
    id: 29,
    type: 'PG',
    topic: 'Troubleshooting Jaringan',
    text: 'Pengguna dapat ping IP server tetapi tidak dapat mengakses nama server. Fokus pemeriksaan pertama adalah ...',
    options: [
      'Ukuran RAM',
      'Kecepatan kipas',
      'BIOS password',
      'Warna kabel',
      'DNS dan konfigurasi resolusi nama'
    ],
    correct: 4,
    explanation: 'Jika koneksi layer 3 (IP) berhasil via ping tetapi nama hostname/domain gagal, akar masalahnya berada pada resolusi nama (file /etc/hosts atau server DNS).'
  },
  {
    id: 30,
    type: 'PG',
    topic: 'Manajemen Data & Keamanan',
    text: 'Cadangan konfigurasi tersedia tetapi belum pernah diuji. Penilaian yang benar adalah ...',
    options: [
      'Backup dapat menggantikan pembaruan',
      'Backup pasti sempurna karena file ada',
      'Backup harus disimpan hanya pada server yang sama',
      'Backup tidak perlu dicatat',
      'Backup belum dapat dianggap andal sebelum dilakukan uji pemulihan'
    ],
    correct: 4,
    explanation: 'Kaidah administrasi sistem menegaskan: backup yang tidak pernah diuji restore-nya sama saja dengan belum memiliki backup, karena file bisa corrupt atau prosedur recovery belum terverifikasi.'
  },

  // 31-40 PGK Kategori (Tentukan Benar / Salah setiap pernyataan)
  {
    id: 31,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'Hypervisor paling tepat dijelaskan sebagai lapisan perangkat lunak yang membuat dan menjalankan mesin virtual dengan membagi sumber daya host.',
      'Host-only Adapter paling tepat dijelaskan sebagai mode jaringan yang membatasi komunikasi antara host dan VM dalam jaringan virtual lokal.',
      'File System paling tepat dijelaskan sebagai struktur yang mengatur penamaan, penyimpanan, izin, dan pengambilan berkas pada media penyimpanan.'
    ],
    correct: [true, true, true],
    explanation: 'Ketiga pernyataan memberikan definisi yang tepat: Hypervisor membagi sumber daya fisik untuk VM, Host-only membatasi komunikasi host-VM privat, dan File System mengelola struktur file media penyimpanan.'
  },
  {
    id: 32,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'Snapshot paling tepat dijelaskan sebagai memori kerja sementara yang menyimpan data aktif dan akan kehilangan isinya ketika daya mati.',
      'NIC paling tepat dijelaskan sebagai antarmuka berbasis teks untuk menjalankan perintah administrasi, navigasi, konfigurasi, dan diagnosis.',
      'RAM paling tepat dijelaskan sebagai struktur yang mengatur penamaan, penyimpanan, izin, dan pengambilan berkas pada media penyimpanan.'
    ],
    correct: [false, false, false],
    explanation: 'Semua pernyataan salah karena definisi tertukar: Memori sementara adalah RAM (bukan Snapshot), antarmuka teks adalah CLI (bukan NIC), dan struktur manajemen berkas adalah File System (bukan RAM).'
  },
  {
    id: 33,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'Service/Daemon paling tepat dijelaskan sebagai mode jaringan yang membatasi komunikasi antara host dan VM dalam jaringan virtual lokal.',
      'Driver paling tepat dijelaskan sebagai mode jaringan yang memberi VM akses keluar melalui host tanpa langsung muncul sebagai perangkat terpisah di LAN.',
      'SSD paling tepat dijelaskan sebagai media penyimpanan berbasis memori flash yang umumnya memiliki akses lebih cepat daripada harddisk mekanis.'
    ],
    correct: [false, false, true],
    explanation: 'Pernyataan 1 salah (Service adalah program latar belakang), pernyataan 2 salah (Driver adalah software penghubung OS-hardware), pernyataan 3 benar (SSD menggunakan memori flash cepat).'
  },
  {
    id: 34,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'NIC paling tepat dijelaskan sebagai antarmuka jaringan yang menghubungkan komputer ke media jaringan dan mempunyai alamat MAC.',
      'SSD paling tepat dijelaskan sebagai perangkat lunak penghubung agar sistem operasi dapat berkomunikasi dengan perangkat keras.',
      'Snapshot paling tepat dijelaskan sebagai rekaman keadaan mesin virtual pada suatu waktu yang berguna untuk kembali ke kondisi sebelumnya.'
    ],
    correct: [true, false, true],
    explanation: 'Pernyataan 1 benar (NIC memiliki MAC address), pernyataan 2 salah (penghubung OS-hardware adalah Driver, bukan SSD), pernyataan 3 benar (Snapshot merekam state mesin virtual).'
  },
  {
    id: 35,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'Host-only Adapter paling tepat dijelaskan sebagai firmware yang menginisialisasi perangkat keras dan mengatur proses boot sebelum sistem operasi berjalan.',
      'File System paling tepat dijelaskan sebagai rekaman keadaan mesin virtual pada suatu waktu yang berguna untuk kembali ke kondisi sebelumnya.',
      'Partisi paling tepat dijelaskan sebagai lapisan perangkat lunak yang membuat dan menjalankan mesin virtual dengan membagi sumber daya host.'
    ],
    correct: [false, false, false],
    explanation: 'Semua pernyataan salah: Firmware boot adalah BIOS/UEFI, rekaman state VM adalah Snapshot, dan lapisan virtualisasi adalah Hypervisor.'
  },
  {
    id: 36,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'Partisi paling tepat dijelaskan sebagai pembagian logis media penyimpanan menjadi beberapa bagian untuk sistem, data, atau kebutuhan lain.',
      'CPU paling tepat dijelaskan sebagai pembagian logis media penyimpanan menjadi beberapa bagian untuk sistem, data, atau kebutuhan lain.',
      'BIOS/UEFI paling tepat dijelaskan sebagai firmware yang menginisialisasi perangkat keras dan mengatur proses boot sebelum sistem operasi berjalan.'
    ],
    correct: [true, false, true],
    explanation: 'Pernyataan 1 benar (Partisi membagi drive secara logis), pernyataan 2 salah (CPU adalah prosesor instruksi), pernyataan 3 benar (BIOS/UEFI menginisialisasi hardware saat boot).'
  },
  {
    id: 37,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'Bridged Adapter paling tepat dijelaskan sebagai mode jaringan yang membuat mesin virtual terhubung ke LAN seperti perangkat fisik tersendiri.',
      'NAT pada VM paling tepat dijelaskan sebagai media penyimpanan berbasis memori flash yang umumnya memiliki akses lebih cepat daripada harddisk mekanis.',
      'Driver paling tepat dijelaskan sebagai perangkat lunak penghubung agar sistem operasi dapat berkomunikasi dengan perangkat keras.'
    ],
    correct: [true, false, true],
    explanation: 'Pernyataan 1 benar (Bridged menghubungkan langsung ke LAN fisik), pernyataan 2 salah (penyimpanan flash adalah SSD), pernyataan 3 benar (Driver menjembatani OS dan hardware).'
  },
  {
    id: 38,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'BIOS/UEFI paling tepat dijelaskan sebagai program latar belakang yang menyediakan fungsi tertentu dan dapat diatur mulai, berhenti, atau otomatis saat boot.',
      'NAT pada VM paling tepat dijelaskan sebagai mode jaringan yang memberi VM akses keluar melalui host tanpa langsung muncul sebagai perangkat terpisah di LAN.',
      'Service/Daemon paling tepat dijelaskan sebagai program latar belakang yang menyediakan fungsi tertentu dan dapat diatur mulai, berhenti, atau otomatis saat boot.'
    ],
    correct: [false, true, true],
    explanation: 'Pernyataan 1 salah (program latar belakang adalah daemon/service, bukan BIOS), pernyataan 2 benar (NAT menerjemahkan akses keluar VM), pernyataan 3 benar (definisi service/daemon).'
  },
  {
    id: 39,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'Hypervisor paling tepat dijelaskan sebagai komponen pemroses instruksi dan operasi logika yang menjadi pusat eksekusi program.',
      'RAM paling tepat dijelaskan sebagai memori kerja sementara yang menyimpan data aktif dan akan kehilangan isinya ketika daya mati.',
      'CPU paling tepat dijelaskan sebagai komponen pemroses instruksi dan operasi logika yang menjadi pusat eksekusi program.'
    ],
    correct: [false, true, true],
    explanation: 'Pernyataan 1 salah (pemroses logika adalah CPU), pernyataan 2 benar (RAM memori kerja volatile), pernyataan 3 benar (definisi CPU).'
  },
  {
    id: 40,
    type: 'PGK Kategori',
    topic: 'Konsep Dasar TJKT',
    text: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan materi dan praktik TJKT.',
    statements: [
      'Command Line Linux paling tepat dijelaskan sebagai antarmuka berbasis teks untuk menjalankan perintah administrasi, navigasi, konfigurasi, dan diagnosis.',
      'Bridged Adapter paling tepat dijelaskan sebagai antarmuka jaringan yang menghubungkan komputer ke media jaringan dan mempunyai alamat MAC.',
      'Command Line Linux paling tepat dijelaskan sebagai mode jaringan yang membuat mesin virtual terhubung ke LAN seperti perangkat fisik tersendiri.'
    ],
    correct: [true, false, false],
    explanation: 'Pernyataan 1 benar (definisi CLI Linux), pernyataan 2 salah (antarmuka fisik ber-MAC adalah NIC), pernyataan 3 salah (CLI bukan mode jaringan).'
  },

  // 41-50 PGK MCMA (Pilih semua jawaban yang benar)
  {
    id: 41,
    type: 'PGK MCMA',
    topic: 'Sistem Operasi & Instalasi',
    text: 'Sebelum instalasi sistem operasi, teknisi perlu ...',
    options: [
      'Memeriksa kebutuhan perangkat keras',
      'Mencadangkan data penting',
      'Memverifikasi media instalasi',
      'Memformat tanpa konfirmasi',
      'Mengabaikan daya listrik'
    ],
    correct: [0, 1, 2],
    explanation: 'Prosedur pra-instalasi yang benar meliputi verifikasi hardware requirements, backup data penting pengguna, dan integritas installer/ISO media.'
  },
  {
    id: 42,
    type: 'PGK MCMA',
    topic: 'Keamanan Sistem',
    text: 'Akun server yang aman menerapkan ...',
    options: [
      'Hak minimum sesuai tugas',
      'Kata sandi kuat',
      'Pencatatan aktivitas administratif',
      'Satu akun root bersama',
      'Login tanpa password'
    ],
    correct: [0, 1, 2],
    explanation: 'Keamanan akun server mensyaratkan principle of least privilege, password kompleks/kunci SSH, dan audit trail log untuk setiap operasi administratif.'
  },
  {
    id: 43,
    type: 'PGK MCMA',
    topic: 'Virtualisasi Jaringan',
    text: 'VM akan digunakan sebagai server yang diakses LAN. Tindakan sesuai adalah ...',
    options: [
      'Memilih bridged atau konfigurasi jaringan yang memungkinkan akses',
      'Mengalokasikan RAM dan disk memadai',
      'Menguji IP dan layanan dari klien',
      'Menonaktifkan NIC VM',
      'Menganggap NAT selalu dapat diakses langsung'
    ],
    correct: [0, 1, 2],
    explanation: 'Server virtual di LAN butuh konfigurasi bridged/routing yang tepat, resource RAM dan disk mencukupi, serta validasi konektivitas dari perangkat klien.'
  },
  {
    id: 44,
    type: 'PGK MCMA',
    topic: 'Virtualisasi & Disaster Recovery',
    text: 'Snapshot digunakan secara tepat ketika ...',
    options: [
      'Dibuat sebelum perubahan berisiko',
      'Diberi nama dan catatan waktu',
      'Tetap disertai backup untuk data penting',
      'Dianggap pengganti backup selamanya',
      'Dibiarkan menumpuk tanpa pengelolaan'
    ],
    correct: [0, 1, 2],
    explanation: 'Snapshot sangat bagus untuk titik balik sementara sebelum update konfigurasi berisiko, namun tidak boleh menggantikan backup eksternal dan tidak boleh dibiarkan menumpuk karena memperlambat disk I/O.'
  },
  {
    id: 45,
    type: 'PGK MCMA',
    topic: 'Troubleshooting Linux',
    text: 'Diagnosis service Linux yang gagal mencakup ...',
    options: [
      'Memeriksa systemctl status',
      'Membaca log',
      'Memvalidasi file konfigurasi',
      'Menghapus sistem operasi langsung',
      'Mengganti monitor'
    ],
    correct: [0, 1, 2],
    explanation: 'Langkah tepat: cek systemctl status <nama-layanan>, periksa journalctl/log di /var/log, dan validasi sintaks file konfigurasi.'
  },
  {
    id: 46,
    type: 'PGK MCMA',
    topic: 'Layanan Jaringan DHCP',
    text: 'Konfigurasi DHCP server memerlukan ...',
    options: [
      'Rentang alamat yang sesuai',
      'Subnet mask dan gateway yang benar',
      'DNS serta pengecualian alamat jika perlu',
      'Pool tumpang tindih tanpa kontrol',
      'Alamat gateway di luar desain tanpa alasan'
    ],
    correct: [0, 1, 2],
    explanation: 'Parameter inti DHCP adalah IP pool range, subnet mask, default gateway, DNS server, dan static exclusion reservation untuk server/printer.'
  },
  {
    id: 47,
    type: 'PGK MCMA',
    topic: 'Layanan Jaringan DNS',
    text: 'DNS server yang baik perlu ...',
    options: [
      'Record yang benar',
      'Layanan aktif dan port dapat diakses',
      'Pengujian resolusi dari klien',
      'Menghapus seluruh cache setiap menit',
      'Menggunakan nama acak tanpa dokumentasi'
    ],
    correct: [0, 1, 2],
    explanation: 'DNS membutuhkan database record yang akurat (A, CNAME, PTR, dll.), service aktif di port 53 UDP/TCP, dan pengujian resolusi query (nslookup/dig) dari sisi klien.'
  },
  {
    id: 48,
    type: 'PGK MCMA',
    topic: 'Manajemen Data & Backup',
    text: 'Backup yang andal mencakup ...',
    options: [
      'Jadwal dan cakupan jelas',
      'Salinan pada media/lokasi berbeda',
      'Uji restore berkala',
      'Hanya satu salinan di disk server yang sama',
      'Tidak ada pencatatan'
    ],
    correct: [0, 1, 2],
    explanation: 'Strategi 3-2-1 backup mencakup jadwal jelas, penyimpanan pada media terpisah/off-site, dan pengujian restorasi berkala untuk memastikan data pulih utuh.'
  },
  {
    id: 49,
    type: 'PGK MCMA',
    topic: 'Sistem Operasi & Pasca-Instalasi',
    text: 'Setelah instalasi OS, pekerjaan yang perlu dilakukan adalah ...',
    options: [
      'Memasang pembaruan dan driver',
      'Mengatur akun serta keamanan',
      'Menguji perangkat dan jaringan',
      'Membiarkan akun default',
      'Menonaktifkan log'
    ],
    correct: [0, 1, 2],
    explanation: 'Pasca-instalasi wajib menginstal update keamanan dan driver perangkat keras, mengonfigurasi user password & hak akses, serta memvalidasi fungsi kartu jaringan.'
  },
  {
    id: 50,
    type: 'PGK MCMA',
    topic: 'Virtualisasi & Manajemen Sumber Daya',
    text: 'Pengelolaan sumber daya VM yang benar adalah ...',
    options: [
      'Menyisakan sumber daya untuk host',
      'Memberi disk sesuai kebutuhan',
      'Memantau penggunaan CPU dan RAM',
      'Mengalokasikan seluruh RAM host ke satu VM',
      'Mengabaikan kapasitas penyimpanan'
    ],
    correct: [0, 1, 2],
    explanation: 'Host OS membutuhkan alokasi CPU dan RAM yang cukup agar tidak crash/freeze. Sizing disk virtual harus realistis dan utilisasi sumber daya dipantau berkala.'
  }
];
