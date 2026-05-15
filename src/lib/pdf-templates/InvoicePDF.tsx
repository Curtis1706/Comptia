import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatCFA_simple } from '@/lib/pdf-templates/pdf-utils';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1f2937' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#2563eb', paddingBottom: 20, marginBottom: 30 },
  companyBlock: { width: '50%' },
  companyName: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 5 },
  companyText: { fontSize: 9, color: '#4b5563', marginBottom: 2 },
  
  invoiceTitleBlock: { width: '50%', alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 28, fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', marginBottom: 5 },
  invoiceRef: { fontSize: 12, color: '#6b7280', marginBottom: 15 },
  
  metaTable: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%' },
  metaColumn: { marginLeft: 20, alignItems: 'flex-end' },
  metaLabel: { fontSize: 8, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 2 },
  metaValue: { fontSize: 10, fontWeight: 'bold', color: '#1f2937' },

  clientSection: { marginBottom: 40, padding: 15, backgroundColor: '#f3f4f6', borderRadius: 4, width: '50%' },
  clientLabel: { fontSize: 8, color: '#6b7280', textTransform: 'uppercase', marginBottom: 5 },
  clientName: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 3 },
  clientText: { fontSize: 10, color: '#374151', marginBottom: 2 },

  table: { width: '100%', marginBottom: 30 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e3a8a', padding: 8, borderRadius: 4 },
  thDesc: { flex: 4, color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  thQty: { flex: 1, color: '#ffffff', fontSize: 9, fontWeight: 'bold', textAlign: 'center' },
  thPrice: { flex: 2, color: '#ffffff', fontSize: 9, fontWeight: 'bold', textAlign: 'right' },
  thTotal: { flex: 2, color: '#ffffff', fontSize: 9, fontWeight: 'bold', textAlign: 'right' },
  
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 8, paddingVertical: 12 },
  tdDesc: { flex: 4, fontSize: 9, color: '#1f2937' },
  tdQty: { flex: 1, fontSize: 9, color: '#4b5563', textAlign: 'center' },
  tdPrice: { flex: 2, fontSize: 9, color: '#4b5563', textAlign: 'right' },
  tdTotal: { flex: 2, fontSize: 9, fontWeight: 'bold', color: '#111827', textAlign: 'right' },

  summaryBlock: { width: '100%', alignItems: 'flex-end', marginTop: 10 },
  summaryBox: { width: '40%' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  summaryLabel: { fontSize: 9, color: '#6b7280' },
  summaryValue: { fontSize: 10, color: '#1f2937', fontWeight: 'bold' },
  
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, backgroundColor: '#f8fafc', borderTopWidth: 2, borderTopColor: '#2563eb', marginTop: 5 },
  grandTotalLabel: { fontSize: 12, color: '#1e3a8a', fontWeight: 'bold', paddingLeft: 10 },
  grandTotalValue: { fontSize: 14, color: '#2563eb', fontWeight: 'bold', paddingRight: 10 },

  notes: { marginTop: 40, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  notesLabel: { fontSize: 9, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  notesText: { fontSize: 8, color: '#6b7280', lineHeight: 1.4 },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center' },
  footerText: { fontSize: 8, color: '#9ca3af', marginBottom: 2 },
  footerHighlight: { color: '#6b7280' }
});

export const InvoicePDF = ({ invoice, company }: { invoice: any, company: any }) => {
  const isQuote = invoice.type === 'quote';
  const docTitle = isQuote ? 'DEVIS' : (invoice.type === 'credit_note' ? 'AVOIR' : 'FACTURE');
  const fallbackDate = new Date().toISOString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{company?.name || 'Mon Entreprise'}</Text>
            {company?.address ? <Text style={styles.companyText}>{company.address}</Text> : null}
            {company?.city ? <Text style={styles.companyText}>{company.city}</Text> : null}
            {company?.ifu ? <Text style={styles.companyText}>{`IFU: ${company.ifu}`}</Text> : null}
            {company?.phone ? <Text style={styles.companyText}>{`Tél: ${company.phone}`}</Text> : null}
          </View>
          
          <View style={styles.invoiceTitleBlock}>
            <Text style={styles.invoiceTitle}>{docTitle}</Text>
            <Text style={styles.invoiceRef}>{`N° ${invoice?.reference || 'Brouillon'}`}</Text>
            
            <View style={styles.metaTable}>
              <View style={styles.metaColumn}>
                <Text style={styles.metaLabel}>Date d'émission</Text>
                <Text style={styles.metaValue}>
                  {new Date(invoice?.issue_date || fallbackDate).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              {!isQuote ? (
                <View style={styles.metaColumn}>
                  <Text style={styles.metaLabel}>Date d'échéance</Text>
                  <Text style={styles.metaValue}>
                    {new Date(invoice?.due_date || fallbackDate).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* CLIENT INFO */}
        <View style={styles.clientSection}>
          <Text style={styles.clientLabel}>Adressé à</Text>
          <Text style={styles.clientName}>{invoice?.client?.name || 'Client inconnu'}</Text>
          {invoice?.client?.address ? <Text style={styles.clientText}>{invoice.client.address}</Text> : null}
          {invoice?.client?.city ? <Text style={styles.clientText}>{invoice.client.city}</Text> : null}
          {invoice?.client?.email ? <Text style={styles.clientText}>{invoice.client.email}</Text> : null}
        </View>

        {/* ITEMS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thDesc}>Désignation des prestations / produits</Text>
            <Text style={styles.thQty}>Qté</Text>
            <Text style={styles.thPrice}>Prix Unitaire</Text>
            <Text style={styles.thTotal}>Montant HT</Text>
          </View>
          
          {(invoice?.lines || []).map((line: any, i: number) => {
            const qty = Number(line?.quantity || 0);
            const price = Number(line?.unit_price || 0);
            const total = qty * price;
            
            return (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tdDesc}>{String(line?.description || 'Ligne sans description')}</Text>
                <Text style={styles.tdQty}>{String(qty)}</Text>
                <Text style={styles.tdPrice}>{String(formatCFA_simple(price))}</Text>
                <Text style={styles.tdTotal}>{String(formatCFA_simple(total))}</Text>
              </View>
            );
          })}
        </View>

        {/* TOTALS */}
        <View style={styles.summaryBlock}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total HT</Text>
              <Text style={styles.summaryValue}>{formatCFA_simple(invoice?.subtotal_ht || 0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>TVA</Text>
              <Text style={styles.summaryValue}>{formatCFA_simple(invoice?.vat_amount || 0)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL TTC</Text>
              <Text style={styles.grandTotalValue}>{formatCFA_simple(invoice?.total_ttc || 0)}</Text>
            </View>
          </View>
        </View>

        {/* NOTES & CONDITIONS */}
        {invoice?.notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes & Conditions :</Text>
            <Text style={styles.notesText}>{String(invoice.notes)}</Text>
          </View>
        ) : null}

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {[
              company?.name || 'Mon Entreprise',
              company?.ifu ? `IFU: ${company.ifu}` : null,
              company?.email || null
            ].filter(Boolean).join(' · ')}
          </Text>
          <Text style={styles.footerText}>Document généré électroniquement par Comptia</Text>
        </View>
        
      </Page>
    </Document>
  );
};
