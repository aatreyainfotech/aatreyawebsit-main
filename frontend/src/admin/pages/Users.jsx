import { useEffect, useState } from "react";
import api from "../api";
import { PageHeader, Drawer } from "../ResourcePage";
import { useAuth } from "../AuthContext";
import { toast } from "sonner";
import { UserPlus, Trash2, Loader2, ShieldCheck, User as UserIcon, CheckSquare, Square } from "lucide-react";

// Sidebar sections an employee can be granted access to.
// Keys MUST match the `key` values in AdminLayout NAV.
export const PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "hero-slides", label: "Hero Slides" },
  { key: "services", label: "Services" },
  { key: "projects", label: "Projects" },
  { key: "products", label: "Products" },
  { key: "testimonials", label: "Testimonials" },
  { key: "news", label: "News & Blogs" },
  { key: "clients", label: "Clients" },
  { key: "recognitions", label: "Recognitions" },
  { key: "statistics", label: "Statistics" },
  { key: "contact-inbox", label: "Contact Inbox" },
  { key: "settings", label: "Site Settings" },
];

const ROLES = ["admin", "manager", "editor", "viewer"];

const emptyForm = {
  name: "",
  mobile: "",
  password: "",
  role: "editor",
  permissions: ["dashboard"],
  is_active: true,
};

function errMsg(e, fallback) {
  const d = e?.response?.data?.detail;
  if (Array.isArray(d) && d.length) return d[0]?.msg || fallback;
  return d || fallback;
}

export default function Users() {
  const { user: me } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = creating
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      name: u.name || "",
      mobile: u.mobile || "",
      password: "",
      role: u.role || "editor",
      permissions: Array.isArray(u.permissions) ? u.permissions : [],
      is_active: u.is_active !== false,
    });
    setOpen(true);
  };

  const togglePerm = (key) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter((p) => p !== key)
        : [...f.permissions, key],
    }));
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!editing && !form.mobile.trim()) return toast.error("Mobile is required");
    if (!editing && form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (editing && form.password && form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setSaving(true);
    try {
      if (editing) {
        const payload = {
          name: form.name.trim(),
          role: form.role,
          permissions: form.permissions,
          is_active: form.is_active,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/admin/users/${editing.id}`, payload);
        toast.success("User updated");
      } else {
        await api.post("/admin/users", {
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          password: form.password,
          role: form.role,
          permissions: form.permissions,
          is_active: form.is_active,
        });
        toast.success("User created");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast.error(errMsg(e, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${u.id}`);
      toast.success("User deleted");
      await load();
    } catch (e) {
      toast.error(errMsg(e, "Delete failed"));
    }
  };

  const isAdminRole = form.role === "admin";

  return (
    <div>
      <PageHeader
        title="Users & Permissions"
        description="Create employee accounts and choose which sidebar sections each person can access. Admins can access everything."
        actions={
          <button className="btn-primary" onClick={openNew} data-testid="users-new-btn">
            <UserPlus size={16} /> New User
          </button>
        }
      />

      <div className="mt-8 glass overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#A0AEC0]"><Loader2 className="inline animate-spin mr-2" size={16} />Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-[#A0AEC0]">No users yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#A0AEC0] border-b border-[#D4AF37]/15">
                <th className="px-5 py-3 font-normal">Name</th>
                <th className="px-5 py-3 font-normal">Mobile</th>
                <th className="px-5 py-3 font-normal">Role</th>
                <th className="px-5 py-3 font-normal">Access</th>
                <th className="px-5 py-3 font-normal">Status</th>
                <th className="px-5 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]" data-testid={`user-row-${u.id}`}>
                  <td className="px-5 py-3 text-white flex items-center gap-2">
                    {u.role === "admin" ? <ShieldCheck size={15} className="text-[#D4AF37]" /> : <UserIcon size={15} className="text-[#A0AEC0]" />}
                    {u.name}{me?.id === u.id && <span className="text-xs text-[#A0AEC0]">(you)</span>}
                  </td>
                  <td className="px-5 py-3 text-[#A0AEC0]">{u.mobile}</td>
                  <td className="px-5 py-3 capitalize text-[#F8F9FA]/80">{u.role}</td>
                  <td className="px-5 py-3 text-[#A0AEC0]">
                    {u.role === "admin" ? "All sections" : `${(u.permissions || []).length} section${(u.permissions || []).length !== 1 ? "s" : ""}`}
                  </td>
                  <td className="px-5 py-3">
                    {u.is_active === false
                      ? <span className="text-red-400">Disabled</span>
                      : <span className="text-emerald-400">Active</span>}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(u)} className="btn-secondary text-xs mr-2" data-testid={`user-edit-${u.id}`}>Edit</button>
                    {me?.id !== u.id && (
                      <button onClick={() => remove(u)} className="btn-ghost text-xs text-red-400 hover:text-red-300" data-testid={`user-delete-${u.id}`}>
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <Drawer title={editing ? "Edit User" : "New User"} onClose={() => setOpen(false)}>
          <div className="space-y-5">
            <div>
              <label className="label-eyebrow">Full Name*</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
                data-testid="user-field-name"
              />
            </div>

            <div>
              <label className="label-eyebrow">Mobile (login username)*</label>
              <input
                type="text"
                value={form.mobile}
                disabled={!!editing}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm disabled:opacity-50"
                data-testid="user-field-mobile"
              />
              {editing && <div className="mt-1 text-xs text-[#A0AEC0]">Mobile can't be changed after creation.</div>}
            </div>

            <div>
              <label className="label-eyebrow">{editing ? "New Password (leave blank to keep)" : "Password*"}</label>
              <input
                type="text"
                value={form.password}
                placeholder={editing ? "Unchanged" : "Min 6 characters"}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm"
                data-testid="user-field-password"
              />
            </div>

            <div>
              <label className="label-eyebrow">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-2 w-full bg-[#060A14] border border-[#D4AF37]/20 focus:border-[#FF9933] px-4 py-3 text-[#F8F9FA] rounded-sm text-sm capitalize"
                data-testid="user-field-role"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="mt-1 text-xs text-[#A0AEC0]">Admins can access every section and manage users.</div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label-eyebrow">Sidebar Access</label>
                {!isAdminRole && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, permissions: form.permissions.length === PERMISSIONS.length ? [] : PERMISSIONS.map((p) => p.key) })}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    {form.permissions.length === PERMISSIONS.length ? "Clear all" : "Select all"}
                  </button>
                )}
              </div>
              {isAdminRole ? (
                <div className="mt-2 text-sm text-[#A0AEC0]">Admin role has full access to all sections.</div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {PERMISSIONS.map((p) => {
                    const checked = form.permissions.includes(p.key);
                    return (
                      <button
                        type="button"
                        key={p.key}
                        onClick={() => togglePerm(p.key)}
                        data-testid={`user-perm-${p.key}`}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm border text-left transition-colors ${
                          checked
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                            : "text-[#F8F9FA]/70 border-[#D4AF37]/15 hover:border-[#D4AF37]/30"
                        }`}
                      >
                        {checked ? <CheckSquare size={15} /> : <Square size={15} />}
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm text-[#F8F9FA]/80 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="accent-[#D4AF37] w-4 h-4"
                data-testid="user-field-active"
              />
              Account active (can log in)
            </label>

            <div className="flex items-center gap-2 pt-2">
              <button onClick={save} disabled={saving} className="btn-primary text-sm" data-testid="user-save-btn">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />} {editing ? "Save changes" : "Create user"}
              </button>
              <button onClick={() => setOpen(false)} disabled={saving} className="btn-ghost text-sm">Cancel</button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
