import type {
  FilterSection,
  ModuleDetail,
  ModuleSummary,
} from "@/types/content";

export const recommendationFilters: FilterSection[] = [
  {
    id: "period",
    title: "Periode",
    type: "checkbox",
    options: [
      { id: "p1", label: "Period 1", value: "1" },
      { id: "p2", label: "Period 2", value: "2" },
      { id: "p3", label: "Period 3", value: "3", selected: true },
      { id: "p4", label: "Period 4", value: "4" },
    ],
  },
  {
    id: "language",
    title: "Taal",
    type: "checkbox",
    options: [
      { id: "lang-nl", label: "Dutch", value: "nl", selected: true },
      { id: "lang-en", label: "English", value: "en" },
    ],
  },
  {
    id: "location",
    title: "Locatie",
    type: "checkbox",
    options: [
      { id: "loc-breda", label: "Breda", value: "breda" },
      { id: "loc-denbosch", label: "’s-Hertogenbosch", value: "denbosch" },
      { id: "loc-tilburg", label: "Tilburg", value: "tilburg" },
    ],
  },
];

export const searchFilters: FilterSection[] = [
  {
    id: "category",
    title: "Categorie",
    type: "checkbox",
    options: [
      {
        id: "cat-tech",
        label: "Technologie",
        value: "technology",
        selected: true,
      },
      { id: "cat-business", label: "Business", value: "business" },
      {
        id: "cat-art",
        label: "Kunst & Cultuur",
        value: "art",
        selected: true,
      },
      { id: "cat-health", label: "Gezondheid", value: "health" },
    ],
  },
  {
    id: "periode",
    title: "Periode",
    type: "radio",
    options: [
      { id: "per-a", label: "Periode A", value: "a", selected: true },
      { id: "per-b", label: "Periode B", value: "b" },
    ],
  },
];

export const recommendedModules: ModuleSummary[] = [
  {
    id: "circular-entrepreneurship",
    slug: "circular-entrepreneurship",
    title: "Circular Entrepreneurship",
    summary:
      "Leer duurzame businessmodellen bouwen die bijdragen aan een circulaire economie.",
    ects: 6,
    period: "Period 3",
    language: "English",
    reason: "Gebaseerd op je interesse in 'Innovation & Business'.",
    highlightIcon: "auto_awesome",
  },
  {
    id: "data-science-business",
    slug: "data-science-business",
    title: "Data Science for Business",
    summary:
      "Ontdek hoe je data gebruikt om gefundeerde zakelijke beslissingen te nemen.",
    ects: 6,
    period: "Period 4",
    language: "English",
    reason: "Je excelleerde in 'Statistics', deze module sluit hierop aan.",
    highlightIcon: "auto_awesome",
  },
  {
    id: "creative-storytelling",
    slug: "creative-storytelling",
    title: "Creative Storytelling",
    summary:
      "Beheer de kunst van verhalen vertellen en maak content voor verschillende media.",
    ects: 6,
    period: "Period 3",
    language: "Dutch",
    reason: "Aanbevolen voor je 'Communication' leerprofiel.",
    highlightIcon: "auto_awesome",
    saved: true,
  },
];

export const searchModules: ModuleSummary[] = [
  {
    id: "intro-to-ai",
    slug: "introduction-to-ai",
    title: "Introduction to AI",
    summary:
      "Verken de basisprincipes van kunstmatige intelligentie en machine learning.",
    ects: 5,
    period: "Periode A",
    language: "ENG",
    highlightIcon: "bookmark_border",
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing-strategy",
    title: "Digital Marketing Strategy",
    summary:
      "Leer hoe je effectieve digitale marketingcampagnes ontwikkelt en uitvoert.",
    ects: 5,
    period: "Periode A",
    language: "NL",
    highlightIcon: "bookmark_border",
  },
  {
    id: "creative-coding",
    slug: "creative-coding",
    title: "Creative Coding",
    summary:
      "Combineer kunst en technologie door interactieve ervaringen met code te maken.",
    ects: 10,
    period: "Periode B",
    language: "ENG",
    highlightIcon: "bookmark",
    saved: true,
  },
  {
    id: "sustainable-business",
    slug: "sustainable-business-models",
    title: "Sustainable Business Models",
    summary:
      "Ontwerp modellen die economische, ecologische en sociale waarde creëren.",
    ects: 5,
    period: "Periode A",
    language: "NL",
    highlightIcon: "bookmark_border",
  },
];

export const moduleDetails: ModuleDetail[] = [
  {
    id: "ai-for-business",
    slug: "ai-for-business",
    title: "AI for Business",
    summary: "PRJ4",
    ects: 15,
    period: "3 & 4",
    periods: "3 & 4",
    language: "Dutch",
    location: "Breda",
    code: "PRJ4",
    description:
      "‘AI for Business’ richt zich op het toepassen van kunstmatige intelligentie in een zakelijke context. Studenten onderzoeken hoe AI praktische waarde creëert binnen organisaties en leren strategie en implementatie combineren.",
    prerequisites: [
      "Basiskennis van programmeren (bij voorkeur Python).",
      "Inleidende statistiek en data-analyse.",
      "Voltooide propedeuse.",
    ],
    assessment:
      "Een praktijkgericht teamproject (60%) gecombineerd met een individueel tentamen (40%). Beide onderdelen moeten met minimaal een 5,5 worden afgerond.",
    rating: {
      value: 4.5,
      count: 23,
    },
    reason:
      "Aanbevolen vanwege je focus op digitale transformatie en business innovatie.",
    highlightIcon: "star",
    highlightLabel: "Aanbevolen voor jou",
    relatedIds: ["data-science-fundamentals", "digital-transformation"],
  },
];

export const relatedModules: ModuleSummary[] = [
  {
    id: "data-science-fundamentals",
    slug: "data-science-fundamentals",
    title: "Data Science Fundamentals",
    summary: "PRJ5 - 15 ECTS",
    ects: 15,
    period: "Periode B",
    language: "English",
  },
  {
    id: "digital-transformation",
    slug: "digital-transformation",
    title: "Digital Transformation",
    summary: "BUS2 - 15 ECTS",
    ects: 15,
    period: "Periode C",
    language: "Dutch",
  },
];

export const moduleLookup: Record<string, ModuleDetail> = Object.fromEntries(
  moduleDetails.map((module) => [module.slug, module])
);
