import dns from 'node:dns';
// Forzamos a Node a usar IPv4 para evitar el error P1001 de Neon
dns.setDefaultResultOrder('ipv4first');

import 'dotenv/config'; // Carga las variables de entorno
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Usamos DIRECT_URL para evitar problemas con el pooler al hacer operaciones masivas
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString: connectionString! });
const prisma = new PrismaClient({ adapter });

const IMG = {
  crowdRed: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1600&q=80",
  stage: "https://images.unsplash.com/photo-1581417478175-a9ef18f210c2?auto=format&fit=crop&w=1600&q=80",
  laser: "https://images.unsplash.com/photo-1578736641330-3155e606cd40?auto=format&fit=crop&w=1600&q=80",
  blue: "https://images.unsplash.com/photo-1630395822970-acd6a691d97e?auto=format&fit=crop&w=1600&q=80",
  lounge: "https://images.unsplash.com/photo-1760598742492-7ad941e658e5?auto=format&fit=crop&w=1600&q=80",
  table: "https://images.unsplash.com/photo-1665640622150-0729c9f00adb?auto=format&fit=crop&w=1600&q=80",
  sofas: "https://images.unsplash.com/photo-1558368417-57d31049c609?auto=format&fit=crop&w=1600&q=80",
  bar: "https://images.pexels.com/photos/6032557/pexels-photo-6032557.jpeg?auto=compress&w=1600",
  lights: "https://images.pexels.com/photos/24181456/pexels-photo-24181456.jpeg?auto=compress&w=1600",
  drinks: "https://images.pexels.com/photos/18908309/pexels-photo-18908309.jpeg?auto=compress&w=1600",
};

function daysFromNow(days: number, hour = 23, minute = 30) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function seedAdmin() {
  const env = process.env;
  const email = env?.ADMIN_EMAIL?.toLowerCase();
  const password = env?.ADMIN_PASSWORD;
  
  if (!email || !password) {
    throw new Error("Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env");
  }
  
  const passwordHash = await bcrypt.hash(password, 12);
  
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Admin", role: "ADMIN" },
  });
}

async function seedDemo() {
  if ((await prisma.event.count()) > 0) return;

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      whatsapp: "5491100000000",
      instagram: "lunaclub",
      tiktok: "lunaclub",
      email: "reservas@lunaclub.com",
      hours: "Viernes · 00:00 a 06:00\nSábados · 00:00 a 07:00\nVísperas de feriado · 00:00 a 06:00",
      heroImageUrl: IMG.crowdRed,
    },
  });

  await prisma.venueInfo.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      title: "Un salón pensado para la noche",
      description:
        "Más de 900 m² con sonido envolvente, iluminación robotizada y una cabina en el centro de la pista. LUNA Club combina pista principal, sector VIP elevado y dos barras para que la noche fluya sin esperas.",
      capacity: 1200,
      address: "Av. Siempre Viva 742, Ciudad",
      mapEmbedUrl: "https://www.google.com/maps?q=Obelisco+Buenos+Aires&output=embed",
      heroUrl: IMG.laser,
      amenities: ["Sonido Funktion-One", "Pantalla LED 360°", "Guardarropa", "Seguridad privada", "Acceso adaptado", "Estacionamiento cercano"],
      eventTypes: ["Cumpleaños de 15", "Eventos corporativos", "Fiestas privadas", "After shows"],
    },
  });

  await prisma.venueSection.createMany({
    data: [
      { name: "Pista principal", description: "El corazón de LUNA: cabina central, lásers y la mejor pista de la ciudad.", capacity: 900, imageUrl: IMG.stage, order: 0 },
      { name: "VIP Eclipse", description: "Sector elevado con mesas reservadas, servicio de botella y vista a la pista.", capacity: 150, imageUrl: IMG.lounge, order: 1 },
      { name: "Barra Neón", description: "Coctelería de autor y tragos clásicos, servidos rápido.", capacity: 150, imageUrl: IMG.bar, order: 2 },
    ],
  });

  const events = [
    { slug: "luna-llena-techno", title: "Luna Llena: Techno All Night", days: 3, featured: true, price: "$8.000 anticipada", lineup: ["Nina K", "Dualis", "Marco Ferro b2b Iara"], flyerUrl: IMG.laser },
    { slug: "reggaeton-reloaded", title: "Reggaetón Reloaded", days: 4, featured: true, price: "$6.000", lineup: ["DJ Sol", "Tomi Beat"], flyerUrl: IMG.crowdRed },
    { slug: "eclipse-house-sessions", title: "Eclipse House Sessions", days: 10, featured: true, price: "$7.000", lineup: ["Lucía Mar", "Kairo"], flyerUrl: IMG.blue },
    { slug: "fiesta-retro-2000", title: "Fiesta Retro 2000", days: 11, featured: false, price: "$5.000", lineup: ["DJ Flashback"], flyerUrl: IMG.lights },
  ];

  for (const e of events) {
    await prisma.event.create({
      data: {
        slug: e.slug,
        title: e.title,
        description: `Una noche única en LUNA Club. ${e.title} llega con line-up completo, producción de luces especial y la energía de siempre. Recomendamos comprar anticipadas: los cupos son limitados.`,
        date: daysFromNow(e.days),
        doorsOpen: "00:00",
        category: "Fiesta",
        lineup: e.lineup,
        price: e.price,
        ticketUrl: "https://www.passline.com",
        flyerUrl: e.flyerUrl,
        featured: e.featured,
        status: "PUBLISHED",
      },
    });
  }

  const past = await prisma.event.create({
    data: {
      slug: "aniversario-luna",
      title: "Aniversario LUNA",
      description: "Celebramos un año más de noches inolvidables.",
      date: daysFromNow(-6),
      category: "Aniversario",
      lineup: ["Nina K", "DJ Sol", "Kairo"],
      flyerUrl: IMG.stage,
      status: "PUBLISHED",
    },
  });

  const albums = [
    { slug: "aniversario-luna", title: "Aniversario LUNA", days: -6, eventId: past.id, cover: IMG.stage, featured: true, items: [IMG.stage, IMG.crowdRed, IMG.laser, IMG.drinks, IMG.lights, IMG.blue] },
    { slug: "noche-vip", title: "Noche VIP Eclipse", days: -13, eventId: null, cover: IMG.lounge, featured: false, items: [IMG.lounge, IMG.table, IMG.sofas, IMG.bar] },
  ];

  for (const a of albums) {
    await prisma.galleryAlbum.create({
      data: {
        slug: a.slug,
        title: a.title,
        date: daysFromNow(a.days),
        coverUrl: a.cover,
        featured: a.featured,
        eventId: a.eventId,
        items: { create: a.items.map((url, order) => ({ url, order, type: "IMAGE" as const })) },
      },
    });
  }

  await prisma.rentalInquiry.create({
    data: {
      name: "Sofía Pérez",
      email: "sofia@example.com",
      phone: "+54 9 11 5555 0000",
      type: "PRIVATE_EVENT",
      date: daysFromNow(20),
      guests: 80,
      message: "Cumpleaños de 15, queremos cotizar el salón completo.",
    },
  });
}

async function main() {
  await seedAdmin();
  await seedDemo();
  console.log("Seed completo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());