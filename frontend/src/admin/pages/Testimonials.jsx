import ResourcePage from "../ResourcePage";

const fields = [
  { name: "temple", label: "Temple / Organization", type: "text", required: true },
  { name: "officer_name", label: "Officer Name", type: "text", required: true },
  { name: "designation", label: "Designation", type: "text" },
  { name: "photo", label: "Photo", type: "image" },
  { name: "review", label: "Review", type: "textarea", rows: 5, required: true },
  { name: "rating", label: "Rating (1–5)", type: "number", default: 5 },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Show on website", type: "boolean" },
];

const listColumns = [
  { name: "photo", label: "", type: "image" },
  { name: "temple", label: "Temple" },
  { name: "officer_name", label: "Officer" },
  { name: "rating", label: "Rating" },
  { name: "is_active", label: "Status", type: "boolean" },
];

export default function Testimonials() {
  return (
    <ResourcePage
      testid="page-testimonials"
      title="Testimonials"
      description="Voice of clients from temples and government departments. Displayed across Home and About pages."
      path="testimonials"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
