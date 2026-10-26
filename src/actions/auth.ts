"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import type { ActionState } from "@/lib/utils";

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (e) {
    if (e instanceof AuthError) return { error: "Email o contraseña incorrectos" };
    throw e;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}