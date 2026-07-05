import { useEffect, useState } from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import {
  LayoutDashboard, Image as ImageIcon, LayoutList, FolderKanban, Package,
  MessageSquareQuote, Newspaper, Building2, Award, BarChart3, Inbox, Settings, LogOut, Menu, X,
} from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/hero-slides", label: "Hero Slides", icon: ImageIcon },
  { to: "/admin/services", label: "Services", icon: LayoutList },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/news", label: "News & Blogs", icon: Newspaper },
  { to: "/admin/clients", label: "Clients", icon: Building2 },
  { to: "/admin/recognitions", label: "Recognitions", icon: Award },
  { to: "/admin/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/admin/contact-inbox", label: "Contact Inbox", icon: Inbox },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

function Shell() {
  const { user, logout, loading } = useAuth();
  const [openMobile, setOpenMobile] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060A14] flex items-center justify-center text-[#A0AEC0]">
        Loading admin…
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-[#060A14] text-[#F8F9FA]" data-testid="admin-shell">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 glass-strong flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm border border-[#D4AF37]/60 flex items-center justify-center font-display text-[#D4AF37]">आ</div>
          <div className="font-display text-lg">Aatreya CMS</div>
        </div>
        <button data-testid="admin-mobile-toggle" onClick={() => setOpenMobile((v) => !v)} className="p-2">
          {openMobile ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          data-testid="admin-sidebar"
          className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#050810] border-r border-[#D4AF37]/15 flex flex-col transition-transform duration-300 ${
            openMobile ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="px-6 py-6 border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm border border-[#D4AF37]/60 flex items-center justify-center font-display text-[#D4AF37] text-xl">आ</div>
              <div>
                <div className="font-display text-lg text-white">Aatreya CMS</div>
                <div className="label-eyebrow mt-0.5">Admin Panel</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => setOpenMobile(false)}
                data-testid={`admin-nav-${n.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                    isActive
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30"
                      : "text-[#F8F9FA]/80 hover:text-[#FF9933] hover:bg-white/[0.02]"
                  }`
                }
              >
                <n.icon size={16} strokeWidth={1.5} />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-[#D4AF37]/10 px-4 py-4">
            <div className="text-sm">
              <div className="text-white font-medium truncate" data-testid="admin-user-name">{user.name}</div>
              <div className="text-xs text-[#A0AEC0]">{user.mobile} · {user.role}</div>
            </div>
            <button
              onClick={logout}
              data-testid="admin-logout-btn"
              className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 text-sm transition-colors"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </aside>

        {openMobile && (
          <div onClick={() => setOpenMobile(false)} className="fixed inset-0 bg-black/60 z-20 lg:hidden" />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen" data-testid="admin-main">
          <div className="px-6 md:px-10 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
