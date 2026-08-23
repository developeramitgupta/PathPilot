import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const onboardingSteps = ["About you", "Interests", "Work style", "Priorities", "Strengths", "Review"];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between"><Logo /><Badge variant="demo">Milestone 2 workflow preview</Badge></div>
        <div className="mt-12 grid gap-8 lg:grid-cols-[230px_1fr]">
          <aside>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Your profile</p>
            <div className="mt-5 grid gap-3">
              {onboardingSteps.map((step, index) => (
                <div className={index === 0 ? "flex items-center gap-3 text-sm text-foreground" : "flex items-center gap-3 text-sm text-muted-foreground"} key={step}><span className={index === 0 ? "grid size-7 place-items-center rounded-full bg-primary text-[11px] font-semibold text-white" : "grid size-7 place-items-center rounded-full border border-border text-[11px]"}>{index === 0 ? <Check className="size-3.5" /> : index + 1}</span>{step}</div>
              ))}
            </div>
          </aside>
          <Card className="p-6 sm:p-9">
            <Badge><Sparkles className="size-3" /> Six focused steps</Badge>
            <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">Let&apos;s build a plan that fits you.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">The form contract, persistence model, validation boundary, and step structure are scaffolded. Interactive data collection and first Career Discovery generation arrive together in Milestone 2 so the core loop is never half-connected.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Interests and favorite subjects", "Eight work-style sliders", "Budget and location preferences", "Strengths and growth areas"].map((item) => <div className="flex items-center gap-3 rounded-lg border border-border bg-white/[0.02] p-4 text-sm" key={item}><Check className="size-4 text-success" />{item}</div>)}
            </div>
            <div className="mt-10 flex flex-wrap gap-3"><Button asChild><Link href="/career-discovery">View Discovery scaffold <ArrowRight /></Link></Button><Button asChild variant="ghost"><Link href="/dashboard">Skip to dashboard preview</Link></Button></div>
          </Card>
        </div>
      </div>
    </main>
  );
}
