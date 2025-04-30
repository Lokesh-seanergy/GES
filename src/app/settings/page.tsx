import MainLayout from "@/components/mainlayout/MainLayout";
import UnderDevelopment from "../under-development";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function SettingsPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Settings" }]}>
      <UnderDevelopment />
      <ScrollToTop />
    </MainLayout>
  );
}
