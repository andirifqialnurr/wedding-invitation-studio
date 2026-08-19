"use client";

import { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";

type ThemeId = "botanical" | "modern" | "film" | "paper" | "quiet" | "aurora" | "atlas" | "luna" | "gallery" | "orbit" | "bloom" | "depth" | "garden";
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
];

const timeline = [
  ["15:30", "Garden doors open", "Find a seat, take a breath, and say hello."],
  ["16:00", "The ceremony", "A short walk, a long promise, and two very happy people."],
  ["17:00", "Drinks & photographs", "Golden hour portraits with the people we love."],
  ["18:30", "Dinner under the trees", "Shared plates, a first dance, and stories until late."],
] as const;

function ThemeSelector({ active, onChange }: { active: ThemeId; onChange: (id: ThemeId) => void }) {
  return <div className="theme-selector" aria-label="Choose an invitation style"><span className="selector-label">Explore thirteen directions</span><div className="theme-pills">{themes.map((theme) => <button className={`theme-pill ${active === theme.id ? "is-active" : ""}`} key={theme.id} onClick={() => onChange(theme.id)} type="button"><span>{theme.number}</span> {theme.label}</button>)}</div></div>;
}

function CarouselArtwork({ theme, compact = false }: { theme: Theme; compact?: boolean }) {
  return <div className={`carousel-art art-${theme.id} ${compact ? "is-compact" : ""}`}><span className="art-number">{theme.number}</span><span className="art-symbol">{theme.id === "atlas" ? "↗" : theme.id === "luna" ? "☾" : theme.id === "orbit" ? "◎" : theme.id === "gallery" ? "▦" : theme.id === "aurora" ? "✦" : theme.id === "bloom" ? "✿" : theme.id === "depth" ? "◫" : theme.id === "garden" ? "❊" : "N + R"}</span></div>;
}

function TemplateCarousel({ active, onChange }: { active: ThemeId; onChange: (id: ThemeId) => void }) {
  const activeIndex = themes.findIndex((theme) => theme.id === active);
  const previous = themes[(activeIndex - 1 + themes.length) % themes.length];
  const next = themes[(activeIndex + 1) % themes.length];
  const select = (theme: Theme) => onChange(theme.id);
  return <section className="template-carousel reveal is-visible" aria-label="Template carousel">
    <div className="carousel-heading"><div><p className="eyebrow">A marketplace-ready starting point</p><h2>Choose your<br /><i>first impression.</i></h2></div><p className="carousel-description">Thirteen distinct invitation directions, built with the same flexible content foundation. Swap the template, music, colors, and story later.</p></div>
    <div className="carousel-stage">
      <button className="carousel-side carousel-prev" onClick={() => select(previous)} type="button" aria-label={`Previous template: ${previous.label}`}><CarouselArtwork theme={previous} compact /><span className="side-label">← {previous.label}</span></button>
      <div className={`carousel-feature feature-${active}`}><div className="feature-art"><CarouselArtwork theme={themes[activeIndex]} /><span className="feature-glow" /></div><div className="feature-copy"><div className="feature-topline"><span>{themes[activeIndex].number} / 10</span><span className="collection-label">{themes[activeIndex].collection} collection</span></div><h3>{themes[activeIndex].label}</h3><p>{themes[activeIndex].kicker}</p><button className="feature-cta" onClick={() => (document.getElementById("invitation") ?? document.querySelector(".hero"))?.scrollIntoView({ behavior: "smooth" })} type="button">Preview template <span>↗</span></button></div></div>
      <button className="carousel-side carousel-next" onClick={() => select(next)} type="button" aria-label={`Next template: ${next.label}`}><CarouselArtwork theme={next} compact /><span className="side-label">{next.label} →</span></button>
    </div>
    <div className="carousel-controls"><button onClick={() => select(previous)} type="button" aria-label="Previous template">←</button><div className="carousel-dots">{themes.map((theme, index) => <button className={active === theme.id ? "is-active" : ""} key={theme.id} onClick={() => select(theme)} type="button" aria-label={`Go to template ${index + 1}`}><span /></button>)}</div><span className="carousel-count">{String(activeIndex + 1).padStart(2, "0")} <i>/ 13</i></span><button onClick={() => select(next)} type="button" aria-label="Next template">→</button></div>
  </section>;
}

function Monogram({ label = "N / R" }: { label?: string }) { return <div className="monogram">{label}</div>; }

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
  switch (theme.id) { case "modern": return <ModernHero theme={theme} />; case "film": return <FilmHero theme={theme} />; case "paper": return <PaperHero theme={theme} />; case "quiet": return <QuietHero theme={theme} />; case "aurora": return <AuroraHero theme={theme} />; case "atlas": return <AtlasHero theme={theme} />; case "luna": return <LunaHero theme={theme} />; case "gallery": return <GalleryHero theme={theme} />; case "orbit": return <OrbitHero theme={theme} />; case "bloom": return <BloomHero theme={theme} />; case "depth": return <DepthHero theme={theme} />; case "garden": return <GardenHero theme={theme} />; default: return <BotanicalHero theme={theme} />; }
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

const gardenRoutePoints = [[17, 7], [82, 24], [82, 57], [19, 75], [19, 94]] as const;
const gardenCarouselCards = [
  { label: "The opening", title: "Soft beginnings", copy: "The first light, the first hello, and every petal opening around us.", image: "/assets/flowers/bloom-cluster.png" },
  { label: "The details", title: "Good things", copy: "Small details, warm tables, and room for everyone we love.", image: "/assets/flowers/bloom-side-bouquet.png" },
  { label: "The ceremony", title: "A long promise", copy: "A short walk beneath the trees, then a lifetime in one room.", image: "/assets/flowers/bloom-side-purple.png" },
  { label: "The afterglow", title: "Stay awhile", copy: "When the lights go low, the best part is only beginning.", image: "/assets/flowers/bloom-side-leaves.png" },
] as const;

function GardenPetalCarousel() {
  const [selected, setSelected] = useState(1);
  const move = (direction: number) => setSelected((current) => (current + direction + gardenCarouselCards.length) % gardenCarouselCards.length);
  return <section className="garden-carousel-float" aria-label="Floral story carousel"><div className="garden-carousel-heading"><p className="eyebrow">A closer look</p><span>tap a bloom to bring it forward</span></div><div className="garden-carousel-window">{gardenCarouselCards.map((card, index) => { let offset = index - selected; if (offset > 2) offset -= gardenCarouselCards.length; if (offset < -2) offset += gardenCarouselCards.length; const distance = Math.abs(offset); return <button className={`garden-carousel-card ${offset === 0 ? "is-selected" : ""}`} key={card.label} onClick={() => setSelected(index)} style={{ "--garden-card-x": `${offset * 31}vw`, "--garden-card-scale": offset === 0 ? 1.08 : distance === 1 ? .82 : .62, "--garden-card-opacity": offset === 0 ? 1 : distance === 1 ? .72 : .35, "--garden-card-z": 4 - distance } as CSSProperties} type="button"><span className="garden-carousel-image"><img src={card.image} alt="" /></span><span className="garden-carousel-card-copy"><small>{card.label}</small><strong>{card.title}</strong><em>{card.copy}</em></span></button>; })}</div><div className="garden-carousel-controls"><button onClick={() => move(-1)} type="button" aria-label="Previous floral card">←</button><span>{String(selected + 1).padStart(2, "0")} / 04</span><button onClick={() => move(1)} type="button" aria-label="Next floral card">→</button></div></section>;
}

function gardenRoutePoint(progress: number) {
  const lengths = gardenRoutePoints.slice(1).map((point, index) => Math.hypot(point[0] - gardenRoutePoints[index][0], point[1] - gardenRoutePoints[index][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let distance = Math.max(0, Math.min(total, progress * total));
  for (let index = 0; index < lengths.length; index += 1) {
    if (distance <= lengths[index]) { const ratio = lengths[index] ? distance / lengths[index] : 0; return { x: gardenRoutePoints[index][0] + ((gardenRoutePoints[index + 1][0] - gardenRoutePoints[index][0]) * ratio), y: gardenRoutePoints[index][1] + ((gardenRoutePoints[index + 1][1] - gardenRoutePoints[index][1]) * ratio) }; }
    distance -= lengths[index];
  }
  const last = gardenRoutePoints[gardenRoutePoints.length - 1];
  return { x: last[0], y: last[1] };
}

function GardenRouteGuide({ active, progress }: { active: number; progress: number }) {
  const point = gardenRoutePoint(progress);
  const guideStyle = { "--garden-marker-x": `${point.x}%`, "--garden-marker-y": `${point.y}%`, "--garden-marker-rotation": `${progress * 720}deg` } as CSSProperties;
  return <div className="garden-route-guide" style={guideStyle}><svg className="garden-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="garden-route-base" pathLength="1" d="M17 7 L82 24 L82 57 L19 75 L19 94" /><path className="garden-route-active" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} d="M17 7 L82 24 L82 57 L19 75 L19 94" /></svg>{gardenRoutePoints.slice(0, 4).map(([x, y], index) => <span className={`garden-route-node ${active === index ? "is-active" : ""}`} key={`${x}-${y}`} aria-hidden="true" style={{ left: `${x}%`, top: `${y}%` }} />)}<span className="garden-marker" aria-hidden="true"><span className="garden-marker-petals">{Array.from({ length: 6 }, (_, index) => <i key={index} style={{ "--garden-petal-angle": `${index * 60}deg` } as CSSProperties} />)}</span><b>✿</b></span><span className="garden-route-caption" aria-hidden="true">one path / four chapters</span><GardenPetalCarousel /></div>;
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
  return <div className="grand-body grand-body-garden"><GardenRouteGuide active={motion.active} progress={motion.progress} /><section className={`garden-section garden-story ${motion.active === 0 ? "is-active" : ""}`} id="story" style={sectionStyle(0)}><div className="garden-section-meta"><span>01 / THE OPENING</span><span>start on the left</span></div><div className="garden-story-copy garden-motion" style={motionStyle(0, -35, 22)}><p className="eyebrow">A garden in motion</p><h2>Begin where<br /><i>the petals open.</i></h2><p>One path, four chapters, and a day that slowly turns toward the people we love most.</p></div><div className="garden-story-art garden-motion" style={motionStyle(0, 30, 34, .94)}><img src="/assets/flowers/bloom-cluster.png" alt="Watercolor flower cluster" /><span>THE GLASSHOUSE / UBUD</span></div></section><section className={`garden-section garden-details ${motion.active === 1 ? "is-active" : ""}`} id="details" style={sectionStyle(1)}><div className="garden-section-meta"><span>02 / THE DETAILS</span><span>straight through the garden</span></div><div className="garden-details-copy garden-motion" style={motionStyle(1, -30, 25)}><p className="eyebrow">Everything in bloom</p><h2>Make room<br /><i>for the good things.</i></h2></div><div className="garden-detail-list garden-motion" style={motionStyle(1, 30, 35, .95)}><article><span>01 / ARRIVE</span><strong>15:30</strong><p>Find a seat beneath the leaves and settle into the afternoon.</p></article><article><span>02 / PROMISE</span><strong>16:00</strong><p>The ceremony begins when the light turns soft.</p></article><article><span>03 / STAY</span><strong>18:30</strong><p>Dinner, music, and one more song before the night ends.</p></article></div><img className="garden-details-sprig garden-motion" style={motionStyle(1, 18, -20, .9)} src="/assets/flowers/bloom-sprig.png" alt="" /></section><section className={`garden-section garden-schedule ${motion.active === 2 ? "is-active" : ""}`} id="schedule" style={sectionStyle(2)}><div className="garden-section-meta"><span>03 / THE ROUTE</span><span>follow the light</span></div><div className="garden-schedule-art garden-motion" style={motionStyle(2, -28, 30, .92)}><img src="/assets/flowers/bloom-side-purple.png" alt="Watercolor purple flowers" /><span>17 / 10 / 26</span></div><div className="garden-schedule-copy garden-motion" style={motionStyle(2, 32, 24)}><p className="eyebrow">The programme</p><h2>Stay close<br /><i>to the light.</i></h2><div className="garden-schedule-list"><div><time>15:30</time><span>Garden doors open</span></div><div><time>16:00</time><span>The ceremony</span></div><div><time>17:00</time><span>Golden hour portraits</span></div><div><time>18:30</time><span>Dinner under the trees</span></div></div></div></section><section className={`garden-section garden-final ${motion.active === 3 ? "is-active" : ""}`} id="garden-final" style={sectionStyle(3)}><div className="garden-section-meta"><span>04 / THE AFTERGLOW</span><span>return to the left</span></div><img className="garden-final-art garden-motion" style={motionStyle(3, -24, 30, .92)} src="/assets/flowers/bloom-side-leaves.png" alt="Watercolor leaves" /><div className="garden-final-copy garden-motion" style={motionStyle(3, 28, 24)}><p className="eyebrow">The last petal</p><h2>Stay for<br /><i>the afterglow.</i></h2><p>When the path turns home, there will still be music, warm lights, and a little room on the dance floor.</p></div><span className="garden-final-mark garden-motion" style={motionStyle(3, 22, 15)}>N + R / 2026</span></section></div>;
}

function GrandRsvp({ onOpen }: { onOpen: () => void }) {
  return <section className="grand-rsvp reveal" id="rsvp"><div className="grand-rsvp-ring" /><div className="grand-rsvp-content"><p className="eyebrow">The final chapter is yours</p><h2>Will you<br /><i>be there?</i></h2><p>Save a little room in your calendar and a lot of room on the dance floor.</p><button className="rsvp-button" onClick={onOpen} type="button">Reserve your place <span>↗</span></button></div><span className="grand-rsvp-code">NR—10 / 26</span></section>;
}

function GrandBody({ theme, onOpen }: { theme: Theme; onOpen: () => void }) {
  return <>{theme.id === "aurora" && <AuroraBody />}{theme.id === "atlas" && <AtlasBody />}{theme.id === "luna" && <LunaBody />}{theme.id === "gallery" && <GalleryBody />}{theme.id === "orbit" && <OrbitBody />}{theme.id === "bloom" && <BloomBody />}{theme.id === "depth" && <DepthBody />}{theme.id === "garden" && <GardenBody />}<GrandRsvp onOpen={onOpen} /></>;
}

function RsvpSection({ onOpen }: { onOpen: () => void }) {
  return <section className="rsvp-section reveal" id="rsvp"><div className="rsvp-orbit orbit-one" /><div className="rsvp-orbit orbit-two" /><div className="rsvp-copy"><p className="eyebrow">05 / We hope you can make it</p><h2>Save us<br /><i>a seat in your heart.</i></h2><p>Kindly reply by 01 September 2026 so we can save you the good cake.</p><button className="rsvp-button" onClick={onOpen} type="button">RSVP now <span>↗</span></button></div><div className="rsvp-mark">N<br /><span>+</span><br />R</div></section>;
}

function RsvpModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="rsvp-modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-title"><button className="modal-close" onClick={onClose} type="button" aria-label="Close RSVP">×</button>{sent ? <div className="success-state"><span className="success-icon">✦</span><p className="eyebrow">You are on the list</p><h2>Thank you,<br /><i>we’ll see you there.</i></h2><p>Your RSVP has been tucked safely into our little wedding plans.</p><button className="text-link" onClick={onClose} type="button">Close this note ↗</button></div> : <><p className="eyebrow">A tiny favor</p><h2 id="rsvp-title">Will you<br /><i>join us?</i></h2><form onSubmit={submit}><label>Your name<input required name="name" placeholder="Type your name" /></label><label>Will you be there?<select defaultValue="yes" name="attendance"><option value="yes">Joyfully, yes!</option><option value="maybe">I’m not sure yet</option><option value="no">Sending love from afar</option></select></label><label>A note for us <textarea name="note" placeholder="Leave a little message (optional)" rows={3} /></label><button className="rsvp-button" type="submit">Send RSVP <span>↗</span></button></form></>}</div></div>;
}

export default function Home() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("aurora");
  const [musicOn, setMusicOn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useMemo(() => themes.find((item) => item.id === activeTheme) ?? themes[0], [activeTheme]);
  useEffect(() => { document.documentElement.style.setProperty("--theme-accent", theme.accent); document.documentElement.style.setProperty("--theme-soft", theme.soft); }, [theme]);
  useEffect(() => { const nodes = document.querySelectorAll<HTMLElement>(".reveal"); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.1 }); nodes.forEach((node) => observer.observe(node)); return () => observer.disconnect(); }, [activeTheme]);
   return <main className={`site-shell theme-${theme.id}`}><header className="site-header"><a className="brand" href="#top" aria-label="Back to top"><span className="brand-mark">N<span>+</span>R</span><span className="brand-name">Wedding Invitation Studio</span></a><nav className="main-nav" aria-label="Main navigation"><a href="#story">Story</a><a href="#details">Details</a><a href="#schedule">Schedule</a><a href="#rsvp">RSVP</a></nav><button className={`music-toggle ${musicOn ? "is-playing" : ""}`} onClick={() => setMusicOn(!musicOn)} type="button"><span className="music-bars"><i /><i /><i /></span>{musicOn ? "Music on" : "Play music"}</button></header><div id="top" />{theme.id === "bloom" && <BloomFloatingOrnaments />}<ThemeSelector active={activeTheme} onChange={setActiveTheme} /><div className="theme-meta"><span>Current direction / <strong>{theme.number} — {theme.label}</strong></span><span>{theme.collection === "grand" ? "Grand modern collection" : "Editorial collection"} <b>↓</b></span></div><Hero theme={theme} />{theme.collection === "grand" ? <GrandBody theme={theme} onOpen={() => setModalOpen(true)} /> : <><StorySection theme={theme} /><EventSection theme={theme} /><TimelineSection /><MomentsSection theme={theme} /><RsvpSection onOpen={() => setModalOpen(true)} /></>}<footer className="site-footer"><Monogram /><span>Made with the people we love in mind.</span><a href="#top">Back to top ↑</a></footer>{modalOpen && <RsvpModal onClose={() => setModalOpen(false)} />}</main>;
}
