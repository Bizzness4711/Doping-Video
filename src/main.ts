import "./style.css";

/* Siyah zeminli sade video sayfası (eskizdeki gibi):
   sol = klasör + video listesi, orta = büyük video,
   yanlar = mini önizleme + yön tuşları. Başka hiçbir şey yok. */

type Film = {
  title: string;
  category: "Animasyon" | "Bilim Kurgu" | "Fantastik" | "Belgesel";
  video: string;
  poster: string;
};

const FILMS: Film[] = [
  {
    title: "Sintel",
    category: "Fantastik",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
  },
  {
    title: "Tears of Steel",
    category: "Bilim Kurgu",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
  },
  {
    title: "Big Buck Bunny",
    category: "Animasyon",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  },
  {
    title: "Elephants Dream",
    category: "Fantastik",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
  },
  {
    title: "For Bigger Blazes",
    category: "Bilim Kurgu",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
  },
  {
    title: "Substitute Communication",
    category: "Belgesel",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
  },
  {
    title: "Volkswagen GTI Review",
    category: "Belgesel",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg",
  },
  {
    title: "We Are Going On Bullrun",
    category: "Belgesel",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
  },
];

const FOLDERS = ["Tümü", "Animasyon", "Bilim Kurgu", "Fantastik", "Belgesel"] as const;

document.body.style.background = "#000";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div class="flex min-h-screen bg-black text-neutral-300">
    <!-- SOL: klasör + video seçimi -->
    <aside class="w-44 shrink-0 border-r border-neutral-800 sm:w-56" aria-label="Klasör ve video seçimi">
      <div id="folder-list"></div>
      <div class="border-t border-neutral-700"></div>
      <div id="video-list" role="listbox" aria-label="Video listesi"></div>
    </aside>

    <!-- ORTA: mini + video + mini + oklar -->
    <main class="flex min-w-0 flex-1 items-center justify-center gap-1 p-2 sm:gap-3 sm:p-4">
      <button id="prev-btn" type="button" aria-label="Önceki video"
        class="shrink-0 px-1 text-4xl leading-none text-neutral-500 hover:text-white">‹</button>

      <button id="prev-preview" type="button" class="w-24 shrink-0 sm:w-36" aria-label="Önceki video">
        <span class="relative block aspect-square overflow-hidden border border-neutral-400">
          <img id="prev-img" class="h-full w-full object-cover" alt="" />
          <span class="absolute inset-0 flex items-center justify-center">
            <span class="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 text-lg text-neutral-200">◁</span>
          </span>
        </span>
        <span id="prev-title" class="mt-1 block truncate text-xs text-neutral-500"></span>
      </button>

      <div class="min-w-0 flex-1">
        <div class="border border-neutral-400 bg-black">
          <video id="main-video" class="aspect-square w-full bg-black" controls playsinline preload="metadata"></video>
        </div>
        <p id="main-title" class="mt-1 truncate text-center text-sm text-neutral-400"></p>
      </div>

      <button id="next-preview" type="button" class="w-24 shrink-0 sm:w-36" aria-label="Sonraki video">
        <span class="relative block aspect-square overflow-hidden border border-neutral-400">
          <img id="next-img" class="h-full w-full object-cover" alt="" />
          <span class="absolute inset-0 flex items-center justify-center">
            <span class="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 text-lg text-neutral-200">▷</span>
          </span>
        </span>
        <span id="next-title" class="mt-1 block truncate text-xs text-neutral-500"></span>
      </button>

      <button id="next-btn" type="button" aria-label="Sonraki video"
        class="shrink-0 px-1 text-4xl leading-none text-neutral-500 hover:text-white">›</button>
    </main>
  </div>
`;

let activeFolder: string = "Tümü";
let currentIndex = 0;

function filteredFilms(): Film[] {
  return activeFolder === "Tümü" ? FILMS : FILMS.filter((f) => f.category === activeFolder);
}

function at(list: Film[], i: number): Film {
  return list[((i % list.length) + list.length) % list.length];
}

const folderListEl = document.querySelector<HTMLDivElement>("#folder-list")!;
const videoListEl = document.querySelector<HTMLDivElement>("#video-list")!;
const mainVideo = document.querySelector<HTMLVideoElement>("#main-video")!;
const mainTitle = document.querySelector<HTMLParagraphElement>("#main-title")!;
const prevImg = document.querySelector<HTMLImageElement>("#prev-img")!;
const nextImg = document.querySelector<HTMLImageElement>("#next-img")!;
const prevTitle = document.querySelector<HTMLSpanElement>("#prev-title")!;
const nextTitle = document.querySelector<HTMLSpanElement>("#next-title")!;

function renderFolders(): void {
  folderListEl.innerHTML = "";
  for (const folder of FOLDERS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = folder;
    btn.setAttribute("aria-pressed", String(folder === activeFolder));
    btn.className = [
      "block w-full truncate border-b border-neutral-800 px-3 py-2 text-left text-sm",
      folder === activeFolder ? "text-white" : "text-neutral-500 hover:text-neutral-200",
    ].join(" ");
    btn.addEventListener("click", () => {
      activeFolder = folder;
      currentIndex = 0;
      renderAll();
    });
    folderListEl.appendChild(btn);
  }
}

function renderVideoList(): void {
  videoListEl.innerHTML = "";
  filteredFilms().forEach((f, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = f.title;
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-selected", String(i === currentIndex));
    btn.className = [
      "block w-full truncate border-b border-neutral-800 px-3 py-2 text-left text-sm",
      i === currentIndex ? "text-white" : "text-neutral-500 hover:text-neutral-200",
    ].join(" ");
    btn.addEventListener("click", () => {
      currentIndex = i;
      renderAll();
    });
    videoListEl.appendChild(btn);
  });
}

function renderStage(): void {
  const list = filteredFilms();
  const cur = at(list, currentIndex);
  const prev = at(list, currentIndex - 1);
  const next = at(list, currentIndex + 1);

  if (mainVideo.getAttribute("src") !== cur.video) {
    mainVideo.pause();
    mainVideo.src = cur.video;
    mainVideo.poster = cur.poster;
    mainVideo.load();
  }
  mainTitle.textContent = cur.title;

  prevImg.src = prev.poster;
  prevTitle.textContent = prev.title;
  nextImg.src = next.poster;
  nextTitle.textContent = next.title;
}

function renderAll(): void {
  renderFolders();
  renderVideoList();
  renderStage();
}

function goPrev(): void {
  currentIndex = ((currentIndex - 1) % filteredFilms().length + filteredFilms().length) % filteredFilms().length;
  renderAll();
}

function goNext(): void {
  currentIndex = (currentIndex + 1) % filteredFilms().length;
  renderAll();
}

document.querySelector<HTMLButtonElement>("#prev-btn")!.addEventListener("click", goPrev);
document.querySelector<HTMLButtonElement>("#next-btn")!.addEventListener("click", goNext);
document.querySelector<HTMLButtonElement>("#prev-preview")!.addEventListener("click", goPrev);
document.querySelector<HTMLButtonElement>("#next-preview")!.addEventListener("click", goNext);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goPrev();
  if (e.key === "ArrowRight") goNext();
});

renderAll();
