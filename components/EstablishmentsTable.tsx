"use client";

import { useState } from "react";
import {
  atualizarRevisao,
  type Estabelecimento,
  type StatusRevisao,
} from "@/lib/supabase";

const CATEGORY_LABEL: Record<string, string> = {
  supermercado: "Supermercado",
  hotel: "Hotel / Pousada",
};

const CATEGORY_DOT: Record<string, string> = {
  supermercado: "bg-tangerine",
  hotel: "bg-teal",
};

const STATUS_OPTIONS: { value: StatusRevisao; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "ja_e_cliente", label: "Já é cliente" },
  { value: "nao_atende", label: "Não atende ao perfil" },
  { value: "descartado", label: "Descartado" },
];

const STATUS_STYLE: Record<string, string> = {
  novo: "bg-tangerine/10 text-tangerinedark",
  ja_e_cliente: "bg-forest/10 text-forest",
  nao_atende: "bg-line text-ink/60",
  descartado: "bg-line text-ink/40",
};

function RowActions({ item }: { item: Estabelecimento }) {
  const [status, setStatus] = useState<StatusRevisao>(item.status_revisao);
  const [observacoes, setObservacoes] = useState(item.observacoes ?? "");
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  async function salvarStatus(novoStatus: StatusRevisao) {
    setStatus(novoStatus);
    setSalvando(true);
    setSalvo(false);
    const ok = await atualizarRevisao(item.id, novoStatus, observacoes);
    setSalvando(false);
    if (ok) {
      setSalvo(true);
      setTimeout(() => setSalvo(false), 1500);
    }
  }

  async function salvarObservacoes() {
    setSalvando(true);
    setSalvo(false);
    const ok = await atualizarRevisao(item.id, status, observacoes);
    setSalvando(false);
    if (ok) {
      setSalvo(true);
      setTimeout(() => setSalvo(false), 1500);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => salvarStatus(e.target.value as StatusRevisao)}
          className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[status] ?? "bg-line text-ink/60"}`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {salvando && <span className="text-[11px] text-ink/40">salvando…</span>}
        {salvo && <span className="text-[11px] text-forest">salvo ✓</span>}
      </div>
      <input
        type="text"
        placeholder="Observação (opcional)"
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
        onBlur={salvarObservacoes}
        className="w-full rounded-md border border-line bg-white px-2 py-1 text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-1 focus:ring-tangerine"
      />
    </div>
  );
}

export default function EstablishmentsTable({
  dados,
}: {
  dados: Estabelecimento[];
}) {
  if (dados.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink/60">
        Nenhum estabelecimento encontrado ainda. O agente roda toda segunda-feira.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white/60">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
            <th className="px-5 py-3 font-medium">Nome</th>
            <th className="px-5 py-3 font-medium">Categoria</th>
            <th className="px-5 py-3 font-medium">Telefone</th>
            <th className="px-5 py-3 font-medium">Revisão</th>
            <th className="px-5 py-3 font-medium">Encontrado em</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id} className="border-b border-line/70 last:border-0">
              <td className="px-5 py-3.5 align-top font-medium text-ink">
                {item.nome}
              </td>
              <td className="px-5 py-3.5 align-top text-ink/80">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${CATEGORY_DOT[item.categoria] ?? "bg-ink/40"}`}
                  />
                  {CATEGORY_LABEL[item.categoria] ?? item.categoria}
                </span>
              </td>
              <td className="px-5 py-3.5 align-top text-ink/70">
                {item.telefone || "—"}
              </td>
              <td className="px-5 py-3.5 align-top">
                <RowActions item={item} />
              </td>
              <td className="px-5 py-3.5 align-top text-ink/60">
                {new Date(item.data_encontrado).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
