import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Github, Twitter, Mail, Heart } from "lucide-react";
import { FOOTER_LINKS } from "./content";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border/40 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/saasguard_full.png"
                alt="SaaS Guard Logo"
                className="h-10 object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              API-first permission engine for modern SaaS applications.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/rohit-jsfreaky/SaasGuard-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:rohitkashyapmrt@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} SaaS Guard, Inc. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" />{" "}
              by Rohit Kashyap
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
