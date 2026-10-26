import { z } from "zod";
import { parseLocalDate, startOfToday } from "@/lib/utils";

const localDate = z
  .string({ message: "Fecha inválida" })
  .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/, { message: "Fecha inválida" })
  .transform(parseLocalDate);

const optionalText = z.string().trim().optional().transform((v) => v || null);
const optionalUrl = z
  .union([z.url({ message: "URL inválida" }), z.literal("")])
  .optional()
  .transform((v) => v || null);
const lines = z
  .string()
  .optional()
  .transform((v) => (v ?? "").split("\n").map((s) => s.trim()).filter(Boolean));

export const loginSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Ingresá la contraseña" }),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2, { message: "El título es obligatorio" }),
  description: z.string().trim().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  date: localDate,
  endTime: optionalText,
  doorsOpen: optionalText,
  category: optionalText,
  lineup: lines,
  price: optionalText,
  ticketUrl: optionalUrl,
  flyerUrl: optionalText,
  flyerPublicId: optionalText,
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]),
});

export const albumSchema = z.object({
  title: z.string().trim().min(2, { message: "El título es obligatorio" }),
  date: localDate,
  coverUrl: optionalText,
  eventId: optionalText,
  featured: z.boolean(),
  published: z.boolean(),
});

export const mediaSchema = z.object({
  url: z.url(),
  publicId: z.string().min(1),
  type: z.enum(["IMAGE", "VIDEO"]),
});

export const venueSchema = z.object({
  title: z.string().trim().min(2, { message: "El título es obligatorio" }),
  description: z.string().trim(),
  capacity: z.coerce.number().int().min(0),
  address: z.string().trim(),
  mapEmbedUrl: optionalUrl,
  heroUrl: optionalText,
  amenities: lines,
  eventTypes: lines,
});

export const sectionSchema = z.object({
  name: z.string().trim().min(2, { message: "El nombre es obligatorio" }),
  description: z.string().trim(),
  capacity: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number().int().min(0).optional()),
  imageUrl: optionalText,
  order: z.coerce.number().int().default(0),
});

export const settingsSchema = z.object({
  clubName: z.string().trim().min(2, { message: "El nombre es obligatorio" }),
  tagline: z.string().trim(),
  whatsapp: z.string().trim().regex(/^\d*$/, { message: "WhatsApp: solo números con código de país" }),
  instagram: z.string().trim().transform((v) => v.replace(/^@/, "")),
  tiktok: z.string().trim().transform((v) => v.replace(/^@/, "")),
  email: z.union([z.email({ message: "Email inválido" }), z.literal("")]),
  hours: z.string().trim(),
  heroImageUrl: optionalText,
  heroVideoUrl: optionalText,
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2, { message: "Ingresá tu nombre" }),
  email: z.email({ message: "Email inválido" }),
  phone: z.string().trim().min(6, { message: "Ingresá un teléfono válido" }),
  type: z.enum(["PRIVATE_EVENT", "BIRTHDAY", "CORPORATE", "OTHER"]),
  date: localDate.refine((d) => d >= startOfToday(), { message: "La fecha ya pasó" }),
  guests: z.coerce.number().int().min(1, { message: "Mínimo 1 persona" }).max(500, { message: "Máximo 500 personas" }),
  message: optionalText,
});