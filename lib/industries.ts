export const INDUSTRIES = [
  "Food & Beverage",
  "Retail",
  "Construction",
  "Real Estate",
  "Professional Services",
  "Technology",
  "Healthcare",
  "Education",
  "Logistics",
  "Hospitality",
  "Manufacturing",
  "Arts & Culture",
  "Other"
] as const;

export type Industry = (typeof INDUSTRIES)[number];

