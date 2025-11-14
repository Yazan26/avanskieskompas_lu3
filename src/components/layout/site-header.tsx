import type { NavItem } from "@/types/content";
import clsx from "clsx";
import Link from "next/link";
import { BrandMark } from "./brand-mark";

interface SiteHeaderProps {
  title?: string;
  navItems?: NavItem[];
  actionSlot?: React.ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  profileImage?: string;
  translucent?: boolean;
  className?: string;
}

export function SiteHeader({
  title = "Avans VKM Zoeker",
  navItems,
  actionSlot,
  showSearch,
  searchPlaceholder = "Zoek modules...",
  profileImage,
  translucent = false,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={clsx(
        "w-full border-b border-border/70 dark:border-border-dark/70",
        translucent ? "bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md" : "bg-card dark:bg-card-dark",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold text-text dark:text-text-dark"
            aria-label="Terug naar startpagina"
          >
            <BrandMark className="h-6 w-6" />
            <span className="hidden text-base md:inline">{title}</span>
          </Link>
          {actionSlot && (
            <div className="flex items-center gap-3 lg:hidden">{actionSlot}</div>
          )}
        </div>
        {navItems?.length ? (
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted dark:text-muted-dark lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "transition-colors hover:text-primary",
                  item.isActive && "text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end lg:gap-4">
          {showSearch ? (
            <label className="flex w-full items-center gap-2 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark px-3 py-2 text-sm text-muted dark:text-muted-dark md:max-w-xs">
              <span className="material-symbols-outlined text-base text-muted dark:text-muted-dark">
                search
              </span>
              <input
                type="search"
                placeholder={searchPlaceholder}
                className="h-8 flex-1 bg-transparent text-sm text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none"
                aria-label={searchPlaceholder}
              />
            </label>
          ) : null}
          <div className="hidden items-center gap-3 lg:flex">
            {actionSlot}
            {profileImage ? (
              <span
                className="size-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${profileImage})` }}
                aria-label="Profiel"
              />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
