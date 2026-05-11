import { AppShell } from "@/components/layout/AppShell";
import ComptabilitePage from "@/views/Comptabilite";
import ThirdPartiesPage from "@/views/ThirdParties";
import RapprochementPage from "@/views/Rapprochement";
import LettragePage from "@/views/Lettrage";

interface Props {
  params: Promise<{ section: string }>;
}

export default async function ComptabiliteSectionPage({ params }: Props) {
  const { section } = await params;

  const renderSection = () => {
    switch (section) {
      case "tiers":
        return <ThirdPartiesPage />;
      case "rapprochement":
        return <RapprochementPage />;
      case "lettrage":
        return <LettragePage />;
      default:
        return <ComptabilitePage />;
    }
  };

  return <AppShell>{renderSection()}</AppShell>;
}
