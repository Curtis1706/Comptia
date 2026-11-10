# Livrable SEO / GEO Technique : Correctifs Schema.org, SSR H1, `llms.txt`, Sécurité HTTP et IndexNow

Date : 2026-11-10
Domaine canonique retenu : `https://ceilow.com` (Option A1)
Périmètre appliqué : Correctifs techniques et Schema uniquement, sans modification des textes visibles des pages (Option A3), et sans `sameAs` social actif (Option A2).

---

## 1. Résumé Décisionnel

Suite à l'audit SEOmator GEO (score initial 76/100 sur `www.ceilow.com`) et à la vérification du HTML serveur et des en-têtes Vercel, l'architecture technique posait quatre blocages concrets : les tableaux JSON-LD `[...]` étaient ignorés par les parseurs stricts, `/llms.txt` n'existait pas (renvoyait une page HTML 404), `/demo` et `/login` masquaient leur `<h1>` dans un `<Suspense>` spinner en SSR, et `Organization` / `WebSite` n'étaient pas déclarés globalement. Tous ces points ont été résolus dans le code et validés par `npx tsc --noEmit` et `pnpm build`.

## 2. Constats Vérifiés et Actions Livrées

| Sujet | Constat initial | Action implémentée | Fichier(s) |
|---|---|---|---|
| Parser JSON-LD (`18/100`) | `<JsonLd data={[...]}>` émettait un tableau JSON `[...]` ignoré sur `/`, `/contact`, `/solutions/*`, `/ressources/*` | Émission d'une balise `<script type="application/ld+json">` distincte par objet | `src/components/seo/JsonLd.tsx` |
| Entité globale `Organization` & `WebSite` | `Organization` présent uniquement sur `/` (avec `sameAs` LinkedIn inactif) et `WebSite` absent | Déclaration globale de `Organization` (sans `sameAs` non vérifié, coordonnées `+2290197554953` / `+2290162789305`) et `WebSite` (`SearchAction` vers `/ressources?q=...`) | `src/lib/seo-schemas.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/ressources/page.tsx` |
| FAQ & HowTo & BreadcrumbList manquants | 13 pages avec FAQ visible sans `FAQPage`, `guide-tva-benin` sans `HowTo`, pages légales sans `BreadcrumbList` | Ajout de `buildFaqSchema` sur les 13 layouts concernés, `HowTo` (4 étapes DGI) sur `guide-tva-benin`, `BreadcrumbList` sur `/cgu`, `/confidentialite`, `/mentions-legales` | `src/app/**/layout.tsx` |
| SSR `<h1>` manquant sur `/demo` et `/login` | `useSearchParams()` forçait le rendu SSR de `<Suspense fallback={<Loader2 />}>` sans `<h1>` ni formulaire | Isolation de `useSearchParams()` dans `DemoSubmittedSync` / `LoginQuerySync` (`fallback={null}`) | `src/app/demo/page.tsx`, `src/app/login/page.tsx` |
| Fichier `llms.txt` invalide | `https://www.ceilow.com/llms.txt` retournait du HTML 404 (`20/100`) | Création d'un `public/llms.txt` structuré en Markdown conforme | `public/llms.txt` |
| En-têtes sécurité HTTP (`6/10`) & perf robots | Seul HSTS (Vercel) était envoyé ; le matcher middleware exécutait le JWT sur `.txt`/`.xml` | Ajout de `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control` et `Content-Type` UTF-8 pour `/llms.txt` ; exclusion `txt`/`xml` dans `matcher` | `next.config.ts`, `src/middleware.ts` |
| Bing Webmaster Tools / IndexNow | Aucun fichier de vérification ni script d'indexation rapide IndexNow | Création de la clé `public/c7e10b8a9f2d4e31a6b58d7f0c9e4a12.txt` et du script CLI `scripts/submit-indexnow.mjs` | `public/c7e10b8a9f2d4e31a6b58d7f0c9e4a12.txt`, `scripts/submit-indexnow.mjs` |

## 3. Actions Restantes Hors Code (Manuelles)

| Action | Priorité | Justification |
|---|---|---|
| Passer `https://ceilow.com` en domaine principal dans Vercel (redirection `308` de `www` vers apex) | Critique | Aligner les réponses HTTP `200 OK` sur `https://ceilow.com` déjà déclaré partout en canonical, `robots.txt`, `sitemap.xml` et GA4 |
| Soumettre `https://ceilow.com/sitemap.xml` dans Google Search Console et valider le domaine dans Bing Webmaster Tools | Haute | Indexation Google + alimentation de l'index Bing utilisé par Copilot et ChatGPT Search |
| Exécuter `node scripts/submit-indexnow.mjs` après déploiement | Moyenne | Notification instantanée des 26 URLs publiques (dont `/llms.txt`) à IndexNow |
| Compléter ultérieurement `Organization.sameAs` dans `src/lib/seo-schemas.ts` lors de l'ouverture officielle de LinkedIn / YouTube | Basse | Ne déclarer que des profils officiels actifs et vérifiables |

