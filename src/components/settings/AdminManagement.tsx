import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import type { AdminUser } from "@/types";

interface AdminManagementProps {
  admins: AdminUser[];
  onAddAdmin: (userId: number) => Promise<void>;
  onRemoveAdmin: (userId: number) => Promise<void>;
  isLoading: boolean;
  currentUserId?: number; // To prevent removing self, if desired
}

export function AdminManagement({
  admins,
  onAddAdmin,
  onRemoveAdmin,
  isLoading,
  currentUserId,
}: AdminManagementProps) {
  const { users } = useUsers(); // Need all users to select new admin
  const [selecteduserId, setSelectedUserId] = useState<string>("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Filter out users who are already admins
  const availableUsers = users.filter(
    (u) => !admins.some((a) => a.id === u.id)
  );

  const handleAdd = async () => {
    if (!selecteduserId) return;
    await onAddAdmin(parseInt(selecteduserId));
    setIsAddOpen(false);
    setSelectedUserId("");
  };

  const handleRemove = async () => {
    if (deleteId) {
      await onRemoveAdmin(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>
            Manage who has administrative access to this organization.
          </CardDescription>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Administrator</DialogTitle>
              <DialogDescription>
                Select a user to grant administrator privileges.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={selecteduserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.email}
                    </SelectItem>
                  ))}
                  {availableUsers.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No eligible users found.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAdd}
                disabled={!selecteduserId || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(admin.id)}
                        disabled={
                          isLoading ||
                          (currentUserId ? admin.id === currentUserId : false)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Admin?</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove admin privileges from this user?
                They will lose access to organization settings.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemove}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Remove Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
