/* ===== DATA FOTO =====
   Ganti "src" dengan file fotomu sendiri, misalnya "foto/gunung.jpg".
   Sekarang gambar dibuat otomatis (ilustrasi) supaya galeri langsung jalan. */
function art(type, a, b){
  const sc = {
    Alam:`<circle cx="320" cy="70" r="34" fill="#ffe08a"/><path d="M0 240 L110 110 L190 200 L260 140 L400 240Z" fill="${b}"/><path d="M0 240 L80 180 L170 240Z" fill="#2c6e49"/>`,
    Kota:`<rect x="30" y="120" width="60" height="120" fill="${b}"/><rect x="100" y="80" width="70" height="160" fill="#27324d"/><rect x="180" y="140" width="55" height="100" fill="${b}"/><rect x="245" y="60" width="80" height="180" fill="#27324d"/><rect x="335" y="150" width="50" height="90" fill="${b}"/>`,
    Laut:`<circle cx="90" cy="80" r="30" fill="#fff3b0"/><path d="M0 170 Q50 150 100 170 T200 170 T300 170 T400 170 V240 H0Z" fill="${b}"/><path d="M0 200 Q50 180 100 200 T200 200 T300 200 T400 200 V240 H0Z" fill="#0b4f8a" opacity=".7"/><path d="M230 150 L290 150 L275 170 L245 170Z" fill="#fff"/><path d="M260 90 V150 L300 150Z" fill="#fff"/>`,
    Makanan:`<circle cx="200" cy="130" r="95" fill="#fff"/><circle cx="200" cy="130" r="70" fill="${b}"/><circle cx="170" cy="115" r="16" fill="#e63946"/><circle cx="220" cy="110" r="14" fill="#80b918"/><circle cx="205" cy="152" r="18" fill="#ffd166"/>`
  }[type];
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs><rect width="400" height="240" fill="url(#g)"/>${sc}</svg>`;
  return "data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}

const photos = [
  {t:"Puncak Berkabut", c:"Alam",    d:"Gunung di pagi hari",         a:"#9ad1ff", b:"#6c8ea4"},
  {t:"Lembah Hijau",    c:"Alam",    d:"Perbukitan setelah hujan",    a:"#c7f0d8", b:"#3f8f5c"},
  {t:"Senja di Gunung", c:"Alam",    d:"Langit jingga di puncak",     a:"#ffb48a", b:"#8a5a6b"},
  {t:"Pusat Kota",      c:"Kota",    d:"Gedung tinggi siang hari",    a:"#a8c8ff", b:"#4a5d8f"},
  {t:"Kota Malam",      c:"Kota",    d:"Lampu kota menyala",          a:"#5b6fb5", b:"#f4b942"},
  {t:"Distrik Lama",    c:"Kota",    d:"Bangunan tua bersejarah",     a:"#e8d5b7", b:"#a0522d"},
  {t:"Pantai Tenang",   c:"Laut",    d:"Ombak kecil di pagi hari",    a:"#bfe6ff", b:"#2f8fd1"},
  {t:"Perahu Layar",    c:"Laut",    d:"Berlayar di laut lepas",      a:"#ffd9a8", b:"#1f78b4"},
  {t:"Laut Biru",       c:"Laut",    d:"Air jernih menuju cakrawala", a:"#a0e7e5", b:"#0e86c8"},
  {t:"Nasi Hangat",     c:"Makanan", d:"Hidangan rumahan",            a:"#ffe5d0", b:"#f2a65a"},
  {t:"Salad Segar",     c:"Makanan", d:"Sayur dan buah pilihan",      a:"#e6f7d4", b:"#9bc53d"},
  {t:"Sarapan Pagi",    c:"Makanan", d:"Menu sederhana",              a:"#fff1c9", b:"#e07a5f"}
].map((p,i)=>({id:i, title:p.t, cat:p.c, desc:p.d, src:art(p.c,p.a,p.b)}));

/* ===== STATE & ELEMEN ===== */
let cat = "Semua", query = "", list = [], idx = 0;
const $ = id => document.getElementById(id);
const grid = $("grid"), filters = $("filters"), lb = $("lb");

/* ===== KATEGORI & FILTER ===== */
["Semua", ...new Set(photos.map(p=>p.cat))].forEach(c=>{
  const b = document.createElement("button");
  b.textContent = c;
  b.className = c===cat ? "active" : "";
  b.onclick = () => {
    cat = c;
    [...filters.children].forEach(x => x.classList.toggle("active", x===b));
    render();
  };
  filters.appendChild(b);
});

/* ===== GRID ===== */
function render(){
  list = photos.filter(p => (cat==="Semua" || p.cat===cat) && p.title.toLowerCase().includes(query));
  grid.innerHTML = list.length ? "" : '<p class="empty">Tidak ada foto yang cocok. Coba kata kunci atau kategori lain.</p>';
  list.forEach((p,i)=>{
    const el = document.createElement("button");
    el.className = "item";
    el.innerHTML = `<img src="${p.src}" alt="${p.title}" loading="lazy"><div><b>${p.title}</b><span>${p.cat}</span></div>`;
    el.onclick = () => openLb(i);
    grid.appendChild(el);
  });
}

/* ===== PENCARIAN ===== */
$("q").addEventListener("input", e => { query = e.target.value.trim().toLowerCase(); render(); });

/* ===== LIGHTBOX & NAVIGASI ===== */
function show(){
  const p = list[idx];
  $("lbImg").src = p.src;
  $("lbImg").alt = p.title;
  $("lbTitle").textContent = p.title;
  $("lbMeta").textContent = `${p.cat} • ${p.desc} • Foto ${idx+1} dari ${list.length}`;
}
function openLb(i){ idx=i; show(); lb.classList.add("open"); document.body.style.overflow="hidden"; $("close").focus(); }
function closeLb(){ lb.classList.remove("open"); document.body.style.overflow=""; }
function go(n){ idx = (idx+n+list.length) % list.length; show(); }

$("close").onclick = closeLb;
$("prev").onclick = () => go(-1);
$("next").onclick = () => go(1);
lb.addEventListener("click", e => { if(e.target===lb) closeLb(); });

document.addEventListener("keydown", e=>{
  if(!lb.classList.contains("open")) return;
  if(e.key==="Escape") closeLb();
  if(e.key==="ArrowLeft") go(-1);
  if(e.key==="ArrowRight") go(1);
});

let sx = 0;
lb.addEventListener("touchstart", e => sx = e.touches[0].clientX, {passive:true});
lb.addEventListener("touchend", e => {
  const d = e.changedTouches[0].clientX - sx;
  if(Math.abs(d) > 50) go(d<0 ? 1 : -1);
});

render();