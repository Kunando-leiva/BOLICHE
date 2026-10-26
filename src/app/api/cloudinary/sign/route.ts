import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { signParams } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { paramsToSign } = await req.json();
  return NextResponse.json({ signature: signParams(paramsToSign) });
}