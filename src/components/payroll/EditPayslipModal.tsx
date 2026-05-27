"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { fetcher, mutate } from "@/lib/fetcher";
import { toast } from "sonner";
import { formatCFA } from "@/lib/format";

export const EditPayslipModal = ({
  payslipId,
  isOpen,
  onClose,
  onSuccess,
}: {
  payslipId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [payslip, setPayslip] = useState<any>(null);
  const [lines, setLines] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && payslipId) {
      loadPayslip();
    }
  }, [isOpen, payslipId]);

  const loadPayslip = async () => {
    setLoading(true);
    try {
      const res = await fetcher(`/api/payroll/payslips/${payslipId}`);
      const data = res.data || res;
      setPayslip(data);
      setLines(data.lines || []);
    } catch (e: any) {
      toast.error("Erreur lors du chargement du bulletin");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLine = () => {
    setLines([...lines, { type: "earning", label: "Nouvelle prime", amount: 0, rate: null, base: null }]);
  };

  const handleRemoveLine = (index: number) => {
    const newLines = [...lines];
    newLines.splice(index, 1);
    setLines(newLines);
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await mutate(`/api/payroll/payslips/${payslipId}`, {
        method: "PATCH",
        body: JSON.stringify({ customLines: lines }),
      });
      if (res.success) {
        toast.success("Bulletin mis à jour");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Erreur lors de la mise à jour");
      }
    } catch (e: any) {
      toast.error("Erreur inattendue");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Éditer le bulletin de paie</DialogTitle>
          <DialogDescription>
            Ajoutez des primes, indemnités ou modifiez les retenues de {payslip?.employee?.first_name} {payslip?.employee?.last_name}.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center rounded-md bg-muted/50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Salaire de base</p>
                <p className="font-semibold">{formatCFA(payslip?.base_salary)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Net actuel estimé</p>
                <p className="font-bold text-primary text-lg">{formatCFA(payslip?.net_salary)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Lignes du bulletin</h3>
                <Button size="sm" variant="outline" onClick={handleAddLine}>
                  <Plus className="mr-1 h-4 w-4" /> Ajouter une ligne
                </Button>
              </div>

              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left font-medium">Type</th>
                      <th className="p-2 text-left font-medium">Libellé</th>
                      <th className="p-2 text-right font-medium">Taux (%)</th>
                      <th className="p-2 text-right font-medium">Montant (CFA)</th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2">
                          <select 
                            className="w-full rounded-md border-input bg-transparent text-sm"
                            value={line.type}
                            onChange={(e) => handleLineChange(idx, "type", e.target.value)}
                          >
                            <option value="earning">Prime / Indemnité (+)</option>
                            <option value="deduction">Retenue (-)</option>
                            <option value="employer_contribution">Charge Patronale</option>
                            <option value="tax">Impôt (ex: IRPP/VPS)</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input 
                            className="w-full rounded-md border border-input bg-transparent px-2 py-1"
                            value={line.label}
                            onChange={(e) => handleLineChange(idx, "label", e.target.value)}
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number"
                            step="0.01"
                            className="w-20 rounded-md border border-input bg-transparent px-2 py-1 text-right ml-auto"
                            value={line.rate ? (line.rate * 100).toFixed(2) : ""}
                            onChange={(e) => {
                              const val = e.target.value ? Number(e.target.value) / 100 : null;
                              handleLineChange(idx, "rate", val);
                            }}
                            placeholder="-"
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number"
                            className="w-24 rounded-md border border-input bg-transparent px-2 py-1 text-right ml-auto"
                            value={line.amount || 0}
                            onChange={(e) => handleLineChange(idx, "amount", Number(e.target.value))}
                            disabled={line.rate !== null && line.rate > 0} // Disabled if rate is set (calculated on backend)
                          />
                        </td>
                        <td className="p-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveLine(idx)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                Note : Si un taux (%) est défini, le montant sera recalculé automatiquement par rapport au salaire brut lors de la sauvegarde.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer et recalculer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
