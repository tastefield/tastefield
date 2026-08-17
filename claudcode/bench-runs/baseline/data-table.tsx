const invoices = [
  { id: "INV-001", customer: "Acme Co", amount: "$120.00", status: "Paid" },
  { id: "INV-002", customer: "Globex", amount: "$430.00", status: "Overdue" },
  { id: "INV-003", customer: "Initech", amount: "$75.00", status: "Pending" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Overdue: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

export function InvoiceTable() {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-gray-500">
          <th className="py-2">Invoice</th>
          <th className="py-2">Customer</th>
          <th className="py-2">Amount</th>
          <th className="py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id} className="border-b border-gray-100">
            <td className="py-3 text-gray-900">{inv.id}</td>
            <td className="py-3 text-gray-900">{inv.customer}</td>
            <td className="py-3 text-gray-900">{inv.amount}</td>
            <td className="py-3">
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[inv.status]}`}>
                {inv.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
