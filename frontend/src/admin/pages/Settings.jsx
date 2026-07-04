import { useEffect, useState } from "react";
import api from "../api";
import { PageHeader } from "../ResourcePage";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

const FIELDS = [
  { name: "site_title", label: "Site Title", type: "text" },
  { name: "logo", label: "Logo URL", type: "text" },
  { name: "favicon", label: "Favicon URL", type: "text" },
  { name: "contact_phone", label: "Contact Phone", type: "text" },
  { name: "contact_email", label: "Contact Email", type: "text" },
  { name: "contact_address", label: "Contact Address", type: "textarea" },
  { name: "footer_text", label: "Footer Text", type: "textarea" },
  { name: "seo_title", label: "SEO Title", type: "text" },
  { name: "seo_description", label: "SEO Description", type: "textarea" },
  { name: "seo_keywords", label: "SEO Keywords", type: "text" },
  { name: "google_analytics_id", label: "Google Analytics ID", type: "text", placeholder: "G-XXXXXX" },
  { name: "meta_pixel_id", label: "Meta Pixel ID", type: "text" },
];

const SOCIAL = ["facebook", "twitter", "linkedin", "instagram", "youtube", "whatsapp"];

export default function Settings() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/settings")
      .then((r) => setData(r.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...data };
      payload.social_links = data.social_links || {};
      const { data: saved } = await api.put("/admin/settings", payload);
      setData(saved);
      toast.success("Settings saved");
    } catch (e) {
      const detail = e?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-[#A0AEC0]"><Loader2 className="inline animate-spin mr-2" size={16} /> Loading settings…</div>;

  return (
    <div data-testid="page-settings">
      <PageHeader
        title="Site Settings"
        description="Global website configuration — branding, SEO defaults, analytics, and social links."
        actions={
          <button className="btn-primary" onClick={save} disabled={saving} data-testid="settings-save-btn">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Settings</>}
          </button>
        }
      />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 space-y-5">
          <div className="font-display text-white text-xl">Branding & Contact</div>
          {FIELDS.slice(0, 6).map((f) => (
            <FieldEditor key={f.name} field={f} value={data[f.name]} onChange={(v) => setData({ ...data, [f.name]: v })} />
          ))}
        </div>

        <div className="glass p-6 space-y-5">
          <div className="font-display text-white text-xl">SEO & Analytics</div>
          {FIELDS.slice(6).map((f) => (
            <FieldEditor key={f.name} field={f} value={data[f.name]} onChange={(v) => setData({ ...data, [f.name]: v })} />
          ))}
        </div>

        <div className="lg:col-span-2 glass p-6 space-y-5">
          <div className="font-display text-white text-xl">Social Links</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOCIAL.map((k) => (
              <FieldEditor
                key={k}
                field={{ name: k, label: k.charAt(0).toUpperCase() + k.slice(1), type: "text", placeholder: `https://${k}.com/aatreya` }}
                value={data.social_links?.[k] || ""}
                onChange={(v) => setData({ ...data, social_links: { ...(data.social_links || {}), [k]: v } })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldEditor({ field, value, onChange }) {
  return (
    <div>
      <label className="label-eyebrow" htmlFor={`s-${field.name}`}>{field.label}</label>
      {field.type === "textarea" ? (
        <textarea
          id={`s-${field.name}`}
          value={value ?? ""}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          data-testid={`settings-${field.name}`}
          className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
        />
      ) : (
        <input
          id={`s-${field.name}`}
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          data-testid={`settings-${field.name}`}
          className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
        />
      )}
    </div>
  );
}
