-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- Keep extensions outside the exposed public schema.
CREATE SCHEMA IF NOT EXISTS "extensions";
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'parent', 'counselor', 'admin');

-- CreateEnum
CREATE TYPE "DecisionAction" AS ENUM ('accepted', 'rejected', 'snoozed');

-- CreateEnum
CREATE TYPE "DecisionTargetType" AS ENUM ('career', 'college', 'exam', 'degree', 'opportunity', 'project');

-- CreateEnum
CREATE TYPE "DemandTrend" AS ENUM ('growing', 'stable', 'declining');

-- CreateEnum
CREATE TYPE "RoadmapMilestoneStatus" AS ENUM ('upcoming', 'active', 'done');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('suggested', 'in_progress', 'shipped');

-- CreateEnum
CREATE TYPE "MissionLevel" AS ENUM ('explorer', 'builder', 'achiever', 'pro');

-- CreateEnum
CREATE TYPE "ObserverRole" AS ENUM ('parent', 'counselor');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'student',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "interests" TEXT[],
    "favorite_subjects" TEXT[],
    "work_style" JSONB NOT NULL,
    "hobbies" TEXT[],
    "salary_expectation" TEXT NOT NULL,
    "location_pref" TEXT NOT NULL,
    "study_pref" TEXT NOT NULL,
    "higher_studies_lean" INTEGER NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "current_stage" TEXT,
    "onboarding_done" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "target_type" "DecisionTargetType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "action" "DecisionAction" NOT NULL,
    "reason" TEXT,
    "snoozed_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_matches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "career_key" TEXT NOT NULL,
    "career_name" TEXT NOT NULL,
    "compatibility" INTEGER NOT NULL,
    "why" TEXT NOT NULL,
    "reasoning_refs" TEXT[],
    "salary_band_entry" TEXT NOT NULL,
    "salary_band_mid" TEXT,
    "salary_band_senior" TEXT,
    "demand_trend" "DemandTrend" NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colleges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "annual_cost_inr" INTEGER NOT NULL,
    "branches" TEXT[],
    "hostel_available" BOOLEAN NOT NULL DEFAULT false,
    "culture_tags" TEXT[],
    "placement_band_label" TEXT,
    "is_mock_data" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_matches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "college_id" TEXT NOT NULL,
    "compatibility" INTEGER NOT NULL,
    "why" TEXT NOT NULL,
    "reasoning_refs" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "college_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "eligibility" TEXT NOT NULL,
    "accepted_career_keys" TEXT[],
    "accepted_college_count" INTEGER NOT NULL,
    "mock_dates" JSONB NOT NULL,
    "tips" TEXT[],
    "is_mock_data" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "degree_options" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration_months" INTEGER NOT NULL,
    "average_cost_inr" INTEGER NOT NULL,
    "flexibility_score" INTEGER NOT NULL,
    "outcomes" TEXT[],
    "is_mock_data" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "degree_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmaps" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "career_key" TEXT NOT NULL,
    "career_name" TEXT NOT NULL,
    "active_version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_versions" (
    "id" TEXT NOT NULL,
    "roadmap_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "changelog" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmap_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_milestones" (
    "id" TEXT NOT NULL,
    "roadmap_version_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "phase" TEXT NOT NULL,
    "status" "RoadmapMilestoneStatus" NOT NULL DEFAULT 'upcoming',
    "est_weeks" INTEGER NOT NULL,
    "order_index" INTEGER NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "roadmap_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "free" BOOLEAN NOT NULL,
    "skill_tag" TEXT NOT NULL,
    "style_tags" TEXT[],
    "est_minutes" INTEGER,
    "embedding" extensions.vector(1536),

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "tech_stack" TEXT[],
    "status" "ProjectStatus" NOT NULL DEFAULT 'suggested',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipped_at" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_analyses" (
    "id" TEXT NOT NULL,
    "resume_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "formatting_score" INTEGER NOT NULL,
    "keyword_score" INTEGER NOT NULL,
    "grammar_score" INTEGER NOT NULL,
    "impact_score" INTEGER NOT NULL,
    "missing_skills" TEXT[],
    "top_fixes" TEXT[],

    CONSTRAINT "resume_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_analyses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "languages" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "github_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "is_mock_data" BOOLEAN NOT NULL DEFAULT true,
    "embedding" extensions.vector(1536),

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_matches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "why" TEXT NOT NULL,
    "reasoning_refs" TEXT[],

    CONSTRAINT "opportunity_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "transcript" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_feedback" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "strengths" TEXT[],
    "improvements" TEXT[],

    CONSTRAINT "interview_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_simulations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "target_role" TEXT NOT NULL,
    "target_company" TEXT,
    "timeline" JSONB NOT NULL,
    "skill_gaps" JSONB NOT NULL,
    "salary_band" TEXT NOT NULL,
    "success_band" TEXT NOT NULL,
    "scoring_factors" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_health_scores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "breakdown" JSONB NOT NULL,
    "weekly_delta" INTEGER NOT NULL DEFAULT 0,
    "last_computed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_snapshots" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "level" "MissionLevel" NOT NULL,
    "progress_pct" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_milestones" (
    "id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "status" "RoadmapMilestoneStatus" NOT NULL DEFAULT 'upcoming',
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "mission_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "badge_key" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_access" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "role" "ObserverRole" NOT NULL,
    "invite_code" TEXT NOT NULL,
    "grantee_user_id" TEXT,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shared_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_user_id_key" ON "student_profiles"("user_id");

-- CreateIndex
CREATE INDEX "decisions_user_id_created_at_idx" ON "decisions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "decisions_user_id_target_type_target_id_idx" ON "decisions"("user_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "career_matches_user_id_compatibility_idx" ON "career_matches"("user_id", "compatibility");

-- CreateIndex
CREATE INDEX "colleges_state_city_idx" ON "colleges"("state", "city");

-- CreateIndex
CREATE INDEX "college_matches_user_id_compatibility_idx" ON "college_matches"("user_id", "compatibility");

-- CreateIndex
CREATE UNIQUE INDEX "college_matches_user_id_college_id_key" ON "college_matches"("user_id", "college_id");

-- CreateIndex
CREATE UNIQUE INDEX "exams_name_key" ON "exams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "degree_options_key_key" ON "degree_options"("key");

-- CreateIndex
CREATE INDEX "roadmaps_user_id_updated_at_idx" ON "roadmaps"("user_id", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_versions_roadmap_id_version_key" ON "roadmap_versions"("roadmap_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_milestones_roadmap_version_id_order_index_key" ON "roadmap_milestones"("roadmap_version_id", "order_index");

-- CreateIndex
CREATE INDEX "resources_skill_tag_idx" ON "resources"("skill_tag");

-- CreateIndex
CREATE INDEX "projects_user_id_status_idx" ON "projects"("user_id", "status");

-- CreateIndex
CREATE INDEX "resumes_user_id_created_at_idx" ON "resumes"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "resume_analyses_resume_id_key" ON "resume_analyses"("resume_id");

-- CreateIndex
CREATE INDEX "github_analyses_user_id_created_at_idx" ON "github_analyses"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "opportunities_type_location_idx" ON "opportunities"("type", "location");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_matches_user_id_opportunity_id_key" ON "opportunity_matches"("user_id", "opportunity_id");

-- CreateIndex
CREATE INDEX "interview_sessions_user_id_created_at_idx" ON "interview_sessions"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "interview_feedback_session_id_key" ON "interview_feedback"("session_id");

-- CreateIndex
CREATE INDEX "career_simulations_user_id_created_at_idx" ON "career_simulations"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "career_health_scores_user_id_key" ON "career_health_scores"("user_id");

-- CreateIndex
CREATE INDEX "progress_snapshots_user_id_created_at_idx" ON "progress_snapshots"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "missions_user_id_updated_at_idx" ON "missions"("user_id", "updated_at");

-- CreateIndex
CREATE INDEX "mission_milestones_mission_id_status_idx" ON "mission_milestones"("mission_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_user_id_badge_key_key" ON "achievements"("user_id", "badge_key");

-- CreateIndex
CREATE UNIQUE INDEX "shared_access_invite_code_key" ON "shared_access"("invite_code");

-- CreateIndex
CREATE INDEX "shared_access_owner_user_id_revoked_at_idx" ON "shared_access"("owner_user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "shared_access_grantee_user_id_revoked_at_idx" ON "shared_access"("grantee_user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_created_at_idx" ON "notifications"("user_id", "read", "created_at");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_matches" ADD CONSTRAINT "career_matches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_matches" ADD CONSTRAINT "college_matches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_matches" ADD CONSTRAINT "college_matches_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_versions" ADD CONSTRAINT "roadmap_versions_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_milestones" ADD CONSTRAINT "roadmap_milestones_roadmap_version_id_fkey" FOREIGN KEY ("roadmap_version_id") REFERENCES "roadmap_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_analyses" ADD CONSTRAINT "resume_analyses_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_analyses" ADD CONSTRAINT "github_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_matches" ADD CONSTRAINT "opportunity_matches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_matches" ADD CONSTRAINT "opportunity_matches_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "interview_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_simulations" ADD CONSTRAINT "career_simulations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_health_scores" ADD CONSTRAINT "career_health_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_snapshots" ADD CONSTRAINT "progress_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_milestones" ADD CONSTRAINT "mission_milestones_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_access" ADD CONSTRAINT "shared_access_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_access" ADD CONSTRAINT "shared_access_grantee_user_id_fkey" FOREIGN KEY ("grantee_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
