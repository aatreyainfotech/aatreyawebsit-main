import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV, COMPANY } from "@/data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong" : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between py-4 md:py-5">
        <Link to="/" data-testid="nav-logo-link" className="group flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm border border-[#D4AF37]/60 flex items-center justify-center font-display text-[#D4AF37] text-xl leading-none">
            आ
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg text-white tracking-tight">Aatreya</div>
            <div className="label-eyebrow mt-0.5">Infotech Systems LLP</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={`nav-link-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-3 py-2 text-sm tracking-wide transition-colors ${
                  isActive ? "text-[#FF9933]" : "text-[#F8F9FA]/80 hover:text-[#D4AF37]"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/contact" data-testid="nav-cta-contact" className="btn-primary text-sm">
            Talk to Us
          </Link>
        </div>

        <button
          className="lg:hidden text-[#F8F9FA] p-2"
          onClick={() => setOpen((v) => !v)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-[#D4AF37]/15" data-testid="nav-mobile-panel">
          <div className="container-x py-4 flex flex-col">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-link-${n.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `py-3 border-b border-[#D4AF37]/10 ${
                    isActive ? "text-[#FF9933]" : "text-[#F8F9FA]/90"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              data-testid="nav-mobile-cta"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 justify-center"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
