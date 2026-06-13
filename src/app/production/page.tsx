import { getProductions, getFabricTypes } from "@/lib/actions/production";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency, formatDate, formatGaz } from "@/lib/utils";
import { ProductionForm } from "./ProductionForm";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteProduction } from "@/lib/actions/production";

export default async function ProductionPage() {
  const [productions, fabricTypes] = await Promise.all([
    getProductions(),
    getFabricTypes(),
  ]);

  const totalGaz = productions.reduce((s, p) => s + p.gaz, 0);
  const totalCost = productions.reduce((s, p) => s + p.gaz * p.costPerGaz, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in-down">
          <h1 className="heading-page text-text-primary">
            Production
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Track fabric production entries
          </p>
        </div>
        <ProductionForm fabricTypes={fabricTypes} />
      </div>

      <ScrollReveal animation="reveal-up" delay={100}>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="row-enter">
            <p className="text-sm text-text-muted">Total Produced</p>
            <p className="stat-value text-text-primary">
              {formatGaz(totalGaz)}
            </p>
          </Card>
          <Card className="row-enter" style={{ animationDelay: "80ms" }}>
            <p className="text-sm text-text-muted">Total Batches</p>
            <p className="stat-value text-text-primary">
              {productions.length}
            </p>
          </Card>
          <Card className="row-enter" style={{ animationDelay: "160ms" }}>
            <p className="text-sm text-text-muted">Total Investment</p>
            <p className="stat-value text-text-primary">
              {formatCurrency(totalCost)}
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
                  <th className="table-header">Fabric Type</th>
                  <th className="table-header">Gaz</th>
                  <th className="table-header">Cost/Gaz</th>
                  <th className="table-header">Total Cost</th>
                  <th className="table-header">Notes</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productions.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0 row-enter"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <td className="table-cell text-text-secondary">
                      {formatDate(p.date)}
                    </td>
                    <td className="table-cell font-medium text-text-primary">
                      {p.fabricType.name}
                    </td>
                    <td className="table-cell text-text-secondary">
                      {formatGaz(p.gaz)}
                    </td>
                    <td className="table-cell text-text-secondary">
                      {formatCurrency(p.costPerGaz)}
                    </td>
                    <td className="table-cell font-medium text-text-primary">
                      {formatCurrency(p.gaz * p.costPerGaz)}
                    </td>
                    <td className="table-cell text-text-muted">{p.notes ?? "—"}</td>
                    <td className="py-3">
                      <DeleteButton
                        id={p.id}
                        action={deleteProduction}
                        message="Delete this production entry?"
                      />
                    </td>
                  </tr>
                ))}
                {productions.length === 0 && (
                  <tr className="row-enter">
                    <td
                      colSpan={7}
                      className="py-8 text-center text-text-muted"
                    >
                      No production entries yet. Add your first one.
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
