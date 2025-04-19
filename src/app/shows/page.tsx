import MainLayout from "@/components/mainlayout/MainLayout";
import UnderDevelopment from "../under-development";

export default function ShowsPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Shows" }]}>
      <UnderDevelopment />
    </MainLayout>
  );
}
