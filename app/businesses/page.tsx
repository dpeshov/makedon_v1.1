import { Directory } from "@/ui/Directory";

export const metadata = {
  title: "Businesses | Macedonian Diaspora Business Register"
};

export const dynamic = "force-dynamic";

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
      industry={{ picker: true }}
      table="businesses"
      nameColumn="company_name"
      cardKind="business"
      searchParams={params}
    />
  );
}
