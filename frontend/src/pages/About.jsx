import PageHero from "@/components/PageHero";
import { COMPANY, ACHIEVEMENTS } from "@/data/content";
import { Link } from "react-router-dom";
import Recognitions from "@/components/sections/Recognitions";

export default function About() {
  return (
    <div data-testid="page-about">
      <PageHero
        eyebrow="About Aatreya"
        title="Engineering a devotional digital ecosystem for India's temples."
        subtitle="Established 18 May 2021, Aatreya Infotech Systems LLP is one of India's emerging technology companies focused on Digital Transformation for Temples and Religious Institutions."
        testid="about-hero"
      />

      <section className="container-x pb-24" data-testid="about-story">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <div className="glass p-8 sticky top-28">
              <div className="label-eyebrow">Our Origin</div>
              <h2 className="mt-3 font-display text-[#D4AF37] text-3xl">May 18, 2021</h2>
              <p className="mt-4 text-[#A0AEC0] leading-relaxed">
                Founded with a singular purpose — to bring enterprise-grade digital rigor to India's
                temples, ensuring transparency, efficiency, and dignity in every devotee interaction.
              </p>
              <div className="hairline my-6" />
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between"><span className="text-[#A0AEC0]">Registration</span><span>Government of India</span></li>
                <li className="flex justify-between"><span className="text-[#A0AEC0]">Entity</span><span>Limited Liability Partnership</span></li>
                <li className="flex justify-between"><span className="text-[#A0AEC0]">HQ</span><span>Tenali, Andhra Pradesh</span></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8 text-[#F8F9FA]/90 leading-relaxed">
            <p className="text-lg">
              We specialize in designing, developing, implementing, and maintaining enterprise
              software solutions that improve operational efficiency, enhance devotee services, and
              ensure complete transparency through modern cloud technologies.
            </p>
            <p>
              Our software platforms are successfully deployed in prestigious temples across Andhra
              Pradesh and Telangana, serving thousands of devotees every day through secure, scalable,
              and reliable digital systems.
            </p>

            <div className="hairline" />

            <div>
              <div className="label-eyebrow">Our Mission</div>
              <h3 className="mt-3 font-display text-white text-3xl">
                To digitize India's spiritual infrastructure with reverence and rigor.
              </h3>
              <p className="mt-5 text-[#A0AEC0]">
                From free annadanam token systems to protocol digitization for VVIP visits — we build
                the technology that lets temples focus on service while we handle scale, security,
                and operations.
              </p>
            </div>

            <div className="hairline" />

            <div>
              <div className="label-eyebrow">Our Vision</div>
              <h3 className="mt-3 font-display text-white text-3xl">
                Every temple, on a modern digital platform.
              </h3>
              <p className="mt-5 text-[#A0AEC0]">
                Faster devotee services, smart queues, complete transparency, secure QR verification,
                AI-enabled automation, and cloud-based operations — for every temple that chooses to
                serve better.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.label} className="glass p-5">
                  <div className="font-display text-3xl text-[#D4AF37]">{a.value}</div>
                  <div className="mt-2 label-eyebrow">{a.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Link to="/contact" data-testid="about-cta-contact" className="btn-primary">Start a Conversation →</Link>
            </div>
          </div>
        </div>
      </section>
      <Recognitions />
    </div>
  );
}
