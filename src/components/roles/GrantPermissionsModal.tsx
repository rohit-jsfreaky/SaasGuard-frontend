import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { rolesService } from "@/services/roles.service";
import type { Feature } from "@/types/entities";
import { toast } from "sonner";

interface GrantPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: number;
  availableFeatures: Feature[];
  onSuccess: () => void;
}

export function GrantPermissionsModal({
  isOpen,
  onClose,
  roleId,
  availableFeatures,
  onSuccess,
}: GrantPermissionsModalProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedSlugs([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  const filteredFeatures = availableFeatures.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFeature = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSlugs.length === 0) {
      toast.error("Please select at least one feature");
      return;
    }

    setIsSubmitting(true);
    try {
      await rolesService.grantPermissions(roleId, selectedSlugs);
      toast.success(`${selectedSlugs.length} permission(s) granted`);
      onSuccess();
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to grant permissions");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedSlugs([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Grant Permissions</DialogTitle>
          <DialogDescription>
            Select features to grant access to this role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Features</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or slug..."
            />
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            {filteredFeatures.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {availableFeatures.length === 0
                  ? "All features are already granted to this role"
                  : "No features match your search"}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredFeatures.map((feature) => {
                  const isSelected = selectedSlugs.includes(feature.slug);
                  return (
                    <div
                      key={feature.id}
                      className="flex items-start space-x-3 rounded-md p-2 hover:bg-accent cursor-pointer"
                      onClick={() => toggleFeature(feature.slug)}
                    >
                      <div
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs data-[selected=true]:bg-primary data-[selected=true]:border-primary"
                        data-selected={isSelected}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-sm font-medium">
                          {feature.name}
                        </span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {feature.slug}
                        </p>
                        {feature.description && (
                          <p className="text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {selectedSlugs.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedSlugs.length} feature(s) selected
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedSlugs.length === 0}
            >
              {isSubmitting ? "Granting..." : "Grant Permissions"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
