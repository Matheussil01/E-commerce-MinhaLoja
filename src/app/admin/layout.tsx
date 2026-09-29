import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-6">
      <aside className="space-y-1">
        <p className="text-xs uppercase text-slate-400 font-semibold mb-2">
          Painel Admin
        </p>
        <Link
          href="/admin"
          className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-sm font-medium"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/products"
          className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-sm font-medium"
        >
          Produtos
        </Link>
        <Link
          href="/admin/orders"
          className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-sm font-medium"
        >
          Pedidos
        </Link>
      </aside>
      <div>{children}</div>
    </div>
  );
}
