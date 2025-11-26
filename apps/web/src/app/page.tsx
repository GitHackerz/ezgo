import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
        Welcome to EZGO
      </h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Smart Mobility Infrastructure for Tunisia. Manage your fleet, track buses, and optimize operations.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" size="lg">
          Learn More
        </Button>
      </div>
    </div>
  );
}
