"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { getMarketplaceProduct, getTemplateLabel } from "../../marketplace-data";

export default function OrderClient({ templateId }: { templateId: string }) {
  const [sent, setSent] = useState(false);
  const product = getMarketplaceProduct(templateId);
  const label = getTemplateLabel(product.id);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return <main className="order-shell">
    <header><Link href="/">Back to marketplace</Link><Link href={`/template/${product.id}`}>Preview template</Link></header>
    <section className="order-content">
      <div className="order-summary">
        <p className="eyebrow">Checkout template</p>
        <h1>{label}</h1>
        <p>Lengkapi brief awal agar template bisa disesuaikan menjadi undangan digital siap sebar. Halaman ini disiapkan sebagai front-end order flow marketplace.</p>
        <div className={`carousel-art art-${product.id}`}><span className="art-number">{product.id}</span><span className="art-symbol">W + I</span></div>
        <div className="order-facts"><div><span>Harga</span><strong>{product.price}</strong></div><div><span>Estimasi</span><strong>{product.delivery}</strong></div><div><span>Untuk</span><strong>{product.audience}</strong></div></div>
      </div>
      {sent ? <div className="order-success"><h2>Brief diterima.</h2><p>Simulasi order berhasil. Pada implementasi backend, bagian ini bisa diarahkan ke pembayaran, WhatsApp admin, atau dashboard pesanan.</p></div> : <form className="order-form" onSubmit={submit}>
        <h2>Data pemesanan</h2>
        <label>Nama pemesan<input required name="name" placeholder="Nama lengkap" /></label>
        <label>Email atau WhatsApp<input required name="contact" placeholder="email@domain.com / 08..." /></label>
        <label>Paket<select defaultValue="Template Ready" name="package"><option>Template Ready</option><option>Made For You</option><option>Concierge Event</option></select></label>
        <label>Tanggal acara<input name="eventDate" type="date" /></label>
        <label>Catatan brief<textarea name="brief" placeholder="Nama pasangan, lokasi, warna, musik, kebutuhan RSVP, dan link referensi." rows={5} /></label>
        <button className="order-primary" type="submit">Kirim brief order</button>
      </form>}
    </section>
  </main>;
}
