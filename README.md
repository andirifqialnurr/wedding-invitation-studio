# Wedding Invitation Studio

Showcase undangan pernikahan interaktif untuk Nara & Raka dengan sepuluh arah visual:

- Botanical
- Modern
- Film
- Paper
- Quiet
- Aurora
- Atlas
- Luna
- Gallery
- Orbit

Lima template pertama berada di **Editorial collection**. Lima template terakhir
berada di **Grand modern collection** dan memiliki struktur konten yang berbeda:
gallery, itinerary, destination map, chronicle, programme, dan cinematic note.

Halaman utama juga memiliki carousel template besar dengan preview kiri/kanan,
next/previous navigation, dot navigation, dan metadata koleksi.

## Menjalankan secara lokal

Prasyarat: Node.js 22 atau lebih baru.

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan oleh Vite. Source utama berada di:

- `app/page.tsx` — komponen, konten, state, countdown, selector tema, dan RSVP modal.
- `app/globals.css` — seluruh sistem visual, layout, responsive rules, dan animasi.
- `app/layout.tsx` — metadata halaman.

## Mengganti konten

Cari data `themes`, `timeline`, nama pasangan, tanggal, lokasi, dan teks RSVP di
`app/page.tsx`. Ganti nilai-nilainya, lalu sesuaikan warna tema di array `themes`.

## Build produksi

```bash
npm run build
```

Folder `node_modules`, `.next`, `.sites-runtime`, dan metadata Git tidak diperlukan
untuk source code aplikasi dan sengaja tidak disertakan dalam paket source.
