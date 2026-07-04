import { useState } from "react";
import axios from "axios";
import PageHero from "@/components/PageHero";
import { COMPANY } from "@/data/content";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Globe, Send, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", organization: "", subject: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill your name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/contact`, form);
      setOk(true);
      toast.success(data.message || "Thank you. We will be in touch shortly.");
      setForm({ name: "", email: "", phone: "", organization: "", subject: "", message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail || "Something went wrong. Please try again.";
      toast.error(typeof detail === "string" ? detail : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="page-contact">
      <PageHero
        eyebrow="Contact"
        title="Let's build the digital future of your temple."
        subtitle="Talk to our team about ERP, queue management, digital ID passes, WhatsApp automation, or cloud platform requirements."
        testid="contact-hero"
      />

      <section className="container-x pb-24" data-testid="contact-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info side */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="glass p-8" data-testid="contact-info-card">
              <div className="font-display text-white text-3xl leading-tight">Aatreya Infotech Systems LLP</div>
              <div className="label-eyebrow mt-2">Corporate Office</div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex gap-3">
                  <MapPin size={18} className="text-[#D4AF37] mt-0.5 shrink-0" />
                  <div className="text-[#F8F9FA]/90">
                    {COMPANY.address.line1}<br/>{COMPANY.address.line2}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="text-[#D4AF37] mt-0.5 shrink-0" />
                  <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} data-testid="contact-phone">
                    {COMPANY.phone}
                  </a>
                </div>
                {COMPANY.emails.map((e) => (
                  <div key={e} className="flex gap-3">
                    <Mail size={18} className="text-[#D4AF37] mt-0.5 shrink-0" />
                    <a href={`mailto:${e}`} data-testid={`contact-email-${e}`}>{e}</a>
                  </div>
                ))}
              </div>

              <div className="hairline my-6" />
              <div className="label-eyebrow">Our Websites</div>
              <ul className="mt-3 space-y-2 text-sm">
                {COMPANY.websites.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-[#F8F9FA]/85">
                    <Globe size={14} className="text-[#FF9933]" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass p-8">
              <div className="label-eyebrow">Response Promise</div>
              <p className="mt-3 text-[#A0AEC0]">
                We respond to enquiries within one business day. For urgent temple deployments,
                call us directly on the number above.
              </p>
            </div>
          </aside>

          {/* Form side */}
          <div className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="glass-strong p-8 md:p-10 space-y-5"
              data-testid="contact-form"
            >
              <div className="label-eyebrow">Send a Message</div>
              <h2 className="font-display font-light text-white text-3xl md:text-4xl leading-tight">
                Tell us about your temple's needs.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <Field label="Full Name*" name="name" value={form.name} onChange={onChange} testid="contact-input-name" />
                <Field label="Email*" name="email" type="email" value={form.email} onChange={onChange} testid="contact-input-email" />
                <Field label="Phone" name="phone" value={form.phone} onChange={onChange} testid="contact-input-phone" />
                <Field label="Organization / Temple" name="organization" value={form.organization} onChange={onChange} testid="contact-input-organization" />
              </div>

              <Field label="Subject" name="subject" value={form.subject} onChange={onChange} testid="contact-input-subject" />

              <div>
                <label className="label-eyebrow" htmlFor="message">Message*</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={6}
                  required
                  data-testid="contact-input-message"
                  className="mt-2 w-full bg-[#0A1128] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] resize-y rounded-sm"
                  placeholder="Tell us about your project — modules of interest, deployment scale, timelines..."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <div className="text-xs text-[#A0AEC0]">
                  By submitting, you agree to be contacted regarding your enquiry.
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="contact-submit"
                  className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>Send Message <Send size={16} /></>}
                </button>
              </div>

              {ok && (
                <div
                  className="mt-4 border border-[#FF9933]/40 bg-[#FF9933]/5 text-[#FF9933] text-sm px-4 py-3 rounded-sm"
                  data-testid="contact-success"
                >
                  Thank you. Our team will reach out shortly.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, testid }) {
  return (
    <div>
      <label className="label-eyebrow" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={label.includes("*")}
        data-testid={testid}
        className="mt-2 w-full bg-[#0A1128] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm"
      />
    </div>
  );
}
