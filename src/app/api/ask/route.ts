import { NextResponse } from "next/server";
import { z } from "zod";

import { answerPathPilotQuestion } from "@/lib/ai/orchestrator";
import { pathPilotApiError } from "@/features/pathpilot/server/api";
import { getPathPilotUserId } from "@/features/pathpilot/server/auth";

const requestSchema = z.object({
  question: z.string().trim().min(3).max(1000),
  profile: z.record(z.string(), z.unknown()).optional(),
  decisionMemory: z.array(z.record(z.string(), z.unknown())).optional(),
});

export async function POST(request: Request) {
  try {
    await getPathPilotUserId();
    const input = requestSchema.parse(await request.json());
    return NextResponse.json(
      await answerPathPilotQuestion(input.question, {
        profile: input.profile,
        decisionMemory: input.decisionMemory,
      }),
    );
  } catch (error) {
    return pathPilotApiError(error);
  }
}
