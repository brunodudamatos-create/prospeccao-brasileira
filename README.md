# Prospecção Brasileira

Painel web (Next.js) que mostra, num mapa e numa lista, os supermercados e
hotéis identificados pelo agente de prospecção (Overpass API → Make.com →
Supabase) na região de Cuiabá. Projeto separado do painel elétrico — banco
de dados e site próprios.

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local
# edite .env.local com a chave anon do projeto Supabase "prospeccao-brasileira"
npm run dev
```

Abra http://localhost:3000

## Publicando (GitHub + Vercel)

1. Crie um repositório novo no GitHub (ex: `prospeccao-brasileira`) e suba este
   código:
   ```bash
   git init
   git add .
   git commit -m "primeiro commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/prospeccao-brasileira.git
   git push -u origin main
   ```
2. Em vercel.com, clique em **"Add New" → "Project"** e importe esse
   repositório.
3. Nas configurações do projeto, em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://gcitncjmtyrktiiwogsm.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (a chave anon do projeto Supabase
     `prospeccao-brasileira` — pegue em Supabase → Project Settings → API)
4. Clique em **Deploy**. Pronto — cada `git push` futuro atualiza o site
   automaticamente.

## Estrutura

- `app/page.tsx` — página única do painel (mapa, filtros, tabela, exportar)
- `components/MapView.tsx` — mapa com Leaflet + OpenStreetMap (sem custo,
  sem chave de API)
- `components/ExportButton.tsx` — gera um `.xlsx` com a data/hora da última
  atualização
- `lib/supabase.ts` — conexão com o banco (somente leitura)
