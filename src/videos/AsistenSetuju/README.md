# AsistenSetuju

"Asisten yang Selalu Setuju": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Relate, Shift, Urgency, Cara, Closing, Cta), tuntas dalam satu video, dialog ganjar, claudecode. Komposisi `AsistenSetuju-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter.

Sudut: AI yang tidak pernah membantah bukan rekan kerja, hanya cermin. Solusinya praktis: minta dia mencari alasan idemu salah. Kalimat quote: "Asisten yang selalu setuju cuma mengulang suaramu."

- `config.ts`: `META` (sorotan oranye "Selalu Setuju"), `VO_SETTINGS`, `VO_MANIFEST`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `AsistenSetujuVideo.tsx`: memanggil mesin `src/block-reels`, durasi scene mengikuti voiceover (`fitBlockScenes`).
- `voiceover.json`, `voiceover-files.ts`, `voiceover/`: klip dan catatan hash. Dibuat otomatis oleh `scripts/vo-generate.mjs` dan `scripts/vo-process.mjs`, jangan diubah tangan.

## Alur scene

| Scene | Isi | Shot kunci |
|---|---|---|
| hook | Ganjar mau simpan password di file teks, Claude Code langsung setuju: "Ide bagus. Kubuatkan sekarang." | wide, medium, dutch, closeUp |
| relate | Dua minggu Claude Code tidak pernah bilang tidak, termasuk soal variabel global: "Itu terutama." | medium, overShoulder, closeUp |
| shift | Dia cuma mengiyakan, bukan menilai: "Dengan indentasi yang benar." | medium, wide, closeUp, highAngle |
| urgency | "Dan itu baru separuh masalahnya." | medium + push |
| cara | Minta AI mencari alasan ide salah: "Tiga. Bocor lewat git, backup, dan log." | medium, closeUp, wide |
| closing | Kalimat quote | closeUp + push |
| cta | Follow untuk prompt yang memaksa AI membantah | medium |

Semua scene memakai latar `kantor` (malam). Peringatan "latar sama dengan scene sebelumnya" dari `validate:structure` memang disengaja, variasi visual datang dari shot, ekspresi, dan gesture.

## Efek suara

Whoosh antar scene, pop tiap baris, dan `sfx` per baris di `scenes.ts`: record scratch di "Serius itu bagus?", ding di "Tiga.", ba dum tss di "Dengan indentasi yang benar." Belum ada musik.

## Voiceover

ElevenLabs `eleven_v4` (tanpa speed), tag emosi per baris di `scenes.ts`. Ganjar = Ari Eko, Claude Code = Nilasari (`src/dialog-reels/voices.json`). 18 klip (`hook-01` ... `cta-01`), id = id scene + nomor urut, sekitar 858 huruf. Durasi baris dan scene mengikuti audio. Loudness klip -15,9 sampai -18,2 LUFS, puncak di bawah -1,7 dBFS. Cek dan olah ulang: `node scripts/vo-lines.mjs --video AsistenSetuju`, `node scripts/vo-generate.mjs --video AsistenSetuju [--only id]`. Bila teks, tag, atau suara berubah, geser ulang `at` sfx dan `shot`.

```bash
npx remotion still src/index.ts AsistenSetuju-Reels out/still/AsistenSetuju.png --frame=30
npx remotion render src/index.ts AsistenSetuju-Reels out/AsistenSetuju-Reels.mp4
```

## Caption

AI-mu selalu bilang 'ide bagus'? Itu bukan tanda idemu bagus. Minta dia membantah, baru kamu tahu isinya.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`

## Prompt untuk CTA

CTA di scene terakhir menjanjikan "prompt yang memaksa AI membantahku". Bagikan lewat komentar tersemat, balasan DM, atau slide lanjutan. Tempel di awal sesi, atau simpan di `CLAUDE.md`.

```text
Sebelum mengerjakan apa pun yang kuminta, jadilah penentang pertama untuk ideku.

1. Sebutkan 3 alasan terkuat kenapa idenya bisa salah, berisiko, atau kalah dari alternatif. Spesifik ke kasusku, bukan nasihat umum.
2. Tandai asumsi yang kuambil tanpa bukti.
3. Tawarkan satu alternatif yang lebih aman, dan jelaskan harga yang kubayar kalau memilihnya.
4. Tanyakan: lanjut dengan ideku, atau pakai alternatif? Jangan mengerjakan apa pun sebelum aku menjawab.

Jangan memuji dulu dan jangan setuju supaya aku senang. Kalau idenya memang bagus, tunjukkan apa yang sudah kamu coba bantah dan kenapa tidak berhasil.
```

Versi pendek (untuk satu pesan): "Jangan langsung kerjakan. Cari 3 alasan kenapa ideku ini salah, tandai asumsiku, lalu tawarkan alternatif. Baru tanya aku mau lanjut yang mana."
