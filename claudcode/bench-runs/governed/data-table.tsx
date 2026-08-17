const invoices = [
  { id: "INV-001", customer: "Acme Co", amount: "$120.00", status: "Paid" },
  { id: "INV-002", customer: "Globex", amount: "$430.00", status: "Overdue" },
  { id: "INV-003", customer: "Initech", amount: "$75.00", status: "Pending" },
];

// No dedicated status-badge component exists in this system yet, so this stays
// on semantic tokens rather than inventing a variant or reaching for the raw
// Tailwind palette (no-arbitrary-color-utility / no-invented-variants).
const statusStyles: Record<string, string> = {
  Paid: "bg-muted text-foreground",
  Overdue: "bg-destructive text-primary-foreground",
  Pending: "bg-muted text-muted-foreground",
};

export function InvoiceTable() {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-muted text-muted-foreground">
          <th className="py-2">Invoice</th>
          <th className="py-2">Customer</th>
          <th className="py-2">Amount</th>
          <th className="py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id} className="border-b border-muted">
            <td className="py-3 text-foreground">{inv.id}</td>
            <td className="py-3 text-foreground">{inv.customer}</td>
            <td className="py-3 text-foreground">{inv.amount}</td>
            <td className="py-3">
              <span className={`rounded-md px-2 py-1 text-xs font-medium ${statusStyles[inv.status]}`}>
                {inv.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
