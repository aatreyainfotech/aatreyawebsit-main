import ResourcePage from "../ResourcePage";

const fields = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "icon", label: "Icon (lucide name)", type: "text", placeholder: "e.g. LayoutDashboard, QrCode, MessageCircle", help: "Any Lucide icon name. See lucide.dev/icons" },
  { name: "image", label: "Image / Banner", type: "image" },
  { name: "description", label: "Description", type: "textarea", rows: 4, required: true },
  { name: "features", label: "Features / Modules", type: "list", help: "One per line — shown as bullets on service detail." },
  { name: "button_text", label: "Button Text", type: "text" },
  { name: "button_link", label: "Button Link", type: "text" },
  { name: "seo_title", label: "SEO Title", type: "text" },
  { name: "seo_description", label: "SEO Description", type: "textarea", rows: 2 },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Show on website", type: "boolean" },
];

const listColumns = [
  { name: "image", label: "", type: "image" },
  { name: "title", label: "Title" },
  { name: "icon", label: "Icon" },
  { name: "sort_order", label: "Order" },
  { name: "is_active", label: "Status", type: "boolean" },
];

export default function Services() {
  return (
    <ResourcePage
      testid="page-services"
      title="Services"
      description="Manage the enterprise digital solutions offered by Aatreya — Temple ERP, Queue Management, Digital ID Pass, QR Technology, and more."
      path="services"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
