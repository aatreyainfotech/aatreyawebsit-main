import { RECOGNITIONS } from "@/data/content";
import { Award } from "lucide-react";

export default function Recognitions() {
  return (
    <section className="section-y container-x" data-testid="recognitions-section">
      <div className="text-center max-w-3xl mx-auto">
        <div className="label-eyebrow inline-flex items-center gap-2">
          <Award size={12} className="text-[#FF9933]" /> Government Recognitions
        </div>
        <h2 className="mt-4 font-display font-light text-white text-4xl md:text-5xl leading-tight">
          A trusted, <em className="not-italic text-[#D4AF37]">Government-registered</em> Indian startup.
        </h2>
        <p className="mt-6 text-[#A0AEC0]">
          Aatreya Infotech Systems LLP is officially recognized under Government of India initiatives —
          reflecting our commitment to enterprise standards, transparency, and long-term public sector partnership.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {RECOGNITIONS.map((r, i) => (
          <div
            key={r.name}
            className="glass card-hover p-8 md:p-10 relative overflow-hidden text-center"
            data-testid={`recognition-${r.name.toLowerCase().replace(/\s+/g,'-')}`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
            <div className="mx-auto w-32 h-32 md:w-36 md:h-36 bg-white rounded-sm flex items-center justify-center p-3 shadow-[0_0_60px_-20px_rgba(212,175,55,0.35)]">
              <img
                src={r.logo}
                alt={`${r.name} recognition logo`}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="mt-6 font-mono text-[10px] tracking-[0.24em] uppercase text-[#FF9933]">
              Government of India
            </div>
            <div className="mt-3 font-display text-white text-2xl leading-tight">{r.name}</div>
            <div className="mt-2 text-[#F8F9FA]/85 text-sm">{r.label}</div>
            <div className="mt-1 text-[#A0AEC0] text-xs">{r.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
