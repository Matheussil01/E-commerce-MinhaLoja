import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, orders, topProducts] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({ select: { total: true } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  const topProductsWithNames = await Promise.all(
    topProducts.map(async (p) => {
      const product = await prisma.product.findUnique({
        where: { id: p.productId },
      });
      return { name: product?.name ?? "Produto removido", quantity: p._sum.quantity ?? 0 };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Faturamento total</p>
          <p className="text-2xl font-bold mt-1">{formatPrice(revenue)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Pedidos</p>
          <p className="text-2xl font-bold mt-1">{totalOrders}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Produtos cadastrados</p>
          <p className="text-2xl font-bold mt-1">{totalProducts}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Produtos mais vendidos</h2>
        {topProductsWithNames.length === 0 ? (
          <p className="text-slate-500 text-sm">Ainda não há vendas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {topProductsWithNames.map((p, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="font-medium">{p.quantity} vendidos</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
