import MainLayout from "@/components/mainlayout/MainLayout";
import UnderDevelopment from "../under-development";

export default function CustomersPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Customers" }]}>
      <UnderDevelopment />
    </MainLayout>
  );
}
