import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FolderGit2,
  GraduationCap,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { ProgressRing } from "@/components/shared/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Skills", value: "12", delta: "+2 this month", icon: BookOpenCheck, href: "/learning", points: "3,7 10,5 17,8 24,3 31,5 38,2" },
  { label: "Projects", value: "03", delta: "1 in progress", icon: FolderGit2, href: "/projects", points: "3,8 10,8 17,7 24,5 31,6 38,2" },
  { label: "Resume", value: "68", delta: "+6 from last scan", icon: FileCheck2, href: "/resume", points: "3,9 10,7 17,8 24,5 31,4 38,2" },
  { label: "GitHub", value: "74", delta: "Strong activity", icon: TrendingUp, href: "/github", points: "3,10 10,8 17,6 24,7 31,3 38,2" },
];

const journey = ["Class 10", "Stream", "Class 12", "Exams", "College", "Degree", "Skills", "Projects", "Placement"];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2"><Badge variant="demo">Preview data</Badge><span className="text-xs text-muted-foreground">Sunday, 23 August</span></div>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">Good evening, Aarav.</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">One focused step today keeps the whole plan moving.</p>
        </div>
        <Button asChild variant="secondary"><Link href="/career-discovery"><Sparkles /> Explore careers</Link></Button>
      </div>

      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[220px_1fr_0.8fr]">
          <div className="mx-auto"><ProgressRing value={72} label="Career health" size="lg" /></div>
          <div>
            <Badge variant="success" className="mb-4">+4 this week</Badge>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">You&apos;re becoming a Builder.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Your project consistency moved up. Resume impact is now the clearest category to improve next.</p>
            <Button asChild variant="ghost" className="mt-4 -ml-4 text-[#a998ff]"><Link href="/health-score">See score breakdown <ArrowRight /></Link></Button>
          </div>
          <div className="rounded-xl border border-border bg-black/10 p-5">
            <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Current mission</p><Badge>Level 2</Badge></div>
            <p className="mt-4 text-lg font-semibold">Product Designer</p>
            <p className="mt-1 text-xs text-muted-foreground">Target: Design team at a technology company</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="signature-gradient h-full w-[46%] rounded-full" /></div>
            <div className="mt-2 flex justify-between font-data text-[10px] text-muted-foreground"><span>46% complete</span><span>Builder</span></div>
            <Button asChild size="sm" className="mt-5 w-full"><Link href="/mission">Open Mission Mode <Target /></Link></Button>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card className="p-5" key={stat.label}>
            <div className="flex items-start justify-between"><div className="grid size-9 place-items-center rounded-lg bg-white/[0.04] text-muted-foreground"><stat.icon className="size-4" /></div><svg viewBox="0 0 42 12" className="h-7 w-20" aria-hidden="true"><polyline points={stat.points} fill="none" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
            <div className="mt-6 flex items-end justify-between gap-3"><div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="font-data mt-1 text-2xl font-semibold">{stat.value}</p></div><span className="text-[10px] text-success">{stat.delta}</span></div>
            <Link href={stat.href} className="mt-4 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">View detail <ArrowRight className="size-3" /></Link>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Next roadmap milestone</p><h2 className="mt-2 text-lg font-semibold">Build your first UX case study</h2></div><div className="grid size-11 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-[#a998ff]"><BriefcaseBusiness className="size-5" /></div></div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Turn one everyday problem into a documented research → prototype → feedback story.</p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" /> 3 weeks</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" /> Phase 1</span></div>
          <Button asChild variant="secondary" className="mt-6"><Link href="/roadmap">Open milestone <ArrowRight /></Link></Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Opportunity Radar</p><h2 className="mt-2 text-lg font-semibold">Relevant this week</h2></div><GraduationCap className="size-5 text-[#a998ff]" /></div>
          <div className="mt-5 divide-y divide-border">
            {[
              ["Student design challenge", "Competition · Demo category"],
              ["Open-source first issue sprint", "Project · Demo category"],
              ["Merit scholarship window", "Scholarship · Typical timing"],
            ].map(([title, meta], index) => (
              <div className="flex items-center gap-3 py-3" key={title}><span className="grid size-7 place-items-center rounded-full border border-border font-data text-[10px] text-muted-foreground">0{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{title}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{meta}</p></div><ArrowRight className="size-4 text-muted-foreground" /></div>
            ))}
          </div>
          <Button asChild variant="ghost" className="mt-3 -ml-4"><Link href="/radar">View all opportunities</Link></Button>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden p-6">
        <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Student timeline</p><h2 className="mt-2 text-lg font-semibold">Your journey at a glance</h2></div><Button asChild variant="ghost" size="sm"><Link href="/timeline">Open timeline <ArrowRight /></Link></Button></div>
        <div
          className="mt-8 overflow-x-auto pb-2"
          tabIndex={0}
          role="region"
          aria-label="Student journey timeline; scroll horizontally to view later stages"
        >
          <div className="flex min-w-[780px] items-start">
            {journey.map((stage, index) => {
              const complete = index < 2;
              const active = index === 2;
              return (
                <div className="relative flex flex-1 flex-col items-center text-center" key={stage}>
                  {index > 0 ? <span className={complete || active ? "absolute right-1/2 top-3 h-px w-full bg-primary/60" : "absolute right-1/2 top-3 h-px w-full bg-border"} /> : null}
                  <span className={complete ? "relative z-10 grid size-6 place-items-center rounded-full bg-success text-background" : active ? "relative z-10 grid size-6 place-items-center rounded-full bg-primary text-white ring-4 ring-primary/15" : "relative z-10 grid size-6 place-items-center rounded-full border border-border bg-card"}>{complete ? <CheckCircle2 className="size-3.5" /> : <span className="size-1.5 rounded-full bg-muted-foreground/50" />}</span>
                  <span className={active ? "mt-3 text-xs font-medium text-foreground" : "mt-3 text-xs text-muted-foreground"}>{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
