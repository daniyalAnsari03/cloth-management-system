import { prisma } from "@/lib/prisma";
import { Card, StatCard } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency, formatDate, formatGaz } from "@/lib/utils";
import { Factory, ShoppingCart, Store, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const [prodAgg, sales, expAgg, shopCount] = await Promise.all([
    prisma.production.aggregate({ _sum: { gaz: true } }),
    prisma.sale.findMany({
      include: { shop: true, fabricType: true },
      orderBy: { date: "desc" },
    }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.shop.count(),
  ]);

  const produced = prodAgg._sum.gaz ?? 0;
  const sold = sales.reduce((s, sale) => s + sale.gaz, 0);
  const stock = produced - sold;
  const revenue = sales.reduce((s, sale) => s + sale.gaz * sale.salePricePerGaz, 0);
  const profit = sales.reduce((s, sale) => s + sale.gaz * (sale.salePricePerGaz - sale.costPerGaz), 0);
  const expenses = expAgg._sum.amount ?? 0;
  const netProfit = profit - expenses;
  const recentSales = sales.slice(0, 5);

  return (
    <div>
      <div className="mb-6 animate-fade-in-down">
        <h1 className="heading-page text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">
          Overview of your Banarsi fabric business
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms backwards" }}>
          <StatCard label="Stock Available" value={formatGaz(stock)} icon={<Factory className="h-5 w-5" />} />
        </div>
        <div style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms backwards" }}>
          <StatCard label="Total Revenue" value={formatCurrency(revenue)} icon={<TrendingUp className="h-5 w-5" />} />
        </div>
        <div style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 160ms backwards" }}>
          <StatCard label="Gross Profit" value={formatCurrency(profit)} icon={<ShoppingCart className="h-5 w-5" />} />
        </div>
        <div style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 240ms backwards" }}>
          <StatCard label="Active Shops" value={String(shopCount)} icon={<Store className="h-5 w-5" />} />
        </div>
      </div>

      <ScrollReveal animation="reveal-up" delay={300}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Recent Sales">
            {recentSales.length === 0 ? (
              <p className="text-sm text-text-muted">No sales yet.</p>
            ) : (
              <div className="space-y-3">
                {recentSales.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0 row-enter" style={{ animation: `fade-in-up 400ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms backwards` }}>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{s.shop.name}</p>
                      <p className="text-xs text-text-muted">{formatGaz(s.gaz)} {s.fabricType.name} • {formatDate(s.date)}</p>
                    </div>
                    <p className="text-sm font-semibold text-text-primary">{formatCurrency(s.gaz * s.salePricePerGaz)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <ScrollReveal animation="reveal-up" delay={400}>
            <Card title="Profit Summary">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Revenue</span>
                  <span className="font-medium text-text-primary">{formatCurrency(revenue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Gross Profit</span>
                  <span className="font-medium text-green-400">{formatCurrency(profit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Expenses</span>
                  <span className="font-medium text-red-400">{formatCurrency(expenses)}</span>
                </div>
                <div className="gold-divider" />
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-text-primary">Net Profit</span>
                  <span className={netProfit >= 0 ? "text-green-400" : "text-red-400"}>{formatCurrency(netProfit)}</span>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </ScrollReveal>
    </div>
  );
}
