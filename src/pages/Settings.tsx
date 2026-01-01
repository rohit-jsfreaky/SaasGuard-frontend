import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { useOrganizationStore } from "@/store/organization.store";
import { useSettingsStore } from "@/store/settings.store";
import { useAuth } from "@/hooks/useAuth";
import { OrgSettingsForm } from "@/components/settings/OrgSettingsForm";
import { AdminManagement } from "@/components/settings/AdminManagement";

export default function Settings() {
  const { currentOrganization } = useOrganizationStore();
  const { reset } = useSettingsStore();
  const { user } = useAuth();

  // Reset settings store when organization changes
  useEffect(() => {
    reset();
  }, [currentOrganization?.id, reset]);

  // No organization selected
  if (!currentOrganization) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Organization Selected</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-md">
          To manage settings, you need to select or create an organization. Use
          the organization dropdown in the header.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and administrators
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Organization Settings */}
        <OrgSettingsForm organization={currentOrganization} />

        {/* Admin Management */}
        <AdminManagement
          organizationId={currentOrganization.id}
          currentUserId={user?.id}
        />
      </div>
    </div>
  );
}
