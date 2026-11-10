/**
 * Script de soumission IndexNow (Bing / ChatGPT Search / Yandex / Seznam).
 * Usage : node scripts/submit-indexnow.mjs
 *
 * A exécuter après un déploiement en production une fois que https://ceilow.com
 * est configuré comme domaine principal sans redirection sur Vercel.
 */

const HOST = "ceilow.com";
const KEY = "c7e10b8a9f2d4e31a6b58d7f0c9e4a12";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/solutions/comptabilite-syscohada`,
  `https://${HOST}/solutions/facturation-dgi`,
  `https://${HOST}/solutions/tresorerie-momo`,
  `https://${HOST}/solutions/paie-cnss`,
  `https://${HOST}/solutions/declarations-fiscales`,
  `https://${HOST}/solutions/gestion-depenses`,
  `https://${HOST}/pour-qui/pme-et-independants`,
  `https://${HOST}/pour-qui/cabinets-comptables`,
  `https://${HOST}/fonctionnalites`,
  `https://${HOST}/tarifs`,
  `https://${HOST}/accompagnement`,
  `https://${HOST}/contact`,
  `https://${HOST}/demo`,
  `https://${HOST}/ressources`,
  `https://${HOST}/ressources/calendrier-fiscal-benin`,
  `https://${HOST}/ressources/guide-facturation-emecef-benin`,
  `https://${HOST}/ressources/guide-tva-benin`,
  `https://${HOST}/ressources/calcul-tps-benin-guide`,
  `https://${HOST}/ressources/plan-comptable-syscohada-pdf`,
  `https://${HOST}/ressources/bareme-cotisations-cnss-benin`,
  `https://${HOST}/securite-et-apdp`,
  `https://${HOST}/cgu`,
  `https://${HOST}/confidentialite`,
  `https://${HOST}/mentions-legales`,
  `https://${HOST}/llms.txt`,
];

async function submitIndexNow() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST,
  };

  console.log(`Envoi IndexNow pour ${URL_LIST.length} URLs sur ${HOST}...`);

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log(`Statut HTTP : ${response.status} ${response.statusText}`);
  if (text) {
    console.log(`Réponse : ${text}`);
  }

  if (!response.ok) {
    process.exitCode = 1;
  }
}

submitIndexNow().catch((err) => {
  console.error("Erreur lors de la soumission IndexNow :", err);
  process.exitCode = 1;
});

