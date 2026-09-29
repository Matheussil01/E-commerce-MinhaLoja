import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  return NextResponse.json(product);
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === "ADMIN";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const product = await prisma.product.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
