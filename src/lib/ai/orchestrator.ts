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
    super("The LangGraph orchestrator adapter will be connected in Milestone 2.");
    this.name = "OrchestratorNotConfiguredError";
  }
}
