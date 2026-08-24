import { z } from "zod";

import { generateStructured, isAiConfigured } from "@/lib/ai/openai";
import type { AgentOutput, PathPilotState } from "@/lib/ai/schemas";

export const specialistAgents = [
  "career-strategist",
  "education-advisor",
  "college-advisor",
  "exam-planner",
  "learning-coach",
  "project-mentor",
  "resume-reviewer",
  "interview-coach",
  "job-agent",
  "progress-analyst",
] as const;

export type SpecialistAgent = (typeof specialistAgents)[number];

export interface OrchestratorRoute {
  agent: SpecialistAgent;
  intent: string;
  traceReason: string;
}

export interface PathPilotOrchestrator {
  route(input: string, state: PathPilotState): Promise<OrchestratorRoute>;
  invoke<T>(route: OrchestratorRoute, state: PathPilotState): Promise<AgentOutput<T>>;
}

export class OrchestratorNotConfiguredError extends Error {
  constructor() {
    super("The requested specialist is not connected yet.");
    this.name = "OrchestratorNotConfiguredError";
  }
}

const askResponseSchema = z.object({
  message: z.string().min(20).max(900),
  links: z.array(z.object({ label: z.string(), href: z.string().startsWith("/") })).max(3),
});

const routingRules: Array<{
  agent: SpecialistAgent;
  terms: string[];
  intent: string;
  href: string;
}> = [
  { agent: "career-strategist", terms: ["career", "job", "role", "fit"], intent: "career guidance", href: "/career-discovery" },
  { agent: "college-advisor", terms: ["college", "campus", "institute", "admission"], intent: "college planning", href: "/colleges" },
  { agent: "education-advisor", terms: ["degree", "course", "stream", "btech", "bca", "diploma"], intent: "education planning", href: "/degrees" },
  { agent: "exam-planner", terms: ["exam", "jee", "neet", "cuet", "clat"], intent: "exam planning", href: "/exams" },
  { agent: "learning-coach", terms: ["learn", "skill", "resource", "roadmap", "study"], intent: "learning support", href: "/learning" },
  { agent: "project-mentor", terms: ["project", "portfolio", "build"], intent: "project planning", href: "/projects" },
  { agent: "resume-reviewer", terms: ["resume", "cv"], intent: "resume review", href: "/resume" },
  { agent: "interview-coach", terms: ["interview", "question", "practice"], intent: "interview practice", href: "/interview" },
  { agent: "job-agent", terms: ["internship", "opportunity", "scholarship"], intent: "opportunity search", href: "/opportunities" },
  { agent: "progress-analyst", terms: ["progress", "score", "health", "improve"], intent: "progress analysis", href: "/health-score" },
];

export function routePathPilotIntent(input: string): OrchestratorRoute & { href: string } {
  const normalized = input.toLowerCase();
  const rule =
    routingRules.find((candidate) =>
      candidate.terms.some((term) => normalized.includes(term)),
    ) ?? routingRules[0];

  return {
    agent: rule.agent,
    intent: rule.intent,
    href: rule.href,
    traceReason: `Matched ${rule.agent} from the student's ${rule.intent} language.`,
  };
}

export async function answerPathPilotQuestion(
  input: string,
  state: Partial<PathPilotState> = {},
) {
  const route = routePathPilotIntent(input);
  const fallback = {
    message: `This looks like ${route.intent}. I can use your current profile and Decision Memory to make the next step specific; open the linked module to continue with its full workflow.`,
    links: [{ label: `Open ${route.intent}`, href: route.href }],
  };

  if (!isAiConfigured()) {
    return {
      result: { ...fallback, agent: route.agent, mode: "deterministic-fallback" as const },
      reasoningRefs: ["moduleContext", "decisionMemory"],
      confidenceBand: "medium" as const,
    };
  }

  try {
    const response = await generateStructured({
      schema: askResponseSchema,
      schemaName: "pathpilot_orchestrator_response",
      system: `You are PathPilot's Master Orchestrator. The request is routed to ${route.agent}. Give concise, age-appropriate guidance, never guarantee outcomes, refer only to supplied profile and decision facts, and link only to relevant PathPilot routes.`,
      user: JSON.stringify({ input, route, state }),
    });
    return {
      result: {
        ...(response ?? fallback),
        agent: route.agent,
        mode: response ? ("ai" as const) : ("deterministic-fallback" as const),
      },
      reasoningRefs: ["profile", "decisionMemory", "moduleContext"],
      confidenceBand: response ? ("high" as const) : ("medium" as const),
    };
  } catch {
    return {
      result: { ...fallback, agent: route.agent, mode: "deterministic-fallback" as const },
      reasoningRefs: ["moduleContext", "decisionMemory"],
      confidenceBand: "medium" as const,
    };
  }
}
