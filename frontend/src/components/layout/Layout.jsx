import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return (
    <div className="min-h-screen bg-[#060A14] text-[#F8F9FA]" data-testid="site-layout">
      <Navbar />
      <main data-testid="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
