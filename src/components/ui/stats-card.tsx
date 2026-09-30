"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, useSpring } from "framer-motion";
import { ChevronRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Chart item definition
export type ChartDataItem = {
  name: string;
  value: number; // Percentage height (0-100)
  color?: string; // Tailwind class
};

export interface StatsCardProps {
  title: string;
  currentValue: number;
  valuePrefix?: string;
  valuePostfix?: string;
  description: React.ReactNode;
  chartData?: ChartDataItem[];
  trendBadge?: React.ReactNode;
  footer?: React.ReactNode;
  tooltipText?: string;
  onActionClick?: () => void;
  className?: string;
  defaultBarColor?: string;
  highlightedBarColor?: string;
}

const AnimatedValue = ({
  value,
  prefix = "",
  postfix = "",
}: {
  value: number;
  prefix?: string;
  postfix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 30, stiffness: 100, mass: 1 });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [spring, isInView, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Intl.NumberFormat("fr-FR").format(
          Math.round(latest)
        )}${postfix}`;
      }
    });
    return () => unsubscribe();
  }, [prefix, postfix, spring]);

  return <span ref={ref} className="font-mono tabular-nums" />;
};

/**
 * Composant StatsCard issu du catalogue 21st.dev (id: 7841)
 * Adapté aux règles sémantiques et à la charte graphique Ceilow (Inter, chiffres tabulaires, tokens sémantiques).
 */
export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      title,
      currentValue,
      valuePrefix,
      valuePostfix,
      description,
      chartData,
      trendBadge,
      footer,
      tooltipText,
      onActionClick,
      className,
      defaultBarColor = "bg-primary/25",
      highlightedBarColor = "bg-primary",
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.3 });
    const controls = useAnimation();

    const barVariants = {
      hidden: { height: "0%" },
      visible: {
        height: "var(--bar-height, 0%)",
        transition: { type: "spring" as const, damping: 15, stiffness: 100 },
      },
    };

    useEffect(() => {
      if (isInView) {
        controls.start("visible");
      }
    }, [isInView, controls]);

    const HeaderElement = onActionClick ? "button" : "div";

    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-background border border-border rounded-lg p-5 flex flex-col justify-between transition-shadow hover:shadow-xs",
          className
        )}
      >
        <div ref={cardRef}>
          {/* En-tête de la carte */}
          <div className="flex items-center justify-between gap-2">
            <HeaderElement
              onClick={onActionClick}
              className={cn(
                "flex items-center gap-1.5 text-left",
                onActionClick &&
                  "group cursor-pointer hover:opacity-80 transition-opacity"
              )}
              aria-label={onActionClick ? `${title}, voir plus` : undefined}
            >
              <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
                {title}
              </span>
              {tooltipText && (
                <div
                  className="inline-flex text-muted hover:text-ink cursor-help"
                  title={tooltipText}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
              )}
              {onActionClick && (
                <ChevronRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5" />
              )}
            </HeaderElement>

            {trendBadge && <div>{trendBadge}</div>}
          </div>

          {/* Valeur principale & Description */}
          <div className="mt-2">
            <div className="text-[22px] font-bold tracking-tight text-ink font-mono tabular-nums">
              <AnimatedValue
                value={currentValue}
                prefix={valuePrefix}
                postfix={valuePostfix}
              />
            </div>
            {description && (
              <div className="text-xs text-muted font-normal mt-1">{description}</div>
            )}
          </div>

          {/* Mini graphique en barres optionnel (21st.dev pattern) */}
          {chartData && chartData.length > 0 && (
            <motion.div
              className="flex h-12 w-full items-end gap-1.5 mt-3 pt-2 border-t border-border"
              initial="hidden"
              animate={controls}
              transition={{ staggerChildren: 0.08 }}
              aria-label="Graphique d'évolution"
            >
              {chartData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                >
                  <motion.div
                    className={cn(
                      "w-full rounded-t-xs",
                      item.color
                        ? item.color
                        : index === chartData.length - 1
                        ? highlightedBarColor
                        : defaultBarColor
                    )}
                    variants={barVariants}
                    style={
                      {
                        "--bar-height": `${Math.max(item.value, 6)}%`,
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-[9px] font-mono text-muted">
                    {item.name}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Pied de carte personnalisé (ex: jauge segmentée ou sparkline) */}
        {footer && <div className="mt-3 pt-2 border-t border-border">{footer}</div>}
      </div>
    );
  }
);

StatsCard.displayName = "StatsCard";
