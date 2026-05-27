import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatCFA_simple } from '@/lib/pdf-templates/pdf-utils';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1f2937' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#2563eb', paddingBottom: 20, marginBottom: 30 },
  companyBlock: { width: '50%' },
  companyName: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 5 },
  companyText: { fontSize: 9, color: '#4b5563', marginBottom: 2 },
  
  titleBlock: { width: '50%', alignItems: 'flex-end' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', marginBottom: 5 },
  periodText: { fontSize: 12, color: '#6b7280', marginBottom: 15 },
  
  employeeSection: { marginBottom: 30, padding: 15, backgroundColor: '#f3f4f6', borderRadius: 4, width: '100%', flexDirection: 'row' },
  employeeLeft: { width: '50%' },
  employeeRight: { width: '50%', alignItems: 'flex-end' },
  employeeName: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 3 },
  employeeText: { fontSize: 10, color: '#374151', marginBottom: 2 },
  employeeLabel: { fontSize: 8, color: '#6b7280', textTransform: 'uppercase' },

  table: { width: '100%', marginBottom: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e3a8a', padding: 8, borderRadius: 4 },
  thDesc: { flex: 4, color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  thBase: { flex: 2, color: '#ffffff', fontSize: 9, fontWeight: 'bold', textAlign: 'right' },
  thRate: { flex: 2, color: '#ffffff', fontSize: 9, fontWeight: 'bold', textAlign: 'right' },
  thAmount: { flex: 2, color: '#ffffff', fontSize: 9, fontWeight: 'bold', textAlign: 'right' },
  
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 8, paddingVertical: 10 },
  tableRowHighlight: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 8, paddingVertical: 10, backgroundColor: '#f9fafb' },
  tdDesc: { flex: 4, fontSize: 9, color: '#1f2937' },
  tdDescBold: { flex: 4, fontSize: 9, fontWeight: 'bold', color: '#111827' },
  tdBase: { flex: 2, fontSize: 9, color: '#4b5563', textAlign: 'right' },
  tdRate: { flex: 2, fontSize: 9, color: '#4b5563', textAlign: 'right' },
  tdAmount: { flex: 2, fontSize: 9, color: '#1f2937', textAlign: 'right' },
  tdAmountBold: { flex: 2, fontSize: 9, fontWeight: 'bold', color: '#111827', textAlign: 'right' },

  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#1e3a8a', marginTop: 10, marginBottom: 5, paddingLeft: 8 },

  summaryBlock: { width: '100%', alignItems: 'flex-end', marginTop: 20 },
  summaryBox: { width: '40%' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  summaryLabel: { fontSize: 9, color: '#6b7280' },
  summaryValue: { fontSize: 10, color: '#1f2937', fontWeight: 'bold' },
  
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, backgroundColor: '#f8fafc', borderTopWidth: 2, borderTopColor: '#2563eb', marginTop: 5 },
  grandTotalLabel: { fontSize: 12, color: '#1e3a8a', fontWeight: 'bold', paddingLeft: 10 },
  grandTotalValue: { fontSize: 14, color: '#2563eb', fontWeight: 'bold', paddingRight: 10 },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center' },
  footerText: { fontSize: 8, color: '#9ca3af', marginBottom: 2 }
});

export const PayslipPDF = ({ payslip, company }: { payslip: any, company: any }) => {
  const monthName = new Date(payslip.year, payslip.month - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const emp = payslip.employee;

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
          </View>
          
          <View style={styles.titleBlock}>
            <Text style={styles.title}>BULLETIN DE PAIE</Text>
            <Text style={styles.periodText}>{`Période : ${monthName}`}</Text>
          </View>
        </View>

        {/* EMPLOYEE INFO */}
        <View style={styles.employeeSection}>
          <View style={styles.employeeLeft}>
            <Text style={styles.employeeLabel}>Salarié</Text>
            <Text style={styles.employeeName}>{emp.first_name} {emp.last_name}</Text>
            <Text style={styles.employeeText}>{emp.address || 'Adresse non renseignée'}</Text>
            {emp.city ? <Text style={styles.employeeText}>{emp.city}</Text> : null}
          </View>
          <View style={styles.employeeRight}>
            <Text style={styles.employeeText}>Poste : {emp.position}</Text>
            <Text style={styles.employeeText}>Type de contrat : {emp.contract_type}</Text>
            <Text style={styles.employeeText}>Date d'embauche : {emp.hire_date ? new Date(emp.hire_date).toLocaleDateString('fr-FR') : '-'}</Text>
            <Text style={styles.employeeText}>Situation : {emp.marital_status || '-'} ({emp.children_count || 0} enfant(s))</Text>
          </View>
        </View>

        {/* PAYROLL ELEMENTS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thDesc}>Désignation</Text>
            <Text style={styles.thBase}>Base</Text>
            <Text style={styles.thRate}>Taux</Text>
            <Text style={styles.thAmount}>Montant</Text>
          </View>
          
          <View style={styles.tableRowHighlight}>
            <Text style={styles.tdDescBold}>Salaire de base</Text>
            <Text style={styles.tdBase}></Text>
            <Text style={styles.tdRate}></Text>
            <Text style={styles.tdAmountBold}>{formatCFA_simple(payslip.base_salary)}</Text>
          </View>
          
          {/* EARNINGS (Primes & Indemnités) */}
          {payslip.lines?.filter((l: any) => l.type === 'earning').length > 0 && (
            <>
              {payslip.lines.filter((l: any) => l.type === 'earning').map((e: any, i: number) => (
                <View key={`earn-${i}`} style={styles.tableRow}>
                  <Text style={styles.tdDesc}>{e.label}</Text>
                  <Text style={styles.tdBase}></Text>
                  <Text style={styles.tdRate}></Text>
                  <Text style={styles.tdAmountBold}>{formatCFA_simple(e.amount)}</Text>
                </View>
              ))}
              <View style={styles.tableRowHighlight}>
                <Text style={styles.tdDescBold}>Salaire Brut</Text>
                <Text style={styles.tdBase}></Text>
                <Text style={styles.tdRate}></Text>
                <Text style={styles.tdAmountBold}>{formatCFA_simple(payslip.gross_salary)}</Text>
              </View>
            </>
          )}

          {/* DEDUCTIONS & TAXES */}
          {payslip.lines?.filter((l: any) => l.type === 'deduction' || l.type === 'tax').length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Retenues Salariales & Impôts</Text>
              {payslip.lines.filter((l: any) => l.type === 'deduction' || l.type === 'tax').map((d: any, i: number) => (
                <View key={`ded-${i}`} style={styles.tableRow}>
                  <Text style={styles.tdDesc}>{d.label}</Text>
                  <Text style={styles.tdBase}>{d.base ? formatCFA_simple(d.base) : '-'}</Text>
                  <Text style={styles.tdRate}>{d.rate ? `${(Number(d.rate) * 100).toFixed(2)}%` : '-'}</Text>
                  <Text style={styles.tdAmount}>- {formatCFA_simple(d.amount)}</Text>
                </View>
              ))}
            </>
          )}

          {/* CONTRIBUTIONS */}
          {payslip.lines?.filter((l: any) => l.type === 'employer_contribution').length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Charges Patronales (Pour information)</Text>
              {payslip.lines.filter((l: any) => l.type === 'employer_contribution').map((c: any, i: number) => (
                <View key={`con-${i}`} style={styles.tableRow}>
                  <Text style={styles.tdDesc}>{c.label}</Text>
                  <Text style={styles.tdBase}>{c.base ? formatCFA_simple(c.base) : '-'}</Text>
                  <Text style={styles.tdRate}>{c.rate ? `${(Number(c.rate) * 100).toFixed(2)}%` : '-'}</Text>
                  <Text style={styles.tdAmount}>{formatCFA_simple(c.amount)}</Text>
                </View>
              ))}
            </>
          )}

        </View>

        {/* TOTALS */}
        <View style={styles.summaryBlock}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Retenues</Text>
              <Text style={styles.summaryValue}>
                {formatCFA_simple(payslip.lines?.filter((l: any) => l.type === 'deduction' || l.type === 'tax').reduce((acc: number, d: any) => acc + Number(d.amount), 0) || 0)}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>NET À PAYER</Text>
              <Text style={styles.grandTotalValue}>{formatCFA_simple(payslip.net_salary)}</Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Dans votre intérêt et pour vous aider à faire valoir vos droits, conservez ce bulletin de paie sans limitation de durée.</Text>
          <Text style={styles.footerText}>Document généré électroniquement par Brightbook Studio</Text>
        </View>
        
      </Page>
    </Document>
  );
};
