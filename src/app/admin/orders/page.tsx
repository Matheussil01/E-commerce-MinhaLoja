import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-slate-500">Nenhum pedido registrado ainda.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <details
              key={order.id}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <summary className="flex justify-between items-center cursor-pointer">
                <span>
                  <span className="font-semibold">#{order.id.slice(-8)}</span>{" "}
                  <span className="text-slate-500 text-sm">
                    · {order.user.name} · {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
                    {statusLabels[order.status] ?? order.status}
                  </span>
                  <span className="font-bold">{formatPrice(order.total)}</span>
                </span>
              </summary>

              <ul className="mt-3 text-sm text-slate-600 space-y-1 border-t border-slate-100 pt-3">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.product.name} — {formatPrice(item.price)}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500 mt-2">Endereço: {order.address}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
