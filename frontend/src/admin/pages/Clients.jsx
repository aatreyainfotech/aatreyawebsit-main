import ResourcePage from "../ResourcePage";

const fields = [
  { name: "name", label: "Client / Temple Name", type: "text", required: true },
  { name: "logo", label: "Logo", type: "image" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "temple", label: "Temple" },
      { value: "government", label: "Government" },
      { value: "private", label: "Private" },
      { value: "corporate", label: "Corporate" },
    ],
    default: "temple",
  },
  { name: "website", label: "Website URL", type: "text" },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Show on website", type: "boolean" },
];

const listColumns = [
  { name: "logo", label: "", type: "image" },
  { name: "name", label: "Client" },
  { name: "category", label: "Category" },
  { name: "sort_order", label: "Order" },
  { name: "is_active", label: "Status", type: "boolean" },
];

export default function Clients() {
  return (
    <ResourcePage
      testid="page-clients"
      title="Clients"
      description="Client logos displayed on the homepage and clients page — temples, government departments, corporates."
      path="clients"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
