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
  data?: { v: number }[];
}

const toneMap = {
  primary: { bg: "bg-primary-soft", fg: "text-primary", stroke: "hsl(221 83% 53%)" },
  success: { bg: "bg-success-soft", fg: "text-success", stroke: "hsl(160 84% 39%)" },
  warning: { bg: "bg-warning-soft", fg: "text-warning", stroke: "hsl(24 95% 53%)" },
  destructive: { bg: "bg-destructive-soft", fg: "text-destructive", stroke: "hsl(0 84% 60%)" },
};

export const KpiCard = ({ title, value, growth, icon: Icon, tone = "primary", subtitle, spark, sparkBase = 100, data: customData }: Props) => {
  const t = toneMap[tone];
  const positive = (growth ?? 0) >= 0;
  const data = customData || sparkline(sparkBase);
  const gradId = `g-${title.replace(/\s/g, "")}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition hover:shadow-elevated sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">{title}</p>
          <p className="mt-1 truncate font-display text-base font-bold leading-tight tracking-tight tabular text-foreground sm:text-lg md:text-xl lg:text-2xl">{value}</p>
        </div>
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10", t.bg)}>
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", t.fg)} />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          {growth !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:px-2 sm:text-xs",
                positive ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
              )}
            >
              {positive ? <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <ArrowDownRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
              {positive ? "+" : ""}
              {growth}%
            </span>
          )}
          {subtitle && <p className="mt-1 truncate text-[10px] text-muted-foreground sm:text-xs">{subtitle}</p>}
        </div>
        {spark && (
          <div className="h-8 w-16 shrink-0 sm:h-10 sm:w-20 lg:w-24">
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