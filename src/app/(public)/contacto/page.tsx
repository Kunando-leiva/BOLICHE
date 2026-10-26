import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { getSettings, getVenue } from "@/lib/data";
import { PageHero } from "@/components/public/PageHero";
import { InquiryForm } from "@/components/public/InquiryForm";
import { toInputDay } from "@/lib/utils";

export const metadata: Metadata = { title: "Contacto" };

export default async function ContactPage() {
  const [settings, venue] = await Promise.all([getSettings(), getVenue()]);

  return (
    <>
      <PageHero eyebrow="Alquiler del salón" title="Consultá disponibilidad" intro="Contanos qué evento tenés en mente y te respondemos con disponibilidad y presupuesto. Enviar la consulta no confirma la reserva: primero verificamos la fecha." />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[3fr_2fr] md:px-10">
        <div className="rounded-3xl border border-line bg-surface p-6 md:p-10">
          <InquiryForm minDate={toInputDay(new Date())} />
        </div>
        <aside className="space-y-8">
          {settings.whatsapp && (
            <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hola! Quiero consultar por el salón de " + settings.clubName)}`} target="_blank" rel="noreferrer" className="btn btn-cyan w-full" data-testid="whatsapp-btn">
              <MessageCircle className="h-4 w-4" /> Escribinos por WhatsApp
            </a>
          )}
          <div className="space-y-6 rounded-3xl border border-line p-8 text-sm">
            {settings.hours && (
              <div className="flex gap-4"><Clock className="h-5 w-5 shrink-0 text-magenta" /><p className="whitespace-pre-line text-fog/80" data-testid="contact-hours">{settings.hours}</p></div>
            )}
            {venue.address && <div className="flex gap-4"><MapPin className="h-5 w-5 shrink-0 text-magenta" /><p className="text-fog/80">{venue.address}</p></div>}
            {settings.email && (
              <div className="flex gap-4"><Mail className="h-5 w-5 shrink-0 text-magenta" /><a href={`mailto:${settings.email}`} className="text-fog/80 hover:text-cyan">{settings.email}</a></div>
            )}
          </div>
          {venue.mapEmbedUrl && <iframe src={venue.mapEmbedUrl} className="h-64 w-full rounded-3xl border border-line grayscale invert-[0.9]" loading="lazy" title="Mapa" />}
        </aside>
      </section>
    </>
  );
}