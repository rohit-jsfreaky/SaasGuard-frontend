import {
  Shield,
  Lock,
  Zap,
  BarChart3,
  Users,
  Settings,
  Key,
  RefreshCw,
  Layers,
  Code2,
  FileCode,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

// Hero section content
export const HERO_HEADLINE = "Control every permission.";
export const HERO_HEADLINE_ACCENT = "Protect every feature.";
export const HERO_DESCRIPTION =
  "One API to gate features, enforce limits, and audit everything—built for SaaS teams who ship fast.";

export const HERO_BULLETS = [
  "Feature flags with per-user and per-plan controls",
  "Usage limits with real-time tracking and enforcement",
  "Role-based access with cascading permissions",
];

// Feature cards for bento grid - based on actual platform features
export interface FeatureCard {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight?: string;
  span?: "normal" | "wide" | "tall";
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Feature Flags",
    description:
      "Toggle features on/off per user, plan, or role. Boolean flags and metered limits in one place.",
    icon: Layers,
    highlight: "Core",
    span: "normal",
  },
  {
    title: "Usage Limits",
    description:
      "Set limits per feature—API calls, storage, exports. Track usage in real-time and enforce automatically.",
    icon: BarChart3,
    span: "wide",
  },
  {
    title: "Plans & Tiers",
    description:
      "Create subscription plans with feature bundles. Free, Pro, Enterprise—each with its own limits.",
    icon: Zap,
    span: "normal",
  },
  {
    title: "Role-Based Access",
    description:
      "Define roles with granular permissions. Assign to users, cascade through hierarchy.",
    icon: Users,
    span: "normal",
  },
  {
    title: "User Overrides",
    description:
      "Grant or revoke features for specific users. Set expiration dates for temporary access.",
    icon: Settings,
    highlight: "Flexible",
    span: "normal",
  },
  {
    title: "API Keys",
    description:
      "Generate scoped API keys for your integrations. Read-only, write, or full access.",
    icon: Key,
    span: "normal",
  },
];

// How it works steps - based on actual API flow
export interface HowItWorksStepItem {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStepItem[] = [
  {
    step: 1,
    title: "Define",
    description:
      "Create features, plans, and roles in the dashboard or via API.",
    icon: FileCode,
  },
  {
    step: 2,
    title: "Check",
    description: "Query permissions with a single API call before any action.",
    icon: Code2,
  },
  {
    step: 3,
    title: "Track",
    description:
      "Record usage and get real-time analytics with full audit trail.",
    icon: CheckCircle,
  },
];

// Security safeguards - based on actual platform capabilities
export const SAFEGUARDS = [
  {
    title: "Policy Evaluation",
    detail: "Roles + plan features + overrides checked before any action runs.",
    icon: Shield,
  },
  {
    title: "Rate Limiting",
    detail:
      "Per-user and per-feature limits enforced automatically with clear error messages.",
    icon: RefreshCw,
  },
  {
    title: "Audit Logging",
    detail: "Every permission check and usage record captured for investigations.",
    icon: BarChart3,
  },
  {
    title: "Scoped API Keys",
    detail:
      "Limit what each API key can do—read permissions, write usage, or both.",
    icon: Lock,
  },
];

// Integration names for marquee
export const INTEGRATIONS = [
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "Next.js",
  "Express",
  "PostgreSQL",
  "Clerk",
];

// API code examples - based on actual API from docs
export const API_EXAMPLES = {
  getPermissions: {
    title: "Get User Permissions",
    method: "GET" as const,
    endpoint: "/api/v1/permissions?userId=123",
    request: `const response = await fetch(
  'https://api.saasguard.io/api/v1/permissions?userId=123',
  {
    headers: {
      'X-API-Key': 'sg_your_api_key'
    }
  }
);

const { data } = await response.json();

if (data.features['export_data']) {
  // User can export
}`,
    response: `{
  "success": true,
  "data": {
    "features": {
      "export_data": true,
      "advanced_analytics": false
    },
    "limits": {
      "api_calls": {
        "max": 1000,
        "used": 234,
        "remaining": 766
      }
    }
  }
}`,
  },
  recordUsage: {
    title: "Record Usage",
    method: "POST" as const,
    endpoint: "/api/v1/usage/record",
    request: `await fetch('https://api.saasguard.io/api/v1/usage/record', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sg_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 123,
    featureSlug: 'api_calls',
    amount: 1
  })
});`,
    response: `{
  "success": true,
  "data": {
    "featureSlug": "api_calls",
    "currentUsage": 235,
    "updatedAt": "2026-01-03T10:30:00Z"
  }
}`,
  },
  syncUser: {
    title: "Sync User",
    method: "POST" as const,
    endpoint: "/api/v1/users/sync",
    request: `await fetch('https://api.saasguard.io/api/v1/users/sync', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sg_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    clerkId: 'user_abc123',
    email: 'user@example.com'
  })
});`,
    response: `{
  "success": true,
  "data": {
    "id": 42,
    "clerkId": "user_abc123",
    "email": "user@example.com",
    "organizationId": 1
  }
}`,
  },
};

// CTA content
export const CTA_HEADLINE = "Ready to secure your SaaS?";
export const CTA_SUBHEADLINE = "Start free today.";
export const CTA_DESCRIPTION =
  "Ship permission checks in minutes, not sprints. Start free, scale as you grow.";

// Request flow for safeguards section
export const REQUEST_FLOW = [
  "Authenticate request",
  "Load user context",
  "Evaluate role permissions",
  "Check feature access",
  "Verify usage limits",
  "Allow or deny",
];

// How it works steps - updated with icons
export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

// Footer links - organized by category
export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "Product",
    links: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Quick Start", href: "/docs" },
      { name: "API Reference", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Contact", href: "mailto:rohitkashyapmrt@gmail.com" },
      { name: "GitHub", href: "https://github.com/rohit-jsfreaky/SaasGuard-frontend" },
    ],
  },
];
