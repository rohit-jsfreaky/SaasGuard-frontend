# SaaS Guard Frontend

A modern React dashboard for managing feature flags, plans, roles, and usage-based permissions for SaaS applications.

![SaaS Guard](public/saasguard_full.png)

## Features

- **Feature Management** – Create, edit, and organize feature flags with boolean or limit-based types
- **Plans** – Define subscription plans with feature entitlements and usage limits
- **Roles** – Configure roles with granular permissions for organization members
- **User Management** – View users, assign plans/roles, and manage overrides
- **Overrides** – Grant or revoke specific features per user with optional expiration
- **Usage Tracking** – Monitor feature usage across your organization
- **API Key Management** – Generate and revoke API keys for external integrations
- **Organization Switcher** – Multi-tenant support with easy org switching
- **Dark/Light Mode** – Full theme support

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** – Fast dev server and build
- **Tailwind CSS v4** – Utility-first styling
- **shadcn/ui** – Accessible component primitives (Radix UI)
- **Clerk** – Authentication and user management
- **Zustand** – Lightweight state management
- **React Router v7** – Client-side routing
- **Recharts** – Dashboard charts
- **Axios** – API client
- **Motion** – Animations

## Getting Started

### Prerequisites

- Node.js 18+
- A running SaaS Guard backend API
- Clerk account for authentication

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/saasguard-frontend.git
cd saasguard-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
npm run preview
```

### Linting & Type Check

```bash
npm run lint
npm run type-check
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Auth provider, protected routes
│   ├── common/        # Layout, Header, Sidebar, Breadcrumbs
│   ├── dashboard/     # Dashboard charts and metrics
│   ├── features/      # Feature CRUD modals and table
│   ├── overrides/     # Override management
│   ├── plans/         # Plan CRUD and feature assignment
│   ├── roles/         # Role management
│   ├── settings/      # API keys, org settings
│   ├── ui/            # shadcn/ui components
│   ├── usage/         # Usage charts and tables
│   └── users/         # User detail, plan/role assignment
├── hooks/             # Custom hooks (useAuth, useTheme, etc.)
├── pages/             # Route page components
├── services/          # API service modules
├── store/             # Zustand stores
├── styles/            # Global CSS and theme
├── types/             # TypeScript interfaces
└── utils/             # Helpers and constants
```

## API Integration

The frontend communicates with the SaaS Guard backend via REST APIs:

- `/api/v1/permissions` – Check user permissions
- `/api/v1/usage/record` – Record feature usage
- `/api/v1/users/sync` – Sync users from your app
- `/api/v1/users/plan` – Assign plans to users
- `/api/v1/users/role` – Assign roles to users
- `/api/admin/*` – Dashboard management endpoints

See the [API Documentation](/docs) for full details.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |

## License

MIT
