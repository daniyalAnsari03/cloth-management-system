import { getStockData } from "@/lib/actions/stock";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency, formatGaz } from "@/lib/utils";

export default async function StockPage() {
  const stockData = await getStockData();
  const totalStock = stockData.reduce((s, f) => s + f.currentStock, 0);
  const totalProduced = stockData.reduce((s, f) => s + f.totalProduced, 0);
  const totalSold = stockData.reduce((s, f) => s + f.totalSold, 0);

  return (
    <div>
      <div className="mb-6 animate-fade-in-down">
        <h1 className="heading-page text-text-primary">Stock</h1>
        <p className="mt-1 text-sm text-text-muted">
          Current inventory — computed from production and sales
        </p>
      </div>

      <ScrollReveal animation="reveal-up" delay={100}>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="row-enter">
            <p className="text-sm text-text-muted">Total Produced</p>
            <p className="stat-value text-text-primary">{formatGaz(totalProduced)}</p>
          </Card>
          <Card className="row-enter" style={{ animationDelay: "80ms" }}>
            <p className="text-sm text-text-muted">Total Sold</p>
            <p className="stat-value text-text-primary">{formatGaz(totalSold)}</p>
          </Card>
          <Card className="row-enter" style={{ animationDelay: "160ms" }}>
            <p className="text-sm text-text-muted">Available Stock</p>
            <p className="stat-value text-green-400">{formatGaz(totalStock)}</p>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-up" delay={200}>
        <Card className="!p-0">
          <div className="table-wrapper">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead>
                <tr className="border-b border-border-light text-xs uppercase text-text-muted">
                  <th className="table-header">Fabric Type</th>
                  <th className="table-header">Total Produced</th>
                  <th className="table-header">Total Sold</th>
                  <th className="table-header">Current Stock</th>
                  <th className="table-header">Avg Cost/Gaz</th>
                </tr>
              </thead>
              <tbody>
                {stockData.length === 0 ? (
                  <tr className="row-enter">
                    <td colSpan={5} className="py-12 text-center text-sm text-text-muted">
                      No stock data available. Add production entries first.
                    </td>
                  </tr>
                ) : (
                  stockData.map((f, i) => (
                    <tr key={f.id} className="border-b border-border last:border-0 transition-colors hover:bg-surface-hover row-enter" style={{ animationDelay: `${i * 80}ms` }}>
                      <td className="table-cell font-medium text-text-primary">{f.name}</td>
                      <td className="table-cell text-text-secondary">{formatGaz(f.totalProduced)}</td>
                      <td className="table-cell text-text-secondary">{formatGaz(f.totalSold)}</td>
                      <td className="table-cell">
                        <span className={`font-medium ${
                          f.currentStock > 0 ? "text-green-400" : f.currentStock === 0 ? "text-text-muted" : "text-red-400"
                        }`}>
                          {formatGaz(f.currentStock)}
                        </span>
                      </td>
                      <td className="table-cell text-text-secondary">
                        {f.avgCost > 0 ? formatCurrency(f.avgCost) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
