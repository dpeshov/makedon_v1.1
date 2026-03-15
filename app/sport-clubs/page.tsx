import { Directory } from "@/ui/Directory";

export const metadata = {
  title: "Sport Clubs | Macedonian Diaspora Business Register"
};

export const dynamic = "force-dynamic";

export default function SportClubsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = searchParams as {
    q?: string;
    country?: string;
    city?: string;
    registered?: string;
  };

  return (
    <Directory
      title="Sport Clubs"
      description="Browse Macedonian sport clubs around the world."
      basePath="/sport-clubs"
      registerHref="/register/sport-club"
      industry={{ fixedIndustry: "Sport Club" }}
      searchParams={params}
    />
  );
}