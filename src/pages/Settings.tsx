import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrgSettingsForm } from "@/components/settings/OrgSettingsForm";
import { AdminManagement } from "@/components/settings/AdminManagement";
import { useOrgSettings } from "@/hooks/useOrgSettings";
import { useAuthStore } from "@/store/auth.store";

export default function Settings() {
  const { organization, admins, loading, updateOrg, addAdmin, removeAdmin } =
    useOrgSettings();

  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  if (isAuthLoading || (organization === null && loading.org)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Loading organization settings...
        </p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-2xl font-bold">No Organization Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You are not currently part of any organization. Please contact your
          administrator or create a new organization.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and team access.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="admins">Administrators</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <OrgSettingsForm
            organization={organization}
            onUpdate={updateOrg}
            isLoading={loading.update}
          />
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <AdminManagement
            admins={admins}
            onAddAdmin={addAdmin}
            onRemoveAdmin={removeAdmin}
            isLoading={loading.admins}
            currentUserId={currentUser ? (currentUser as any).id : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
