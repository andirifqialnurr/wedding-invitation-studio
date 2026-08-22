import Link from "next/link";
import { servicePackages } from "../marketplace-data";

export default function CustomPage() {
  const customPackage = servicePackages[1];
  return <main className="custom-shell">
    <header><Link href="/">Back to marketplace</Link><Link href="/#packages">Lihat paket</Link></header>
    <section className="custom-hero">
      <div>
        <p className="eyebrow">Pesan dibuatkan</p>
        <h1>Undangan custom dari cerita, moodboard, dan kebutuhan acara.</h1>
        <p>Gunakan jalur ini saat pasangan atau wedding planner ingin desain yang tidak sekadar mengganti template: struktur section, warna, foto, tone copy, dan fitur RSVP bisa diarahkan sejak brief awal.</p>
        <Link className="custom-link" href="/order/aurora">Mulai brief custom</Link>
      </div>
      <aside className="custom-panel">
        <h2>{customPackage.name}</h2>
        <ul>{customPackage.items.map((item) => <li key={item}>{item}</li>)}</ul>
        <p>{customPackage.price} - estimasi {customPackage.timeline}</p>
      </aside>
    </section>
  </main>;
}
