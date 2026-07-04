import PageHero from "@/components/PageHero";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";

export default function Projects() {
  return (
    <div data-testid="page-projects">
      <PageHero
        eyebrow="Projects"
        title="Delivered across India's most revered temples."
        subtitle="Government-approved implementations spanning ERP, queue management, digital ID, QR verification, and mobile applications — trusted at scale."
        testid="projects-hero"
      />
      <ProjectsShowcase />
    </div>
  );
}
