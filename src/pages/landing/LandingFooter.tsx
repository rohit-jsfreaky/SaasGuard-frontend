import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="bg-muted/30 border-t border-border/40">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-16 sm:py-18 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/saasguard_full.png"
              alt="SaaS Guard Logo"
              className="h-10 object-contain"
            />
          </Link>
          <nav
            className="flex gap-8 text-sm font-medium text-muted-foreground"
            aria-label="Footer"
          >
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <Link
              to="/docs"
              className="hover:text-foreground transition-colors"
            >
              Docs
            </Link>
          </nav>
          <a
            href="mailto:rohitkashyapmrt@gmail.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            rohitkashyapmrt@gmail.com
          </a>
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; 2026 SaaS Guard, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
