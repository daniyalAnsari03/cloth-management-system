import { getExpenses } from "@/lib/actions/expenses";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExpensesForm } from "./ExpensesForm";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteExpense } from "@/lib/actions/expenses";

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in-down">
        <div>
          <h1 className="heading-page text-text-primary">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Track business expenses
          </p>
        </div>
        <ExpensesForm />
      </div>

      <ScrollReveal animation="reveal-up" delay={100}>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms backwards" }}>
            <p className="text-sm text-text-muted">Total Expenses</p>
            <p className="stat-value text-red-400">
              {formatCurrency(totalExpenses)}
            </p>
          </Card>
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms backwards" }}>
            <p className="text-sm text-text-muted">This Month</p>
            <p className="stat-value text-text-primary">
              {formatCurrency(
                expenses
                  .filter(
                    (e) =>
                      new Date(e.date).getMonth() === new Date().getMonth()
                  )
                  .reduce((s, e) => s + e.amount, 0)
              )}
            </p>
          </Card>
        </div>
      </ScrollReveal>

      {Object.keys(byCategory).length > 0 && (
        <ScrollReveal animation="reveal-up" delay={200}>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(byCategory).map(([cat, amt]) => (
              <Card key={cat}>
                <p className="text-xs capitalize text-text-muted">
                  {cat.replace("_", " ")}
                </p>
                <p className="font-display text-lg font-semibold text-text-primary">
                  {formatCurrency(amt)}
                </p>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal animation="reveal-up" delay={300}>
        <Card className="!p-0">
          <div className="table-wrapper">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead>
                <tr className="border-b border-border-light text-xs uppercase text-text-muted">
                  <th className="table-header">Date</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e, i) => (
                  <tr
                    key={e.id}
                    className="border-b border-border last:border-0 row-enter"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <td className="table-cell text-text-secondary">
                      {formatDate(e.date)}
                    </td>
                    <td className="table-cell">
                      <span className="inline-block rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium capitalize text-orange-400">
                        {e.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="table-cell font-medium text-red-400">
                      {formatCurrency(e.amount)}
                    </td>
                    <td className="table-cell text-text-muted">
                      {e.description ?? "—"}
                    </td>
                    <td className="py-3">
                      <DeleteButton
                        id={e.id}
                        action={deleteExpense}
                        message="Delete this expense?"
                      />
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr className="row-enter">
                    <td colSpan={5} className="py-8 text-center text-text-muted">
                      No expenses recorded yet.
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
