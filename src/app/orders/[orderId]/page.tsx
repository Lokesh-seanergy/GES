import type { Order } from "@/types/orders";
import OrderDetailsClient from "./OrderDetailsClient";
import { mockOrders } from "../data";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;

  const order = mockOrders.find(
    (order: Order) => order.orderId === resolvedParams.orderId
  );

  if (!order) {
    throw new Error(`Order with ID ${resolvedParams.orderId} not found`);
  }

  return <OrderDetailsClient order={order} />;
}
