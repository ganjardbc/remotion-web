# Struktur file video

Aturan baku isi folder `src/videos/<Nama>/`. Berlaku untuk semua Reels baru (Format A dan C) dengan narator Claude Code, dan carousel baru (Format B dan C). Nama file harus persis seperti di bawah, tanpa variasi. Rujukan Reels: `src/videos/PromptPanjang`. Rujukan carousel: `src/videos/ModelMurah`.

Ada tiga jenis folder: **Reels** (narator Claude Code, 9:16), **video dialog** (Ganjar dan Claude, kamera 2D, 16:9, dibuat dengan `scripts/new-video.mjs`), dan **carousel**. Satu folder boleh memuat Reels dan carousel untuk topik yang sama, tapi tidak boleh mencampur Reels dengan video dialog.

## Nama

| Hal | Aturan | Contoh |
|---|---|---|
| Folder | PascalCase, 1-3 kata dari judul, tanpa angka urut atau kata sambung | `PromptPanjang`, bukan `PromptPanjangItuTandaMalas` |
| Id komposisi Reels | `<Nama>-Reels` | `PromptPanjang-Reels` |
| Id komposisi video dialog | `<Nama>` (tanpa akhiran) | `VueTutorial` |
| Id komposisi carousel | `<Nama>-Carousel` | `ModelMurah-Carousel` |
| Hasil render | `out/<Nama>-Reels.mp4`, `out/<Nama>-Carousel/` | |
| Id scene | huruf kecil, satu kata, Bahasa Indonesia atau istilah format | `hook`, `relate`, `shift`, `urgency`, `cara`, `closing`, `cta` |
| Komponen scene | `<Id>Scene`, huruf pertama id dikapitalkan | `HookScene`, `CaraScene` |

Untuk Format A, id scene wajib memuat `hook`, `relate`, `shift`, `urgency`, `closing`, `cta` (urutan itu). Scene tambahan disisipkan di antaranya dengan id satu kata (contoh `cara` di PromptPanjang).

## Reels: isi folder

```
src/videos/<Nama>/
  README.md
  <Nama>Video.tsx
  config.ts
  scenes.tsx
  parts.tsx
  voiceover.json
  voiceover-files.ts
  voiceover/<id-scene>.mp3
```

Hanya berkas itu. Tidak boleh ada berkas lain: tidak ada satu berkas per scene (`HookScene.tsx`), `scenes.ts`, `scene.tsx`, `shared.tsx`, `visuals.tsx`, `voiceover.ts`, `Sfx.tsx`, atau sejenisnya. Komponen tambahan masuk `parts.tsx`.

**Tidak boleh mengimpor dari folder video lain** (`../<NamaLain>/...`). Yang dipakai lebih dari satu video dipindah ke `src/`: gerak bersama (`Enter`, `Pop`, `useSpringIn`, `shakeX`) ada di `src/motion.tsx`, footer di `src/BrandFooter.tsx`, latar di `src/Backdrop.tsx`. Impor dari `../../motion`.

### `config.ts`

Satu-satunya sumber teks dan waktu. Ekspor dengan nama persis ini:

- `FPS` (30), `LEAD` (jeda frame sebelum suara mulai), `TAIL` dan `CHARS_PER_SEC` (lokal, tidak diekspor).
- `SCENE_IDS` (`as const`) dan `type SceneId`.
- `SPOKEN: Record<SceneId, string>`: teks yang diucapkan. Singkatan Inggris ditulis fonetis ("Ei Ai").
- `CAPTION` dan `HASHTAGS` (tepat 5, set baku).
- `VO`: dari `voiceover.json` + `VO_FILES`; kalau klip belum ada, `file: null` dan durasi diperkirakan dari `CHARS_PER_SEC`.
- `at(id, frasa)`: detik sejak suara mulai saat frasa diucapkan.
- `SCENE_FRAMES`, `SCENE_START`, `TOTAL_FRAMES`, `MUSIC_FILE`.

Data khusus video (contoh `REPO_URL`) juga di sini.

### `scenes.tsx`

Satu `export const <Id>Scene: React.FC` per id, urut sesuai `SCENE_IDS`, tiap scene diawali komentar `// ---------- <n>. <Nama> ----------`. Cue ditulis sebagai frasa dari `SPOKEN` lewat `useCue(id).when(frasa)` (perkiraan dari posisi huruf). Boleh juga berupa detik dari timestamp kata ElevenLabs (scribe) kalau sudah diukur dari audio asli, karena lebih akurat; Haiku55 dan ModelTeam memakai cara ini. Kalau `SPOKEN` berubah, ukur ulang cue scene itu.

### `parts.tsx`

Komponen dan helper bersama untuk scene video ini: `cue`, `useCue`, `Frame`, `Headline`, `Accent`, `Chip`, `Card`, dan lain-lain. Disalin dari video rujukan, lalu disesuaikan.

### `<Nama>Video.tsx`

Mengekspor `<Nama>Video: React.FC<{ theme: string }>` dan meneruskan `TOTAL_FRAMES`. Isinya, berurutan: `Series` scene (peta `SCENES` dari id ke komponen), `Character` (Claude Code, ekspresi per scene di `FACES`), `BrandFooter` sekali di root, `Sound` (VO per scene di `SCENE_START + LEAD`, whoosh di awal scene, musik latar).

### `README.md`

Bagian wajib, urut: judul `# <Nama>` dan satu paragraf (judul konten, format, jumlah scene, id komposisi, sudut pandang, narator), daftar berkas, `## Voiceover` (status, suara, model, speed, perintah olah ulang), perintah render, `## Caption` (caption dan 5 hashtag).

### Voiceover

- ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2. Satu klip per scene, id klip = id scene.
- Klip mentah di `out/vo-raw/<Nama>/<id>.mp3` (tidak di-commit). Olah dengan `node scripts/vo-process.mjs <id> out/vo-raw/<Nama>/<id>.mp3 --hash <hash> --video <Nama>`.
- `voiceover.json` dimulai `{ "lines": {} }`. `voiceover-files.ts` dan folder `voiceover/` ditulis oleh `vo-process.mjs` saat klip pertama diolah, jadi untuk video yang belum bersuara folder `voiceover/` belum ada dan itu sah. Jangan diubah tangan.
- `scripts/vo-lines.mjs` dan `vo-generate.mjs` belum mendukung pola ini (masih membaca `voiceover.ts` dan `BASE_SCENES` pola VueTutorial).

## Video dialog: isi folder

Dibuat dengan `node scripts/new-video.mjs <Nama> "<Judul>"`. Jangan buat folder dengan tangan.

```
src/videos/<Nama>/
  README.md
  <Nama>Video.tsx       TransitionSeries scene, ekspor <NAMA>_FRAMES
  scenes.tsx            data scene (SCENES): seconds, time, shots, actors, lines, inserts
  SceneRenderer.tsx     disalin dari VueTutorial
  world.tsx             disalin dari VueTutorial (ruang kerja, CAM, Keyed)
  cards.tsx             disalin dari VueTutorial
  sfxTypes.ts           disalin dari VueTutorial
  <Nama>Sfx.tsx         efek suara dan musik, dibuat otomatis dari data scene
  voiceover.ts          disalin dari VueTutorial (suara Ari Eko untuk Ganjar, Nilasari untuk Claude, eleven_v4)
  voiceover.json
  voiceover-files.ts
  voiceover/<id-baris>.mp3
```

- Id baris voiceover = id scene + nomor urut dua angka (`hook-01`). Klip mentah di `out/vo-raw/<id>.mp3`, olah dengan `vo-process.mjs ... --video <Nama>`.
- Daftar dan status baris: `node scripts/vo-lines.mjs --video <Nama>`; yang perlu di-generate: tambahkan `--pending`.
- README memuat struktur, cara mengubah scene, dan alur voiceover (lihat `src/videos/VueTutorial/README.md`).
- Komposisi: `fps={30} width={1920} height={1080}`, id `<Nama>`.
- Berkas umum disalin dari VueTutorial setiap kali video baru dibuat, jadi perubahan pada berkas itu cukup dilakukan di VueTutorial, lalu video dialog lama disalin ulang bila perlu.
- Pengecualian: VueTutorial sendiri memakai nama `VueSfx.tsx` (bukan `VueTutorialSfx.tsx`) dan `VUE_TUTORIAL_FRAMES`. Itu sumber salinan, jangan diganti nama.

## Carousel: isi folder

```
src/videos/<Nama>/
  carousel.content.ts     ekspor CAROUSEL: CarouselSpec
  <Nama>Carousel.tsx      ekspor <Nama>Carousel dan <NAMA>_CAROUSEL_SLIDES
```

Aturan isi dan tampilan ada di [carousel.md](carousel.md). Kalau satu topik punya Reels dan carousel, keduanya berbagi folder yang sama.

## Mendaftarkan

Impor di `src/Root.tsx` sebagai `import { <Nama>Video, TOTAL_FRAMES as <NAMA>_FRAMES } from "./videos/<Nama>/<Nama>Video";`, lalu `<Composition id="<Nama>-Reels" ... fps={30} width={1080} height={1920} defaultProps={{ theme: "gh" }} />`.

## Status kepatuhan (3 November 2026)

Sesuai aturan: PromptPanjang, ClaudeMem, ReviewKodeAI, Haiku55, ModelTeam (Reels); ModelMurah, JuniorHilang (carousel); VueTutorial (dialog, kecuali nama Sfx di atas).

Dihapus 3 November 2026 karena tidak dipakai: AgenBodoh (Reels dan carousel), ClaudeMd, GratisMurah, OpenCode9Router, AIAgent, ClaudeLoop, FileDibajak, IzinPagar, PenulisUI, SejarahAI, SejarahAIV2, TigaFrameworkFrontend, TokenTips.

DraftKit (mesin Reels dari data, dipakai juga oleh carousel) dipindah ke `src/draft-kit/` pada 3 November 2026 dan bukan folder video lagi.

Belum sesuai, masih dipertahankan: ChatbotVsAIAgentPahamiBedanya, KurikulumAIEngineerGratis542PelajaranDar, ProgrammerBodoh, SejarahAIStory, SejarahAIStoryReels (pola menengah dengan `voiceover.ts` dan `scenes.ts`). Video yang belum sesuai juga belum punya `CAPTION` dan `HASHTAGS`.

`scripts/vo-lines.mjs` dan `vo-generate.mjs` hanya mendukung pola video dialog (membaca `voiceover.ts` dan `BASE_SCENES`). Untuk Reels, generate dan olah klip lewat konektor ElevenLabs dan `vo-process.mjs` secara manual.
