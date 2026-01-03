import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";
import { useAuth } from "@clerk/clerk-react";
import { HeroSection } from "./landing/HeroSection";
import { IntegrationsSection } from "./landing/IntegrationsSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { HowItWorksSection } from "./landing/HowItWorksSection";
import { SafeguardsSection } from "./landing/SafeguardsSection";
import { CTASection } from "./landing/CTASection";
import { LandingFooter } from "./landing/LandingFooter";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/10 selection:text-primary overflow-x-hidden">
        {/* Background Gradients (improved light mode) */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.18)_0,rgba(0,163,255,0)_55%,rgba(0,163,255,0)_100%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.36),rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 opacity-60 dark:opacity-40 bg-[linear-gradient(to_right,#80808022_1px,transparent_1px),linear-gradient(to_bottom,#80808022_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        </div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
            <Link to="/">
              {/* Desktop Logo */}
              <img
                src="/saasguard_full.png"
                alt="SaaS Guard"
                className="hidden md:block h-16 object-contain"
              />
              {/* Mobile Icon */}
              <img
                src="/saasguard_icon.png"
                alt="SaaS Guard"
                className="md:hidden h-8 w-8 object-contain"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-primary transition-colors"
            >
              How it Works
            </a>
            <Link to="/docs" className="hover:text-primary transition-colors">
              Documentation
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex gap-3">
              {isSignedIn ? (
                <Button asChild size="sm" className="font-semibold">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="shadow-lg shadow-primary/20"
                  >
                    <Link to="/login">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        </header>

        <main>
          <HeroSection isSignedIn={isSignedIn} />
          <IntegrationsSection />
          <FeaturesSection />
          <HowItWorksSection />
          <SafeguardsSection />
          <CTASection />
          <LandingFooter />
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
