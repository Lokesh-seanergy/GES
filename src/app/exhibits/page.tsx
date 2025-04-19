import MainLayout from "@/components/mainlayout/MainLayout";
import UnderDevelopment from "../under-development";

export default function ExhibitsPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Exhibits" }]}>
      <UnderDevelopment />
    </MainLayout>
  );
}
