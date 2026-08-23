import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
  "/career-discovery(.*)",
  "/colleges(.*)",
  "/exams(.*)",
  "/degrees(.*)",
  "/roadmap(.*)",
  "/learning(.*)",
  "/projects(.*)",
  "/resume(.*)",
  "/github(.*)",
  "/opportunities(.*)",
  "/radar(.*)",
  "/interview(.*)",
  "/simulator(.*)",
  "/what-if(.*)",
  "/health-score(.*)",
  "/timeline(.*)",
  "/future-twin(.*)",
  "/mission(.*)",
  "/financial-planner(.*)",
  "/journal(.*)",
  "/settings(.*)",
  "/api(.*)",
]);

const protectedMiddleware = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next();
  }

  return protectedMiddleware(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
