# Bibliothèque Universelle de Composants KPI Frontend (React, TypeScript, Tailwind CSS)

Ce guide technique fournit le code source complet de composants KPI et de métriques **100% agnostiques de la charte graphique**.

Ces composants n'imposent **aucune couleur en dur ni hexadécimal**. Ils s'appuient exclusivement sur le système sémantique standard de Tailwind CSS et des design systems modernes (shadcn/ui, Radix, Tailwind v3/v4). Dès que vous les importez, ils adoptent **instantanément et automatiquement les couleurs (`primary`, `card`, `muted`, `border`, `foreground`) et le mode sombre de votre propre projet**.

---

## 1. Prérequis et Système de Tokens Sémantiques

### Dépendances

```bash
npm install lucide-react framer-motion clsx tailwind-merge
# ou avec pnpm :
pnpm add lucide-react framer-motion clsx tailwind-merge
```

### Utilitaire de classes (`lib/utils.ts`)

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Tokens Sémantiques Utilisés

Les composants s'appuient sur les classes Tailwind standards disponibles dans tout projet moderne :

- `bg-card` / `text-card-foreground` : Fond et texte de surface de carte
- `bg-background` / `text-foreground` : Fond et texte de base
- `bg-muted` / `text-muted-foreground` : Surfaces secondaires et libellés atténués
- `border-border` : Bordures neutres
- `bg-primary` / `text-primary` / `border-primary` : Couleur dominante de votre marque
- `text-emerald-600 dark:text-emerald-400` / `text-destructive` : Variations d'évolution positive et négative

*(Si votre projet utilise déjà shadcn/ui ou Tailwind avec variables CSS, vous n'avez rien à configurer. Les composants héritent immédiatement de votre thème).*

---

## 2. Composant `KpiCard` (Animation Chiffrée, Sparkline Vectorielle & Tendance)

Ce composant propose :

- Une animation fluide de montée du chiffre (`framer-motion`)
- Un tracé SVG de sparkline lissé via courbe de Bézier, adoptant la couleur courante (`stroke-current` / `stroke-primary`)
- Un badge d'évolution positive / négative dynamique
- Une grille responsive auto-ajustable (`KpiGrid`)

### Code Source Intégral : `components/ui/kpi-card.tsx`

```tsx
"use client";

import * as React from "react";
import { useMemo, useRef, useEffect } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function generateSmoothPath(
  points: number[],
  width: number,
  height: number
): string {
  if (!points || points.length < 2) return `M 0 ${height}`;
  const xStep = width / (points.length - 1);
  const coords = points.map((p, i) => [
    i * xStep,
    height - (p / 100) * (height * 0.7) - height * 0.15,
  ]);
  let path = `M ${coords[0][0]} ${coords[0][1]}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[i + 1];
    const midX = (x1 + x2) / 2;
    path += ` C ${midX},${y1} ${midX},${y2} ${x2},${y2}`;
  }
  return path;
}

export type KpiVariant = "default" | "primary" | "secondary" | "accent" | "muted";

export interface KpiCardProps {
  label: string;
  value: number;
  formatValue?: (v: number) => string;
  icon: LucideIcon;
  trend?: number;
  trendPeriod?: string;
  sparkline?: number[];
  variant?: KpiVariant;
  subtext?: string;
  className?: string;
}

const variantStyles: Record<
  KpiVariant,
  {
    iconWrapper: string;
    lineColorClass: string;
  }
> = {
  default: {
    iconWrapper: "bg-muted text-foreground border-border",
    lineColorClass: "stroke-muted-foreground",
  },
  primary: {
    iconWrapper: "bg-primary/10 text-primary border-primary/20",
    lineColorClass: "stroke-primary",
  },
  secondary: {
    iconWrapper: "bg-secondary/20 text-secondary-foreground border-secondary/30",
    lineColorClass: "stroke-secondary-foreground",
  },
  accent: {
    iconWrapper: "bg-accent text-accent-foreground border-border",
    lineColorClass: "stroke-accent-foreground",
  },
  muted: {
    iconWrapper: "bg-muted/60 text-muted-foreground border-border",
    lineColorClass: "stroke-muted-foreground/60",
  },
};

export function KpiCard({
  label,
  value,
  formatValue,
  icon: Icon,
  trend,
  trendPeriod = "cette période",
  sparkline,
  variant = "primary",
  subtext,
  className,
}: KpiCardProps) {
  const isPositive = trend === undefined ? true : trend >= 0;
  const activeVariant = variantStyles[variant] || variantStyles.primary;

  const motionValue = useMotionValue(0);
  const displayValue = useTransform(motionValue, (latest) => {
    const rounded = Math.round(latest);
    return formatValue
      ? formatValue(rounded)
      : rounded.toLocaleString("fr-FR");
  });

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, motionValue]);

  const svgW = 120;
  const svgH = 40;
  const linePathRef = useRef<SVGPathElement>(null);

  const linePath = useMemo(
    () => (sparkline && sparkline.length >= 2 ? generateSmoothPath(sparkline, svgW, svgH) : ""),
    [sparkline]
  );

  return (
    <div
      className={cn(
        "rounded-2xl bg-card text-card-foreground border border-border p-5 flex flex-col justify-between gap-4 transition-colors hover:border-primary/40 shadow-xs",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
            activeVariant.iconWrapper
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        {linePath && (
          <div className="relative w-24 h-10 shrink-0">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                ref={linePathRef}
                d={linePath}
                fill="none"
                className={cn("transition-colors", activeVariant.lineColorClass)}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <motion.p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {displayValue}
          </motion.p>

          {trend !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-destructive/10 text-destructive border-destructive/30"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {isPositive ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-foreground">
          {label}
        </p>

        {subtext && (
          <p className="text-[11px] font-medium text-muted-foreground">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export interface KpiGridProps {
  cards: KpiCardProps[];
  cols?: 2 | 3 | 4;
  className?: string;
}

export function KpiGrid({ cards, cols = 3, className }: KpiGridProps) {
  const colClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={cn(`grid grid-cols-1 ${colClass} gap-4 sm:gap-6`, className)}>
      {cards.map((card, i) => (
        <KpiCard key={`${card.label}-${i}`} {...card} />
      ))}
    </div>
  );
}

export default KpiCard;
```

---

## 3. Composant `KpiMetricCard` (Carte Synthétique Compacte)

Une carte concise, adaptée aux affichages denses (statistiques secondaires, encours, stocks, compteurs rapides). Elle s'adapte aux tons `default`, `primary`, `secondary`, `accent` ou `muted` de votre thème.

### Code Source Intégral : `components/ui/kpi-metric-card.tsx`

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Tone = "default" | "primary" | "secondary" | "accent" | "muted";
type Trend = "up" | "down" | "flat";

export type KpiMetricCardProps = {
  label: string;
  value: string | number;
  delta?: number | string;
  trend?: Trend;
  caption?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  className?: string;
};

const toneStyles: Record<
  Tone,
  { card: string; value: string; iconBg: string }
> = {
  default: {
    card: "bg-card border-border hover:border-border/80 text-card-foreground",
    value: "text-foreground",
    iconBg: "bg-muted text-muted-foreground",
  },
  primary: {
    card: "bg-card border-border hover:border-primary/40 text-card-foreground",
    value: "text-foreground",
    iconBg: "bg-primary/10 text-primary",
  },
  secondary: {
    card: "bg-card border-border hover:border-secondary/40 text-card-foreground",
    value: "text-foreground",
    iconBg: "bg-secondary/20 text-secondary-foreground",
  },
  accent: {
    card: "bg-card border-border hover:border-accent/40 text-card-foreground",
    value: "text-foreground",
    iconBg: "bg-accent text-accent-foreground",
  },
  muted: {
    card: "bg-muted/40 border-border text-foreground",
    value: "text-foreground",
    iconBg: "bg-muted text-muted-foreground",
  },
};

export const KpiMetricCard: React.FC<KpiMetricCardProps> = ({
  label,
  value,
  delta,
  trend,
  caption,
  icon,
  tone = "default",
  className,
}) => {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border transition-all duration-200 space-y-2 shadow-xs",
        styles.card,
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-medium truncate">
          {label}
        </span>
        {icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform",
              styles.iconBg
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className={cn("text-2xl font-bold tracking-tight", styles.value)}>
          {value}
        </div>

        {delta && (
          <div
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md",
              trend === "up"
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                : trend === "down"
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground bg-muted"
            )}
          >
            {trend === "up" && <TrendingUp className="w-3 h-3" />}
            {trend === "down" && <TrendingDown className="w-3 h-3" />}
            {trend === "flat" && <Minus className="w-3 h-3" />}
            <span>{delta}</span>
          </div>
        )}
      </div>

      {caption && (
        <p className="text-[11px] text-muted-foreground truncate">
          {caption}
        </p>
      )}
    </div>
  );
};

export default KpiMetricCard;
```

---

## 4. Composant `ActivityChartCard` (Histogramme d'Activité avec Sélecteur)

Un histogramme animé fluide utilisant `framer-motion`, sans risque de débordement grâce à des barres proportionnelles, un menu déroulant de périodicité et un indicateur de tendance.

### Code Source Intégral : `components/ui/activity-chart-card.tsx`

```tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityDataPoint {
  day: string;
  value: number;
}

export interface ActivityChartCardProps {
  title?: string;
  totalValue: string;
  data: ActivityDataPoint[];
  className?: string;
  dropdownOptions?: string[];
  trendText?: string;
}

export const ActivityChartCard = ({
  title = "Activité",
  totalValue,
  data,
  className,
  dropdownOptions = ["Hebdomadaire", "Mensuel", "Annuel"],
  trendText = "+12% progression",
}: ActivityChartCardProps) => {
  const [selectedRange, setSelectedRange] = React.useState(
    dropdownOptions[0] || ""
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const maxValue = React.useMemo(() => {
    return data.reduce((max, item) => (item.value > max ? item.value : max), 0);
  }, [data]);

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0, transformOrigin: "bottom" },
    visible: {
      scaleY: 1,
      opacity: 1,
      transformOrigin: "bottom",
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div
      className={cn(
        "w-full bg-card text-card-foreground border border-border rounded-2xl p-5 space-y-3 shadow-xs relative overflow-hidden flex flex-col justify-between h-full",
        className
      )}
      aria-labelledby="activity-card-title"
    >
      <div className="flex items-center justify-between gap-2 z-10">
        <h3 id="activity-card-title" className="text-base font-bold text-foreground truncate">
          {title}
        </h3>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-muted/60 border border-border text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors min-h-[32px]"
          >
            {selectedRange}
            <ChevronDown className="h-3 w-3" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-xl shadow-md z-40 py-1 overflow-hidden">
              {dropdownOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSelectedRange(option);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-muted text-foreground transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 pt-1">
        <div className="flex flex-col shrink-0">
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {totalValue}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-primary shrink-0" />
            <span>{trendText}</span>
          </div>
        </div>

        <motion.div
          key={selectedRange}
          className="flex h-16 w-full items-end justify-between gap-1 overflow-hidden"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          aria-label="Graphique d'activité"
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="flex h-full w-full flex-col items-center justify-end gap-1 overflow-hidden"
              role="presentation"
            >
              <div className="w-full bg-muted/50 rounded-t-md h-full flex items-end overflow-hidden border-x border-t border-border">
                <motion.div
                  className="w-full rounded-t-sm bg-primary/80 hover:bg-primary transition-colors"
                  style={{
                    height: `${maxValue > 0 ? Math.min(100, (item.value / maxValue) * 100) : 0}%`,
                  }}
                  variants={barVariants}
                  aria-label={`${item.day}: ${item.value}`}
                />
              </div>
              <span className="text-[9px] font-medium text-muted-foreground">
                {item.day}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityChartCard;
```

---

## 5. Composant `ActivityCard` (Jauges Circulaires Multi-Métriques & Objectifs)

Affiche plusieurs indicateurs avec des jauges circulaires de complétion en CSS pur (`clip-path`), ainsi qu'une liste de vérification d'objectifs ou tâches.

### Code Source Intégral : `components/ui/activity-card.tsx`

```tsx
"use client";

import { Activity, ArrowUpRight, Plus, Target, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Metric {
  label: string;
  value: string;
  trend: number;
  unit?: string;
}

export interface Goal {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ActivityCardProps {
  category?: string;
  title?: string;
  metrics?: Metric[];
  dailyGoals?: Goal[];
  onAddGoal?: () => void;
  onToggleGoal?: (goalId: string) => void;
  onViewDetails?: () => void;
  className?: string;
}

export function ActivityCard({
  category = "Suivi",
  title = "Progression Globale",
  metrics = [
    { label: "Ventes", value: "24", trend: 100, unit: "ex." },
    { label: "Visites", value: "142", trend: 75, unit: "sess." },
    { label: "Complétion", value: "92", trend: 92, unit: "%" },
  ],
  dailyGoals = [
    { id: "1", title: "Validation du rapport mensuel", isCompleted: true },
    { id: "2", title: "Contrôle des flux d'intégration", isCompleted: false },
  ],
  onAddGoal,
  onToggleGoal,
  onViewDetails,
  className
}: ActivityCardProps) {
  const [isHovering, setIsHovering] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative h-full rounded-2xl p-5 sm:p-6 bg-card text-card-foreground border border-border hover:border-primary/40 transition-all duration-300 shadow-xs flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {category}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 my-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setIsHovering(metric.label)}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              <div
                className={cn(
                  "absolute inset-0 rounded-full border-4 border-primary transition-all duration-500",
                  isHovering === metric.label && "scale-105"
                )}
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${metric.trend}%, 0 ${metric.trend}%)`,
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {metric.value}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {metric.unit}
                </span>
              </div>
            </div>
            <span className="mt-2 text-xs font-semibold text-foreground truncate max-w-full">
              {metric.label}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {metric.trend}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Target className="w-4 h-4 text-primary shrink-0" />
            Objectifs
          </h4>
          {onAddGoal && (
            <button
              type="button"
              onClick={onAddGoal}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Ajouter un objectif"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {dailyGoals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => onToggleGoal?.(goal.id)}
              className={cn(
                "w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs",
                "bg-muted/40 border border-border hover:border-primary/40",
                "transition-all text-left"
              )}
            >
              <CheckCircle2
                className={cn(
                  "w-4 h-4 shrink-0",
                  goal.isCompleted
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "truncate",
                  goal.isCompleted
                    ? "text-muted-foreground line-through"
                    : "text-foreground font-medium"
                )}
              >
                {goal.title}
              </span>
            </button>
          ))}
        </div>

        {onViewDetails && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onViewDetails}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors"
            >
              Voir les détails
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;
```

---

## 6. Exemple d'Assemblage Universel

Dans n'importe quelle page de votre projet :

```tsx
"use client";

import React from "react";
import { DollarSign, ShoppingBag, Users, Zap } from "lucide-react";
import { KpiGrid, type KpiCardProps } from "@/components/ui/kpi-card";
import { KpiMetricCard } from "@/components/ui/kpi-metric-card";
import { ActivityChartCard } from "@/components/ui/activity-chart-card";
import { ActivityCard } from "@/components/ui/activity-card";

export function DashboardDemo() {
  const kpis: KpiCardProps[] = [
    {
      label: "Chiffre d'Affaires",
      value: 84500,
      formatValue: (v) => `${v.toLocaleString()} €`,
      icon: DollarSign,
      trend: 12.5,
      sparkline: [20, 35, 45, 60, 55, 75, 90],
      variant: "primary",
      subtext: "+10% vs période précédente",
    },
    {
      label: "Conversions Réalisées",
      value: 1420,
      icon: ShoppingBag,
      trend: 6.8,
      sparkline: [30, 45, 40, 65, 60, 80, 85],
      variant: "default",
    },
    {
      label: "Utilisateurs Actifs",
      value: 892,
      icon: Users,
      trend: -2.4,
      sparkline: [80, 75, 70, 65, 60, 55, 50],
      variant: "accent",
    },
  ];

  const chartData = [
    { day: "Lun", value: 14 },
    { day: "Mar", value: 22 },
    { day: "Mer", value: 18 },
    { day: "Jeu", value: 29 },
    { day: "Ven", value: 35 },
    { day: "Sam", value: 42 },
    { day: "Dim", value: 20 },
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* 1. Rangée de cartes animées avec Sparkline */}
      <KpiGrid cards={kpis} cols={3} />

      {/* 2. Rangée de métriques synthétiques compactes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiMetricCard
          label="Taux de Rétention"
          value="78.4%"
          delta="+3.2%"
          trend="up"
          tone="primary"
          icon={<Zap className="w-4 h-4" />}
        />
        <KpiMetricCard
          label="Encours Facturé"
          value="14 250 €"
          delta="-1.5%"
          trend="down"
          tone="default"
        />
        <KpiMetricCard
          label="Dossiers en Attente"
          value="12"
          delta="Stable"
          trend="flat"
          tone="muted"
        />
        <KpiMetricCard
          label="Score Moyen"
          value="9.4 / 10"
          delta="+0.3"
          trend="up"
          tone="accent"
        />
      </div>

      {/* 3. Rangée d'histogramme & Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChartCard
          title="Activité Hebdomadaire"
          totalValue="180 opérations"
          data={chartData}
        />
        <ActivityCard
          title="Objectifs de l'Équipe"
          category="Suivi Opérationnel"
        />
      </div>
    </div>
  );
}
```
