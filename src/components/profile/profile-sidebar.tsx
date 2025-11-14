import { profileNavItems } from "@/data/profile";
import clsx from "clsx";

interface ProfileSidebarProps {
  name: string;
  subtitle: string;
  avatar: string;
}

export function ProfileSidebar({
  name,
  subtitle,
  avatar,
}: ProfileSidebarProps) {
  return (
    <div className="sticky top-24 flex flex-col gap-4 rounded-2xl bg-card dark:bg-card-dark p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="size-12 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${avatar})` }}
          aria-label={name}
        />
        <div>
          <p className="text-base font-semibold text-text dark:text-text-dark">
            {name}
          </p>
          <p className="text-sm text-muted dark:text-muted-dark">{subtitle}</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 pt-2">
        {profileNavItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted dark:text-muted-dark hover:text-primary",
              item.id === "logout" &&
                "mt-4 border-t border-border pt-4 text-text dark:text-text-dark",
            )}
          >
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
