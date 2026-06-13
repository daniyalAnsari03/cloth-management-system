import { getPayments } from "@/lib/actions/payments";
import { getShops } from "@/lib/actions/sales";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentsForm } from "./PaymentsForm";
import { DeleteButton } from "@/components/DeleteButton";
import { deletePayment } from "@/lib/actions/payments";

export default async function PaymentsPage() {
  const [payments, shops] = await Promise.all([getPayments(), getShops()]);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in-down">
        <div>
          <h1 className="heading-page text-text-primary">
            Payments
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Record payments received from shops
          </p>
        </div>
        <PaymentsForm shops={shops} />
      </div>

      <ScrollReveal animation="reveal-up" delay={100}>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms backwards" }}>
            <p className="text-sm text-text-muted">Total Collected</p>
            <p className="stat-value text-green-400">
              {formatCurrency(totalCollected)}
            </p>
          </Card>
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms backwards" }}>
            <p className="text-sm text-text-muted">Total Transactions</p>
            <p className="stat-value text-text-primary">
              {payments.length}
            </p>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-up" delay={200}>
        <Card className="!p-0">
          <div className="table-wrapper">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead>
                <tr className="border-b border-border-light text-xs uppercase text-text-muted">
                  <th className="table-header">Date</th>
                  <th className="table-header">Shop</th>
                  <th className="table-header">Mode</th>
                  <th className="table-header">Reference</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Notes</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0 row-enter"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <td className="table-cell text-text-secondary">
                      {formatDate(p.date)}
                    </td>
                    <td className="table-cell font-medium text-text-primary">
                      {p.shop.name}
                    </td>
                    <td className="table-cell">
                      <span className="inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium capitalize text-blue-400">
                        {p.mode.replace("_", " ")}
                      </span>
                    </td>
                    <td className="table-cell text-text-muted">
                      {p.reference ?? "—"}
                    </td>
                    <td className="table-cell font-medium text-green-400">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="table-cell text-text-muted">
                      {p.notes ?? "—"}
                    </td>
                    <td className="py-3">
                      <DeleteButton
                        id={p.id}
                        action={deletePayment}
                        message="Delete this payment (ledger will update)?"
                      />
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-muted">
                      No payments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
