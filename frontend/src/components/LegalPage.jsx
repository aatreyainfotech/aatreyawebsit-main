import PageHero from "@/components/PageHero";

export default function LegalPage({ eyebrow, title, updated, sections, testid }) {
  return (
    <div data-testid={testid}>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={`Last updated: ${updated}`}
        testid={`${testid}-hero`}
      />
      <section className="container-x pb-24" data-testid={`${testid}-body`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky TOC */}
          <aside className="lg:col-span-4">
            <div className="glass p-6 lg:sticky lg:top-28">
              <div className="label-eyebrow">On this page</div>
              <ul className="mt-4 space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-[#F8F9FA]/80 hover:text-[#FF9933] transition-colors flex gap-3"
                      data-testid={`${testid}-toc-${i}`}
                    >
                      <span className="font-mono text-xs text-[#D4AF37]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="hairline my-6" />
              <p className="text-xs text-[#A0AEC0] leading-relaxed">
                For questions about this document, email{" "}
                <a
                  href="mailto:info@aatreya.co.in"
                  className="text-[#D4AF37] hover:text-[#FF9933]"
                >
                  info@aatreya.co.in
                </a>
                .
              </p>
            </div>
          </aside>

          {/* Body */}
          <article className="lg:col-span-8 space-y-12">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-28"
                data-testid={`${testid}-section-${i}`}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[#FF9933] tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-white text-2xl md:text-3xl leading-tight">
                    {s.heading}
                  </h2>
                </div>
                <div className="mt-4 hairline" />
                <div className="mt-5 space-y-4 text-[#F8F9FA]/85 leading-relaxed text-[15px]">
                  {s.body.map((p, k) =>
                    Array.isArray(p) ? (
                      <ul key={k} className="space-y-2 pl-1">
                        {p.map((item, j) => (
                          <li key={j} className="flex gap-3">
                            <span className="text-[#D4AF37] mt-1">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={k}>{p}</p>
                    )
                  )}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}
