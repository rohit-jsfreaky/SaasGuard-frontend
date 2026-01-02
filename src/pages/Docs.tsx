import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  Copy,
  Check,
  Menu,
  X,
  Zap,
  Shield,
  Key,
  AlertTriangle,
  Lightbulb,
  Book,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

// Docs navigation structure
const docsNav = [
  { id: "quick-start", title: "Quick Start", icon: Zap },
  { id: "authentication", title: "Authentication", icon: Shield },
  {
    id: "core-apis",
    title: "Core APIs",
    icon: Book,
    children: [
      { id: "get-user-permissions", title: "Get User Permissions" },
      { id: "record-usage", title: "Record Usage" },
      { id: "sync-users", title: "Sync Users" },
      { id: "get-usage", title: "Get Usage" },
    ],
  },
  { id: "api-key-management", title: "API Key Management", icon: Key },
  { id: "error-handling", title: "Error Handling", icon: AlertTriangle },
  { id: "best-practices", title: "Best Practices", icon: Lightbulb },
];

// Language mapping for syntax highlighter
const languageMap: Record<string, string> = {
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  json: "json",
  http: "http",
  bash: "bash",
  shell: "bash",
};

// Code block component with syntax highlighting and copy functionality
function CodeBlock({
  code,
  language = "javascript",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mappedLanguage = languageMap[language] || language;

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
        <span className="text-xs font-medium text-zinc-400">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="mr-1 h-3 w-3 text-emerald-400" />
          ) : (
            <Copy className="mr-1 h-3 w-3" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <SyntaxHighlighter
        language={mappedLanguage}
        style={oneDark}
        className="text-xs sm:text-sm"
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          lineHeight: "1.5",
        }}
        codeTagProps={{
          style: {
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// HTTP method badge
function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    POST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PUT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    DELETE: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <span
      className={cn(
        "rounded border px-2 py-0.5 text-xs font-semibold",
        colors[method] || "bg-zinc-500/10 text-zinc-500"
      )}
    >
      {method}
    </span>
  );
}

// Section component
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-8 border-b border-border/50">
      <h2 className="mb-6 text-2xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

// Alert/Warning box
function AlertBox({
  type = "warning",
  children,
}: {
  type?: "warning" | "info";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "my-4 rounded-lg border p-4",
        type === "warning"
          ? "border-amber-500/20 bg-amber-500/10"
          : "border-blue-500/20 bg-blue-500/10"
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn(
            "h-5 w-5 shrink-0 mt-0.5",
            type === "warning" ? "text-amber-500" : "text-blue-500"
          )}
        />
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

export default function Docs() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("quick-start");
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Handle scroll to section via hash
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash) {
      setActiveSection(hash);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66%" }
    );

    docsNav.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
      if (item.children) {
        item.children.forEach((child) => {
          const childElement = document.getElementById(child.id);
          if (childElement) observer.observe(childElement);
        });
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/saasguard_full.png" alt="SaaS Guard" className="h-16 w-auto" />
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              / API Documentation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">
                Dashboard <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 top-14 z-40 w-64 -translate-x-full border-r bg-background transition-transform lg:translate-x-0",
            mobileMenuOpen && "translate-x-0"
          )}
        >
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="p-4">
              <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Documentation
              </p>
              <nav className="space-y-1">
                {docsNav.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        activeSection === item.id
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.title}
                    </button>
                    {item.children && (
                      <div className="ml-6 mt-1 space-y-1 border-l pl-2">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => scrollToSection(child.id)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors",
                              activeSection === child.id
                                ? "font-medium text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <ChevronRight className="h-3 w-3" />
                            {child.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </aside>

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
            {/* Hero */}
            <div className="mb-12 border-b pb-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  v1.0.0
                </span>
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight">
                SaaS Guard API Documentation
              </h1>
              <p className="text-lg text-muted-foreground">
                SaaS Guard is a centralized permission and entitlement engine
                for SaaS applications. This documentation covers the APIs you
                need to integrate SaaS Guard into your application.
              </p>
              <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                <p className="text-sm">
                  <span className="font-medium">Base URL:</span>{" "}
                  <code className="rounded bg-background px-2 py-0.5 text-sm">
                    https://your-api-domain.com/api
                  </code>
                </p>
              </div>
            </div>

            {/* Quick Start */}
            <Section id="quick-start" title="Quick Start">
              <p className="mb-6 text-muted-foreground">
                Get up and running with SaaS Guard in 3 simple steps.
              </p>

              <h3 className="mb-3 text-lg font-semibold">
                1. Generate an API Key
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Go to your SaaS Guard dashboard → Settings → API Keys → Create
                New Key
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                You'll receive a key like:{" "}
                <code className="rounded bg-muted px-2 py-0.5">
                  sg_1a2b3c4d5e6f7g8h9i0j...
                </code>
              </p>
              <AlertBox type="warning">
                <strong>Copy the key immediately!</strong> It's only shown once.
              </AlertBox>

              <h3 className="mb-3 mt-8 text-lg font-semibold">
                2. Check User Permissions
              </h3>
              <CodeBlock
                language="javascript"
                code={`const response = await fetch(
  'https://your-api-domain.com/api/v1/permissions?userId=123',
  {
    headers: {
      'X-API-Key': 'sg_your_api_key_here'
    }
  }
);

const { data } = await response.json();

if (data.features['create_post']) {
  // User can create posts
}

if (data.limits['api_calls'].remaining > 0) {
  // User has API calls remaining
}`}
              />

              <h3 className="mb-3 mt-8 text-lg font-semibold">
                3. Record Usage
              </h3>
              <CodeBlock
                language="javascript"
                code={`await fetch('https://your-api-domain.com/api/v1/usage/record', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sg_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 123,
    featureSlug: 'api_calls',
    amount: 1
  })
});`}
              />
            </Section>

            {/* Authentication */}
            <Section id="authentication" title="Authentication">
              <p className="mb-6 text-muted-foreground">
                External SaaS apps use <strong>API Keys</strong> to authenticate
                with SaaS Guard.
              </p>

              <h3 className="mb-3 text-lg font-semibold">Get your API Key</h3>
              <ol className="mb-6 list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Login to SaaS Guard Dashboard</li>
                <li>Go to Settings → API Keys</li>
                <li>Click "Create New Key"</li>
                <li>Copy the key (only shown once!)</li>
              </ol>

              <h3 className="mb-3 text-lg font-semibold">
                Use the API Key in requests
              </h3>
              <CodeBlock
                language="http"
                code={`# Header (recommended)
X-API-Key: sg_1a2b3c4d5e6f7g8h9i0j...

# Authorization header
Authorization: ApiKey sg_1a2b3c4d5e6f7g8h9i0j...

# Query parameter (less secure)
GET /api/v1/permissions?userId=123&apiKey=sg_1a2b3c4d5e6f7g8h9i0j...`}
              />

              <h3 className="mb-3 mt-8 text-lg font-semibold">
                API Key Scopes
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                When creating an API key, you can limit what it can do:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-semibold">Scope</th>
                      <th className="py-2 text-left font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2">
                        <code>permissions:read</code>
                      </td>
                      <td className="py-2">
                        Read user permissions and feature access
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code>usage:read</code>
                      </td>
                      <td className="py-2">Read usage data for users</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code>usage:write</code>
                      </td>
                      <td className="py-2">Record usage for users</td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        <code>users:sync</code>
                      </td>
                      <td className="py-2">
                        Sync/create users from your application
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Core APIs */}
            <Section id="core-apis" title="Core APIs">
              <p className="mb-8 text-muted-foreground">
                These are the primary APIs you'll use to manage permissions and
                usage.
              </p>

              {/* Get User Permissions */}
              <div id="get-user-permissions" className="scroll-mt-24 mb-10">
                <h3 className="mb-4 text-xl font-semibold">
                  Get User Permissions
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  <strong>The most important API</strong> - Returns what the
                  user can do.
                </p>
                <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <MethodBadge method="GET" />
                  <code className="text-sm">
                    /api/v1/permissions?userId={"{userId}"}
                  </code>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  OR using Clerk ID:
                </p>
                <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <MethodBadge method="GET" />
                  <code className="text-sm">
                    /api/v1/permissions?clerkId={"{clerkId}"}
                  </code>
                </div>
                <h4 className="mb-2 text-sm font-semibold">Response:</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "success": true,
  "data": {
    "features": {
      "create_post": true,
      "delete_post": true,
      "export_data": false,
      "advanced_analytics": false
    },
    "limits": {
      "api_calls": {
        "max": 1000,
        "used": 234,
        "remaining": 766
      },
      "file_uploads": {
        "max": 50,
        "used": 12,
        "remaining": 38
      }
    },
    "resolvedAt": "2026-01-01T17:45:00.000Z"
  }
}`}
                />

                <h4 className="mb-2 mt-6 text-sm font-semibold">
                  JavaScript Example:
                </h4>
                <CodeBlock
                  language="javascript"
                  code={`async function checkPermission(userId, feature) {
  const res = await fetch(
    \`https://api.saasguard.io/api/v1/permissions?userId=\${userId}\`,
    { headers: { 'X-API-Key': process.env.SAASGUARD_API_KEY } }
  );
  const { data } = await res.json();
  return data.features[feature] === true;
}

// Usage
if (await checkPermission(userId, 'export_data')) {
  exportData();
} else {
  showUpgradeModal();
}`}
                />
              </div>

              {/* Record Usage */}
              <div id="record-usage" className="scroll-mt-24 mb-10">
                <h3 className="mb-4 text-xl font-semibold">Record Usage</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Record usage after a successful action.{" "}
                  <strong>Always call AFTER the action succeeds.</strong>
                </p>
                <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <MethodBadge method="POST" />
                  <code className="text-sm">/api/v1/usage/record</code>
                </div>
                <h4 className="mb-2 text-sm font-semibold">Request Body:</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "userId": 123,
  "featureSlug": "api_calls",
  "amount": 1
}`}
                />
                <p className="my-4 text-sm text-muted-foreground">
                  OR using Clerk ID:
                </p>
                <CodeBlock
                  language="json"
                  code={`{
  "clerkId": "user_abc123",
  "featureSlug": "create_post",
  "amount": 1
}`}
                />
                <h4 className="mb-2 mt-6 text-sm font-semibold">Response:</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "success": true,
  "data": {
    "userId": 123,
    "featureSlug": "api_calls",
    "currentUsage": 235,
    "updatedAt": "2026-01-01T17:50:00.000Z"
  }
}`}
                />

                <h4 className="mb-2 mt-6 text-sm font-semibold">
                  JavaScript Example:
                </h4>
                <CodeBlock
                  language="javascript"
                  code={`async function createPost(data) {
  // 1. Create the post first
  const post = await db.posts.create(data);
  
  // 2. Then record usage
  await fetch('https://api.saasguard.io/api/v1/usage/record', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.SAASGUARD_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: post.userId,
      featureSlug: 'create_post',
      amount: 1
    })
  });
  
  return post;
}`}
                />
              </div>

              {/* Sync Users */}
              <div id="sync-users" className="scroll-mt-24 mb-10">
                <h3 className="mb-4 text-xl font-semibold">Sync Users</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create or update a user in SaaS Guard from your application.
                </p>
                <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <MethodBadge method="POST" />
                  <code className="text-sm">/api/v1/users/sync</code>
                </div>
                <h4 className="mb-2 text-sm font-semibold">Request Body:</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "clerkId": "user_abc123",
  "email": "user@example.com"
}`}
                />
                <h4 className="mb-2 mt-6 text-sm font-semibold">Response:</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "success": true,
  "data": {
    "id": 42,
    "clerkId": "user_abc123",
    "email": "user@example.com",
    "organizationId": 1,
    "createdAt": "2026-01-01T10:00:00.000Z"
  }
}`}
                />
                <h4 className="mb-2 mt-6 text-sm font-semibold">
                  When to sync:
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>After user signs up</li>
                  <li>After user updates their email</li>
                  <li>After user is added to your application</li>
                </ul>
              </div>

              {/* Get Usage */}
              <div id="get-usage" className="scroll-mt-24 mb-10">
                <h3 className="mb-4 text-xl font-semibold">Get Usage</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Get usage stats for a user.
                </p>
                <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <MethodBadge method="GET" />
                  <code className="text-sm">
                    /api/v1/usage?userId={"{userId}"}
                  </code>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Get specific feature:
                </p>
                <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <MethodBadge method="GET" />
                  <code className="text-sm">
                    /api/v1/usage?userId={"{userId}"}&featureSlug=api_calls
                  </code>
                </div>
                <h4 className="mb-2 text-sm font-semibold">Response:</h4>
                <CodeBlock
                  language="json"
                  code={`{
  "success": true,
  "data": [
    {
      "featureSlug": "api_calls",
      "currentUsage": 234,
      "updatedAt": "2026-01-01T15:30:00.000Z"
    },
    {
      "featureSlug": "file_uploads",
      "currentUsage": 12,
      "updatedAt": "2026-01-01T14:20:00.000Z"
    }
  ]
}`}
                />
              </div>
            </Section>

            {/* API Key Management */}
            <Section id="api-key-management" title="API Key Management">
              <p className="mb-6 text-muted-foreground">
                Manage your API keys from the SaaS Guard dashboard.
              </p>

              <h3 className="mb-4 text-lg font-semibold">
                Create API Key (Dashboard)
              </h3>
              <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <MethodBadge method="POST" />
                <code className="text-sm">
                  /api/admin/organizations/{"{orgId}"}/api-keys
                </code>
              </div>
              <CodeBlock
                language="json"
                code={`{
  "name": "Production API Key",
  "scopes": ["permissions:read", "usage:write", "users:sync"],
  "expiresAt": null
}`}
              />
              <h4 className="mb-2 mt-6 text-sm font-semibold">Response:</h4>
              <CodeBlock
                language="json"
                code={`{
  "success": true,
  "message": "API key created. Copy the key now - it will not be shown again!",
  "data": {
    "id": 1,
    "key": "sg_1a2b3c4d5e6f7g8h9i0jklmnopqrstuvwx",
    "keyPrefix": "sg_1a2b3c4d",
    "name": "Production API Key",
    "scopes": ["permissions:read", "usage:write", "users:sync"],
    "createdAt": "2026-01-01T18:00:00.000Z"
  }
}`}
              />

              <h3 className="mb-4 mt-8 text-lg font-semibold">List API Keys</h3>
              <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <MethodBadge method="GET" />
                <code className="text-sm">
                  /api/admin/organizations/{"{orgId}"}/api-keys
                </code>
              </div>

              <h3 className="mb-4 mt-8 text-lg font-semibold">
                Revoke API Key
              </h3>
              <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <MethodBadge method="POST" />
                <code className="text-sm">
                  /api/admin/organizations/{"{orgId}"}/api-keys/{"{keyId}"}
                  /revoke
                </code>
              </div>

              <h3 className="mb-4 mt-8 text-lg font-semibold">
                Delete API Key
              </h3>
              <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <MethodBadge method="DELETE" />
                <code className="text-sm">
                  /api/admin/organizations/{"{orgId}"}/api-keys/{"{keyId}"}
                </code>
              </div>
            </Section>

            {/* Error Handling */}
            <Section id="error-handling" title="Error Handling">
              <h3 className="mb-4 text-lg font-semibold">
                Error Response Format
              </h3>
              <CodeBlock
                language="json"
                code={`{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}`}
              />

              <h3 className="mb-4 mt-8 text-lg font-semibold">
                HTTP Status Codes
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-semibold">Code</th>
                      <th className="py-2 text-left font-semibold">Meaning</th>
                      <th className="py-2 text-left font-semibold">
                        When It Happens
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2">
                        <code>200</code>
                      </td>
                      <td className="py-2">OK</td>
                      <td className="py-2">Request successful</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code>201</code>
                      </td>
                      <td className="py-2">Created</td>
                      <td className="py-2">Resource created</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code>400</code>
                      </td>
                      <td className="py-2">Bad Request</td>
                      <td className="py-2">Invalid input data</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code>401</code>
                      </td>
                      <td className="py-2">Unauthorized</td>
                      <td className="py-2">Invalid or missing API key</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code>403</code>
                      </td>
                      <td className="py-2">Forbidden</td>
                      <td className="py-2">
                        Insufficient scope or no permission
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code>404</code>
                      </td>
                      <td className="py-2">Not Found</td>
                      <td className="py-2">User or resource doesn't exist</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code>429</code>
                      </td>
                      <td className="py-2">Too Many Requests</td>
                      <td className="py-2">Usage limit exceeded</td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        <code>500</code>
                      </td>
                      <td className="py-2">Server Error</td>
                      <td className="py-2">Internal error</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 mt-8 text-lg font-semibold">Common Errors</h3>

              <h4 className="mb-2 text-sm font-semibold">
                Invalid API Key (401):
              </h4>
              <CodeBlock
                language="json"
                code={`{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired API key."
  }
}`}
              />

              <h4 className="mb-2 mt-6 text-sm font-semibold">
                Missing Scope (403):
              </h4>
              <CodeBlock
                language="json"
                code={`{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_SCOPE",
    "message": "API key missing required scope(s): usage:write",
    "requiredScopes": ["usage:write"],
    "missingScopes": ["usage:write"]
  }
}`}
              />

              <h4 className="mb-2 mt-6 text-sm font-semibold">
                Usage Limit Exceeded (429):
              </h4>
              <CodeBlock
                language="json"
                code={`{
  "success": false,
  "error": {
    "code": "USAGE_LIMIT_EXCEEDED",
    "message": "You have reached your usage limit for this feature",
    "feature": "api_calls",
    "limit": 1000,
    "used": 1000,
    "remaining": 0
  }
}`}
              />
            </Section>

            {/* Best Practices */}
            <Section id="best-practices" title="Best Practices">
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    1. Keep API Keys Secure
                  </h3>
                  <CodeBlock
                    language="javascript"
                    code={`// ✅ Good - use environment variables
const apiKey = process.env.SAASGUARD_API_KEY;

// ❌ Bad - hardcoded key
const apiKey = 'sg_1a2b3c4d...';`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    2. Cache Permissions
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Permissions are cached for 5 minutes server-side. Cache
                    client-side too:
                  </p>
                  <CodeBlock
                    language="javascript"
                    code={`let permissionsCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getPermissions(userId) {
  const now = Date.now();
  const cached = permissionsCache[userId];
  
  if (cached && (now - cached.time < CACHE_TTL)) {
    return cached.data;
  }
  
  const res = await fetch(\`/api/v1/permissions?userId=\${userId}\`, {
    headers: { 'X-API-Key': process.env.SAASGUARD_API_KEY }
  });
  const { data } = await res.json();
  
  permissionsCache[userId] = { data, time: now };
  return data;
}`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    3. Check Before Action
                  </h3>
                  <CodeBlock
                    language="javascript"
                    code={`async function handleExport(userId) {
  const perms = await getPermissions(userId);
  
  if (!perms.features['export_data']) {
    throw new Error('Upgrade required for export feature');
  }
  
  if (perms.limits['api_calls'].remaining <= 0) {
    throw new Error('API call limit reached');
  }
  
  // Proceed with export
}`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    4. Record Usage After Success
                  </h3>
                  <CodeBlock
                    language="javascript"
                    code={`async function createPost(userId, data) {
  // 1. Create first
  const post = await db.posts.create(data);
  
  // 2. Then record usage (fire and forget is OK)
  recordUsage(userId, 'create_post', 1).catch(console.error);
  
  return post;
}`}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    5. Handle Errors Gracefully
                  </h3>
                  <CodeBlock
                    language="javascript"
                    code={`async function checkFeature(userId, feature) {
  try {
    const perms = await getPermissions(userId);
    return perms.features[feature] === true;
  } catch (error) {
    // Log error but fail open or closed based on your needs
    console.error('Permission check failed:', error);
    return false; // Fail closed (deny if can't check)
  }
}`}
                  />
                </div>
              </div>
            </Section>

            {/* Footer */}
            <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>SDK (Coming Soon)</strong> - We're working on official
                SDKs for Node.js, Python, Go, and Ruby.
              </p>
              <p>
                Need help? Contact{" "}
                <a
                  href="mailto:support@saasguard.io"
                  className="text-primary hover:underline"
                >
                  support@saasguard.io
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
