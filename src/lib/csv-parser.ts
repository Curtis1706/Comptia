/**
 * Parser universel de relevé bancaire et journal comptable CSV
 * Conforme SYSCOHADA & spécifications Ceilow
 */

export interface ParsedJournalLine {
  account_code: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface ParsedEntry {
  date: string; // YYYY-MM-DD
  journal: string;
  description: string;
  reference?: string;
  lines: ParsedJournalLine[];
}

export interface ParseCSVResult {
  entries: ParsedEntry[];
  type: "journal" | "bank_statement";
  totalEntries: number;
  totalLines: number;
  delimiter: string;
}

/**
 * Détecte automatiquement le séparateur CSV le plus probable (;, ,, \t)
 */
export function detectDelimiter(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(0, 10);

  if (lines.length === 0) return ";";

  const delimiters = [";", ",", "\t"];
  const scores: Record<string, number> = { ";": 0, ",": 0, "\t": 0 };

  for (const line of lines) {
    let inQuotes = false;
    const counts: Record<string, number> = { ";": 0, ",": 0, "\t": 0 };

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (!inQuotes && (char === ";" || char === "," || char === "\t")) {
        counts[char]++;
      }
    }

    for (const d of delimiters) {
      if (counts[d] > 0) scores[d] += counts[d];
    }
  }

  // Priorité au point-virgule souvent utilisé en zone francophone
  if (scores[";"] > 0 && scores[";"] >= scores[","] && scores[";"] >= scores["\t"]) {
    return ";";
  }
  if (scores["\t"] > scores[","] && scores["\t"] > scores[";"]) {
    return "\t";
  }
  return scores[","] > scores[";"] ? "," : ";";
}

/**
 * Nettoie et convertit un montant au format francophone (ex: "5 000 000", "5.000.000,00", "(345 000)")
 */
export function parseFrenchNumber(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;

  let str = String(val).trim();
  if (!str) return 0;

  // Détection montant négatif entre parenthèses ex: (5 000)
  let isNegative = false;
  if (str.startsWith("(") && str.endsWith(")")) {
    isNegative = true;
    str = str.slice(1, -1).trim();
  } else if (str.startsWith("-")) {
    isNegative = true;
    str = str.slice(1).trim();
  }

  // Supprimer symboles monétaires et espaces (y compris espace insécable \u00A0)
  str = str.replace(/[FCFA|CFA|EUR|USD|€|\$|F\b]/gi, "").replace(/[\s\u00A0]/g, "");

  // Si le nombre contient à la fois '.' et ','
  if (str.includes(".") && str.includes(",")) {
    const dotIndex = str.indexOf(".");
    const commaIndex = str.indexOf(",");
    if (dotIndex < commaIndex) {
      // Format 5.000.000,00 -> retirer les points, remplacer la virgule par un point
      str = str.replace(/\./g, "").replace(",", ".");
    } else {
      // Format 5,000,000.00 -> retirer les virgules
      str = str.replace(/,/g, "");
    }
  } else if (str.includes(",")) {
    // Format 5000,50 ou 5000000,00 -> remplacer la virgule
    str = str.replace(",", ".");
  }

  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return isNegative ? -num : num;
}

/**
 * Normalise une date francophone ou ISO vers YYYY-MM-DD
 */
export function parseFrenchDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];

  const trimmed = dateStr.trim();

  // Format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Format DD/MM/YYYY ou DD-MM-YYYY ou DD.MM.YYYY
  const parts = trimmed.split(/[/.-]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY/MM/DD
      const y = parts[0];
      const m = parts[1].padStart(2, "0");
      const d = parts[2].padStart(2, "0");
      return `${y}-${m}-${d}`;
    } else if (parts[2].length === 4) {
      // DD/MM/YYYY
      const d = parts[0].padStart(2, "0");
      const m = parts[1].padStart(2, "0");
      const y = parts[2];
      return `${y}-${m}-${d}`;
    }
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
}

/**
 * Découpe un fichier CSV en tableau 2D en gérant les guillemets et sauts de ligne
 */
export function parseCSVToRows(text: string, delimiter?: string): string[][] {
  const delim = delimiter || detectDelimiter(text);
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Sauter le guillemet échappé
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delim && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Analyse et structure le CSV (relevé bancaire ou journal) en écritures SYSCOHADA complètes
 */
export function detectAndParseCSV(text: string): ParseCSVResult {
  const delimiter = detectDelimiter(text);
  const rawRows = parseCSVToRows(text, delimiter);

  if (rawRows.length === 0) {
    return {
      entries: [],
      type: "journal",
      totalEntries: 0,
      totalLines: 0,
      delimiter,
    };
  }

  // Recherche de l'en-tête
  let headerIndex = 0;
  for (let i = 0; i < Math.min(rawRows.length, 5); i++) {
    const rowStr = rawRows[i].join(" ").toLowerCase();
    if (
      rowStr.includes("date") ||
      rowStr.includes("libell") ||
      rowStr.includes("debit") ||
      rowStr.includes("credit") ||
      rowStr.includes("montant")
    ) {
      headerIndex = i;
      break;
    }
  }

  const header = rawRows[headerIndex].map((h) => h.toLowerCase());
  const dataRows = rawRows.slice(headerIndex + 1);

  // Détection des indices de colonnes
  const colDate = header.findIndex((h) => h.includes("date") || h.includes("jour"));
  const colJournal = header.findIndex((h) => h.includes("journal"));
  const colDesc = header.findIndex(
    (h) => h.includes("libell") || h.includes("desc") || h.includes("motif") || h.includes("opérat") || h.includes("detail")
  );
  const colAccount = header.findIndex((h) => h.includes("compte") || h.includes("account") || h.includes("numéro"));
  const colDebit = header.findIndex((h) => h.includes("debit") || h.includes("débit") || h.includes("dépense") || h.includes("retrait") || h.includes("sortie"));
  const colCredit = header.findIndex((h) => h.includes("credit") || h.includes("crédit") || h.includes("recette") || h.includes("versement") || h.includes("entrée"));
  const colAmount = header.findIndex((h) => h.includes("montant") || h.includes("solde") || h.includes("valeur"));

  const isFullJournal = colAccount !== -1 && (colDebit !== -1 || colCredit !== -1);

  if (isFullJournal) {
    // Mode Journal standard
    const entriesMap: Record<string, ParsedEntry> = {};

    dataRows.forEach((cols, idx) => {
      if (cols.length < 3) return;
      const dateRaw = colDate !== -1 ? cols[colDate] : "";
      const date = parseFrenchDate(dateRaw);
      const journal = colJournal !== -1 && cols[colJournal] ? cols[colJournal].toLowerCase() : "od";
      const desc = colDesc !== -1 && cols[colDesc] ? cols[colDesc] : `Écriture ligne ${idx + 1}`;
      const account = colAccount !== -1 && cols[colAccount] ? cols[colAccount].replace(/\s/g, "") : "471";
      const debit = colDebit !== -1 ? parseFrenchNumber(cols[colDebit]) : 0;
      const credit = colCredit !== -1 ? parseFrenchNumber(cols[colCredit]) : 0;

      const key = `${date}-${journal}-${desc}`;
      if (!entriesMap[key]) {
        entriesMap[key] = {
          date,
          journal,
          description: desc,
          lines: [],
        };
      }

      entriesMap[key].lines.push({
        account_code: account,
        debit,
        credit,
        description: desc,
      });
    });

    const entries = Object.values(entriesMap);
    let totalLines = 0;
    entries.forEach((e) => (totalLines += e.lines.length));

    return {
      entries,
      type: "journal",
      totalEntries: entries.length,
      totalLines,
      delimiter,
    };
  }

  // Mode Relevé Bancaire (mouvements unilatéraux -> équilibrage 521 / 471)
  const entries: ParsedEntry[] = [];

  dataRows.forEach((cols, idx) => {
    if (cols.length < 2) return;

    const dateRaw = colDate !== -1 ? cols[colDate] : cols[0];
    const date = parseFrenchDate(dateRaw);

    const desc = colDesc !== -1 && cols[colDesc] ? cols[colDesc] : cols[1] || `Opération bancaire ${idx + 1}`;

    let debit = 0;
    let credit = 0;

    if (colDebit !== -1 && colCredit !== -1) {
      debit = parseFrenchNumber(cols[colDebit]);
      credit = parseFrenchNumber(cols[colCredit]);
    } else if (colAmount !== -1) {
      const amount = parseFrenchNumber(cols[colAmount]);
      if (amount > 0) credit = amount;
      else if (amount < 0) debit = Math.abs(amount);
    } else if (cols.length >= 3) {
      // Fallback par position si 3 colonnes : Date, Libellé, Montant
      const amount = parseFrenchNumber(cols[2]);
      if (amount > 0) credit = amount;
      else if (amount < 0) debit = Math.abs(amount);
    }

    if (debit === 0 && credit === 0) return;

    // Règle SYSCOHADA pour relevé bancaire :
    // - Un crédit sur le relevé (entrée de fonds / ex: versement capital) :
    //   -> Débit du compte 521 (Banque), Crédit du compte 471 (Attente)
    // - Un débit sur le relevé (sortie de fonds / ex: frais, virement) :
    //   -> Crédit du compte 521 (Banque), Débit du compte 471 (Attente)
    const lines: ParsedJournalLine[] = [];

    if (credit > 0) {
      lines.push({
        account_code: "521",
        debit: credit,
        credit: 0,
        description: desc,
      });
      lines.push({
        account_code: "471",
        debit: 0,
        credit: credit,
        description: `Attente régularisation - ${desc}`,
      });
    } else if (debit > 0) {
      lines.push({
        account_code: "521",
        debit: 0,
        credit: debit,
        description: desc,
      });
      lines.push({
        account_code: "471",
        debit: debit,
        credit: 0,
        description: `Attente régularisation - ${desc}`,
      });
    }

    entries.push({
      date,
      journal: "bank",
      description: desc,
      lines,
    });
  });

  return {
    entries,
    type: "bank_statement",
    totalEntries: entries.length,
    totalLines: entries.length * 2,
    delimiter,
  };
}
