"use client";

import { useState } from "react";
import { adicionarEstabelecimento, type Categoria } from "@/lib/supabase";

export default function AddEstablishmentModal({
  ponto,
  onClose,
  onSaved,
}: {
  ponto: { lat: number; lng: number };
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("supermercado");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(false);

  async function handleSalvar() {
    if (!nome.trim()) return;
    setSalvando(true);
    setErro(false);
    const ok = await adicionarEstabelecimento({
      categoria,
      nome: nome.trim(),
      telefone: telefone.trim(),
      endereco: endereco.trim(),
      latitude: ponto.lat,
      longitude: ponto.lng,
    });
    setSalvando(false);
    if (ok) {
      onSaved();
      onClose();
    } else {
      setErro(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl">
        <h3 className="font-display text-lg text-ink">Adicionar estabelecimento</h3>
        <p className="mt-1 text-xs text-ink/50">
          Local marcado em {ponto.lat.toFixed(5)}, {ponto.lng.toFixed(5)}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">
              Nome *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-tangerine"
              placeholder="Ex: Supermercado Central"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">
              Categoria
            </label>
            <div className="flex gap-2">
              {(
                [
                  { value: "supermercado", label: "Supermercado" },
                  { value: "hotel", label: "Hotel / Pousada" },
                ] as { value: Categoria; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCategoria(opt.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    categoria === opt.value
                      ? "bg-forest text-paper"
                      : "bg-white text-ink/60 border border-line"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">
              Telefone (opcional)
            </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-tangerine"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">
              Endereço (opcional)
            </label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-tangerine"
            />
          </div>
        </div>

        {erro && (
          <p className="mt-3 text-xs text-red-600">
            Não deu pra salvar. Confira sua conexão e tente de novo.
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink/60 hover:bg-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={!nome.trim() || salvando}
            className="rounded-full bg-tangerine px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-tangerinedark disabled:opacity-50"
          >
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
