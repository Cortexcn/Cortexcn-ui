import { Bio } from "@/components/bio";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { Statement } from "@/components/statement";
import { Testimonials } from "@/components/testimonials";
import { Writing } from "@/components/writing";

export default function Home() {
  return (
    <>
      <Hero />
      <Bio />
      <Statement />
      <Services />
      <Projects />
      <Testimonials />
      <Writing />
      <Contact />
    </>
  );
}
