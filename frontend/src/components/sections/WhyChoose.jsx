import { WHY_CHOOSE } from "@/data/content";
import { ShieldCheck } from "lucide-react";

export default function WhyChoose() {
  return (
    <section className="section-y container-x" data-testid="why-choose">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="label-eyebrow">Why Aatreya</div>
          <h2 className="mt-4 font-display font-light text-white text-4xl md:text-5xl leading-tight">
            A trusted technology partner for temples & government.
          </h2>
          <p className="mt-6 text-[#A0AEC0] leading-relaxed">
            Chosen by leading temple administrations for our proven track record, enterprise-grade
            architecture, and long-term commitment to devotee experience.
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WHY_CHOOSE.map((item, i) => (
            <div
              key={item}
              className="glass card-hover px-5 py-4 flex items-center gap-3"
              data-testid={`why-item-${i}`}
            >
              <ShieldCheck size={18} className="text-[#D4AF37] shrink-0" />
              <div className="text-sm md:text-base text-[#F8F9FA]/90">{item}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
