import PageHero from "@/components/PageHero";
import { Newspaper, Award, Calendar } from "lucide-react";

const ITEMS = [
  {
    date: "2026",
    tag: "Deployment",
    title: "Srisailam Brahmotsavam 2026 — Digital ID Pass at scale",
    body: "Successfully executed Digital ID Pass, Vehicle Pass, Darshan Pass, QR Verification, and Live Dashboard operations during the 2025 & 2026 Brahmotsavam.",
  },
  {
    date: "2026",
    tag: "Client Win",
    title: "Vemulawada — WhatsApp Business Platform live",
    body: "Sri Raja Rajeshwara Swamy Temple onboarded onto Aatreya's WhatsApp Communication Platform for seva notifications, donation messages, and daily temple updates.",
  },
  {
    date: "2025",
    tag: "Government",
    title: "Hon'ble Prime Minister visit — Srisailam",
    body: "Deployed the Police Digital ID Pass System, QR Security Passes, and Vehicle Pass Management for a special central government engagement.",
  },
  {
    date: "2023",
    tag: "Milestone",
    title: "Indrakeeladri — Vastra Prasadam digitization",
    body: "Sri Durga Malleswara Swamy Temple went live on saree photo capture, QR generation, and contractor management via RC No: K2/891/2023.",
  },
  {
    date: "2022",
    tag: "Foundation",
    title: "Dwaraka Tirumala — Free Annadanam Token System",
    body: "Aatreya's first flagship temple deployment. Photo-capture ticketing and live dashboards running successfully since 2022.",
  },
];

export default function Media() {
  return (
    <div data-testid="page-media">
      <PageHero
        eyebrow="Media & News"
        title="Milestones from our journey with India's temples."
        subtitle="A running record of major deployments, government engagements, and platform milestones."
        testid="media-hero"
      />

      <section className="container-x section-y" data-testid="media-timeline">
        <div className="relative border-l border-[#D4AF37]/25 pl-8 md:pl-12 space-y-10">
          {ITEMS.map((it, i) => (
            <article key={i} className="relative" data-testid={`media-item-${i}`}>
              <span className="absolute -left-[38px] md:-left-[50px] top-1 w-3 h-3 rounded-full bg-[#D4AF37] ring-4 ring-[#D4AF37]/20" />
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest">
                <span className="text-[#FF9933]">{it.date}</span>
                <span className="text-[#A0AEC0]">·</span>
                <span className="text-[#A0AEC0]">{it.tag}</span>
              </div>
              <h3 className="mt-3 font-display text-white text-2xl md:text-3xl leading-tight">{it.title}</h3>
              <p className="mt-3 text-[#A0AEC0] leading-relaxed max-w-3xl">{it.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 glass-strong p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="label-eyebrow">Press Enquiries</div>
            <div className="mt-2 font-display text-white text-2xl">For media & communications</div>
          </div>
          <a href="mailto:info@aatreya.co.in" data-testid="media-press-cta" className="btn-secondary">
            info@aatreya.co.in →
          </a>
        </div>
      </section>
    </div>
  );
}
