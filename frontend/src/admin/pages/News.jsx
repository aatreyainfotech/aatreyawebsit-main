import ResourcePage from "../ResourcePage";

const fields = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "auto-generated if empty" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "news", label: "News" },
      { value: "blog", label: "Blog" },
      { value: "announcement", label: "Announcement" },
      { value: "press-release", label: "Press Release" },
    ],
    default: "news",
  },
  { name: "cover_image", label: "Cover Image", type: "image" },
  { name: "excerpt", label: "Excerpt / Summary", type: "textarea", rows: 3 },
  { name: "content", label: "Content", type: "textarea", rows: 12, help: "Markdown or plain text supported." },
  { name: "tags", label: "Tags", type: "list" },
  { name: "author", label: "Author", type: "text" },
  { name: "is_active", label: "Publish on website", type: "boolean" },
];

const listColumns = [
  { name: "cover_image", label: "", type: "image" },
  { name: "title", label: "Title" },
  { name: "category", label: "Category" },
  { name: "author", label: "Author" },
  { name: "is_active", label: "Published", type: "boolean" },
];

export default function News() {
  return (
    <ResourcePage
      testid="page-news"
      title="News & Blogs"
      description="Publish news, announcements, press releases, and blog posts."
      path="news"
      fields={fields}
      listColumns={listColumns}
    />
  );
}
