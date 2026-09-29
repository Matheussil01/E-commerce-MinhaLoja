import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getProducts(searchParams: { [key: string]: string | undefined }) {
  return prisma.product.findMany({
    where: {
      ...(searchParams.category ? { category: searchParams.category } : {}),
      ...(searchParams.search
        ? { name: { contains: searchParams.search } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  const products = await prisma.product.findMany({ select: { category: true } });
  return Array.from(new Set(products.map((p) => p.category)));
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <div>
      <div className="bg-brand-700 text-white rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo à MinhaLoja</h1>
        <p className="text-brand-100">
          Projeto de portfólio — carrinho, checkout e painel admin funcionando de ponta a ponta.
        </p>
      </div>

      <form className="flex flex-wrap gap-3 mb-6" method="get">
        <input
          type="text"
          name="search"
          placeholder="Buscar produto..."
          defaultValue={searchParams.search}
          className="border border-slate-300 rounded-lg px-3 py-2 flex-1 min-w-[200px]"
        />
        <select
          name="category"
          defaultValue={searchParams.category ?? ""}
          className="border border-slate-300 rounded-lg px-3 py-2"
        >
          <option value="">Todas categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg"
        >
          Filtrar
        </button>
      </form>

      {products.length === 0 ? (
        <p className="text-slate-500 text-center py-16">
          Nenhum produto encontrado.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
