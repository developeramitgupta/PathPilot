import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  vector,
} from "drizzle-orm/pg-core";

const timestamp3 = (name: string) =>
  timestamp(name, { mode: "date", precision: 3 });

export const userRole = pgEnum("UserRole", [
  "student",
  "parent",
  "counselor",
  "admin",
]);
export const decisionAction = pgEnum("DecisionAction", [
  "accepted",
  "rejected",
  "snoozed",
]);
export const decisionTargetType = pgEnum("DecisionTargetType", [
  "career",
  "college",
  "exam",
  "degree",
  "opportunity",
  "project",
]);
export const demandTrend = pgEnum("DemandTrend", [
  "growing",
  "stable",
  "declining",
]);
export const roadmapMilestoneStatus = pgEnum("RoadmapMilestoneStatus", [
  "upcoming",
  "active",
  "done",
]);
export const projectStatus = pgEnum("ProjectStatus", [
  "suggested",
  "in_progress",
  "shipped",
]);
export const missionLevel = pgEnum("MissionLevel", [
  "explorer",
  "builder",
  "achiever",
  "pro",
]);
export const observerRole = pgEnum("ObserverRole", ["parent", "counselor"]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    role: userRole("role").notNull().default("student"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    city: text("city"),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
    updatedAt: timestamp3("updated_at").notNull(),
  },
  (table) => [uniqueIndex("users_email_key").on(table.email)],
);

export const studentProfiles = pgTable(
  "student_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    interests: text("interests").array(),
    favoriteSubjects: text("favorite_subjects").array(),
    workStyle: jsonb("work_style")
      .$type<Record<string, unknown>>()
      .notNull(),
    hobbies: text("hobbies").array(),
    salaryExpectation: text("salary_expectation").notNull(),
    locationPref: text("location_pref").notNull(),
    studyPref: text("study_pref").notNull(),
    higherStudiesLean: integer("higher_studies_lean").notNull(),
    strengths: text("strengths").array(),
    weaknesses: text("weaknesses").array(),
    currentStage: text("current_stage"),
    onboardingDone: boolean("onboarding_done").notNull().default(false),
    updatedAt: timestamp3("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("student_profiles_user_id_key").on(table.userId),
  ],
);

export const decisions = pgTable(
  "decisions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    targetType: decisionTargetType("target_type").notNull(),
    targetId: text("target_id").notNull(),
    action: decisionAction("action").notNull(),
    reason: text("reason"),
    snoozedUntil: timestamp3("snoozed_until"),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("decisions_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
    index("decisions_user_id_target_type_target_id_idx").on(
      table.userId,
      table.targetType,
      table.targetId,
    ),
  ],
);

export const careerMatches = pgTable(
  "career_matches",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    careerKey: text("career_key").notNull(),
    careerName: text("career_name").notNull(),
    compatibility: integer("compatibility").notNull(),
    why: text("why").notNull(),
    reasoningRefs: text("reasoning_refs").array(),
    salaryBandEntry: text("salary_band_entry").notNull(),
    salaryBandMid: text("salary_band_mid"),
    salaryBandSenior: text("salary_band_senior"),
    demandTrend: demandTrend("demand_trend").notNull(),
    generatedAt: timestamp3("generated_at").notNull().defaultNow(),
  },
  (table) => [
    index("career_matches_user_id_compatibility_idx").on(
      table.userId,
      table.compatibility,
    ),
  ],
);

export const colleges = pgTable(
  "colleges",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    type: text("type").notNull(),
    annualCostInr: integer("annual_cost_inr").notNull(),
    branches: text("branches").array(),
    hostelAvailable: boolean("hostel_available").notNull().default(false),
    cultureTags: text("culture_tags").array(),
    placementBandLabel: text("placement_band_label"),
    isMockData: boolean("is_mock_data").notNull().default(true),
  },
  (table) => [index("colleges_state_city_idx").on(table.state, table.city)],
);

export const collegeMatches = pgTable(
  "college_matches",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    collegeId: text("college_id")
      .notNull()
      .references(() => colleges.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    compatibility: integer("compatibility").notNull(),
    why: text("why").notNull(),
    reasoningRefs: text("reasoning_refs").array(),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("college_matches_user_id_compatibility_idx").on(
      table.userId,
      table.compatibility,
    ),
    uniqueIndex("college_matches_user_id_college_id_key").on(
      table.userId,
      table.collegeId,
    ),
  ],
);

export const exams = pgTable(
  "exams",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    difficulty: integer("difficulty").notNull(),
    eligibility: text("eligibility").notNull(),
    acceptedCareerKeys: text("accepted_career_keys").array(),
    acceptedCollegeCount: integer("accepted_college_count").notNull(),
    mockDates: jsonb("mock_dates").$type<Record<string, unknown>>().notNull(),
    tips: text("tips").array(),
    isMockData: boolean("is_mock_data").notNull().default(true),
  },
  (table) => [uniqueIndex("exams_name_key").on(table.name)],
);

export const degreeOptions = pgTable(
  "degree_options",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    durationMonths: integer("duration_months").notNull(),
    averageCostInr: integer("average_cost_inr").notNull(),
    flexibilityScore: integer("flexibility_score").notNull(),
    outcomes: text("outcomes").array(),
    isMockData: boolean("is_mock_data").notNull().default(true),
  },
  (table) => [uniqueIndex("degree_options_key_key").on(table.key)],
);

export const roadmaps = pgTable(
  "roadmaps",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    careerKey: text("career_key").notNull(),
    careerName: text("career_name").notNull(),
    activeVersion: integer("active_version").notNull().default(1),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
    updatedAt: timestamp3("updated_at").notNull(),
  },
  (table) => [
    index("roadmaps_user_id_updated_at_idx").on(table.userId, table.updatedAt),
  ],
);

export const roadmapVersions = pgTable(
  "roadmap_versions",
  {
    id: text("id").primaryKey(),
    roadmapId: text("roadmap_id")
      .notNull()
      .references(() => roadmaps.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    version: integer("version").notNull(),
    changelog: text("changelog"),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("roadmap_versions_roadmap_id_version_key").on(
      table.roadmapId,
      table.version,
    ),
  ],
);

export const roadmapMilestones = pgTable(
  "roadmap_milestones",
  {
    id: text("id").primaryKey(),
    roadmapVersionId: text("roadmap_version_id")
      .notNull()
      .references(() => roadmapVersions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    title: text("title").notNull(),
    description: text("description"),
    phase: text("phase").notNull(),
    status: roadmapMilestoneStatus("status").notNull().default("upcoming"),
    estWeeks: integer("est_weeks").notNull(),
    orderIndex: integer("order_index").notNull(),
    completedAt: timestamp3("completed_at"),
  },
  (table) => [
    uniqueIndex("roadmap_milestones_roadmap_version_id_order_index_key").on(
      table.roadmapVersionId,
      table.orderIndex,
    ),
  ],
);

export const resources = pgTable(
  "resources",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    type: text("type").notNull(),
    url: text("url").notNull(),
    free: boolean("free").notNull(),
    skillTag: text("skill_tag").notNull(),
    styleTags: text("style_tags").array(),
    estMinutes: integer("est_minutes"),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => [index("resources_skill_tag_idx").on(table.skillTag)],
);

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    title: text("title").notNull(),
    difficulty: text("difficulty").notNull(),
    techStack: text("tech_stack").array(),
    status: projectStatus("status").notNull().default("suggested"),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
    shippedAt: timestamp3("shipped_at"),
  },
  (table) => [
    index("projects_user_id_status_idx").on(table.userId, table.status),
  ],
);

export const resumes = pgTable(
  "resumes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    fileUrl: text("file_url").notNull(),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("resumes_user_id_created_at_idx").on(table.userId, table.createdAt),
  ],
);

export const resumeAnalyses = pgTable(
  "resume_analyses",
  {
    id: text("id").primaryKey(),
    resumeId: text("resume_id")
      .notNull()
      .references(() => resumes.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    score: integer("score").notNull(),
    formattingScore: integer("formatting_score").notNull(),
    keywordScore: integer("keyword_score").notNull(),
    grammarScore: integer("grammar_score").notNull(),
    impactScore: integer("impact_score").notNull(),
    missingSkills: text("missing_skills").array(),
    topFixes: text("top_fixes").array(),
  },
  (table) => [
    uniqueIndex("resume_analyses_resume_id_key").on(table.resumeId),
  ],
);

export const githubAnalyses = pgTable(
  "github_analyses",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    username: text("username").notNull(),
    score: integer("score").notNull(),
    languages: jsonb("languages")
      .$type<Record<string, unknown>>()
      .notNull(),
    summary: text("summary").notNull(),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("github_analyses_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
  ],
);

export const opportunities = pgTable(
  "opportunities",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    org: text("org").notNull(),
    location: text("location").notNull(),
    description: text("description"),
    tags: text("tags").array(),
    isMockData: boolean("is_mock_data").notNull().default(true),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => [
    index("opportunities_type_location_idx").on(table.type, table.location),
  ],
);

export const opportunityMatches = pgTable(
  "opportunity_matches",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    opportunityId: text("opportunity_id")
      .notNull()
      .references(() => opportunities.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    why: text("why").notNull(),
    reasoningRefs: text("reasoning_refs").array(),
  },
  (table) => [
    uniqueIndex("opportunity_matches_user_id_opportunity_id_key").on(
      table.userId,
      table.opportunityId,
    ),
  ],
);

export const interviewSessions = pgTable(
  "interview_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    type: text("type").notNull(),
    persona: text("persona").notNull(),
    difficulty: text("difficulty").notNull(),
    transcript: jsonb("transcript").$type<unknown[]>().notNull(),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("interview_sessions_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
  ],
);

export const interviewFeedback = pgTable(
  "interview_feedback",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => interviewSessions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    score: integer("score").notNull(),
    strengths: text("strengths").array(),
    improvements: text("improvements").array(),
  },
  (table) => [
    uniqueIndex("interview_feedback_session_id_key").on(table.sessionId),
  ],
);

export const careerSimulations = pgTable(
  "career_simulations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    targetRole: text("target_role").notNull(),
    targetCompany: text("target_company"),
    timeline: jsonb("timeline").$type<Record<string, unknown>>().notNull(),
    skillGaps: jsonb("skill_gaps")
      .$type<Record<string, unknown>>()
      .notNull(),
    salaryBand: text("salary_band").notNull(),
    successBand: text("success_band").notNull(),
    scoringFactors: jsonb("scoring_factors")
      .$type<Record<string, unknown>>()
      .notNull(),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("career_simulations_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
  ],
);

export const careerHealthScores = pgTable(
  "career_health_scores",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    score: integer("score").notNull(),
    breakdown: jsonb("breakdown")
      .$type<Record<string, unknown>>()
      .notNull(),
    weeklyDelta: integer("weekly_delta").notNull().default(0),
    lastComputed: timestamp3("last_computed").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("career_health_scores_user_id_key").on(table.userId),
  ],
);

export const progressSnapshots = pgTable(
  "progress_snapshots",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("progress_snapshots_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
  ],
);

export const missions = pgTable(
  "missions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    goal: text("goal").notNull(),
    level: missionLevel("level").notNull(),
    progressPct: integer("progress_pct").notNull(),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
    updatedAt: timestamp3("updated_at").notNull(),
  },
  (table) => [
    index("missions_user_id_updated_at_idx").on(table.userId, table.updatedAt),
  ],
);

export const missionMilestones = pgTable(
  "mission_milestones",
  {
    id: text("id").primaryKey(),
    missionId: text("mission_id")
      .notNull()
      .references(() => missions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    title: text("title").notNull(),
    weight: integer("weight").notNull(),
    status: roadmapMilestoneStatus("status").notNull().default("upcoming"),
    completedAt: timestamp3("completed_at"),
  },
  (table) => [
    index("mission_milestones_mission_id_status_idx").on(
      table.missionId,
      table.status,
    ),
  ],
);

export const achievements = pgTable(
  "achievements",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    badgeKey: text("badge_key").notNull(),
    unlockedAt: timestamp3("unlocked_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("achievements_user_id_badge_key_key").on(
      table.userId,
      table.badgeKey,
    ),
  ],
);

export const sharedAccess = pgTable(
  "shared_access",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    role: observerRole("role").notNull(),
    inviteCode: text("invite_code").notNull(),
    granteeUserId: text("grantee_user_id").references(() => users.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    expiresAt: timestamp3("expires_at"),
    revokedAt: timestamp3("revoked_at"),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("shared_access_invite_code_key").on(table.inviteCode),
    index("shared_access_owner_user_id_revoked_at_idx").on(
      table.ownerUserId,
      table.revokedAt,
    ),
    index("shared_access_grantee_user_id_revoked_at_idx").on(
      table.granteeUserId,
      table.revokedAt,
    ),
  ],
);

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    message: text("message").notNull(),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp3("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_id_read_created_at_idx").on(
      table.userId,
      table.read,
      table.createdAt,
    ),
  ],
);

export const usersRelations = relations(users, ({ many, one }) => ({
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  decisions: many(decisions),
  careerMatches: many(careerMatches),
  collegeMatches: many(collegeMatches),
  roadmaps: many(roadmaps),
  projects: many(projects),
  resumes: many(resumes),
  githubAnalyses: many(githubAnalyses),
  opportunityMatches: many(opportunityMatches),
  interviewSessions: many(interviewSessions),
  careerSimulations: many(careerSimulations),
  careerHealthScore: one(careerHealthScores, {
    fields: [users.id],
    references: [careerHealthScores.userId],
  }),
  progressSnapshots: many(progressSnapshots),
  missions: many(missions),
  achievements: many(achievements),
  notifications: many(notifications),
  sharedAccessOwned: many(sharedAccess, { relationName: "sharedAccessOwner" }),
  sharedAccessGranted: many(sharedAccess, {
    relationName: "sharedAccessGrantee",
  }),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
}));
export const decisionsRelations = relations(decisions, ({ one }) => ({
  user: one(users, { fields: [decisions.userId], references: [users.id] }),
}));
export const careerMatchesRelations = relations(careerMatches, ({ one }) => ({
  user: one(users, { fields: [careerMatches.userId], references: [users.id] }),
}));
export const collegesRelations = relations(colleges, ({ many }) => ({
  matches: many(collegeMatches),
}));
export const collegeMatchesRelations = relations(collegeMatches, ({ one }) => ({
  user: one(users, { fields: [collegeMatches.userId], references: [users.id] }),
  college: one(colleges, {
    fields: [collegeMatches.collegeId],
    references: [colleges.id],
  }),
}));
export const roadmapsRelations = relations(roadmaps, ({ many, one }) => ({
  user: one(users, { fields: [roadmaps.userId], references: [users.id] }),
  versions: many(roadmapVersions),
}));
export const roadmapVersionsRelations = relations(
  roadmapVersions,
  ({ many, one }) => ({
    roadmap: one(roadmaps, {
      fields: [roadmapVersions.roadmapId],
      references: [roadmaps.id],
    }),
    milestones: many(roadmapMilestones),
  }),
);
export const roadmapMilestonesRelations = relations(
  roadmapMilestones,
  ({ one }) => ({
    roadmapVersion: one(roadmapVersions, {
      fields: [roadmapMilestones.roadmapVersionId],
      references: [roadmapVersions.id],
    }),
  }),
);
export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
}));
export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, { fields: [resumes.userId], references: [users.id] }),
  analysis: one(resumeAnalyses, {
    fields: [resumes.id],
    references: [resumeAnalyses.resumeId],
  }),
}));
export const resumeAnalysesRelations = relations(resumeAnalyses, ({ one }) => ({
  resume: one(resumes, {
    fields: [resumeAnalyses.resumeId],
    references: [resumes.id],
  }),
}));
export const githubAnalysesRelations = relations(githubAnalyses, ({ one }) => ({
  user: one(users, { fields: [githubAnalyses.userId], references: [users.id] }),
}));
export const opportunitiesRelations = relations(opportunities, ({ many }) => ({
  matches: many(opportunityMatches),
}));
export const opportunityMatchesRelations = relations(
  opportunityMatches,
  ({ one }) => ({
    user: one(users, {
      fields: [opportunityMatches.userId],
      references: [users.id],
    }),
    opportunity: one(opportunities, {
      fields: [opportunityMatches.opportunityId],
      references: [opportunities.id],
    }),
  }),
);
export const interviewSessionsRelations = relations(
  interviewSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [interviewSessions.userId],
      references: [users.id],
    }),
    feedback: one(interviewFeedback, {
      fields: [interviewSessions.id],
      references: [interviewFeedback.sessionId],
    }),
  }),
);
export const interviewFeedbackRelations = relations(
  interviewFeedback,
  ({ one }) => ({
    session: one(interviewSessions, {
      fields: [interviewFeedback.sessionId],
      references: [interviewSessions.id],
    }),
  }),
);
export const careerSimulationsRelations = relations(
  careerSimulations,
  ({ one }) => ({
    user: one(users, {
      fields: [careerSimulations.userId],
      references: [users.id],
    }),
  }),
);
export const careerHealthScoresRelations = relations(
  careerHealthScores,
  ({ one }) => ({
    user: one(users, {
      fields: [careerHealthScores.userId],
      references: [users.id],
    }),
  }),
);
export const progressSnapshotsRelations = relations(
  progressSnapshots,
  ({ one }) => ({
    user: one(users, {
      fields: [progressSnapshots.userId],
      references: [users.id],
    }),
  }),
);
export const missionsRelations = relations(missions, ({ many, one }) => ({
  user: one(users, { fields: [missions.userId], references: [users.id] }),
  milestones: many(missionMilestones),
}));
export const missionMilestonesRelations = relations(
  missionMilestones,
  ({ one }) => ({
    mission: one(missions, {
      fields: [missionMilestones.missionId],
      references: [missions.id],
    }),
  }),
);
export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, { fields: [achievements.userId], references: [users.id] }),
}));
export const sharedAccessRelations = relations(sharedAccess, ({ one }) => ({
  owner: one(users, {
    fields: [sharedAccess.ownerUserId],
    references: [users.id],
    relationName: "sharedAccessOwner",
  }),
  grantee: one(users, {
    fields: [sharedAccess.granteeUserId],
    references: [users.id],
    relationName: "sharedAccessGrantee",
  }),
}));
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type StudentProfile = InferSelectModel<typeof studentProfiles>;
export type NewStudentProfile = InferInsertModel<typeof studentProfiles>;
export type Decision = InferSelectModel<typeof decisions>;
export type CareerMatch = InferSelectModel<typeof careerMatches>;
export type Roadmap = InferSelectModel<typeof roadmaps>;
export type RoadmapVersion = InferSelectModel<typeof roadmapVersions>;
export type RoadmapMilestone = InferSelectModel<typeof roadmapMilestones>;
export type Resource = InferSelectModel<typeof resources>;
