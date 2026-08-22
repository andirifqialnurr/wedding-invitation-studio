"use client";

import Link from "next/link";
import { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMarketplaceProduct, orderSteps, servicePackages } from "./marketplace-data";

type ThemeId = "botanical" | "modern" | "film" | "paper" | "quiet" | "aurora" | "atlas" | "luna" | "gallery" | "orbit" | "bloom" | "depth" | "garden" | "vellum" | "tide" | "curtain" | "folio" | "book" | "signal" | "gridline";
type Theme = { id: ThemeId; number: string; label: string; kicker: string; tagline: string; accent: string; soft: string; collection: "editorial" | "grand" };

const themes: Theme[] = [
  { id: "botanical", number: "01", label: "Botanical", kicker: "A garden dinner", tagline: "Soft edges, wild flowers, and a little bit of golden hour.", accent: "#b76552", soft: "#f1ded4", collection: "editorial" },
  { id: "modern", number: "02", label: "Modern", kicker: "The new chapter", tagline: "A crisp, confident invitation for a very good idea.", accent: "#c7ff4a", soft: "#d9e4ff", collection: "editorial" },
  { id: "film", number: "03", label: "Film", kicker: "A love story", tagline: "Keep the lights low. The best part is about to begin.", accent: "#ee8b55", soft: "#efc8a8", collection: "editorial" },
  { id: "paper", number: "04", label: "Paper", kicker: "A little keepsake", tagline: "Handwritten feelings, pressed petals, and room for happy tears.", accent: "#d2785b", soft: "#dce1c3", collection: "editorial" },
  { id: "quiet", number: "05", label: "Quiet", kicker: "Less, but more", tagline: "For the kind of love that never needs to raise its voice.", accent: "#8fb5ff", soft: "#dfe8f8", collection: "editorial" },
  { id: "aurora", number: "06", label: "Aurora", kicker: "A northern promise", tagline: "A luminous, immersive invitation made for a once-in-a-lifetime yes.", accent: "#8df5ff", soft: "#d8f2f0", collection: "grand" },
  { id: "atlas", number: "07", label: "Atlas", kicker: "Meet me somewhere beautiful", tagline: "A destination-led story for two people always looking for the next view.", accent: "#ffbe65", soft: "#f2e1c6", collection: "grand" },
  { id: "luna", number: "08", label: "Luna", kicker: "After dark", tagline: "A midnight ceremony, candlelight, and a little bit of cinematic magic.", accent: "#ffd28d", soft: "#e6d8e7", collection: "grand" },
  { id: "gallery", number: "09", label: "Gallery", kicker: "A living archive", tagline: "A moving collection of the people, places, and details that made us.", accent: "#d5ff89", soft: "#e5ead8", collection: "grand" },
  { id: "orbit", number: "10", label: "Orbit", kicker: "Everything led here", tagline: "A high-energy, editorial invitation built around one beautiful collision.", accent: "#c8b5ff", soft: "#e5ddf6", collection: "grand" },
  { id: "bloom", number: "11", label: "Bloom", kicker: "A garden in motion", tagline: "Watercolor petals, quiet promises, and a day worth gathering for.", accent: "#d77991", soft: "#f3d7df", collection: "grand" },
  { id: "depth", number: "12", label: "Depth", kicker: "A story in layers", tagline: "A modern invitation that opens one frame at a time.", accent: "#b8ff4d", soft: "#dbe8ff", collection: "grand" },
  { id: "garden", number: "13", label: "Petal Route", kicker: "A garden in motion", tagline: "A floral invitation carried by one winding path.", accent: "#c77484", soft: "#f3e6d9", collection: "grand" },
  { id: "vellum", number: "14", label: "Vellum", kicker: "Letters in motion", tagline: "Translucent pages, quiet overlays, and a ceremony that unfolds layer by layer.", accent: "#b78b62", soft: "#efe5d5", collection: "grand" },
  { id: "tide", number: "15", label: "Tide", kicker: "A coastal rhythm", tagline: "Rolling light, shoreline vows, and a celebration that moves like water.", accent: "#45b8a8", soft: "#d7eee9", collection: "grand" },
  { id: "curtain", number: "16", label: "Curtain Call", kicker: "A stage-lit invitation", tagline: "Velvet panels, warm footlights, and one dramatic reveal before the celebration begins.", accent: "#e0b15e", soft: "#ead7bd", collection: "grand" },
  { id: "folio", number: "17", label: "Folio Gate", kicker: "A private keepsake", tagline: "A folded architectural invitation that opens like a quiet gallery door.", accent: "#6d8f7f", soft: "#dde7dc", collection: "grand" },
  { id: "book", number: "18", label: "Paper Scatter", kicker: "Pages on the table", tagline: "Loose invitation sheets arranged like a collected story, ready to open one page at a time.", accent: "#a85f45", soft: "#ead9c5", collection: "grand" },
  { id: "signal", number: "19", label: "Signal", kicker: "A kinetic modern invitation", tagline: "Live markers, orbiting details, and tactile controls for a celebration that feels switched on.", accent: "#55f0b2", soft: "#d8eee8", collection: "grand" },
  { id: "gridline", number: "20", label: "Gridline", kicker: "A modular modern invitation", tagline: "Editorial panels, moving grids, and click-reactive cards arranged like a polished event system.", accent: "#ff715b", soft: "#e9eee8", collection: "grand" },
];

const coverThemes = themes.filter((theme) => theme.id === "curtain" || theme.id === "folio");

const timeline = [
  ["15:30", "Garden doors open", "Find a seat, take a breath, and say hello."],
  ["16:00", "The ceremony", "A short walk, a long promise, and two very happy people."],
  ["17:00", "Drinks & photographs", "Golden hour portraits with the people we love."],
  ["18:30", "Dinner under the trees", "Shared plates, a first dance, and stories until late."],
] as const;

function ThemeSelector({ active, onChange }: { active: ThemeId; onChange: (id: ThemeId) => void }) {
  return <div className="theme-selector" aria-label="Choose an invitation style"><span className="selector-label">Explore {themes.length} directions</span><div className="theme-pills">{themes.map((theme) => <span className={`theme-pill-group ${active === theme.id ? "is-active" : ""}`} key={theme.id}><button className="theme-pill" onClick={() => onChange(theme.id)} type="button"><span>{theme.number}</span> {theme.label}</button><Link className="theme-preview-link" href={`/template/${theme.id}`}>Preview</Link></span>)}</div></div>;
}

function CarouselArtwork({ theme, compact = false }: { theme: Theme; compact?: boolean }) {
  return <div className={`carousel-art art-${theme.id} ${compact ? "is-compact" : ""}`}><span className="art-number">{theme.number}</span><span className="art-symbol">{theme.id === "atlas" ? "↗" : theme.id === "luna" ? "☾" : theme.id === "orbit" ? "◎" : theme.id === "gallery" ? "▦" : theme.id === "aurora" ? "✦" : theme.id === "bloom" ? "✿" : theme.id === "depth" ? "◫" : theme.id === "garden" ? "❊" : theme.id === "vellum" ? "▱" : theme.id === "tide" ? "≈" : "N + R"}</span></div>;
}

function TemplateCarousel({ active, onChange }: { active: ThemeId; onChange: (id: ThemeId) => void }) {
  const activeIndex = themes.findIndex((theme) => theme.id === active);
  const previous = themes[(activeIndex - 1 + themes.length) % themes.length];
  const next = themes[(activeIndex + 1) % themes.length];
  const select = (theme: Theme) => onChange(theme.id);
  return <section className="template-carousel reveal is-visible" aria-label="Template carousel">
    <div className="carousel-heading"><div><p className="eyebrow">A marketplace-ready starting point</p><h2>Choose your<br /><i>first impression.</i></h2></div><p className="carousel-description">Distinct invitation directions, built with the same flexible content foundation. Swap the template, music, colors, and story later.</p></div>
    <div className="carousel-stage">
      <button className="carousel-side carousel-prev" onClick={() => select(previous)} type="button" aria-label={`Previous template: ${previous.label}`}><CarouselArtwork theme={previous} compact /><span className="side-label">← {previous.label}</span></button>
      <div className={`carousel-feature feature-${active}`}><div className="feature-art"><CarouselArtwork theme={themes[activeIndex]} /><span className="feature-glow" /></div><div className="feature-copy"><div className="feature-topline"><span>{themes[activeIndex].number} / {themes.length}</span><span className="collection-label">{themes[activeIndex].collection} collection</span></div><h3>{themes[activeIndex].label}</h3><p>{themes[activeIndex].kicker}</p><button className="feature-cta" onClick={() => (document.getElementById("invitation") ?? document.querySelector(".hero"))?.scrollIntoView({ behavior: "smooth" })} type="button">Preview template <span>↗</span></button></div></div>
      <button className="carousel-side carousel-next" onClick={() => select(next)} type="button" aria-label={`Next template: ${next.label}`}><CarouselArtwork theme={next} compact /><span className="side-label">{next.label} →</span></button>
    </div>
    <div className="carousel-controls"><button onClick={() => select(previous)} type="button" aria-label="Previous template">←</button><div className="carousel-dots">{themes.map((theme, index) => <button className={active === theme.id ? "is-active" : ""} key={theme.id} onClick={() => select(theme)} type="button" aria-label={`Go to template ${index + 1}`}><span /></button>)}</div><span className="carousel-count">{String(activeIndex + 1).padStart(2, "0")} <i>/ {themes.length}</i></span><button onClick={() => select(next)} type="button" aria-label="Next template">→</button></div>
  </section>;
}

type MarketplaceFilter = "all" | "grand" | "editorial";

function MarketplaceHeader({ musicOn, onToggleMusic }: { musicOn: boolean; onToggleMusic: () => void }) {
  return <header className="site-header marketplace-header"><a className="brand" href="#top" aria-label="Back to top"><span className="brand-mark">W<span>+</span>I</span><span className="brand-name">Wedding Invitation Market</span></a><nav className="main-nav" aria-label="Marketplace navigation"><a href="#catalog">Templates</a><a href="#packages">Paket</a><a href="#process">Cara order</a><a href="#preview">Preview</a></nav><a className="market-header-action" href="#catalog">Belanja template</a><button className={`music-toggle ${musicOn ? "is-playing" : ""}`} onClick={onToggleMusic} type="button"><span className="music-bars"><i /><i /><i /></span>{musicOn ? "Music on" : "Preview music"}</button></header>;
}

function MarketplaceHero({ theme, onChange }: { theme: Theme; onChange: (id: ThemeId) => void }) {
  const product = getMarketplaceProduct(theme.id);
  const featured = themes.filter((item) => ["aurora", "garden", "gridline", "book"].includes(item.id));
  return <section className="market-hero reveal is-visible" id="top" aria-label="Wedding invitation marketplace">
    <div className="market-hero-copy">
      <p className="eyebrow">Marketplace undangan digital</p>
      <h1>Beli template, atau pesan undangan yang dibuatkan.</h1>
      <p>Browse desain modern, preview langsung, pilih paket pengerjaan, lalu kirim brief acara. Cocok untuk pasangan, wedding planner, dan studio event.</p>
      <div className="market-hero-actions"><a className="market-primary" href="#catalog">Lihat katalog</a><Link className="market-secondary" href={`/order/${theme.id}`}>Pesan template aktif</Link></div>
      <div className="market-stats" aria-label="Marketplace highlights"><span><strong>{themes.length}</strong> template live</span><span><strong>2-7</strong> hari produksi</span><span><strong>3</strong> paket layanan</span></div>
    </div>
    <div className="market-hero-visual">
      <div className="market-device">
        <div className="market-device-top"><span>{product.badge}</span><span>{product.price}</span></div>
        <CarouselArtwork theme={theme} />
        <div className="market-device-copy"><small>{theme.number} / {theme.collection}</small><strong>{theme.label}</strong><p>{theme.tagline}</p></div>
      </div>
      <div className="market-feature-strip" aria-label="Featured templates">{featured.map((item) => <button className={theme.id === item.id ? "is-active" : ""} key={item.id} onClick={() => onChange(item.id)} type="button"><span>{item.number}</span>{item.label}</button>)}</div>
    </div>
  </section>;
}

function MarketplaceCatalog({ active, filter, onChange, onFilter }: { active: ThemeId; filter: MarketplaceFilter; onChange: (id: ThemeId) => void; onFilter: (filter: MarketplaceFilter) => void }) {
  const visibleThemes = filter === "all" ? themes : themes.filter((theme) => theme.collection === filter);
  return <section className="market-catalog reveal" id="catalog">
    <div className="market-section-head">
      <div><p className="eyebrow">Katalog template</p><h2>Pilih gaya, preview, lalu checkout.</h2></div>
      <div className="market-filter" role="group" aria-label="Filter template collection"><button className={filter === "all" ? "is-active" : ""} onClick={() => onFilter("all")} type="button">Semua</button><button className={filter === "grand" ? "is-active" : ""} onClick={() => onFilter("grand")} type="button">Grand</button><button className={filter === "editorial" ? "is-active" : ""} onClick={() => onFilter("editorial")} type="button">Editorial</button></div>
    </div>
    <div className="market-grid">{visibleThemes.map((theme) => {
      const product = getMarketplaceProduct(theme.id);
      return <article className={`market-card ${active === theme.id ? "is-active" : ""}`} key={theme.id}>
        <button className="market-card-art" onClick={() => onChange(theme.id)} type="button" aria-label={`Select ${theme.label}`}><CarouselArtwork theme={theme} compact /></button>
        <div className="market-card-body"><div className="market-card-top"><span>{theme.number}</span><b>{product.badge}</b></div><h3>{theme.label}</h3><p>{theme.tagline}</p><div className="market-card-meta"><span>{product.price}</span><span>{product.delivery}</span></div><div className="market-card-actions"><Link href={`/template/${theme.id}`}>Preview</Link><Link href={`/order/${theme.id}`}>Beli</Link></div></div>
      </article>;
    })}</div>
  </section>;
}

function MarketplacePackages() {
  return <section className="market-packages reveal" id="packages">
    <div className="market-section-head"><div><p className="eyebrow">Paket layanan</p><h2>Beli instan atau minta dibuatkan.</h2></div><p>Semua paket berangkat dari sistem template yang sama, jadi pengerjaan tetap rapi saat konten, visual, dan kebutuhan RSVP bertambah.</p></div>
    <div className="package-grid">{servicePackages.map((item) => <article className="package-card" key={item.name}><div><span>{item.timeline}</span><h3>{item.name}</h3><strong>{item.price}</strong><p>{item.copy}</p></div><ul>{item.items.map((feature) => <li key={feature}>{feature}</li>)}</ul>{item.name === "Template Ready" ? <a href="#catalog">Pilih template</a> : <Link href="/custom">Minta dibuatkan</Link>}</article>)}</div>
  </section>;
}

function MarketplaceProcess() {
  return <section className="market-process reveal" id="process"><div className="market-process-copy"><p className="eyebrow">Cara order</p><h2>Alur singkat, hasil siap sebar.</h2><p>Halaman ini disiapkan seperti marketplace: pengguna bisa memilih template sendiri atau masuk ke jalur layanan custom.</p></div><div className="process-list">{orderSteps.map(([number, title, copy]) => <div key={number}><span>{number}</span><strong>{title}</strong><p>{copy}</p></div>)}</div></section>;
}

function MarketplacePreviewIntro({ theme }: { theme: Theme }) {
  const product = getMarketplaceProduct(theme.id);
  return <section className="market-preview-intro reveal" id="preview"><div><p className="eyebrow">Live preview</p><h2>Template aktif: <i>{theme.label}</i></h2><p>{product.price} - {product.delivery}. Gunakan selector untuk mengganti preview tanpa meninggalkan halaman marketplace.</p></div><div className="market-preview-actions"><Link href={`/template/${theme.id}`}>Buka full preview</Link><Link href={`/order/${theme.id}`}>Checkout template ini</Link></div></section>;
}

function Monogram({ label = "N / R" }: { label?: string }) { return <div className="monogram">{label}</div>; }

function OpeningCover({ theme, opening, onOpen }: { theme: Theme; opening: boolean; onOpen: () => void }) {
  return <section className={`opening-cover opening-${theme.id} ${opening ? "is-opening" : ""}`} aria-label="Invitation cover">
    <div className="opening-panel opening-panel-left" />
    <div className="opening-panel opening-panel-right" />
    <button className="opening-letter" disabled={opening} onClick={onOpen} type="button" aria-label={`Open ${theme.label} invitation`}>
      <span className="opening-letter-flap" />
      <span className="opening-letter-stamp">{theme.number}</span>
      <span className="opening-letter-copy">
        <small>{theme.kicker}</small>
        <strong>Nara<br />& Raka</strong>
        <em>17 October 2026 / The Glasshouse, Ubud</em>
      </span>
      <span className="opening-letter-action">Open invitation</span>
    </button>
    <div className="opening-preview" aria-hidden="true">
      {theme.id === "curtain" ? <><span className="opening-stage-light opening-stage-light-a" /><span className="opening-stage-light opening-stage-light-b" /><span className="opening-stage-ring" /></> : <><span className="opening-paper opening-paper-a" /><span className="opening-paper opening-paper-b" /><span className="opening-paper opening-paper-c" /></>}
    </div>
  </section>;
}

const bookPages = [
  { label: "Cover", title: "Nara & Raka", kicker: "The invitation set", copy: "A gathered set of invitation pages for Saturday, 17 October 2026 at The Glasshouse, Ubud.", detail: "Tap a sheet to focus", meta: ["No. 18", "Ubud, Bali", "17.10.2026"], notes: ["Ceremony at 16:00 WITA", "Dinner and dancing after sunset", "Garden formal dress code"] },
  { label: "Chapter 01", title: "A note from us", kicker: "Somehow, it was always you.", copy: "We made this collection for the people who know our story best. The day is designed to feel slow, warm, and full of the small details that made us choose each other.", detail: "N + R / 2026", meta: ["First page", "Personal note", "Keep this date"], notes: ["Arrive with enough time for welcome drinks.", "Bring your favourite memory of us for the guest book.", "The evening will move from garden vows to a long table dinner."] },
  { label: "Chapter 02", title: "The place", kicker: "The Glasshouse, Ubud", copy: "Garden doors open at 15:30. The ceremony begins at 16:00 in the late afternoon light, followed by portraits around the courtyard and dinner under the covered terrace.", detail: "Saturday / Bali", meta: ["15:30 arrival", "16:00 vows", "The Glasshouse"], notes: ["Parking and guest drop-off are available at the front garden.", "The venue is semi-outdoor, so light layers are recommended.", "Please be seated before the processional begins."] },
  { label: "Chapter 03", title: "The programme", kicker: "Stay for every page.", copy: "The celebration moves in chapters: welcome drinks, vows, family portraits, dinner, speeches, then one long evening of music under the trees.", detail: "15:30 - late", meta: ["15:30 Welcome", "17:00 Portraits", "20:00 Dancing"], notes: ["Cocktails and small bites will be served after the ceremony.", "Dinner starts at 18:30 with shared plates.", "Speeches, cake, and the first dance follow before the open floor."] },
  { label: "Final page", title: "Will you be there?", kicker: "RSVP", copy: "Save a seat in your calendar and a little room on the dance floor. Reply by 01 September so we can prepare your place at the table.", detail: "Reply by 01 September", meta: ["RSVP needed", "One seat reserved", "Dinner included"], notes: ["Confirm your attendance and guest name.", "Tell us about dietary requirements.", "Use the RSVP button after this page to send your reply."] },
] as const;

const paperPlacements = [
  { x: -320, y: -220, rotate: -8, z: 1 },
  { x: -70, y: -250, rotate: 5, z: 2 },
  { x: 145, y: -150, rotate: -3, z: 3 },
  { x: -260, y: 110, rotate: 8, z: 4 },
  { x: 20, y: 125, rotate: -6, z: 5 },
] as const;

const focusImages = ["/assets/images/bloom-couple.webp", "/assets/flowers/bloom-cluster.png", "/assets/flowers/bloom-cover-cluster.png", "/assets/flowers/bloom-side-bouquet.png"] as const;

function BookTemplate({ theme }: { theme: Theme; onOpenRsvp: () => void }) {
  const [focusedPage, setFocusedPage] = useState<number | null>(null);
  const [focusImage, setFocusImage] = useState(0);
  const focused = focusedPage === null ? null : bookPages[focusedPage];
  useEffect(() => {
    if (focusedPage === null) return;
    const resetTimer = window.setTimeout(() => setFocusImage(0), 0);
    const timer = window.setInterval(() => setFocusImage((value) => (value + 1) % focusImages.length), 2200);
    return () => {
      window.clearTimeout(resetTimer);
      window.clearInterval(timer);
    };
  }, [focusedPage]);
  return <section className={`paper-template reveal is-visible ${focused ? "has-focus" : ""}`} id="invitation" aria-label={`${theme.label} invitation`}>
    <div className="paper-template-topline"><span>{theme.number} / Grand collection</span><span>{focused ? focused.label : `${bookPages.length} loose sheets`}</span></div>
    <div className="paper-desk">
      <div className="paper-scatter" aria-label="Invitation page stack">
        {bookPages.map((item, index) => {
          const placement = paperPlacements[index];
          return <button className={`paper-sheet paper-sheet-${index + 1} paper-layout-${index + 1} ${focusedPage === index ? "is-selected" : ""}`} key={item.label} onClick={() => setFocusedPage(index)} style={{ "--paper-x": `${placement.x}px`, "--paper-y": `${placement.y}px`, "--paper-rotate": `${placement.rotate}deg`, "--paper-z": placement.z, "--paper-delay": `${index * 70}ms` } as CSSProperties} type="button" aria-label={`Open ${item.label}`}>
            {index === 0 && <><img className="paper-sheet-photo" src="/assets/images/bloom-couple.webp" alt="" /><span className="paper-sheet-number">{String(index + 1).padStart(2, "0")}</span><div className="paper-sheet-copy"><small>{item.label}</small><strong>{item.title}</strong><em>{item.detail}</em></div></>}
            {index === 1 && <><span className="paper-note-mark">N + R</span><small>{item.label}</small><strong>{item.title}</strong><p>{item.kicker}</p><em>{item.detail}</em></>}
            {index === 2 && <><small>{item.label}</small><div className="paper-map-card"><span>The Glasshouse</span><i>UBUD</i><b>16:00</b></div><strong>{item.title}</strong><div className="paper-sheet-tags">{item.meta.map((meta) => <span key={meta}>{meta}</span>)}</div></>}
            {index === 3 && <><small>{item.label}</small><strong>{item.title}</strong><ol className="paper-mini-timeline">{item.meta.map((meta) => <li key={meta}>{meta}</li>)}</ol><em>{item.detail}</em></>}
            {index === 4 && <><span className="paper-rsvp-stamp">RSVP</span><small>{item.label}</small><strong>{item.title}</strong><ul className="paper-mini-check">{item.notes.map((note) => <li key={note}>{note}</li>)}</ul></>}
          </button>;
        })}
      </div>
      <aside className="paper-intro">
        <p className="eyebrow">{theme.kicker}</p>
        <h2>Pick up one<br /><i>loose page.</i></h2>
        <p>Each sheet is part of the same invitation set, but the layout changes by purpose: cover, personal note, venue, programme, and RSVP.</p>
        <span>Click any paper to focus it. Close returns to the full scattered set.</span>
      </aside>
      {focused && <div className="paper-focus" role="dialog" aria-modal="false" aria-label={`${focused.label} detail`}>
        <button className="paper-focus-close" onClick={() => setFocusedPage(null)} type="button" aria-label="Close focused page">Close</button>
        <div className="paper-focus-left">
          <img src={focusImages[focusImage]} alt="" />
          <div className="paper-focus-meta">{focused.meta.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
        <article className={`paper-focus-right paper-focus-detail-${(focusedPage ?? 0) + 1}`}>
          {focusedPage === 0 && <><small>{focused.label}</small><h2>{focused.title}</h2><p className="paper-focus-kicker">{focused.kicker}</p><div className="paper-focus-date"><span>Saturday</span><strong>17</strong><span>October 2026</span></div><p>{focused.copy}</p><div className="paper-focus-cover-grid"><span>The Glasshouse</span><span>Ubud, Bali</span><span>16:00 WITA</span></div></>}
          {focusedPage === 1 && <><small>{focused.label}</small><p className="paper-letter-quote">Somehow, it was always you.</p><div className="paper-letter-columns"><p>We made this page for the people who have watched the story unfold from the beginning.</p><p>Come early, stay close, and bring one memory we can keep after the night ends.</p></div><span className="paper-letter-signature">Nara + Raka</span></>}
          {focusedPage === 2 && <><small>{focused.label}</small><h2>{focused.title}</h2><div className="paper-venue-panel"><span>Garden venue</span><strong>The Glasshouse</strong><p>Ubud, Bali. Guest arrival starts from 15:30 with seating before the ceremony.</p></div><dl className="paper-venue-list"><div><dt>Arrival</dt><dd>15:30 WITA</dd></div><div><dt>Ceremony</dt><dd>16:00 WITA</dd></div><div><dt>Dress</dt><dd>Garden formal</dd></div></dl></>}
          {focusedPage === 3 && <><small>{focused.label}</small><h2>{focused.title}</h2><ol className="paper-focus-timeline"><li><time>15:30</time><span>Welcome drinks and guest book</span></li><li><time>16:00</time><span>Garden ceremony</span></li><li><time>17:00</time><span>Portraits and cocktails</span></li><li><time>18:30</time><span>Dinner, speeches, and dancing</span></li></ol></>}
          {focusedPage === 4 && <><small>{focused.label}</small><h2>{focused.title}</h2><p className="paper-focus-kicker">Reply by 01 September</p><div className="paper-rsvp-panel"><strong>One seat is being saved for you.</strong><p>Please confirm your attendance, guest name, and any dietary requirements before the deadline.</p></div><ul className="paper-rsvp-list"><li>Attendance confirmation</li><li>Guest name</li><li>Meal or dietary note</li></ul></>}
        </article>
      </div>}
    </div>
    <p className="book-live" aria-live="polite">{focused ? `${focused.label}: ${focused.title}` : "Choose one sheet to open"}</p>
  </section>;
}

function BotanicalHero({ theme }: { theme: Theme }) {
  return <section className="hero hero-botanical reveal"><div className="botanical-copy"><p className="eyebrow">{theme.kicker} <span>·</span> 17 October 2026</p><h1>Nara <em>&</em> Raka</h1><p className="hero-tagline">{theme.tagline}</p><button className="underlined-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Open our invitation <span>↗</span></button></div><div className="botanical-art" aria-label="Abstract floral illustration"><div className="leaf leaf-one" /><div className="leaf leaf-two" /><div className="leaf leaf-three" /><div className="flower flower-one" /><div className="flower flower-two" /><div className="portrait-oval"><Monogram label="N ✦ R" /><span>Saturday<br />in Ubud</span></div><span className="art-note">a day to remember</span></div></section>;
}

function BloomHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-bloom reveal" id="invitation"><div className="bloom-wash" /><div className="bloom-topline"><span>{theme.number} / Grand collection</span><span>watercolor garden</span></div><img className="bloom-art bloom-cluster" src="/assets/flowers/bloom-cluster.png" alt="" /><img className="bloom-art bloom-sprig" src="/assets/flowers/bloom-sprig.png" alt="" /><div className="bloom-copy"><p className="eyebrow">{theme.kicker} · 17 October 2026</p><h1>Nara <i>&</i><br />Raka</h1><p>{theme.tagline}</p><button className="grand-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Enter the garden <span>↘</span></button></div><div className="bloom-card"><span className="bloom-card-mark">N <i>+</i> R</span><span>THE GLASSHOUSE</span><span>UBUD · BALI</span></div><span className="bloom-petal petal-one">✿</span><span className="bloom-petal petal-two">✿</span></section>;
}

function BloomFloatingOrnaments() {
  return <div className="bloom-float-layer" aria-hidden="true"><div className="bloom-float-side bloom-float-side-left"><img className="bloom-side-flower bloom-side-bouquet" src="/assets/flowers/bloom-side-bouquet.png" alt="" /><img className="bloom-side-flower bloom-side-purple" src="/assets/flowers/bloom-side-purple.png" alt="" /><img className="bloom-side-flower bloom-side-leaves" src="/assets/flowers/bloom-side-leaves.png" alt="" /></div><div className="bloom-float-side bloom-float-side-right"><img className="bloom-side-flower bloom-side-bouquet" src="/assets/flowers/bloom-side-bouquet.png" alt="" /><img className="bloom-side-flower bloom-side-purple" src="/assets/flowers/bloom-side-purple.png" alt="" /><img className="bloom-side-flower bloom-side-leaves" src="/assets/flowers/bloom-side-leaves.png" alt="" /></div><img className="bloom-float bloom-float-cover bloom-float-cover-left" src="/assets/flowers/bloom-cover-cluster.png" alt="" /><img className="bloom-float bloom-float-cover bloom-float-cover-right" src="/assets/flowers/bloom-cover-cluster.png" alt="" /></div>;
}

function DepthHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-depth reveal" id="invitation"><div className="depth-hero-grid" /><div className="depth-hero-topline"><span>{theme.number} / Grand collection</span><span>scroll to enter</span></div><div className="depth-hero-copy"><p className="eyebrow">{theme.kicker} · 17.10.26</p><h1>Nara<br /><i>& Raka</i></h1><p>{theme.tagline}</p><button className="depth-hero-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Open the next frame <span>↓</span></button></div><div className="depth-hero-object"><div className="depth-hero-ring ring-a" /><div className="depth-hero-ring ring-b" /><div className="depth-hero-core"><span>NR</span><small>2026</small></div><span className="depth-hero-index">01 — 12</span></div><div className="depth-hero-footer"><span>THE GLASSHOUSE / UBUD</span><span>EVERYTHING IN ITS PLACE</span></div></section>;
}

function GardenHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-garden reveal" id="invitation"><div className="garden-hero-wash" /><div className="garden-hero-topline"><span>{theme.number} / Grand collection</span><span>follow the petals</span></div><img className="garden-hero-cluster" src="/assets/flowers/bloom-cluster.png" alt="" /><img className="garden-hero-sprig" src="/assets/flowers/bloom-sprig.png" alt="" /><div className="garden-hero-copy"><p className="eyebrow">{theme.kicker} · 17 October 2026</p><h1>Nara<br /><i>& Raka</i></h1><p>{theme.tagline}</p><button className="garden-hero-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Enter the garden <span>↘</span></button></div><div className="garden-hero-seal"><span>petal<br />route</span><strong>NR</strong><small>UBUD / 2026</small></div></section>;
}

function VellumHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-vellum reveal" id="invitation"><div className="vellum-grain" /><div className="vellum-topline"><span>{theme.number} / Grand collection</span><span>layered paper motion</span></div><div className="vellum-copy"><p className="eyebrow">{theme.kicker} · 17 October 2026</p><h1>Nara<br /><i>& Raka</i></h1><p>{theme.tagline}</p><button className="vellum-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Turn the page <span>↓</span></button></div><div className="vellum-pages" aria-hidden="true"><div className="vellum-page vellum-page-back"><span>THE GLASSHOUSE</span></div><div className="vellum-page vellum-page-mid"><img src="/assets/images/bloom-couple.webp" alt="" /></div><div className="vellum-page vellum-page-front"><span>NR</span><strong>14</strong><small>UBUD / BALI</small></div></div><div className="vellum-thread" aria-hidden="true"><span /><span /><span /></div></section>;
}

function TideHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-tide reveal" id="invitation"><div className="tide-sky" /><div className="tide-topline"><span>{theme.number} / Grand collection</span><span>coastal motion system</span></div><div className="tide-copy"><p className="eyebrow">{theme.kicker} · 17 October 2026</p><h1>Nara<br /><i>& Raka</i></h1><p>{theme.tagline}</p><button className="tide-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Follow the tide <span>↓</span></button></div><div className="tide-orb" aria-hidden="true"><span>15</span></div><div className="tide-waves" aria-hidden="true"><span /><span /><span /></div><div className="tide-card" aria-hidden="true"><span>THE GLASSHOUSE</span><strong>UBUD</strong><small>16:00 WITA</small></div></section>;
}

function CurtainHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-curtain reveal" id="invitation"><div className="curtain-stage-light" /><div className="curtain-topline"><span>{theme.number} / Grand collection</span><span>curtain reveal template</span></div><div className="curtain-copy"><p className="eyebrow">{theme.kicker} / 17 October 2026</p><h1>Nara<br /><i>& Raka</i></h1><p>{theme.tagline}</p><button className="curtain-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Take your seat <span>down</span></button></div><div className="curtain-stage-card" aria-hidden="true"><span>THE GLASSHOUSE</span><strong>ACT I</strong><small>UBUD / BALI</small></div><div className="curtain-rails" aria-hidden="true"><span /><span /><span /></div></section>;
}

function FolioHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-folio reveal" id="invitation"><div className="folio-grid" /><div className="folio-topline"><span>{theme.number} / Grand collection</span><span>folded gate template</span></div><div className="folio-copy"><p className="eyebrow">{theme.kicker} / Saturday</p><h1>Nara<br /><i>& Raka</i></h1><p>{theme.tagline}</p><button className="folio-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Enter the folio <span>down</span></button></div><div className="folio-gate" aria-hidden="true"><span className="folio-panel folio-panel-left">NR</span><span className="folio-panel folio-panel-right">17</span><span className="folio-panel folio-panel-center">UBUD</span></div></section>;
}

function SignalHero({ theme }: { theme: Theme }) {
  const [wiggle, setWiggle] = useState(0);
  const trigger = () => setWiggle((value) => value + 1);
  return <section className="hero grand-hero grand-signal reveal" id="invitation">
    <div className="signal-grid" />
    <div className="signal-scan" />
    <div className="signal-topline"><span>{theme.number} / Grand collection</span><span>live invitation system</span></div>
    <div className="signal-copy"><p className="eyebrow">{theme.kicker} / 17 October 2026</p><h1>Signal<br /><i>the yes.</i></h1><p>{theme.tagline}</p><button className="signal-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Open the sequence <span>down</span></button></div>
    <button className="signal-core-button" onClick={trigger} type="button" aria-label="Animate Signal monogram">
      <span className="signal-ring signal-ring-one" />
      <span className="signal-ring signal-ring-two" />
      <span key={wiggle} className={`signal-core-mark ${wiggle ? "is-wiggle" : ""}`}>N + R</span>
      <small>tap to shake</small>
    </button>
    <div className="signal-data-strip" aria-hidden="true"><span>UBUD</span><span>16:00</span><span>GLASSHOUSE</span><span>RSVP</span></div>
    <button className="signal-badge" onClick={trigger} type="button"><span key={`signal-badge-${wiggle}`} className={wiggle ? "is-wiggle" : ""}>17.10.26</span></button>
  </section>;
}

function GridlineHero({ theme }: { theme: Theme }) {
  const [wiggle, setWiggle] = useState(0);
  const trigger = () => setWiggle((value) => value + 1);
  return <section className="hero grand-hero grand-gridline reveal" id="invitation">
    <div className="gridline-field" />
    <div className="gridline-topline"><span>{theme.number} / Grand collection</span><span>modular event layout</span></div>
    <div className="gridline-copy"><p className="eyebrow">{theme.kicker} / Saturday</p><h1>Nara<br /><i>Raka</i></h1><p>{theme.tagline}</p><button className="gridline-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">View the layout <span>down</span></button></div>
    <div className="gridline-stack">
      <button key={`grid-main-${wiggle}`} className={`gridline-panel gridline-panel-main ${wiggle ? "is-card-wiggle" : ""}`} onClick={trigger} type="button" aria-label="Animate all Gridline cards"><span>17<br /><small>OCT</small></span></button>
      <button key={`grid-photo-${wiggle}`} className={`gridline-panel gridline-panel-photo ${wiggle ? "is-card-wiggle" : ""}`} onClick={trigger} type="button" aria-label="Animate all Gridline cards including photo"><img src="/assets/images/bloom-couple.webp" alt="" /></button>
      <button key={`grid-note-${wiggle}`} className={`gridline-panel gridline-panel-note ${wiggle ? "is-card-wiggle" : ""}`} onClick={trigger} type="button" aria-label="Animate all Gridline cards"><span>Tap card</span><strong>Ubud / Bali</strong></button>
    </div>
    <div className="gridline-ticker" aria-hidden="true"><span>NARA + RAKA / THE GLASSHOUSE / 16:00 WITA / RSVP BY 01 SEPTEMBER / </span><span>NARA + RAKA / THE GLASSHOUSE / 16:00 WITA / RSVP BY 01 SEPTEMBER / </span></div>
  </section>;
}

function ModernHero({ theme }: { theme: Theme }) {
  return <section className="hero hero-modern reveal"><div className="modern-stamp">INVITATION<br /><strong>001</strong></div><div className="modern-copy"><p className="eyebrow">{theme.kicker} / 17—10—26</p><h1><span>Nara</span><span className="ampersand">+</span><span>Raka</span></h1><p className="hero-tagline">{theme.tagline}</p><div className="modern-meta"><span>UBUD</span><span>16:00</span><span>RSVP →</span></div></div><div className="modern-shape"><span>26</span><i>save<br />the<br />date</i></div></section>;
}

function FilmHero({ theme }: { theme: Theme }) {
  return <section className="hero hero-film reveal"><div className="film-copy"><p className="eyebrow">{theme.kicker} · reel 001</p><h1>Nara<br /><span>& Raka</span></h1><p className="hero-tagline">{theme.tagline}</p><button className="film-button" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button"><span>▶</span> Play the story</button></div><div className="film-frame"><div className="frame-top">NR—001 <span>SUPER 8</span></div><div className="film-photo"><span>love,<br />in focus</span></div><div className="frame-bottom"><span>UBUD / BALI</span><span>10.17.26</span></div></div><div className="film-strip" aria-hidden="true"><span /><span /><span /><span /><span /></div></section>;
}

function PaperHero({ theme }: { theme: Theme }) {
  return <section className="hero hero-paper reveal"><div className="paper-scribble">with love,<br /><span>always.</span></div><div className="paper-card"><Monogram /><p className="eyebrow">{theme.kicker}</p><h1>Nara <span>&</span> Raka</h1><div className="paper-rule" /><p className="paper-date">Saturday, the seventeenth<br />of October, two thousand twenty-six</p><button className="paper-button" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Come celebrate <span>✶</span></button></div><div className="paper-sticker">N + R<br /><small>est. 2026</small></div></section>;
}

function QuietHero({ theme }: { theme: Theme }) {
  return <section className="hero hero-quiet reveal"><div className="quiet-top"><span>NR / 2026</span><span>Invitation no. 05</span><span>↘ Scroll to explore</span></div><div className="quiet-title"><span className="quiet-small">are getting married</span><h1>Nara<br /><i>&</i> Raka</h1><span className="quiet-date">17—10—26</span></div><div className="quiet-bottom"><p>{theme.tagline}</p><div className="quiet-line" /><span>THE GLASSHOUSE<br />UBUD, BALI</span></div></section>;
}

function AuroraHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-aurora reveal" id="invitation"><div className="grand-topline"><span>{theme.number} / Grand collection</span><span>immersive template</span></div><div className="aurora-copy"><p className="eyebrow">{theme.kicker} · Iceland / 2026</p><h1>Nara <i>+</i><br />Raka</h1><p>{theme.tagline}</p><button className="grand-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Enter the evening <span>↘</span></button></div><div className="aurora-visual"><div className="aurora-ribbon" /><div className="aurora-sun" /><div className="aurora-location">64°08′N<br /><span>Reykjavík</span></div><strong>17</strong><span className="aurora-caption">OCTOBER<br />TWO THOUSAND<br />TWENTY SIX</span></div></section>;
}

function AtlasHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-atlas reveal" id="invitation"><div className="atlas-grid-mark" /><div className="atlas-index">07<br /><span>destination wedding</span></div><div className="atlas-copy"><p className="eyebrow">{theme.kicker}</p><h1>Where<br /><i>we go,</i><br />we go<br /><span>together.</span></h1><div className="atlas-route"><span>JKT</span><b>——— ◇ ———</b><span>UBUD</span></div></div><div className="atlas-stamp"><span>THE GLASSHOUSE</span><strong>17<br />10<br />26</strong><small>08°30′S<br />115°15′E</small></div></section>;
}

function LunaHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-luna reveal" id="invitation"><div className="luna-stars" /><div className="luna-top"><span>NR / after dark</span><span>Saturday, 17.10.26</span></div><div className="luna-moon"><span>the night<br />is ours</span></div><div className="luna-copy"><p className="eyebrow">{theme.kicker}</p><h1>Nara <i>&</i> Raka</h1><p>{theme.tagline}</p><button className="luna-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Open under the moon <span>✦</span></button></div><div className="luna-bottom"><span>18:00 — ceremony</span><span>the glasshouse / ubud</span><span>black tie, soft hearts</span></div></section>;
}

function GalleryHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-gallery reveal" id="invitation"><div className="gallery-header"><span>09 / a living archive</span><span>swipe slowly →</span></div><div className="gallery-stack"><div className="gallery-card gallery-card-back"><span>the details</span></div><div className="gallery-card gallery-card-middle"><span>the people</span></div><div className="gallery-card gallery-card-front"><div><p className="eyebrow">{theme.kicker}</p><h1>Nara<br /><i>& Raka</i></h1></div><span className="gallery-date">17<br /><small>OCT</small><br />26</span></div></div><div className="gallery-caption"><p>{theme.tagline}</p><button className="grand-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Browse the archive <span>↗</span></button></div></section>;
}

function OrbitHero({ theme }: { theme: Theme }) {
  return <section className="hero grand-hero grand-orbit reveal" id="invitation"><div className="orbit-copy"><p className="eyebrow">{theme.kicker} · invitation no. 10</p><h1>Everything<br /><i>led us here.</i></h1><p>{theme.tagline}</p><button className="orbit-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} type="button">Begin the sequence <span>→</span></button></div><div className="orbit-planet"><div className="planet-core"><span>N + R</span></div><div className="planet-ring ring-one" /><div className="planet-ring ring-two" /><div className="planet-ring ring-three" /><span className="planet-label label-one">17.10.26</span><span className="planet-label label-two">UBUD / BALI</span></div><div className="orbit-footer"><span>06:00 PM</span><span>THE GLASSHOUSE</span><span>∞</span></div></section>;
}

function Hero({ theme }: { theme: Theme }) {
  switch (theme.id) { case "modern": return <ModernHero theme={theme} />; case "film": return <FilmHero theme={theme} />; case "paper": return <PaperHero theme={theme} />; case "quiet": return <QuietHero theme={theme} />; case "aurora": return <AuroraHero theme={theme} />; case "atlas": return <AtlasHero theme={theme} />; case "luna": return <LunaHero theme={theme} />; case "gallery": return <GalleryHero theme={theme} />; case "orbit": return <OrbitHero theme={theme} />; case "bloom": return <BloomHero theme={theme} />; case "depth": return <DepthHero theme={theme} />; case "garden": return <GardenHero theme={theme} />; case "vellum": return <VellumHero theme={theme} />; case "tide": return <TideHero theme={theme} />; case "curtain": return <CurtainHero theme={theme} />; case "folio": return <FolioHero theme={theme} />; case "signal": return <SignalHero theme={theme} />; case "gridline": return <GridlineHero theme={theme} />; default: return <BotanicalHero theme={theme} />; }
}

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => { const update = () => { const diff = Math.max(0, new Date("2026-10-17T16:00:00+08:00").getTime() - Date.now()); const totalSeconds = Math.floor(diff / 1000); setTime({ days: Math.floor(totalSeconds / 86400), hours: Math.floor((totalSeconds % 86400) / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60 }); }; update(); const id = window.setInterval(update, 1000); return () => window.clearInterval(id); }, []);
  return <div className="countdown" aria-label="Countdown to the wedding">{[[time.days, "days"], [time.hours, "hours"], [time.minutes, "minutes"], [time.seconds, "seconds"]].map(([value, label]) => <div className="countdown-item" key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

function StorySection({ theme }: { theme: Theme }) {
  return <section className={`story-section reveal story-${theme.id}`} id="story"><div className="section-index">01 <span>Our story</span></div><div className="story-content"><div className="story-heading"><p className="eyebrow">A note from us</p><h2>Somehow,<br /><i>it was always you.</i></h2></div><div className="story-body"><p>We met over a shared umbrella and stayed for one more coffee. Five years, two cities, and an unreasonable number of weekend breakfasts later, we are making it official.</p><p>It would mean the world to have you with us as we begin this next little chapter.</p><div className="signature">Nara <span>×</span> Raka</div></div></div><div className="story-quote">“A lifetime sounds<br />just about right.”</div></section>;
}

function EventSection({ theme }: { theme: Theme }) {
  return <section className={`event-section reveal event-${theme.id}`} id="details"><div className="section-index">02 <span>The day</span></div><div className="event-grid"><div className="event-copy"><p className="eyebrow">Mark your calendar</p><h2>Meet us<br /><i>under the trees.</i></h2><p>Saturday, 17 October 2026<br />The Glasshouse, Ubud<br />Bali, Indonesia</p><a href="#rsvp" className="text-link">See the full details <span>↗</span></a></div><div className="event-card"><div className="event-card-art"><span>THE<br /><b>GLASS</b><br />HOUSE</span><i>U</i></div><div className="event-card-foot"><span>17.10.26</span><span>16:00 WITA</span><span>Ubud, Bali</span></div></div></div><div className="countdown-wrap"><div><p className="eyebrow">Counting the days</p><h3>Until forever starts</h3></div><Countdown /></div></section>;
}

function TimelineSection() {
  return <section className="timeline-section reveal" id="schedule"><div className="section-index">03 <span>Schedule</span></div><div className="timeline-head"><p className="eyebrow">The day at a glance</p><h2>Take it slow.<br /><i>Stay awhile.</i></h2></div><div className="timeline-list">{timeline.map(([time, title, desc]) => <div className="timeline-row" key={time}><time>{time}</time><div><h3>{title}</h3><p>{desc}</p></div><span className="timeline-dot" /></div>)}</div></section>;
}

function MomentsSection({ theme }: { theme: Theme }) {
  return <section className={`moments-section reveal moments-${theme.id}`}><div className="section-index">04 <span>Little moments</span></div><div className="moments-header"><p className="eyebrow">Before the big day</p><h2>Scenes from<br /><i>our ordinary.</i></h2><p>Because the everyday bits are our favorite bits.</p></div><div className="moments-grid"><div className="moment moment-a"><span>Sunday<br />morning</span></div><div className="moment moment-b"><span>Two tickets<br />to anywhere</span></div><div className="moment moment-c"><span>Home is<br />a person</span></div><div className="moment moment-d"><span>Still<br />choosing you</span></div></div></section>;
}

function AuroraBody() {
  return <div className="grand-body grand-body-aurora"><section className="aurora-story reveal" id="story"><div className="grand-number">01</div><div><p className="eyebrow">A slow beginning</p><h2>We found<br /><i>the light.</i></h2></div><div className="aurora-story-copy"><p>Somewhere between a train platform and a winter sky, Nara and Raka realized that every good adventure had started with the same thing: choosing each other.</p><p>Join us for a weekend above the clouds, where the hours stretch and the dancing starts before dinner.</p></div></section><section className="aurora-gallery reveal" id="details"><div className="aurora-gallery-title"><p className="eyebrow">The weekend edit</p><h2>Three scenes.<br /><i>One promise.</i></h2></div><div className="aurora-gallery-grid"><div className="aurora-tile tile-sky"><span>01 / arrival</span></div><div className="aurora-tile tile-glass"><span>02 / ceremony</span></div><div className="aurora-tile tile-night"><span>03 / after dark</span></div></div></section><section className="aurora-itinerary reveal" id="schedule"><div><p className="eyebrow">The itinerary</p><h2>Pack light.<br /><i>Stay late.</i></h2></div><div className="itinerary-cards"><article><span>FRI / 16</span><h3>Welcome drinks</h3><p>19:00 · The Northern Room</p></article><article><span>SAT / 17</span><h3>The ceremony</h3><p>16:00 · Glasshouse meadow</p></article><article><span>SUN / 18</span><h3>Last coffee</h3><p>10:30 · Before we go</p></article></div></section></div>;
}

function AtlasBody() {
  return <div className="grand-body grand-body-atlas"><section className="atlas-intro reveal" id="story"><div className="atlas-intro-label">a field note from us</div><blockquote>“The best place in the world is the one we are standing in together.”</blockquote><p>Our story has always been a collection of coordinates: a first coffee in Jakarta, a rainy weekend in Bandung, and now a wide-open garden in Ubud.</p></section><section className="atlas-map-section reveal" id="details"><div className="atlas-map-copy"><p className="eyebrow">Follow the route</p><h2>One map.<br /><i>Many memories.</i></h2><p>Arrive through Bali, follow the road north, and let the trees lead you to us.</p><a className="text-link" href="#schedule">View the itinerary <span>↗</span></a></div><div className="atlas-map"><div className="map-grid" /><span className="map-point point-jkt">JKT</span><span className="map-point point-bali">UBUD</span><span className="map-route">· · · · · ◇ · · · · ·</span></div></section><section className="atlas-schedule reveal" id="schedule"><div className="atlas-schedule-head"><p className="eyebrow">A destination wedding</p><h2>From arrival<br /><i>to encore.</i></h2></div><div className="atlas-stops"><div><span>01</span><h3>Land softly</h3><p>Airport transfer and a welcome note waiting at your stay.</p></div><div><span>02</span><h3>Meet under the trees</h3><p>Our ceremony begins as the afternoon light turns gold.</p></div><div><span>03</span><h3>Stay for one more song</h3><p>Dinner, dancing, and all the stories we never want to end.</p></div></div></section></div>;
}

function LunaBody() {
  return <div className="grand-body grand-body-luna"><section className="luna-note reveal" id="story"><span className="luna-note-mark">✦</span><p className="eyebrow">A note by candlelight</p><h2>Come as you are.<br /><i>Leave with a star.</i></h2><p>There are some nights that feel like they were waiting for us. This is one of them.</p></section><section className="luna-details reveal" id="details"><div className="luna-detail-intro"><p className="eyebrow">The details</p><h2>Under a<br /><i>velvet sky.</i></h2></div><div className="luna-detail-list"><div><span>WHERE</span><strong>The Glasshouse<br />Ubud, Bali</strong></div><div><span>WHEN</span><strong>Saturday<br />17 October 2026</strong></div><div><span>DRESS</span><strong>Black tie<br />Soft hearts</strong></div></div></section><section className="luna-marquee reveal" id="schedule"><div className="marquee-line">CEREMONY <i>18:00</i> DINNER <i>20:00</i> DANCING <i>22:00</i> CEREMONY <i>18:00</i></div><div className="luna-schedule-grid"><span>18:00</span><h3>Say yes<br /><i>in the dark.</i></h3><p>Doors open with a glass of something cold. The vows begin when the last sun leaves the garden.</p></div></section></div>;
}

const deckCards = [
  { id: "story", label: "01 / the story", title: "Keep the\ngood details.", copy: "Five years of small gestures, big trips, and Sunday mornings brought us here.", foot: "Nara × Raka", tone: "deck-sand" },
  { id: "details", label: "02 / the details", title: "A day\nworth keeping.", copy: "Saturday, 17 October 2026 · The Glasshouse, Ubud · Bali, Indonesia.", foot: "17.10.26", tone: "deck-sage" },
  { id: "schedule", label: "03 / the schedule", title: "Walk through\nthe day.", copy: "15:30 doors · 16:00 vows · 17:30 golden hour · 19:00 dinner.", foot: "Take it slow", tone: "deck-clay" },
  { id: "rsvp", label: "04 / your place", title: "Will you\nbe there?", copy: "Save a little room in your calendar and a lot of room on the dance floor.", foot: "RSVP / NR—26", tone: "deck-ink" },
] as const;

function CardDeck() {
  const [order, setOrder] = useState(deckCards.map((card) => card.id));
  const [dragX, setDragX] = useState(0);
  const dragStart = useRef<number | null>(null);
  const moveTopToBack = () => setOrder(([first, ...rest]) => [...rest, first]);
  const moveLastToFront = () => setOrder((items) => [items[items.length - 1], ...items.slice(0, -1)]);
  const startDrag = (event: ReactPointerEvent<HTMLElement>) => { dragStart.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); };
  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => { if (dragStart.current !== null) setDragX(event.clientX - dragStart.current); };
  const endDrag = () => { if (Math.abs(dragX) > 65) { if (dragX < 0) moveTopToBack(); else moveLastToFront(); } dragStart.current = null; setDragX(0); };
  return <section className="gallery-deck reveal" id="story" aria-roledescription="carousel" aria-label="Interactive invitation card deck"><div className="deck-intro"><p className="eyebrow">09 / a living archive</p><h2>Hold the<br /><i>good parts.</i></h2><p>Drag the top card away or use the arrows to move through the invitation.</p><div className="deck-actions"><button onClick={moveLastToFront} type="button" aria-label="Previous card">←</button><span>swipe / drag</span><button onClick={moveTopToBack} type="button" aria-label="Next card">→</button></div></div><div className="deck-stage">{order.map((id, index) => { const card = deckCards.find((item) => item.id === id)!; const isTop = index === 0; return <article className={`deck-card ${card.tone} deck-position-${index}`} key={card.id} onPointerDown={isTop ? startDrag : undefined} onPointerMove={isTop ? moveDrag : undefined} onPointerUp={isTop ? endDrag : undefined} onPointerCancel={isTop ? endDrag : undefined} style={isTop ? { transform: `translateX(${dragX}px) rotate(${dragX / 12}deg)` } : undefined}><div className="deck-card-top"><span>{card.label}</span><span>NR—26</span></div><div className="deck-card-content"><span className="deck-card-symbol">{index === 0 ? "▦" : index === 1 ? "✦" : index === 2 ? "↗" : "N + R"}</span><h3>{card.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3><p>{card.copy}</p></div><div className="deck-card-foot"><span>{card.foot}</span><span>↗</span></div>{isTop && <span className="deck-drag-hint">drag me</span>}</article>; })}</div></section>;
}

function GalleryBody() {
  return <div className="grand-body grand-body-gallery"><CardDeck /><section className="gallery-mosaic reveal" id="details"><div className="mosaic-title"><p className="eyebrow">The visual index</p><h2>Details worth<br /><i>remembering.</i></h2></div><div className="mosaic-board"><div className="mosaic-item mosaic-a"><span>the rings</span></div><div className="mosaic-item mosaic-b"><span>the flowers</span></div><div className="mosaic-item mosaic-c"><span>the table</span></div><div className="mosaic-item mosaic-d"><span>the afterglow</span></div></div></section><section className="gallery-timeline reveal" id="schedule"><div className="gallery-timeline-title"><p className="eyebrow">Exhibition hours</p><h2>Walk through<br /><i>the day.</i></h2></div><div className="gallery-timeline-list"><div><time>15:30</time><p>Doors open / find your frame</p></div><div><time>16:00</time><p>Portrait one / the ceremony</p></div><div><time>17:30</time><p>Portrait two / golden hour</p></div><div><time>19:00</time><p>Final frame / dinner begins</p></div></div></section></div>;
}

function OrbitBody() {
  return <div className="grand-body grand-body-orbit"><section className="orbit-story reveal" id="story"><div className="orbit-story-intro"><p className="eyebrow">A field guide to forever</p><h2>Two paths.<br /><i>One orbit.</i></h2></div><div className="orbit-story-copy"><p>We were moving in different directions when the universe got very specific. One shared table, one accidental introduction, and suddenly every road pointed here.</p><span>Est. 2021 / Still in motion</span></div></section><section className="orbit-chronicle reveal" id="details"><div className="chronicle-title"><p className="eyebrow">The chronicle</p><h2>Moments in<br /><i>constant motion.</i></h2></div><div className="chronicle-steps"><div><b>01</b><strong>First hello</strong><span>Jakarta / 2021</span></div><div><b>02</b><strong>First flight</strong><span>Kyoto / 2023</span></div><div><b>03</b><strong>First home</strong><span>Ubud / 2026</span></div></div></section><section className="orbit-program reveal" id="schedule"><div className="program-orbit"><span>16:00</span><span>18:30</span><span>22:00</span><i>day<br />night<br />always</i></div><div><p className="eyebrow">The programme</p><h2>Stay in<br /><i>our orbit.</i></h2><p>Arrive for the ceremony, stay for dinner, and let the evening carry you wherever it wants to go.</p></div></section></div>;
}

function BloomBody() {
  return <div className="grand-body grand-body-bloom"><section className="bloom-story reveal" id="story"><div className="grand-number">01</div><div className="bloom-story-copy"><p className="eyebrow">A note from the garden</p><h2>Let the day<br /><i>open slowly.</i></h2><p>Somewhere between a shared umbrella and one more cup of coffee, Nara and Raka found a life worth celebrating in full colour.</p><p>Come as you are. Stay for the vows, the golden hour, and every little petal that falls after.</p></div><img className="bloom-story-art" src="/assets/flowers/bloom-bouquet.png" alt="" /></section><section className="bloom-gallery reveal" id="details"><div className="bloom-gallery-copy"><p className="eyebrow">The visual story</p><h2>Petals, portraits,<br /><i>and a little light.</i></h2><p>Keep the moments that feel soft around the edges. We will make room for all of them.</p></div><figure className="bloom-photo"><img src="/assets/images/bloom-couple.webp" alt="A couple celebrating together" /><figcaption>the people we love / 01</figcaption></figure><img className="bloom-gallery-sprig" src="/assets/flowers/bloom-sprig.png" alt="" /></section><section className="bloom-schedule reveal" id="schedule"><div><p className="eyebrow">A gentle itinerary</p><h2>Come for the<br /><i>whole afternoon.</i></h2></div><div className="bloom-schedule-list"><div><time>15:30</time><span>Garden doors open</span><small>Find a seat and say hello.</small></div><div><time>16:00</time><span>The ceremony</span><small>A short walk, a long promise.</small></div><div><time>17:00</time><span>Golden hour</span><small>Portraits, petals, and something cold to drink.</small></div><div><time>18:30</time><span>Dinner under the trees</span><small>Stay awhile. The best part is just beginning.</small></div></div></section></div>;
}

type DepthFlowCoordinate = readonly [number, number];
type DepthFlowSegment = readonly [DepthFlowCoordinate, DepthFlowCoordinate, DepthFlowCoordinate, DepthFlowCoordinate];

const depthFlowSegments: readonly DepthFlowSegment[] = [
  [[15, 4], [74, 9], [85, 19], [72, 28]],
  [[72, 28], [59, 37], [9, 43], [28, 52]],
  [[28, 52], [47, 61], [92, 67], [78, 76]],
  [[78, 76], [64, 85], [25, 91], [50, 88]],
];
const depthFlowPoints: readonly DepthFlowCoordinate[] = [...depthFlowSegments.map((segment) => segment[0]), depthFlowSegments[depthFlowSegments.length - 1][3]];

function depthCubicPoint(segment: DepthFlowSegment, t: number): DepthFlowCoordinate {
  const inverse = 1 - t;
  return [(inverse ** 3 * segment[0][0]) + (3 * inverse ** 2 * t * segment[1][0]) + (3 * inverse * t ** 2 * segment[2][0]) + (t ** 3 * segment[3][0]), (inverse ** 3 * segment[0][1]) + (3 * inverse ** 2 * t * segment[1][1]) + (3 * inverse * t ** 2 * segment[2][1]) + (t ** 3 * segment[3][1])];
}

const depthFlowLookup = (() => {
  const samples: Array<{ segment: number; t: number; distance: number }> = [{ segment: 0, t: 0, distance: 0 }];
  let distance = 0;
  depthFlowSegments.forEach((segment, segmentIndex) => {
    let previous = depthCubicPoint(segment, 0);
    for (let step = 1; step <= 64; step += 1) {
      const t = step / 64;
      const point = depthCubicPoint(segment, t);
      distance += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
      samples.push({ segment: segmentIndex, t, distance });
      previous = point;
    }
  });
  return { samples, total: distance };
})();

function depthFlowPoint(progress: number) {
  const target = Math.min(depthFlowLookup.total, Math.max(0, progress * depthFlowLookup.total));
  const nextIndex = depthFlowLookup.samples.findIndex((sample) => sample.distance >= target);
  const next = depthFlowLookup.samples[Math.max(0, nextIndex)];
  const previous = depthFlowLookup.samples[Math.max(0, nextIndex - 1)] ?? next;
  const distance = next.distance - previous.distance;
  const ratio = distance ? (target - previous.distance) / distance : 0;
  const segment = next.segment;
  const t = previous.segment === next.segment ? previous.t + (next.t - previous.t) * ratio : next.t;
  const point = depthCubicPoint(depthFlowSegments[segment], t);
  return { x: point[0], y: point[1] };
}

function DepthFlowGuide({ active, progress }: { active: number; progress: number }) {
  const point = depthFlowPoint(progress);
  const orbColor = active === 3 ? "#b8ff4d" : active === 1 ? "#101417" : "#edf2ef";
  const flowStyle = { "--depth-flow-x": `${point.x}%`, "--depth-flow-y": `${point.y}%`, "--depth-flow-angle": `${progress * 180}deg`, "--depth-flow-orb-color": orbColor } as CSSProperties;
  return <div className="depth-flow-guide" style={flowStyle} aria-hidden="true"><svg className="depth-flow-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path className="depth-flow-path-base" pathLength="1" d="M15 4 C74 9 85 19 72 28 S9 43 28 52 S92 67 78 76 S25 91 50 88" /><path className="depth-flow-path-active" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} d="M15 4 C74 9 85 19 72 28 S9 43 28 52 S92 67 78 76 S25 91 50 88" /></svg>{depthFlowPoints.slice(0, 4).map(([x, y], index) => <span className={`depth-flow-node ${active === index ? "is-active" : ""}`} key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />)}<span className="depth-flow-orb" /><span className="depth-flow-label">scroll / connect</span></div>;
}

function DepthBody() {
  const [motion, setMotion] = useState({ active: 0, progress: 0, reveals: [1, 0, 0, 0], finalReady: false });
  useEffect(() => {
    let frame = 0;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const body = document.querySelector<HTMLElement>(".grand-body-depth");
        const sections = Array.from(document.querySelectorAll<HTMLElement>(".depth-section"));
        if (!body || !sections.length) return;
        const viewport = window.innerHeight;
        const focus = viewport * .42;
        const bodyRect = body.getBoundingClientRect();
        const denominator = Math.max(bodyRect.height - viewport * .18, 1);
        const rawProgress = clamp((focus - bodyRect.top) / denominator, 0, 1);
        let active = 0;
        let distance = Number.POSITIVE_INFINITY;
        const reveals = sections.map((section, index) => {
          const rect = section.getBoundingClientRect();
          const nextDistance = Math.abs(rect.top - focus);
          if (nextDistance < distance) { distance = nextDistance; active = index; }
          const entry = clamp((focus - rect.top + viewport * .42) / (viewport * .42), 0, 1);
          const exit = clamp((rect.bottom - focus + viewport * .18) / (viewport * .35), 0, 1);
          return Math.min(entry, exit);
        });
        const focusedIndex = sections.findIndex((section) => { const rect = section.getBoundingClientRect(); return rect.top <= focus && rect.bottom >= focus; });
        if (focusedIndex >= 0) active = focusedIndex;
        const finalRect = sections[3]?.getBoundingClientRect();
        const finalReady = active === 3 && !!finalRect && finalRect.top <= viewport * .08 && finalRect.bottom >= viewport * .92;
        const flowProgress = finalReady ? 1 : rawProgress;
        setMotion({ active, progress: flowProgress, reveals, finalReady });
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); if (frame) window.cancelAnimationFrame(frame); };
  }, []);
  const sectionStyle = (index: number) => { const reveal = motion.reveals[index] ?? 0; const finalFill = index === 3 && motion.finalReady ? 1 : 0; return { "--depth-reveal": reveal.toFixed(3), "--depth-section-index": index, "--depth-shape-opacity": .18 + reveal * .62, "--depth-shape-scale": .92 + reveal * .08, "--depth-final-fill": finalFill } as CSSProperties; };
  const motionStyle = (index: number, x: number, y: number, angle = 0, scale = 1) => { const reveal = motion.reveals[index] ?? 0; const phase = 1 - reveal; return { "--depth-motion-opacity": .2 + reveal * .8, "--depth-motion-x": `${x * phase}px`, "--depth-motion-x-inverse": `${x * phase * -1}px`, "--depth-motion-y": `${y * phase}px`, "--depth-motion-angle": `${angle * phase}deg`, "--depth-motion-angle-inverse": `${angle * phase * -1}deg`, "--depth-motion-scale": 1 - ((1 - scale) * phase) } as CSSProperties; };
  return <div className="grand-body grand-body-depth"><DepthFlowGuide active={motion.active} progress={motion.progress} /><section className={`depth-section depth-story-section ${motion.active === 0 ? "is-active" : ""}`} id="story" data-depth-index="0" style={sectionStyle(0)}><div className="depth-section-meta"><span>01 / THE STORY</span><span>keep moving ↓</span></div><div className="depth-section-shape depth-shape-story" /><div className="depth-story-copy depth-motion depth-motion-copy" style={motionStyle(0, -38, 22, -2, .96)}><p className="eyebrow">A modern invitation</p><h2>Start<br /><i>here.</i></h2><p>Five years, one very good idea, and a room full of people who already know why we are here.</p></div><div className="depth-story-stack depth-motion depth-motion-stack" style={motionStyle(0, 38, 34, 3, .95)}><div className="depth-story-back depth-layer-motion" style={motionStyle(0, -18, 14, -3, .98)}>THE<br />BEGINNING</div><div className="depth-story-mid depth-layer-motion" style={motionStyle(0, 12, -22, 4, .98)}><img src="/assets/images/bloom-couple.webp" alt="A couple celebrating together" /><span>THE GLASSHOUSE / 2026</span></div><div className="depth-story-front depth-layer-motion" style={motionStyle(0, -8, 20, -1, .99)}><span>NR / 17.10.26</span><strong>Nara<br /><i>& Raka</i></strong><small>Somewhere between the first hello<br />and the forever after.</small></div></div></section><section className={`depth-section depth-details ${motion.active === 1 ? "is-active" : ""}`} id="details" data-depth-index="1" style={sectionStyle(1)}><div className="depth-section-meta"><span>02 / THE DETAILS</span><span>everything in its place</span></div><div className="depth-section-shape depth-shape-details" /><div className="depth-details-heading depth-motion" style={motionStyle(1, -30, 28, -2, .96)}><p className="eyebrow">Make room for this</p><h2>Everything<br /><i>falls into place.</i></h2></div><div className="depth-detail-grid depth-motion" style={motionStyle(1, 34, 42, 2, .94)}><article style={motionStyle(1, -18, 28, -2, .98)}><span>01 / ARRIVE</span><strong>15:30</strong><p>Find the room, find your people, and settle into the afternoon.</p></article><article style={motionStyle(1, 0, 38, 0, .98)}><span>02 / PROMISE</span><strong>16:00</strong><p>The ceremony begins when the light is exactly right.</p></article><article style={motionStyle(1, 18, 28, 2, .98)}><span>03 / STAY</span><strong>18:30</strong><p>Dinner, dancing, and one more song before the night ends.</p></article></div></section><section className={`depth-section depth-closer ${motion.active === 2 ? "is-active" : ""}`} id="schedule" data-depth-index="2" style={sectionStyle(2)}><div className="depth-section-meta"><span>03 / THE PROGRAMME</span><span>stay for the whole thing</span></div><div className="depth-section-shape depth-shape-schedule" /><div className="depth-closer-mark depth-motion" style={motionStyle(2, -34, 30, -5, .9)}>12<span>—</span>26</div><div className="depth-closer-copy depth-motion" style={motionStyle(2, 34, 24, 2, .96)}><p className="eyebrow">The last frame</p><h2>See you<br /><i>inside.</i></h2><p>Keep a little room in your calendar. We will keep the lights on.</p></div></section><section className={`depth-section depth-final ${motion.active === 3 ? "is-active" : ""}`} id="depth-final" data-depth-index="3" style={sectionStyle(3)}><div className="depth-section-meta"><span>04 / THE AFTERGLOW</span><span>one more frame</span></div><div className="depth-section-shape depth-shape-final" /><div className="depth-final-copy depth-motion" style={motionStyle(3, -30, 26, -2, .96)}><p className="eyebrow">After the ceremony</p><h2>Stay for<br /><i>the good part.</i></h2><p>Vows, dinner, dancing, and all the small details we will remember long after the lights go out.</p></div><span className="depth-final-mark depth-motion" style={motionStyle(3, 28, 20, 3, .94)}>N + R / 2026</span></section></div>;
}

const gardenCarouselCards = [
  { label: "The opening", title: "Soft beginnings", copy: "The first light, the first hello, and every petal opening around us. This is where guests arrive slowly, find familiar faces, and step into the garden before the ceremony begins.", image: "/assets/flowers/bloom-cluster.png" },
  { label: "The details", title: "Good things", copy: "Small details, warm tables, and room for everyone we love. Every part of the afternoon is kept simple so the people, the vows, and the light can stay in focus.", image: "/assets/flowers/bloom-side-bouquet.png" },
  { label: "The ceremony", title: "A long promise", copy: "A short walk beneath the trees, then a lifetime in one room. The ceremony is intimate, gentle, and timed for the softest part of the day.", image: "/assets/flowers/bloom-side-purple.png" },
  { label: "The afterglow", title: "Stay awhile", copy: "When the lights go low, the best part is only beginning. Dinner opens into music, small conversations, and one more reason to stay a little longer.", image: "/assets/flowers/bloom-side-leaves.png" },
  { label: "The welcome", title: "Come closer", copy: "A little more time together, with every familiar face in view. The welcome hour gives everyone space to arrive, settle in, and feel part of the day.", image: "/assets/flowers/bloom-sprig.png" },
  { label: "The table", title: "Make room", copy: "Long tables, open windows, and stories that keep finding their way back. Dinner is arranged to feel generous, unhurried, and close to the garden.", image: "/assets/flowers/bloom-side-bouquet.png" },
  { label: "The toast", title: "To us", copy: "Raise a glass to the quiet decision that brought everything here. The toast is small in shape but full of the people who helped carry the story forward.", image: "/assets/flowers/bloom-cluster.png" },
  { label: "The music", title: "One more song", copy: "Let the evening stretch a little longer beneath the garden lights. The music begins after dinner and keeps the last part of the night open.", image: "/assets/flowers/bloom-side-purple.png" },
  { label: "The lights", title: "Golden hour", copy: "The softest light arrives when everyone has stopped checking the time. Portraits, garden corners, and late afternoon shadows all belong to this moment.", image: "/assets/flowers/bloom-side-leaves.png" },
  { label: "The return", title: "Home again", copy: "The path turns gently back, carrying a little of the day with us. Guests leave with warm lights behind them and the garden still close in memory.", image: "/assets/flowers/bloom-sprig.png" },
] as const;
const GARDEN_CAROUSEL_LOOP_COUNT = 7;
const GARDEN_CAROUSEL_MIDDLE_LAYER = Math.floor(GARDEN_CAROUSEL_LOOP_COUNT / 2);
const loopedGardenCarouselCards = Array.from({ length: GARDEN_CAROUSEL_LOOP_COUNT }, () => gardenCarouselCards).flat();
const GARDEN_CAROUSEL_FOCUS_OFFSET = .24;

function GardenPetalCarousel() {
  const cardCount = gardenCarouselCards.length;
  const middleStart = cardCount * GARDEN_CAROUSEL_MIDDLE_LAYER;
  const [selected, setSelected] = useState(middleStart);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollFrame = useRef<number | null>(null);
  const recenterTimer = useRef<number | null>(null);
  const isRecentering = useRef(false);
  const centerCard = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    if (recenterTimer.current !== null) {
      window.clearTimeout(recenterTimer.current);
      recenterTimer.current = null;
    }
    const node = carouselRef.current;
    const targetIndex = index < 0
      ? middleStart + (((index % cardCount) + cardCount) % cardCount)
      : index >= loopedGardenCarouselCards.length
        ? middleStart + (index % cardCount)
        : index;
    const card = node?.children[targetIndex] as HTMLElement | undefined;
    if (!node || !card) return;
    node.scrollTo({ left: card.offsetLeft - ((node.clientWidth - card.offsetWidth) * GARDEN_CAROUSEL_FOCUS_OFFSET), behavior });
    setSelected(targetIndex);
  }, [cardCount, middleStart]);
  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;
    const clearRecenterTimer = () => {
      if (recenterTimer.current !== null) {
        window.clearTimeout(recenterTimer.current);
        recenterTimer.current = null;
      }
    };
    const scrollToCard = (index: number) => {
      const card = node.children[index] as HTMLElement | undefined;
      if (!card) return;
      isRecentering.current = true;
      node.scrollTo({ left: card.offsetLeft - ((node.clientWidth - card.offsetWidth) * GARDEN_CAROUSEL_FOCUS_OFFSET), behavior: "auto" });
      setSelected(index);
      window.requestAnimationFrame(() => { isRecentering.current = false; });
    };
    const scheduleRecenter = (index: number) => {
      clearRecenterTimer();
      recenterTimer.current = window.setTimeout(() => {
        const normalizedIndex = middleStart + (((index % cardCount) + cardCount) % cardCount);
        if (normalizedIndex !== index) scrollToCard(normalizedIndex);
        recenterTimer.current = null;
      }, 260);
    };
    const updateSelected = () => {
      if (isRecentering.current) {
        scrollFrame.current = null;
        return;
      }
      const referenceCard = node.children[0] as HTMLElement | undefined;
      const referenceWidth = referenceCard?.offsetWidth ?? 0;
      const center = node.scrollLeft + ((node.clientWidth - referenceWidth) * GARDEN_CAROUSEL_FOCUS_OFFSET) + (referenceWidth / 2);
      let closest = 0;
      let distance = Number.POSITIVE_INFINITY;
      Array.from(node.children).forEach((child, index) => {
        const card = child as HTMLElement;
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const nextDistance = Math.abs(center - cardCenter);
        if (nextDistance < distance) { distance = nextDistance; closest = index; }
      });
      setSelected(closest);
      if (closest < cardCount || closest >= cardCount * (GARDEN_CAROUSEL_LOOP_COUNT - 1)) scheduleRecenter(closest);
      else clearRecenterTimer();
      scrollFrame.current = null;
    };
    const onScroll = () => {
      if (scrollFrame.current === null) scrollFrame.current = window.requestAnimationFrame(updateSelected);
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    window.requestAnimationFrame(() => centerCard(middleStart, "auto"));
    return () => {
      node.removeEventListener("scroll", onScroll);
      clearRecenterTimer();
      if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, [cardCount, centerCard, middleStart]);
  const move = (direction: number) => centerCard(selected + direction);
  const selectedIndex = ((selected % cardCount) + cardCount) % cardCount;
  const selectedCard = gardenCarouselCards[selectedIndex];
  return (
    <section className="garden-carousel-float" aria-label="Floral story carousel">
      <div className="garden-carousel-heading"><p className="eyebrow">A closer look</p></div>
      <div className="garden-carousel-stage">
        <div className="garden-carousel-window" ref={carouselRef}>
          {loopedGardenCarouselCards.map((card, index) => {
            const distance = Math.abs(index - selected);
            return <button className={`garden-carousel-card ${index === selected ? "is-selected" : ""}`} key={`${index}-${card.label}`} onClick={() => centerCard(index)} style={{ "--garden-card-scale": index === selected ? 1.08 : distance === 1 ? .88 : distance === 2 ? .72 : .58, "--garden-card-opacity": index === selected ? 1 : distance === 1 ? .72 : distance === 2 ? .48 : .28, "--garden-card-z": 8 - distance } as CSSProperties} type="button"><span className="garden-carousel-image"><img src={card.image} alt="" /></span><span className="garden-carousel-card-copy"><small>{card.label}</small><strong>{card.title}</strong></span></button>;
          })}
        </div>
        <aside className="garden-carousel-focus-copy" aria-live="polite">
          <small>{selectedCard.label}</small>
          <strong>{selectedCard.title}</strong>
          <p>{selectedCard.copy}</p>
        </aside>
      </div>
      <div className="garden-carousel-controls"><button onClick={() => move(-1)} type="button" aria-label="Previous floral card">←</button><span>{String(selectedIndex + 1).padStart(2, "0")} / 10</span><button onClick={() => move(1)} type="button" aria-label="Next floral card">→</button></div>
    </section>
  );
}

function GardenRouteGuide(_props: { active: number; progress: number }) {
  return <div className="garden-route-guide"><GardenPetalCarousel /></div>;
}

function GardenBody() {
  const [motion, setMotion] = useState({ active: 0, progress: 0, reveals: [1, 0, 0, 0] });
  useEffect(() => {
    let frame = 0;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const body = document.querySelector<HTMLElement>(".grand-body-garden");
        const sections = Array.from(document.querySelectorAll<HTMLElement>(".garden-section"));
        if (!body || !sections.length) return;
        const viewport = window.innerHeight;
        const focus = viewport * .42;
        const bodyRect = body.getBoundingClientRect();
        const progress = clamp((focus - bodyRect.top) / Math.max(bodyRect.height - viewport * .18, 1), 0, 1);
        let active = 0;
        let distance = Number.POSITIVE_INFINITY;
        const reveals = sections.map((section, index) => {
          const rect = section.getBoundingClientRect();
          const nextDistance = Math.abs(rect.top - focus);
          if (nextDistance < distance) { distance = nextDistance; active = index; }
          const entry = clamp((focus - rect.top + viewport * .42) / (viewport * .42), 0, 1);
          const exit = clamp((rect.bottom - focus + viewport * .18) / (viewport * .35), 0, 1);
          return Math.min(entry, exit);
        });
        const focusedIndex = sections.findIndex((section) => { const rect = section.getBoundingClientRect(); return rect.top <= focus && rect.bottom >= focus; });
        if (focusedIndex >= 0) active = focusedIndex;
        setMotion({ active, progress, reveals });
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); if (frame) window.cancelAnimationFrame(frame); };
  }, []);
  const sectionStyle = (index: number) => ({ "--garden-reveal": motion.reveals[index].toFixed(3), "--garden-rotate": `${(1 - motion.reveals[index]) * (index % 2 ? -3 : 3)}deg` } as CSSProperties);
  const motionStyle = (index: number, x: number, y: number, scale = .96) => { const phase = 1 - (motion.reveals[index] ?? 0); return { "--garden-motion-opacity": .2 + ((1 - phase) * .8), "--garden-motion-x": `${x * phase}px`, "--garden-motion-y": `${y * phase}px`, "--garden-motion-scale": 1 - ((1 - scale) * phase) } as CSSProperties; };
  return <div className="grand-body grand-body-garden"><GardenRouteGuide active={motion.active} progress={motion.progress} /><section className={`garden-section garden-story ${motion.active === 0 ? "is-active" : ""}`} id="story" style={sectionStyle(0)}><div className="garden-section-meta"><span>01 / THE OPENING</span><span>start on the left</span></div><div className="garden-story-copy garden-motion" style={motionStyle(0, -35, 22)}><p className="eyebrow">A garden in motion</p><h2>Begin where<br /><i>the petals open.</i></h2><p>One path, four chapters, and a day that slowly turns toward the people we love most.</p><div className="garden-story-notes"><article><span>Venue</span><strong>The Glasshouse, Ubud</strong><p>Open garden seating, soft shade, and a view of the late afternoon light.</p></article><article><span>Date</span><strong>17 October 2026</strong><p>Guests are welcome from 15:30 so the ceremony can begin on time.</p></article></div></div><div className="garden-story-art garden-motion" style={motionStyle(0, 30, 34, .94)}><img src="/assets/flowers/bloom-cluster.png" alt="Watercolor flower cluster" /><span>THE GLASSHOUSE / UBUD</span></div></section><section className={`garden-section garden-details ${motion.active === 1 ? "is-active" : ""}`} id="details" style={sectionStyle(1)}><div className="garden-section-meta"><span>02 / THE DETAILS</span><span>straight through the garden</span></div><div className="garden-details-copy garden-motion" style={motionStyle(1, -30, 25)}><p className="eyebrow">Everything in bloom</p><h2>Make room<br /><i>for the good things.</i></h2><p>Come as you are, stay close to the people you know, and leave a little time for the garden walk before dinner.</p></div><div className="garden-detail-list garden-motion" style={motionStyle(1, 30, 35, .95)}><article><span>01 / ARRIVE</span><strong>15:30</strong><p>Find a seat beneath the leaves and settle into the afternoon.</p></article><article><span>02 / PROMISE</span><strong>16:00</strong><p>The ceremony begins when the light turns soft.</p></article><article><span>03 / STAY</span><strong>18:30</strong><p>Dinner, music, and one more song before the night ends.</p></article></div><img className="garden-details-sprig garden-motion" style={motionStyle(1, 18, -20, .9)} src="/assets/flowers/bloom-sprig.png" alt="" /></section><section className={`garden-section garden-schedule ${motion.active === 2 ? "is-active" : ""}`} id="schedule" style={sectionStyle(2)}><div className="garden-section-meta"><span>03 / THE ROUTE</span><span>follow the light</span></div><div className="garden-schedule-art garden-motion" style={motionStyle(2, -28, 30, .92)}><img src="/assets/flowers/bloom-side-purple.png" alt="Watercolor purple flowers" /><span>17 / 10 / 26</span></div><div className="garden-schedule-copy garden-motion" style={motionStyle(2, 32, 24)}><p className="eyebrow">The programme</p><h2>Stay close<br /><i>to the light.</i></h2><div className="garden-schedule-list"><div><time>15:30</time><span>Garden doors open</span></div><div><time>16:00</time><span>The ceremony</span></div><div><time>17:00</time><span>Golden hour portraits</span></div><div><time>18:30</time><span>Dinner under the trees</span></div></div><p className="garden-schedule-note">The route is intentionally simple: welcome, vows, portraits, dinner, then an open evening with music under the trees.</p></div></section><section className={`garden-section garden-final ${motion.active === 3 ? "is-active" : ""}`} id="garden-final" style={sectionStyle(3)}><div className="garden-section-meta"><span>04 / THE AFTERGLOW</span><span>return to the left</span></div><img className="garden-final-art garden-motion" style={motionStyle(3, -24, 30, .92)} src="/assets/flowers/bloom-side-leaves.png" alt="Watercolor leaves" /><div className="garden-final-copy garden-motion" style={motionStyle(3, 28, 24)}><p className="eyebrow">The last petal</p><h2>Stay for<br /><i>the afterglow.</i></h2><p>When the path turns home, there will still be music, warm lights, and a little room on the dance floor.</p><div className="garden-final-highlights"><span>Late dinner</span><span>Garden lights</span><span>Open dance floor</span></div></div><span className="garden-final-mark garden-motion" style={motionStyle(3, 22, 15)}>N + R / 2026</span></section></div>;
}

function VellumBody() {
  return <div className="grand-body grand-body-vellum"><section className="vellum-story reveal" id="story"><div className="vellum-section-mark">01</div><div className="vellum-section-copy"><p className="eyebrow">A letter from us</p><h2>Every page<br /><i>kept leading here.</i></h2><p>We wanted this invitation to feel like a note passed between hands: transparent, personal, and full of the small details that made the day feel close.</p></div><div className="vellum-note-stack" aria-hidden="true"><span>first coffee</span><span>one promise</span><span>17.10.26</span></div></section><section className="vellum-details reveal" id="details"><div><p className="eyebrow">The details</p><h2>Soft layers,<br /><i>clear plans.</i></h2></div><div className="vellum-detail-grid"><article><span>WHERE</span><strong>The Glasshouse<br />Ubud, Bali</strong></article><article><span>WHEN</span><strong>Saturday<br />17 October 2026</strong></article><article><span>DRESS</span><strong>Garden formal<br />warm neutrals</strong></article></div></section><section className="vellum-schedule reveal" id="schedule"><div className="vellum-schedule-card"><span>15:30</span><strong>Arrive slowly</strong><p>Doors open, paper notes, and a little time to find your table.</p></div><div className="vellum-schedule-card"><span>16:00</span><strong>The promise</strong><p>Vows in the garden, held in the softest part of the afternoon.</p></div><div className="vellum-schedule-card"><span>18:30</span><strong>Dinner glows</strong><p>Shared plates, warm lights, and one last page before the evening opens.</p></div></section></div>;
}

function TideBody() {
  return <div className="grand-body grand-body-tide"><section className="tide-story reveal" id="story"><div><p className="eyebrow">A shoreline note</p><h2>The light came in<br /><i>like water.</i></h2><p>Our story has always moved in waves: a first hello, a long pause, and then the easy certainty that this was the person we wanted beside us.</p></div><div className="tide-story-mark" aria-hidden="true"><span>NR</span><strong>15</strong></div></section><section className="tide-details reveal" id="details"><div className="tide-detail-panel"><span>WHERE</span><strong>The Glasshouse<br />Ubud, Bali</strong><p>A garden venue with open air, late light, and enough room for everyone we love.</p></div><div className="tide-detail-panel"><span>WHEN</span><strong>Saturday<br />17 October 2026</strong><p>Guests may arrive from 15:30. The vows begin at 16:00 WITA.</p></div><div className="tide-detail-panel"><span>MOOD</span><strong>Coastal formal<br />soft blue accents</strong><p>Light layers, relaxed tailoring, and comfortable shoes for the evening.</p></div></section><section className="tide-schedule reveal" id="schedule"><div className="tide-schedule-copy"><p className="eyebrow">The tide table</p><h2>Stay with<br /><i>the rhythm.</i></h2></div><div className="tide-timeline"><div><time>15:30</time><span>Arrival current</span></div><div><time>16:00</time><span>Vows by the garden</span></div><div><time>17:30</time><span>Blue hour portraits</span></div><div><time>18:30</time><span>Dinner and dancing</span></div></div></section></div>;
}

function CurtainBody() {
  return <div className="grand-body grand-body-curtain"><section className="curtain-story reveal" id="story"><div><p className="eyebrow">Opening night</p><h2>The room quiets<br /><i>before the yes.</i></h2><p>Guests arrive through a warm lobby moment, then the invitation opens into a stage-like celebration with dramatic pacing and clear details.</p></div><div className="curtain-program" aria-hidden="true"><span>ACT I</span><strong>VOWS</strong><small>16:00 WITA</small></div></section><section className="curtain-details reveal" id="details"><article><span>VENUE</span><strong>The Glasshouse, Ubud</strong><p>Soft garden lighting arranged like a private evening performance.</p></article><article><span>DRESS</span><strong>Evening formal</strong><p>Deep neutrals, satin accents, and comfortable shoes for the afterparty.</p></article><article><span>SEATING</span><strong>Open from 15:30</strong><p>Arrive early for welcome drinks before the curtain rises.</p></article></section><section className="curtain-schedule reveal" id="schedule"><p className="eyebrow">Programme</p><div><time>15:30</time><span>Lobby drinks</span></div><div><time>16:00</time><span>Ceremony curtain</span></div><div><time>18:30</time><span>Dinner and speeches</span></div><div><time>20:00</time><span>Encore dancing</span></div></section></div>;
}

function FolioBody() {
  return <div className="grand-body grand-body-folio"><section className="folio-story reveal" id="story"><div className="folio-section-index">01</div><div><p className="eyebrow">A folded note</p><h2>Open each panel<br /><i>and keep the date.</i></h2><p>This template treats the invitation like a collected object: measured, tactile, and built around panels that reveal the story piece by piece.</p></div><div className="folio-object" aria-hidden="true"><span>NR</span><strong>17</strong><small>PRIVATE FOLIO</small></div></section><section className="folio-details reveal" id="details"><div><span>WHERE</span><strong>The Glasshouse<br />Ubud, Bali</strong></div><div><span>WHEN</span><strong>Saturday<br />17 October 2026</strong></div><div><span>NOTE</span><strong>Garden formal<br />muted greens</strong></div></section><section className="folio-schedule reveal" id="schedule"><div className="folio-schedule-copy"><p className="eyebrow">Inside the folio</p><h2>A quiet sequence<br /><i>for the day.</i></h2></div><div className="folio-schedule-list"><div><time>15:30</time><span>Welcome panel</span></div><div><time>16:00</time><span>The promise</span></div><div><time>17:30</time><span>Portrait interval</span></div><div><time>18:30</time><span>Dinner fold</span></div></div></section></div>;
}

function SignalBody() {
  const [active, setActive] = useState(0);
  const cards = [
    ["01", "First ping", "A short note arrives before the ceremony: come early, keep your phone away, and settle into the garden light."],
    ["02", "Live venue", "The Glasshouse opens from 15:30 with a welcome bar, seating guides, and a quiet corner for family portraits."],
    ["03", "Final send", "Dinner starts at 18:30, speeches are kept warm and brief, then the dance floor opens without another announcement."],
  ] as const;
  return <div className="grand-body grand-body-signal">
    <section className="signal-story reveal" id="story"><div className="signal-story-meter" aria-hidden="true"><span /><span /><span /><span /></div><div><p className="eyebrow">A modern pulse</p><h2>Every signal<br /><i>points here.</i></h2><p>Nara and Raka wanted the invitation to feel alive: part announcement, part event console, with small moments that respond when guests interact.</p></div><aside><strong>19</strong><span>active template</span><p>Inspired by orbit motion, live markers, and the layered pace of the newer grand templates.</p></aside></section>
    <section className="signal-details reveal" id="details">{cards.map((card, index) => <button className={`signal-detail-card ${active === index ? "is-active" : ""}`} key={card[0]} onClick={() => setActive(index)} type="button"><small>{card[0]}</small><strong key={`signal-card-${active}-${index}`} className={active === index ? "is-wiggle" : ""}>{card[1]}</strong><p>{card[2]}</p></button>)}</section>
    <section className="signal-schedule reveal" id="schedule"><div><p className="eyebrow">Transmission plan</p><h2>Clear timing,<br /><i>no static.</i></h2></div><div className="signal-schedule-console"><div><time>15:30</time><span>Doors online</span><p>Welcome drinks, seating checks, and one slow walk through the garden.</p></div><div><time>16:00</time><span>Vows live</span><p>The ceremony begins with family close and the afternoon light behind us.</p></div><div><time>18:30</time><span>Dinner channel</span><p>Shared plates, speeches, cake, and a late playlist under warm fixtures.</p></div></div></section>
  </div>;
}

function GridlineBody() {
  const [active, setActive] = useState("venue");
  const [reelWiggle, setReelWiggle] = useState(0);
  return <div className="grand-body grand-body-gridline">
    <section className="gridline-story reveal" id="story"><div className="gridline-story-card"><span>01</span><h2>Designed like<br /><i>a keepsake system.</i></h2></div><div className="gridline-story-copy"><p className="eyebrow">Modern editorial</p><p>This layout borrows the confidence of gallery cards, the order of folio panels, and the tactile feeling of paper blocks, then tightens them into a clean modern invitation.</p><p>Every section uses a different composition: a large opening card, a selectable information board, and a stacked day plan.</p></div><button className="gridline-photo-reel" onClick={() => setReelWiggle((value) => value + 1)} type="button" aria-label="Animate vertical wedding photo reel"><span className="gridline-reel-label">Photo reel</span><span key={reelWiggle} className={`gridline-photo-track ${reelWiggle ? "is-reel-wiggle" : ""}`}><span className="gridline-reel-frame"><img src="/assets/images/bloom-couple.webp" alt="" /></span><span className="gridline-reel-frame gridline-reel-type"><strong>N + R</strong><small>17 OCT</small></span><span className="gridline-reel-frame"><img src="/assets/flowers/bloom-cluster.png" alt="" /></span><span className="gridline-reel-frame gridline-reel-note"><strong>UBUD</strong><small>soft light</small></span><span className="gridline-reel-frame"><img src="/assets/flowers/bloom-cover-cluster.png" alt="" /></span><span className="gridline-reel-frame"><img src="/assets/images/bloom-couple.webp" alt="" /></span><span className="gridline-reel-frame gridline-reel-type"><strong>N + R</strong><small>17 OCT</small></span><span className="gridline-reel-frame"><img src="/assets/flowers/bloom-cluster.png" alt="" /></span><span className="gridline-reel-frame gridline-reel-note"><strong>UBUD</strong><small>soft light</small></span><span className="gridline-reel-frame"><img src="/assets/flowers/bloom-cover-cluster.png" alt="" /></span></span></button></section>
    <section className="gridline-details reveal" id="details"><div className="gridline-background-carousel" aria-hidden="true"><div className="gridline-background-track"><span>Venue / The Glasshouse</span><span>Dress / Garden formal</span><span>Arrival / 15:30</span><span>Vows / 16:00</span><span>Dinner / 18:30</span><span>RSVP / 01 September</span><span>Venue / The Glasshouse</span><span>Dress / Garden formal</span><span>Arrival / 15:30</span><span>Vows / 16:00</span><span>Dinner / 18:30</span><span>RSVP / 01 September</span></div><div className="gridline-background-track gridline-background-track-alt"><span>Ubud, Bali</span><span>Modern neutrals</span><span>Welcome drinks</span><span>Garden ceremony</span><span>Shared plates</span><span>Late playlist</span><span>Ubud, Bali</span><span>Modern neutrals</span><span>Welcome drinks</span><span>Garden ceremony</span><span>Shared plates</span><span>Late playlist</span></div></div><div className="gridline-detail-foreground"><div className="gridline-detail-tabs"><button className={active === "venue" ? "is-active" : ""} onClick={() => setActive("venue")} type="button">Venue</button><button className={active === "dress" ? "is-active" : ""} onClick={() => setActive("dress")} type="button">Dress</button><button className={active === "note" ? "is-active" : ""} onClick={() => setActive("note")} type="button">Note</button></div><article className="gridline-detail-board"><span key={active} className="is-wiggle">{active === "venue" ? "The Glasshouse / Ubud, Bali" : active === "dress" ? "Modern garden formal" : "Please arrive before 16:00"}</span><p>{active === "venue" ? "A semi-outdoor venue with an open garden ceremony, covered dinner area, and a late-night music corner." : active === "dress" ? "Structured silhouettes, calm neutrals, black, white, moss, silver, and one confident accent color are welcome." : "The day is intentionally paced. Give yourself time for welcome drinks and a seat before the processional."}</p></article></div></section>
    <section className="gridline-schedule reveal" id="schedule"><p className="eyebrow">Ordered cards</p><div className="gridline-schedule-stack"><article><time>15:30</time><strong>Arrival</strong><p>Guest list check, welcome drink, and family table markers.</p></article><article><time>16:00</time><strong>Ceremony</strong><p>Garden vows, short reading, and a group photo before sunset.</p></article><article><time>18:30</time><strong>Dinner</strong><p>Shared plates, speeches, first dance, and a slow open floor.</p></article><article><time>20:30</time><strong>Afterglow</strong><p>Late playlist, dessert station, and one last toast before closing.</p></article></div></section>
  </div>;
}

function GrandRsvp({ onOpen }: { onOpen: () => void }) {
  return <section className="grand-rsvp reveal" id="rsvp"><div className="grand-rsvp-ring" /><div className="grand-rsvp-content"><p className="eyebrow">The final chapter is yours</p><h2>Will you<br /><i>be there?</i></h2><p>Save a little room in your calendar and a lot of room on the dance floor.</p><button className="rsvp-button" onClick={onOpen} type="button">Reserve your place <span>↗</span></button></div><span className="grand-rsvp-code">NR—10 / 26</span></section>;
}

function GrandBody({ theme, onOpen }: { theme: Theme; onOpen: () => void }) {
  return <>{theme.id === "aurora" && <AuroraBody />}{theme.id === "atlas" && <AtlasBody />}{theme.id === "luna" && <LunaBody />}{theme.id === "gallery" && <GalleryBody />}{theme.id === "orbit" && <OrbitBody />}{theme.id === "bloom" && <BloomBody />}{theme.id === "depth" && <DepthBody />}{theme.id === "garden" && <GardenBody />}{theme.id === "vellum" && <VellumBody />}{theme.id === "tide" && <TideBody />}{theme.id === "curtain" && <CurtainBody />}{theme.id === "folio" && <FolioBody />}{theme.id === "signal" && <SignalBody />}{theme.id === "gridline" && <GridlineBody />}<GrandRsvp onOpen={onOpen} /></>;
}

function RsvpSection({ onOpen }: { onOpen: () => void }) {
  return <section className="rsvp-section reveal" id="rsvp"><div className="rsvp-orbit orbit-one" /><div className="rsvp-orbit orbit-two" /><div className="rsvp-copy"><p className="eyebrow">05 / We hope you can make it</p><h2>Save us<br /><i>a seat in your heart.</i></h2><p>Kindly reply by 01 September 2026 so we can save you the good cake.</p><button className="rsvp-button" onClick={onOpen} type="button">RSVP now <span>↗</span></button></div><div className="rsvp-mark">N<br /><span>+</span><br />R</div></section>;
}

function RsvpModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="rsvp-modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-title"><button className="modal-close" onClick={onClose} type="button" aria-label="Close RSVP">×</button>{sent ? <div className="success-state"><span className="success-icon">✦</span><p className="eyebrow">You are on the list</p><h2>Thank you,<br /><i>we’ll see you there.</i></h2><p>Your RSVP has been tucked safely into our little wedding plans.</p><button className="text-link" onClick={onClose} type="button">Close this note ↗</button></div> : <><p className="eyebrow">A tiny favor</p><h2 id="rsvp-title">Will you<br /><i>join us?</i></h2><form onSubmit={submit}><label>Your name<input required name="name" placeholder="Type your name" /></label><label>Will you be there?<select defaultValue="yes" name="attendance"><option value="yes">Joyfully, yes!</option><option value="maybe">I’m not sure yet</option><option value="no">Sending love from afar</option></select></label><label>A note for us <textarea name="note" placeholder="Leave a little message (optional)" rows={3} /></label><button className="rsvp-button" type="submit">Send RSVP <span>↗</span></button></form></>}</div></div>;
}

export default function Home({ initialThemeId = "aurora", previewOnly = false }: { initialThemeId?: string; previewOnly?: boolean } = {}) {
  const initialTheme = (themes.some((item) => item.id === initialThemeId) ? initialThemeId : "aurora") as ThemeId;
  const [activeTheme, setActiveTheme] = useState<ThemeId>(initialTheme);
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [coverOpening, setCoverOpening] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<MarketplaceFilter>("all");
  const theme = useMemo(() => themes.find((item) => item.id === activeTheme) ?? themes[0], [activeTheme]);
  useEffect(() => { document.documentElement.style.setProperty("--theme-accent", theme.accent); document.documentElement.style.setProperty("--theme-soft", theme.soft); }, [theme]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        document.documentElement.style.setProperty("--template-scroll", progress.toFixed(4));
        document.documentElement.style.setProperty("--template-scroll-y", `${Math.round(window.scrollY * .08)}px`);
        document.documentElement.style.setProperty("--template-scroll-inverse", `${Math.round(window.scrollY * -.05)}px`);
        document.documentElement.style.setProperty("--template-scroll-soft-y", `${Math.round(window.scrollY * .028)}px`);
        document.documentElement.style.setProperty("--template-scroll-soft-inverse", `${Math.round(window.scrollY * -.022)}px`);
        document.documentElement.style.setProperty("--template-scroll-micro-y", `${Math.round(window.scrollY * .014)}px`);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); if (frame) window.cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const resetTimer = window.setTimeout(() => {
      setInvitationOpen(false);
      setCoverOpening(false);
    }, 0);
    return () => window.clearTimeout(resetTimer);
  }, [activeTheme]);
  useEffect(() => { const nodes = document.querySelectorAll<HTMLElement>(".reveal"); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.1 }); nodes.forEach((node) => observer.observe(node)); return () => observer.disconnect(); }, [activeTheme, invitationOpen]);
  const openInvitation = () => {
    if (coverOpening) return;
    setCoverOpening(true);
    window.setTimeout(() => {
      setInvitationOpen(true);
      setCoverOpening(false);
    }, 980);
  };
  const hasOpeningCover = coverThemes.some((item) => item.id === theme.id);
  const templateContent = theme.id === "book" ? <BookTemplate theme={theme} onOpenRsvp={() => setModalOpen(true)} /> : hasOpeningCover && !invitationOpen ? <OpeningCover theme={theme} opening={coverOpening} onOpen={openInvitation} /> : <>{theme.collection === "grand" ? <><Hero theme={theme} /><GrandBody theme={theme} onOpen={() => setModalOpen(true)} /></> : <><Hero theme={theme} /><StorySection theme={theme} /><EventSection theme={theme} /><TimelineSection /><MomentsSection theme={theme} /><RsvpSection onOpen={() => setModalOpen(true)} /></>}</>;
  if (!previewOnly) {
    return <main className={`site-shell theme-${theme.id} marketplace-page`}>
      <MarketplaceHeader musicOn={musicOn} onToggleMusic={() => setMusicOn(!musicOn)} />
      {theme.id === "bloom" && <BloomFloatingOrnaments />}
      <MarketplaceHero theme={theme} onChange={setActiveTheme} />
      <MarketplaceCatalog active={activeTheme} filter={catalogFilter} onChange={setActiveTheme} onFilter={setCatalogFilter} />
      <MarketplacePackages />
      <MarketplaceProcess />
      <TemplateCarousel active={activeTheme} onChange={setActiveTheme} />
      <MarketplacePreviewIntro theme={theme} />
      <ThemeSelector active={activeTheme} onChange={setActiveTheme} />
      <div className="theme-meta"><span>Current direction / <strong>{theme.number} - {theme.label}</strong></span><span>{hasOpeningCover && !invitationOpen ? "Click the invitation to enter" : theme.collection === "grand" ? "Grand modern collection" : "Editorial collection"} <b>v</b></span></div>
      {templateContent}
      <footer className="site-footer"><Monogram label="W / I" /><span>Marketplace-ready wedding invitation studio.</span><a href="#top">Back to top</a></footer>
      {modalOpen && <RsvpModal onClose={() => setModalOpen(false)} />}
    </main>;
  }
   return <main className={`site-shell theme-${theme.id} ${previewOnly ? "is-template-preview" : ""}`}>
    {previewOnly ? <Link className="template-back-button" href="/" aria-label="Back to template list">Back to templates</Link> : <header className="site-header"><a className="brand" href="#top" aria-label="Back to top"><span className="brand-mark">N<span>+</span>R</span><span className="brand-name">Wedding Invitation Studio</span></a><nav className="main-nav" aria-label="Main navigation"><a href="#story">Story</a><a href="#details">Details</a><a href="#schedule">Schedule</a><a href="#rsvp">RSVP</a></nav><button className={`music-toggle ${musicOn ? "is-playing" : ""}`} onClick={() => setMusicOn(!musicOn)} type="button"><span className="music-bars"><i /><i /><i /></span>{musicOn ? "Music on" : "Play music"}</button></header>}
    <div id="top" />
    {!previewOnly && theme.id === "bloom" && <BloomFloatingOrnaments />}
    {!previewOnly && <ThemeSelector active={activeTheme} onChange={setActiveTheme} />}
    {!previewOnly && <div className="theme-meta"><span>Current direction / <strong>{theme.number} — {theme.label}</strong></span><span>{hasOpeningCover && !invitationOpen ? "Click the invitation to enter" : theme.collection === "grand" ? "Grand modern collection" : "Editorial collection"} <b>↓</b></span></div>}
    {templateContent}
    {!previewOnly && <footer className="site-footer"><Monogram /><span>Made with the people we love in mind.</span><a href="#top">Back to top ↑</a></footer>}
    {modalOpen && <RsvpModal onClose={() => setModalOpen(false)} />}
  </main>;
}
