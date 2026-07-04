import ResourcePage from "../ResourcePage";

const fields = [
  { name: "heading", label: "Heading", type: "text", required: true },
  { name: "subheading", label: "Subheading / Tagline", type: "text" },
  { name: "description", label: "Description", type: "textarea", rows: 3 },
  { name: "button_text", label: "Button Text", type: "text" },
  { name: "button_link", label: "Button Link", type: "text", placeholder: "/contact or https://…" },
  { name: "background_image", label: "Background Image", type: "image", help: "Recommended 1920×1080 or larger." },
  { name: "video", label: "Video URL", type: "text", help: "Optional. YouTube / MP4 URL." },
  { name: "sort_order", label: "Sort Order", type: "number" },
  { name: "is_active", label: "Show on website", type: "boolean" },
];

const listColumns = [
  { name: "background_image", label: "", type: "image" },
  { name: "heading", label: "Heading" },
  { name: "sort_order", label: "Order" },
  { name: "is_active", label: "Status", type: "boolean" },
];

export default function HeroSlides() {
  return (
    <ResourcePage
      testid="page-hero-slides"
      title="Hero Slides"
      description="Slides used on the homepage hero carousel. Each slide supports an image, video, heading, description, and call-to-action button."
      path="hero-slides"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
