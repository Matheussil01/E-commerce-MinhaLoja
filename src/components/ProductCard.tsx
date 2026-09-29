import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-square bg-slate-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="p-3">
        <span className="text-xs text-brand-600 font-medium">{product.category}</span>
        <h3 className="font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
        <p className="text-lg font-bold text-slate-900 mt-1">
          {formatPrice(product.price)}
        </p>
        {product.stock === 0 && (
          <span className="text-xs text-red-500 font-medium">Esgotado</span>
        )}
      </div>
    </Link>
  );
}
