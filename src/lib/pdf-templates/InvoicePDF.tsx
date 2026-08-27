import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { formatCFA_simple } from "@/lib/pdf-templates/pdf-utils";
import { TAX_GROUP_LABELS, toMecefPrice, type MecefTaxGroup } from "@/lib/mecef-mapping";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  testBanner: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    textAlign: "center",
    padding: 4,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 10,
  },
  testBannerBottom: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    textAlign: "center",
    padding: 4,
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 2,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#1e3a8a",
    paddingBottom: 12,
    marginBottom: 12,
  },
  companyBlock: {
    width: "55%",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 3,
  },
  companyText: {
    fontSize: 8.5,
    color: "#374151",
    marginBottom: 1.5,
  },
  docTitleBlock: {
    width: "45%",
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e3a8a",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  docRef: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  docSubText: {
    fontSize: 8.5,
    color: "#4b5563",
    marginBottom: 1.5,
  },
  clientBox: {
    padding: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 10,
    width: "55%",
  },
  clientBoxTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  clientName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  clientInfo: {
    fontSize: 8.5,
    color: "#374151",
    marginBottom: 1,
  },
  descriptionBox: {
    padding: 6,
    backgroundColor: "#f8fafc",
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 8.5,
    color: "#334155",
    fontStyle: "italic",
  },
  table: {
    width: "100%",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    padding: 5,
    borderRadius: 2,
  },
  th: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  td: {
    fontSize: 8.5,
    color: "#1f2937",
  },
  taxSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  taxBreakdownTable: {
    width: "60%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  taxTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  taxTableRow: {
    flexDirection: "row",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  totalsBox: {
    width: "36%",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 6,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderTopWidth: 1.5,
    borderTopColor: "#1e3a8a",
    marginTop: 4,
  },
  paymentTable: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  securityBlock: {
    borderWidth: 1.5,
    borderColor: "#1e3a8a",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#f8fafc",
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  securityContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrCodeImg: {
    width: 65,
    height: 65,
    marginRight: 12,
  },
  securityLabelsCol: {
    width: 100,
  },
  securityValuesCol: {
    flex: 1,
  },
  securityLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 2.5,
  },
  securityValue: {
    fontSize: 8.5,
    color: "#111827",
    fontFamily: "Courier",
    fontWeight: "bold",
    marginBottom: 2.5,
  },
  unprocessedWarning: {
    color: "#dc2626",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    padding: 6,
  },
  commercialMessage: {
    textAlign: "center",
    fontSize: 8.5,
    fontStyle: "italic",
    color: "#4b5563",
    marginTop: 4,
    marginBottom: 4,
  },
});

export const InvoicePDF = ({ invoice, company }: { invoice: any; company: any }) => {
  const mode = (process.env.MECEF_MODE || "sandbox").toLowerCase();
  const isProduction = mode === "production";
  const isQuote = invoice.type === "quote";

  // Document Title selon nomenclature DGI
  let docTitle = "FACTURE DE VENTE";
  if (invoice.type === "credit_note") docTitle = "FACTURE D'AVOIR";
  else if (invoice.type === "export_sale") docTitle = "FACTURE DE VENTE À L'EXPORTATION";
  else if (invoice.type === "export_credit_note") docTitle = "FACTURE D'AVOIR À L'EXPORTATION";
  else if (isQuote) docTitle = "DEVIS";

  const nim = invoice.mecef_nim || process.env.MECEF_NIM || "TS01019550";
  const invoiceSeq = invoice.mecef_counters?.split(" ")?.[0]?.replace("/", "-") || "1";
  const invoiceNumFormatted = invoice.reference?.includes("-")
    ? invoice.reference
    : `${nim}-${invoiceSeq}`;

  const issueDateStr = invoice.issue_date
    ? new Date(invoice.issue_date).toLocaleDateString("fr-FR")
    : new Date().toLocaleDateString("fr-FR");

  // Items processing (TTC computation)
  const lines = invoice.lines || [];
  const processedLines = lines.map((line: any, idx: number) => {
    const qty = Number(line.quantity || 1);
    const unitPriceHT = Number(line.unit_price || 0);
    const vatRate = Number(line.vat_rate || 0);
    const taxGroup = (line.tax_group || (vatRate === 18 ? "B" : "A")) as MecefTaxGroup;
    const priceTTC = toMecefPrice(unitPriceHT, vatRate);
    const taxSpecific = line.tax_specific ? Number(line.tax_specific) : 0;
    const lineTotalTTC = priceTTC * qty + taxSpecific;

    return {
      index: idx + 1,
      name: line.description || "Article",
      qty,
      priceTTC,
      taxGroup,
      taxSpecific,
      totalTTC: lineTotalTTC,
      vatRate,
    };
  });

  // Aggregated tax breakdown for official DGI table
  const groupAgg: Record<
    string,
    { label: string; total: number; taxable: number; vat: number; rate: number }
  > = {};

  processedLines.forEach((l: any) => {
    const g = l.taxGroup;
    if (!groupAgg[g]) {
      const rate = g === "B" || g === "D" ? 18 : 0;
      groupAgg[g] = {
        label: TAX_GROUP_LABELS[g as MecefTaxGroup] || `${g} - Groupe ${g}`,
        total: 0,
        taxable: 0,
        vat: 0,
        rate,
      };
    }
    groupAgg[g].total += l.totalTTC;
  });

  // Calculate Base & VAT per group
  Object.keys(groupAgg).forEach((g) => {
    const item = groupAgg[g];
    if (item.rate === 18) {
      item.taxable = Math.round(item.total / 1.18);
      item.vat = item.total - item.taxable;
    } else {
      item.taxable = item.total;
      item.vat = 0;
    }
  });

  const totalGeneralTTC = processedLines.reduce((s: number, l: any) => s + l.totalTTC, 0);
  const aibAmount = Number(invoice.aib_amount || 0);
  const touristTaxAmount = Number(invoice.tourist_tax_amount || 0);
  const netToPay = totalGeneralTTC + aibAmount + touristTaxAmount;

  const paymentMethodLabel = invoice.payment_method?.toUpperCase() || "ESPECES";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* BANDEAU TEST DGI SI SANDBOX */}
        {!isProduction && <Text style={styles.testBanner}>----- TEST FACTURE !!!! -----</Text>}

        {/* HEADER / ÉMETTEUR & DOCUMENT */}
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{company?.name || "ENTREPRISE"}</Text>
            {company?.ifu && <Text style={styles.companyText}>IFU : {company.ifu}</Text>}
            {company?.rccm && <Text style={styles.companyText}>RCCM : {company.rccm}</Text>}
            {company?.address && <Text style={styles.companyText}>Adresse : {company.address}</Text>}
            {company?.city && <Text style={styles.companyText}>Ville : {company.city} (Bénin)</Text>}
            {company?.phone && <Text style={styles.companyText}>Contact : {company.phone}</Text>}
            <Text style={styles.companyText}>e-MCF NIM : {nim}</Text>
          </View>

          <View style={styles.docTitleBlock}>
            <Text style={styles.docTitle}>{docTitle}</Text>
            <Text style={styles.docRef}>Facture # {invoiceNumFormatted}</Text>
            <Text style={styles.docSubText}>Date : {issueDateStr}</Text>
            <Text style={styles.docSubText}>
              Vendeur : {invoice.created_by_user?.name || "Opérateur"}
            </Text>
            {invoice.mecef_original_ref && (
              <Text style={[styles.docSubText, { fontWeight: "bold", color: "#1e3a8a" }]}>
                Réf. fact. orig. : {invoice.mecef_original_ref}
              </Text>
            )}
          </View>
        </View>

        {/* CLIENT BOX */}
        {invoice.client?.name && (
          <View style={styles.clientBox}>
            <Text style={styles.clientBoxTitle}>CLIENT</Text>
            <Text style={styles.clientName}>{invoice.client.name}</Text>
            {invoice.client.ifu && <Text style={styles.clientInfo}>IFU : {invoice.client.ifu}</Text>}
            {invoice.client.address && (
              <Text style={styles.clientInfo}>Adresse : {invoice.client.address}</Text>
            )}
            {(invoice.client.phone || invoice.client.email) && (
              <Text style={styles.clientInfo}>
                Contact : {[invoice.client.phone, invoice.client.email].filter(Boolean).join(" - ")}
              </Text>
            )}
          </View>
        )}

        {/* DESCRIPTION SUPPLÉMENTAIRE (3 LIGNES MAX) */}
        {invoice.additional_description && (
          <View style={styles.descriptionBox}>
            {invoice.additional_description
              .split("\n")
              .filter(Boolean)
              .slice(0, 3)
              .map((line: string, i: number) => (
                <Text key={i} style={styles.descriptionText}>
                  {line}
                </Text>
              ))}
          </View>
        )}

        {/* TABLEAU DES ARTICLES (PRIX TTC) */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: "5%" }]}>#</Text>
            <Text style={[styles.th, { width: "45%" }]}>Désignation</Text>
            <Text style={[styles.th, { width: "16%", textAlign: "right" }]}>P.U. (T.T.C.)</Text>
            <Text style={[styles.th, { width: "12%", textAlign: "center" }]}>Quantité</Text>
            <Text style={[styles.th, { width: "16%", textAlign: "right" }]}>Montant T.T.C.</Text>
            <Text style={[styles.th, { width: "6%", textAlign: "center" }]}>G</Text>
          </View>

          {processedLines.map((l: any) => (
            <View key={l.index} style={styles.tableRow}>
              <Text style={[styles.td, { width: "5%" }]}>{l.index}</Text>
              <View style={{ width: "45%" }}>
                <Text style={styles.td}>{l.name}</Text>
                {l.taxSpecific > 0 && (
                  <Text style={{ fontSize: 7, color: "#6b7280" }}>
                    (Dont taxe spécifique : {formatCFA_simple(l.taxSpecific)} FCFA)
                  </Text>
                )}
              </View>
              <Text style={[styles.td, { width: "16%", textAlign: "right" }]}>
                {formatCFA_simple(l.priceTTC)}
              </Text>
              <Text style={[styles.td, { width: "12%", textAlign: "center" }]}>{l.qty}</Text>
              <Text style={[styles.td, { width: "16%", textAlign: "right", fontWeight: "bold" }]}>
                {formatCFA_simple(l.totalTTC)}
              </Text>
              <Text style={[styles.td, { width: "6%", textAlign: "center", fontWeight: "bold" }]}>
                [{l.taxGroup}]
              </Text>
            </View>
          ))}
        </View>

        {/* VENTILATION DES IMPÔTS & TOTAUX */}
        <View style={styles.taxSection}>
          {/* Tableau de ventilation des taxes DGI */}
          <View style={styles.taxBreakdownTable}>
            <View style={styles.taxTableHeader}>
              <Text style={[styles.th, { width: "40%", color: "#374151" }]}>Groupe</Text>
              <Text style={[styles.th, { width: "20%", textAlign: "right", color: "#374151" }]}>
                Total
              </Text>
              <Text style={[styles.th, { width: "20%", textAlign: "right", color: "#374151" }]}>
                Imposable
              </Text>
              <Text style={[styles.th, { width: "20%", textAlign: "right", color: "#374151" }]}>
                Impôt
              </Text>
            </View>
            {Object.keys(groupAgg).map((g) => {
              const row = groupAgg[g];
              return (
                <View key={g} style={styles.taxTableRow}>
                  <Text style={[styles.td, { width: "40%", fontSize: 7.5 }]}>{row.label}</Text>
                  <Text style={[styles.td, { width: "20%", textAlign: "right" }]}>
                    {formatCFA_simple(row.total)}
                  </Text>
                  <Text style={[styles.td, { width: "20%", textAlign: "right" }]}>
                    {formatCFA_simple(row.taxable)}
                  </Text>
                  <Text style={[styles.td, { width: "20%", textAlign: "right" }]}>
                    {formatCFA_simple(row.vat)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Récapitulatif montants */}
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={{ fontSize: 8.5, color: "#4b5563" }}>Total Facture :</Text>
              <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                {formatCFA_simple(totalGeneralTTC)} FCFA
              </Text>
            </View>
            {aibAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={{ fontSize: 8, color: "#4b5563" }}>
                  AIB ({invoice.aib_rate === "rate_1" ? "1%" : "5%"}) :
                </Text>
                <Text style={{ fontSize: 8.5 }}>{formatCFA_simple(aibAmount)} FCFA</Text>
              </View>
            )}
            {touristTaxAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={{ fontSize: 8, color: "#4b5563" }}>Taxe de séjour :</Text>
                <Text style={{ fontSize: 8.5 }}>{formatCFA_simple(touristTaxAmount)} FCFA</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={{ fontSize: 9.5, fontWeight: "bold", color: "#1e3a8a" }}>NET À PAYER</Text>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#1e3a8a" }}>
                {formatCFA_simple(netToPay)} FCFA
              </Text>
            </View>
          </View>
        </View>

        {/* RÉPARTITION DES PAIEMENTS */}
        <View style={styles.paymentTable}>
          <View style={styles.taxTableHeader}>
            <Text style={[styles.th, { width: "50%", color: "#374151" }]}>Type de paiement</Text>
            <Text style={[styles.th, { width: "50%", textAlign: "right", color: "#374151" }]}>
              Payé
            </Text>
          </View>
          <View style={styles.taxTableRow}>
            <Text style={[styles.td, { width: "50%" }]}>{paymentMethodLabel}</Text>
            <Text style={[styles.td, { width: "50%", textAlign: "right", fontWeight: "bold" }]}>
              {formatCFA_simple(netToPay)} FCFA
            </Text>
          </View>
        </View>

        {/* ÉLÉMENTS DE SÉCURITÉ DE LA FACTURE NORMALISÉE DGI */}
        <View style={styles.securityBlock}>
          <Text style={styles.securityTitle}>
            --- ÉLÉMENTS DE SÉCURITÉ DE LA FACTURE NORMALISÉE ---
          </Text>

          {invoice.mecef_dgi_code ? (
            <View style={styles.securityContent}>
              {invoice.mecef_qr_code && (
                <Image src={invoice.mecef_qr_code} style={styles.qrCodeImg} />
              )}
              <View style={styles.securityLabelsCol}>
                <Text style={styles.securityLabel}>Code MECeF/DGI</Text>
                <Text style={styles.securityLabel}>MECeF NIM</Text>
                <Text style={styles.securityLabel}>MECeF Compteurs</Text>
                <Text style={styles.securityLabel}>MECeF Heure</Text>
              </View>
              <View style={styles.securityValuesCol}>
                <Text style={styles.securityValue}>{invoice.mecef_dgi_code}</Text>
                <Text style={styles.securityValue}>{invoice.mecef_nim || nim}</Text>
                <Text style={styles.securityValue}>{invoice.mecef_counters || "1/1 FV"}</Text>
                <Text style={styles.securityValue}>
                  {invoice.mecef_datetime
                    ? new Date(invoice.mecef_datetime).toLocaleString("fr-FR")
                    : issueDateStr}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.unprocessedWarning}>La facture n'est pas traitée !</Text>
          )}
        </View>

        {/* MESSAGE COMMERCIAL */}
        {invoice.commercial_message && (
          <Text style={styles.commercialMessage}>« {invoice.commercial_message} »</Text>
        )}

        {/* BANDEAU TEST DGI BAS SI SANDBOX */}
        {!isProduction && (
          <Text style={styles.testBannerBottom}>----- TEST FACTURE !!!! -----</Text>
        )}
      </Page>
    </Document>
  );
};
