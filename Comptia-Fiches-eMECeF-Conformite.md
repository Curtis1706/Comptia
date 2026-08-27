# Fiches e-MECeF — Mise en Conformité DGI

## Contexte

Ce document remplace la fiche V4 provisoire. Il s'appuie désormais sur les **sources officielles de la DGI** et non plus sur des hypothèses tirées de librairies communautaires :

| Source | Ce qu'elle établit |
| :--- | :--- |
| `example.js` — SDK JavaScript officiel | Endpoints, structure du payload, séquence d'appels |
| `e-MECeF_Manuel_d_utilisation_v1_0.pdf` | Groupes de taxation, AIB, prix TTC, éléments de sécurité |
| `Auto_declaration_de_SFE_avec_e-MECeF.docx` | Les 20 cas de test d'homologation et le référentiel A–F |
| `Plaquette_e_MECeF.jpg` | Procédure d'homologation en 8 étapes (Cas B) |

L'audit croisé avec `src/lib/mecef.ts` révèle **neuf écarts**, dont quatre rendent toute normalisation impossible et un impose une modification du modèle de données.

Les identifiants d'accès, les variables d'environnement et les commandes de vérification figurent en **Partie 0**.

---

---

# Partie 0 — Configuration et accès

## Identifiants attribués

| Élément | Valeur |
| :--- | :--- |
| **NIM** (Numéro d'Identification Machine) | `TS01019550` |
| **IFU** de l'émetteur | `3202687290154` |
| Rôle porté par le jeton | `Taxpayer` |
| Émetteur du jeton | `impots.bj` |
| Émis le | 27/08/2026 à 14:10:01 UTC |
| **Expire le** | **27/02/2027 à 14:10:01 UTC** |

Le jeton est un JWT signé HS256. Sa charge utile contient `"unique_name": "3202687290154|TS01019550"` — l'IFU et le NIM y sont donc liés côté serveur. C'est la raison pour laquelle le payload de facture transmet `ifu` et non `nim` : le NIM est déduit du jeton.

## Variables d'environnement

```env
# ── e-MECeF — environnement de test (SyGMEF-test) ────────────────
MECEF_MODE=sandbox
MECEF_NIM=TS01019550
MECEF_IFU=3202687290154
MECEF_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMyMDI2ODcyOTAxNTR8VFMwMTAxOTU1MCIsInJvbGUiOiJUYXhwYXllciIsIm5iZiI6MTc4NzgzOTgwMSwiZXhwIjoxODAzNzM3NDAxLCJpYXQiOjE3ODc4Mzk4MDEsImlzcyI6ImltcG90cy5iaiIsImF1ZCI6ImltcG90cy5iaiJ9.-eq3Dpxmq41NF2zQHXDUT5ZmBDcrwtzd5YTik84O0e0

# URLs — ne pas modifier
MECEF_SANDBOX_URL=https://developper.impots.bj/sygmef-emcf/api
MECEF_PRODUCTION_URL=https://sygmef.impots.bj/emcf
MECEF_VERIFICATION_URL=https://developper.impots.bj/sygmef-test/verification
```

Pour la production, seules trois lignes changeront après homologation :

```env
MECEF_MODE=production
MECEF_NIM=<NIM de production délivré par la DGI>
MECEF_TOKEN=<jeton de production>
```

<div class="warn" markdown="1">
**Le dépôt `Curtis1706/Comptia` est public.** Ce jeton autorise l'émission de factures de test sous le NIM `TS01019550`. Ajoute `.env` et `.env.local` à `.gitignore` avant tout commit, et configure les variables directement dans le tableau de bord Vercel. Le présent document ne doit pas non plus être versionné en l'état — garde-le hors du dépôt ou retire ce bloc avant de le committer.
</div>

## Vérification immédiate de l'accès

Avant tout développement, vérifie que le jeton fonctionne :

```bash
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMyMDI2ODcyOTAxNTR8VFMwMTAxOTU1MCIsInJvbGUiOiJUYXhwYXllciIsIm5iZiI6MTc4NzgzOTgwMSwiZXhwIjoxODAzNzM3NDAxLCJpYXQiOjE3ODc4Mzk4MDEsImlzcyI6ImltcG90cy5iaiIsImF1ZCI6ImltcG90cy5iaiJ9.-eq3Dpxmq41NF2zQHXDUT5ZmBDcrwtzd5YTik84O0e0" \
  https://developper.impots.bj/sygmef-emcf/api/info/status | jq
```

Puis récupère les référentiels officiels, à confronter avec ce document :

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMyMDI2ODcyOTAxNTR8VFMwMTAxOTU1MCIsInJvbGUiOiJUYXhwYXllciIsIm5iZiI6MTc4NzgzOTgwMSwiZXhwIjoxODAzNzM3NDAxLCJpYXQiOjE3ODc4Mzk4MDEsImlzcyI6ImltcG90cy5iaiIsImF1ZCI6ImltcG90cy5iaiJ9.-eq3Dpxmq41NF2zQHXDUT5ZmBDcrwtzd5YTik84O0e0"
BASE="https://developper.impots.bj/sygmef-emcf/api"

curl -s -H "Authorization: Bearer $TOKEN" $BASE/info/invoiceTypes | jq
curl -s -H "Authorization: Bearer $TOKEN" $BASE/info/taxGroups    | jq
curl -s -H "Authorization: Bearer $TOKEN" $BASE/info/paymentTypes | jq
curl -s -H "Authorization: Bearer $TOKEN" $BASE/invoice           | jq
```

Les réponses de `taxGroups` et `paymentTypes` font foi : si elles divergent du référentiel de la Partie I, ce sont elles qui l'emportent. Consigne-les avant d'écrire la moindre ligne de code.

---

---

# Partie I — Le référentiel officiel

## 1. Environnements

| Usage | Adresse |
| :--- | :--- |
| API de test | `https://developper.impots.bj/sygmef-emcf/api` |
| API de production | `https://sygmef.impots.bj/emcf` |
| Interface de gestion (test) | `https://developper.impots.bj/sygmef-emcf` |
| Interface de gestion (production) | `https://sygmef.impots.bj` |
| Vérification de facture | `https://developper.impots.bj/sygmef-test/verification` |

Le nom d'utilisateur de l'interface de gestion est l'IFU. Les factures émises sur le serveur de test portent la mention **TEST FACTURE** et leur code MECeF commence par `TEST-`.

## 2. Endpoints

| Méthode | Chemin | Objet |
| :--- | :--- | :--- |
| `GET` | `/api/info/status` | État du e-MCF et informations du contribuable |
| `GET` | `/api/info/invoiceTypes` | Types de facture reconnus |
| `GET` | `/api/info/taxGroups` | Groupes de taxation et taux |
| `GET` | `/api/info/paymentTypes` | Modes de paiement acceptés |
| `GET` | `/api/invoice` | Statut courant de la machine |
| `POST` | `/api/invoice` | Enregistre une facture — retourne un `uid` |
| `GET` | `/api/invoice/{uid}` | Détail de la facture enregistrée |
| `PUT` | `/api/invoice/{uid}/confirm` | **Finalise** — retourne les éléments de sécurité |

Authentification par en-tête `Authorization: Bearer <jeton>` sur tous les appels.

## 3. La séquence de normalisation

C'est le point le plus mal compris. Une facture n'est **pas** normalisée par le seul `POST`.

```
1. POST /api/invoice
   → la facture est enregistrée côté DGI
   → retourne un uid
   → AUCUN élément de sécurité à ce stade

2. PUT /api/invoice/{uid}/confirm
   → la facture est finalisée
   → retourne SecurityElementsDto : code MECeF/DGI, QR code, compteurs
   → c'est SEULEMENT ici que la facture devient normalisée
```

Le manuel le formule sans ambiguïté à propos de l'interface e-SFE : une facture complète mais non confirmée « n'est toujours pas une facture normalisée car elle manque d'éléments de sécurité ». Le bouton « Terminer la facture » de l'interface correspond exactement au `PUT /confirm` de l'API.

Une facture restée au stade `POST` existe donc côté DGI mais n'a aucune valeur légale.

## 4. Le payload officiel

Extrait littéral du SDK :

```json
{
  "ifu": "XXXXXXXXXXXXX",
  "type": "FV",
  "items": [
    { "name": "Jus d'orange",    "price": 1800, "quantity": 2,   "taxGroup": "B" },
    { "name": "Article exonere", "price": 600,  "quantity": 2.5, "taxGroup": "A" }
  ],
  "operator": { "name": "Test" }
}
```

Quatre enseignements :

- La clé racine est **`ifu`**, pas `nim`. Le NIM est lié au jeton côté serveur.
- **`operator`** ne requiert que `name`.
- **`quantity`** accepte les décimales (2.5).
- `client`, `payment`, `reference`, `aib` sont **facultatifs** et absents de l'exemple minimal.

## 5. Le prix est TTC

C'est l'écart le plus lourd de conséquences. Le manuel intitule le champ **« Prix unitaire (T.T.C.) »** et l'illustre :

| Donnée | Valeur |
| :--- | ---: |
| Prix unitaire saisi | 1 200 |
| Total | 1 200 |
| Imposable | 1 017 |
| Impôt | 183 |

Vérification : 1 200 ÷ 1,18 = 1 016,95 → 1 017 d'assiette, 183 de TVA. Le montant transmis est bien **toutes taxes comprises**, et c'est la DGI qui ventile.

Or ton modèle `InvoiceLine` stocke `unit_price` en **hors taxes**, avec un `vat_rate` séparé et un `subtotal_ht` au niveau facture. Une conversion est donc indispensable avant transmission.

## 6. Les groupes de taxation

Référentiel officiel, Annexe 1 du formulaire d'auto-déclaration :

| Groupe | Étiquette | Description |
| :---: | :---: | :--- |
| **A** | EXO | Exonéré |
| **B** | TAX | Taxable (18%) |
| **C** | EXP | Exportation de produits taxables |
| **D** | MP | TVA régime d'exception |
| **E** | TPS | Régime fiscal TPS |
| **F** | RES | Réservé |

Ton code commente actuellement « A = 18% standard, B = 0% exonéré ». C'est **exactement l'inverse**. Toutes les factures déclareraient la TVA à contresens.

## 7. Les types de facture

| Code | Libellé |
| :---: | :--- |
| `FV` | Facture de vente |
| `FA` | Facture d'avoir |
| `EV` | Facture de vente à l'exportation |
| `EA` | Facture d'avoir à l'exportation |

Pour une facture d'avoir (`FA` ou `EA`), la **référence de la facture originale est obligatoire**. Elle vaut le code MECeF/DGI de la facture d'origine, sur **24 caractères**, présenté en six groupes de quatre séparés par des tirets — par exemple `TEST-E6SE-HHRM-UZZK-JTLU-RULL`.

## 8. L'AIB sur facture

Le manuel est explicite : « Vous pouvez choisir entre aucun AIB, **AIB 1%** ou **AIB 5%** (selon l'enregistrement de l'IFU du client sur la facture). »

| Situation du client | Taux |
| :--- | :---: |
| Client avec IFU valide enregistré | 1% |
| Client sans IFU ou non enregistré | 5% |
| Sans AIB | — |

<div class="warn" markdown="1">
**Distinction à ne pas confondre.** L'AIB de la facture normalisée (1% / 5%) est celui que **le vendeur collecte auprès de son client**. C'est un mécanisme distinct de la retenue à la source qu'un **acheteur** pratique sur les honoraires d'un prestataire, décrite dans le guide de tests (3% / 5%).

Pour l'intégration e-MECeF, seuls comptent les taux **1% et 5%**, déterminés par l'IFU du client. Fais confirmer le volet retenue à la source par ton expert-comptable avant de figer le guide de recette.
</div>

## 9. Les taxes additionnelles

| Élément | Description |
| :--- | :--- |
| **Taxe spécifique (TS)** | Facultative. Montant **total pour la quantité entière** de l'article, pas unitaire. |
| **Taxe de séjour** | Facultative. Concerne l'hôtellerie. |

## 10. Les éléments de sécurité retournés

Le `PUT /confirm` retourne un `SecurityElementsDto` contenant :

- **Code MECeF/DGI** — 24 caractères, six groupes de quatre
- **QR code** — obligatoire sur la facture imprimée
- **MECeF NIM** — le numéro de la machine
- **MECeF Compteurs** — de la forme `1/2 FV` (n-ième facture de ce type / total)
- **MECeF Heure** — horodatage de normalisation

Le numéro de facture prend la forme `TS01000021-1` : NIM suivi du rang.

## 11. Le client

| Champ | Contrainte |
| :--- | :--- |
| `ifu` | **Validé par le serveur** — un IFU invalide fait rejeter la facture |
| `name` | Raison sociale |
| `address` | Facultatif |
| `contact` | Facultatif |

## 12. Champs libres

- **Description supplémentaire** — jusqu'à **trois lignes** de texte libre sur la facture
- **Message commercial** — pied de document, par exemple « Merci pour votre visite »

---

---

# Partie II — Écarts constatés

| # | Écart | Gravité | Effet |
| :---: | :--- | :---: | :--- |
| 1 | URL erronée : `sygmef-emcef` au lieu de `sygmef-emcf` | Bloquant | 404 systématique |
| 2 | Absence du `PUT /confirm` | Bloquant | Aucune facture jamais normalisée |
| 3 | Payload : `nim` transmis au lieu de `ifu` | Bloquant | Rejet |
| 4 | Groupes de taxation inversés (A ↔ B) | Bloquant | TVA déclarée à contresens |
| 5 | Prix transmis en HT au lieu de TTC | Bloquant | Montants et TVA faux |
| 6 | `operator.id` imposé alors qu'il est facultatif | Majeur | Rejet possible |
| 7 | Structure `payment` inventée | Majeur | Rejet possible |
| 8 | AIB absent du modèle | Majeur | Cas de test 8, 9, 10 impossibles |
| 9 | Taxe spécifique et taxe de séjour absentes | Majeur | Cas de test 7, 10, 11, 13, 15 impossibles |

Cinq écarts empêchent purement et simplement l'émission d'une facture valide.

---

---

# M1 — Refonte de `src/lib/mecef.ts`

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.
Fichier : src/lib/mecef.ts (208 lignes, à réécrire intégralement)

CONTEXTE
L'implémentation actuelle a été construite d'après des librairies communautaires.
La documentation officielle DGI (SDK JavaScript, manuel d'utilisation, formulaire
d'auto-déclaration) est désormais disponible et révèle 9 écarts, dont 5 bloquants.

RÉFÉRENTIEL OFFICIEL À RESPECTER

URLs :
  test       https://developper.impots.bj/sygmef-emcf/api
  production https://sygmef.impots.bj/emcf
  (attention : "sygmef-emcf", PAS "sygmef-emcef" — l'actuel contient une faute)

Séquence de normalisation en DEUX appels :
  1. POST /api/invoice           → retourne { uid, ... }, PAS d'éléments de sécurité
  2. PUT  /api/invoice/{uid}/confirm → retourne SecurityElementsDto
     (code MECeF/DGI, QR code, NIM, compteurs, horodatage)
  Une facture non confirmée N'EST PAS normalisée légalement.

Payload officiel (extrait littéral du SDK DGI) :
  {
    "ifu": "3202687290154",
    "type": "FV",
    "items": [
      { "name": "Jus d'orange",    "price": 1800, "quantity": 2,   "taxGroup": "B" },
      { "name": "Article exonere", "price": 600,  "quantity": 2.5, "taxGroup": "A" }
    ],
    "operator": { "name": "Test" }
  }

  - clé racine "ifu", PAS "nim"
    (le JWT contient unique_name = "3202687290154|TS01019550" : le NIM est
     déduit du jeton côté serveur, il ne se transmet pas dans le corps)
  - operator ne requiert que "name"
  - quantity accepte les décimales
  - price est TTC (voir plus bas)

Groupes de taxation (Annexe 1 du formulaire d'auto-déclaration) :
  A = EXO — Exonéré
  B = TAX — Taxable 18%
  C = EXP — Exportation de produits taxables
  D = MP  — TVA régime d'exception
  E = TPS — Régime fiscal TPS
  F = RES — Réservé
  ATTENTION : le code actuel commente "A = 18% standard, B = 0% exonéré".
  C'est INVERSÉ.

PRIX TTC — point critique :
  Le manuel intitule le champ "Prix unitaire (T.T.C.)".
  Exemple officiel : prix 1200 → imposable 1017, impôt 183 (1200/1.18).
  Le modèle Comptia stocke unit_price en HT avec vat_rate séparé.
  Il faut donc convertir avant transmission :
      priceTTC = round(unit_price × (1 + vat_rate / 100))
  Arrondir au franc CFA (entier), le XOF n'a pas de subdivision.

TÂCHE

1. Réécris src/lib/mecef.ts avec les types suivants :

   export type MecefMode = "simulation" | "sandbox" | "production";
   export type MecefInvoiceType = "FV" | "FA" | "EV" | "EA";
   export type MecefTaxGroup = "A" | "B" | "C" | "D" | "E" | "F";
   export type MecefAibRate = "A" | "B";   // A = 1%, B = 5% — à CONFIRMER via /api/info

   export const TAX_GROUP_LABELS: Record<MecefTaxGroup, string> = {
     A: "Exonéré",
     B: "Taxable 18%",
     C: "Exportation de produits taxables",
     D: "TVA régime d'exception",
     E: "Régime fiscal TPS",
     F: "Réservé",
   };

   export interface MecefItem {
     name: string;
     price: number;          // TTC, entier XOF
     quantity: number;       // décimales autorisées
     taxGroup: MecefTaxGroup;
     taxSpecific?: number;   // total pour la quantité entière, pas unitaire
   }

   export interface MecefClient {
     ifu?: string;           // validé par le serveur DGI
     name?: string;
     address?: string;
     contact?: string;
   }

   export interface MecefInvoiceRequest {
     ifu: string;                    // IFU de l'ÉMETTEUR
     type: MecefInvoiceType;
     items: MecefItem[];
     client?: MecefClient;
     operator: { id?: string; name: string };
     reference?: string;             // code MECeF/DGI de la facture d'origine (FA/EA)
     aib?: string;                   // groupe AIB
     payment?: Array<{ name: string; amount: number }>;
     additionalDescription?: string[];   // 3 lignes maximum
     commercialMessage?: string;
   }

   export interface MecefSecurityElements {
     codeMECeFDGI: string;   // 24 caractères, 6 groupes de 4
     qrCode: string;
     nim: string;
     counters: string;       // ex. "1/2 FV"
     dateTime: string;
   }

2. Implémente les fonctions suivantes :

   a) postInvoice(request: MecefInvoiceRequest): Promise<{ uid: string; ... }>
   b) confirmInvoice(uid: string): Promise<MecefSecurityElements>
   c) getInvoiceDetails(uid: string): Promise<unknown>
   d) normalizeInvoice(invoice): Promise<MecefSecurityElements>
      → enchaîne postInvoice puis confirmInvoice
      → si le POST réussit mais le confirm échoue, PERSISTE l'uid en base
        avant de propager l'erreur : la facture existe côté DGI et devra être
        confirmée, pas recréée. Recréer produirait un doublon.

   e) getInfoStatus(), getInvoiceTypes(), getTaxGroups(), getPaymentTypes()
      → les quatre endpoints GET /api/info/*
      → à appeler au démarrage en mode sandbox pour vérifier le référentiel

3. Trois modes d'exécution via MECEF_MODE :
   - simulation : aucun appel réseau, réponse fabriquée, préfixe TEST- sur le code
   - sandbox    : appels réels vers developper.impots.bj
   - production : appels réels vers sygmef.impots.bj

   En production, si MECEF_NIM ou MECEF_TOKEN manque, lève une erreur explicite
   au chargement du module plutôt que d'échouer à la première facture.

4. Fonction de conversion exportée :

   export function toMecefPrice(unitPriceHT: number, vatRate: number): number {
     return Math.round(unitPriceHT * (1 + vatRate / 100));
   }

   Documente que l'arrondi au franc entier peut créer un écart de quelques
   francs entre le total Comptia (calculé en HT) et le total DGI (calculé en TTC).
   Ce point doit être traité en M2.

5. Journalise chaque appel dans le modèle MecefLog (créé en M2) : endpoint,
   corps de requête, réponse, statut HTTP, durée, code et libellé d'erreur.
   En cas de litige fiscal, cette trace est la seule preuve des échanges.

CONTRAINTE
Ne conserve rien de la structure "payment: { cashAmount, checkAmount, ... }"
de l'implémentation actuelle : elle ne figure dans aucune source officielle.
La forme retenue est un tableau { name, amount }, à confirmer par un appel à
GET /api/info/paymentTypes dès l'ouverture du sandbox.
```

---

---

# M2 — Modèle de données

## Contexte

Cinq informations exigées par la DGI n'ont pas d'équivalent dans le schéma actuel : le groupe de taxation par ligne, la taxe spécifique, l'AIB, la taxe de séjour et l'`uid` de la facture côté DGI.

Le champ `vat_rate` seul ne suffit pas : deux articles à 0% peuvent relever du groupe A (exonéré) ou du groupe C (exportation), avec des conséquences déclaratives différentes.

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.
Fichier : prisma/schema.prisma

CONTEXTE
Le référentiel e-MECeF exige des informations absentes du modèle actuel.
Le champ vat_rate ne suffit pas à déterminer le groupe de taxation : deux
articles à 0% peuvent relever du groupe A (exonéré) ou C (exportation), avec
des traitements déclaratifs différents.

TÂCHE

1. Nouvel enum :

   enum MecefTaxGroup {
     A   // EXO — Exonéré
     B   // TAX — Taxable 18%
     C   // EXP — Exportation de produits taxables
     D   // MP  — TVA régime d'exception
     E   // TPS — Régime fiscal TPS
     F   // RES — Réservé
   }

   enum MecefAibRate {
     none
     rate_1   // 1% — client avec IFU valide
     rate_5   // 5% — client sans IFU
   }

2. Modèle InvoiceLine — ajoute :

   tax_group      MecefTaxGroup @default(B)
   tax_specific   Decimal?      @db.Decimal(15, 2)   // total pour la quantité entière

   Note bien : tax_specific est le montant TOTAL pour la ligne, pas un montant
   unitaire. C'est la règle du manuel DGI.

3. Modèle Invoice — ajoute :

   mecef_uid              String?         // uid retourné par POST, avant confirmation
   mecef_counters         String?         // ex. "1/2 FV"
   mecef_datetime         DateTime?       // horodatage de normalisation DGI
   mecef_original_ref     String?         // code MECeF de la facture d'origine (FA/EA)
   aib_rate               MecefAibRate @default(none)
   aib_amount             Decimal      @db.Decimal(15, 2) @default(0)
   tourist_tax_amount     Decimal      @db.Decimal(15, 2) @default(0)
   additional_description String?         // 3 lignes maximum, séparées par \n
   commercial_message     String?

   mecef_uid est essentiel : si le POST réussit et que le confirm échoue, il
   faut pouvoir reprendre la confirmation sans recréer la facture côté DGI.

4. Nouveau modèle de journalisation :

   model MecefLog {
     id            String   @id @default(cuid())
     company_id    String
     invoice_id    String?
     mode          String              // simulation | sandbox | production
     method        String              // POST | PUT | GET
     endpoint      String
     request_body  Json?
     response_body Json?
     http_status   Int?
     error_code    String?
     error_desc    String?
     duration_ms   Int?
     created_at    DateTime @default(now())

     company       Company  @relation(fields: [company_id], references: [id], onDelete: Cascade)
     invoice       Invoice? @relation(fields: [invoice_id], references: [id])

     @@index([company_id, created_at])
     @@index([invoice_id])
   }

5. Logique de dérivation du groupe de taxation

   Crée src/lib/mecef-mapping.ts avec :

   export function deriveTaxGroup(
     vatRate: number,
     isExport: boolean,
     isExempt: boolean,
     taxRegime: "reel" | "tps"
   ): MecefTaxGroup

   Règles :
     export + taxable        → C
     TPS                     → E
     exonéré (0%, non export)→ A
     taux 18%                → B
     régime d'exception      → D

   Le groupe reste modifiable manuellement dans l'interface : la dérivation
   n'est qu'une valeur par défaut.

6. Détermination automatique du taux d'AIB

   export function deriveAibRate(clientIfu: string | null): MecefAibRate

   Un IFU client valide (13 chiffres) → rate_1, sinon rate_5.
   Prévois que l'utilisateur puisse forcer "none" : l'AIB ne s'applique pas
   à toutes les opérations.

7. Écart d'arrondi HT / TTC

   Comptia calcule en HT puis ajoute la TVA. La DGI reçoit du TTC et ventile.
   Sur des lignes multiples, les arrondis peuvent diverger de quelques francs.

   Ajoute au modèle Invoice :
     mecef_total_ttc  Decimal? @db.Decimal(15, 2)   // total tel que calculé par la DGI

   Après confirmation, compare avec total_ttc. Si l'écart dépasse 1 FCFA,
   journalise un avertissement — la facture imprimée doit porter les montants
   DGI, qui font foi.

8. Migration
   npx prisma migrate dev --name mecef_conformity
   Les factures existantes prennent tax_group = B et aib_rate = none par défaut.
```

---

---

# M3 — Facture PDF conforme

## Contexte

La procédure d'auto-déclaration est formelle : la facture imprimée doit reproduire tous les éléments affichés par le serveur de vérification. Tout écart de montant, d'article ou d'étiquette entraîne le rejet du dossier.

Le QR code est obligatoire et doit être scannable sur les captures envoyées à la DGI.

## Structure imposée

```
┌──────────────────────────────────────────────────────────┐
│              ----- TEST FACTURE !!!! -----               │  ← sandbox uniquement
│                                                          │
│  RAISON SOCIALE            FACTURE DE VENTE              │
│  IFU  : 3202687290154      Facture # TS01019550-1        │
│  RCCM : RB/COT/24 B 12345  Date : 27/08/2026             │
│                            Vendeur : <opérateur>         │
│                            Réf. fact. orig. : <si avoir> │
│  ┌────────────┐  ┌──────────────────┐                    │
│  │ Adresse    │  │ CLIENT           │                    │
│  │ Contact    │  │ Nom / IFU        │                    │
│  │ e-MCF NIM  │  │ Adresse / Contact│                    │
│  └────────────┘  └──────────────────┘                    │
│                                                          │
│  # │ Nom │ Prix unitaire │ Quantité │ Montant T.T.C. │G  │
│                                                          │
│  --- VENTILATION DES IMPÔTS ---                          │
│  Groupe │ Total │ Imposable │ Impôt        Total: 5 800  │
│                                                          │
│  --- RÉPARTITION DES PAIEMENTS ---                       │
│  Type de paiement │ Payé                                 │
│                                                          │
│  --- ÉLÉMENTS DE SÉCURITÉ DE LA FACTURE NORMALISÉE ---   │
│  ┌──────┐   Code MECeF/DGI                               │
│  │ QR   │   TEST-E6SE-HHRM-UZZK-JTLU-RULL                │
│  │ code │   MECeF NIM      TS01019550                    │
│  └──────┘   MECeF Compteurs 1/2 FV                       │
│             MECeF Heure    27/08/2026 17:15:25           │
└──────────────────────────────────────────────────────────┘
```

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.
Fichier : src/lib/pdf-templates/InvoicePDF.tsx

CONTEXTE
La procédure d'auto-déclaration DGI impose que la facture imprimée reproduise
tous les éléments affichés par le serveur de vérification :
  - tous les montants identiques
  - tous les articles identiques
  - tous les éléments de sécurité avec les MÊMES étiquettes et valeurs
  - QR code obligatoire et scannable

Tout écart entraîne le rejet du dossier d'homologation.

TÂCHE

1. En-tête
   - Bandeau rouge "----- TEST FACTURE !!!! -----" en haut ET en bas,
     affiché uniquement si MECEF_MODE !== "production"
   - Bloc émetteur : raison sociale, IFU, RCCM
   - Bloc titre : type de facture en toutes lettres, numéro au format
     {NIM}-{séquence}, date, nom de l'opérateur
   - Pour un avoir (FA/EA) : ligne "Réf. de fact. orig." avec le code MECeF
     de la facture d'origine

2. Bloc client
   Encadré distinct affichant Nom, IFU, Adresse, Contact.
   Ne l'affiche pas si aucune information client n'est renseignée.

3. Tableau des articles
   Colonnes : #, Nom, Prix unitaire, Quantité, Montant T.T.C., Groupe

   Les prix affichés sont TTC — c'est la convention DGI, pas celle de Comptia.
   Le groupe de taxation apparaît en fin de ligne, sous forme de pastille [B].

4. Ventilation des impôts
   Un tableau agrégé par groupe de taxation :
     Groupe │ Total │ Imposable │ Impôt

   Exemple : "B - TAXABLE (18%) │ 5 800 │ 4 915 │ 885"
   Le libellé du groupe doit reprendre exactement la nomenclature DGI.

   Affiche le total général en gros caractères à droite.

5. Répartition des paiements
   Tableau "Type de paiement │ Payé". Par défaut ESPECES.

6. Lignes additionnelles
   - AIB si applicable, avec son taux (1% ou 5%) et son montant
   - Taxe spécifique par article concerné
   - Taxe de séjour le cas échéant

7. Éléments de sécurité — bloc obligatoire en pied

   Encadré titré "--- ÉLÉMENTS DE SÉCURITÉ DE LA FACTURE NORMALISÉE ---"
   contenant :
     - le QR code à gauche (utilise la librairie qrcode, à ajouter si absente)
     - à droite, quatre lignes aux étiquettes EXACTES :
         Code MECeF/DGI    <24 caractères>
         MECeF NIM         <nim>
         MECeF Compteurs   <compteurs>
         MECeF Heure       <horodatage>

   Si la facture n'est pas encore normalisée, affiche à la place, en rouge :
   "La facture n'est pas traitée !"

8. Description supplémentaire et message commercial
   - Jusqu'à 3 lignes de description libre, avant le tableau des articles
   - Message commercial en pied de document, après les éléments de sécurité

9. Format
   A4, adapté à l'impression noir et blanc comme couleur. Le manuel mentionne
   un sélecteur "A4 EN COULEUR" — prévois les deux rendus.

CONTRAINTE
Les étiquettes des éléments de sécurité ne sont pas négociables : la DGI
compare visuellement avec son propre rendu. Reprends-les au caractère près.
```

---

---

# M4 — Dossier d'homologation : les 20 cas de test

## La procédure

D'après la plaquette officielle, cas B (éditeur dont le SFE n'est pas encore approuvé) :

| Étape | Action |
| :---: | :--- |
| 1 | Accéder à la plateforme de test — ✅ fait |
| 2 | S'authentifier — ✅ fait |
| 3 | Consulter la documentation API — ✅ fait |
| 4 | Obtenir le jeton d'accès — ✅ fait (`TS01019550`) |
| 5 | Télécharger le document d'auto-déclaration — ✅ fait |
| 6 | **Réaliser les 20 cas de test et les envoyer à `emecefbenin@finances.bj`** |
| 7 | Recevoir la confirmation d'approbation du SFE |
| 8 | S'enregistrer pour l'utilisation officielle |

Tu es à l'étape 6. C'est celle qui demande du développement.

## Les 20 cas

| # | Type | Contenu | Quantités |
| :---: | :---: | :--- | :--- |
| 1 | FV | Article exonéré | 1 |
| 2 | FV | Article taxable | 1 |
| 3 | FV | Exonéré + taxable | 2 / 3 |
| 4 | FV | Exonéré + taxable, **quantités décimales** | 2,5 / 3,250 |
| 5 | FV | Exonéré + taxable + **IFU et nom client** | 2 / 3 |
| 6 | **FA** | Exonéré + taxable + IFU client | 2 / 3 |
| 7 | FV | Taxable avec **taxe spécifique** + IFU client | 3 |
| 8 | FV | Exonéré + taxable + **AIB 5%** | 2 / 3 |
| 9 | FV | Exonéré + taxable + IFU client + **AIB 1%** | 2 / 3 |
| 10 | FV | Exonéré + taxable avec taxe spécifique + AIB 5% | 2 / 3 |
| 11 | FV | Taxable + IFU client + **taxe de séjour** | 2 |
| 12 | FV | **Article régime d'exception** (groupe D) | 2 |
| 13 | FV | Régime d'exception + taxe spécifique | 2 |
| 14 | FV | **Article régime TPS** (groupe E) | 2 |
| 15 | FV | Régime TPS + taxe spécifique | 2 |
| 16 | **EV** | **Exportation de produits taxables** (groupe C) | 2 |
| 17 | EV | Exonéré + exportation taxable | 2 / 3 |
| 18 | **EA** | Exportation de produits taxables | 2 |
| 19 | EV | Régime TPS | 2 |
| 20 | EA | Régime TPS | 2 |

Pour chaque cas : une capture ou photo de la facture, **avec le QR code lisible et scannable**, et tous les montants visibles.

## Décision produit à prendre

Le formulaire prévoit que tu déclares les types que ton SFE prend en charge. Pour un cas non pertinent, tu peux inscrire « Notre SFE n'utilise pas ce type de facture ». Mais la contrepartie est nette : **ton SFE ne sera pas autorisé à produire ce type après approbation**.

Et surtout : « Tout changement dans le SFE, après l'obtention de l'approbation, exige que l'éditeur envoie une **nouvelle auto-déclaration** et obtienne une **nouvelle approbation** ».

D'où la recommandation : couvre le maximum dès maintenant. Retirer une fonctionnalité coûte moins cher qu'un second cycle d'homologation.

| Élément | Recommandation | Pourquoi |
| :--- | :---: | :--- |
| FV — Facture de vente | **Oui** | Indispensable |
| FA — Facture d'avoir | **Oui** | Déjà géré par Comptia |
| EV — Vente à l'exportation | **Oui** | Bénin–Nigeria, import-export courant |
| EA — Avoir à l'exportation | **Oui** | Corollaire de EV |
| Groupe A — Exonéré | **Oui** | Fréquent (santé, éducation, certains services) |
| Groupe B — Taxable 18% | **Oui** | Indispensable |
| Groupe C — Exportation | **Oui** | Nécessaire pour EV/EA |
| Groupe D — Régime d'exception | **Oui** | Peu fréquent mais peu coûteux à couvrir |
| Groupe E — TPS | **Oui** | Ouvre le marché des micro-entreprises plus tard |
| Groupe F — Réservé | Non | Sans usage documenté à ce jour |
| AIB | **Oui** | Obligatoire dès qu'un client n'a pas d'IFU |
| Taxe spécifique | **Oui** | Exigée aux cas 7, 10, 13, 15 |
| Taxe de séjour | **Oui** | Ouvre le secteur hôtelier |

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.

OBJECTIF
Produire les 20 factures de test exigées par la DGI pour l'homologation du SFE,
puis constituer le dossier d'auto-déclaration.

PRÉREQUIS : M1, M2 et M3 appliqués.

TÂCHE

1. Crée scripts/mecef-homologation.ts

   Un script exécutable qui génère les 20 factures de test sur le sandbox DGI,
   dans l'ordre, et produit un rapport.

   Configuration lue depuis .env (voir Partie 0 du présent document) :
     MECEF_MODE=sandbox
     MECEF_NIM=TS01019550
     MECEF_IFU=3202687290154
     MECEF_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMyMDI2ODcyOTAxNTR8VFMwMTAxOTU1MCIsInJvbGUiOiJUYXhwYXllciIsIm5iZiI6MTc4NzgzOTgwMSwiZXhwIjoxODAzNzM3NDAxLCJpYXQiOjE3ODc4Mzk4MDEsImlzcyI6ImltcG90cy5iaiIsImF1ZCI6ImltcG90cy5iaiJ9.-eq3Dpxmq41NF2zQHXDUT5ZmBDcrwtzd5YTik84O0e0

   Le jeton ne doit jamais être écrit en dur dans le script : lis-le via
   process.env.MECEF_TOKEN et échoue explicitement s'il est absent.

   Articles de référence à utiliser (prix TTC) :
     Exonéré           : "Service de formation exonéré"        600 FCFA, groupe A
     Taxable           : "Développement web"                 1 800 FCFA, groupe B
     Exportation       : "Prestation export logiciel"        2 500 FCFA, groupe C
     Régime exception  : "Fourniture régime d'exception"     1 200 FCFA, groupe D
     TPS               : "Service micro-entreprise"            900 FCFA, groupe E

   Client de test (pour les cas 5, 6, 7, 9, 11) :
     IFU  3201987456123
     Nom  Société Bénin Digital SARL

2. Les 20 cas à générer, dans cet ordre exact :

   1.  FV — exonéré ×1
   2.  FV — taxable ×1
   3.  FV — exonéré ×2 + taxable ×3
   4.  FV — exonéré ×2,5 + taxable ×3,250        (quantités décimales)
   5.  FV — exonéré ×2 + taxable ×3 + client
   6.  FA — exonéré ×2 + taxable ×3 + client     (référence = code MECeF du cas 5)
   7.  FV — taxable ×3 avec taxe spécifique + client
   8.  FV — exonéré ×2 + taxable ×3 + AIB 5%
   9.  FV — exonéré ×2 + taxable ×3 + client + AIB 1%
   10. FV — exonéré ×2 + taxable ×3 avec taxe spécifique + AIB 5%
   11. FV — taxable ×2 + client + taxe de séjour
   12. FV — régime d'exception ×2
   13. FV — régime d'exception ×2 avec taxe spécifique
   14. FV — régime TPS ×2
   15. FV — régime TPS ×2 avec taxe spécifique
   16. EV — exportation taxable ×2
   17. EV — exonéré ×2 + exportation taxable ×3
   18. EA — exportation taxable ×2               (référence = code MECeF du cas 16)
   19. EV — régime TPS ×2
   20. EA — régime TPS ×2                        (référence = code MECeF du cas 19)

   IMPORTANT — les cas 6, 18 et 20 sont des avoirs : ils exigent la référence
   de la facture d'origine (code MECeF/DGI, 24 caractères). Le script doit donc
   mémoriser les codes des cas 5, 16 et 19 et les réinjecter.

3. Pour chaque cas, le script doit :
   - construire le payload
   - appeler POST puis PUT /confirm
   - enregistrer la facture en base avec ses éléments de sécurité
   - générer le PDF via InvoicePDF.tsx
   - sauvegarder le PDF dans ./homologation/test-{NN}.pdf
   - consigner dans un rapport : n° de cas, uid, code MECeF, total DGI,
     total Comptia, écart éventuel, statut

4. Rapport final ./homologation/rapport.md
   Un tableau récapitulatif des 20 cas avec leur statut et, en cas d'échec,
   le code et le libellé d'erreur retournés par la DGI.

5. Vérification manuelle
   Pour chaque facture générée, ouvrir
     https://developper.impots.bj/sygmef-test/verification
   saisir le code MECeF, et comparer l'affichage du serveur avec le PDF produit.
   Les montants, articles et éléments de sécurité doivent coïncider exactement.

   Ajoute au rapport une colonne à cocher pour cette vérification.

6. Gestion des erreurs
   Le script ne doit jamais s'interrompre sur un échec : il consigne l'erreur
   et poursuit. Un cas en échec doit pouvoir être rejoué seul, par exemple
   via `npx tsx scripts/mecef-homologation.ts --only 7`.

CONTRAINTE
Ce script s'exécute exclusivement en mode sandbox. Ajoute une garde qui refuse
de démarrer si MECEF_MODE === "production".
```

---

---

# M5 — Interface et exploitation

## Prompt Antigravity

```
Projet Brightbook Studio (Comptia) — SaaS comptable Bénin.

PRÉREQUIS : M1, M2, M3 appliqués.

TÂCHE

1. Modale de facture — nouveaux champs

   a) Par ligne d'article :
      - Sélecteur de groupe de taxation (A à F) avec libellés explicites :
          A — Exonéré
          B — Taxable 18%
          C — Exportation de produits taxables
          D — TVA régime d'exception
          E — Régime fiscal TPS
        Valeur par défaut dérivée via deriveTaxGroup(), modifiable.
      - Champ taxe spécifique, facultatif, avec l'indication
        "montant total pour la quantité entière".

   b) Au niveau de la facture :
      - Sélecteur AIB : Aucun / 1% / 5%
        Pré-rempli selon l'IFU du client (1% si IFU valide, 5% sinon),
        modifiable.
      - Champ taxe de séjour, facultatif.
      - Description supplémentaire : 3 lignes maximum.
      - Message commercial : une ligne.
      - Pour un avoir : champ obligatoire "Référence facture originale"
        avec masque de saisie ____-____-____-____-____-____ (24 caractères).
        Propose un sélecteur parmi les factures normalisées du même client.

   c) Affichage du prix
      Comptia saisit en HT. Ajoute sous chaque ligne l'équivalent TTC calculé,
      en gris : "TTC : 2 124 FCFA". C'est ce montant qui part à la DGI.

2. Écran Facturation — statut e-MECeF

   Badge par facture :
     draft                          → aucun badge
     awaiting_manual_normalization  → ambre "En attente DGI" + bouton Réessayer
     normalized                     → vert "Normalisée" + code MECeF au survol
     verification_failed            → rouge "Rejetée DGI" + motif au survol

   Bannière en tête de liste si au moins une facture est en attente, avec
   un bouton de retransmission groupée.

3. Route de reprise
   src/app/api/invoices/[id]/retry-mecef/route.ts (POST)

   Logique importante :
     - si mecef_uid est renseigné → la facture existe déjà côté DGI,
       appeler UNIQUEMENT confirmInvoice(uid)
     - sinon → reprendre la séquence complète POST + PUT

   Sans cette distinction, une reprise créerait un doublon côté DGI.

4. Écran de diagnostic — Paramètres → e-MECeF

   Réservé aux rôles owner et admin :
     - mode courant (simulation / sandbox / production)
     - NIM configuré
     - date d'expiration du jeton (lue en décodant le champ exp du JWT), avec alerte à 30 jours
     - bouton "Tester la connexion" appelant GET /api/info/status
     - référentiels récupérés depuis /api/info/taxGroups et /api/info/paymentTypes
     - les 50 derniers appels issus de MecefLog, avec leur statut

   Cet écran est le premier réflexe de diagnostic quand une facture est rejetée.

5. Alerte d'expiration du jeton
   Le jeton actuel expire le 27/02/2027 à 14:10 UTC. Ajoute au calendrier fiscal
   (src/lib/fiscal-alerts.ts) une alerte à 60, 30 et 7 jours de l'échéance.
   Un jeton expiré bloque toute facturation.
```

---

---

# Plan d'exécution

```
Étape 0 — Accès (préalable, 10 minutes)
  Renseigner le .env avec les valeurs de la Partie 0
  Ajouter .env et .env.local au .gitignore (le dépôt est public)
  Exécuter les 5 appels curl de vérification
  Consigner les réponses réelles de taxGroups et paymentTypes

Étape 2 — Schéma
  M2   Groupes de taxation, AIB, taxes additionnelles, MecefLog
  →    npx prisma migrate dev --name mecef_conformity

Étape 3 — Client API
  M1   Réécriture de mecef.ts, séquence POST + PUT, prix TTC
  →    Appeler les 4 endpoints /api/info et consigner les référentiels réels

Étape 4 — Rendu
  M3   Facture PDF conforme au format DGI

Étape 5 — Interface
  M5   Champs de saisie, badges, diagnostic

Étape 6 — Homologation
  M4   Script des 20 cas de test
  →    Vérifier chaque facture sur le serveur de vérification
  →    Remplir le formulaire d'auto-déclaration (annexes 1 et 2)
  →    Envoyer à emecefbenin@finances.bj
  →    Attendre l'approbation
```

---

# Vérifications

## Avant l'envoi du dossier

| # | Contrôle | Critère |
| :---: | :--- | :--- |
| 1 | `GET /api/info/status` | Réponse 200, informations du contribuable correctes |
| 2 | `GET /api/info/taxGroups` | Les 6 groupes correspondent au référentiel A–F |
| 3 | Facture simple (cas 2) | Code MECeF de 24 caractères retourné |
| 4 | QR code | Scannable au téléphone, renvoie vers la vérification DGI |
| 5 | Montants | Total du PDF = total affiché par le serveur de vérification |
| 6 | Quantités décimales (cas 4) | 2,5 et 3,250 acceptées sans arrondi |
| 7 | Avoir (cas 6) | Référence d'origine acceptée, montants négatifs corrects |
| 8 | AIB (cas 8 et 9) | 1% et 5% appliqués, montant visible sur la facture |
| 9 | Taxe spécifique (cas 7) | Montant total pour la quantité, pas unitaire |
| 10 | Export (cas 16) | Groupe C accepté, type EV correct |
| 11 | Étiquettes de sécurité | Identiques au caractère près au rendu DGI |
| 12 | Bandeau TEST | Présent en sandbox, absent en production |

## Après approbation

| # | Contrôle |
| :---: | :--- |
| 1 | Obtenir le NIM de production auprès de la DGI |
| 2 | Basculer `MECEF_MODE=production` |
| 3 | Vérifier que le bandeau TEST disparaît |
| 4 | Émettre une facture réelle de faible montant et la vérifier sur `sygmef.impots.bj` |
| 5 | Confirmer que `MecefLog` enregistre bien les appels de production |

---

*Brightbook Studio / Comptia — d'après la documentation officielle DGI Bénin, e-MECeF v1.0*
