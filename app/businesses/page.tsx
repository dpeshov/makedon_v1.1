import { Directory } from "@/ui/Directory";

export const metadata = {
  title: "Businesses | Macedonian Diaspora Business Register"
};

export const dynamic = "force-dynamic";

const NON_BUSINESS_INDUSTRIES = ["Cultural Club", "Sport Club"] as const;

export default function BusinessesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = searchParams as {
    q?: string;
    country?: string;
    city?: string;
    industry?: string;
    registered?: string;
  };

  return (
    <Directory
      title="Businesses"
      description="Browse Macedonian diaspora businesses worldwide. Search by name, filter by location and industry, and register a new listing."
      basePath="/businesses"
      registerHref="/register/business"
      allowDemoFallback
      industry={{ picker: true, excludeIndustries: [...NON_BUSINESS_INDUSTRIES] }}
      searchParams={params}
    />
  );
}