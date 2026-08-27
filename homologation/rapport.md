# Rapport d'Homologation SFE — e-MECeF DGI Bénin

**Éditeur du Système de Facturation Électronique (SFE)** : Brightbook Studio / Comptia  
**Numéro d'Identification Machine (NIM)** : `TS01019550`  
**Identifiant Fiscal Unique (IFU)** : `3202687290154`  
**Date d'exécution des tests** : 27/08/2026  
**Environnement de test** : SyGMEF Sandbox DGI Bénin (`https://developper.impots.bj/sygmef-emcf/api`)  
**Statut Global** : **20/20 Cas de test validés avec succès (100%)**

---

## 📋 Tableau Récapitulatif des 20 Cas d'Homologation

| Cas # | Type | Description du Cas de Test | Montant TTC DGI | Code MECeF / DGI | Compteur DGI | Facture PDF Conforme | Résultat DGI | Lien de Vérification |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **01** | `FV` | 1 article exonéré (Groupe A) | 600 FCFA | `TEST-M54B-L4E7-CFRH-YS5L-NZSZ` | `43/58 FV` | [PDF](./test-01.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **02** | `FV` | 1 article taxable 18% (Groupe B) | 1 800 FCFA | `TEST-EF3D-TS7B-OG2W-SWOW-Q27U` | `44/59 FV` | [PDF](./test-02.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **03** | `FV` | 2 exonérés (A) + 3 taxables (B) | 6 600 FCFA | `TEST-CEVL-33NR-CQD3-EBES-V7YV` | `45/60 FV` | [PDF](./test-03.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **04** | `FV` | Quantités décimales (2,5 A + 3,250 B) | 7 350 FCFA | `TEST-BT4N-HC3J-6GUG-V24U-WR6O` | `46/61 FV` | [PDF](./test-04.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **05** | `FV` | Exonéré + taxable + Client avec IFU | 6 600 FCFA | `TEST-V6BV-4NZK-TLWK-STVZ-NYZN` | `47/62 FV` | [PDF](./test-05.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **06** | `FA` | Avoir sur Cas 5 (Réf: TEST-V6BV...) | 6 600 FCFA | `TEST-HRYL-GISA-AQFV-DAEW-NPXF` | `3/63 FA` | [PDF](./test-06.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **07** | `FV` | Taxable avec 500 FCFA Taxe Spécifique + Client | 5 990 FCFA | `TEST-BIS4-UKCR-CNV2-C6E4-T73A` | `49/64 FV` | [PDF](./test-07.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **08** | `FV` | Exonéré + taxable + AIB 5% (sans IFU) | 6 889 FCFA | `TEST-V2VE-AO7Z-GTQG-W2RL-AKO3` | `50/65 FV` | [PDF](./test-08.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **09** | `FV` | Exonéré + taxable + Client avec IFU + AIB 1% | 6 658 FCFA | `TEST-CCSB-5DB6-LWHJ-S32K-IDLL` | `51/66 FV` | [PDF](./test-09.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **10** | `FV` | Exonéré + taxable avec TS (500) + AIB 5% | 7 504 FCFA | `TEST-NYOW-7VUV-KU7F-7UDP-ESYA` | `52/67 FV` | [PDF](./test-10.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **11** | `FV` | Taxable + Client + Taxe de séjour (1 000 FCFA) | 3 600 FCFA | `TEST-7KWR-QLEI-AZ4X-WD64-QLW3` | `53/68 FV` | [PDF](./test-11.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **12** | `FV` | Régime d'exception TVA (Groupe D) ×2 | 2 400 FCFA | `TEST-LHH7-BB6A-L3HR-MIQ5-XKVZ` | `54/69 FV` | [PDF](./test-12.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **13** | `FV` | Régime d'exception (D) avec TS (500 FCFA) | 2 990 FCFA | `TEST-25FE-LBEG-63LA-4QCS-DJXZ` | `55/70 FV` | [PDF](./test-13.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **14** | `FV` | Régime fiscal TPS (Groupe E) ×2 | 1 800 FCFA | `TEST-X25R-4ZTV-SJ5G-RS63-5KFO` | `56/71 FV` | [PDF](./test-14.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **15** | `FV` | Régime TPS (E) avec TS (300 FCFA) | 2 100 FCFA | `TEST-J3FR-V7EJ-RVV6-SO4L-KBYD` | `57/72 FV` | [PDF](./test-15.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **16** | `EV` | Exportation taxable (Groupe C) ×2 | 5 000 FCFA | `TEST-M4FD-RGFM-47VR-CFCH-O3CB` | `10/73 EV` | [PDF](./test-16.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **17** | `EV` | Mixte Exportation (2 Exonéré + 3 Export C) | 8 700 FCFA | `TEST-3PZV-DNRE-FR33-62BB-NTLC` | `11/74 EV` | [PDF](./test-17.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **18** | `EA` | Avoir sur Exportation Cas 16 (Réf: TEST-M4FD...) | 5 000 FCFA | `TEST-RDRT-RDDB-LVBA-U6KL-K4MR` | `3/75 EA` | [PDF](./test-18.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **19** | `EV` | Exportation sous Régime TPS (Groupe E) ×2 | 1 800 FCFA | `TEST-QLW7-TMY6-WNTV-IQ6B-KF3U` | `12/76 EV` | [PDF](./test-19.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |
| **20** | `EA` | Avoir sur Exportation TPS Cas 19 (Réf: TEST-QLW7...) | 1 800 FCFA | `TEST-U4AY-NM2K-VTO5-TDQP-FW7Z` | `4/77 EA` | [PDF](./test-20.pdf) | ✅ SUCCÈS | [Vérifier en ligne](https://developper.impots.bj/sygmef-test/verification) |

---

## 🔍 Conformité Technique & Réglementaire Validée

1. **Séquence officielle en 2 étapes** :
   - `POST /api/invoice` pour l'enregistrement et le calcul des assiettes fiscales.
   - `PUT /api/invoice/{uid}/confirm` pour la finalisation et l'obtention des éléments de sécurité officiels.
2. **Prix TTC au franc CFA entier (XOF)** : conversion systématique et ventilation automatique par la DGI.
3. **Référentiel des Groupes de Taxation respecté à 100%** :
   - `A` = Exonéré (0%)
   - `B` = Taxable (18%)
   - `C` = Exportation de produits taxables (0%)
   - `D` = TVA régime d'exception (18%)
   - `E` = Régime fiscal TPS (0%)
4. **Gestion de l'AIB (1% IFU valide / 5% sans IFU)**, de la **Taxe Spécifique (TS)** et de la **Taxe de séjour**.
5. **Éléments de sécurité et QR code scannable** reproduits à l'identique sur toutes les factures PDF.
6. **Journalisation intégrale `MecefLog`** de tous les flux HTTP pour la traçabilité fiscale.
