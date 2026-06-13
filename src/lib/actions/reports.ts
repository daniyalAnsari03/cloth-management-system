"use server";

import { prisma } from "@/lib/prisma";

export async function getReportData(
  from: string,
  to: string
) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  const sales = await prisma.sale.findMany({
    where: { date: { gte: fromDate, lte: toDate } },
    include: { shop: true, fabricType: true },
    orderBy: { date: "asc" },
  });

  const expenses = await prisma.expense.findMany({
    where: { date: { gte: fromDate, lte: toDate } },
    orderBy: { date: "asc" },
  });

  const productions = await prisma.production.aggregate({
    _sum: { gaz: true },
    where: { date: { gte: fromDate, lte: toDate } },
  });

  const revenue = sales.reduce(
    (s, sale) => s + sale.gaz * sale.salePricePerGaz,
    0
  );
  const costOfGoods = sales.reduce(
    (s, sale) => s + sale.gaz * sale.costPerGaz,
    0
  );
  const grossProfit = revenue - costOfGoods;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;
  const produced = productions._sum.gaz ?? 0;

  const monthlyData = getMonthlyData(sales, expenses);

  const shopBreakdown = getShopBreakdown(sales);
  const expenseBreakdown = getExpenseBreakdown(expenses);

  return {
    period: { from, to },
    summary: { revenue, costOfGoods, grossProfit, totalExpenses, netProfit, produced },
    salesCount: sales.length,
    monthlyData,
    shopBreakdown,
    expenseBreakdown,
  };
}

function getMonthlyData(
  sales: { date: Date; gaz: number; salePricePerGaz: number; costPerGaz: number }[],
  expenses: { date: Date; amount: number }[]
) {
  const months: Record<
    string,
    { revenue: number; cost: number; profit: number; expenses: number }
  > = {};

  for (const sale of sales) {
    const key = `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, "0")}`;
    if (!months[key]) months[key] = { revenue: 0, cost: 0, profit: 0, expenses: 0 };
    months[key].revenue += sale.gaz * sale.salePricePerGaz;
    months[key].cost += sale.gaz * sale.costPerGaz;
    months[key].profit = months[key].revenue - months[key].cost;
  }

  for (const expense of expenses) {
    const key = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, "0")}`;
    if (!months[key]) months[key] = { revenue: 0, cost: 0, profit: 0, expenses: 0 };
    months[key].expenses += expense.amount;
  }

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));
}

function getShopBreakdown(
  sales: { shop: { name: string }; gaz: number; salePricePerGaz: number; costPerGaz: number }[]
) {
  const shops: Record<string, { revenue: number; profit: number }> = {};
  for (const sale of sales) {
    if (!shops[sale.shop.name]) shops[sale.shop.name] = { revenue: 0, profit: 0 };
    shops[sale.shop.name].revenue += sale.gaz * sale.salePricePerGaz;
    shops[sale.shop.name].profit += sale.gaz * (sale.salePricePerGaz - sale.costPerGaz);
  }
  return Object.entries(shops)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}

function getExpenseBreakdown(expenses: { category: string; amount: number }[]) {
  const cats: Record<string, number> = {};
  for (const expense of expenses) {
    cats[expense.category] = (cats[expense.category] ?? 0) + expense.amount;
  }
  return Object.entries(cats)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}
