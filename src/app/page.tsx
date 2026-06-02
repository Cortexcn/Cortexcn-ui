import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/app/(home)/hero";

export default function Page() {
  return (
    <div className="min-h-svh">
      <SiteHeader />

      <main className="max-w-screen overflow-x-clip">
        <div className="mx-auto border-x border-line md:max-w-3xl">
          <Hero />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
