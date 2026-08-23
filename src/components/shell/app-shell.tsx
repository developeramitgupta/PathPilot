"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Bell,
  BookOpenCheck,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Command,
  Compass,
  FileCheck2,
  Flag,
  FolderGit2,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  Map,
  MessageSquareText,
  MoreHorizontal,
  Radar,
  Route,
  Scale,
  Search,
  Settings,
  Sparkles,
  Target,
  Telescope,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { serviceAvailability } from "@/lib/env";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

const navigationGroups = [
  {
    label: "Discover",
    items: [
      ["Career Discovery", "/career-discovery", Compass],
      ["College Finder", "/colleges", GraduationCap],
      ["Exam Navigator", "/exams", ClipboardCheck],
      ["Degree Advisor", "/degrees", Scale],
    ],
  },
  {
    label: "Build",
    items: [
      ["Roadmap", "/roadmap", Route],
      ["Learning Coach", "/learning", BookOpenCheck],
      ["Project Mentor", "/projects", FolderGit2],
    ],
  },
  {
    label: "Prove",
    items: [
      ["Resume Analyzer", "/resume", FileCheck2],
      ["GitHub Analyzer", "/github", FolderGit2],
      ["Interview Coach", "/interview", MessageSquareText],
      ["Portfolio", "/portfolio/demo", BriefcaseBusiness],
    ],
  },
  {
    label: "Grow",
    items: [
      ["Career Simulator", "/simulator", Target],
      ["What-If Simulator", "/what-if", Scale],
      ["Future Twin", "/future-twin", Telescope],
      ["Opportunity Finder", "/opportunities", Search],
      ["Opportunity Radar", "/radar", Radar],
      ["Financial Planner", "/financial-planner", WalletCards],
      ["Confidence Journal", "/journal", BrainCircuit],
    ],
  },
  {
    label: "You",
    items: [
      ["Dashboard", "/dashboard", LayoutDashboard],
      ["Mission Mode", "/mission", Flag],
      ["Timeline", "/timeline", Map],
      ["Health Score", "/health-score", HeartPulse],
      ["Settings", "/settings", Settings],
    ],
  },
] as const;

const mobilePrimary = [
  ["Home", "/dashboard", LayoutDashboard],
  ["Discover", "/career-discovery", Compass],
  ["Roadmap", "/roadmap", Route],
  ["Missions", "/mission", Flag],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const [askOpen, setAskOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card/72 backdrop-blur-xl transition-[width] duration-200 md:block",
          collapsed ? "w-[72px]" : "w-[264px]",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
          <Logo compact={collapsed} href="/dashboard" />
        </div>
        <nav className="h-[calc(100vh-8rem)] overflow-y-auto px-2 py-4 [scrollbar-width:none]" aria-label="Product modules">
          {navigationGroups.map((group) => (
            <div className="mb-5" key={group.label}>
              {collapsed ? null : (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.label}</p>
              )}
              <div className="grid gap-0.5">
                {group.items.map(([label, href, Icon]) => {
                  const active = isActive(href);
                  return (
                    <Link
                      href={href}
                      key={href}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? label : undefined}
                      className={cn(
                        "relative flex min-h-10 items-center gap-3 rounded-md px-3 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                        active && "bg-primary/10 text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      {active ? <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" /> : null}
                      <Icon className={cn("size-[18px] shrink-0", active && "fill-primary/12 text-[#9d8bff]")} aria-hidden="true" />
                      {collapsed ? null : <span>{label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          className={cn("absolute bottom-4 left-3 right-3 justify-start", collapsed && "left-4 right-4 justify-center px-0")}
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight /> : <><ChevronLeft /> Collapse</>}
        </Button>
      </aside>

      <div className={cn("transition-[padding] duration-200 md:pl-[264px]", collapsed && "md:pl-[72px]")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/78 px-4 backdrop-blur-xl sm:px-6">
          <Logo compact href="/dashboard" className="md:hidden" />
          <button
            type="button"
            onClick={() => setAskOpen(true)}
            className="mx-auto flex h-10 w-full max-w-lg items-center gap-3 rounded-lg border border-border bg-card/70 px-3.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary/25 hover:text-foreground"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="flex-1 truncate">Ask PathPilot anything…</span>
            <span className="hidden items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 font-data text-[10px] sm:flex"><Command className="size-2.5" /> K</span>
          </button>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell />
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-primary" />
          </Button>
          {serviceAvailability.clerk ? (
            <UserButton />
          ) : (
            <button className="grid size-9 place-items-center rounded-full border border-border bg-card text-xs font-semibold" aria-label="Preview profile">
              AR
            </button>
          )}
        </header>

        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1600px] px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8 lg:px-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[72px] grid-cols-5 border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        {mobilePrimary.map(([label, href, Icon]) => {
          const active = isActive(href);
          return (
            <Link className={cn("flex min-h-11 flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground", active && "text-[#a998ff]")} href={href} key={href}>
              <Icon className="size-5" aria-hidden="true" /> {label}
            </Link>
          );
        })}
        <button className="flex min-h-11 flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground" onClick={() => setMoreOpen(true)}>
          <MoreHorizontal className="size-5" /> More
        </button>
      </nav>

      {askOpen ? (
        <div className="fixed inset-0 z-[70] grid place-items-start bg-black/70 px-4 pt-[12vh] backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="ask-title">
          <div className="mx-auto w-full max-w-xl rounded-xl border border-white/10 bg-popover p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2"><Bot className="size-5 text-[#a998ff]" /><h2 id="ask-title" className="font-semibold">Ask PathPilot</h2></div>
                <p className="mt-1 text-xs text-muted-foreground">Questions will route through the Master Orchestrator.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAskOpen(false)} aria-label="Close Ask PathPilot"><X /></Button>
            </div>
            <form className="mt-5" onSubmit={(event) => { event.preventDefault(); setPreviewMessage("The orchestrator adapter is scaffolded and will connect in Milestone 2."); }}>
              <label className="sr-only" htmlFor="ask-pathpilot">Your question</label>
              <textarea id="ask-pathpilot" className="min-h-28 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50" placeholder="Which career fits my interest in design and maths?" />
              {previewMessage ? <p className="mt-3 rounded-md border border-primary/15 bg-primary/8 p-3 text-xs text-[#b8adff]">{previewMessage}</p> : null}
              <div className="mt-4 flex justify-end"><Button type="submit"><Sparkles /> Ask</Button></div>
            </form>
          </div>
        </div>
      ) : null}

      {moreOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/65 md:hidden" role="dialog" aria-modal="true" aria-labelledby="more-title">
          <div className="max-h-[82vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-popover p-4 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="more-title" className="font-semibold">All modules</h2>
              <Button variant="ghost" size="icon" onClick={() => setMoreOpen(false)} aria-label="Close module menu"><X /></Button>
            </div>
            {navigationGroups.map((group) => (
              <div className="mb-5" key={group.label}>
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map(([label, href, Icon]) => (
                    <Link href={href} key={href} onClick={() => setMoreOpen(false)} className="flex min-h-12 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs text-muted-foreground hover:text-foreground">
                      <Icon className="size-4 text-[#9d8bff]" /> {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
