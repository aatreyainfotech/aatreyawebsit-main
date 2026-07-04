import { VISION_POINTS } from "@/data/content";
import { Sparkles } from "lucide-react";

export default function Vision() {
  return (
    <section className="relative section-y overflow-hidden" data-testid="vision-section">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1765990153176-582ca8808384"
          alt="Golden light streaks"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060A14] via-[#060A14]/80 to-[#060A14]" />
      </div>

      <div className="container-x relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-6">
            <div className="label-eyebrow">Our Vision</div>
            <h2 className="mt-4 font-display font-light text-white text-4xl md:text-6xl leading-[1.05]">
              Building the future of{" "}
              <em className="not-italic text-[#D4AF37]">smart temples</em>.
            </h2>
            <p className="mt-8 text-[#F8F9FA]/85 leading-relaxed max-w-xl text-base md:text-lg">
              To become India's leading Digital Transformation Partner for Temples by delivering
              secure, transparent, intelligent, and scalable technology solutions — enhancing
              temple administration and preserving India's rich spiritual heritage through innovation.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="glass p-8">
              <div className="label-eyebrow flex items-center gap-2">
                <Sparkles size={12} className="text-[#FF9933]" /> A Future Where Every Temple Operates On
              </div>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {VISION_POINTS.map((v, i) => (
                  <li key={v} className="flex items-start gap-3 text-[#F8F9FA]/95" data-testid={`vision-point-${i}`}>
                    <span className="font-mono text-xs text-[#FF9933] mt-1.5">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm md:text-base">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
