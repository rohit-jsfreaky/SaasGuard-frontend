import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRoleDetail } from "@/hooks/useRoleDetail";
import { useFeatures } from "@/hooks/useFeatures";
import { GrantPermissionsModal } from "@/components/roles";

export default function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleId = id ? parseInt(id, 10) : null;

  const {
    role,
    users,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    addPermission,
    removePermission,
  } = useRoleDetail(roleId);

  // We need all features to map names
  const { features: allFeatures, fetchFeatures } = useFeatures();

  // Ensure features are loaded to map names
  useState(() => {
    fetchFeatures();
  });

  const [isGrantOpen, setIsGrantOpen] = useState(false);

  if (isLoading && !role) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-lg font-medium text-destructive">
          {error || "Role not found"}
        </div>
        <Button variant="outline" onClick={() => navigate("/roles")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>
      </div>
    );
  }

  const getFeatureName = (slug: string, id: number) => {
    const f = allFeatures.find((f) => f.slug === slug || f.id === id);
    return f ? f.name : slug;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/roles")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{role.name}</h1>
              <Badge variant="outline" className="font-mono text-xs">
                {role.slug}
              </Badge>
              {role.isSystemRole && <Badge>System Role</Badge>}
            </div>
            <p className="text-muted-foreground">
              {role.description || "No description provided."}
            </p>
          </div>
        </div>
        {activeTab === "permissions" && (
          <Button onClick={() => setIsGrantOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Grant Permissions
          </Button>
        )}
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {role.permissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No permissions granted to this role.
                    </TableCell>
                  </TableRow>
                ) : (
                  role.permissions.map((perm) => {
                    const featureName = getFeatureName(
                      perm.featureSlug,
                      perm.featureId
                    );
                    return (
                      <TableRow key={perm.featureId}>
                        <TableCell className="font-medium">
                          {featureName}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {perm.featureSlug}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removePermission(perm.featureId)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No users assigned to this role.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">
                        {user.email.split("@")[0]}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <GrantPermissionsModal
        open={isGrantOpen}
        onOpenChange={setIsGrantOpen}
        existingFeatureIds={role.permissions.map((p) => p.featureId)}
        onSubmit={addPermission}
      />
    </div>
  );
}
