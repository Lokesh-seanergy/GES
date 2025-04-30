import MainLayout from "@/components/mainlayout/MainLayout";
import UnderDevelopment from "../under-development";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function ExhibitsPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Exhibits" }]}>
      <UnderDevelopment />
      <ScrollToTop />
    </MainLayout>
  );
}
