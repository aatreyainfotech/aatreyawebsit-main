import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { PageHeader } from "../ResourcePage";
import {
  FolderKanban, LayoutList, Package, MessageSquareQuote, Newspaper,
  Inbox, MailOpen, Image as ImageIcon, ArrowUpRight, Loader2,
} from "lucide-react";

const CARDS = [
  { key: "projects", label: "Projects", icon: FolderKanban, to: "/admin/projects", color: "text-[#D4AF37]" },
  { key: "services", label: "Services", icon: LayoutList, to: "/admin/services", color: "text-[#FF9933]" },
  { key: "products", label: "Products", icon: Package, to: "/admin/products", color: "text-[#D4AF37]" },
  { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote, to: "/admin/testimonials", color: "text-[#FF9933]" },
  { key: "news", label: "News & Blogs", icon: Newspaper, to: "/admin/news", color: "text-[#D4AF37]" },
  { key: "hero_slides", label: "Hero Slides", icon: ImageIcon, to: "/admin/hero-slides", color: "text-[#FF9933]" },
  { key: "contacts", label: "Total Enquiries", icon: Inbox, to: "/admin/contact-inbox", color: "text-[#D4AF37]" },
  { key: "unread_contacts", label: "Unread Enquiries", icon: MailOpen, to: "/admin/contact-inbox", color: "text-[#FF9933]" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="admin-dashboard">
      <PageHeader
        title="Dashboard"
        description="A quick overview of content, enquiries, and recent activity across the Aatreya website."
      />

      {loading ? (
        <div className="mt-10 text-[#A0AEC0]"><Loader2 className="inline animate-spin mr-2" size={16} /> Loading dashboard…</div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {CARDS.map((c) => (
              <Link
                key={c.key}
                to={c.to}
                className="glass card-hover p-6 group"
                data-testid={`dashboard-card-${c.key}`}
              >
                <div className="flex items-start justify-between">
                  <c.icon size={22} className={c.color} strokeWidth={1.5} />
                  <ArrowUpRight size={14} className="text-[#A0AEC0] group-hover:text-[#FF9933] transition-colors" />
                </div>
                <div className="mt-6 font-display text-white text-4xl">
                  {(data?.counts?.[c.key]) ?? 0}
                </div>
                <div className="mt-2 label-eyebrow">{c.label}</div>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="label-eyebrow">Recent Enquiries</div>
                  <div className="mt-1 font-display text-white text-xl">Latest contact submissions</div>
                </div>
                <Link to="/admin/contact-inbox" className="text-[#D4AF37] hover:text-[#FF9933] text-sm">Open Inbox →</Link>
              </div>

              <div className="mt-6 divide-y divide-[#D4AF37]/10">
                {(data?.recent_contacts || []).length === 0 && (
                  <div className="py-6 text-sm text-[#A0AEC0]">No enquiries yet.</div>
                )}
                {(data?.recent_contacts || []).map((c) => (
                  <div key={c.id} className="py-4 flex items-start gap-4" data-testid={`recent-contact-${c.id}`}>
                    <div className="w-10 h-10 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center font-display text-[#D4AF37]">
                      {(c.name || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-medium text-white">{c.name}</div>
                        <div className="text-xs text-[#A0AEC0]">{c.email}</div>
                        {!c.read && <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF9933]">New</span>}
                      </div>
                      <div className="text-sm text-[#F8F9FA]/85 line-clamp-2 mt-1">{c.subject || c.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6">
              <div className="label-eyebrow">Quick Actions</div>
              <div className="mt-4 space-y-2">
                <Link to="/admin/hero-slides" className="block px-4 py-3 border border-[#D4AF37]/20 hover:border-[#FF9933]/60 transition-colors text-sm">
                  Manage Hero Slides →
                </Link>
                <Link to="/admin/projects" className="block px-4 py-3 border border-[#D4AF37]/20 hover:border-[#FF9933]/60 transition-colors text-sm">
                  Add / Edit Projects →
                </Link>
                <Link to="/admin/news" className="block px-4 py-3 border border-[#D4AF37]/20 hover:border-[#FF9933]/60 transition-colors text-sm">
                  Publish News or Blog →
                </Link>
                <Link to="/admin/recognitions" className="block px-4 py-3 border border-[#D4AF37]/20 hover:border-[#FF9933]/60 transition-colors text-sm">
                  Government Recognitions →
                </Link>
                <Link to="/admin/settings" className="block px-4 py-3 border border-[#D4AF37]/20 hover:border-[#FF9933]/60 transition-colors text-sm">
                  Website Settings →
                </Link>
              </div>
              <div className="hairline my-6" />
              <div className="text-xs text-[#A0AEC0] leading-relaxed">
                Content updates go live instantly on public pages consuming CMS APIs.
                Use the toggle on each record to hide/show items on the site.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
