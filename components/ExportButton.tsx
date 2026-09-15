"use client";

import * as XLSX from "xlsx";
import type { Estabelecimento } from "@/lib/supabase";

const CATEGORY_LABEL: Record<string, string> = {
  supermercado: "Supermercado",
  hotel: "Hotel / Pousada",
};

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  ja_e_cliente: "Já é cliente",
  nao_atende: "Não atende ao perfil",
  descartado: "Descartado",
};

function agora(): string {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function ExportButton({ dados }: { dados: Estabelecimento[] }) {
  function handleExport() {
    const timestamp = agora();

    const linhas = dados.map((item) => ({
      Nome: item.nome,
      Categoria: CATEGORY_LABEL[item.categoria] ?? item.categoria,
      Telefone: item.telefone || "",
      Endereço: item.endereco || "",
      Latitude: item.latitude,
      Longitude: item.longitude,
      Status: STATUS_LABEL[item.status_revisao] ?? item.status_revisao,
      Observações: item.observacoes || "",
      "Encontrado em": new Date(item.data_encontrado).toLocaleDateString("pt-BR"),
    }));

    const cabecalho = [[`Prospecção Brasileira — atualizado em ${timestamp}`], []];
    const worksheet = XLSX.utils.aoa_to_sheet(cabecalho);
    XLSX.utils.sheet_add_json(worksheet, linhas, { origin: "A3" });

    worksheet["!cols"] = [
      { wch: 32 }, // Nome
      { wch: 16 }, // Categoria
      { wch: 18 }, // Telefone
      { wch: 34 }, // Endereço
      { wch: 12 }, // Latitude
      { wch: 12 }, // Longitude
      { wch: 18 }, // Status
      { wch: 30 }, // Observações
      { wch: 14 }, // Encontrado em
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prospecção");

    const dataArquivo = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `prospeccao-brasileira-${dataArquivo}.xlsx`);
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-full bg-tangerine px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-tangerinedark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
    >
      Baixar planilha
    </button>
  );
}
