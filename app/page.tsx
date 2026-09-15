/**
 * v1.2 — 2026-09-15
 * Mudança: nota informativa movida pra baixo do mapa (era logo abaixo do
 * cabeçalho) e texto encurtado/ajustado; rodapé passou a citar o
 * Departamento de Engenharia.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { fetchEstabelecimentos, type Estabelecimento } from "@/lib/supabase";
import EstablishmentsTable from "@/components/EstablishmentsTable";
import ExportButton from "@/components/ExportButton";
import AddEstablishmentModal from "@/components/AddEstablishmentModal";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-ink/50">
      Carregando mapa…
    </div>
  ),
});

type Filtro = "todos" | "supermercado" | "hotel";

function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function Home() {
  const [dados, setDados] = useState<Estabelecimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [modoAdicionar, setModoAdicionar] = useState(false);
  const [pontoNovo, setPontoNovo] = useState<{ lat: number; lng: number } | null>(
    null
  );

  function recarregar() {
    fetchEstabelecimentos().then((res) => {
      setDados(res);
      setCarregando(false);
    });
  }

  useEffect(() => {
    recarregar();
  }, []);

  const dadosFiltrados = useMemo(() => {
    if (filtro === "todos") return dados;
    return dados.filter((item) => item.categoria === filtro);
  }, [dados, filtro]);

  const ultimaAtualizacao = useMemo(() => {
    if (dados.length === 0) return null;
    const maisRecente = dados.reduce((acc, item) =>
      new Date(item.data_atualizado) > new Date(acc.data_atualizado) ? item : acc
    );
    return formatarDataHora(maisRecente.data_atualizado);
  }, [dados]);

  const totalSupermercados = dados.filter((d) => d.categoria === "supermercado").length;
  const totalHoteis = dados.filter((d) => d.categoria === "hotel").length;

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line bg-forest text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-3xl italic tracking-tight sm:text-4xl">
              Prospecção Brasileira
            </p>
            <p className="mt-2 max-w-md text-sm text-paper/70">
              Supermercados e hotéis identificados em Cuiabá, Várzea Grande e
              Chapada dos Guimarães, para avaliação da equipe comercial.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="text-xs text-paper/60">
              {ultimaAtualizacao
                ? `Atualizado em ${ultimaAtualizacao}`
                : "Carregando última atualização…"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setModoAdicionar((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                  modoAdicionar
                    ? "border-tangerine bg-tangerine text-white"
                    : "border-paper/30 text-paper hover:bg-paper/10"
                }`}
              >
                {modoAdicionar ? "Cancelar" : "Adicionar no mapa"}
              </button>
              <ExportButton dados={dados} />
            </div>
          </div>
        </div>
        {modoAdicionar && (
          <div className="mx-auto max-w-6xl px-6 pb-4">
            <p className="rounded-full bg-tangerine/20 px-4 py-2 text-center text-sm text-paper">
              Clique no mapa no ponto onde fica o estabelecimento
            </p>
          </div>
        )}
      </header>

      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-line bg-white/60 px-4 py-3">
            <p className="text-2xl font-semibold text-ink">{dados.length}</p>
            <p className="text-xs text-ink/60">No total</p>
          </div>
          <div className="rounded-2xl border border-line bg-white/60 px-4 py-3">
            <p className="text-2xl font-semibold text-tangerinedark">
              {totalSupermercados}
            </p>
            <p className="text-xs text-ink/60">Supermercados</p>
          </div>
          <div className="rounded-2xl border border-line bg-white/60 px-4 py-3">
            <p className="text-2xl font-semibold text-teal">{totalHoteis}</p>
            <p className="text-xs text-ink/60">Hotéis / pousadas</p>
          </div>
          <div className="rounded-2xl border border-line bg-white/60 px-4 py-3">
            <p className="text-2xl font-semibold text-ink">
              {dados.filter((d) => d.status_revisao === "novo").length}
            </p>
            <p className="text-xs text-ink/60">Aguardando revisão</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="h-[460px] w-full overflow-hidden rounded-3xl border border-line shadow-sm sm:h-[560px]">
          {carregando ? (
            <div className="flex h-full items-center justify-center text-sm text-ink/50">
              Carregando estabelecimentos…
            </div>
          ) : (
            <MapView
              dados={dadosFiltrados}
              modoAdicionar={modoAdicionar}
              onMapClick={(lat, lng) => {
                setPontoNovo({ lat, lng });
                setModoAdicionar(false);
              }}
            />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-6">
        <p className="rounded-2xl border border-line bg-white/60 px-5 py-4 text-sm leading-relaxed text-ink/70">
          Esta plataforma reúne, num só lugar, o mapa e a lista de clientes em
          potencial da região. Toda segunda-feira de manhã, ela varre
          automaticamente Cuiabá, Várzea Grande e Chapada dos Guimarães em
          busca de novos supermercados e hotéis, usando dados do
          OpenStreetMap. E funciona com uma regra: a busca semanal nunca
          apaga nenhum dado anterior, só adiciona — tudo o que foi encontrado
          antes continua salvo, e cada item adicionado manualmente aqui fica
          guardado no banco de dados para sempre. Sendo uma ferramenta de
          apoio para equipe de vendas.
        </p>
      </section>

      {pontoNovo && (
        <AddEstablishmentModal
          ponto={pontoNovo}
          onClose={() => setPontoNovo(null)}
          onSaved={recarregar}
        />
      )}

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl text-ink">Lista completa</h2>
          <div className="flex gap-2">
            {(
              [
                { key: "todos", label: "Todos" },
                { key: "supermercado", label: "Supermercados" },
                { key: "hotel", label: "Hotéis" },
              ] as { key: Filtro; label: string }[]
            ).map((opcao) => (
              <button
                key={opcao.key}
                onClick={() => setFiltro(opcao.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filtro === opcao.key
                    ? "bg-forest text-paper"
                    : "bg-white/60 text-ink/70 hover:bg-white"
                }`}
              >
                {opcao.label}
              </button>
            ))}
          </div>
        </div>

        {carregando ? (
          <p className="py-10 text-center text-sm text-ink/50">Carregando…</p>
        ) : (
          <EstablishmentsTable dados={dadosFiltrados} />
        )}
      </section>

      <footer className="border-t border-line px-6 py-6 text-center text-xs text-ink/40">
        Dados coletados via OpenStreetMap · Brasileira Distribuidora de Frutas
        — Dep. de Engenharia
      </footer>
    </main>
  );
}
