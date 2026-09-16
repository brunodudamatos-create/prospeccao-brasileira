/**
 * v1.2 — 2026-09-15
 * Mudança: adicionada a cidade de Poconé (raio 8km) na função
 * inferirCidade(), acompanhando a mesma adição feita na busca do Make.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Only warn (don't throw) so `next build` never fails locally without env vars set.
  // The real values are required at runtime in Vercel's environment settings.
  console.warn(
    "Supabase env vars ausentes: configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export type Categoria = "supermercado" | "hotel";
export type StatusRevisao = "novo" | "ja_e_cliente" | "nao_atende" | "descartado";
export type Cidade =
  | "Cuiabá"
  | "Várzea Grande"
  | "Chapada dos Guimarães"
  | "Poconé";

export interface Estabelecimento {
  id: number;
  place_id: string;
  categoria: Categoria;
  nome: string;
  endereco: string | null;
  telefone: string | null;
  latitude: number;
  longitude: number;
  status_revisao: StatusRevisao;
  observacoes: string | null;
  data_encontrado: string;
  data_atualizado: string;
}

// Mesmos 3 centros usados na busca automática do Make (Overpass API).
const CENTROS_CIDADE: { nome: Cidade; lat: number; lng: number }[] = [
  { nome: "Cuiabá", lat: -15.6014, lng: -56.0979 },
  { nome: "Várzea Grande", lat: -15.6467, lng: -56.1325 },
  { nome: "Chapada dos Guimarães", lat: -15.4608, lng: -55.7499 },
  { nome: "Poconé", lat: -16.2644, lng: -56.6281 },
];

export function inferirCidade(lat: number, lng: number): Cidade {
  let maisProxima = CENTROS_CIDADE[0];
  let menorDistancia = Infinity;

  for (const centro of CENTROS_CIDADE) {
    const distancia = Math.hypot(lat - centro.lat, lng - centro.lng);
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      maisProxima = centro;
    }
  }

  return maisProxima.nome;
}

export async function fetchEstabelecimentos(): Promise<Estabelecimento[]> {
  const { data, error } = await supabase
    .from("prospeccao_estabelecimentos")
    .select("*")
    .order("data_encontrado", { ascending: false });

  if (error) {
    console.error("Erro ao buscar estabelecimentos:", error.message);
    return [];
  }
  return data ?? [];
}

export async function atualizarRevisao(
  id: number,
  status: StatusRevisao,
  observacoes: string
): Promise<boolean> {
  const { error } = await supabase.rpc("atualizar_revisao", {
    p_id: id,
    p_status: status,
    p_observacoes: observacoes,
  });

  if (error) {
    console.error("Erro ao salvar revisão:", error.message);
    return false;
  }
  return true;
}

export async function adicionarEstabelecimento(input: {
  categoria: Categoria;
  nome: string;
  telefone?: string;
  endereco?: string;
  latitude: number;
  longitude: number;
}): Promise<boolean> {
  const place_id = `manual-${crypto.randomUUID()}`;
  const { error } = await supabase.from("prospeccao_estabelecimentos").insert({
    place_id,
    categoria: input.categoria,
    nome: input.nome,
    telefone: input.telefone || null,
    endereco: input.endereco || null,
    latitude: input.latitude,
    longitude: input.longitude,
    status_revisao: "novo",
  });

  if (error) {
    console.error("Erro ao adicionar estabelecimento:", error.message);
    return false;
  }
  return true;
}
