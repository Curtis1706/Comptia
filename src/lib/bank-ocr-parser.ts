import { parseFrenchDate, parseFrenchNumber, RawBankOperation } from "./csv-parser";

/**
 * Analyse le texte brut extrait d'une image ou d'un PDF de relevé / reçu bancaire / MoMo
 * et tente d'en extraire des opérations bancaires structurées.
 */
export function parseBankTextToOperations(text: string): RawBankOperation[] {
  if (!text || !text.trim()) return [];

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const operations: RawBankOperation[] = [];

  // Expression régulière pour dates : DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY ou YYYY-MM-DD
  const dateRegex = /\b(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{4}[/.-]\d{1,2}[/.-]\d{1,2})\b/;

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
    "solde créditeur",
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
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(dateRegex);

    if (dateMatch) {
      const dateStr = parseFrenchDate(dateMatch[0]);

      // Chercher le montant dans la même ligne ou les 2 lignes suivantes
      let matchedAmount: number | null = null;
      let matchedDesc = line.replace(dateMatch[0], "").trim();
      let isDebit = false;
      let isCredit = false;

      const lowerLine = line.toLowerCase();
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
        const nextAmounts = nextLine.match(new RegExp(amountRegex, "g"));
        if (nextAmounts && nextAmounts.length > 0) {
          const val = parseFrenchNumber(nextAmounts[nextAmounts.length - 1]);
          if (Math.abs(val) >= 100) {
            matchedAmount = val;
            matchedDesc += " " + nextLine;
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

  // Cas particulier : Ticket / Reçu unique (Mobile Money SMS, bordereau de banque avec 1 montant global)
  if (operations.length === 0) {
    const dateMatch = text.match(dateRegex);
    const dateStr = dateMatch ? parseFrenchDate(dateMatch[0]) : new Date().toISOString().split("T")[0];

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

        // Détection référence
        const refMatch = text.match(/\b(VIR[-_0-9a-zA-Z]+|TXN[-_0-9a-zA-Z]+|ID:?\s*[0-9]+|REF:?\s*[0-9a-zA-Z]+)\b/i);
        const ref = refMatch ? refMatch[0] : undefined;

        // Première ligne significative comme libellé
        const firstLine = lines.find((l) => l.length > 5 && !dateRegex.test(l)) || "Opération bancaire / MoMo";

        operations.push({
          date: dateStr,
          description: firstLine.slice(0, 100),
          reference: ref,
          amount: isDebit ? -maxVal : maxVal,
        });
      }
    }
  }

  return operations;
}
