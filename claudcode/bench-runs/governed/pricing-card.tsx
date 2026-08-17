import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export function PricingCard() {
  const tiers = [
    { name: "Starter", price: "$9", features: ["1 project", "Community support"] },
    { name: "Pro", price: "$29", features: ["Unlimited projects", "Priority support"] },
    { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Dedicated success manager"] },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {tiers.map((tier) => (
        <Card key={tier.name} elevation="raised">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
            <p className="mt-2 text-3xl font-bold text-foreground">{tier.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {tier.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </CardHeader>
          <CardFooter>
            <Button variant="default" size="md" className="w-full">
              Choose {tier.name}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
