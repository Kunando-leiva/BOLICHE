import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { startOfToday } from "@/lib/utils";

export { startOfToday };

export const getSettings = cache(() =>
  prisma.siteSettings.upsert({ where: { id: "main" }, create: { id: "main" }, update: {} }),
);

export const getVenue = cache(() =>
  prisma.venueInfo.upsert({ where: { id: "main" }, create: { id: "main" }, update: {} }),
);

export function getUpcomingEvents(take?: number, featuredOnly = false) {
  return prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      date: { gte: startOfToday() },
      ...(featuredOnly ? { featured: true } : {}),
    },
    orderBy: { date: "asc" },
    take,
  });
}

export function getPastEvents(take = 10) {
  return prisma.event.findMany({
    where: { status: "PUBLISHED", date: { lt: startOfToday() } },
    orderBy: { date: "desc" },
    take,
  });
}

export async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>) {
  let slug = base || "item";
  for (let i = 2; await exists(slug); i++) slug = `${base}-${i}`;
  return slug;
}