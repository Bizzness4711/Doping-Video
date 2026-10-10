import "./style.css";

/* Siyah zeminli sade sayfa:
   sol = klasör akordiyonu (klasör → alt klasör → dosyalar),
   orta = seçili dosya (video / PDF / fotoğraf),
   yanlar = mini önizleme + yön tuşları.
   Liste public/videos.json dosyasından gelir, isim uydurulmaz. */

type Item = { file: string; kind: "video" | "pdf" | "image" | "file"; url: string };
type Section = { path: string[]; items: Item[] };
type Folder = { name: string; items: Item[]; subs: Sub[] };
type Sub = { name: string; items: Item[]; subs: Sub[] };
type Manifest = { base: string; folders: Folder[] };

document.body.style.background = "#000";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div class="flex min-h-screen bg-black text-neutral-300">
    <aside class="flex w-44 shrink-0 flex-col overflow-y-auto border-r border-neutral-800 sm:w-56" aria-label="Klasör ve dosya seçimi">
      <div id="folder-list" class="max-h-screen overflow-y-auto"></div>
    </aside>

    <main class="flex min-w-0 flex-1 items-center justify-center gap-1 p-2 sm:gap-3 sm:p-4">
      <button id="prev-btn" type="button" aria-label="Önceki"
        class="shrink-0 px-1 text-4xl leading-none text-neutral-500 hover:text-white">‹</button>

      <button id="prev-preview" type="button" class="w-24 shrink-0 sm:w-36" aria-label="Önceki">
        <span id="prev-thumb" class="relative block aspect-square overflow-hidden border border-neutral-400"></span>
        <span id="prev-title" class="mt-1 block truncate text-xs text-neutral-500"></span>
      </button>

      <div class="min-w-0 flex-1">
        <div id="stage" class="border border-neutral-400 bg-black"></div>
        <p id="main-title" class="mt-1 truncate text-center text-sm text-neutral-400"></p>
      </div>

      <button id="next-preview" type="button" class="w-24 shrink-0 sm:w-36" aria-label="Sonraki">
        <span id="next-thumb" class="relative block aspect-square overflow-hidden border border-neutral-400"></span>
        <span id="next-title" class="mt-1 block truncate text-xs text-neutral-500"></span>
      </button>

      <button id="next-btn" type="button" aria-label="Sonraki"
        class="shrink-0 px-1 text-4xl leading-none text-neutral-500 hover:text-white">›</button>
    </main>
  </div>
`;

let manifest: Manifest | null = null;
let openTop = "";
const openSubs = new Set<string>();
let sel = { top: "", sec: 0, idx: 0 };

const folderListEl = document.querySelector<HTMLDivElement>("#folder-list")!;
const stageEl = document.querySelector<HTMLDivElement>("#stage")!;
const mainTitle = document.querySelector<HTMLParagraphElement>("#main-title")!;
const prevThumb = document.querySelector<HTMLSpanElement>("#prev-thumb")!;
const nextThumb = document.querySelector<HTMLSpanElement>("#next-thumb")!;
const prevTitle = document.querySelector<HTMLSpanElement>("#prev-title")!;
const nextTitle = document.querySelector<HTMLSpanElement>("#next-title")!;

/* Klasörü düz bölümlere aç: direkt dosyalar + her alt klasör bir bölüm */
function sectionsOf(folder: Folder): Section[] {
  const out: Section[] = [];
  if (folder.items.length) out.push({ path: [], items: folder.items });
  const dig = (s: Sub, path: string[]) => {
    const p = path.concat(s.name);
    if (s.items.length) out.push({ path: p, items: s.items });
    for (const c of s.subs) dig(c, p);
  };
  for (const s of folder.subs) dig(s, []);
  return out;
}

function currentSection(): Section | null {
  const f = manifest!.folders.find((x) => x.name === sel.top);
  if (!f) return null;
  const secs = sectionsOf(f);
  return secs[sel.sec] || null;
}

function currentItem(): Item | null {
  const sec = currentSection();
  if (!sec || !sec.items.length) return null;
  return sec.items[((sel.idx % sec.items.length) + sec.items.length) % sec.items.length];
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function thumbHTML(it: Item): string {
  if (it.kind === "video")
    return `<video src="${esc(it.url)}" class="h-full w-full object-cover" muted playsinline preload="metadata"></video>
      <span class="absolute inset-0 flex items-center justify-center"><span class="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 text-lg text-neutral-200">◁</span></span>`;
  if (it.kind === "image")
    return `<img src="${esc(it.url)}" class="h-full w-full object-cover" alt="" loading="lazy" />`;
  if (it.kind === "pdf")
    return `<span class="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">PDF</span>`;
  return `<span class="flex h-full w-full items-center justify-center text-xs text-neutral-400">Dosya</span>`;
}

function stageHTML(it: Item): string {
  if (it.kind === "video")
    return `<video src="${esc(it.url)}" class="aspect-video w-full bg-black" controls playsinline preload="metadata"></video>`;
  if (it.kind === "image")
    return `<img src="${esc(it.url)}" class="max-h-[80vh] w-full bg-black object-contain" alt="${esc(it.file)}" />`;
  if (it.kind === "pdf")
    return `<iframe src="${esc(it.url)}" class="h-[80vh] w-full bg-white" title="${esc(it.file)}"></iframe>`;
  return `<a href="${esc(it.url)}" download class="block p-10 text-center text-sm text-neutral-300 underline">İndir: ${esc(it.file)}</a>`;
}

function fileButton(top: string, sec: number, idx: number, it: Item): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = it.file;
  btn.setAttribute("role", "option");
  const active = sel.top === top && sel.sec === sec && sel.idx === idx;
  btn.setAttribute("aria-selected", String(active));
  btn.className = [
    "block w-full truncate border-b border-neutral-800 px-3 py-2 text-left text-sm",
    active ? "text-white" : "text-neutral-500 hover:text-neutral-200",
  ].join(" ");
  btn.addEventListener("click", () => {
    sel = { top, sec, idx };
    renderAll();
  });
  return btn;
}

function renderFolders(): void {
  folderListEl.innerHTML = "";
  for (const folder of manifest!.folders) {
    const open = folder.name === openTop;
    const topBtn = document.createElement("button");
    topBtn.type = "button";
    topBtn.textContent = folder.name;
    topBtn.setAttribute("aria-expanded", String(open));
    topBtn.className = [
      "block w-full truncate border-b border-neutral-700 px-3 py-2 text-left text-sm font-semibold",
      open ? "text-white" : "text-neutral-400 hover:text-neutral-100",
    ].join(" ");
    topBtn.addEventListener("click", () => {
      openTop = open ? "" : folder.name;
      renderAll();
    });
    folderListEl.appendChild(topBtn);
    if (!open) continue;

    const secs = sectionsOf(folder);
    secs.forEach((sec, si) => {
      if (sec.path.length) {
        const key = folder.name + "/" + sec.path.join("/");
        const subOpen = openSubs.has(key);
        const subBtn = document.createElement("button");
        subBtn.type = "button";
        subBtn.textContent = (subOpen ? "− " : "+ ") + sec.path[sec.path.length - 1];
        subBtn.setAttribute("aria-expanded", String(subOpen));
        subBtn.style.paddingLeft = `${0.75 + sec.path.length * 0.5}rem`;
        subBtn.className = "block w-full truncate border-b border-neutral-800 py-2 pr-2 text-left text-[13px] text-neutral-400 hover:text-neutral-100";
        subBtn.addEventListener("click", () => {
          if (subOpen) openSubs.delete(key);
          else openSubs.add(key);
          renderAll();
        });
        folderListEl.appendChild(subBtn);
        if (!subOpen) return;
      }
      sec.items.forEach((it, ii) => {
        const b = fileButton(folder.name, si, ii, it);
        b.style.paddingLeft = `${0.75 + (sec.path.length + 1) * 0.5}rem`;
        folderListEl.appendChild(b);
      });
    });
  }
}

function renderStage(): void {
  const sec = currentSection();
  const cur = currentItem();
  if (!sec || !cur) {
    stageEl.innerHTML = `<p class="p-10 text-center text-sm text-neutral-500">Seçili dosya yok.</p>`;
    mainTitle.textContent = "";
    return;
  }
  stageEl.innerHTML = stageHTML(cur);
  mainTitle.textContent = cur.file;

  const prev = sec.items[((sel.idx - 1) % sec.items.length + sec.items.length) % sec.items.length];
  const next = sec.items[(sel.idx + 1) % sec.items.length];
  prevThumb.innerHTML = thumbHTML(prev);
  nextThumb.innerHTML = thumbHTML(next);
  prevTitle.textContent = prev.file;
  nextTitle.textContent = next.file;
}

function renderAll(): void {
  renderFolders();
  renderStage();
}

function go(d: 1 | -1): void {
  const sec = currentSection();
  if (!sec) return;
  sel.idx = ((sel.idx + d) % sec.items.length + sec.items.length) % sec.items.length;
  renderAll();
}

document.querySelector<HTMLButtonElement>("#prev-btn")!.addEventListener("click", () => go(-1));
document.querySelector<HTMLButtonElement>("#next-btn")!.addEventListener("click", () => go(1));
document.querySelector<HTMLButtonElement>("#prev-preview")!.addEventListener("click", () => go(-1));
document.querySelector<HTMLButtonElement>("#next-preview")!.addEventListener("click", () => go(1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
});

fetch("./videos.json")
  .then((r) => {
    if (!r.ok) throw new Error("videos.json yok");
    return r.json() as Promise<Manifest>;
  })
  .then((m) => {
    manifest = m;
    if (m.folders.length) {
      openTop = m.folders[0].name;
      const secs = sectionsOf(m.folders[0]);
      sel = { top: openTop, sec: 0, idx: 0 };
      if (secs.length && secs[0].path.length)
        openSubs.add(openTop + "/" + secs[0].path.join("/"));
    }
    renderAll();
  })
  .catch(() => {
    stageEl.innerHTML = `<p class="p-10 text-center text-sm text-neutral-500">Liste yüklenemedi (videos.json).</p>`;
  });
