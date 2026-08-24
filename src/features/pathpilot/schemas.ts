import { z } from "zod";

export const workStyleSchema = z.object({
  collaboration: z.number().int().min(1).max(5),
  structure: z.number().int().min(1).max(5),
  creativity: z.number().int().min(1).max(5),
  analysis: z.number().int().min(1).max(5),
  people: z.number().int().min(1).max(5),
  field: z.number().int().min(1).max(5),
  risk: z.number().int().min(1).max(5),
  pace: z.number().int().min(1).max(5),
});

export const onboardingProfileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  city: z.string().trim().min(2, "Enter your city."),
  currentStage: z.enum([
    "class-10",
    "class-11-12",
    "college",
    "graduate",
    "early-career",
  ]),
  interests: z.array(z.string()).min(2, "Choose at least two interests."),
  favoriteSubjects: z
    .array(z.string())
    .min(2, "Choose at least two subjects."),
  hobbies: z.array(z.string()).min(1, "Choose at least one hobby."),
  workStyle: workStyleSchema,
  preferredWorkMode: z.enum(["solo", "team", "balanced"]),
  preferredEnvironment: z.enum(["indoor", "field", "hybrid"]),
  preferredStructure: z.enum(["structured", "flexible", "balanced"]),
  salaryExpectation: z.enum(["3-6L", "6-12L", "12-20L", "20L+"]),
  locationPref: z.enum(["home-city", "anywhere-india", "remote", "global"]),
  studyPref: z.enum(["theory", "applied", "balanced"]),
  higherStudiesLean: z.number().int().min(0).max(100),
  studyBudget: z.enum(["low", "medium", "high"]),
  learningStyle: z.enum(["video", "reading", "hands-on", "blended"]),
  strengths: z.array(z.string()).min(2, "Choose at least two strengths."),
  weaknesses: z.array(z.string()).min(1, "Choose at least one growth area."),
});

export type OnboardingProfile = z.infer<typeof onboardingProfileSchema>;

export const careerMatchSchema = z.object({
  careerKey: z.string().min(1),
  careerName: z.string().min(1),
  family: z.string().min(1),
  compatibility: z.number().int().min(0).max(100),
  why: z.string().min(1),
  reasoningRefs: z.array(z.string().min(1)).min(1),
  salaryBandEntry: z.string().min(1),
  salaryBandMid: z.string().min(1),
  salaryBandSenior: z.string().min(1),
  demandTrend: z.enum(["growing", "stable", "declining"]),
  description: z.string().min(1),
  starterSkills: z.array(z.string()).min(2),
});

export const careerDiscoveryResultSchema = z.object({
  matches: z.array(careerMatchSchema).length(5),
  mode: z.enum(["ai", "deterministic-fallback"]),
  candidateCount: z.number().int().positive(),
  generatedAt: z.iso.datetime(),
});

export type CareerMatchResult = z.infer<typeof careerMatchSchema>;
export type CareerDiscoveryResult = z.infer<typeof careerDiscoveryResultSchema>;

export const collegeFinderInputSchema = z.object({
  annualBudget: z.number().int().min(25_000).max(1_500_000),
  state: z.string().trim().min(1),
  city: z.string().trim(),
  ownership: z.enum(["any", "government", "private"]),
  hostel: z.enum(["required", "preferred", "not-needed"]),
  placementPriority: z.number().int().min(1).max(5),
  branch: z.string().trim().min(1),
  scholarshipNeed: z.boolean(),
  boardPercentile: z.number().min(35).max(100),
  cultureTags: z.array(z.enum(["sports", "tech-clubs", "quiet-academic", "cultural"])),
});

export const collegeMatchSchema = z.object({
  collegeId: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  ownership: z.enum(["government", "private"]),
  tier: z.enum(["1", "2", "3"]),
  compatibility: z.number().int().min(0).max(100),
  why: z.string().min(1),
  reasoningRefs: z.array(z.string().min(1)).min(1),
  estimatedAnnualCost: z.number().int().positive(),
  hostelAvailable: z.boolean(),
  scholarshipAvailable: z.boolean(),
  branches: z.array(z.string().min(1)).min(1),
  boardCutoffDemo: z.number().min(0).max(100),
  placementRateDemo: z.number().int().min(0).max(100),
  medianPackageDemo: z.string().min(1),
  cultureTags: z.array(z.string().min(1)),
  overview: z.string().min(1),
});

export const collegeFinderResultSchema = z.object({
  matches: z.array(collegeMatchSchema).max(8),
  mode: z.enum(["ai", "deterministic-fallback"]),
  candidateCount: z.number().int().nonnegative(),
  generatedAt: z.iso.datetime(),
  disclaimer: z.literal("Cutoffs and placement figures are demo data, not live admissions data."),
});

export type CollegeFinderInput = z.infer<typeof collegeFinderInputSchema>;
export type CollegeMatchResult = z.infer<typeof collegeMatchSchema>;
export type CollegeFinderResult = z.infer<typeof collegeFinderResultSchema>;

export const examNavigatorInputSchema = z.object({
  careerGoal: z.string().trim().min(2),
  location: z.string().trim().min(1),
  annualBudget: z.number().int().min(25_000).max(1_500_000),
  collegePreference: z.enum(["any", "government", "private"]),
  difficultyTolerance: z.number().int().min(1).max(5),
});

export const examRecommendationSchema = z.object({
  examId: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  category: z.string().min(1),
  difficulty: z.number().int().min(1).max(5),
  eligibilitySummary: z.string().min(1),
  acceptedCollegesCountDemo: z.number().int().nonnegative(),
  why: z.string().min(1),
  reasoningRefs: z.array(z.string().min(1)).min(1),
  advantages: z.array(z.string().min(1)).min(2),
  successTips: z.array(z.string().min(1)).length(3),
  mockDates: z.object({
    application: z.string().min(1),
    exam: z.string().min(1),
    result: z.string().min(1),
  }),
  officialUrl: z.url(),
});

export const examNavigatorResultSchema = z.object({
  recommendations: z.array(examRecommendationSchema).max(8),
  mode: z.enum(["hybrid-ai", "rule-based-fallback"]),
  generatedAt: z.iso.datetime(),
  disclaimer: z.literal("Mock dates - verify every date on the official exam website."),
});

export type ExamNavigatorInput = z.infer<typeof examNavigatorInputSchema>;
export type ExamRecommendation = z.infer<typeof examRecommendationSchema>;
export type ExamNavigatorResult = z.infer<typeof examNavigatorResultSchema>;

export const degreeAdvisorInputSchema = z.object({
  shortlistedCareers: z.array(z.string().trim().min(1)).min(1).max(5),
  totalBudget: z.number().int().min(50_000).max(6_000_000),
  timeHorizon: z.enum(["fast", "balanced", "deep"]),
});

export const degreeComparisonSchema = z.object({
  degreeKey: z.string().min(1),
  degreeType: z.string().min(1),
  durationYears: z.number().positive(),
  averageTotalCost: z.number().int().positive(),
  typicalEntrySalary: z.string().min(1),
  topCareerOutcomes: z.array(z.string().min(1)).min(2),
  flexibilityScore: z.number().int().min(1).max(5),
  fitScore: z.number().int().min(0).max(100),
  roiNote: z.string().min(1),
  pros: z.array(z.string().min(1)).min(2),
  cons: z.array(z.string().min(1)).min(1),
  reasoningRefs: z.array(z.string().min(1)).min(1),
});

export const degreeAdvisorResultSchema = z.object({
  recommendation: z.object({
    degreeKey: z.string().min(1),
    headline: z.string().min(1),
    narrative: z.string().min(1),
    reasoningRefs: z.array(z.string().min(1)).min(1),
  }),
  comparisons: z.array(degreeComparisonSchema).length(6),
  mode: z.enum(["ai", "deterministic-fallback"]),
  generatedAt: z.iso.datetime(),
});

export type DegreeAdvisorInput = z.infer<typeof degreeAdvisorInputSchema>;
export type DegreeComparison = z.infer<typeof degreeComparisonSchema>;
export type DegreeAdvisorResult = z.infer<typeof degreeAdvisorResultSchema>;

export const decisionRecordSchema = z.object({
  id: z.string().min(1),
  targetType: z.enum([
    "career",
    "college",
    "exam",
    "degree",
    "opportunity",
    "project",
  ]),
  targetId: z.string().min(1),
  targetLabel: z.string().min(1),
  action: z.enum(["accepted", "rejected", "snoozed"]),
  reason: z.string().optional(),
  snoozedUntil: z.iso.datetime().optional(),
  createdAt: z.iso.datetime(),
});

export type DecisionRecord = z.infer<typeof decisionRecordSchema>;

export const roadmapMilestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  phase: z.string().min(1),
  status: z.enum(["upcoming", "active", "done"]),
  estWeeks: z.number().int().positive(),
  orderIndex: z.number().int().nonnegative(),
  skillTag: z.string().min(1),
});

export const roadmapPlanSchema = z.object({
  id: z.string().min(1),
  careerKey: z.string().min(1),
  careerName: z.string().min(1),
  version: z.number().int().positive(),
  changelog: z.string().min(1),
  progressPct: z.number().int().min(0).max(100),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  milestones: z.array(roadmapMilestoneSchema).min(6),
  mode: z.enum(["ai", "deterministic-fallback"]),
});

export type RoadmapMilestone = z.infer<typeof roadmapMilestoneSchema>;
export type RoadmapPlan = z.infer<typeof roadmapPlanSchema>;

export const learningResourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  provider: z.string().min(1),
  type: z.enum(["course", "docs", "book", "practice", "video", "certificate"]),
  url: z.url(),
  free: z.boolean(),
  skillTag: z.string().min(1),
  styleTags: z.array(z.enum(["video", "reading", "hands-on", "blended"])),
  estMinutes: z.number().int().positive(),
  whyRelevant: z.string().min(1),
  relevance: z.number().int().min(0).max(100),
});

export type LearningResourceResult = z.infer<typeof learningResourceSchema>;

export const rejectReasons = [
  "Not interested",
  "Too expensive",
  "Parents disagree",
  "Already decided against",
  "Other",
] as const;

export const defaultOnboardingProfile: OnboardingProfile = {
  name: "Aarav Rao",
  city: "Pune",
  currentStage: "class-11-12",
  interests: ["Technology", "Design"],
  favoriteSubjects: ["Mathematics", "Computer Science"],
  hobbies: ["Building things"],
  workStyle: {
    collaboration: 3,
    structure: 4,
    creativity: 4,
    analysis: 5,
    people: 3,
    field: 2,
    risk: 3,
    pace: 4,
  },
  preferredWorkMode: "balanced",
  preferredEnvironment: "indoor",
  preferredStructure: "structured",
  salaryExpectation: "12-20L",
  locationPref: "anywhere-india",
  studyPref: "applied",
  higherStudiesLean: 45,
  studyBudget: "medium",
  learningStyle: "hands-on",
  strengths: ["Problem solving", "Curiosity"],
  weaknesses: ["Public speaking"],
};
