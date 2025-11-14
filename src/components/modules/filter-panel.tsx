import type { FilterSection } from "@/types/content";
import clsx from "clsx";

interface FilterPanelProps {
  title?: string;
  filters: FilterSection[];
  applyLabel?: string;
  className?: string;
}

export function FilterPanel({
  title = "Filters",
  filters,
  applyLabel = "Filters toepassen",
  className,
}: FilterPanelProps) {
  return (
    <div
      className={clsx(
        "flex w-full flex-col gap-6 rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-5",
        className,
      )}
    >
      <div className="flex items-center gap-3 text-sm font-semibold text-text dark:text-text-dark">
        <span className="material-symbols-outlined text-base text-muted dark:text-muted-dark">
          filter_alt
        </span>
        {title}
      </div>
      <div className="flex flex-col gap-6 text-sm">
        {filters.map((section) => (
          <div key={section.id} className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-muted-dark">
              {section.title}
            </p>
            <div className="flex flex-col gap-1">
              {section.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-text dark:text-text-dark hover:bg-surface/40 dark:hover:bg-surface-dark/40"
                >
                  <input
                    type={section.type === "radio" ? "radio" : "checkbox"}
                    name={section.id}
                    defaultChecked={option.selected}
                    className={clsx(
                      "h-4 w-4 appearance-none rounded border-2 border-border text-primary focus:outline-none focus:ring-2 focus:ring-primary/50",
                      section.type === "radio" ? "rounded-full" : "rounded",
                    )}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
        {applyLabel}
      </button>
    </div>
  );
}
