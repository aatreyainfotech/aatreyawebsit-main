import { useEffect, useState, useCallback } from "react";
import api, { fileUrl } from "./api";
import { toast } from "sonner";
import { Plus, Edit3, Trash2, X, Upload, Save, Image as ImageIcon, Loader2, Search } from "lucide-react";

/**
 * ResourcePage — generic CRUD page.
 *
 * Props:
 *   title, path, fields (see below), listColumns
 *   fields: [{ name, label, type, placeholder, required?, options?, rows?, help? }]
 *   types: text | textarea | number | boolean | image | list | select
 */
export default function ResourcePage({ title, description, path, fields, listColumns, testid }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/${path}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error("Failed to load records.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    const initial = {};
    fields.forEach((f) => {
      if (f.type === "boolean") initial[f.name] = f.default ?? true;
      else if (f.type === "list") initial[f.name] = [];
      else if (f.type === "number") initial[f.name] = f.default ?? 0;
      else initial[f.name] = f.default ?? "";
    });
    setEditing({ __new: true, ...initial });
  };

  const openEdit = (item) => {
    const copy = { ...item };
    fields.forEach((f) => {
      if (f.type === "list" && !Array.isArray(copy[f.name])) copy[f.name] = [];
    });
    setEditing(copy);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {};
      fields.forEach((f) => {
        let v = editing[f.name];
        if (f.type === "number") v = Number(v || 0);
        if (f.type === "list" && typeof v === "string") v = v.split(",").map((s) => s.trim()).filter(Boolean);
        payload[f.name] = v;
      });
      if (editing.__new) {
        await api.post(`/admin/${path}`, payload);
        toast.success(`${title} created`);
      } else {
        await api.put(`/admin/${path}/${editing.id}`, payload);
        toast.success(`${title} updated`);
      }
      setEditing(null);
      await load();
    } catch (e) {
      const detail = e?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : `Failed to save ${title}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete this ${title.toLowerCase()}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/${path}/${item.id}`);
      toast.success(`${title} deleted`);
      await load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = items.filter((it) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return listColumns.some((c) => String(it[c.name] ?? "").toLowerCase().includes(q));
  });

  return (
    <div data-testid={testid || `resource-${path}`}>
      <PageHeader
        title={title}
        description={description}
        actions={
          <button className="btn-primary" onClick={openNew} data-testid={`${path}-new-btn`}>
            <Plus size={16} /> New {title.replace(/s$/, "")}
          </button>
        }
      />

      <div className="mt-8 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#A0AEC0]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            data-testid={`${path}-search`}
            className="w-full bg-[#0A1128] border border-[#D4AF37]/20 pl-9 pr-4 py-2.5 text-sm text-[#F8F9FA] rounded-sm"
          />
        </div>
        <div className="text-xs text-[#A0AEC0]">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      <div className="mt-6 glass overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#A0AEC0]"><Loader2 className="inline animate-spin mr-2" size={16} />Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-[#A0AEC0]">No records yet. Click <span className="text-[#D4AF37]">New {title.replace(/s$/, "")}</span> to add one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#050810] border-b border-[#D4AF37]/15">
              <tr>
                {listColumns.map((c) => (
                  <th key={c.name} className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-[#FF9933]">{c.label}</th>
                ))}
                <th className="px-5 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-[#FF9933]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it.id} className="border-b border-[#D4AF37]/8 hover:bg-white/[0.02]" data-testid={`${path}-row-${it.id}`}>
                  {listColumns.map((c) => (
                    <td key={c.name} className="px-5 py-3 text-[#F8F9FA]/90 align-middle">
                      {c.type === "image" ? (
                        it[c.name] ? (
                          <img src={fileUrl(it[c.name])} alt="" className="w-12 h-12 object-cover rounded-sm border border-[#D4AF37]/20" />
                        ) : <span className="text-[#A0AEC0] text-xs">—</span>
                      ) : c.type === "boolean" ? (
                        <span className={it[c.name] ? "text-[#FF9933]" : "text-[#A0AEC0]"}>
                          {it[c.name] ? "Active" : "Hidden"}
                        </span>
                      ) : c.type === "list" ? (
                        <span className="text-xs text-[#A0AEC0]">
                          {(it[c.name] || []).slice(0, 3).join(", ")}
                          {(it[c.name] || []).length > 3 ? "…" : ""}
                        </span>
                      ) : (
                        <span className="line-clamp-1 max-w-md">{String(it[c.name] ?? "")}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(it)}
                      data-testid={`${path}-edit-${it.id}`}
                      className="p-2 text-[#D4AF37] hover:text-[#FF9933]"
                      title="Edit"
                    ><Edit3 size={15} /></button>
                    <button
                      onClick={() => remove(it)}
                      data-testid={`${path}-delete-${it.id}`}
                      className="p-2 text-[#A0AEC0] hover:text-red-400"
                      title="Delete"
                    ><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <Drawer
          title={`${editing.__new ? "New" : "Edit"} ${title.replace(/s$/, "")}`}
          onClose={() => setEditing(null)}
        >
          <div className="space-y-5 pb-24">
            {fields.map((f) => (
              <FieldRenderer
                key={f.name}
                field={f}
                value={editing[f.name]}
                onChange={(v) => setEditing({ ...editing, [f.name]: v })}
              />
            ))}
          </div>
          <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-[#0A1128]/95 backdrop-blur border-t border-[#D4AF37]/15 flex items-center justify-end gap-3">
            <button className="btn-ghost" onClick={() => setEditing(null)} data-testid={`${path}-cancel`}>Cancel</button>
            <button className="btn-primary" onClick={save} disabled={saving} data-testid={`${path}-save`}>
              {saving ? <><Loader2 className="animate-spin" size={16} /> Saving…</> : <><Save size={16} /> Save</>}
            </button>
          </div>
        </Drawer>
      )}
    </div>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <div className="label-eyebrow">Aatreya CMS</div>
        <h1 className="mt-2 font-display font-light text-white text-3xl md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-[#A0AEC0] max-w-2xl">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Drawer({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex" role="dialog">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="w-full max-w-2xl bg-[#0A1128] border-l border-[#D4AF37]/25 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#0A1128]/95 backdrop-blur border-b border-[#D4AF37]/15 px-6 py-4 flex items-center justify-between">
          <div className="font-display text-white text-xl">{title}</div>
          <button onClick={onClose} className="p-2 text-[#A0AEC0] hover:text-white" data-testid="drawer-close"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FieldRenderer({ field, value, onChange }) {
  const label = (
    <label className="label-eyebrow" htmlFor={field.name}>
      {field.label}{field.required ? "*" : ""}
    </label>
  );

  if (field.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          id={field.name}
          value={value ?? ""}
          rows={field.rows || 4}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          data-testid={`field-${field.name}`}
          className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
        />
        {field.help && <div className="mt-1 text-xs text-[#A0AEC0]">{field.help}</div>}
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div>
        {label}
        <input
          id={field.name}
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          data-testid={`field-${field.name}`}
          className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
        />
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(!value)}
          data-testid={`field-${field.name}`}
          className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-[#D4AF37]" : "bg-[#0A1128] border border-[#D4AF37]/25"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? "left-5" : "left-0.5"}`} />
        </button>
        <div>
          <div className="text-sm text-white">{field.label}</div>
          {field.help && <div className="text-xs text-[#A0AEC0]">{field.help}</div>}
        </div>
      </div>
    );
  }

  if (field.type === "image") {
    return <ImageUploadField field={field} value={value} onChange={onChange} />;
  }

  if (field.type === "select") {
    return (
      <div>
        {label}
        <select
          id={field.name}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          data-testid={`field-${field.name}`}
          className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
        >
          {field.options.map((o) => (
            <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
              {typeof o === "string" ? o : o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "list") {
    return (
      <div>
        {label}
        <textarea
          id={field.name}
          value={Array.isArray(value) ? value.join("\n") : (value || "")}
          rows={4}
          placeholder={field.placeholder || "One item per line"}
          onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          data-testid={`field-${field.name}`}
          className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
        />
        <div className="mt-1 text-xs text-[#A0AEC0]">{field.help || "Enter one item per line."}</div>
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        id={field.name}
        type={field.type === "email" ? "email" : "text"}
        value={value ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`field-${field.name}`}
        className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
      />
      {field.help && <div className="mt-1 text-xs text-[#A0AEC0]">{field.help}</div>}
    </div>
  );
}

function ImageUploadField({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/admin/uploads", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
      toast.success("Uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <div className="label-eyebrow">{field.label}</div>
      <div className="mt-2 flex items-start gap-4">
        <div className="w-24 h-24 border border-[#D4AF37]/20 bg-[#060A14] flex items-center justify-center overflow-hidden rounded-sm shrink-0">
          {value ? (
            <img src={fileUrl(value)} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={22} className="text-[#A0AEC0]" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#D4AF37]/30 text-[#D4AF37] text-sm cursor-pointer hover:bg-[#D4AF37]/5 rounded-sm">
            <Upload size={14} /> {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*" onChange={onFile} className="hidden" data-testid={`field-${field.name}-upload`} />
          </label>
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste an image URL"
            data-testid={`field-${field.name}`}
            className="w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-3 py-2 text-[#F8F9FA] text-sm rounded-sm"
          />
          {field.help && <div className="text-xs text-[#A0AEC0]">{field.help}</div>}
        </div>
      </div>
    </div>
  );
}
