#!/usr/bin/env node

/**
 * Audit automatique des metadonnees et de la configuration SEO pour Next.js (App Router).
 * Analyse les routes publiques, verifie la presence de metadata, layouts, client components,
 * JSON-LD, sitemap et robots.txt.
 * 
 * Regle de conception : script autonome, sans dependance externe (fs/path uniquement).
 */

import fs from 'fs';
import path from 'path';

function findAppDirectory(baseDir) {
  const possiblePaths = [
    path.join(baseDir, 'src', 'app'),
    path.join(baseDir, 'app'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      return p;
    }
  }
  return null;
}

function getRouteFromPath(appDir, filePath) {
  const relativePath = path.relative(appDir, filePath);
  const dirPath = path.dirname(relativePath);

  if (dirPath === '.') {
    return '/';
  }

  // Nettoyage des groupes de routes (dossiers entre parentheses) et des slots (@)
  const segments = dirPath
    .split(path.sep)
    .filter((segment) => !segment.startsWith('(') && !segment.startsWith('@') && !segment.startsWith('_'));

  if (segments.length === 0) {
    return '/';
  }

  return '/' + segments.join('/');
}

function checkFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    const hasUseClient = /^\s*['"]use client['"]/m.test(content);
    const hasMetadata = /export\s+(const|async\s+function)\s+(metadata|generateMetadata)/.test(content);
    const hasJsonLd = /application\/ld\+json/.test(content) || /<JsonLd/i.test(content);
    const hasNoIndex = /robots:\s*\{[^}]*index:\s*false/i.test(content) || /noindex/i.test(content);

    return {
      hasUseClient,
      hasMetadata,
      hasJsonLd,
      hasNoIndex,
    };
  } catch {
    return {
      hasUseClient: false,
      hasMetadata: false,
      hasJsonLd: false,
      hasNoIndex: false,
    };
  }
}

function checkParentLayoutMetadata(appDir, pageDir) {
  let currentDir = pageDir;
  let hasJsonLd = false;

  while (currentDir.startsWith(appDir)) {
    const layoutFiles = ['layout.tsx', 'layout.jsx', 'layout.js', 'layout.ts'];
    for (const layoutName of layoutFiles) {
      const layoutPath = path.join(currentDir, layoutName);
      if (fs.existsSync(layoutPath)) {
        const info = checkFileContent(layoutPath);
        if (info.hasJsonLd) {
          hasJsonLd = true;
        }
        if (info.hasMetadata) {
          const isRoot = currentDir === appDir;
          return {
            found: true,
            isRoot,
            layoutPath,
            hasJsonLd,
          };
        }
      }
    }

    if (currentDir === appDir) {
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  return { found: false, isRoot: false, layoutPath: null, hasJsonLd };
}

function scanPages(appDir, currentDir, results = []) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) {
        continue;
      }
      scanPages(appDir, fullPath, results);
    } else if (entry.isFile()) {
      const isPageFile = /^page\.(tsx|jsx|js|ts)$/.test(entry.name);
      if (isPageFile) {
        const route = getRouteFromPath(appDir, fullPath);
        const pageInfo = checkFileContent(fullPath);
        const layoutInfo = checkParentLayoutMetadata(appDir, currentDir);

        let status = 'A FAIRE';
        let detail = 'Aucune metadonnee specifique detectee';

        if (pageInfo.hasUseClient && pageInfo.hasMetadata) {
          status = 'ERREUR';
          detail = 'Composant client ("use client") avec export metadata (invalide Next.js)';
        } else if (pageInfo.hasMetadata) {
          status = 'OK';
          detail = 'Metadonnees definies dans page.tsx';
        } else if (layoutInfo.found && !layoutInfo.isRoot) {
          status = 'OK';
          detail = 'Metadonnees definies dans un layout de route dedie';
        } else if (layoutInfo.found && layoutInfo.isRoot) {
          status = 'A FAIRE';
          detail = 'Herite uniquement du titre par defaut de la racine';
        }

        results.push({
          route,
          filePath: fullPath,
          hasUseClient: pageInfo.hasUseClient,
          hasMetadata: pageInfo.hasMetadata,
          hasJsonLd: pageInfo.hasJsonLd || layoutInfo.hasJsonLd,
          hasNoIndex: pageInfo.hasNoIndex,
          status,
          detail,
        });
      }
    }
  }

  return results;
}

function checkGlobalFiles(appDir, baseDir) {
  const globalChecks = {
    hasSitemap: false,
    sitemapPath: null,
    hasRobots: false,
    robotsPath: null,
  };

  const sitemapCandidates = [
    path.join(appDir, 'sitemap.ts'),
    path.join(appDir, 'sitemap.js'),
    path.join(baseDir, 'public', 'sitemap.xml'),
  ];

  for (const p of sitemapCandidates) {
    if (fs.existsSync(p)) {
      globalChecks.hasSitemap = true;
      globalChecks.sitemapPath = p;
      break;
    }
  }

  const robotsCandidates = [
    path.join(appDir, 'robots.ts'),
    path.join(appDir, 'robots.js'),
    path.join(baseDir, 'public', 'robots.txt'),
  ];

  for (const p of robotsCandidates) {
    if (fs.existsSync(p)) {
      globalChecks.hasRobots = true;
      globalChecks.robotsPath = p;
      break;
    }
  }

  return globalChecks;
}

function main() {
  const baseDir = process.cwd();
  const appDir = findAppDirectory(baseDir);

  console.log('# Rapport d\'Audit Technique des Metadonnees Next.js\n');
  console.log(`Date : ${new Date().toISOString().slice(0, 10)}`);
  console.log(`Repertoire analyse : ${baseDir}\n`);

  if (!appDir) {
    console.error('Erreur : Aucun repertoire App Router ("src/app" ou "app") trouve.');
    process.exit(1);
  }

  const globalFiles = checkGlobalFiles(appDir, baseDir);
  const results = scanPages(appDir, appDir);

  // Tri par route
  results.sort((a, b) => a.route.localeCompare(b.route));

  console.log('## 1. Fichiers Fondamentaux d\'Indexation\n');
  console.log(`- **Sitemap XML** : ${globalFiles.hasSitemap ? 'Present (' + path.relative(baseDir, globalFiles.sitemapPath) + ')' : 'ABSENT (A creer via src/app/sitemap.ts)'}`);
  console.log(`- **Robots.txt** : ${globalFiles.hasRobots ? 'Present (' + path.relative(baseDir, globalFiles.robotsPath) + ')' : 'ABSENT (A creer via src/app/robots.ts)'}\n`);

  console.log('## 2. Inventaire des Routes et Metadonnees\n');
  console.log('| Route | Type de composant | Statut SEO | Donnees Structurees | Remarque / Action requise |');
  console.log('|---|---|---|---|---|');

  let okCount = 0;
  let errorCount = 0;
  let todoCount = 0;

  for (const item of results) {
    const compType = item.hasUseClient ? 'Client ("use client")' : 'Serveur';
    const jsonLdText = item.hasJsonLd ? 'JSON-LD detecte' : 'Non';

    if (item.status === 'OK') okCount++;
    else if (item.status === 'ERREUR') errorCount++;
    else todoCount++;

    console.log(`| \`${item.route}\` | ${compType} | **${item.status}** | ${jsonLdText} | ${item.detail} |`);
  }

  console.log('\n## 3. Synthese et Recommandations Prioritaires\n');
  console.log(`- Total de routes analysees : ${results.length}`);
  console.log(`- Routes avec metadonnees conformes : ${okCount}`);
  console.log(`- Routes en erreur technique bloquante : ${errorCount}`);
  console.log(`- Routes necessitant une optimisation de metadonnees : ${todoCount}\n`);

  if (!globalFiles.hasSitemap) {
    console.log('- [Priorite Haute] Creer le fichier `src/app/sitemap.ts` pour lister toutes les pages publiques.');
  }
  if (!globalFiles.hasRobots) {
    console.log('- [Priorite Haute] Creer le fichier `src/app/robots.ts` pour guider les moteurs et referencer le sitemap.');
  }
  if (todoCount > 0) {
    console.log('- [Priorite Moyenne] Ajouter un fichier `layout.tsx` avec objet `metadata` dedie dans chaque dossier de route public pour eviter le titre generique.');
  }

  process.exit(0);
}

main();
