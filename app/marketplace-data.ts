export type MarketplaceProduct = {
  id: string;
  price: string;
  badge: string;
  delivery: string;
  audience: string;
  includes: string[];
};

export const marketplaceProducts: MarketplaceProduct[] = [
  { id: "botanical", price: "Rp 490.000", badge: "Soft classic", delivery: "2-3 hari", audience: "Garden intimate", includes: ["Cover digital", "Detail acara", "RSVP basic"] },
  { id: "modern", price: "Rp 520.000", badge: "Bold clean", delivery: "2-3 hari", audience: "Modern couple", includes: ["Layout modern", "Countdown", "RSVP basic"] },
  { id: "film", price: "Rp 540.000", badge: "Cinematic", delivery: "2-4 hari", audience: "Story driven", includes: ["Opening scene", "Timeline", "Photo section"] },
  { id: "paper", price: "Rp 500.000", badge: "Keepsake", delivery: "2-3 hari", audience: "Warm formal", includes: ["Paper style", "Detail acara", "RSVP basic"] },
  { id: "quiet", price: "Rp 510.000", badge: "Minimal", delivery: "2-3 hari", audience: "Elegant simple", includes: ["Clean cover", "Schedule", "Guest note"] },
  { id: "aurora", price: "Rp 790.000", badge: "Best seller", delivery: "3-5 hari", audience: "Grand immersive", includes: ["Motion hero", "Itinerary", "RSVP modal"] },
  { id: "atlas", price: "Rp 760.000", badge: "Destination", delivery: "3-5 hari", audience: "Travel wedding", includes: ["Map concept", "Itinerary", "Venue story"] },
  { id: "luna", price: "Rp 780.000", badge: "Evening mood", delivery: "3-5 hari", audience: "Night ceremony", includes: ["Cinematic cover", "Schedule", "RSVP modal"] },
  { id: "gallery", price: "Rp 820.000", badge: "Photo first", delivery: "3-5 hari", audience: "Visual archive", includes: ["Interactive cards", "Mosaic", "Timeline"] },
  { id: "orbit", price: "Rp 800.000", badge: "Kinetic", delivery: "3-5 hari", audience: "Editorial modern", includes: ["Animated visual", "Chronicle", "Program"] },
  { id: "bloom", price: "Rp 840.000", badge: "Floral motion", delivery: "4-6 hari", audience: "Romantic garden", includes: ["Watercolor assets", "Photo story", "RSVP modal"] },
  { id: "depth", price: "Rp 860.000", badge: "Layered", delivery: "4-6 hari", audience: "Premium story", includes: ["Layer motion", "Content panels", "Program"] },
  { id: "garden", price: "Rp 880.000", badge: "Petal route", delivery: "4-6 hari", audience: "Botanical grand", includes: ["Route motion", "Petal carousel", "Garden guide"] },
  { id: "vellum", price: "Rp 870.000", badge: "Letter feel", delivery: "4-6 hari", audience: "Soft editorial", includes: ["Vellum layers", "Schedule cards", "RSVP modal"] },
  { id: "tide", price: "Rp 850.000", badge: "Coastal", delivery: "4-6 hari", audience: "Beach inspired", includes: ["Wave motion", "Detail panels", "Timeline"] },
  { id: "curtain", price: "Rp 920.000", badge: "Opening cover", delivery: "5-7 hari", audience: "Dramatic reveal", includes: ["Open animation", "Stage details", "RSVP modal"] },
  { id: "folio", price: "Rp 900.000", badge: "Private folio", delivery: "5-7 hari", audience: "Architectural", includes: ["Fold reveal", "Panel story", "Schedule"] },
  { id: "book", price: "Rp 940.000", badge: "Interactive", delivery: "5-7 hari", audience: "Story archive", includes: ["Loose pages", "Focused detail", "RSVP modal"] },
  { id: "signal", price: "Rp 890.000", badge: "Live console", delivery: "4-6 hari", audience: "Tech modern", includes: ["Interactive cards", "Motion markers", "Program"] },
  { id: "gridline", price: "Rp 910.000", badge: "New release", delivery: "4-6 hari", audience: "Modular premium", includes: ["Grid panels", "Photo reel", "Detail tabs"] },
];

export const templateLabels: Record<string, string> = {
  botanical: "Botanical",
  modern: "Modern",
  film: "Film",
  paper: "Paper",
  quiet: "Quiet",
  aurora: "Aurora",
  atlas: "Atlas",
  luna: "Luna",
  gallery: "Gallery",
  orbit: "Orbit",
  bloom: "Bloom",
  depth: "Depth",
  garden: "Petal Route",
  vellum: "Vellum",
  tide: "Tide",
  curtain: "Curtain Call",
  folio: "Folio Gate",
  book: "Paper Scatter",
  signal: "Signal",
  gridline: "Gridline",
};

export const servicePackages = [
  { name: "Template Ready", price: "Mulai Rp 490.000", timeline: "2-3 hari", copy: "Pilih template, kirim data acara, lalu kami sesuaikan nama, foto, tanggal, lokasi, dan RSVP.", items: ["20 pilihan template", "Revisi minor 2x", "Link undangan siap sebar"] },
  { name: "Made For You", price: "Mulai Rp 1.500.000", timeline: "7-10 hari", copy: "Kami buatkan konsep visual undangan yang lebih personal dari moodboard, warna, dan cerita pasangan.", items: ["Arah desain khusus", "Section sesuai kebutuhan", "Revisi desain 3x"] },
  { name: "Concierge Event", price: "By quotation", timeline: "10-14 hari", copy: "Untuk wedding planner atau event besar yang butuh RSVP tamu, multi-acara, dan koordinasi konten.", items: ["Form RSVP lanjutan", "Segmentasi tamu", "Prioritas produksi"] },
] as const;

export const orderSteps = [
  ["01", "Pilih template", "Browse katalog, preview live, lalu pilih gaya undangan yang paling cocok."],
  ["02", "Kirim brief", "Isi data pasangan, acara, foto, musik, link maps, dan preferensi warna."],
  ["03", "Produksi", "Tim menyesuaikan konten dan motion sesuai paket yang dipilih."],
  ["04", "Publish", "Setelah revisi final, link undangan siap dibagikan ke tamu."],
] as const;

export function getMarketplaceProduct(id: string) {
  return marketplaceProducts.find((product) => product.id === id) ?? marketplaceProducts[0];
}

export function getTemplateLabel(id: string) {
  return templateLabels[id] ?? templateLabels.botanical;
}
