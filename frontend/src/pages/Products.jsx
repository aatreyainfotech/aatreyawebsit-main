import PageHero from "@/components/PageHero";
import { ECOSYSTEM } from "@/data/content";
import { Package, CheckCircle2 } from "lucide-react";

const PRODUCTS = [
  {
    name: "Aatreya Temple ERP",
    tagline: "The operating system for temple administration.",
    bullets: ["Multi-department workflows", "Finance & audit trails", "Devotee CRM", "Role-based access control"],
  },
  {
    name: "Aatreya Queue & Darshan Suite",
    tagline: "Smart queue, slot booking, and darshan pass issuance.",
    bullets: ["Live capacity monitoring", "QR-based passes", "Vehicle & darshan tokens", "Counter management"],
  },
  {
    name: "Aatreya Digital ID Pass",
    tagline: "Secure, government-grade identity for staff, police, and VVIPs.",
    bullets: ["Photo-capture verification", "Anti-fraud QR tokens", "Live security dashboard", "Deployed at PM visits"],
  },
  {
    name: "Aatreya OmniCloud",
    tagline: "Multi-temple SaaS with centralized administration.",
    bullets: ["Azure-hosted", "99.9% uptime SLA", "Tenant isolation", "Real-time analytics"],
  },
  {
    name: "Aatreya WhatsApp Business Platform",
    tagline: "Automated devotee communication at temple scale.",
    bullets: ["Seva notifications", "Donation receipts", "Daily temple updates", "Approved templates"],
  },
  {
    name: "Aatreya Photo Ticketing",
    tagline: "Instant photo-enabled tickets for annadanam, sarees, prasadam.",
    bullets: ["On-device camera capture", "Live counters", "Anti-duplication QR", "Reporting dashboard"],
  },
];

export default function Products() {
  return (
    <div data-testid="page-products">
      <PageHero
        eyebrow="Products"
        title="A modular product suite for modern temples."
        subtitle="Six flagship products, one seamless ecosystem — deployed across major temples in Andhra Pradesh and Telangana."
        testid="products-hero"
      />

      <section className="container-x section-y" data-testid="products-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((p, i) => (
            <article
              key={p.name}
              className="glass card-hover p-8 relative"
              data-testid={`product-card-${i}`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-sm border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Package size={22} strokeWidth={1.5} />
                </div>
                <div className="font-mono text-xs text-[#A0AEC0]/70">P0{i + 1}</div>
              </div>
              <h3 className="mt-6 font-display text-white text-3xl leading-tight">{p.name}</h3>
              <p className="mt-2 text-[#FF9933] text-sm">{p.tagline}</p>
              <div className="hairline mt-5" />
              <ul className="mt-5 space-y-2.5">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-[#F8F9FA]/85">
                    <CheckCircle2 size={14} className="text-[#D4AF37] mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y container-x" data-testid="products-ecosystem">
        <div className="label-eyebrow">Ecosystem Coverage</div>
        <h2 className="mt-4 font-display font-light text-white text-3xl md:text-4xl max-w-3xl">
          Every temple capability, unified in one product family.
        </h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {ECOSYSTEM.map((e) => (
            <span key={e} className="glass px-4 py-2 text-sm">{e}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
