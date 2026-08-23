"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

import type {
  CareerDiscoveryResult,
  DecisionRecord,
  OnboardingProfile,
  RoadmapPlan,
} from "@/features/pathpilot/schemas";

export type ResourceProgress = "saved" | "started" | "done";

const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

interface PathPilotStore {
  onboardingDraft: OnboardingProfile | null;
  profile: OnboardingProfile | null;
  careerDiscovery: CareerDiscoveryResult | null;
  decisions: DecisionRecord[];
  selectedCareerKey: string | null;
  roadmap: RoadmapPlan | null;
  resourceProgress: Record<string, ResourceProgress>;
  setOnboardingDraft: (profile: OnboardingProfile) => void;
  completeOnboarding: (
    profile: OnboardingProfile,
    discovery: CareerDiscoveryResult,
  ) => void;
  setCareerDiscovery: (discovery: CareerDiscoveryResult) => void;
  setSelectedCareer: (careerKey: string) => void;
  recordDecision: (decision: DecisionRecord) => void;
  hydrateDecisions: (decisions: DecisionRecord[]) => void;
  undoDecision: (decisionId: string) => void;
  setRoadmap: (roadmap: RoadmapPlan) => void;
  toggleMilestone: (milestoneId: string) => void;
  setResourceProgress: (resourceId: string, status: ResourceProgress) => void;
}

export const usePathPilotStore = create<PathPilotStore>()(
  persist(
    (set) => ({
      onboardingDraft: null,
      profile: null,
      careerDiscovery: null,
      decisions: [],
      selectedCareerKey: null,
      roadmap: null,
      resourceProgress: {},
      setOnboardingDraft: (onboardingDraft) => set({ onboardingDraft }),
      completeOnboarding: (profile, careerDiscovery) =>
        set({
          profile,
          onboardingDraft: profile,
          careerDiscovery,
          selectedCareerKey: careerDiscovery.matches[0]?.careerKey ?? null,
        }),
      setCareerDiscovery: (careerDiscovery) => set({ careerDiscovery }),
      setSelectedCareer: (selectedCareerKey) => set({ selectedCareerKey }),
      recordDecision: (decision) =>
        set((state) => ({
          decisions: [
            decision,
            ...state.decisions.filter(
              (item) =>
                !(
                  item.targetType === decision.targetType &&
                  item.targetId === decision.targetId
                ),
            ),
          ],
          selectedCareerKey:
            decision.targetType === "career" && decision.action === "accepted"
              ? decision.targetId
              : state.selectedCareerKey,
        })),
      hydrateDecisions: (decisions) =>
        set((state) => {
          const existing = new Map(
            state.decisions.map((decision) => [decision.id, decision]),
          );
          for (const decision of decisions) {
            if (!existing.has(decision.id)) existing.set(decision.id, decision);
          }
          return {
            decisions: Array.from(existing.values()).sort((a, b) =>
              b.createdAt.localeCompare(a.createdAt),
            ),
          };
        }),
      undoDecision: (decisionId) =>
        set((state) => ({
          decisions: state.decisions.filter(
            (decision) => decision.id !== decisionId,
          ),
        })),
      setRoadmap: (roadmap) => set({ roadmap }),
      toggleMilestone: (milestoneId) =>
        set((state) => {
          if (!state.roadmap) return state;
          const milestones = state.roadmap.milestones.map((milestone) =>
            milestone.id === milestoneId
              ? {
                  ...milestone,
                  status: milestone.status === "done" ? "active" : "done",
                }
              : milestone,
          );
          const firstIncomplete = milestones.findIndex(
            (milestone) => milestone.status !== "done",
          );
          const normalized = milestones.map((milestone, index) => ({
            ...milestone,
            status:
              milestone.status === "done"
                ? ("done" as const)
                : index === firstIncomplete
                  ? ("active" as const)
                  : ("upcoming" as const),
          }));
          const doneCount = normalized.filter(
            (milestone) => milestone.status === "done",
          ).length;
          return {
            roadmap: {
              ...state.roadmap,
              milestones: normalized,
              progressPct: Math.round((doneCount / normalized.length) * 100),
              updatedAt: new Date().toISOString(),
            },
          };
        }),
      setResourceProgress: (resourceId, status) =>
        set((state) => ({
          resourceProgress: { ...state.resourceProgress, [resourceId]: status },
        })),
    }),
    {
      name: "pathpilot-core-loop-v1",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? serverStorage : window.localStorage,
      ),
      partialize: (state) => ({
        onboardingDraft: state.onboardingDraft,
        profile: state.profile,
        careerDiscovery: state.careerDiscovery,
        decisions: state.decisions,
        selectedCareerKey: state.selectedCareerKey,
        roadmap: state.roadmap,
        resourceProgress: state.resourceProgress,
      }),
    },
  ),
);
