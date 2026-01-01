import { useState } from "react";
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
import { Copy, Check, Loader2 } from "lucide-react";
import { useSettingsStore } from "@/store/settings.store";
import { validateName } from "@/utils/validators";
import { formatDate } from "@/utils/format";
import type { Organization } from "@/types/entities";

interface OrgSettingsFormProps {
  organization: Organization;
}

export function OrgSettingsForm({ organization }: OrgSettingsFormProps) {
  const { updateOrgName } = useSettingsStore();

  const [name, setName] = useState(organization.name);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (name === organization.name) {
      setError("Name is the same as current");
      return;
    }

    setIsLoading(true);
    const success = await updateOrgName(organization.id, name.trim());
    setIsLoading(false);

    if (!success) {
      setError("Failed to update organization name");
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(String(organization.id));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>
          Manage your organization's basic information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Enter organization name"
              disabled={isLoading}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Organization ID (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="org-id">Organization ID</Label>
            <div className="flex gap-2">
              <Input
                id="org-id"
                value={organization.id}
                readOnly
                disabled
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyId}
                title="Copy ID"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Created Date (read-only) */}
          <div className="space-y-2">
            <Label>Created</Label>
            <p className="text-sm text-muted-foreground">
              {formatDate(organization.createdAt)}
            </p>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
