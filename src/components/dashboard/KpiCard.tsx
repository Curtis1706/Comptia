import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { sparkline } from "@/data/mock";

interface Props {
  title: string;
  value: string;
  growth?: number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "destructive";
  subtitle?: string;
  spark?: boolean;
  sparkBase?: number;
}

const toneMap = {
  primary: { bg: "bg-primary-soft", fg: "text-primary", stroke: "hsl(221 83% 53%)" },
  success: { bg: "bg-success-soft", fg: "text-success", stroke: "hsl(160 84% 39%)" },
  warning: { bg: "bg-warning-soft", fg: "text-warning", stroke: "hsl(24 95% 53%)" },
  destructive: { bg: "bg-destructive-soft", fg: "text-destructive", stroke: "hsl(0 84% 60%)" },
};

export const KpiCard = ({ title, value, growth, icon: Icon, tone = "primary", subtitle, spark, sparkBase = 100 }: Props) => {
  const t = toneMap[tone];
  const positive = (growth ?? 0) >= 0;
  const data = sparkline(sparkBase);
  const gradId = `g-${title.replace(/\s/g, "")}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular text-foreground">{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", t.bg)}>
          <Icon className={cn("h-5 w-5", t.fg)} />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          {growth !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                positive ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
              )}
            >
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {positive ? "+" : ""}
              {growth}%
            </span>
          )}
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {spark && (
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={t.stroke} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={t.stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={t.stroke} strokeWidth={2} fill={`url(#${gradId})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};