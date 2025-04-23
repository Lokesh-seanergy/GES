"use client";

import { useRouter } from "next/navigation";
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Order } from "@/types/orders";
import { formatDate } from "@/lib/utils";

interface OrderDetailsClientProps {
  order: Order;
}

export default function OrderDetailsClient({ order }: OrderDetailsClientProps) {
  const router = useRouter();

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Orders", href: "/orders" },
        { label: order.orderId },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push("/orders")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Order ID</Label>
                  <Input value={order.orderId} readOnly />
                </div>
                <div>
                  <Label>Show ID</Label>
                  <Input value={order.showId} readOnly />
                </div>
                <div>
                  <Label>Customer PO</Label>
                  <Input value={order.customerPO} readOnly />
                </div>
                <div>
                  <Label>Order Date</Label>
                  <Input value={formatDate(order.orderDate)} readOnly />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-2">
                    <Badge variant="default">{order.orderType}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Sub Total</Label>
                  <Input value={`$${order.subTotal.toLocaleString()}`} readOnly />
                </div>
                <div>
                  <Label>Tax</Label>
                  <Input value={`$${order.tax.toLocaleString()}`} readOnly />
                </div>
                <div>
                  <Label>Total</Label>
                  <Input value={`$${order.total.toLocaleString()}`} readOnly />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <Card key={item.serialNo}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.orderedItem}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.itemDescription}
                          </p>
                          <div className="mt-2 space-x-4 text-sm text-gray-600">
                            <span>Quantity: {item.quantity}</span>
                            <span>Unit Price: ${item.newPrice.toLocaleString()}</span>
                            <span>Total: ${item.extendedPrice.toLocaleString()}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{item.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 