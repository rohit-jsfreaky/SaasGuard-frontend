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
import { usePlansModalStore } from "@/store/plans-modal.store";
import { usePlansStore } from "@/store/plans.store";
import { validateName, validateSlug, slugify } from "@/utils/validators";
import { useState, useEffect } from "react";

export function CreatePlanModal() {
  const { isOpen, type, closeModal } = usePlansModalStore();
  const addPlan = usePlansStore((state) => state.addPlan);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && type === "create";

  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setSlug("");
      setDescription("");
      setErrors({});
    }
  }, [isModalOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(newName));
    }
    if (errors.name) setErrors({ ...errors, name: undefined });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    if (errors.slug) setErrors({ ...errors, slug: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(name);
    const slugError = validateSlug(slug);

    if (nameError || slugError) {
      setErrors({
        name: nameError || undefined,
        slug: slugError || undefined,
      });
      return;
    }

    setIsSubmitting(true);
    const success = await addPlan({
      name,
      slug,
      description: description || undefined,
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
          <DialogTitle>Create Plan</DialogTitle>
          <DialogDescription>
            Add a new plan to your organization. Slug will be auto-generated.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Professional Plan"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g. pro"
              className={errors.slug ? "border-destructive" : ""}
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of the plan"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
