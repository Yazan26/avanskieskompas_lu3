import type { ModuleSummary } from "@/types/content";
import clsx from "clsx";
import Link from "next/link";

interface ModuleCardProps {
  module: ModuleSummary;
  variant?: "recommendation" | "search";
}

export function ModuleCard({
  module,
  variant = "recommendation",
}: ModuleCardProps) {
  const isSearch = variant === "search";
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark transition-shadow hover:shadow-xl">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted dark:text-muted-dark">
          {module.code ?? "Module"} · {module.period}
        </div>
        <h3 className="text-xl font-bold text-text dark:text-text-dark">
          {module.title}
        </h3>
        <p className="flex-1 text-sm text-muted dark:text-muted-dark">
          {module.summary}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            {module.ects} ECTS
          </span>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">
            {module.period}
          </span>
          <span className="rounded-full bg-info/10 px-3 py-1 text-info">
            {module.language}
          </span>
          {module.location ? (
            <span className="rounded-full bg-muted/10 px-3 py-1 text-muted">
              {module.location}
            </span>
          ) : null}
        </div>
        {module.reason && !isSearch ? (
          <div className="flex items-start gap-2 rounded-xl bg-surface dark:bg-surface-dark/70 p-3 text-xs text-muted dark:text-muted-dark">
            <span className="material-symbols-outlined text-primary text-base">
              {module.highlightIcon ?? "auto_awesome"}
            </span>
            <p>{module.reason}</p>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-3 border-t border-border dark:border-border-dark px-6 py-4">
        <Link
          href={`/modules/${module.slug}`}
          className="flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Bekijk details
        </Link>
        <button
          type="button"
          className={clsx(
            "flex size-10 items-center justify-center rounded-lg border transition-colors",
            module.saved
              ? "border-primary/70 bg-primary/10 text-primary"
              : "border-border dark:border-border-dark text-muted dark:text-muted-dark hover:border-primary/40 hover:text-primary",
          )}
          aria-label={module.saved ? "Verwijder uit favorieten" : "Sla module op"}
        >
          <span className="material-symbols-outlined text-xl">
            {module.saved ? "bookmark" : "bookmark_add"}
          </span>
        </button>
      </div>
    </article>
  );
}
