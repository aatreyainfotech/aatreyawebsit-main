import ResourcePage from "../ResourcePage";

const fields = [
  { name: "name", label: "Product Name", type: "text", required: true },
  { name: "tagline", label: "Tagline", type: "text" },
  { name: "description", label: "Description", type: "textarea", rows: 4 },
  { name: "logo", label: "Logo", type: "image" },
  { name: "banner", label: "Banner", type: "image" },
  { name: "screenshots", label: "Screenshot URLs", type: "list" },
  { name: "features", label: "Features", type: "list" },
  { name: "modules", label: "Modules", type: "list" },
  { name: "play_store", label: "Play Store URL", type: "text" },
  { name: "app_store", label: "App Store URL", type: "text" },
  { name: "download_url", label: "Direct Download (APK / PDF)", type: "text" },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Show on website", type: "boolean" },
];

const listColumns = [
  { name: "banner", label: "", type: "image" },
  { name: "name", label: "Product" },
  { name: "tagline", label: "Tagline" },
  { name: "sort_order", label: "Order" },
  { name: "is_active", label: "Status", type: "boolean" },
];

export default function Products() {
  return (
    <ResourcePage
      testid="page-products"
      title="Products"
      description="Aatreya's flagship products — Temple ERP, OmniCloud, Digital ID Pass, WhatsApp Platform, Photo Ticketing, and more."
      path="products"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
