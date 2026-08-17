import { Button } from "@/components/ui/button";

export function SettingsForm() {
  return (
    <form className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground">Name</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-muted px-3 py-2 text-sm text-foreground"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border border-muted px-3 py-2 text-sm text-foreground"
        />
      </div>
      <Button type="submit" variant="default" size="md">
        Save
      </Button>
    </form>
  );
}
