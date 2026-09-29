"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cartStore";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Seu carrinho está vazio.</p>
        <Link href="/" className="text-brand-600 font-medium hover:underline">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Seu carrinho</h1>
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-3"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-slate-600 text-sm">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-lg border border-slate-300 hover:bg-slate-100"
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-lg border border-slate-300 hover:bg-slate-100"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500 text-sm hover:underline ml-2"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 h-fit">
        <h2 className="font-semibold text-lg mb-4">Resumo</h2>
        <div className="flex justify-between text-slate-600 mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice())}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-3 mt-3">
          <span>Total</span>
          <span>{formatPrice(totalPrice())}</span>
        </div>
        <Link
          href="/checkout"
          className="block text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg mt-4"
        >
          Finalizar compra
        </Link>
      </div>
    </div>
  );
}
