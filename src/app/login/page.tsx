"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha inválidos");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Entrar</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-4 text-center">
        Não tem conta?{" "}
        <Link href="/register" className="text-brand-600 hover:underline">
          Cadastre-se
        </Link>
      </p>

      <div className="mt-6 text-xs text-slate-400 border-t border-slate-200 pt-4">
        <p>Contas de teste (após rodar o seed):</p>
        <p>Admin: admin@loja.com / admin123</p>
        <p>Cliente: cliente@teste.com / cliente123</p>
      </div>
    </div>
  );
}
