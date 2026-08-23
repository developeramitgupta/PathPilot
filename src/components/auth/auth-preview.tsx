import Link from "next/link";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthPreview({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <div className="w-full max-w-md">
        <Logo className="mb-8 justify-center" />
        <Card className="border-white/10">
          <CardHeader className="items-center text-center">
            <div className="mb-3 grid size-12 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-[#a998ff]">
              {isSignUp ? <Sparkles className="size-5" /> : <LockKeyhole className="size-5" />}
            </div>
            <Badge variant="demo" className="mb-2">Local preview mode</Badge>
            <CardTitle className="text-2xl">{isSignUp ? "Start building your path" : "Welcome back"}</CardTitle>
            <CardDescription>
              Clerk credentials are not connected in this workspace. The production sign-in component appears automatically when they are added.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild size="lg">
              <Link href={isSignUp ? "/onboarding" : "/dashboard"}>
                Continue to product preview <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
                {isSignUp ? "Already have an account? Sign in" : "New to PathPilot? Create account"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
