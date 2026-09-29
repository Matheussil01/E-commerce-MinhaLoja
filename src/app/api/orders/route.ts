import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const isAdmin = (session.user as any).role === "ADMIN";
  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId: (session.user as any).id },
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { items, address } = body as {
    items: { productId: string; quantity: number }[];
    address: string;
  };

  if (!items?.length || !address) {
    return NextResponse.json(
      { error: "Carrinho vazio ou endereço faltando" },
      { status: 400 }
    );
  }

  // Busca produtos reais no banco para pegar preço e estoque atuais
  // (nunca confiar no preço enviado pelo cliente)
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Estoque insuficiente para ${product?.name ?? "produto"}` },
        { status: 400 }
      );
    }
  }

  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  // Checkout "fake": aqui é onde entraria a integração real de pagamento.
  // Simula sucesso e já cria o pedido como PAID.
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: (session.user as any).id,
        address,
        total,
        status: "PAID",
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json(order, { status: 201 });
}
