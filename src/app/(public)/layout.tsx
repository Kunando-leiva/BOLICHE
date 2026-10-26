import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getSettings, getVenue } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const [settings, venue] = await Promise.all([getSettings(), getVenue()]);
  return (
    <>
      <Header clubName={settings.clubName} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} address={venue.address} />
    </>
  );
}