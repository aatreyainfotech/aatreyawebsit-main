import ResourcePage from "../ResourcePage";

const fields = [
  { name: "name", label: "Recognition Name", type: "text", required: true, placeholder: "e.g. MSME" },
  { name: "logo", label: "Logo / Emblem", type: "image" },
  { name: "label", label: "Full Title", type: "text", placeholder: "e.g. Ministry of Micro, Small & Medium Enterprises" },
  { name: "sub", label: "Sub Text", type: "text", placeholder: "e.g. Registered Enterprise" },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Show on website", type: "boolean" },
];

const listColumns = [
  { name: "logo", label: "", type: "image" },
  { name: "name", label: "Recognition" },
  { name: "label", label: "Title" },
  { name: "sort_order", label: "Order" },
  { name: "is_active", label: "Status", type: "boolean" },
];

export default function Recognitions() {
  return (
    <ResourcePage
      testid="page-recognitions"
      title="Government Recognitions"
      description="Government recognition badges shown on the homepage — MSME, DPIIT, Startup India, etc. Upload the official emblem for each."
      path="recognitions"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
