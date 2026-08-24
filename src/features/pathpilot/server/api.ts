import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function pathPilotApiError(error: unknown) {
  const requestId = crypto.randomUUID();
  const headers = { "x-request-id": requestId };
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Some answers need attention.",
        requestId,
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422, headers },
    );
  }
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Please sign in to continue.", requestId }, { status: 401, headers });
  }
  console.error(`[PathPilot API ${requestId}]`, error instanceof Error ? error.message : "Unknown server error");
  return NextResponse.json(
    { error: "PathPilot could not complete that request. Please try again.", requestId },
    { status: 500, headers },
  );
}
