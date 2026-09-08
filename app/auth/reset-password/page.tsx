"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "../../../lib/supabase-browser";
import { FaLock } from "react-icons/fa";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("No se pudo actualizar la contraseña. El link puede haber expirado.");
      setLoading(false);
    } else {
      setOk(true);
      setTimeout(() => router.push("/admin"), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1F3A] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="flex justify-center mb-10">
          <Image
            src="/logo-marquez.png"
            alt="MarQuez Negocios Inmobiliarios"
            width={240}
            height={120}
            className="h-20 w-auto object-contain"
            priority
          />
        </div>

        <div className="bg-[#102A4C] rounded-2xl p-8 border border-white/10 shadow-xl">
          <h2 className="text-white text-xl font-semibold mb-2">
            Nueva contraseña
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Ingresá tu nueva contraseña para acceder al panel.
          </p>

          {ok ? (
            <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm text-center">
              ✓ Contraseña actualizada. Redirigiendo al panel...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
              <div>
                <label htmlFor="password" className="block text-sm text-white/60 mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                  <input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm text-white/60 mb-1.5">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                  <input
                    id="confirm"
                    type="password"
                    placeholder="Repetí la contraseña"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:border-orange-500 transition placeholder:text-white/30"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-6 py-3 rounded-lg text-white font-semibold transition mt-2"
              >
                {loading ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
