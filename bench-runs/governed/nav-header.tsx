import { Button } from "@/components/ui/button";

export function NavHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-muted bg-background px-6">
      <div className="text-lg font-bold text-foreground">Acme</div>
      <nav className="flex gap-6 text-sm text-muted-foreground">
        <a href="/product" className="hover:text-foreground">Product</a>
        <a href="/pricing" className="hover:text-foreground">Pricing</a>
        <a href="/docs" className="hover:text-foreground">Docs</a>
      </nav>
      <Button variant="default" size="sm">
        Sign in
      </Button>
    </header>
  );
}
