import Hero from "@/components/sections/Hero";
import AboutSnippet from "@/components/sections/AboutSnippet";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import WhyChoose from "@/components/sections/WhyChoose";
import Vision from "@/components/sections/Vision";
import Stats from "@/components/sections/Stats";
import Testimonial from "@/components/sections/Testimonial";
import Recognitions from "@/components/sections/Recognitions";

export default function Home() {
  return (
    <div data-testid="page-home">
      <Hero />
      <AboutSnippet />
      <Recognitions />
      <ServicesGrid />
      <ProjectsShowcase limit={4} />
      <WhyChoose />
      <Vision />
      <Stats />
      <Testimonial />
    </div>
  );
}
