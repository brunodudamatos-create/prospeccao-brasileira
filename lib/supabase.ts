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
