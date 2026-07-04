import ResourcePage from "../ResourcePage";

const fields = [
  { name: "name", label: "Project Name", type: "text", required: true },
  { name: "temple", label: "Temple / Client", type: "text" },
  { name: "location", label: "Location (Display)", type: "text", placeholder: "e.g. Dwaraka Tirumala, Eluru District" },
  { name: "district", label: "District", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "cover_image", label: "Cover Image", type: "image" },
  { name: "logo", label: "Client Logo", type: "image" },
  { name: "gallery", label: "Gallery URLs", type: "list", help: "Paste image URLs one per line." },
  { name: "work_order", label: "Work Order / Reference", type: "text" },
  { name: "status", label: "Status", type: "text", placeholder: "e.g. Successfully Running Since 2022" },
  { name: "features", label: "Implemented Modules", type: "list" },
  { name: "technologies", label: "Technologies Used", type: "list" },
  { name: "description", label: "Description", type: "textarea", rows: 5 },
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
  { name: "is_special", label: "Mark as Special Deployment", type: "boolean", help: "Highlights as a 'Special Deployment' (e.g. PM visits)." },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Show on website", type: "boolean" },
];

const listColumns = [
  { name: "cover_image", label: "", type: "image" },
  { name: "name", label: "Project" },
  { name: "location", label: "Location" },
  { name: "category", label: "Category" },
  { name: "sort_order", label: "Order" },
  { name: "is_active", label: "Status", type: "boolean" },
];

export default function Projects() {
  return (
    <ResourcePage
      testid="page-projects"
      title="Projects"
      description="Portfolio of temple, government, and enterprise projects delivered by Aatreya. Each project includes work order, modules, and cover imagery."
      path="projects"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
