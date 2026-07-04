import PageHero from "@/components/PageHero";
import { TECH_STACK } from "@/data/content";
import { Cpu } from "lucide-react";

export default function Technology() {
  const families = [...new Set(TECH_STACK.map((t) => t.family))];
  return (
    <div data-testid="page-technology">
      <PageHero
        eyebrow="Technology"
        title="Enterprise technology stack, engineered for temple scale."
        subtitle="Modern cloud, secure APIs, mobile-first delivery — architected for reliability during Brahmotsavam-scale devotee traffic."
        testid="technology-hero"
      />

      <section className="container-x section-y" data-testid="tech-stack">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="label-eyebrow">Architecture Principles</div>
            <ul className="mt-6 space-y-4">
              {[
                { k: "Secure by Default", v: "TLS, RBAC, audit logs, QR tokenization." },
                { k: "Cloud-Native", v: "Azure Cloud with high-availability regions." },
                { k: "Mobile-First", v: "Native Android + Progressive Web Apps." },
                { k: "Real-Time", v: "Live dashboards, WebSocket-backed counters." },
                { k: "AI-Ready", v: "Notifications, anomaly detection, insights." },
              ].map((r) => (
                <li key={r.k} className="glass p-5" data-testid={`arch-${r.k.toLowerCase().replace(/\s+/g,'-')}`}>
                  <div className="font-display text-[#D4AF37] text-xl">{r.k}</div>
                  <div className="mt-1 text-sm text-[#A0AEC0]">{r.v}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="label-eyebrow">Technology Stack</div>
            <div className="mt-6 space-y-8">
              {families.map((fam) => (
                <div key={fam}>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-px bg-[#D4AF37]" />
                    <div className="font-mono text-xs text-[#FF9933] uppercase tracking-widest">{fam}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {TECH_STACK.filter((t) => t.family === fam).map((t) => (
                      <span
                        key={t.name}
                        className="glass card-hover px-4 py-2.5 inline-flex items-center gap-2 text-sm"
                        data-testid={`tech-${t.name.toLowerCase().replace(/\s+/g,'-')}`}
                      >
                        <Cpu size={14} className="text-[#D4AF37]" /> {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
