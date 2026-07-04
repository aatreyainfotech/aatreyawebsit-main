import { Link } from "react-router-dom";
import { COMPANY, NAV } from "@/data/content";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[#D4AF37]/15 bg-[#050810]" data-testid="site-footer">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm border border-[#D4AF37]/60 flex items-center justify-center font-display text-[#D4AF37] text-2xl">
              आ
            </div>
            <div>
              <div className="font-display text-2xl text-white">Aatreya Infotech Systems LLP</div>
              <div className="label-eyebrow mt-1">Est. {COMPANY.established}</div>
            </div>
          </div>
          <p className="mt-5 text-[#A0AEC0] max-w-md leading-relaxed">
            Enterprise-grade digital transformation for temples, religious institutions, and public
            sector projects across India.
          </p>
          <div className="hairline mt-6" />
          <p className="mt-4 font-display italic text-[#D4AF37] text-lg">
            {COMPANY.tagline}
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="label-eyebrow">Navigate</div>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  data-testid={`footer-link-${n.label.toLowerCase()}`}
                  className="text-[#F8F9FA]/80 hover:text-[#FF9933] text-sm"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="label-eyebrow">Legal</div>
          <ul className="mt-4 space-y-2.5">
            {[
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/payment-policy", label: "Payment Policy" },
              { to: "/refund-cancellation", label: "Refund & Cancellation" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  data-testid={`footer-legal-${l.to.replace('/', '')}`}
                  className="text-[#F8F9FA]/80 hover:text-[#FF9933] text-sm"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="label-eyebrow">Contact</div>
          <ul className="mt-4 space-y-3 text-sm text-[#F8F9FA]/85">
            <li className="flex gap-3">
              <MapPin size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
              <span>{COMPANY.address.line1}<br/>{COMPANY.address.line2}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
              <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} data-testid="footer-phone">{COMPANY.phone}</a>
            </li>
            {COMPANY.emails.map((e) => (
              <li key={e} className="flex gap-3">
                <Mail size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <a href={`mailto:${e}`} data-testid={`footer-email-${e}`}>{e}</a>
              </li>
            ))}
            <li className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
              {COMPANY.websites.map((w) => (
                <span key={w} className="inline-flex items-center gap-1.5 text-[#A0AEC0]">
                  <Globe size={12} className="text-[#FF9933]" /> {w}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#D4AF37]/10">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#A0AEC0]">
          <div>© {new Date().getFullYear()} Aatreya Infotech Systems LLP. All rights reserved.</div>
          <div className="font-mono tracking-widest">GOVERNMENT-REGISTERED INDIAN STARTUP</div>
        </div>
      </div>
    </footer>
  );
}
