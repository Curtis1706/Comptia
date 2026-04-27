import { useSearchParams } from "react-router-dom";
import { Building2, BookOpen, Users, Plug, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { company, auditLog } from "@/data/mock";
import { cn } from "@/lib/utils";

const sections = [
  { id: "entreprise", label: "Entreprise", icon: Building2 },
  { id: "plan", label: "Plan comptable", icon: BookOpen },
  { id: "users", label: "Utilisateurs & Rôles", icon: Users },
  { id: "integrations", label: "Intégrations", icon: Plug },
  { id: "security", label: "Sécurité & Audit", icon: Shield },
  { id: "billing", label: "Facturation Comptia", icon: CreditCard },
] as const;
type Sec = (typeof sections)[number]["id"];

export const Parametres = () => {
  const [params, setParams] = useSearchParams();
  const sec = (params.get("tab") as Sec) || "entreprise";
  const setSec = (s: Sec) => {
    const p = new URLSearchParams(params);
    if (s === "entreprise") p.delete("tab"); else p.set("tab", s);
    setParams(p, { replace: true });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Configuration" subtitle="Personnalisez votre espace Comptia" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-1 rounded-xl border border-border bg-card p-2 shadow-card h-fit">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setSec(s.id)} className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
              sec === s.id ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}>
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          {sec === "entreprise" && <EntrepriseForm />}
          {sec === "plan" && <PlanComptable />}
          {sec === "users" && <UsersTable />}
          {sec === "integrations" && <Integrations />}
          {sec === "security" && <Audit />}
          {sec === "billing" && <Billing />}
        </div>
      </div>
    </div>
  );
};

const EntrepriseForm = () => (
  <div>
    <h2 className="font-display text-lg font-semibold">Informations entreprise</h2>
    <p className="mt-1 text-sm text-muted-foreground">Ces informations apparaissent sur vos factures.</p>
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><Label>Logo</Label>
        <div className="mt-1 flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-primary font-display text-xl font-bold text-primary-foreground">
            {company.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <Button variant="outline" size="sm">Changer le logo</Button>
        </div>
      </div>
      <div><Label>Raison sociale</Label><Input defaultValue={company.name} className="mt-1" /></div>
      <div><Label>SIRET</Label><Input defaultValue={company.siret} className="mt-1 font-mono" /></div>
      <div><Label>Régime fiscal</Label><Input defaultValue={company.regime} className="mt-1" /></div>
      <div><Label>Secteur d'activité</Label><Input defaultValue={company.sector} className="mt-1" /></div>
      <div className="sm:col-span-2"><Label>Email de contact</Label><Input defaultValue={company.email} className="mt-1" /></div>
    </div>
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="outline">Annuler</Button>
      <Button className="bg-gradient-primary hover:opacity-90">Enregistrer</Button>
    </div>
  </div>
);

const PlanComptable = () => (
  <div>
    <h2 className="font-display text-lg font-semibold">Plan comptable</h2>
    <p className="mt-1 text-sm text-muted-foreground">Gérez vos comptes personnalisés (PCG France).</p>
    <div className="mt-6 overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2">N°</th><th className="px-4 py-2">Libellé</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          {[
            { n: "401001", l: "Fournisseurs - Achats généraux", t: "Tiers" },
            { n: "411001", l: "Clients - Prestations", t: "Tiers" },
            { n: "606300", l: "Fournitures de bureau", t: "Charge" },
            { n: "613200", l: "Locations immobilières", t: "Charge" },
            { n: "706000", l: "Prestations de services", t: "Produit" },
          ].map((r) => (
            <tr key={r.n} className="border-b border-border last:border-0">
              <td className="px-4 py-2 font-mono text-xs">{r.n}</td>
              <td className="px-4 py-2">{r.l}</td>
              <td className="px-4 py-2 text-muted-foreground">{r.t}</td>
              <td className="px-4 py-2"><span className="inline-flex rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Actif</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UsersTable = () => {
  const users = [
    { name: "Sophie Martin", email: "sophie@abc.fr", role: "Admin" },
    { name: "Karim Benali", email: "karim@abc.fr", role: "Comptable" },
    { name: "Mme Durand (Cabinet)", email: "durand@cabinet-expert.fr", role: "Expert-Comptable" },
    { name: "Inès Petit", email: "ines@abc.fr", role: "RH" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Utilisateurs & Rôles</h2>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les accès à votre espace.</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">Inviter un utilisateur</Button>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
        {users.map((u) => (
          <li key={u.email} className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
              {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1">
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-muted-foreground">{u.email}</p>
            </div>
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">{u.role}</span>
            <Button variant="ghost" size="sm">Gérer</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Integrations = () => {
  const items = [
    { name: "Connexion bancaire", desc: "Synchronisez vos comptes via Plaid", connected: true },
    { name: "Shopify", desc: "Importez vos ventes e-commerce", connected: false },
    { name: "Stripe", desc: "Encaissez vos factures en ligne", connected: true },
    { name: "Expert-comptable", desc: "Export FEC sécurisé vers votre cabinet", connected: true },
  ];
  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Intégrations</h2>
      <p className="mt-1 text-sm text-muted-foreground">Connectez vos outils favoris.</p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <div key={i.name} className="flex items-center justify-between rounded-lg border border-border bg-gradient-subtle p-4">
            <div>
              <p className="font-semibold">{i.name}</p>
              <p className="text-xs text-muted-foreground">{i.desc}</p>
            </div>
            {i.connected ? (
              <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Connecté</span>
            ) : (
              <Button size="sm" variant="outline">Connecter</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Audit = () => (
  <div>
    <h2 className="font-display text-lg font-semibold">Sécurité & piste d'audit</h2>
    <p className="mt-1 text-sm text-muted-foreground">Activités récentes sur votre espace.</p>
    <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
      {auditLog.map((l) => (
        <li key={l.id} className="flex items-center gap-3 p-4">
          <div className={cn(
            "h-2 w-2 rounded-full",
            l.type === "validation" && "bg-success",
            l.type === "creation" && "bg-info",
            l.type === "config" && "bg-warning",
            l.type === "action" && "bg-primary",
          )} />
          <div className="flex-1">
            <p className="text-sm"><span className="font-semibold">{l.user}</span> {l.action}</p>
            <p className="text-xs text-muted-foreground">{l.date}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const Billing = () => (
  <div>
    <h2 className="font-display text-lg font-semibold">Plan & facturation</h2>
    <div className="mt-6 rounded-xl bg-gradient-primary p-6 text-primary-foreground">
      <p className="text-sm uppercase tracking-wider opacity-80">Plan actuel</p>
      <p className="mt-1 font-display text-3xl font-semibold">Comptia Pro</p>
      <p className="mt-1 text-sm opacity-90">49 € / mois — Jusqu'à 50 factures, 5 utilisateurs</p>
      <Button variant="secondary" size="sm" className="mt-4">Passer à Business</Button>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">Factures ce mois</p>
        <p className="mt-1 font-display text-xl font-semibold tabular">12 / 50</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">Utilisateurs</p>
        <p className="mt-1 font-display text-xl font-semibold tabular">4 / 5</p>
      </div>
    </div>
  </div>
);

export default Parametres;