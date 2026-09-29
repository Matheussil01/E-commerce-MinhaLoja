import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
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

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meus pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-slate-500">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">Pedido #{order.id.slice(-8)}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>

              <ul className="text-sm text-slate-600 space-y-1 mb-3">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.product.name}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between font-bold border-t border-slate-100 pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
