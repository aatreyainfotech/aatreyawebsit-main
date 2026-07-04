import { Quote } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="section-y container-x" data-testid="testimonial-section">
      <div className="relative glass-strong p-10 md:p-16 overflow-hidden">
        <div className="absolute -top-10 -left-10 text-[#D4AF37]/10">
          <Quote size={220} strokeWidth={1} />
        </div>
        <div className="relative">
          <div className="label-eyebrow">Client Testimonial</div>
          <p className="mt-6 font-display italic text-white text-2xl md:text-4xl leading-snug max-w-4xl">
            "Temple administrations across Andhra Pradesh and Telangana rely on Aatreya Infotech
            Systems LLP for secure, scalable, and reliable digital solutions that simplify
            operations and enhance devotee experiences."
          </p>
          <div className="mt-10 hairline" />
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#A0AEC0]">
            <div className="font-display text-[#D4AF37] text-lg">Trusted by</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {["Dwaraka Tirumala", "Indrakeeladri", "Srisailam", "Bhadrachalam", "Vemulawada"].map((t) => (
                <span key={t} className="border border-[#D4AF37]/30 px-3 py-1 font-mono text-xs tracking-wider uppercase text-[#F8F9FA]/85">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <div className="label-eyebrow">Professional Closing</div>
        <h3 className="mt-4 font-display italic text-white text-3xl md:text-5xl leading-tight">
          Technology with Devotion.{" "}
          <span className="text-[#D4AF37]">Innovation with Integrity.</span>
        </h3>
        <p className="mt-6 max-w-3xl mx-auto text-[#A0AEC0] leading-relaxed">
          Aatreya Infotech Systems LLP has earned the trust of leading temples by consistently
          delivering reliable, scalable, and innovative digital solutions across Temple ERP, Queue
          Management, Digital ID Pass, QR Technologies, Mobile Applications, WhatsApp Automation,
          and Cloud Platforms.
        </p>
      </div>
    </section>
  );
}
