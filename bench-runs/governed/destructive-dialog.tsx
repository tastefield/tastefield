import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export function DeleteAccountDialog() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-foreground/50">
      <Card elevation="raised" className="w-96">
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Delete account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This will permanently delete your account and all of its data. This action cannot be undone.
          </p>
        </CardHeader>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="secondary" size="md">
            Cancel
          </Button>
          <Button variant="destructive" size="md">
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
