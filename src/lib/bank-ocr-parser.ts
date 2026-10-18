import { parseFrenchDate, parseFrenchNumber, RawBankOperation } from "./csv-parser";

const FRENCH_MONTHS: Record<string, string> = {
  janvier: "01",
  janv: "01",
  jan: "01",
  fevrier: "02",
  février: "02",
  fevr: "02",
  févr: "02",
  fev: "02",
  mars: "03",
  mar: "03",
  avril: "04",
  avr: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  juil: "07",
  jul: "07",
  aout: "08",
  août: "08",
  aou: "08",
  septembre: "09",
  sept: "09",
  sep: "09",
  octobre: "10",
  oct: "10",
  novembre: "11",
  nov: "11",
  decembre: "12",
  décembre: "12",
  dec: "12",
  déc: "12",
};

export interface BankStatementMetadata {
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  periodStart?: string;
  periodEnd?: string;
  initialBalance?: number;
  finalBalance?: number;
  hasZeroMovement?: boolean;
}

export interface BankOCRAnalysisResult {
  metadata: BankStatementMetadata;
  operations: RawBankOperation[];
  rawText: string;
}

/**
 * Convertit une date textuelle (ex: "18 oct 2026", "24-novembre-2026", "05/04/2026")
 * en format ISO "YYYY-MM-DD"
 */
export function normalizeDateFromText(text: string): string {
  if (!text) return new Date().toISOString().split("T")[0];

  const trimmed = text.trim();

  // 1. Chercher un mois en toutes lettres : ex "18 octobre 2026" ou "18-oct-26"
  const monthNameMatch = trimmed.match(/(\d{1,2})[\s\-\/\.]([a-zA-Zàâäéèêëîïôöùûüç]+)[\s\-\/\.](\d{2,4})/i);
  if (monthNameMatch) {
    const day = monthNameMatch[1].padStart(2, "0");
    const rawMonth = monthNameMatch[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let year = monthNameMatch[3];
    if (year.length === 2) {
      year = "20" + year;
    }

    const monthNum = FRENCH_MONTHS[rawMonth] || Object.keys(FRENCH_MONTHS).find(k => rawMonth.startsWith(k)) ? FRENCH_MONTHS[Object.keys(FRENCH_MONTHS).find(k => rawMonth.startsWith(k))!] : undefined;

    if (monthNum) {
      return `${year}-${monthNum}-${day}`;
    }
  }

  // 2. Utiliser le parseur standard DD/MM/YYYY
  return parseFrenchDate(trimmed);
}

/**
 * Extrait les métadonnées d'en-tête et de soldes d'un relevé bancaire (ex: Bank of Africa, Ecobank, UBA)
 */
export function parseBankStatementMetadata(text: string): BankStatementMetadata {
  if (!text) return {};

  const meta: BankStatementMetadata = {};

  // 1. Détection de la banque
  const bankMatch = text.match(/(?:BANK OF AFRICA|BOA|ECOBANK|UBA|SOCIETE GENERALE|SGB|CORIS BANK|CORIS|NSIA BANQUE|NSIA|BIIC|BSIC|BGFIBANK|BGFI|ORABANK|CBAO|AFRILAND|CCEI)/i);
  if (bankMatch) {
    const b = bankMatch[0].toUpperCase();
    if (b.includes("AFRICA") || b === "BOA") meta.bankName = "BANK OF AFRICA (BOA)";
    else if (b.includes("ECOBANK")) meta.bankName = "ECOBANK BÉNIN";
    else if (b.includes("UBA")) meta.bankName = "UBA BÉNIN";
    else if (b.includes("SOCIETE") || b === "SGB") meta.bankName = "SOCIÉTÉ GÉNÉRALE";
    else if (b.includes("CORIS")) meta.bankName = "CORIS BANK INTERNATIONAL";
    else if (b.includes("BIIC")) meta.bankName = "BIIC BÉNIN";
    else meta.bankName = b;
  }

  // 2. Numéro de compte
  const accountMatch = text.match(/compte[\s:#]*([0-9A-Z]{8,24})/i);
  if (accountMatch) {
    meta.accountNumber = accountMatch[1].replace(/[^0-9A-Z]/g, "");
  }

  // 3. Période du relevé
  const periodMatch = text.match(/p[eé]riode\s+du\s+(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})\s+au\s+(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i);
  if (periodMatch) {
    meta.periodStart = normalizeDateFromText(periodMatch[1]);
    meta.periodEnd = normalizeDateFromText(periodMatch[2]);
  }

  // 4. Titulaire du compte
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const accountIdx = lines.findIndex(l => /compte[\s:#]*[0-9A-Z]+/i.test(l));
  if (accountIdx !== -1 && accountIdx + 1 < lines.length) {
    const candidateHolder = lines[accountIdx + 1].trim();
    if (candidateHolder.length >= 3 && !/date|solde|relevé|page/i.test(candidateHolder)) {
      meta.accountHolder = candidateHolder;
    }
  }

  // 5. Soldes (Ancien solde et Nouveau solde)
  const ancienLine = lines.find(l => /ancien\s+solde/i.test(l));
  if (ancienLine) {
    const nums = ancienLine.match(/\b\d{1,3}(?:[\s.]\d{3})*(?:[,\.]\d{2})?\b/g);
    if (nums && nums.length > 0) {
      const lastNum = nums[nums.length - 1];
      meta.initialBalance = Math.abs(parseFrenchNumber(lastNum));
    }
  }

  const nouveauLine = lines.find(l => /nouveau\s+solde/i.test(l));
  if (nouveauLine) {
    const nums = nouveauLine.match(/\b\d{1,3}(?:[\s.]\d{3})*(?:[,\.]\d{2})?\b/g);
    if (nums && nums.length > 0) {
      const lastNum = nums[nums.length - 1];
      meta.finalBalance = Math.abs(parseFrenchNumber(lastNum));
    }
  }

  // 6. Détection de relevé sans mouvements (0 débits, 0 crédits)
  const totauxZeroMatch = text.match(/totaux[\s:]*0[\s|]+0/i) || text.match(/débit[\s:]*0\b[\s\S]*?crédit[\s:]*0\b/i);
  if (
    totauxZeroMatch ||
    (meta.initialBalance !== undefined &&
      meta.finalBalance !== undefined &&
      meta.initialBalance === meta.finalBalance)
  ) {
    meta.hasZeroMovement = true;
  }

  return meta;
}

/**
 * Analyse le texte brut extrait d'une image ou d'un PDF de relevé / reçu bancaire / MoMo
 * et extrait des opérations bancaires structurées.
 */
export function parseBankTextToOperations(text: string): RawBankOperation[] {
  if (!text || !text.trim()) return [];

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const operations: RawBankOperation[] = [];

  // Mots-clés excluant les lignes de récapitulatif / soldes
  const skipKeywords = [
    "ancien solde",
    "nouveau solde",
    "solde initial",
    "solde final",
    "solde precedent",
    "solde précédent",
    "totaux",
    "total mouvements",
    "sauf erreur",
    "page 1",
    "page 2",
    "relevé de compte",
  ];

  // Expression régulière pour dates : DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, ou 18 oct 2026
  const dateRegex = /\b(\d{1,2}[\s\/\.\-](?:[a-zA-Z]{3,10}|\d{1,2})[\s\/\.\-]\d{2,4}|\d{4}[/.-]\d{1,2}[/.-]\d{1,2})\b/i;

  // Expression pour montants (ex: 150 000, 150.000, 150,000.00, 15 000 F CFA)
  const amountRegex = /(?:^|\s)([-+]?\s*\d{1,3}(?:[ \t.]\d{3})*(?:[,\.]\d{2})?)\s*(?:FCFA|CFA|F CFA|XOF|F)?(?:\s|$)/i;

  const creditKeywords = [
    "credit",
    "crédit",
    "versement",
    "recu",
    "reçu",
    "virement recu",
    "virement reçu",
    "encaissement",
    "depot",
    "dépôt",
    "entree",
    "entrée",
    "remise",
    "alimentation",
  ];

  const debitKeywords = [
    "debit",
    "débit",
    "retrait",
    "frais",
    "agio",
    "commission",
    "prelevement",
    "prélèvement",
    "paiement",
    "sortie",
    "depense",
    "dépense",
    "transfert",
    "achat",
    "cotisation",
    "redevance",
    "facture",
  ];

  // 1. Détection de format spécifique Mobile Money (MTN MoMo, Moov, Celtiis)
  const momoReceivedMatch = text.match(/(?:vous avez re[cç]u|transfert re[cç]u de)\s*([\d\s\.,]+)\s*(?:FCFA|F CFA|CFA|XOF)?/i);
  const momoSentMatch = text.match(/(?:transfert r[eé]ussi|vous avez envoy[eé]|paiement marchand|paiement de)\s*([\d\s\.,]+)\s*(?:FCFA|F CFA|CFA|XOF)?/i);

  if (momoReceivedMatch || momoSentMatch) {
    const isCredit = Boolean(momoReceivedMatch);
    const rawAmt = isCredit ? momoReceivedMatch![1] : momoSentMatch![1];
    const amountVal = Math.abs(parseFrenchNumber(rawAmt));

    if (amountVal >= 100) {
      const dateMatch = text.match(dateRegex);
      const dateStr = dateMatch ? normalizeDateFromText(dateMatch[0]) : new Date().toISOString().split("T")[0];

      // Extraction Référence transaction MoMo
      const refMatch = text.match(/(?:ID\s*(?:de\s*transaction)?|r[eé]f|TxId)[\s:]*([A-Za-z0-9\-]+)/i);
      const ref = refMatch ? refMatch[1] : undefined;

      // Émetteur / Destinataire MoMo
      let party = "";
      const partyMatch = text.match(/(?:de|vers|à|a)\s+([A-Za-z0-9\s\+]{4,30}?)(?=\s*(?:\.|\n|ID|Ref|Frais|Nouveau|Montant|$))/i);
      if (partyMatch) {
        party = partyMatch[1].trim();
      }

      operations.push({
        date: dateStr,
        description: isCredit
          ? `MoMo Reçu${party ? ` de ${party}` : ""}`
          : `MoMo Paiement / Virement${party ? ` vers ${party}` : ""}`,
        reference: ref,
        amount: isCredit ? amountVal : -amountVal,
      });

      return operations;
    }
  }

  // 2. Analyse ligne par ligne (Relevés bancaires tabulaires ou multi-lignes)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Ignorer les lignes d'en-tête de solde ou totaux
    if (skipKeywords.some((kw) => lowerLine.includes(kw))) {
      continue;
    }

    const dateMatch = line.match(dateRegex);

    if (dateMatch) {
      const dateStr = normalizeDateFromText(dateMatch[0]);

      // Chercher le montant dans la même ligne ou les 2 lignes suivantes
      let matchedAmount: number | null = null;
      let matchedDesc = line.replace(dateMatch[0], "").trim();
      let isDebit = false;
      let isCredit = false;

      if (debitKeywords.some((kw) => lowerLine.includes(kw))) isDebit = true;
      if (creditKeywords.some((kw) => lowerLine.includes(kw))) isCredit = true;

      // Chercher le montant
      const numbersInLine = line.match(new RegExp(amountRegex, "g"));
      if (numbersInLine && numbersInLine.length > 0) {
        // Prendre le dernier nombre qui ressemble à un montant monétaire (au moins >= 100)
        for (let n = numbersInLine.length - 1; n >= 0; n--) {
          const val = parseFrenchNumber(numbersInLine[n]);
          if (Math.abs(val) >= 100) {
            matchedAmount = val;
            break;
          }
        }
      }

      // Si pas trouvé sur la même ligne, regarder la ligne suivante
      if (matchedAmount === null && i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const nextLower = nextLine.toLowerCase();
        if (!skipKeywords.some((kw) => nextLower.includes(kw))) {
          const nextAmounts = nextLine.match(new RegExp(amountRegex, "g"));
          if (nextAmounts && nextAmounts.length > 0) {
            const val = parseFrenchNumber(nextAmounts[nextAmounts.length - 1]);
            if (Math.abs(val) >= 100) {
              matchedAmount = val;
              matchedDesc += " " + nextLine;
            }
          }
        }
      }

      if (matchedAmount !== null && Math.abs(matchedAmount) > 0) {
        // Appliquer le signe selon les mots-clés
        let finalAmount = Math.abs(matchedAmount);
        if (isDebit && !isCredit) {
          finalAmount = -finalAmount;
        } else if (matchedAmount < 0) {
          finalAmount = matchedAmount;
        }

        // Nettoyage de la description
        let cleanDesc = matchedDesc
          .replace(/[+−-]?\s*\d{1,3}(?:[ \t.]\d{3})*(?:[,\.]\d{2})?\s*(?:FCFA|CFA|F CFA|XOF|F)?/gi, "")
          .replace(/\s+/g, " ")
          .trim();

        if (cleanDesc.length < 3) {
          cleanDesc = `Opération du ${dateStr}`;
        }

        // Détection de référence
        const refMatch = line.match(/\b(VIR[-_0-9a-zA-Z]+|CHQ[-_0-9a-zA-Z]+|TXN[-_0-9a-zA-Z]+|ID:?\s*[0-9]+)\b/i);
        const ref = refMatch ? refMatch[0].replace(/ID:?\s*/i, "") : undefined;

        operations.push({
          date: dateStr,
          description: cleanDesc,
          reference: ref,
          amount: finalAmount,
        });
      }
    }
  }

  // 3. Cas particulier : Ticket / Reçu unique (Bordereau de versement, avis d'opéré unique)
  if (operations.length === 0) {
    const isBalanceOnly = lines.some((l) => /ancien\s+solde|nouveau\s+solde|totaux/i.test(l));
    if (!isBalanceOnly) {
      const dateMatch = text.match(dateRegex);
      const dateStr = dateMatch ? normalizeDateFromText(dateMatch[0]) : new Date().toISOString().split("T")[0];

      // Trouver le montant principal
      const numbers = text.match(new RegExp(amountRegex, "g"));
      if (numbers && numbers.length > 0) {
        let maxVal = 0;
        for (const n of numbers) {
          const val = Math.abs(parseFrenchNumber(n));
          if (val > maxVal) maxVal = val;
        }

        if (maxVal >= 100) {
          const lower = text.toLowerCase();
          const isDebit = debitKeywords.some((kw) => lower.includes(kw));
          const isCredit = creditKeywords.some((kw) => lower.includes(kw));

          // Détection référence
          const refMatch = text.match(/\b(VIR[-_0-9a-zA-Z]+|TXN[-_0-9a-zA-Z]+|ID:?\s*[0-9]+|REF:?\s*[0-9a-zA-Z]+|CHQ[-_0-9a-zA-Z]+)\b/i);
          const ref = refMatch ? refMatch[0] : undefined;

          // Première ligne significative comme libellé
          const firstLine = lines.find((l) => l.length > 5 && !dateRegex.test(l)) || (isCredit ? "Versement bancaire" : "Opération bancaire");

          operations.push({
            date: dateStr,
            description: firstLine.slice(0, 100),
            reference: ref,
            amount: isDebit && !isCredit ? -maxVal : maxVal,
          });
        }
      }
    }
  }

  return operations;
}

/**
 * Analyse complète d'un document bancaire : extrait métadonnées et opérations
 */
export function analyzeBankDocumentText(text: string): BankOCRAnalysisResult {
  const metadata = parseBankStatementMetadata(text);
  const operations = parseBankTextToOperations(text);

  return {
    metadata,
    operations,
    rawText: text,
  };
}
