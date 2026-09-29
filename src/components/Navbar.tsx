"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/cartStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);

  // Evita mismatch de hidratação (localStorage só existe no client)
  useEffect(() => setMounted(true), []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-700">
          MinhaLoja
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {isAdmin && (
            <Link href="/admin" className="text-slate-600 hover:text-brand-700">
              Painel Admin
            </Link>
          )}

          {session ? (
            <>
              <Link href="/orders" className="text-slate-600 hover:text-brand-700">
                Meus Pedidos
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-slate-600 hover:text-brand-700"
              >
                Sair ({session.user?.name})
              </button>
            </>
          ) : (
            <Link href="/login" className="text-slate-600 hover:text-brand-700">
              Entrar
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex items-center gap-1 bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700"
          >
            Carrinho
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
