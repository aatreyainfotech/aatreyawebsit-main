import { COMPANY } from "@/data/content";

export default function PageHero({ eyebrow, title, subtitle, testid = "page-hero" }) {
  return (
    <section
      className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden bg-grain"
      data-testid={testid}
    >
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 radial-gold pointer-events-none" />
      <div className="container-x relative">
        <div className="label-eyebrow" data-testid={`${testid}-eyebrow`}>{eyebrow}</div>
        <h1
          className="mt-4 font-display font-light text-white text-4xl md:text-6xl leading-[1.05] max-w-4xl"
          data-testid={`${testid}-title`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-[#A0AEC0] text-base md:text-lg leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
        <div className="hairline mt-10" />
      </div>
    </section>
  );
}
