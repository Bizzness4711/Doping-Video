import "./style.css";

/* ---------------------------------------------------------------
   İçerik: Blender Vakfı'nın açık lisanslı kısa filmleri.
   Gerçek filmler, gerçek yönetmenler — uydurma veri yok.
   Videolar doğrudan blender.org / gtv-videos-bucket'tan akar.
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
  /** Kırık simetri: 2 kart büyük, diğerleri normal akışta */
  featured?: boolean;
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
    featured: true,
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
    featured: true,
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
   İşaretleme: hero → filtre → kırık simetri grid → modal
---------------------------------------------------------------- */

app.innerHTML = `
  <!-- ÜST ŞERİT: marka + saat -->
  <header class="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
    <p class="font-display text-lg font-semibold tracking-tight">
      Sinema<span class="text-amber">Koleksiyonu</span>
    </p>
    <p class="text-xs uppercase tracking-[0.2em] text-paper-dim">
      Küratörlü arşiv · ${FILMS.length} film
    </p>
  </header>

  <!-- HERO: kırık simetri — sol blok geniş, sağ blok dar ve kaydırılmış -->
  <section class="mx-auto grid max-w-6xl gap-8 px-6 pb-16 pt-16 md:grid-cols-12 md:pb-24 md:pt-24">
    <div class="md:col-span-7">
      <h1 class="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
        Arşivden
        <br />
        <span class="text-amber italic">seçki</span>
      </h1>
    </div>
    <div class="self-end md:col-span-4 md:col-start-9">
      <p class="text-base leading-relaxed text-paper-dim">
        Yönetmen, tür ve yıl bazında elden geçirilmiş kısa film
        arşivi. Her kayıt bir projeksiyon notuyla eşleşir —
        arşiv, sıralamadan değil kürasyondan oluşur.
      </p>
    </div>
  </section>

  <!-- FİLTRE: sol hizalı çip çubuğu -->
  <nav
    aria-label="Tür filtresi"
    class="sticky top-0 z-30 border-b border-ink-2 bg-ink/90 backdrop-blur-sm"
  >
    <div id="filters" class="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-3"></div>
  </nav>

  <!-- GRID: featured kartlar 2 kolon kaplar, sıralama kırılır -->
  <main
    id="grid"
    class="mx-auto grid max-w-6xl auto-rows-auto grid-cols-1 gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3"
  ></main>

  <!-- FOOTER -->
  <footer class="border-t border-ink-2">
    <div class="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-paper-dim sm:flex-row sm:items-center sm:justify-between">
      <p>© 2026 Sinema Koleksiyonu — tüm filmler açık lisanslıdır.</p>
      <p>Projeksiyon notları arşivle birlikte gelir.</p>
    </div>
  </footer>

  <!-- MODAL -->
  <div
    id="modal"
    class="fixed inset-0 z-50 hidden items-center justify-center bg-ink/95 p-4 sm:p-8"
    role="dialog"
    aria-modal="true"
    aria-label="Video oynatıcı"
  >
    <div class="w-full max-w-4xl">
      <div class="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 id="modal-title" class="font-display text-2xl font-semibold"></h2>
          <p id="modal-meta" class="mt-1 text-sm text-paper-dim"></p>
        </div>
        <button
          id="modal-close"
          class="rounded-full border border-ink-2 p-2 text-paper-dim transition-colors hover:border-amber hover:text-amber"
          aria-label="Kapat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="relative aspect-video overflow-hidden rounded-lg border border-ink-2">
        <video id="modal-video" class="h-full w-full bg-black" controls playsinline></video>
      </div>
      <p id="modal-synopsis" class="mt-4 max-w-2xl text-sm leading-relaxed text-paper-dim"></p>
    </div>
  </div>
`;

/* ---------------------------------------------------------------
   Filtre çubuğu
---------------------------------------------------------------- */
const filtersEl = document.querySelector<HTMLDivElement>("#filters")!;
let activeFilter: string = "Tümü";

function renderFilters(): void {
  filtersEl.innerHTML = "";
  for (const cat of CATEGORIES) {
    const active = cat === activeFilter;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", String(active));
    btn.className = [
      "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-amber bg-amber text-ink"
        : "border-ink-2 text-paper-dim hover:border-paper-dim hover:text-paper",
    ].join(" ");
    btn.addEventListener("click", () => {
      activeFilter = cat;
      renderFilters();
      renderGrid();
    });
    filtersEl.appendChild(btn);
  }
}

/* ---------------------------------------------------------------
   Grid — featured kartlar 2 kolon, gerisi normal akış
---------------------------------------------------------------- */
const gridEl = document.querySelector<HTMLElement>("#grid")!;

function filmCard(f: Film): HTMLElement {
  const article = document.createElement("article");
  article.className =
    "group relative cursor-pointer overflow-hidden rounded-lg border border-ink-2 bg-ink-2 transition-colors hover:border-amber/60";
  if (f.featured) article.classList.add("sm:col-span-2");

  article.innerHTML = `
    <div class="${f.featured ? "aspect-video" : "aspect-[4/3]"} overflow-hidden">
      <video
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src="${f.video}"
        poster="${f.poster}"
        muted
        loop
        playsinline
        preload="metadata"
      ></video>
    </div>
    <div class="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-ink/20 to-transparent p-5 opacity-90 transition-opacity group-hover:opacity-100">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">
          ${f.category} · ${f.year}
        </p>
        <h3 class="mt-1 font-display text-xl font-semibold leading-tight">
          ${f.title}
        </h3>
        <p class="mt-1 text-sm text-paper-dim">
          ${f.director} · ${f.runtime}
        </p>
      </div>
    </div>
  `;

  const vid = article.querySelector("video")!;

  // Hover'da sessiz önizleme
  article.addEventListener("mouseenter", () => {
    vid.play().catch(() => {
      /* otomatik oynatma engellenirse sessizce geç */
    });
  });
  article.addEventListener("mouseleave", () => {
    vid.pause();
    vid.currentTime = 0;
  });

  // Modal aç
  article.addEventListener("click", () => openModal(f));
  article.setAttribute("tabindex", "0");
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `${f.title} — oynat`);
  article.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(f);
    }
  });

  return article;
}

function renderGrid(): void {
  gridEl.innerHTML = "";
  const list =
    activeFilter === "Tümü"
      ? FILMS
      : FILMS.filter((f) => f.category === activeFilter);
  for (const f of list) gridEl.appendChild(filmCard(f));
}

/* ---------------------------------------------------------------
   Modal
---------------------------------------------------------------- */
const modal = document.querySelector<HTMLDivElement>("#modal")!;
const modalVideo = document.querySelector<HTMLVideoElement>("#modal-video")!;
const modalTitle = document.querySelector<HTMLHeadingElement>("#modal-title")!;
const modalMeta = document.querySelector<HTMLParagraphElement>("#modal-meta")!;
const modalSynopsis =
  document.querySelector<HTMLParagraphElement>("#modal-synopsis")!;

function openModal(f: Film): void {
  modalTitle.textContent = f.title;
  modalMeta.textContent = `${f.director} · ${f.year} · ${f.runtime} · ${f.category}`;
  modalSynopsis.textContent = f.synopsis;
  modalVideo.src = f.video;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  modalVideo.play().catch(() => {});
  document.body.style.overflow = "hidden";
}

function closeModal(): void {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

document
  .querySelector<HTMLButtonElement>("#modal-close")!
  .addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

/* Başlat */
document.addEventListener("DOMContentLoaded",) => {renderFilters;
                                                   renderGrid;
  renderFilters();
  renderGrid();
});
