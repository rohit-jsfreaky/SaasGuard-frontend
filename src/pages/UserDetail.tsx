import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Shield,
  Check,
  X,
  RefreshCw,
  Clock,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Progress } from "@/components/ui/progress";
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
import { useUserDetailStore } from "@/store/users.store";
import { useOrganizationStore } from "@/store/organization.store";
import { plansService } from "@/services/plans.service";
import { rolesService } from "@/services/roles.service";
import type { Plan, Role } from "@/types/entities";
import { ChangePlanModal } from "@/components/users/ChangePlanModal";
import { AssignRoleModal } from "@/components/users/AssignRoleModal";
import { formatDistanceToNow } from "date-fns";

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentOrganization } = useOrganizationStore();
  const organizationId = currentOrganization?.id;

  const {
    user,
    plan,
    roles,
    permissions,
    overrides,
    isLoading,
    fetchUserDetail,
    fetchUserPermissions,
    fetchUserOverrides,
    assignPlan,
    removePlan,
    assignRole,
    removeRole,
    reset,
  } = useUserDetailStore();

  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<Role | null>(null);
  const [isRemovingRole, setIsRemovingRole] = useState(false);
  const [isRefreshingPermissions, setIsRefreshingPermissions] = useState(false);

  useEffect(() => {
    if (userId && organizationId) {
      reset();
      fetchUserDetail(Number(userId), organizationId);
      fetchUserPermissions(Number(userId), organizationId);
      fetchUserOverrides(Number(userId));
    }
  }, [userId, organizationId]);

  useEffect(() => {
    const loadPlansAndRoles = async () => {
      if (!organizationId) return;
      try {
        const [plansRes, rolesRes] = await Promise.all([
          plansService.getAll(organizationId, 1, 100),
          rolesService.getAll(organizationId, 1, 100),
        ]);
        setAllPlans(plansRes.data);
        setAllRoles(rolesRes.data);
      } catch (err) {
        console.error("Failed to load plans/roles", err);
      }
    };
    loadPlansAndRoles();
  }, [organizationId]);

  const handleAssignPlan = async (planId: number) => {
    if (!userId || !organizationId) return false;
    return await assignPlan(Number(userId), planId, organizationId);
  };

  const handleRemovePlan = async () => {
    if (!userId || !organizationId) return;
    await removePlan(Number(userId), organizationId);
  };

  const handleAssignRole = async (roleId: number) => {
    if (!userId || !organizationId) return false;
    return await assignRole(Number(userId), roleId, organizationId);
  };

  const handleRemoveRole = async () => {
    if (!roleToRemove || !userId || !organizationId) return;
    setIsRemovingRole(true);
    await removeRole(Number(userId), roleToRemove.id, organizationId);
    setIsRemovingRole(false);
    setRoleToRemove(null);
  };

  const handleRefreshPermissions = async () => {
    if (!userId || !organizationId) return;
    setIsRefreshingPermissions(true);
    await fetchUserPermissions(Number(userId), organizationId);
    setIsRefreshingPermissions(false);
  };

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

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">User not found</h3>
        <Button variant="link" onClick={() => navigate("/dashboard/users")}>
          Go back to users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="plan-roles">
        <TabsList>
          <TabsTrigger value="plan-roles">Plan & Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="overrides">Overrides</TabsTrigger>
        </TabsList>

        {/* Plan & Roles Tab */}
        <TabsContent value="plan-roles" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Plan */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>User's assigned plan</CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsChangePlanOpen(true)}>
                  {plan ? "Change Plan" : "Assign Plan"}
                </Button>
              </CardHeader>
              <CardContent>
                {plan ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">{plan.name}</p>
                        <Badge variant="outline" className="font-mono text-xs">
                          {plan.slug}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={handleRemovePlan}
                        title="Remove Plan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-[100px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No plan assigned
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned Roles */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Assigned Roles</CardTitle>
                  <CardDescription>
                    User's roles in this organization
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsAssignRoleOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Role
                </Button>
              </CardHeader>
              <CardContent>
                {roles.length === 0 ? (
                  <div className="flex min-h-[100px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                    <Shield className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No roles assigned
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="font-medium">{role.name}</p>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {role.slug}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setRoleToRemove(role)}
                          title="Remove Role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Resolved Permissions</CardTitle>
                <CardDescription>
                  Combined permissions from plan, roles, and overrides
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {permissions?.resolvedAt && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated{" "}
                    {formatDistanceToNow(new Date(permissions.resolvedAt), {
                      addSuffix: true,
                    })}
                  </span>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRefreshPermissions}
                  disabled={isRefreshingPermissions}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      isRefreshingPermissions ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {permissions ? (
                <div className="space-y-6">
                  {/* Feature Permissions */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Features</h4>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(permissions.features).map(
                        ([feature, allowed]) => (
                          <div
                            key={feature}
                            className={`flex items-center gap-2 rounded-md border p-2 ${
                              allowed
                                ? "border-green-500/30 bg-green-500/10"
                                : "border-red-500/30 bg-red-500/10"
                            }`}
                          >
                            {allowed ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm font-mono">{feature}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Usage Limits */}
                  {Object.keys(permissions.limits).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Usage Limits</h4>
                      <div className="space-y-3">
                        {Object.entries(permissions.limits).map(
                          ([feature, limit]) => {
                            const percentage = (limit.used / limit.max) * 100;
                            return (
                              <div key={feature} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-mono">{feature}</span>
                                  <span className="text-muted-foreground">
                                    {limit.used.toLocaleString()} /{" "}
                                    {limit.max.toLocaleString()}
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Loading permissions...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overrides Tab */}
        <TabsContent value="overrides" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Overrides</CardTitle>
              <CardDescription>
                Feature overrides specific to this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overrides.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                  <Shield className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No overrides for this user
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Expires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overrides.map((override) => (
                      <TableRow
                        key={override.id}
                        className={override.isExpired ? "opacity-50" : ""}
                      >
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {override.featureSlug}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              override.overrideType === "feature_enable"
                                ? "bg-green-500/20 text-green-600"
                                : override.overrideType === "feature_disable"
                                ? "bg-red-500/20 text-red-600"
                                : "bg-blue-500/20 text-blue-600"
                            }
                          >
                            {override.overrideType.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {override.value !== null ? (
                            <span className="font-mono">
                              {override.value.toLocaleString()}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {override.isPermanent ? (
                            <Badge variant="outline">Permanent</Badge>
                          ) : override.expiresAt ? (
                            <span className="text-sm">
                              {new Date(
                                override.expiresAt
                              ).toLocaleDateString()}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ChangePlanModal
        isOpen={isChangePlanOpen}
        onClose={() => setIsChangePlanOpen(false)}
        plans={allPlans}
        currentPlanId={plan?.id}
        onSubmit={handleAssignPlan}
      />

      <AssignRoleModal
        isOpen={isAssignRoleOpen}
        onClose={() => setIsAssignRoleOpen(false)}
        roles={allRoles}
        assignedRoleIds={roles.map((r) => r.id)}
        onSubmit={handleAssignRole}
      />

      {/* Remove Role Confirmation */}
      <AlertDialog
        open={!!roleToRemove}
        onOpenChange={() => setRoleToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the role
              <span className="font-semibold text-foreground">
                {" "}
                "{roleToRemove?.name}"{" "}
              </span>
              from this user? They will lose all associated permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovingRole}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRemoveRole();
              }}
              disabled={isRemovingRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemovingRole ? "Removing..." : "Remove Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
