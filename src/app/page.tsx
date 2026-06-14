import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/app/(home)/hero";

export default function Page() {
  return (
    <div className="min-h-svh">
      <SiteHeader />

      <main className="max-w-screen overflow-x-clip">
        <Hero />
      </main>

      <SiteFooter />
    </div>
  );
}
