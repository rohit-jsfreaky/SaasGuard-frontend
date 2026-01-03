import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserPlus,
  Shield,
  ShieldOff,
  MoreHorizontal,
  Crown,
} from "lucide-react";
import { useSettingsStore } from "@/store/settings.store";
import { MakeAdminConfirm } from "./MakeAdminConfirm";
import { RemoveAdminConfirm } from "./RemoveAdminConfirm";
import { formatDate } from "@/utils/format";
import type { OrgAdmin, OrgMember } from "@/services/settings.service";

interface AdminManagementProps {
  organizationId: number;
  currentUserId?: number;
}

export function AdminManagement({
  organizationId,
  currentUserId,
}: AdminManagementProps) {
  const {
    admins,
    members,
    isLoadingAdmins,
    isLoadingMembers,
    hasFetchedAdmins,
    hasFetchedMembers,
    fetchAdmins,
    fetchMembers,
  } = useSettingsStore();

  // Modal state
  const [makeAdminUser, setMakeAdminUser] = useState<OrgMember | null>(null);
  const [removeAdminUser, setRemoveAdminUser] = useState<OrgAdmin | null>(null);

  // Fetch admins on mount
  useEffect(() => {
    if (!hasFetchedAdmins && !isLoadingAdmins) {
      fetchAdmins(organizationId);
    }
  }, [organizationId, hasFetchedAdmins, isLoadingAdmins, fetchAdmins]);

  // Fetch members for dropdown
  useEffect(() => {
    if (!hasFetchedMembers && !isLoadingMembers) {
      fetchMembers(organizationId);
    }
  }, [organizationId, hasFetchedMembers, isLoadingMembers, fetchMembers]);

  // Get non-admin members for the dropdown
  const nonAdminMembers = members.filter(
    (member) => !admins.some((admin) => admin.id === member.id)
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Admin Management</CardTitle>
            <CardDescription>
              Manage who can administer this organization
            </CardDescription>
          </div>

          {/* Add Admin Dropdown */}
          {nonAdminMembers.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Admin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {nonAdminMembers.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    onClick={() => setMakeAdminUser(member)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {member.email}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent>
          {isLoadingAdmins && !hasFetchedAdmins ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : admins.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No admins found
            </p>
          ) : (
            <div>
              {/* Mobile: Card layout */}
              <div className="space-y-3 sm:hidden">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {admin.email}
                        </p>
                        {admin.id === currentUserId && (
                          <span className="text-xs text-muted-foreground">
                            (you)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {admin.isCreator ? (
                          <Badge variant="default" className="gap-1 text-xs">
                            <Crown className="h-3 w-3" />
                            Owner
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(admin.createdAt)}
                        </span>
                      </div>
                    </div>
                    {!admin.isCreator && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setRemoveAdminUser(admin)}
                          >
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Remove Admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden sm:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">
                          {admin.email}
                          {admin.id === currentUserId && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {admin.isCreator ? (
                            <Badge variant="default" className="gap-1">
                              <Crown className="h-3 w-3" />
                              Owner
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Admin</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(admin.createdAt)}
                        </TableCell>
                        <TableCell>
                          {!admin.isCreator && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setRemoveAdminUser(admin)}
                                >
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Remove Admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Make Admin Confirmation Dialog */}
      <MakeAdminConfirm
        member={makeAdminUser}
        organizationId={organizationId}
        onClose={() => setMakeAdminUser(null)}
      />

      {/* Remove Admin Confirmation Dialog */}
      <RemoveAdminConfirm
        admin={removeAdminUser}
        organizationId={organizationId}
        currentUserId={currentUserId}
        onClose={() => setRemoveAdminUser(null)}
      />
    </>
  );
}
