"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-[60vh] place-items-center px-4 text-center"><div><h1 className="text-2xl font-semibold">Something interrupted this route.</h1><p className="mt-3 text-sm text-muted-foreground">Your previous data is safe. Try loading the screen again.</p><Button onClick={reset} className="mt-6">Try again</Button></div></main>;
}
