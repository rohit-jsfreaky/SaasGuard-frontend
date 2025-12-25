import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Organization } from "@/types";

const orgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type OrgFormData = z.infer<typeof orgSchema>;

interface OrgSettingsFormProps {
  organization: Organization;
  onUpdate: (data: OrgFormData) => Promise<void>;
  isLoading: boolean;
}

export function OrgSettingsForm({
  organization,
  onUpdate,
  isLoading,
}: OrgSettingsFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: organization.name,
    },
  });

  // Reset form when organization changes
  useEffect(() => {
    reset({ name: organization.name });
  }, [organization, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>
          Manage your organization's basic information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="id">Organization ID</Label>
            <Input
              id="id"
              value={organization.id}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={organization.slug}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" {...register("name")} placeholder="Acme Corp" />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="createdAt">Created At</Label>
            <Input
              id="createdAt"
              value={
                organization.createdAt
                  ? new Date(organization.createdAt).toLocaleDateString()
                  : "N/A"
              }
              disabled
              className="bg-muted"
            />
          </div>

          <div className="flex justify-end max-w-sm">
            <Button type="submit" disabled={isLoading || !isDirty}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
