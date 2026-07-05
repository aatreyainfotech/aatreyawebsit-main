import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Projects from "@/pages/Projects";
import Products from "@/pages/Products";
import Technology from "@/pages/Technology";
import Media from "@/pages/Media";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import PaymentPolicy from "@/pages/PaymentPolicy";
import RefundCancellation from "@/pages/RefundCancellation";

import AdminLayout from "@/admin/AdminLayout";
import AdminLogin from "@/admin/pages/Login";
import Dashboard from "@/admin/pages/Dashboard";
import AdminHeroSlides from "@/admin/pages/HeroSlides";
import AdminServices from "@/admin/pages/Services";
import AdminProjects from "@/admin/pages/Projects";
import AdminProducts from "@/admin/pages/Products";
import AdminTestimonials from "@/admin/pages/Testimonials";
import AdminNews from "@/admin/pages/News";
import AdminClients from "@/admin/pages/Clients";
import AdminRecognitions from "@/admin/pages/Recognitions";
import AdminStatistics from "@/admin/pages/Statistics";
import AdminContactInbox from "@/admin/pages/ContactInbox";
import AdminSettings from "@/admin/pages/Settings";
import AdminUsers from "@/admin/pages/Users";

import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App" data-testid="app-root">
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/products" element={<Products />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/media" element={<Media />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/payment-policy" element={<PaymentPolicy />} />
            <Route path="/refund-cancellation" element={<RefundCancellation />} />
          </Route>

          {/* Admin CMS */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="hero-slides" element={<AdminHeroSlides />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="recognitions" element={<AdminRecognitions />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="contact-inbox" element={<AdminContactInbox />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}

export default App;
