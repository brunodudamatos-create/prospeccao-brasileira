import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prospecção Brasileira — Mapa de Estabelecimentos",
  description:
    "Mapa e lista de supermercados e hotéis identificados na região de Cuiabá para prospecção comercial da Brasileira Distribuidora de Frutas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-body">{children}</body>
    </html>
  );
}
