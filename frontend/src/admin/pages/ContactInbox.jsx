import { useEffect, useState } from "react";
import api from "../api";
import { PageHeader, Drawer } from "../ResourcePage";
import { toast } from "sonner";
import { Mail, Phone, Building2, Trash2, CheckCircle2, MailOpen, Loader2, Reply } from "lucide-react";

export default function ContactInbox() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all"); // all | unread | replied

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/contact-submissions");
      setItems(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load enquiries"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const patch = async (item, changes) => {
    try {
      await api.patch(`/admin/contact-submissions/${item.id}`, changes);
      await load();
      if (selected?.id === item.id) setSelected({ ...selected, ...changes });
    } catch { toast.error("Update failed"); }
  };

  const remove = async (item) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await api.delete(`/admin/contact-submissions/${item.id}`);
      toast.success("Deleted");
      setSelected(null);
      await load();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = items.filter((it) =>
    filter === "unread" ? !it.read : filter === "replied" ? it.replied : true
  );

  return (
    <div data-testid="page-contact-inbox">
      <PageHeader
        title="Contact Inbox"
        description="Enquiries submitted from the public website contact form."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {[
          { k: "all", l: `All (${items.length})` },
          { k: "unread", l: `Unread (${items.filter((i) => !i.read).length})` },
          { k: "replied", l: `Replied (${items.filter((i) => i.replied).length})` },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k)}
            data-testid={`inbox-filter-${t.k}`}
            className={`px-4 py-2 text-sm border rounded-sm ${
              filter === t.k ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5" : "border-[#D4AF37]/20 text-[#F8F9FA]/80 hover:border-[#FF9933]/50"
            }`}
          >{t.l}</button>
        ))}
      </div>

      <div className="mt-6 glass">
        {loading ? (
          <div className="p-10 text-center text-[#A0AEC0]"><Loader2 className="inline animate-spin mr-2" size={16} /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-[#A0AEC0]">No enquiries here.</div>
        ) : (
          <ul className="divide-y divide-[#D4AF37]/10">
            {filtered.map((it) => (
              <li
                key={it.id}
                data-testid={`inbox-item-${it.id}`}
                onClick={() => { setSelected(it); if (!it.read) patch(it, { read: true }); }}
                className="p-5 flex items-start gap-4 cursor-pointer hover:bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center font-display text-[#D4AF37] shrink-0">
                  {(it.name || "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium text-white">{it.name}</div>
                    <span className="text-xs text-[#A0AEC0]">{it.email}</span>
                    {!it.read && <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF9933]">New</span>}
                    {it.replied && <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Replied</span>}
                  </div>
                  <div className="mt-1 text-sm text-white/85 line-clamp-1">{it.subject || "(no subject)"}</div>
                  <div className="mt-0.5 text-xs text-[#A0AEC0] line-clamp-1">{it.message}</div>
                </div>
                <div className="text-xs text-[#A0AEC0] shrink-0">
                  {new Date(it.created_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <Drawer title="Contact Enquiry" onClose={() => setSelected(null)}>
          <div className="space-y-6">
            <div>
              <div className="label-eyebrow">From</div>
              <div className="mt-2 font-display text-white text-2xl">{selected.name}</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail size={14} className="text-[#D4AF37]" /> <a className="text-[#F8F9FA]/90" href={`mailto:${selected.email}`}>{selected.email}</a></div>
                {selected.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-[#D4AF37]" /> <a className="text-[#F8F9FA]/90" href={`tel:${selected.phone}`}>{selected.phone}</a></div>}
                {selected.organization && <div className="flex items-center gap-2"><Building2 size={14} className="text-[#D4AF37]" /> {selected.organization}</div>}
              </div>
            </div>

            <div>
              <div className="label-eyebrow">Subject</div>
              <div className="mt-2 text-white">{selected.subject || "—"}</div>
            </div>

            <div>
              <div className="label-eyebrow">Message</div>
              <div className="mt-2 p-4 border-l-2 border-[#D4AF37] bg-[#060A14] text-[#F8F9FA]/90 whitespace-pre-wrap leading-relaxed text-sm">
                {selected.message}
              </div>
            </div>

            <div>
              <div className="label-eyebrow">Meta</div>
              <div className="mt-2 text-xs text-[#A0AEC0] space-y-1">
                <div>Received: {new Date(selected.created_at).toLocaleString()}</div>
                <div>Email notification: {selected.email_sent ? "sent" : "not sent"}</div>
              </div>
            </div>

            <div className="hairline" />
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || 'Your enquiry'} — Aatreya Infotech Systems LLP`)}&body=${encodeURIComponent(
                  `Dear ${selected.name},\n\n` +
                  `Thank you for reaching out to Aatreya Infotech Systems LLP. We appreciate your interest and are glad to assist you.\n\n` +
                  (selected.message ? `Regarding your enquiry:\n"${selected.message}"\n\n` : "") +
                  `\n\nWarm regards,\nTeam Aatreya\nAatreya Infotech Systems LLP\ninfo@aatreya.co.in | +91 86442 97366\nwww.aatreya.co.in`
                )}`}
                onClick={() => patch(selected, { replied: true })}
                data-testid={`inbox-reply-${selected.id}`}
                className="btn-primary text-sm"
              >
                <Reply size={14} /> Reply by email
              </a>
              {!selected.read && (
                <button onClick={() => patch(selected, { read: true })} className="btn-secondary text-sm" data-testid={`inbox-mark-read-${selected.id}`}>
                  <MailOpen size={14} /> Mark read
                </button>
              )}
              {!selected.replied && (
                <button onClick={() => patch(selected, { replied: true })} className="btn-secondary text-sm" data-testid={`inbox-mark-replied-${selected.id}`}>
                  <CheckCircle2 size={14} /> Mark replied
                </button>
              )}
              <button onClick={() => remove(selected)} className="btn-ghost text-sm text-red-400 hover:text-red-300" data-testid={`inbox-delete-${selected.id}`}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
