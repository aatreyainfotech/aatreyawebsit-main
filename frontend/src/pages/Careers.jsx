import PageHero from "@/components/PageHero";
import { Briefcase, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const ROLES = [
  {
    title: "Senior Full-Stack Engineer",
    location: "Tenali / Remote (India)",
    type: "Full-time",
    stack: ["React", "Node.js", "SQL Server", "Azure"],
  },
  {
    title: "Android Engineer — Temple Applications",
    location: "Tenali / On-site",
    type: "Full-time",
    stack: ["Kotlin", "Java", "REST", "QR"],
  },
  {
    title: "Cloud & DevOps Engineer",
    location: "Remote (India)",
    type: "Full-time",
    stack: ["Azure", "CI/CD", "Observability"],
  },
  {
    title: "Field Deployment Specialist",
    location: "AP / Telangana temples",
    type: "Full-time",
    stack: ["On-ground", "Training", "Support"],
  },
];

export default function Careers() {
  return (
    <div data-testid="page-careers">
      <PageHero
        eyebrow="Careers"
        title="Build technology that serves millions of devotees."
        subtitle="We're looking for engineers, designers, and field specialists who take pride in operational excellence and cultural stewardship."
        testid="careers-hero"
      />

      <section className="container-x pb-8" data-testid="careers-culture">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { k: "Impact", v: "Ship software used by thousands of devotees daily — every release matters." },
            { k: "Craft", v: "Enterprise-grade architecture, from Azure infra to on-device QR verification." },
            { k: "Care", v: "Respect for tradition. Rigor in engineering. Empathy for devotees and administrators." },
          ].map((c) => (
            <div key={c.k} className="glass p-8" data-testid={`culture-${c.k.toLowerCase()}`}>
              <div className="font-display text-[#D4AF37] text-3xl">{c.k}</div>
              <p className="mt-3 text-[#A0AEC0] leading-relaxed">{c.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x section-y" data-testid="careers-roles">
        <div className="label-eyebrow">Open Positions</div>
        <h2 className="mt-4 font-display font-light text-white text-3xl md:text-4xl">
          Currently hiring across engineering & field ops.
        </h2>

        <div className="mt-10 space-y-3">
          {ROLES.map((r, i) => (
            <div
              key={r.title}
              className="glass card-hover p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
              data-testid={`role-${i}`}
            >
              <div className="w-12 h-12 rounded-sm border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Briefcase size={20} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="font-display text-white text-xl md:text-2xl">{r.title}</div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#A0AEC0]">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={12} className="text-[#FF9933]" /> {r.location}</span>
                  <span>· {r.type}</span>
                  <span>· {r.stack.join(" / ")}</span>
                </div>
              </div>
              <Link
                to="/contact"
                data-testid={`role-apply-${i}`}
                className="btn-secondary text-sm shrink-0"
              >
                Apply <ArrowUpRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 glass-strong p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="label-eyebrow">Don't see your role?</div>
            <h3 className="mt-3 font-display text-white text-2xl">
              We're always meeting exceptional people. Write to us with your story.
            </h3>
          </div>
          <Link to="/contact" data-testid="careers-open-application" className="btn-primary">
            Send an Open Application →
          </Link>
        </div>
      </section>
    </div>
  );
}
