import { SERVICES } from "@/data/content";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const bentoSizes = [
  "md:col-span-6 md:row-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-6",
];

export default function ServicesGrid({ compact = false }) {
  return (
    <section className="section-y container-x relative" data-testid="services-grid-section">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="label-eyebrow">Our Core Services</div>
          <h2 className="mt-4 font-display font-light text-white text-4xl md:text-5xl leading-tight max-w-2xl">
            Enterprise digital solutions built for the scale of sacred spaces.
          </h2>
        </div>
        {!compact && (
          <Link to="/services" data-testid="services-view-all" className="btn-secondary text-sm">
            View All Services <ArrowUpRight size={16} />
          </Link>
        )}
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-12 md:auto-rows-[220px] gap-4">
        {SERVICES.map((s, i) => {
          const IconEl = Icons[s.icon] || Icons.Sparkles;
          return (
            <article
              key={s.key}
              className={`glass card-hover p-6 md:p-8 relative overflow-hidden ${bentoSizes[i] || "md:col-span-4"}`}
              data-testid={`service-card-${s.key}`}
            >
              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-sm border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <IconEl size={22} strokeWidth={1.5} />
                </div>
                <div className="font-mono text-xs text-[#A0AEC0]/70">0{i + 1}</div>
              </div>
              <h3 className="mt-6 font-display text-white text-2xl leading-tight">{s.title}</h3>
              <p className="mt-3 text-[#A0AEC0] text-sm leading-relaxed max-w-md">{s.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
