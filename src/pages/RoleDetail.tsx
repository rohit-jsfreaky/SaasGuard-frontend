import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { rolesService } from "@/services/roles.service";
import { featuresService } from "@/services/features.service";
import type { Role, Feature } from "@/types/entities";
import { toast } from "sonner";
import { GrantPermissionsModal } from "@/components/roles/GrantPermissionsModal";

export default function RoleDetail() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGrantOpen, setIsGrantOpen] = useState(false);

  // Confirmation dialog state
  const [permissionToRevoke, setPermissionToRevoke] = useState<string | null>(
    null
  );
  const [isRevoking, setIsRevoking] = useState(false);

  const fetchRoleData = async () => {
    if (!roleId) return;

    setIsLoading(true);
    try {
      const [roleRes, permissionsRes, featuresRes] = await Promise.all([
        rolesService.getById(Number(roleId)),
        rolesService.getPermissions(Number(roleId)),
        featuresService.getAll(1, 100),
      ]);

      setRole(roleRes.data);
      setPermissions(permissionsRes.data);
      setAllFeatures(featuresRes.data);
    } catch (err: any) {
      toast.error("Failed to load role details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, [roleId]);

  const confirmRevokePermission = async () => {
    if (!roleId || !permissionToRevoke) return;

    setIsRevoking(true);
    try {
      await rolesService.revokePermission(Number(roleId), permissionToRevoke);
      toast.success("Permission revoked");
      fetchRoleData();
    } catch (err: any) {
      toast.error("Failed to revoke permission");
    } finally {
      setIsRevoking(false);
      setPermissionToRevoke(null);
    }
  };

  // Get feature details for a permission slug
  const getFeatureForPermission = (slug: string) => {
    return allFeatures.find((f) => f.slug === slug);
  };

  // Get features not yet granted
  const availableFeatures = allFeatures.filter(
    (f) => !permissions.includes(f.slug)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Role not found</h3>
        <Button variant="link" onClick={() => navigate("/roles")}>
          Go back to roles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/roles")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{role.name}</h1>
          <p className="text-muted-foreground">
            {role.description || `Manage permissions for ${role.name}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Permissions Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Features this role has access to
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsGrantOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Grant Permission
            </Button>
          </CardHeader>
          <CardContent>
            {permissions.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                <Shield className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No permissions granted yet
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permSlug) => {
                    const feature = getFeatureForPermission(permSlug);
                    return (
                      <TableRow key={permSlug}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {feature?.name || permSlug}
                            </p>
                            {feature?.description && (
                              <p className="text-xs text-muted-foreground">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {permSlug}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setPermissionToRevoke(permSlug)}
                            title="Revoke Permission"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Role Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
            <CardDescription>Information about this role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">{role.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Slug</p>
              <Badge variant="outline" className="font-mono">
                {role.slug}
              </Badge>
            </div>
            {role.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p>{role.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Permissions Count
              </p>
              <p className="text-lg">{permissions.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created
              </p>
              <p>{new Date(role.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <GrantPermissionsModal
        isOpen={isGrantOpen}
        onClose={() => setIsGrantOpen(false)}
        roleId={Number(roleId)}
        availableFeatures={availableFeatures}
        onSuccess={fetchRoleData}
      />

      {/* Revoke Permission Confirmation */}
      <AlertDialog
        open={!!permissionToRevoke}
        onOpenChange={() => setPermissionToRevoke(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the permission
              <span className="font-semibold text-foreground font-mono">
                {" "}
                "{permissionToRevoke}"{" "}
              </span>
              from this role? Users with this role will lose access to this
              feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmRevokePermission();
              }}
              disabled={isRevoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRevoking ? "Revoking..." : "Revoke"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
