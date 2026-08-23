import type { AgentOutput } from "@/lib/ai/schemas";

export interface ModuleExecutionContext {
  userId: string;
  profileVersion: string;
  decisionMemoryVersion: string;
  requestId: string;
}

export interface PathPilotModuleService<TInput, TResult> {
  execute(input: TInput, context: ModuleExecutionContext): Promise<AgentOutput<TResult>>;
}

export type ModuleServiceKey =
  | "careerDiscovery"
  | "collegeFinder"
  | "examNavigator"
  | "degreeAdvisor"
  | "roadmapGenerator"
  | "learningCoach"
  | "projectMentor"
  | "resumeAnalyzer"
  | "githubAnalyzer"
  | "opportunityFinder"
  | "interviewCoach"
  | "progressDashboard"
  | "careerSimulator"
  | "whatIfSimulator"
  | "careerHealthScore"
  | "opportunityRadar"
  | "studentTimeline"
  | "futureTwin"
  | "decisionMemory"
  | "missionMode"
  | "parentAlignment"
  | "cohortCompass"
  | "localOpportunityGraph"
  | "skillDecayTracker"
  | "microMentorMatching"
  | "narrativePortfolio"
  | "financialRealityPlanner"
  | "confidenceJournal"
  | "dynamicInterviewPanel"
  | "regretMinimizationReport";

export class ModuleNotImplementedError extends Error {
  constructor(public readonly moduleKey: ModuleServiceKey) {
    super(`${moduleKey} has a contract but is not connected yet.`);
    this.name = "ModuleNotImplementedError";
  }
}

export function createPlaceholderModuleService<TInput, TResult>(moduleKey: ModuleServiceKey) {
  return {
    async execute(): Promise<AgentOutput<TResult>> {
      throw new ModuleNotImplementedError(moduleKey);
    },
  } satisfies PathPilotModuleService<TInput, TResult>;
}

export const placeholderServices = {
  careerDiscovery: createPlaceholderModuleService("careerDiscovery"),
  collegeFinder: createPlaceholderModuleService("collegeFinder"),
  examNavigator: createPlaceholderModuleService("examNavigator"),
  degreeAdvisor: createPlaceholderModuleService("degreeAdvisor"),
  roadmapGenerator: createPlaceholderModuleService("roadmapGenerator"),
  learningCoach: createPlaceholderModuleService("learningCoach"),
  projectMentor: createPlaceholderModuleService("projectMentor"),
  resumeAnalyzer: createPlaceholderModuleService("resumeAnalyzer"),
  githubAnalyzer: createPlaceholderModuleService("githubAnalyzer"),
  opportunityFinder: createPlaceholderModuleService("opportunityFinder"),
  interviewCoach: createPlaceholderModuleService("interviewCoach"),
  progressDashboard: createPlaceholderModuleService("progressDashboard"),
  careerSimulator: createPlaceholderModuleService("careerSimulator"),
  whatIfSimulator: createPlaceholderModuleService("whatIfSimulator"),
  careerHealthScore: createPlaceholderModuleService("careerHealthScore"),
  opportunityRadar: createPlaceholderModuleService("opportunityRadar"),
  studentTimeline: createPlaceholderModuleService("studentTimeline"),
  futureTwin: createPlaceholderModuleService("futureTwin"),
  decisionMemory: createPlaceholderModuleService("decisionMemory"),
  missionMode: createPlaceholderModuleService("missionMode"),
  parentAlignment: createPlaceholderModuleService("parentAlignment"),
  cohortCompass: createPlaceholderModuleService("cohortCompass"),
  localOpportunityGraph: createPlaceholderModuleService("localOpportunityGraph"),
  skillDecayTracker: createPlaceholderModuleService("skillDecayTracker"),
  microMentorMatching: createPlaceholderModuleService("microMentorMatching"),
  narrativePortfolio: createPlaceholderModuleService("narrativePortfolio"),
  financialRealityPlanner: createPlaceholderModuleService("financialRealityPlanner"),
  confidenceJournal: createPlaceholderModuleService("confidenceJournal"),
  dynamicInterviewPanel: createPlaceholderModuleService("dynamicInterviewPanel"),
  regretMinimizationReport: createPlaceholderModuleService("regretMinimizationReport"),
} satisfies Record<ModuleServiceKey, PathPilotModuleService<unknown, unknown>>;
