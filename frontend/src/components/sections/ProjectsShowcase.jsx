import { useEffect, useState } from "react";
import axios from "axios";
import { PROJECTS } from "@/data/content";
import { MapPin, CheckCircle2, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const resolveImage = (url) => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  return `${process.env.REACT_APP_BACKEND_URL}${url}`;
};

const normalize = (p) => ({
  id: p.id ?? p.slug ?? p.name,
  name: p.name,
  location: p.location,
  order: p.order ?? p.work_order ?? "",
  status: p.status ?? "",
  features: Array.isArray(p.features) ? p.features : [],
  image: resolveImage(p.image ?? p.cover_image ?? (Array.isArray(p.gallery) ? p.gallery[0] : undefined)),
  isSpecial: p.isSpecial ?? p.is_special ?? false,
});

export default function ProjectsShowcase({ limit }) {
  const [projects, setProjects] = useState(PROJECTS);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API}/public/projects`)
      .then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setProjects(data.map(normalize));
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      active = false;
    };
  }, []);

  const items = limit ? projects.slice(0, limit) : projects;
  return (
    <section className="relative section-y bg-[#080D1C]/40 border-y border-[#D4AF37]/10 overflow-hidden" data-testid="projects-showcase">
      <div className="absolute inset-0 bg-grid opacity-[0.08] pointer-events-none" />
      <div className="container-x relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="label-eyebrow">Major Projects</div>
            <h2 className="mt-4 font-display font-light text-white text-4xl md:text-5xl leading-tight">
              Delivered across India's <em className="not-italic text-[#D4AF37]">most revered temples</em>.
            </h2>
            <p className="mt-5 text-[#A0AEC0] max-w-2xl">
              Government-approved implementations spanning ERP, queue management, digital ID, QR
              verification and mobile applications — trusted at scale.
            </p>
          </div>
          {limit && (
            <Link to="/projects" data-testid="projects-view-all" className="btn-secondary text-sm">
              All Projects <ArrowUpRight size={16} />
            </Link>
          )}
        </div>

        {/* Alternating feature rows */}
        <div className="mt-16 space-y-24 md:space-y-32">
          {items.map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={p.id}
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                data-testid={`project-card-${p.id}`}
              >
                {/* Giant background number */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 md:-top-24 select-none font-display font-light text-[#D4AF37]/[0.06] text-[180px] md:text-[280px] leading-none tracking-tighter"
                  style={{ [reverse ? "right" : "left"]: "-1rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Image */}
                <div className={`lg:col-span-6 relative ${reverse ? "lg:order-2" : ""}`}>
                  <div className="relative aspect-[4/3] overflow-hidden border border-[#D4AF37]/20 group">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#060A14] via-[#060A14]/40 to-transparent" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-[#D4AF37]/20" />
                    {/* Corner meta */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 label-eyebrow bg-[#060A14]/70 backdrop-blur px-3 py-1.5 border border-[#D4AF37]/30">
                      <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-pulse" />
                      Live Deployment
                    </div>
                    <div className="absolute bottom-4 right-4 font-mono text-xs text-[#F8F9FA]/85 bg-[#060A14]/70 backdrop-blur px-3 py-1.5 border border-[#D4AF37]/30">
                      {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-px bg-[#D4AF37]" />
                    <div className="label-eyebrow">Project {String(i + 1).padStart(2, "0")}</div>
                    {p.isSpecial && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#FF9933]/50 bg-[#FF9933]/10 text-[#FF9933] text-[10px] tracking-widest font-mono uppercase">
                        <ShieldCheck size={11} /> Special Deployment
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-display font-light text-white text-3xl md:text-4xl leading-[1.1]">
                    {p.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-2 text-[#D4AF37]">
                    <MapPin size={16} />
                    <span className="text-sm md:text-base">{p.location}</span>
                  </div>

                  <div className="hairline mt-6" />

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="label-eyebrow">Order / Reference</div>
                      <div className="mt-2 font-mono text-xs text-[#F8F9FA]/85 break-all leading-relaxed">
                        {p.order}
                      </div>
                    </div>
                    <div>
                      <div className="label-eyebrow">Status</div>
                      <div className="mt-2 inline-flex items-center gap-2 text-[#FF9933] text-sm">
                        <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-pulse" />
                        {p.status}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="label-eyebrow">Implemented Modules</div>
                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-[#F8F9FA]/90">
                          <CheckCircle2 size={14} className="text-[#D4AF37] mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
