import { Order } from "@/types/orders";
import OrderDetailsClient from "./OrderDetailsClient";
import { mockOrders } from "../data";

type PageProps = {
  params: {
    orderId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function OrderDetailsPage({ params }: PageProps) {
  const order = mockOrders.find((order: Order) => order.orderId === params.orderId);

  if (!order) {
    throw new Error(`Order with ID ${params.orderId} not found`);
  }

  return <OrderDetailsClient order={order} />;
} 