import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function AboutSnippet() {
  return (
    <section className="section-y container-x" data-testid="home-about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-5">
          <div className="label-eyebrow">About Us</div>
          <h2 className="mt-4 font-display font-light text-white text-4xl md:text-5xl leading-tight">
            One of India's emerging technology companies focused on temple digitization.
          </h2>
          <div className="hairline mt-8" />
          <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="label-eyebrow">Established</div>
              <div className="mt-2 font-display text-[#D4AF37] text-2xl">18 May 2021</div>
            </div>
            <div>
              <div className="label-eyebrow">Registered With</div>
              <div className="mt-2 font-display text-[#D4AF37] text-2xl">Govt. of India</div>
            </div>
          </div>
          <Link to="/about" data-testid="about-snippet-cta" className="mt-10 inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#FF9933] transition-colors">
            Read Full Story <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="lg:col-span-7 space-y-6 text-[#F8F9FA]/85 leading-relaxed text-base md:text-lg">
          <p>
            <span className="font-display text-4xl text-[#D4AF37] float-left mr-3 leading-none">A</span>
            atreya Infotech Systems LLP specializes in designing, developing, implementing, and
            maintaining enterprise software solutions that improve operational efficiency,
            enhance devotee services, and ensure complete transparency through modern cloud technologies.
          </p>
          <p>
            Our software platforms are successfully deployed in prestigious temples across Andhra
            Pradesh and Telangana, serving thousands of devotees every day through secure, scalable,
            and reliable digital systems.
          </p>
          <div className="pt-4 grid grid-cols-3 gap-4">
            {[
              { k: "6+", v: "Major Temples" },
              { k: "10K+", v: "Daily Devotees" },
              { k: "99.9%", v: "Cloud Uptime" },
            ].map((s) => (
              <div key={s.v} className="glass p-5" data-testid={`about-stat-${s.v.toLowerCase().replace(/\s+/g,'-')}`}>
                <div className="font-display text-3xl text-[#D4AF37]">{s.k}</div>
                <div className="mt-1 label-eyebrow">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
