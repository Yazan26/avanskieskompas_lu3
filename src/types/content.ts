export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  selected?: boolean;
}

export type FilterType = "checkbox" | "radio";

export interface FilterSection {
  id: string;
  title: string;
  type: FilterType;
  options: FilterOption[];
}

export interface ModuleSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  ects: number;
  period: string;
  language: string;
  location?: string;
  reason?: string;
  highlightIcon?: string;
  highlightLabel?: string;
  saved?: boolean;
}

export interface ModuleDetail extends ModuleSummary {
  code: string;
  description: string;
  prerequisites: string[];
  assessment: string;
  periods: string;
  rating: {
    value: number;
    count: number;
  };
  relatedIds: string[];
}

export interface HowItWorksStep {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface BenefitCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProfileNavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}
