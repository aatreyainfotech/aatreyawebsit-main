import { Link } from "react-router-dom";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { COMPANY } from "@/data/content";

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-end overflow-hidden bg-grain" data-testid="home-hero">
      {/* Background image + overlays */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/35322805/pexels-photo-35322805.jpeg"
          alt="Temple gopuram illuminated at night"
          className="w-full h-full object-cover opacity-55"
          data-testid="hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/40 to-transparent" />
        <div className="absolute inset-0 radial-saffron" />
      </div>

      {/* Content */}
      <div className="container-x relative pb-20 md:pb-32 pt-40 w-full">
        <div className="max-w-3xl fade-in-up">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#D4AF37]" />
            <div className="label-eyebrow">Government-Registered · Est. {COMPANY.established}</div>
          </div>
          <h1 className="mt-6 font-display font-light text-white text-5xl md:text-7xl leading-[1.02] tracking-tight">
            India's Trusted <em className="not-italic text-[#D4AF37]">Digital Transformation</em> Partner for Temples
          </h1>
          <p className="mt-8 text-lg md:text-xl text-[#F8F9FA]/85 leading-relaxed max-w-2xl">
            Building Smart Temple Ecosystems with Secure, Scalable & Innovative Technology.
            {" "}Enterprise software for temples, religious institutions, and public sector projects.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/services" data-testid="hero-cta-services" className="btn-primary">
              Explore Solutions <MoveRight size={16} />
            </Link>
            <Link to="/projects" data-testid="hero-cta-projects" className="btn-secondary">
              View Projects <ArrowUpRight size={16} />
            </Link>
            <Link to="/contact" data-testid="hero-cta-contact" className="btn-ghost">
              Contact Us →
            </Link>
          </div>

          <p className="mt-14 font-display italic text-[#D4AF37] text-2xl md:text-3xl">
            Technology with Devotion. <span className="text-[#FF9933]">Innovation with Integrity.</span>
          </p>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#D4AF37]/15 bg-[#060A14]/80 backdrop-blur">
        <div className="marquee py-3">
          <div className="marquee-track font-mono text-xs text-[#A0AEC0] tracking-widest uppercase">
            {[
              "Temple ERP", "Queue Management", "Digital ID Pass", "QR Verification",
              "WhatsApp Automation", "Photo Ticketing", "Live Dashboards", "AI Notifications",
              "Cloud SaaS", "Mobile Apps", "Government Projects",
              "Temple ERP", "Queue Management", "Digital ID Pass", "QR Verification",
              "WhatsApp Automation", "Photo Ticketing", "Live Dashboards", "AI Notifications",
              "Cloud SaaS", "Mobile Apps", "Government Projects",
            ].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-4">
                <span className="w-1 h-1 bg-[#FF9933] rounded-full" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
