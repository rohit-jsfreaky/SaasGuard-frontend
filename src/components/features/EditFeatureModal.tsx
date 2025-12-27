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
import { Textarea } from "@/components/ui/textarea";
import { useFeaturesModalStore } from "@/store/features-modal.store";
import { useFeaturesStore } from "@/store/features.store";
import { validateName } from "@/utils/validators";
import { useState, useEffect } from "react";

export function EditFeatureModal() {
  const { isOpen, type, data, closeModal } = useFeaturesModalStore();
  const updateFeature = useFeaturesStore((state) => state.updateFeature);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && type === "edit" && !!data;

  useEffect(() => {
    if (isModalOpen && data) {
      setName(data.name);
      setDescription(data.description || "");
      setErrors({});
    }
  }, [isModalOpen, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    const nameError = validateName(name);

    if (nameError) {
      setErrors({ name: nameError });
      return;
    }

    setIsSubmitting(true);
    const success = await updateFeature(data.id, {
      name,
      description,
    });
    setIsSubmitting(false);

    if (success) {
      closeModal();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Feature</DialogTitle>
          <DialogDescription>
            Update feature details. The slug cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input
              id="edit-slug"
              value={data?.slug || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Slug cannot be changed after creation.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
