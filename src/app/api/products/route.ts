import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, price, stock, imageUrl, category } = body;

  if (!name || !description || price == null || !imageUrl || !category) {
    return NextResponse.json(
      { error: "Campos obrigatórios faltando" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: { name, description, price, stock: stock ?? 0, imageUrl, category },
  });

  return NextResponse.json(product, { status: 201 });
}
