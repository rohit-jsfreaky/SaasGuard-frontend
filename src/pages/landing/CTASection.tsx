import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";

export function CTASection() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative isolate px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(64,83,216,0.28),transparent_40%),radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.2),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.6),transparent_45%)]"></div>
      </div>
      <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 transform-gpu justify-center overflow-hidden blur-3xl sm:bottom-0 sm:right-[calc(50%-6rem)] sm:top-auto sm:translate-y-0 sm:transform-gpu sm:justify-end">
        <div
          className="aspect-[1108/632] w-[69.25rem] flex-none bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to wire security into your app?
          <br />
          Start for free with our API.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          No credit card. REST endpoints and webhooks you can ship today.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {isSignedIn ? (
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link to="/login">Sign in to build</Link>
            </Button>
          )}
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-12 px-8 text-base"
          >
            <Link to="/docs">View API docs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
