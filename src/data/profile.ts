import type { ProfileNavItem } from "@/types/content";

export const profileNavItems: ProfileNavItem[] = [
  {
    id: "account",
    label: "Accountinstellingen",
    icon: "person",
    href: "/profiel",
    active: true,
  },
  {
    id: "modules",
    label: "Mijn Modules",
    icon: "bookmark",
    href: "/modules",
  },
  {
    id: "preferences",
    label: "Mijn Voorkeuren",
    icon: "tune",
    href: "/profiel",
  },
  {
    id: "activity",
    label: "Activiteit",
    icon: "history",
    href: "/profiel",
  },
  {
    id: "logout",
    label: "Uitloggen",
    icon: "logout",
    href: "/",
  },
];
