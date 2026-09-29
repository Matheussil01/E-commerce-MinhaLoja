"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    category: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao criar produto");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Novo produto</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Nome do produto"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
        <textarea
          required
          placeholder="Descrição"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="number"
            step="0.01"
            placeholder="Preço"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
          <input
            required
            type="number"
            placeholder="Estoque"
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>
        <input
          required
          placeholder="URL da imagem"
          value={form.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
        <input
          required
          placeholder="Categoria"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg"
        >
          {loading ? "Salvando..." : "Criar produto"}
        </button>
      </form>
    </div>
  );
}
