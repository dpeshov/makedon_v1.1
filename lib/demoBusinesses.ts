type DemoBusiness = {
  id: string;
  company_name: string;
  industry: string;
  sub_industry: string | null;
  country: string;
  city: string;
  address: string | null;
  phone: string | null;
  other_locations: string | null;
  locations_description: string | null;
  description: string;
  offerings: string | null;
  offerings_description: string | null;
  website: string | null;
};

export const DEMO_BUSINESSES: DemoBusiness[] = [
  {
    id: "demo-1",
    company_name: "Skopje Street Bakery",
    industry: "Food & Beverage",
    sub_industry: "Bakery",
    country: "Germany",
    city: "Berlin",
    address: "Prenzlauer Allee 12",
    phone: "+49 30 123 456",
    other_locations: "Munich; Hamburg",
    locations_description: "Delivery across Germany (selected cities).",
    description: "Traditional Macedonian pastries, breads, and celebratory cakes for the diaspora community.",
    offerings: "Burek, kifli, cakes, catering",
    offerings_description: "Custom orders for events, corporate catering, and weekly delivery boxes.",
    website: "https://example.com/bakery"
  },
  {
    id: "demo-2",
    company_name: "Ohrid Lake Travel Co.",
    industry: "Hospitality",
    sub_industry: "Travel & Tours",
    country: "United States",
    city: "Chicago",
    address: "210 W Lake St",
    phone: "+1 (312) 555-0142",
    other_locations: null,
    locations_description: "Serving clients across North America.",
    description: "Diaspora-focused travel planning with curated Balkan itineraries and group trips.",
    offerings: "Flight + hotel planning, guided tours, group travel",
    offerings_description: "Personalized planning with flexible budgets and bilingual support.",
    website: "https://example.com/travel"
  },
  {
    id: "demo-3",
    company_name: "Vardar IT Studio",
    industry: "Technology",
    sub_industry: "Web Development",
    country: "Switzerland",
    city: "Zurich",
    address: null,
    phone: "+41 44 555 0199",
    other_locations: "Remote",
    locations_description: "Remote-first, available worldwide.",
    description: "Small product studio building fast, clean websites and internal tools for SMEs.",
    offerings: "Web apps, landing pages, integrations",
    offerings_description: "Next.js builds, Supabase backends, and quick MVP delivery.",
    website: "https://example.com/it"
  },
  {
    id: "demo-4",
    company_name: "Diaspora Accounting & Tax",
    industry: "Professional Services",
    sub_industry: "Accounting",
    country: "Australia",
    city: "Melbourne",
    address: "Collins St 88",
    phone: "+61 3 5550 0123",
    other_locations: null,
    locations_description: null,
    description: "Bookkeeping, payroll, and tax support for small businesses and contractors.",
    offerings: "Bookkeeping, BAS/GST, payroll",
    offerings_description: "Monthly packages and one-off advisory sessions.",
    website: "https://example.com/accounting"
  },
  {
    id: "demo-5",
    company_name: "Bitola Builders",
    industry: "Construction",
    sub_industry: "Renovations",
    country: "Canada",
    city: "Toronto",
    address: null,
    phone: "+1 (647) 555-0107",
    other_locations: "Mississauga; Vaughan",
    locations_description: "Greater Toronto Area.",
    description: "Residential renovations, kitchens, bathrooms, and small commercial fit-outs.",
    offerings: "Renovations, tiling, drywall, painting",
    offerings_description: "Free estimates and transparent timelines.",
    website: "https://example.com/builders"
  },
  {
    id: "demo-6",
    company_name: "Tetovo Fitness Club",
    industry: "Healthcare",
    sub_industry: "Fitness",
    country: "Austria",
    city: "Vienna",
    address: "Landstrasse 41",
    phone: "+43 1 555 0133",
    other_locations: null,
    locations_description: null,
    description: "Community gym with personal training and small-group classes.",
    offerings: "Personal training, group classes, nutrition coaching",
    offerings_description: "Beginner-friendly programs and flexible memberships.",
    website: "https://example.com/fitness"
  },
  {
    id: "demo-7",
    company_name: "Sun of Macedonia Imports",
    industry: "Logistics",
    sub_industry: "Import/Export",
    country: "Netherlands",
    city: "Rotterdam",
    address: null,
    phone: "+31 10 555 0188",
    other_locations: null,
    locations_description: "EU-wide delivery.",
    description: "Importing Balkan specialty goods and distributing to European retailers.",
    offerings: "Import, warehousing, last-mile distribution",
    offerings_description: "Cold-chain options available on request.",
    website: "https://example.com/imports"
  },
  {
    id: "demo-8",
    company_name: "Krushevo Crafts",
    industry: "Arts & Culture",
    sub_industry: "Handmade Goods",
    country: "United Kingdom",
    city: "London",
    address: null,
    phone: null,
    other_locations: "Online store",
    locations_description: "Ships worldwide.",
    description: "Handmade crafts inspired by Macedonian folk motifs and modern design.",
    offerings: "Decor, gifts, custom pieces",
    offerings_description: "Small-batch releases and custom commissions.",
    website: "https://example.com/crafts"
  },
  {
    id: "demo-9",
    company_name: "Pelister Real Estate",
    industry: "Real Estate",
    sub_industry: "Property Management",
    country: "Italy",
    city: "Milan",
    address: null,
    phone: "+39 02 555 0101",
    other_locations: null,
    locations_description: null,
    description: "Helping diaspora clients buy, rent, and manage properties with confidence.",
    offerings: "Rentals, sales support, property management",
    offerings_description: "Bilingual coordination and trusted local partners.",
    website: "https://example.com/realestate"
  },
  {
    id: "demo-10",
    company_name: "Strumica Retail & Deli",
    industry: "Retail",
    sub_industry: "Deli",
    country: "France",
    city: "Paris",
    address: "Rue du Commerce 19",
    phone: "+33 1 55 55 01 55",
    other_locations: null,
    locations_description: null,
    description: "Balkan groceries, deli counter, and weekly fresh imports with Macedonian favorites.",
    offerings: "Groceries, deli, gift baskets",
    offerings_description: "Corporate gifts and seasonal baskets available.",
    website: "https://example.com/deli"
  }
];
