import MainLayout from "@/components/mainlayout/MainLayout";
import UnderDevelopment from "../under-development";

export default function ReportsPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Reports" }]}>
      <UnderDevelopment />
    </MainLayout>
  );
}
