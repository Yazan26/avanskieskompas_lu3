import type { BenefitCard, HowItWorksStep } from "@/types/content";

export const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuASmsmhMKdl2ZeMDHDHMPsL6YEimhvqtRVyeOz4tBxxXgL5sRdNJQrivG6IvwNTC0GDnGfVOxRABjzaeUsfGQUNsSfRTPtGnp6vUMY2L3IqGN5lzR9lPq6dHsqc3Pw0oh0XPFZ0VPGp-pOaHhRaNG9mORhAZoS0Ww8G2-ZtQczlw5dIYXqj4HbfXCz9MhPtZt9osDcVrHaUOtZm1zZJ3hngNzm7pFwu-Ye4Fw4Ds0pP-hoKzGfDd0lc1-2nll2V_dSOazCjc1dybzdG";

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "step-1",
    icon: "rule",
    title: "1. Beantwoord Vragen",
    description:
      "Vertel ons over je interesses en wat je zoekt in een module.",
  },
  {
    id: "step-2",
    icon: "auto_awesome",
    title: "2. Ontvang je Matches",
    description:
      "Ons slimme systeem analyseert je antwoorden en vindt de beste opties.",
  },
  {
    id: "step-3",
    icon: "explore",
    title: "3. Ontdek & Kies",
    description:
      "Vergelijk de aanbevolen modules en maak de perfecte keuze voor jou.",
  },
];

export const benefitCards: BenefitCard[] = [
  {
    id: "benefit-1",
    icon: "person_search",
    title: "Persoonlijk Advies",
    description: "Krijg aanbevelingen die echt bij jou passen.",
  },
  {
    id: "benefit-2",
    icon: "schedule",
    title: "Tijdbesparend",
    description: "Niet meer urenlang zoeken door lijsten.",
  },
  {
    id: "benefit-3",
    icon: "lightbulb",
    title: "Ontdek Nieuwe Kansen",
    description: "Vind modules waar je zelf misschien nooit aan had gedacht.",
  },
];
