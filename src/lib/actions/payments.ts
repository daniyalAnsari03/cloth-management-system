"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPayments() {
  return prisma.payment.findMany({
    include: { shop: true },
    orderBy: { date: "desc" },
  });
}

export async function createPayment(formData: FormData) {
  const date = new Date(formData.get("date") as string);
  const shopId = Number(formData.get("shopId"));
  const amount = parseFloat(formData.get("amount") as string);
  const mode = formData.get("mode") as string;
  const reference = (formData.get("reference") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!date || !shopId || !amount || !mode) {
    return { error: "All required fields must be filled" };
  }
  if (amount <= 0) return { error: "Amount must be greater than 0" };
  if (date > new Date()) return { error: "Date cannot be in the future" };

  const lastEntry = await prisma.ledgerEntry.findFirst({
    where: { shopId },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });
  const outstanding = lastEntry?.balanceAfter ?? 0;

  if (amount > outstanding) {
    return {
      error: `Overpayment rejected. Outstanding balance: ₹${outstanding.toFixed(0)}`,
    };
  }

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: { date, shopId, amount, mode, reference, notes },
    });

    const prevBalance = lastEntry?.balanceAfter ?? 0;

    await tx.ledgerEntry.create({
      data: {
        date,
        shopId,
        type: "credit",
        amount,
        balanceAfter: prevBalance - amount,
        referenceType: "payment",
        referenceId: payment.id,
        description: `Payment via ${mode}${reference ? ` (${reference})` : ""}`,
      },
    });
  });

  revalidatePath("/payments");
  revalidatePath("/shops");
  revalidatePath(`/shops/${shopId}/ledger`);
  return { success: true };
}

export async function deletePayment(id: number) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) return { error: "Payment not found" };

  await prisma.$transaction(async (tx) => {
    await tx.ledgerEntry.deleteMany({
      where: { referenceType: "payment", referenceId: id },
    });

    await tx.payment.delete({ where: { id } });

    const entries = await tx.ledgerEntry.findMany({
      where: { shopId: payment.shopId },
      orderBy: [{ date: "asc" }, { id: "asc" }],
    });

    let balance = 0;
    for (const entry of entries) {
      balance += entry.type === "debit" ? entry.amount : -entry.amount;
      await tx.ledgerEntry.update({
        where: { id: entry.id },
        data: { balanceAfter: balance },
      });
    }
  });

  revalidatePath("/payments");
  revalidatePath("/shops");
  return { success: true };
}
