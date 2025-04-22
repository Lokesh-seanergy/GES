import MainLayout from "@/components/mainlayout/MainLayout";
import UnderDevelopment from "../under-development";

export default function SettingsPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Settings" }]}>
      <UnderDevelopment />
    </MainLayout>
  );
}
