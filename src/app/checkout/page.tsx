"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível concluir o pedido");
        return;
      }

      clearCart();
      router.push("/orders");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return <p className="text-center py-20 text-slate-500">Seu carrinho está vazio.</p>;
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Finalizar compra</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Endereço de entrega</label>
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
            placeholder="Rua, número, bairro, cidade - UF"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Número do cartão (simulado — nenhum dado é processado de verdade)
          </label>
          <input
            required
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength={19}
            placeholder="0000 0000 0000 0000"
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between font-bold">
            <span>Total a pagar</span>
            <span>{formatPrice(totalPrice())}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg"
        >
          {loading ? "Processando pagamento..." : "Confirmar pedido"}
        </button>
      </form>
    </div>
  );
}
