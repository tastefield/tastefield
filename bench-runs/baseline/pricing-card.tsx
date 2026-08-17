export function PricingCard() {
  const tiers = [
    { name: "Starter", price: "$9", features: ["1 project", "Community support"] },
    { name: "Pro", price: "$29", features: ["Unlimited projects", "Priority support"] },
    { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Dedicated success manager"] },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 p-[24px]">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        >
          <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{tier.price}</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {tier.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Unlock this plan
          </button>
        </div>
      ))}
    </div>
  );
}
