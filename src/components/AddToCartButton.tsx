"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full bg-slate-200 text-slate-500 font-semibold py-3 rounded-lg cursor-not-allowed"
      >
        Produto esgotado
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition-colors"
    >
      {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
    </button>
  );
}
