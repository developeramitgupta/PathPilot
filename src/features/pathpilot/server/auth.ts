import "server-only";

import { auth } from "@clerk/nextjs/server";

import { serviceAvailability } from "@/lib/env";

export async function getPathPilotUserId() {
  if (!serviceAvailability.clerk) {
    return "preview-user";
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  return userId;
}
