"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
  return prisma.expense.findMany({ orderBy: { date: "desc" } });
}

export async function createExpense(formData: FormData) {
  const date = new Date(formData.get("date") as string);
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = (formData.get("description") as string) || null;

  if (!date || !category || !amount) {
    return { error: "All required fields must be filled" };
  }
  if (amount <= 0) return { error: "Amount must be greater than 0" };
  if (date > new Date()) return { error: "Date cannot be in the future" };

  await prisma.expense.create({ data: { date, category, amount, description } });

  revalidatePath("/expenses");
  revalidatePath("/reports");
  return { success: true };
}

export async function deleteExpense(id: number) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/expenses");
  revalidatePath("/reports");
  return { success: true };
}
