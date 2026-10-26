import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TZDate } from "@date-fns/tz";
import type { ZodError } from "zod";

export type ActionState = { ok?: boolean; error?: string; message?: string };

export const APP_TZ = process.env.NEXT_PUBLIC_APP_TIMEZONE || "America/Argentina/Buenos_Aires";

export function inTz(date: Date) {
  return new TZDate(date, APP_TZ);
}

export function parseLocalDate(value: string) {
  const [y, m, d, h = 0, min = 0] = value.split(/[-T:]/).map(Number);
  return new Date(new TZDate(y, m - 1, d, h, min, APP_TZ).getTime());
}

export function startOfToday() {
  const now = TZDate.tz(APP_TZ);
  return new Date(new TZDate(now.getFullYear(), now.getMonth(), now.getDate(), APP_TZ).getTime());
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function fmt(date: Date, pattern: string) {
  return format(inTz(date), pattern, { locale: es });
}

export function toInputDate(date: Date) {
  return format(inTz(date), "yyyy-MM-dd'T'HH:mm");
}

export function toInputDay(date: Date) {
  return format(inTz(date), "yyyy-MM-dd");
}

export function firstError(error: ZodError) {
  return error.issues[0]?.message ?? "Datos inválidos";
}

export function formBool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function formObject(formData: FormData) {
  return Object.fromEntries(Array.from(formData.entries()).filter(([, v]) => typeof v === "string"));
}

export const EVENT_STATUS = { DRAFT: "Borrador", PUBLISHED: "Publicado", CANCELLED: "Cancelado" } as const;
export const INQUIRY_TYPES = { PRIVATE_EVENT: "Evento privado", BIRTHDAY: "Cumpleaños", CORPORATE: "Evento corporativo", OTHER: "Otro" } as const;
export const INQUIRY_STATUS = { PENDING: "Pendiente", CONTACTED: "Contactado", CLOSED: "Cerrado" } as const;