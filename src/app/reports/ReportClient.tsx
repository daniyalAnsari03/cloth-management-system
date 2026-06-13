"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ReportData {
  period: { from: string; to: string };
  summary: {
    revenue: number;
    costOfGoods: number;
    grossProfit: number;
    totalExpenses: number;
    netProfit: number;
    produced: number;
  };
  salesCount: number;
  monthlyData: {
    month: string;
    revenue: number;
    cost: number;
    profit: number;
    expenses: number;
  }[];
  shopBreakdown: { name: string; revenue: number; profit: number }[];
  expenseBreakdown: { category: string; amount: number }[];
}

const COLORS = ["#C9A84C", "#8B1A2B", "#22C55E", "#3B82F6", "#D4A843"];

export function ReportClient({
  data,
  from,
  to,
}: {
  data: ReportData;
  from: string;
  to: string;
}) {
  const router = useRouter();
  const s = data.summary;

  function setRange(fromVal: string, toVal: string) {
    const params = new URLSearchParams();
    if (fromVal) params.set("from", fromVal);
    if (toVal) params.set("to", toVal);
    router.push(`/reports?${params.toString()}`);
  }

  function setPreset(preset: string) {
    const now = new Date();
    let fromVal: string, toVal: string;
    if (preset === "thisMonth") {
      fromVal = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      toVal = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
    } else if (preset === "lastMonth") {
      fromVal = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split("T")[0];
      toVal = new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString()
        .split("T")[0];
    } else {
      fromVal = new Date(now.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
      toVal = new Date(now.getFullYear(), 11, 31)
        .toISOString()
        .split("T")[0];
    }
    setRange(fromVal, toVal);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in-down">
        <div>
          <h1 className="heading-page text-text-primary">
            Reports
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Profit & Loss and performance analysis
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3 animate-fade-in-up">
        <button
          onClick={() => setPreset("thisMonth")}
          className="btn btn-secondary !border-border-input !px-3 !py-1.5 !min-h-[36px]"
        >
          This Month
        </button>
        <button
          onClick={() => setPreset("lastMonth")}
          className="btn btn-secondary !border-border-input !px-3 !py-1.5 !min-h-[36px]"
        >
          Last Month
        </button>
        <button
          onClick={() => setPreset("thisYear")}
          className="btn btn-secondary !border-border-input !px-3 !py-1.5 !min-h-[36px]"
        >
          This Year
        </button>
        <div className="hidden sm:block h-5 w-px bg-border" />
        <div className="flex w-full sm:w-auto items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setRange(e.target.value, to)}
            className="flex-1 sm:flex-initial rounded-lg border border-border-input px-3 py-1.5 text-sm min-h-[36px] w-full sm:w-auto"
          />
          <span className="text-sm text-text-muted shrink-0">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setRange(from, e.target.value)}
            className="flex-1 sm:flex-initial rounded-lg border border-border-input px-3 py-1.5 text-sm min-h-[36px] w-full sm:w-auto"
          />
        </div>
      </div>

      <ScrollReveal animation="reveal-up" delay={100}>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms backwards" }}>
            <p className="text-sm text-text-muted">Revenue</p>
            <p className="stat-value text-text-primary">
              {formatCurrency(s.revenue)}
            </p>
          </Card>
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms backwards" }}>
            <p className="text-sm text-text-muted">Gross Profit</p>
            <p className="stat-value text-green-400">
              {formatCurrency(s.grossProfit)}
            </p>
          </Card>
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 160ms backwards" }}>
            <p className="text-sm text-text-muted">Expenses</p>
            <p className="stat-value text-red-400">
              {formatCurrency(s.totalExpenses)}
            </p>
          </Card>
          <Card style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 240ms backwards" }}>
            <p className="text-sm text-text-muted">Net Profit</p>
            <p
              className={`stat-value ${
                s.netProfit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatCurrency(s.netProfit)}
            </p>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-up" delay={200}>
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Trend" style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 320ms backwards" }}>
          {data.monthlyData.length === 0 ? (
            <p className="text-sm text-text-muted">No data for this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#C9A84C"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#8B1A2B"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="profit"
                  name="Profit"
                  fill="#22C55E"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Revenue by Shop" style={{ animation: "card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms backwards" }}>
          {data.shopBreakdown.length === 0 ? (
            <p className="text-sm text-text-muted">No data for this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.shopBreakdown}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {data.shopBreakdown.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-up" delay={300}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Shop Performance" className="!p-0">
          {data.shopBreakdown.length === 0 ? (
            <p className="text-sm text-text-muted">No data.</p>
          ) : (
            <div className="table-wrapper">
              <table className="w-full text-left text-sm min-w-[650px]">
                <thead>
                  <tr className="border-b border-border-light text-xs uppercase text-text-muted">
                    <th className="table-header">Shop</th>
                    <th className="table-header">Revenue</th>
                    <th className="table-header">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {data.shopBreakdown.map((shop) => (
                    <tr
                      key={shop.name}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 pr-3 font-medium text-text-primary">
                        {shop.name}
                      </td>
                      <td className="py-2 pr-3 text-text-secondary">
                        {formatCurrency(shop.revenue)}
                      </td>
                      <td className="py-2 font-medium text-green-400">
                        {formatCurrency(shop.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Expense Breakdown" className="!p-0">
          {data.expenseBreakdown.length === 0 ? (
            <p className="text-sm text-text-muted">No expenses.</p>
          ) : (
            <div className="table-wrapper">
              <table className="w-full text-left text-sm min-w-[650px]">
                <thead>
                  <tr className="border-b border-border-light text-xs uppercase text-text-muted">
                    <th className="table-header">Category</th>
                    <th className="table-header">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenseBreakdown.map((exp) => (
                    <tr
                      key={exp.category}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 pr-3 text-sm capitalize text-text-primary">
                        {exp.category.replace("_", " ")}
                      </td>
                      <td className="py-2 font-medium text-red-400">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      </ScrollReveal>
    </div>
  );
}
