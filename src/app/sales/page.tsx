import { getSales, getShops, createSale } from "@/lib/actions/sales";
import { getFabricTypes } from "@/lib/actions/production";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency, formatDate, formatGaz } from "@/lib/utils";
import { SalesForm } from "./SalesForm";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteSale } from "@/lib/actions/sales";

export default async function SalesPage() {
  const [sales, shops, fabricTypes] = await Promise.all([
    getSales(),
    getShops(),
    getFabricTypes(),
  ]);

  const totalRevenue = sales.reduce(
    (s, sale) => s + sale.gaz * sale.salePricePerGaz,
    0
  );
  const totalProfit = sales.reduce(
    (s, sale) => s + sale.gaz * (sale.salePricePerGaz - sale.costPerGaz),
    0
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in-down">
        <div>
          <h1 className="heading-page text-text-primary">
            Sales
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Record sales to shops
          </p>
        </div>
        <SalesForm shops={shops} fabricTypes={fabricTypes} />
      </div>

      <ScrollReveal animation="reveal-up" delay={100}>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms backwards" }}>
            <p className="text-sm text-text-muted">Total Revenue</p>
            <p className="stat-value text-text-primary">
              {formatCurrency(totalRevenue)}
            </p>
          </Card>
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms backwards" }}>
            <p className="text-sm text-text-muted">Gross Profit</p>
            <p className="stat-value text-green-400">
              {formatCurrency(totalProfit)}
            </p>
          </Card>
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 160ms backwards" }}>
            <p className="text-sm text-text-muted">Total Transactions</p>
            <p className="stat-value text-text-primary">
              {sales.length}
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
                  <th className="table-header">Fabric</th>
                  <th className="table-header">Gaz</th>
                  <th className="table-header">Rate/Gaz</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Profit</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
              {sales.map((s, i) => {
                const amount = s.gaz * s.salePricePerGaz;
                const profit = s.gaz * (s.salePricePerGaz - s.costPerGaz);
                return (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 row-enter"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <td className="table-cell text-text-secondary">
                      {formatDate(s.date)}
                    </td>
                    <td className="table-cell font-medium text-text-primary">
                      {s.shop.name}
                    </td>
                    <td className="table-cell text-text-secondary">
                      {s.fabricType.name}
                    </td>
                    <td className="table-cell text-text-secondary">
                      {formatGaz(s.gaz)}
                    </td>
                    <td className="table-cell text-text-secondary">
                      {formatCurrency(s.salePricePerGaz)}
                    </td>
                    <td className="table-cell font-medium text-text-primary">
                      {formatCurrency(amount)}
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          profit >= 0 ? "text-green-400" : "text-red-400"
                        }
                      >
                        {formatCurrency(profit)}
                      </span>
                    </td>
                    <td className="py-3">
                      <DeleteButton
                        id={s.id}
                        action={deleteSale}
                        message="Delete this sale (ledger will be updated)?"
                      />
                    </td>
                  </tr>
                );
              })}
              {sales.length === 0 && (
                <tr className="row-enter">
                  <td colSpan={8} className="py-8 text-center text-text-muted">
                    No sales recorded yet.
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
