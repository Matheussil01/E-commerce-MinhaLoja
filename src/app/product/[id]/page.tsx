import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });

  if (!product) notFound();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative w-full aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      <div>
        <span className="text-sm text-brand-600 font-medium">{product.category}</span>
        <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
        <p className="text-3xl font-bold text-slate-900 mt-4">
          {formatPrice(product.price)}
        </p>
        <p className="text-slate-600 mt-4 leading-relaxed">{product.description}</p>
        <p className="text-sm text-slate-500 mt-2">
          {product.stock > 0
            ? `${product.stock} unidades em estoque`
            : "Sem estoque no momento"}
        </p>

        <div className="mt-6 max-w-sm">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
