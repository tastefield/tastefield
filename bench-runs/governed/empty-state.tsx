import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-muted" />
      <h3 className="mt-4 text-lg font-medium text-foreground">No projects yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Projects you create will show up here.
      </p>
      <Button variant="default" size="md" className="mt-6">
        Create a project
      </Button>
    </div>
  );
}
