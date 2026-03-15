import { Directory } from "@/ui/Directory";

export const metadata = {
  title: "Cultural Clubs | Macedonian Diaspora Business Register"
};

export const dynamic = "force-dynamic";

export default function CulturalClubsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = searchParams as {
    q?: string;
    country?: string;
    city?: string;
    registered?: string;
  };

  return (
    <Directory
      title="Cultural Clubs"
      description="Browse Macedonian cultural clubs and associations around the world."
      basePath="/cultural-clubs"
      registerHref="/register/cultural-club"
      table="cultural_clubs"
      nameColumn="club_name"
      cardKind="cultural-club"
      searchParams={params}
    />
  );
}