/* =========================================================
   WIRA SIBER — LOGIK LAMAN WEB, PEMBENTANGAN, PERMAINAN & KUIZ
   Tema: Mesra, Tenang, Pintar & Sedia Smart Board
   ========================================================= */

(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const shuffle = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* =========================================================
   TEMA (Cerah Tenang vs Redup Santai)
   ========================================================= */
let currentTheme = localStorage.getItem('ws_theme') || 'light';
function setTheme(t) {
  currentTheme = t;
  document.body.dataset.theme = t;
  localStorage.setItem('ws_theme', t);
  const icon = t === 'dark' ? '🌙' : '☀️';
  const btn = $('#siteThemeBtn');
  if (btn) btn.textContent = icon;
}
setTheme(currentTheme);

if ($('#siteThemeBtn')) {
  $('#siteThemeBtn').onclick = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
    sfx('pop');
  };
}

/* =========================================================
   DATA KATA LALUAN & KAMUS
   ========================================================= */
const COMMON = ['123456', 'password', 'qwerty', '111111', '000000', 'abc123', 'iloveyou', 'admin', 'sayang', 'malaysia', 'letmein', 'welcome', '123123', 'abcd', 'asdf', '654321', 'katalaluan', 'rahsia'];
const WORDS = ['Durian', 'Basikal', 'Awan', 'Harimau', 'Pelangi', 'Kopi', 'Roket', 'Kancil', 'Gitar', 'Pisang', 'Bulan', 'Lampu', 'Kasut', 'Sotong', 'Payung', 'Rambutan', 'Tembikai', 'Gajah', 'Ombak', 'Bintang', 'Cendol', 'Ketupat', 'Wau', 'Belon', 'Jambatan', 'Dinosaur', 'Robot', 'Katak', 'Nanas', 'Gunung', 'Hujan', 'Petir', 'Rendang', 'Penyu', 'Komet', 'Biskut', 'Ungu', 'Oren', 'Terbang', 'Menari'];

/* =========================================================
   DATA PERMAINAN KAD (GAMES)
   ========================================================= */
const GAMES = {
  phish: {
    opts: ['✅ Selamat', '🎣 Phishing'],
    items: [
      { tag: '📩 SMS • 66xxx', text: 'BANK ANDA: Akaun anda telah DIBEKUKAN. Klik bit.ly/aktif-akaun-sah untuk aktifkan semula dalam 24 jam.', a: 1,
        why: 'Bank rasmi tidak menghantar pautan log masuk melalui SMS. Terdapat desakan masa palsu dan pautan pendek yang menyembunyikan alamat sebenar.' },
      { tag: '📧 E-mel • guru kelas (@moe-dl.edu.my)', text: 'Assalamualaikum murid-murid, sila hantar tugasan Sejarah di Google Classroom sebelum Jumaat ini. Terima kasih.', a: 0,
        why: 'Pengirim dijangka dan sah, tiada sebarang pautan mencurigakan atau permintaan kata laluan peribadi.' },
      { tag: '💬 WhatsApp • nombor baharu', text: 'Hai! Ni aku kawan lama kau, dah tukar nombor 😅 Boleh tolong top-up RM50 dulu? Esok aku bayar balik janji!', a: 1,
        why: 'Penipu kerap menyamar sebagai kawan rapat. Sentiasa hubungi nombor LAMA kawan itu untuk pengesahan suara sebelum memberi bantuan wang.' },
      { tag: '🔔 Notifikasi dalam app rasmi', text: 'Kod pengesahan 2FA anda ialah 482910. JANGAN kongsi kod ini dengan sesiapa. (Anda baru sahaja cuba log masuk.)', a: 0,
        why: 'Selamat jika ANDA yang meminta kod tersebut. Jika anda tidak log masuk, akaun anda mungkin sedang cuba diceroboh — segera tukar kata laluan!' },
      { tag: '📸 DM Instagram • @duta.jenama.official2', text: 'Tahniah! Anda dipilih jadi DUTA JENAMA kami 🌟 Hantar gambar MyKad & bayar yuran pendaftaran RM30 untuk sahkan.', a: 1,
        why: 'Jenama sah tidak meminta yuran pendaftaran atau gambar MyKad melalui mesej DM media sosial.' },
      { tag: '💬 WhatsApp • nombor tidak dikenali', text: '💍 Jemputan Majlis Perkahwinan kami. Sila muat turun kad: Kad_Jemputan.apk', a: 1,
        why: 'Fail bertaraf .apk ialah aplikasi! Ini taktik licik malware yang mencuri SMS dan kod OTP akaun bank mangsa.' },
      { tag: '🎮 Mesej dalam game • "GM_Admin"', text: 'Akaun anda akan diharamkan kerana disyaki menipu. Berikan kata laluan anda untuk pengesahan segera.', a: 1,
        why: 'Admin rasmi TIDAK SESEKALI meminta kata laluan anda. Ugutan penggantungan akaun digunakan untuk mencetuskan panik.' }
    ]
  },
  share: {
    opts: ['👍 Boleh Kongsi', '🙅 Jangan'],
    items: [
      { big: '🐱', text: 'Gambar kucing anda sedang tidur lena dengan comel di atas sofa.', a: 0, why: 'Tiada maklumat peribadi sensitif. Sangat selamat dan menghiburkan! 😺' },
      { big: '🎫', text: 'Gambar tiket konsert kegemaran dengan kod QR yang jelas kelihatan.', a: 1, why: 'Orang lain boleh mengimbas atau menyalin kod QR tersebut dan menggunakan tiket anda terlebih dahulu!' },
      { big: '🏫', text: 'Swafoto dengan lencana sekolah, nama penuh dan lokasi "live" masa nyata.', a: 1, why: 'Orang asing yang berniat jahat dapat menjejaki identiti sekolah dan lokasi keberadaan anda.' },
      { big: '🪪', text: 'Gambar MyKad untuk menunjuk "gambar muka masa kecil yang comel".', a: 1, why: 'MyKad mengandungi maklumat sulit seperti nombor kad pengenalan dan alamat yang boleh disalah guna untuk penipuan identiti.' },
      { big: '🏆', text: 'Gambar anda memenangi pingat pertandingan sukan sekolah (tanpa maklumat peribadi lain).', a: 0, why: 'Raikan kejayaan anda! Ini contoh jejak digital yang positif dan membanggakan.' },
      { big: '🏝️', text: '"Seminggu kami sekeluarga bercuti di pulau! Rumah kosong 😆" — dimuat naik semasa masih bercuti.', a: 1, why: 'Ini memberi isyarat terbuka kepada penjenayah bahawa rumah anda sedang tidak berpenghuni. Kongsi gambar SELEPAS pulang.' },
      { big: '📶', text: 'Kata laluan Wi-Fi rumah di dalam hantaran status media sosial.', a: 1, why: 'Kata laluan ialah rahsia peribadi — orang asing boleh menggunakan rangkaian rumah anda untuk aktiviti tidak sah.' },
      { big: '📚', text: 'Nota ringkas Sains yang anda cipta untuk membantu rakan-rakan sekelas mengulang kaji.', a: 0, why: 'Berkongsi ilmu sangat bermanfaat! Ini membina reputasi dan jejak digital yang cemerlang. 🌟' }
    ]
  },
  perm: {
    opts: ['👌 Logik', '🤨 Pelik!'],
    items: [
      { big: '🔦', text: 'Aplikasi LAMPU SULUH meminta akses kepada SMS dan senarai kenalan anda.', a: 1, why: 'Lampu suluh hanya memerlukan izin lampu kamera. Akses SMS digunakan sindiket untuk mencuri kod OTP!' },
      { big: '🗺️', text: 'Aplikasi PETA & NAVIGASI meminta akses lokasi GPS peranti.', a: 0, why: 'Logik dan penting — aplikasi peta memerlukan koordinat lokasi untuk menunjukkan arah panduan.' },
      { big: '🧮', text: 'Aplikasi KALKULATOR meminta kebenaran mikrofon dan rakaman kamera.', a: 1, why: 'Kalkulator matematik tidak perlu mendengar atau melihat anda. Permintaan ini sangat mencurigakan!' },
      { big: '📷', text: 'Aplikasi KAMERA meminta kebenaran mengakses kamera dan storan galeri gambar.', a: 0, why: 'Logik — aplikasi kamera memerlukan sensor kamera untuk mengambil gambar dan storan untuk menyimpannya.' },
      { big: '🧩', text: 'Permainan PUZZLE luar talian meminta akses kenalan telefon, lokasi dan panggilan.', a: 1, why: 'Game puzzle ringkas tidak memerlukan data peribadi tersebut. Berkemungkinan besar mengumpul data anda untuk dijual.' },
      { big: '💬', text: 'Aplikasi MESEJ (cth. WhatsApp / Telegram) meminta kebenaran senarai kenalan.', a: 0, why: 'Logik — aplikasi mesej memerlukan senarai kenalan untuk membolehkan anda berhubung dengan rakan.' }
    ]
  }
};

/* =========================================================
   DATA KUIZ WIRA SIBER (15 SOALAN BERPASUKAN)
   ========================================================= */
const QUIZ = [
  { q: 'Manakah antara berikut kata laluan yang PALING kuat dan selamat?', o: ['Ahmad2010', '12345678', 'Basikal-Ungu-Makan-Roti-88!', 'qwerty'], a: 2,
    e: 'Frasa laluan yang panjang (12+ aksara) gabungan perkataan, nombor & simbol mengambil masa berbilion tahun untuk diteka.' },
  { q: 'Apakah maksud sebenar ciri keselamatan 2FA?', o: ['Dua akaun bagi satu aplikasi', 'Lapisan keselamatan kedua seperti kod OTP di telefon', 'Kata laluan dengan 2 huruf besar', 'Dua kali log keluar setiap hari'], a: 1,
    e: 'Pengesahan Dua Faktor (2FA) menggabungkan kata laluan + sesuatu yang hanya anda miliki (contohnya kod di telefon anda).' },
  { q: 'Anda menerima SMS: "Akaun bank anda dibekukan, klik pautan ini." Apakah tindakan terbaik?', o: ['Klik cepat sebelum terlambat', 'Balas SMS meminta penjelasan', 'Abaikan & semak terus melalui aplikasi rasmi atau nombor rasmi bank', 'Kongsi pautan dengan rakan sekelas'], a: 2,
    e: 'Jangan klik pautan dalam mesej yang mendesak. Sentiasa semak sendiri dengan pihak rasmi menggunakan saluran yang sah.' },
  { q: 'Rakan baik anda meminta kod OTP yang baru dihantar ke telefon anda. Anda patut…', o: ['Beri kerana dia rakan karib', 'Beri separuh kod sahaja', 'Tidak memberi kod tersebut kepada sesiapa pun', 'Beri keesokan hari'], a: 2,
    e: 'Kod OTP ialah rahsia mutlak. Akaun rakan anda mungkin telah digodam dan penipu sedang menyamar memintanya!' },
  { q: 'Apakah yang dimaksudkan dengan "akaun keldai"?', o: ['Akaun game online bertema haiwan', 'Akaun bank yang disewakan kepada penjenayah untuk memindahkan wang curi', 'Akaun media sosial yang sudah tidak aktif', 'Akaun simpanan khas untuk pelajar'], a: 1,
    e: 'Membenarkan orang lain menggunakan akaun bank anda ialah jenayah serius walaupun anda dibayar wang upah.' },
  { q: 'Apakah nombor talian pantas bagi melaporkan penipuan kewangan (scam) dengan SEGERA di Malaysia?', o: ['999', '997', '15999', '1300'], a: 1,
    e: '997 ialah talian Pusat Respons Scam Kebangsaan (NSRC). Semakin pantas dilaporkan, semakin tinggi peluang transaksi disekat.' },
  { q: 'Antara berikut, manakah yang PALING SELAMAT untuk dikongsikan di media sosial?', o: ['Gambar tiket konsert dengan kod QR', 'Gambar MyKad untuk kenangan', 'Lukisan hasil karya seni anda sendiri', 'Lokasi rumah fizikal secara siaran langsung (live)'], a: 2,
    e: 'Hasil karya kreatif peribadi tanpa sebarang maklumat sulit merupakan jejak digital yang positif dan selamat.' },
  { q: 'Anda menerima fail bernama "Jemputan_Kahwin.apk" daripada nombor tidak dikenali. Apa wajar dibuat?', o: ['Buka untuk lihat siapa yang berkahwin', 'Pasang dahulu kemudian padam', 'Jangan buka fail tersebut, padam mesej & sekat nombor pengirim', 'Hantar kepada ibu bapa untuk dibuka'], a: 2,
    e: 'Fail bertaraf .apk ialah pakej aplikasi Android. Ia berisiko mengandungi spyware pencuri SMS perbankan.' },
  { q: 'Rakan anda diejek dan diaibkan dalam group sembang kelas. Langkah wira yang patut anda ambil ialah…', o: ['Ikut menghantar emoji ketawa', 'Tangkap layar bukti, beri sokongan moral peribadi & maklumkan guru', 'Membalas maki hamun dalam group', 'Buat tidak tahu dan diamkan diri'], a: 1,
    e: 'Jadilah PEMBELA (Upstander): berikan sokongan kepada mangsa, simpan bukti tangkap layar dan maklumkan kepada orang dewasa.' },
  { q: 'Ransomware ialah sejenis malware yang…', o: ['Mempercepatkan kelajuan pemproses telefon', 'Mengunci fail peranti anda & menuntut bayaran wang tebusan', 'Memberikan ganjaran diamond percuma', 'Membersihkan cache sistem'], a: 1,
    e: '"Ransom" bermaksud tebusan. Sentiasa simpan salinan sandaran (backup) fail penting anda di luar peranti.' },
  { q: 'Antara berikut, yang manakah BUKAN tanda-tanda mesej phishing?', o: ['Desakan masa melampau "dalam 10 minit"', 'Alamat pautan dengan ejaan mencurigakan', 'Meminta maklumat kata laluan & kod OTP', 'Mesej rasmi guru tentang kerja rumah tanpa pautan log masuk'], a: 3,
    e: 'Mesej daripada individu dikenali, memang dijangka dan tidak meminta maklumat rahsia biasanya selamat.' },
  { q: 'Mengapakah kita perlu sentiasa mengemas kini (update) sistem operasi telefon dan aplikasi?', o: ['Supaya ikon aplikasi berubah corak', 'Untuk menampal kelemahan keselamatan (security patch)', 'Untuk mengurangkan jangka hayat bateri', 'Tidak perlu dikemas kini langsung'], a: 1,
    e: 'Kemas kini menampal kelemahan kod yang sering dimanipulasi oleh penggodam untuk menceroboh peranti.' },
  { q: 'Apakah definisi bagi istilah "Jejak Digital"?', o: ['Kesan cap jari pada skrin telefon', 'Rekod jejak semua aktiviti dan hantaran anda di internet yang boleh kekal lama', 'Aplikasi untuk mengira langkah kaki harian', 'Kata laluan rahsia peranti'], a: 1,
    e: 'Setiap hantaran, komen, suka (like) dan lokasi meninggalkan rekod digital walaupun selepas dipadam.' },
  { q: 'Menggunakan sambungan Wi-Fi awam percuma di kafe paling sesuai digunakan untuk…', o: ['Log masuk akaun perbankan dalam talian', 'Membaca artikel berita am', 'Membeli-belah dengan memasukkan nombor kad debit', 'Menukar kata laluan e-mel utama'], a: 1,
    e: 'Wi-Fi awam tidak disulitkan sepenuhnya dan terdedah kepada intipan. Elakkan aktiviti melibatkan maklumat sulit.' },
  { q: 'Mesej: "Tawaran Diamond Game PERCUMA! Masukkan ID & kata laluan anda di sini." Ini merupakan…', o: ['Promosi istimewa daripada syarikat permainan', 'Hadiah hari jadi tahunan', 'Taktik Phishing — jangan masukkan sebarang maklumat!', 'Kuiz anjuran pihak sekolah'], a: 2,
    e: 'Tiada pihak sah yang memerlukan kata laluan anda untuk memberikan hadiah. Sentiasa ingat: HENTI • FIKIR • SEMAK!' }
];

const TEAMS = [
  { name: 'Merah', color: '#f43f5e', emo: '🔴' },
  { name: 'Biru', color: '#0284c7', emo: '🔵' },
  { name: 'Hijau', color: '#10b981', emo: '🟢' },
  { name: 'Kuning', color: '#eab308', emo: '🟡' }
];

/* =========================================================
   BUNYI MESRA & TENANG (Audio Synth Lembut)
   ========================================================= */
let ac = null, muted = false;

function sfx(type) {
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    
    const seqs = {
      good: [523.25, 659.25, 783.99], // C5, E5, G5 (Akur major lembut)
      bad: [220, 196],               // Nada rendah tenang (bukan harsh buzzer)
      tick: [600],                    // Soft woodblock tick
      pop: [520],                     // Bubble pop
      win: [523.25, 659.25, 783.99, 1046.5] // C-E-G-C nada ceria
    };
    const seq = seqs[type] || [440];
    const t0 = ac.currentTime;
    
    seq.forEach((f, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const t = t0 + i * 0.09;
      
      osc.type = 'sine'; // Gelombang sinus lembut
      osc.frequency.value = f;
      
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(type === 'bad' ? 0.08 : 0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (type === 'tick' ? 0.06 : 0.22));
      
      osc.connect(gain);
      gain.connect(ac.destination);
      
      osc.start(t);
      osc.stop(t + 0.25);
    });
  } catch (e) {
    /* Audio tidak disokong atau belum diinteraksikan */
  }
}

function updateSoundUI() {
  const icon = muted ? '🔇' : '🔊';
  if ($('#siteSoundBtn')) $('#siteSoundBtn').textContent = icon;
  if ($('#deckSoundBtn')) $('#deckSoundBtn').textContent = icon;
}

if ($('#siteSoundBtn')) $('#siteSoundBtn').onclick = () => { muted = !muted; updateSoundUI(); };
if ($('#deckSoundBtn')) $('#deckSoundBtn').onclick = () => { muted = !muted; updateSoundUI(); };

/* =========================================================
   ANIMASI KONFETI
   ========================================================= */
const cv = $('#confetti'), cx = cv ? cv.getContext('2d') : null;
let parts = [], raf = null;

function confetti(n = 180) {
  if (!cv || !cx) return;
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  const cols = ['#0d9488', '#0284c7', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  for (let i = 0; i < n; i++) {
    parts.push({
      x: window.innerWidth * (0.25 + Math.random() * 0.5),
      y: window.innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 18 - 5,
      s: Math.random() * 9 + 5,
      c: cols[i % cols.length],
      a: Math.random() * 6,
      va: (Math.random() - 0.5) * 0.25
    });
  }
  if (!raf) loopConfetti();
}

function loopConfetti() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts.forEach(p => {
    p.vy += 0.38;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.a += p.va;
    cx.save();
    cx.translate(p.x, p.y);
    cx.rotate(p.a);
    cx.fillStyle = p.c;
    cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
    cx.restore();
  });
  parts = parts.filter(p => p.y < cv.height + 50);
  raf = parts.length ? requestAnimationFrame(loopConfetti) : (cx.clearRect(0, 0, cv.width, cv.height), null);
}

/* =========================================================
   PENGURUS DUA MOD (LAMAN WEB vs SLAID PEMBENTANGAN)
   ========================================================= */
const slides = $$('.slide');
const counter = $('#counter');
const bar = $('#progress span');
const notes = $('#notes');
const notesP = $('#notes p');
let curSlide = 0;
let currentMode = 'site'; // 'site' atau 'deck'

function setMode(mode, slideIndex = 0) {
  currentMode = mode;
  if (mode === 'deck') {
    document.body.classList.remove('mode-site');
    document.body.classList.add('mode-deck');
    goSlide(slideIndex);
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    document.body.classList.remove('mode-deck');
    document.body.classList.add('mode-site');
    history.replaceState(null, '', ' ');
  }
}

// Butang Pelancar Pembentangan
if ($('#btnLaunchDeck')) $('#btnLaunchDeck').onclick = () => setMode('deck', 0);
if ($('#heroStartDeck')) $('#heroStartDeck').onclick = () => setMode('deck', 0);
if ($('#floating-presenter-pill')) $('#floating-presenter-pill').onclick = () => setMode('deck', curSlide);

// Butang Keluar Pembentangan
if ($('#deckExitBtn')) $('#deckExitBtn').onclick = () => setMode('site');
if ($('#deckExitBarBtn')) $('#deckExitBarBtn').onclick = () => setMode('site');
if ($('#deckBackToSiteBtn')) $('#deckBackToSiteBtn').onclick = () => setMode('site');

/* =========================================================
   NAVIGASI SLAID PEMBENTANGAN
   ========================================================= */
function goSlide(n) {
  n = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === n);
    s.classList.toggle('past', i < n);
  });
  curSlide = n;
  
  const s = slides[n];
  if (counter) counter.textContent = `${n + 1} / ${slides.length}`;
  if (bar) bar.style.width = `${(n / (slides.length - 1)) * 100}%`;
  
  const prevBtn = $('#prev'), nextBtn = $('#next');
  if (prevBtn) prevBtn.disabled = n === 0;
  if (nextBtn) nextBtn.disabled = n === slides.length - 1;
  
  if (notesP) notesP.textContent = s.dataset.notes || 'Tiada nota panduan bagi slaid ini.';
  s.scrollTop = 0;
  
  history.replaceState(null, '', '#slide-' + (n + 1));
  $$('.menu-grid button').forEach((b, i) => b.classList.toggle('cur', i === n));
}

const nextSlide = () => goSlide(curSlide + 1);
const prevSlide = () => goSlide(curSlide - 1);

const goSlideById = id => {
  const i = slides.findIndex(s => s.id === id);
  if (i >= 0) {
    setMode('deck', i);
  }
};

if ($('#next')) $('#next').onclick = nextSlide;
if ($('#prev')) $('#prev').onclick = prevSlide;
$$('[data-next]').forEach(b => b.onclick = nextSlide);
$$('[data-goto]').forEach(b => {
  b.onclick = e => {
    e.preventDefault();
    goSlideById(b.dataset.goto);
  };
});

// Kawalan Papan Kekunci
document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea')) {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  const k = e.key;
  
  // Kekunci P toggles mod pembentangan
  if (k === 'p' || k === 'P') {
    e.preventDefault();
    setMode(currentMode === 'deck' ? 'site' : 'deck', curSlide);
    return;
  }
  
  // Kekunci S toggles bunyi
  if (k === 's' || k === 'S') {
    muted = !muted;
    updateSoundUI();
    return;
  }
  
  if (currentMode === 'deck') {
    if (k === 'Escape') {
      setMode('site');
    } else if (['ArrowRight', 'PageDown', ' '].includes(k)) {
      e.preventDefault();
      nextSlide();
    } else if (['ArrowLeft', 'PageUp'].includes(k)) {
      e.preventDefault();
      prevSlide();
    } else if (k === 'Home') {
      goSlide(0);
    } else if (k === 'End') {
      goSlide(slides.length - 1);
    } else if (k === 'f' || k === 'F') {
      toggleFS();
    } else if (k === 'm' || k === 'M') {
      toggleMenu();
    } else if (k === 'n' || k === 'N') {
      toggleNotes();
    }
  }
});

// Sentuhan & Leretan (Touch Swipe pada Smart Board)
let touchStartX = null, touchStartY = null;
const deckEl = $('#deck');
if (deckEl) {
  deckEl.addEventListener('pointerdown', e => {
    if (e.target.closest('button, input, .hs, .flip, li, .phone')) {
      touchStartX = null;
      return;
    }
    touchStartX = e.clientX;
    touchStartY = e.clientY;
  });
  
  deckEl.addEventListener('pointerup', e => {
    if (touchStartX === null) return;
    const dx = e.clientX - touchStartX;
    const dy = e.clientY - touchStartY;
    if (Math.abs(dx) > 100 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      dx < 0 ? nextSlide() : prevSlide();
    }
    touchStartX = null;
  });
}

// Skrin Penuh (Fullscreen)
function toggleFS() {
  const d = document;
  if (!d.fullscreenElement) {
    (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen)?.call(d.documentElement);
  } else {
    (d.exitFullscreen || d.webkitExitFullscreen)?.call(d);
  }
}
if ($('#fsBtn')) $('#fsBtn').onclick = toggleFS;

// Nota Guru
function toggleNotes() {
  if (!notes) return;
  notes.classList.toggle('hidden');
  const btn = $('#notesBtn');
  if (btn) btn.classList.toggle('on', !notes.classList.contains('hidden'));
}
if ($('#notesBtn')) $('#notesBtn').onclick = toggleNotes;

// Menu Slaid (Quick Jump)
const menu = $('#menu'), mg = $('.menu-grid');
if (mg) {
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.innerHTML = `<i>${i + 1}</i><span>${s.dataset.title || 'Slaid ' + (i + 1)}</span>`;
    b.onclick = () => {
      goSlide(i);
      toggleMenu(false);
    };
    mg.appendChild(b);
  });
}

function toggleMenu(force) {
  if (!menu) return;
  const show = force ?? menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !show);
}
if ($('#menuBtn')) $('#menuBtn').onclick = () => toggleMenu();
if ($('#menuClose')) $('#menuClose').onclick = () => toggleMenu(false);
if (menu) menu.onclick = e => { if (e.target === menu) toggleMenu(false); };

/* =========================================================
   KOMPONEN INTERAKTIF (SELESA DI WEB & SLAID)
   ========================================================= */

// 1. Kad Terbalik (Flip Cards)
$$('.flip').forEach(f => {
  f.onclick = () => {
    f.classList.toggle('flipped');
    sfx('pop');
  };
});

// 2. Butang Dedah (Reveal Cards & Weak Passwords)
$$('.reveal, .weak').forEach(r => {
  r.onclick = () => {
    r.classList.toggle('shown');
    sfx('pop');
  };
});

// 3. Kiraan Angkat Tangan (Tally Counters)
$$('.tally').forEach(t => {
  const valEl = $('.tally-val', t);
  let count = 0;
  const change = d => {
    count = Math.max(0, count + d);
    valEl.textContent = count;
    valEl.classList.remove('bump');
    void valEl.offsetWidth;
    valEl.classList.add('bump');
    sfx('tick');
  };
  const plusBtn = $('.plus', t);
  const minusBtn = $('.minus', t);
  if (plusBtn) plusBtn.onclick = () => change(1);
  if (minusBtn) minusBtn.onclick = () => change(-1);
});

// 4. Penguji Kata Laluan 🧪 (Makmal Web & Slaid)
function fmtTime(sec) {
  if (sec < 1) return '⚡ Serta-merta (< 1 saat)!';
  const units = [
    [60, 'saat'],
    [60, 'minit'],
    [24, 'jam'],
    [365, 'hari'],
    [1000, 'tahun'],
    [1000, 'ribu tahun'],
    [1000, 'juta tahun'],
    [1000, 'bilion tahun']
  ];
  let v = sec;
  for (let i = 0; i < units.length; i++) {
    if (v < units[i][0] || i === units.length - 1) {
      if (i === units.length - 1 && v >= 14) return '🌌 Lebih lama dari usia alam semesta!';
      return `${Math.max(1, Math.round(v))} ${units[i][1]}`;
    }
    v /= units[i][0];
  }
}

function analyzePassword(pw) {
  const low = pw.toLowerCase();
  const isCommon = COMMON.some(c => low.includes(c)) || /^(.)\1+$/.test(pw) || /^(0123|1234|2345|abcd|qwer)/i.test(pw);
  const c = {
    len: pw.length >= 12,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    num: /\d/.test(pw),
    sym: /[^A-Za-z0-9]/.test(pw),
    common: pw.length > 0 && !isCommon
  };
  const pool = (c.lower ? 26 : 0) + (c.upper ? 26 : 0) + (c.num ? 10 : 0) + (c.sym ? 33 : 0);
  let bits = pw.length * Math.log2(pool || 1);
  let hint = '';
  
  if (isCommon) {
    bits = Math.min(bits, 10);
    hint = '😱 Kata laluan ini ada dalam senarai popular — penggodam mencuba ini dahulu!';
  } else if (/^[A-Za-z]+[^A-Za-z0-9]?\d{1,4}[^A-Za-z0-9]?$/.test(pw)) {
    bits = Math.min(bits, 33);
    hint = '🤔 Corak "Nama + Nombor" sangat mudah diteka. Cuba cipta frasa lebih panjang.';
  } else if (pw.length && pw.length < 8) {
    hint = '📏 Terlalu pendek! Sasarkan sekurang-kurangnya 12 aksara.';
  } else if (pw.length && !c.len) {
    hint = '➕ Tambah beberapa aksara lagi agar mencapai 12 aksara.';
  }
  
  const sec = Math.pow(2, bits) / 2 / 1e10; // Anggaran 10 bilion cubaan sesaat
  return { c, bits, sec, hint };
}

function updatePasswordTester(inputVal) {
  const { c, bits, sec, hint } = analyzePassword(inputVal);
  
  // Kemas kini senarai semak
  $$('#pw-checks li').forEach(li => li.classList.toggle('ok', !!c[li.dataset.k]));
  
  const lv = !inputVal ? ['–', '#94a3b8'] :
    bits < 30 ? ['Sangat Lemah 😱', '#f43f5e'] :
    bits < 45 ? ['Lemah 😟', '#f97316'] :
    bits < 65 ? ['Sederhana 😐', '#eab308'] :
    bits < 90 ? ['Kuat 💪', '#10b981'] :
    ['Super Kebal 🦸', '#0d9488'];
    
  const pct = inputVal ? Math.max(6, Math.min(100, bits / 110 * 100)) + '%' : '0';
  
  // Kemas kini Makmal Web
  const m1 = $('#pw-meter span');
  if (m1) { m1.style.width = pct; m1.style.background = lv[1]; }
  const l1 = $('#pw-label');
  if (l1) { l1.textContent = lv[0]; l1.style.color = lv[1]; }
  const t1 = $('#pw-time');
  if (t1) t1.textContent = inputVal ? fmtTime(sec) : '–';
  const h1 = $('#pw-hint');
  if (h1) h1.textContent = hint;

  // Kemas kini Makmal Slaid
  const m2 = $('#deck-pw-meter span');
  if (m2) { m2.style.width = pct; m2.style.background = lv[1]; }
  const l2 = $('#deck-pw-label');
  if (l2) { l2.textContent = lv[0]; l2.style.color = lv[1]; }
  const t2 = $('#deck-pw-time');
  if (t2) t2.textContent = inputVal ? fmtTime(sec) : '–';
}

const pwInputSite = $('#pw-input');
const pwInputDeck = $('.deck-pw-in');

if (pwInputSite) {
  pwInputSite.addEventListener('input', e => {
    updatePasswordTester(e.target.value);
    if (pwInputDeck) pwInputDeck.value = e.target.value;
  });
}
if (pwInputDeck) {
  pwInputDeck.addEventListener('input', e => {
    updatePasswordTester(e.target.value);
    if (pwInputSite) pwInputSite.value = e.target.value;
  });
}

$$('[data-pw]').forEach(btn => {
  btn.onclick = () => {
    const val = btn.dataset.pw;
    if (pwInputSite) pwInputSite.value = val;
    if (pwInputDeck) pwInputDeck.value = val;
    updatePasswordTester(val);
    sfx('pop');
  };
});

// Penjana Frasa Laluan
let currentPassphrase = '';
function generatePassphrase() {
  const w = shuffle(WORDS).slice(0, 4);
  const sym = '!@#$%&*?'[Math.random() * 8 | 0];
  const num = 10 + Math.random() * 90 | 0;
  currentPassphrase = `${w.join('-')}-${num}${sym}`;
  
  if ($('#pp-out')) $('#pp-out').textContent = currentPassphrase;
  if ($('#deck-pp-out')) $('#deck-pp-out').textContent = currentPassphrase;
  sfx('pop');
}

if ($('#pp-gen')) $('#pp-gen').onclick = generatePassphrase;
if ($('#deck-pp-gen')) $('#deck-pp-gen').onclick = generatePassphrase;

if ($('#pp-test')) {
  $('#pp-test').onclick = () => {
    if (!currentPassphrase) generatePassphrase();
    if (pwInputSite) pwInputSite.value = currentPassphrase;
    if (pwInputDeck) pwInputDeck.value = currentPassphrase;
    updatePasswordTester(currentPassphrase);
    sfx('good');
  };
}

// 5. Detektif Phishing 🔍
$$('.hs-game').forEach(game => {
  const items = $$('.hs-list li', game);
  const countEl = $('.hs-count b', game);
  const found = new Set();
  
  const mark = (idx, quiet) => {
    if (found.has(idx)) return;
    found.add(idx);
    
    $$(`.hs[data-i="${idx}"]`, game).forEach(h => h.classList.add('found'));
    const li = items.find(l => l.dataset.i === String(idx));
    if (li) {
      li.innerHTML = li.dataset.tip;
      li.classList.add('found');
    }
    if (countEl) countEl.textContent = found.size;
    
    if (!quiet) {
      sfx('good');
      if (found.size === items.length) {
        sfx('win');
        confetti();
      }
    }
  };
  
  $$('.hs', game).forEach(h => {
    h.onclick = () => mark(h.dataset.i);
  });
  
  const phoneEl = $('.phone', game);
  if (phoneEl) {
    phoneEl.addEventListener('click', e => {
      if (!e.target.closest('.hs')) {
        phoneEl.classList.remove('shake');
        void phoneEl.offsetWidth;
        phoneEl.classList.add('shake');
        sfx('bad');
      }
    });
  }
  
  const revealBtn = $('.hs-reveal', game);
  if (revealBtn) {
    revealBtn.onclick = () => items.forEach(l => mark(l.dataset.i, true));
  }
  
  const resetBtn = $('.hs-reset', game);
  if (resetBtn) {
    resetBtn.onclick = () => {
      found.clear();
      if (countEl) countEl.textContent = 0;
      $$('.hs', game).forEach(h => h.classList.remove('found'));
      items.forEach(l => {
        l.textContent = '❓ ???';
        l.classList.remove('found');
      });
    };
  }
});

// 6. Permainan Kad Interaktif (Cardgame)
$$('.cardgame').forEach(el => {
  const gName = el.dataset.game;
  const G = GAMES[gName];
  if (!G) return;
  
  let idx = 0, score = 0, results = [];
  
  const start = () => {
    idx = 0;
    score = 0;
    results = [];
    render();
  };
  
  const render = () => {
    if (idx >= G.items.length) return finish();
    const it = G.items[idx];
    
    el.innerHTML = `
      <div class="cg-top">
        <span>Kad ${idx + 1} / ${G.items.length}</span>
        <div class="cg-dots">
          ${G.items.map((_, k) => `<i class="${k === idx ? 'cur' : results[k] === true ? 'g' : results[k] === false ? 'b' : ''}"></i>`).join('')}
        </div>
        <span>⭐ Markah: ${score}</span>
      </div>
      <div class="cg-card">
        ${it.big ? `<span class="cg-big">${it.big}</span>` : ''}
        <div>
          ${it.tag ? `<span class="cg-tag">${it.tag}</span>` : ''}
          <div class="cg-text">${it.text}</div>
        </div>
      </div>
      <div class="cg-opts">
        ${G.opts.map((opt, k) => `<button data-k="${k}">${opt}</button>`).join('')}
      </div>
      <div class="cg-fb"></div>
    `;
    
    $$('.cg-opts button', el).forEach(btn => {
      btn.onclick = () => submitAnswer(+btn.dataset.k);
    });
  };
  
  const submitAnswer = chosenIdx => {
    const it = G.items[idx];
    const isCorrect = chosenIdx === it.a;
    results[idx] = isCorrect;
    if (isCorrect) score++;
    
    $$('.cg-opts button', el).forEach((b, j) => {
      b.disabled = true;
      if (j === it.a) b.classList.add('right');
      else if (j === chosenIdx) b.classList.add('wrong');
    });
    
    const fb = $('.cg-fb', el);
    fb.className = 'cg-fb show ' + (isCorrect ? 'g' : 'b');
    fb.innerHTML = `
      <span><b>${isCorrect ? '🎉 Tepat Sekali!' : '😬 Berhati-hati!'}</b> ${it.why}</span>
    `;
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-hero-primary';
    nextBtn.style.padding = '0.5rem 1.25rem';
    nextBtn.style.fontSize = '0.92rem';
    nextBtn.textContent = idx + 1 < G.items.length ? 'Seterusnya ➜' : 'Lihat Keputusan 🏁';
    nextBtn.onclick = () => {
      idx++;
      render();
    };
    fb.appendChild(nextBtn);
    
    sfx(isCorrect ? 'good' : 'bad');
  };
  
  const finish = () => {
    const pct = score / G.items.length;
    el.innerHTML = `
      <div class="cg-end">
        <div style="font-size: 3.5rem;">${pct === 1 ? '🏆' : pct >= 0.6 ? '🌟' : '💪'}</div>
        <div class="score">${score} / ${G.items.length}</div>
        <div style="font-size: 1.15rem; font-weight: 600; max-width: 28rem;">
          ${pct === 1 ? 'Tahniah! Anda sememangnya Wira Siber yang peka!' : pct >= 0.6 ? 'Hebat! Anda menguasai sebahagian besar situasi keselamatan.' : 'Usaha yang baik! Sekarang anda lebih tahu tanda-tanda ancaman digital.'}
        </div>
        <button class="btn-hero-secondary" style="margin-top: 1rem;">↺ Main Semula</button>
      </div>
    `;
    $('button', el).onclick = start;
    if (pct >= 0.6) {
      sfx('win');
      confetti(120);
    }
  };
  
  start();
});

// 7. Senario Buli Siber
$$('.scenario').forEach(sc => {
  const fb = $('.fb', sc);
  $$('.opt', sc).forEach(opt => {
    opt.onclick = () => {
      $$('.opt', sc).forEach(o => o.classList.remove('good', 'bad', 'meh'));
      opt.classList.add(opt.dataset.v);
      if (fb) fb.textContent = opt.dataset.fb;
      sfx(opt.dataset.v === 'good' ? 'good' : opt.dataset.v === 'bad' ? 'bad' : 'tick');
      if (opt.dataset.v === 'good') confetti(120);
    };
  });
});

// 8. Senarai Semak Privasi (Checklist)
$$('.check-wrap').forEach(w => {
  const lis = $$('.checklist li', w);
  const ring = $('.ring', w);
  const countEl = $('.check-count', w);
  const labelEl = $('.check-label', w);
  
  const updateChecklist = () => {
    const doneCount = lis.filter(li => li.classList.contains('done')).length;
    if (ring) ring.style.setProperty('--p', (doneCount / lis.length) * 100);
    if (countEl) countEl.textContent = `${doneCount}/${lis.length}`;
    if (labelEl) {
      const labels = [
        'Tahap Privasi',
        'Baru Bermula 🌱',
        'Sedang Belajar 📘',
        'Separuh Jalan 🚶',
        'Bagus & Selamat 👍',
        'Sangat Cemerlang 🌟',
        'Benteng Kebal! 🏰'
      ];
      labelEl.textContent = labels[Math.round((doneCount / lis.length) * 6)];
    }
    if (doneCount === lis.length) {
      sfx('win');
      confetti();
    }
  };
  
  lis.forEach(li => {
    li.onclick = () => {
      li.classList.toggle('done');
      sfx('pop');
      updateChecklist();
    };
  });
});

// 9. Ikrar Wira Siber
$$('.pledge li').forEach(li => {
  li.onclick = () => {
    li.classList.toggle('lit');
    sfx('pop');
    const allLit = $$('.pledge li').every(l => l.classList.contains('lit'));
    const doneEl1 = $('#pledge-done');
    const doneEl2 = $('#deck-pledge-done');
    if (doneEl1) doneEl1.classList.toggle('show', allLit);
    if (doneEl2) doneEl2.style.display = allLit ? 'block' : 'none';
    if (allLit) {
      sfx('win');
      confetti(260);
    }
  };
});

/* =========================================================
   KUIZ BERPASUKAN WIRA SIBER 🏆
   Berfungsi di laman web (#quiz-app) dan slaid (#deck-quiz-app)
   ========================================================= */
function initQuiz(containerId) {
  const container = $(containerId);
  if (!container) return;
  
  const state = {
    el: container,
    nTeams: 2,
    timerOn: true,
    secs: 20,
    shuffle: false,
    teams: [],
    i: 0,
    order: [],
    tm: null,
    left: 0,
    revealed: false,
    awarded: new Set()
  };
  
  function setup() {
    clearInterval(state.tm);
    state.el.innerHTML = `
      <div class="qz-setup">
        <div class="trophy">🏆</div>
        <h2 style="font-size: 2rem;">Pertandingan Kuiz Wira Siber</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem;">
          ${QUIZ.length} soalan mencabar • Pasukan berbincang, angkat tangan dan kumpul mata!
        </p>
        
        <div class="qz-choice" data-set="teams">
          <span>Bilangan Pasukan:</span>
          ${[2, 3, 4].map(n => `<button data-v="${n}" class="${n === state.nTeams ? 'sel' : ''}">${n}</button>`).join('')}
        </div>
        
        <div class="qz-choice" data-set="timer">
          <span>Masa Soalan:</span>
          ${[0, 15, 20, 30].map(n => `<button data-v="${n}" class="${(state.timerOn ? state.secs : 0) === n ? 'sel' : ''}">${n ? n + 's' : 'Tiada'}</button>`).join('')}
        </div>
        
        <div class="qz-choice" data-set="shuffle">
          <span>Susunan Soalan:</span>
          <button data-v="0" class="${!state.shuffle ? 'sel' : ''}">Turutan</button>
          <button data-v="1" class="${state.shuffle ? 'sel' : ''}">Rawak</button>
        </div>
        
        <button class="btn-hero-primary" id="qz-start-${container.id}" style="margin-top: 1rem; font-size: 1.15rem; padding: 0.85rem 2.2rem;">
          Mula Kuiz Sekarang ▶
        </button>
      </div>
    `;
    
    $$('.qz-choice', state.el).forEach(row => {
      $$('button', row).forEach(btn => {
        btn.onclick = () => {
          $$('button', row).forEach(x => x.classList.remove('sel'));
          btn.classList.add('sel');
          const val = +btn.dataset.v;
          if (row.dataset.set === 'teams') state.nTeams = val;
          else if (row.dataset.set === 'timer') {
            state.timerOn = val > 0;
            if (val) state.secs = val;
          } else {
            state.shuffle = !!val;
          }
          sfx('tick');
        };
      });
    });
    
    const startBtn = $(`#qz-start-${container.id}`);
    if (startBtn) {
      startBtn.onclick = () => {
        state.teams = TEAMS.slice(0, state.nTeams).map(t => ({ ...t, score: 0 }));
        state.order = state.shuffle ? shuffle(QUIZ.map((_, k) => k)) : QUIZ.map((_, k) => k);
        state.i = 0;
        showQuestion();
        sfx('good');
      };
    }
  }
  
  function getBoardHTML() {
    return `
      <div class="qz-board" style="--n: ${state.teams.length}">
        ${state.teams.map((t, k) => `
          <div class="qz-team" style="--tc: ${t.color}">
            <b>${t.emo} Pasukan ${t.name}</b>
            <span data-t="${k}">${t.score}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  function showQuestion() {
    clearInterval(state.tm);
    state.revealed = false;
    state.awarded = new Set();
    const it = QUIZ[state.order[state.i]];
    
    state.el.innerHTML = `
      <div class="qz-head">
        <span class="qz-num">Soalan ${state.i + 1} / ${QUIZ.length}</span>
        ${state.timerOn ? `<div class="qz-timer" title="Ketik untuk jeda/sambung"><span>${state.secs}</span></div>` : '<div></div>'}
        <button class="btn-ghost" id="qz-quit-${container.id}">✕ Tamatkan</button>
      </div>
      
      <div class="qz-q">${it.q}</div>
      
      <div class="qz-opts">
        ${it.o.map((opt, k) => `
          <button class="qz-opt" data-k="${k}">
            <span class="L">${'ABCD'[k]}</span>${opt}
          </button>
        `).join('')}
      </div>
      
      <div class="qz-after"></div>
      
      <div class="qz-actions">
        <button class="btn-hero-secondary" id="qz-show-${container.id}">👀 Tunjuk Jawapan</button>
      </div>
      
      ${getBoardHTML()}
    `;
    
    $$('.qz-opt', state.el).forEach(b => {
      b.onclick = () => revealAnswer(+b.dataset.k);
    });
    
    const showBtn = $(`#qz-show-${container.id}`);
    if (showBtn) showBtn.onclick = () => revealAnswer(-1);
    
    const quitBtn = $(`#qz-quit-${container.id}`);
    if (quitBtn) quitBtn.onclick = showEnd;
    
    if (state.timerOn) {
      state.left = state.secs;
      let isPaused = false;
      const tEl = $('.qz-timer', state.el);
      if (tEl) {
        tEl.onclick = () => {
          isPaused = !isPaused;
          tEl.style.opacity = isPaused ? '0.45' : '1';
        };
        state.tm = setInterval(() => {
          if (isPaused) return;
          state.left--;
          const span = tEl.querySelector('span');
          if (span) span.textContent = Math.max(0, state.left);
          tEl.style.setProperty('--p', (state.left / state.secs) * 100);
          tEl.classList.toggle('low', state.left <= 5);
          if (state.left <= 5 && state.left > 0) sfx('tick');
          if (state.left <= 0) {
            clearInterval(state.tm);
            sfx('bad');
            if (span) span.textContent = '⏰';
          }
        }, 1000);
      }
    }
  }
  
  function revealAnswer(chosenIdx) {
    if (state.revealed) return;
    state.revealed = true;
    clearInterval(state.tm);
    
    const it = QUIZ[state.order[state.i]];
    const opts = $('.qz-opts', state.el);
    if (opts) opts.classList.add('done');
    
    $$('.qz-opt', state.el).forEach((b, j) => {
      if (j === it.a) b.classList.add('correct');
      if (j === chosenIdx) b.classList.add('picked');
    });
    
    sfx(chosenIdx === -1 || chosenIdx === it.a ? 'good' : 'bad');
    
    const afterEl = $('.qz-after', state.el);
    if (afterEl) {
      afterEl.innerHTML = `
        <div class="qz-exp">
          ✅ <b>Jawapan Tepat: Pilihan ${'ABCD'[it.a]}.</b> ${it.e}
        </div>
      `;
    }
    
    const isLast = state.i + 1 >= QUIZ.length;
    const actionsEl = $('.qz-actions', state.el);
    if (actionsEl) {
      actionsEl.innerHTML = `
        <div class="qz-award">
          <span>Beri Markah (+10):</span>
          ${state.teams.map((t, j) => `
            <button data-t="${j}" style="--tc: ${t.color}">
              ${t.emo} ${t.name}
            </button>
          `).join('')}
        </div>
        <button class="btn-hero-primary" id="qz-next-${container.id}">
          ${isLast ? 'Lihat Juara 🏁' : 'Seterusnya ➜'}
        </button>
      `;
      
      $$('.qz-award button', state.el).forEach(b => {
        b.onclick = () => {
          const j = +b.dataset.t;
          const isOn = !state.awarded.has(j);
          if (isOn) state.awarded.add(j);
          else state.awarded.delete(j);
          
          state.teams[j].score += isOn ? 10 : -10;
          b.classList.toggle('on', isOn);
          
          const scEl = $(`.qz-board span[data-t="${j}"]`, state.el);
          if (scEl) {
            scEl.textContent = state.teams[j].score;
            scEl.classList.remove('bump');
            void scEl.offsetWidth;
            scEl.classList.add('bump');
          }
          sfx(isOn ? 'good' : 'tick');
        };
      });
      
      const nextBtn = $(`#qz-next-${container.id}`);
      if (nextBtn) {
        nextBtn.onclick = () => {
          if (isLast) showEnd();
          else {
            state.i++;
            showQuestion();
          }
        };
      }
    }
  }
  
  function showEnd() {
    clearInterval(state.tm);
    const ranked = [...state.teams].sort((a, b) => b.score - a.score);
    const topScore = ranked[0].score;
    const winners = ranked.filter(t => t.score === topScore);
    const medalIcons = ['🥇', '🥈', '🥉', '🎖️'];
    const podiumOrder = ranked.length >= 3 ? [ranked[1], ranked[0], ranked[2], ...ranked.slice(3)] : ranked;
    const calcH = t => 7 + (topScore ? (t.score / topScore) : 1) * 8;
    
    state.el.innerHTML = `
      <div class="qz-end">
        <h2 style="font-size: 2.2rem;">
          ${winners.length > 1 ? '🤝 Seri! Tahniah Semua Pasukan!' : `🎉 Juara: Pasukan ${winners[0].name}!`}
        </h2>
        <div class="podium">
          ${podiumOrder.map(t => `
            <div style="--tc: ${t.color}; height: ${calcH(t)}rem;">
              <i>${medalIcons[ranked.indexOf(t)]}</i>
              <b>${t.name}</b>
              <span>${t.score}</span>
            </div>
          `).join('')}
        </div>
        <div style="display:flex; gap:1rem;">
          <button class="btn-hero-secondary" id="qz-again-${container.id}">↺ Main Semula</button>
        </div>
      </div>
    `;
    
    const againBtn = $(`#qz-again-${container.id}`);
    if (againBtn) againBtn.onclick = setup;
    
    sfx('win');
    confetti(300);
  }
  
  setup();
}

// Inisialisasi kuiz pada kedua-dua bekas
initQuiz('#quiz-app');
initQuiz('#deck-quiz-app');

/* =========================================================
   PENGESAN HASH URL (Pautan Terus)
   ========================================================= */
function checkHash() {
  const hash = location.hash;
  if (!hash) return;
  
  if (hash.startsWith('#slide-')) {
    const num = parseInt(hash.replace('#slide-', ''), 10);
    if (Number.isFinite(num)) {
      setMode('deck', num - 1);
    }
  } else if (hash.length > 1) {
    // Navigasi sauh dalam mod laman web
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target && currentMode === 'deck') {
      setMode('site');
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }
}

window.addEventListener('hashchange', checkHash);
checkHash();

/* =========================================================
   NAVIGASI HEADER: menu lungsur (skrin kecil) & penanda bahagian aktif
   ========================================================= */
const header = $('#site-header');
const navToggle = $('#navToggle');
const navLinks = $$('.site-nav .nav-link');

function setNavOpen(open) {
  if (!header || !navToggle) return;
  header.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.textContent = open ? '✕' : '☰';
}

if (navToggle) {
  navToggle.onclick = e => {
    e.stopPropagation();
    setNavOpen(!header.classList.contains('nav-open'));
  };
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-nav')) setNavOpen(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNavOpen(false); });
}
navLinks.forEach(a => a.addEventListener('click', () => setNavOpen(false)));

// Tandakan pautan bagi bahagian yang sedang dibaca
// data-spy: senarai id bahagian yang dikira milik pautan itu (cth. Modul = peta + 5 pilar)
const spyTargets = navLinks
  .flatMap(a => (a.dataset.spy || a.getAttribute('href').slice(1)).split(/\s+/)
    .map(id => ({ a, sec: document.getElementById(id) })))
  .filter(x => x.sec)
  .sort((x, y) => x.sec.getBoundingClientRect().top - y.sec.getBoundingClientRect().top);

function updateActiveNav() {
  const line = (header ? header.offsetHeight : 0) + window.innerHeight * 0.3;
  let current = null;
  spyTargets.forEach(x => {
    if (x.sec.getBoundingClientRect().top <= line) current = x;
  });
  // Selepas bahagian kuiz (ikrar, talian), kekalkan kuiz sebagai aktif hanya jika masih dalam kuiz
  if (current && current.sec.getBoundingClientRect().bottom < line) current = null;
  navLinks.forEach(a => a.classList.toggle('active', !!current && a === current.a));
}

/* =========================================================
   MOTION SEMASA SKROL (laman web sahaja, bukan slaid)
   - Elemen muncul perlahan apabila masuk ke skrin, berturutan.
   - Bar kemajuan skrol di bawah header & bayang header.
   - Dimatikan jika pengguna memilih "kurangkan gerakan".
   ========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const REVEAL = [
    ['.hero-content > *', 'up'],
    ['.hero-visual', 'zoom'],
    ['.section-header', 'up'],
    ['.pillar-card', 'up'],
    ['.pillar-banner', 'left'],
    ['.site-pillar-section > .interactive-box', 'up'],
    ['.cards-2col > .interactive-box', 'up'],
    ['.quiz-section-wrap', 'zoom'],
    ['.pledge li', 'left'],
    ['#pledge-done', 'zoom'],
    ['.contact-card', 'up'],
    ['.footer-container > *', 'up'],
  ];
  const items = [];
  REVEAL.forEach(([sel, kind]) => {
    $$(sel).forEach(el => {
      if (el.closest('#deck') || el.dataset.reveal) return;
      el.dataset.reveal = kind;
      items.push(el);
    });
  });
  // Kesan berturutan untuk elemen bersebelahan (cth. kad pilar satu demi satu)
  items.forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.dataset.reveal);
    el.style.setProperty('--reveal-delay', Math.min(sibs.indexOf(el), 6) * 90 + 'ms');
  });
  document.documentElement.classList.add('motion-ready');

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-visible');
      io.unobserve(el);
      // Selepas animasi, pulangkan gaya asal (supaya kesan hover kad kekal)
      setTimeout(() => {
        el.removeAttribute('data-reveal');
        el.classList.remove('is-visible');
        el.style.removeProperty('--reveal-delay');
      }, 1400);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  items.forEach(el => io.observe(el));
}

// Bar kemajuan skrol (dalam header)
let siteProgress = null;
if (header) {
  siteProgress = document.createElement('div');
  siteProgress.className = 'site-progress';
  siteProgress.innerHTML = '<span></span>';
  header.appendChild(siteProgress);
}

function onSiteScroll() {
  updateActiveNav();
  if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  if (siteProgress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    siteProgress.firstChild.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  }
}

window.addEventListener('scroll', onSiteScroll, { passive: true });
window.addEventListener('resize', onSiteScroll);
onSiteScroll();

})();
