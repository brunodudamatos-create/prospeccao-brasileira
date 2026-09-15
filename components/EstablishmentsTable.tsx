"use client";

import type { Estabelecimento } from "@/lib/supabase";

const CATEGORY_LABEL: Record<string, string> = {
  supermercado: "Supermercado",
  hotel: "Hotel / Pousada",
};

const CATEGORY_DOT: Record<string, string> = {
  supermercado: "bg-tangerine",
  hotel: "bg-teal",
};

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  ja_e_cliente: "Já é cliente",
  nao_atende: "Não atende ao perfil",
  descartado: "Descartado",
};

const STATUS_STYLE: Record<string, string> = {
  novo: "bg-tangerine/10 text-tangerinedark",
  ja_e_cliente: "bg-forest/10 text-forest",
  nao_atende: "bg-line text-ink/60",
  descartado: "bg-line text-ink/40",
};

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
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
            <th className="px-5 py-3 font-medium">Nome</th>
            <th className="px-5 py-3 font-medium">Categoria</th>
            <th className="px-5 py-3 font-medium">Telefone</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Encontrado em</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id} className="border-b border-line/70 last:border-0">
              <td className="px-5 py-3.5 font-medium text-ink">{item.nome}</td>
              <td className="px-5 py-3.5 text-ink/80">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${CATEGORY_DOT[item.categoria] ?? "bg-ink/40"}`}
                  />
                  {CATEGORY_LABEL[item.categoria] ?? item.categoria}
                </span>
              </td>
              <td className="px-5 py-3.5 text-ink/70">{item.telefone || "—"}</td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                    STATUS_STYLE[item.status_revisao] ?? "bg-line text-ink/60"
                  }`}
                >
                  {STATUS_LABEL[item.status_revisao] ?? item.status_revisao}
                </span>
              </td>
              <td className="px-5 py-3.5 text-ink/60">
                {new Date(item.data_encontrado).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
