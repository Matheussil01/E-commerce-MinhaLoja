import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminProductsTable from "@/components/AdminProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link
          href="/admin/products/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Novo produto
        </Link>
      </div>

      <AdminProductsTable products={products} />
    </div>
  );
}
