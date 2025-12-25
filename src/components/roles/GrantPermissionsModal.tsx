import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFeatures } from "@/hooks/useFeatures";
import { Search } from "lucide-react";

interface GrantPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingFeatureIds: number[];
  onSubmit: (featureId: number) => Promise<boolean>;
}

export function GrantPermissionsModal({
  open,
  onOpenChange,
  existingFeatureIds,
  onSubmit, // We will just loop call this for simplicity or could refactor to bulk add if API supports
}: GrantPermissionsModalProps) {
  const { features, fetchFeatures } = useFeatures();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFeatures();
      setSelectedIds([]);
      setSearch("");
    }
  }, [open, fetchFeatures]);

  const availableFeatures = features.filter(
    (f) => !existingFeatureIds.includes(f.id)
  );

  const filteredFeatures = availableFeatures.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGrant = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);

    // Sequential add (could utilize Promise.all but might hit rate limits or race conditions if not careful)
    // For safer UX, let's do sequential or Promise.allSettled
    await Promise.all(selectedIds.map((id) => onSubmit(id)));

    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Grant Permissions</DialogTitle>
          <DialogDescription>
            Select features to grant access to this role.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <ScrollArea className="flex-1 min-h-[200px] border rounded-md p-2">
          {filteredFeatures.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground p-4">
              {availableFeatures.length === 0
                ? "All available features already granted."
                : "No matching features found."}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFeatures.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-sm cursor-pointer"
                  onClick={() => handleToggle(f.id)}
                >
                  <Checkbox
                    checked={selectedIds.includes(f.id)}
                    onCheckedChange={() => handleToggle(f.id)}
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleGrant}
            disabled={isSubmitting || selectedIds.length === 0}
          >
            {isSubmitting
              ? "Granting..."
              : `Grant ${selectedIds.length} Permissions`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
