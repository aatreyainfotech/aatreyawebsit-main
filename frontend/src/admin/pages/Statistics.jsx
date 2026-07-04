import ResourcePage from "../ResourcePage";

const fields = [
  { name: "value", label: "Value", type: "text", required: true, placeholder: "e.g. 100+, 99.9%, 24×7" },
  { name: "label", label: "Label", type: "text", required: true, placeholder: "e.g. Clients, Uptime, Support" },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Show on website", type: "boolean" },
];

const listColumns = [
  { name: "value", label: "Value" },
  { name: "label", label: "Label" },
  { name: "sort_order", label: "Order" },
  { name: "is_active", label: "Status", type: "boolean" },
];

export default function Statistics() {
  return (
    <ResourcePage
      testid="page-statistics"
      title="Statistics"
      description="Numeric highlights shown on Home and About pages — e.g. 100+ Clients, 99.9% Uptime."
      path="statistics"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
