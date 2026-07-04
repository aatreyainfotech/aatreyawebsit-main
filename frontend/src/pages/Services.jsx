import PageHero from "@/components/PageHero";
import ServicesGrid from "@/components/sections/ServicesGrid";
import { ECOSYSTEM } from "@/data/content";
import { Link } from "react-router-dom";

export default function Services() {
  return (
    <div data-testid="page-services">
      <PageHero
        eyebrow="Our Services"
        title="Enterprise digital solutions for the full temple lifecycle."
        subtitle="Nine deeply integrated capabilities that transform traditional temple administration into intelligent, transparent, paperless ecosystems."
        testid="services-hero"
      />

      <ServicesGrid compact />

      <section className="section-y container-x" data-testid="services-ecosystem">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="label-eyebrow">Our Expertise</div>
            <h2 className="mt-4 font-display font-light text-white text-4xl md:text-5xl leading-tight">
              Complete Temple Digital Ecosystem.
            </h2>
            <p className="mt-6 text-[#A0AEC0]">
              A unified capability map — every module interoperates with the next, all built on a
              modern, secure cloud foundation.
            </p>
            <Link to="/contact" data-testid="services-cta-consult" className="mt-8 inline-flex btn-secondary text-sm">
              Request a Consultation →
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-2">
              {ECOSYSTEM.map((e, i) => (
                <span
                  key={e}
                  className="glass px-4 py-2 text-sm text-[#F8F9FA]/90 hover:border-[#FF9933]/60 transition-colors"
                  data-testid={`ecosystem-pill-${i}`}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
