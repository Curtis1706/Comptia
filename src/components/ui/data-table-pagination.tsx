"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  labelSingular?: string;
  labelPlural?: string;
}

/**
 * Composant de pagination pour Data Table issu du catalogue 21st.dev (id: 25118 & 28327).
 * Adapté aux règles Ceilow : tokens sémantiques, chiffres tabulaires, pas d'emojis.
 */
export function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  labelSingular = "élément",
  labelPlural = "éléments",
}: DataTablePaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-background text-xs select-none">
      {/* Sélecteur de nombre de lignes par page */}
      <div className="flex items-center gap-2 text-muted">
        <Label htmlFor="rows-per-page" className="text-xs text-muted font-normal cursor-pointer">
          Lignes par page :
        </Label>
        <Select
          value={String(pageSize)}
          onValueChange={(val) => onPageSizeChange(Number(val))}
        >
          <SelectTrigger
            id="rows-per-page"
            className="h-7 w-16 text-xs bg-background border-border text-ink focus:ring-0 focus:border-border"
          >
            <SelectValue placeholder={String(pageSize)} />
          </SelectTrigger>
          <SelectContent className="bg-background border-border text-ink">
            {pageSizeOptions.map((opt) => (
              <SelectItem key={opt} value={String(opt)} className="text-xs">
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* État de la plage & Contrôles de navigation */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted tabular-nums">
          <strong className="font-semibold text-ink font-mono">{startItem}</strong> à{" "}
          <strong className="font-semibold text-ink font-mono">{endItem}</strong> sur{" "}
          <strong className="font-semibold text-ink font-mono">{totalItems}</strong>{" "}
          {totalItems <= 1 ? labelSingular : labelPlural}
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-7 w-7 text-ink border-border hover:bg-background-secondary disabled:opacity-40"
            title="Page précédente"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="sr-only">Page précédente</span>
          </Button>

          {/* Numéros de page visibles */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 5) return true;
                if (p === 1 || p === totalPages) return true;
                return Math.abs(p - currentPage) <= 1;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && (
                      <span className="px-1 text-muted font-mono">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => onPageChange(p)}
                      className={`h-7 min-w-7 px-2 text-xs rounded font-medium font-mono tabular-nums transition-colors ${
                        currentPage === p
                          ? "bg-ink text-background font-bold"
                          : "text-muted hover:text-ink hover:bg-background-secondary border border-transparent"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-7 w-7 text-ink border-border hover:bg-background-secondary disabled:opacity-40"
            title="Page suivante"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="sr-only">Page suivante</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
