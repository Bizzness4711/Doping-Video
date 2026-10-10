import "./style.css";

/* ---------------------------------------------------------------
   İçerik: Blender Vakfı'nın açık lisanslı kısa filmleri.
   Gerçek filmler, gerçek yönetmenler — uydurma veri yok.
   Videolar doğrudan gtv-videos-bucket'tan akar.
---------------------------------------------------------------- */

type Film = {
  title: string;
  director: string;
  year: number;
  runtime: string;
  category: "Animasyon" | "Bilim Kurgu" | "Fantastik" | "Belgesel";
  synopsis: string;
  video: string;
  poster: string;
};

const FILMS: Film[] = [
  {
    title: "Sintel",
    director: "Colin Levy",
    year: 2010,
    runtime: "14 dk",
    category: "Fantastik",
    synopsis:
      "Kayıp ejderha arkadaşı Scales'i aramak için kıtaları geçen genç bir savaşçının yolculuğu.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
  },
  {
    title: "Tears of Steel",
    director: "Ian Hubert",
    year: 2012,
    runtime: "12 dk",
    category: "Bilim Kurgu",
    synopsis:
      "Amsterdam'da makinelerin dünyayı ele geçirdiği bir gelecekte, geçmişi düzeltmek için zaman yolculuğuna başvuran bir ekip.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
  },
  {
    title: "Big Buck Bunny",
    director: "Sacha Goedegebure",
    year: 2008,
    runtime: "9 dk",
    category: "Animasyon",
    synopsis:
      "Kalbi iyi üç tavşanın yaptıkları şakalara sessiz kalmayan dev tavşan Bunny'nin tatlı ama aktif intikamı.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  },
  {
    title: "Elephants Dream",
    director: "Bassam Kurdali",
    year: 2006,
    runtime: "10 dk",
    category: "Fantastik",
    synopsis:
      "Dünyanın en garip makinesinin içinde yaşayan iki adamın, Proog ve Emo'nun, gerçeğe dair çelişen algıları.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
  },
  {
    title: "For Bigger Blazes",
    director: "Google Studios",
    year: 2013,
    runtime: "15 sn",
    category: "Bilim Kurgu",
    synopsis:
      "Chromecast'in ilk tanıtım filmi: büyük ekranın ateşi her odaya taşınması.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
  },
  {
    title: "Substitute Communication",
    director: "Google Studios",
    year: 2014,
    runtime: "15 sn",
    category: "Belgesel",
    synopsis:
      "Ekran paylaşımlı bir odada toplantı yapmanın yollarını gösteren kısa tanıtım.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
  },
  {
    title: "Volkswagen GTI Review",
    director: "Auto Archive",
    year: 2011,
    runtime: "2 dk",
    category: "Belgesel",
    synopsis:
      "Klasik hot hatch'in günlük kullanım detaylarını inceleyen bağımsız bir test videosu.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg",
  },
  {
    title: "We Are Going On Bullrun",
    director: "Auto Archive",
    year: 2009,
    runtime: "47 sn",
    category: "Belgesel",
    synopsis:
      "Efsanevi otomobil rallisinin sahne arkasından kısa kesitler.",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
  },
];

const CATEGORIES = [
  "Tümü",
  "Animasyon",
  "Bilim Kurgu",
  "Fantastik",
  "Belgesel",
] as const;

const app = document.querySelector<HTMLDivElement>("#app")!;

/* ---------------------------------------------------------------
   Yerleşim (eskizdeki gibi):
   sol = klasör + video seçim paneli
   orta = büyük video
   sağ/sol = mini önizleme çerçeveleri + yön tuşları (< >)
---------------------------------------------------------------- */

app.innerHTML = `
  <header class="mx-auto flex max-w-7xl items-center justify-between px-4 pt-6 md:px-6">
    <p class="font-display text-lg font-semibold tracking-tight">
      Sinema<span class="text-amber">Koleksiyonu</span>
    </p>
    <p id="video-count" class="text-xs uppercase tracking-[0.2em] text-paper-dim"></p>
  </header>

  <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:px-6 lg:flex-row">
    <!-- SOL PANEL: klasör + video seçimi -->
    <aside class="w-full shrink-0 rounded-lg border border-ink-2 bg-ink-2/60 lg:w-72" aria-label="Klasör ve video seçimi">
      <div class="border-b border-ink-2 p-4">
        <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim">Klasörler</h2>
        <div id="folder-list" class="mt-3 flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"></div>
      </div>
      <div class="p-4">
        <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper-dim">Videolar</h2>
        <div id="video-list" class="mt-3 flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" role="listbox" aria-label="Video listesi"></div>
      </div>
    </aside>

    <!-- ORTA SAHNE -->
    <main class="min-w-0 flex-1">
      <div class="flex items-center justify-center gap-2 sm:gap-4">
        <!-- Sol yön + sol mini önizleme -->
        <button id="prev-btn" type="button" aria-label="Önceki video"
          class="shrink-0 rounded-full p-2 text-3xl leading-none text-paper-dim transition-colors hover:text-amber sm:p-3">‹</button>

        <button id="prev-preview" type="button"
          class="group hidden w-32 shrink-0 overflow-hidden rounded-lg border border-ink-2 bg-ink-2 text-left transition-colors hover:border-amber/60 sm:block md:w-40"
          aria-label="Önceki videoya git">
          <span class="relative block aspect-[4/3] overflow-hidden">
            <video id="prev-video" class="h-full w-full object-cover" muted playsinline preload="metadata"></video>
            <span class="absolute inset-0 flex items-center justify-center bg-ink/30">
              <span class="flex h-9 w-9 items-center justify-center rounded-full border border-paper/60 bg-ink/70 text-sm text-paper">▶</span>
            </span>
          </span>
          <span id="prev-title" class="block truncate px-2 py-1.5 text-xs text-paper-dim"></span>
        </button>

        <!-- Büyük video -->
        <div class="min-w-0 flex-1">
          <div class="overflow-hidden rounded-lg border border-ink-2 bg-black">
            <video id="main-video" class="aspect-video h-full w-full" controls playsinline preload="metadata"></video>
          </div>
        </div>

        <!-- Sağ mini önizleme + sağ yön -->
        <button id="next-preview" type="button"
          class="group hidden w-32 shrink-0 overflow-hidden rounded-lg border border-ink-2 bg-ink-2 text-left transition-colors hover:border-amber/60 sm:block md:w-40"
          aria-label="Sonraki videoya git">
          <span class="relative block aspect-[4/3] overflow-hidden">
            <video id="next-video" class="h-full w-full object-cover" muted playsinline preload="metadata"></video>
            <span class="absolute inset-0 flex items-center justify-center bg-ink/30">
              <span class="flex h-9 w-9 items-center justify-center rounded-full border border-paper/60 bg-ink/70 text-sm text-paper">▶</span>
            </span>
          </span>
          <span id="next-title" class="block truncate px-2 py-1.5 text-xs text-paper-dim"></span>
        </button>

        <button id="next-btn" type="button" aria-label="Sonraki video"
          class="shrink-0 rounded-full p-2 text-3xl leading-none text-paper-dim transition-colors hover:text-amber sm:p-3">›</button>
      </div>

      <!-- Mobil mini önizlemeler (sm altı) -->
      <div class="mt-3 grid grid-cols-2 gap-3 sm:hidden">
        <button id="prev-preview-m" type="button" class="overflow-hidden rounded-lg border border-ink-2 bg-ink-2 text-left" aria-label="Önceki videoya git">
          <span class="block truncate px-2 py-1.5 text-xs text-paper-dim">‹ Önceki</span>
        </button>
        <button id="next-preview-m" type="button" class="overflow-hidden rounded-lg border border-ink-2 bg-ink-2 text-left" aria-label="Sonraki videoya git">
          <span class="block truncate px-2 py-1.5 text-right text-xs text-paper-dim">Sonraki ›</span>
        </button>
      </div>

      <!-- Video bilgisi -->
      <div class="mt-4 rounded-lg border border-ink-2 bg-ink-2/60 p-4 sm:p-5">
        <p id="main-cat" class="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber"></p>
        <h1 id="main-title" class="mt-1 font-display text-2xl font-semibold leading-tight sm:text-3xl"></h1>
        <p id="main-meta" class="mt-1 text-sm text-paper-dim"></p>
        <p id="main-synopsis" class="mt-3 max-w-2xl text-sm leading-relaxed text-paper-dim"></p>
      </div>
    </main>
  </div>

  <footer class="border-t border-ink-2">
    <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-paper-dim sm:flex-row sm:items-center sm:justify-between md:px-6">
      <p>© 2026 Sinema Koleksiyonu — tüm filmler açık lisanslıdır.</p>
      <p>← → tuşlarıyla da gezinebilirsin.</p>
    </div>
  </footer>
`;

/* ---------------------------------------------------------------
   Durum + seçim mantığı
---------------------------------------------------------------- */

let activeFolder: string = "Tümü";
let currentIndex = 0;

function filteredFilms(): Film[] {
  return activeFolder === "Tümü"
    ? FILMS
    : FILMS.filter((f) => f.category === activeFolder);
}

function currentFilm(): Film {
  const list = filteredFilms();
  if (list.length === 0) return FILMS[0];
  return list[((currentIndex % list.length) + list.length) % list.length];
}

function prevFilm(): Film {
  const list = filteredFilms();
  return list[((currentIndex - 1) % list.length + list.length) % list.length];
}

function nextFilm(): Film {
  const list = filteredFilms();
  return list[(currentIndex + 1) % list.length];
}

const folderListEl = document.querySelector<HTMLDivElement>("#folder-list")!;
const videoListEl = document.querySelector<HTMLDivElement>("#video-list")!;
const videoCountEl = document.querySelector<HTMLParagraphElement>("#video-count")!;
const mainVideo = document.querySelector<HTMLVideoElement>("#main-video")!;
const mainCat = document.querySelector<HTMLParagraphElement>("#main-cat")!;
const mainTitle = document.querySelector<HTMLHeadingElement>("#main-title")!;
const mainMeta = document.querySelector<HTMLParagraphElement>("#main-meta")!;
const mainSynopsis = document.querySelector<HTMLParagraphElement>("#main-synopsis")!;
const prevVideo = document.querySelector<HTMLVideoElement>("#prev-video")!;
const nextVideo = document.querySelector<HTMLVideoElement>("#next-video")!;
const prevTitle = document.querySelector<HTMLSpanElement>("#prev-title")!;
const nextTitle = document.querySelector<HTMLSpanElement>("#next-title")!;

function folderCount(cat: string): number {
  return cat === "Tümü" ? FILMS.length : FILMS.filter((f) => f.category === cat).length;
}

function renderFolders(): void {
  folderListEl.innerHTML = "";
  for (const cat of CATEGORIES) {
    const active = cat === activeFolder;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-pressed", String(active));
    btn.className = [
      "flex shrink-0 items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition-colors lg:w-full",
      active
        ? "border-amber bg-amber text-ink font-semibold"
        : "border-ink-2 text-paper-dim hover:border-paper-dim hover:text-paper",
    ].join(" ");
    btn.innerHTML = `
      <span class="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
        ${cat}
      </span>
      <span class="text-xs opacity-70">${folderCount(cat)}</span>
    `;
    btn.addEventListener("click", () => {
      activeFolder = cat;
      currentIndex = 0;
      renderAll();
    });
    folderListEl.appendChild(btn);
  }
}

function renderVideoList(): void {
  videoListEl.innerHTML = "";
  const list = filteredFilms();
  list.forEach((f, i) => {
    const active = i === currentIndex;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-selected", String(active));
    btn.className = [
      "flex shrink-0 items-center gap-2 rounded-md border p-1.5 pr-3 text-left text-sm transition-colors lg:w-full",
      active
        ? "border-amber bg-amber/10 text-paper"
        : "border-transparent text-paper-dim hover:border-ink-2 hover:text-paper",
    ].join(" ");
    btn.innerHTML = `
      <img src="${f.poster}" alt="" class="h-9 w-14 shrink-0 rounded object-cover" loading="lazy" />
      <span class="min-w-0">
        <span class="block truncate font-medium">${f.title}</span>
        <span class="block truncate text-xs opacity-70">${f.director} · ${f.year}</span>
      </span>
    `;
    btn.addEventListener("click", () => {
      currentIndex = i;
      renderAll();
    });
    videoListEl.appendChild(btn);
  });
}

function renderStage(): void {
  const list = filteredFilms();
  const cur = currentFilm();
  const prev = prevFilm();
  const next = nextFilm();

  videoCountEl.textContent = `Küratörlü arşiv · ${list.length} film`;

  mainCat.textContent = `${cur.category} · ${cur.year}`;
  mainTitle.textContent = cur.title;
  mainMeta.textContent = `${cur.director} · ${cur.runtime}`;
  mainSynopsis.textContent = cur.synopsis;

  if (mainVideo.getAttribute("src") !== cur.video) {
    mainVideo.pause();
    mainVideo.src = cur.video;
    mainVideo.poster = cur.poster;
    mainVideo.load();
  }

  prevVideo.src = prev.video;
  prevVideo.poster = prev.poster;
  prevTitle.textContent = prev.title;

  nextVideo.src = next.video;
  nextVideo.poster = next.poster;
  nextTitle.textContent = next.title;

  document
    .querySelector<HTMLButtonElement>("#prev-preview")!
    .setAttribute("aria-label", `Önceki video: ${prev.title}`);
  document
    .querySelector<HTMLButtonElement>("#next-preview")!
    .setAttribute("aria-label", `Sonraki video: ${next.title}`);
}

function renderAll(): void {
  renderFolders();
  renderVideoList();
  renderStage();
}

function goPrev(): void {
  const list = filteredFilms();
  currentIndex = ((currentIndex - 1) % list.length + list.length) % list.length;
  renderAll();
}

function goNext(): void {
  const list = filteredFilms();
  currentIndex = (currentIndex + 1) % list.length;
  renderAll();
}

document.querySelector<HTMLButtonElement>("#prev-btn")!.addEventListener("click", goPrev);
document.querySelector<HTMLButtonElement>("#next-btn")!.addEventListener("click", goNext);
document.querySelector<HTMLButtonElement>("#prev-preview")!.addEventListener("click", goPrev);
document.querySelector<HTMLButtonElement>("#next-preview")!.addEventListener("click", goNext);
document.querySelector<HTMLButtonElement>("#prev-preview-m")!.addEventListener("click", goPrev);
document.querySelector<HTMLButtonElement>("#next-preview-m")!.addEventListener("click", goNext);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goPrev();
  if (e.key === "ArrowRight") goNext();
});

/* Başlat */
renderAll();
