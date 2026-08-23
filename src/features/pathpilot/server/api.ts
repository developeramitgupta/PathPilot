import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function pathPilotApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Some answers need attention.",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }
  return NextResponse.json(
    { error: "PathPilot could not complete that request. Please try again." },
    { status: 500 },
  );
}
