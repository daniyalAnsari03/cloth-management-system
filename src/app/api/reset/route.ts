import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.confirm !== "RESET") {
      return NextResponse.json({ error: "Type RESET to confirm" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.ledgerEntry.deleteMany(),
      prisma.sale.deleteMany(),
      prisma.payment.deleteMany(),
      prisma.production.deleteMany(),
      prisma.expense.deleteMany(),
      prisma.shop.deleteMany(),
      prisma.fabricType.deleteMany(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Master reset failed:", error);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
