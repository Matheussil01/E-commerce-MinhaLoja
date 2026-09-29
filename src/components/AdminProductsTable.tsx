"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/types";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <table className="w-full text-sm bg-white border border-slate-200 rounded-xl overflow-hidden">
      <thead className="bg-slate-50 text-left">
        <tr>
          <th className="p-3">Nome</th>
          <th className="p-3">Categoria</th>
          <th className="p-3">Preço</th>
          <th className="p-3">Estoque</th>
          <th className="p-3"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-t border-slate-100">
            <td className="p-3">{product.name}</td>
            <td className="p-3">{product.category}</td>
            <td className="p-3">{formatPrice(product.price)}</td>
            <td className="p-3">
              {product.stock === 0 ? (
                <span className="text-red-500">Esgotado</span>
              ) : (
                product.stock
              )}
            </td>
            <td className="p-3 text-right">
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-500 hover:underline"
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
