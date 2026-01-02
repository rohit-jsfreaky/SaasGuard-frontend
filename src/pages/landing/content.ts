import { Shield, Lock, Zap, BarChart3, Users, Globe } from "lucide-react";

export const HERO_BULLETS = [
  "Policy-as-code decisions for every request",
  "REST endpoints plus webhooks for sync back",
  "Audit exports you can hand to compliance",
];

export const FEATURE_CARDS = [
  {
    title: "Policy Decisions",
    description: "Evaluate access with roles, attributes, and overrides from your org data.",
    icon: Lock,
  },
  {
    title: "Rate Limits",
    description: "Protect APIs by user, token, IP, or org with burst-friendly limits.",
    icon: Zap,
  },
  {
    title: "Audit & Analytics",
    description: "Log every decision with reason codes; export for compliance and BI.",
    icon: BarChart3,
  },
  {
    title: "Org & Roles",
    description: "Manage organizations, roles, and hierarchies; sync from your source of truth.",
    icon: Users,
  },
  {
    title: "Overrides",
    description: "Create scoped overrides for accounts, features, or environments safely.",
    icon: Globe,
  },
  {
    title: "User Lifecycle",
    description: "Provision, suspend, and track usage with consistent policies applied.",
    icon: Shield,
  },
];

export const SAFEGUARDS = [
  {
    title: "Policy evaluation",
    detail: "Roles + attributes checked before any action runs.",
  },
  {
    title: "Rate limiting",
    detail: "User/token/IP/org aware limits to stop abuse without breaking good traffic.",
  },
  {
    title: "Audit logging",
    detail: "Decision, actor, resource, and reason captured for investigations.",
  },
  {
    title: "Threat intel",
    detail: "Known bad actors blocked automatically; hook in your own feeds.",
  },
];

export const REQUEST_FLOW = [
  "Authenticate with your provider",
  "Call /api/authorize with actor, action, resource",
  "Apply rate limits and policies",
  "Log decision + emit webhooks",
];

export const INTEGRATIONS = [
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "PostgreSQL",
  "Next.js",
];

export const HERO_CODE_SNIPPET = `POST /api/authorize
{
  "actor": "user_123",
  "action": "billing.view",
  "resource": "org_456",
  "context": { "ip": "203.0.113.10" }
}

// 200 OK
// { "decision": "allow", "reason": "role:admin" }`;
