'use client';

import { useState } from 'react';
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const orderData = {
  orderNumber: "577725",
  customer: "3M",
  salesChannel: "EXHIBITOR",
  terms: "30 NET",
  source: "GES Show Workbench",
  project: "07162211",
  orderDate: "23-APR-2025 11:06:41",
  customerPO: "",
  subtotal: "0.00",
  tax: "0.00",
  cancelCharge: "0.00",
  total: "0.00"
};

export default function OrderDetail() {
  return (
    <MainLayout>
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">GES OM: Header - 1</h2>
              <Button variant="outline">Edit Order</Button>
            </div>

            <Tabs defaultValue="main">
              <TabsList>
                <TabsTrigger value="main">Main</TabsTrigger>
                <TabsTrigger value="others">Others</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>

              <TabsContent value="main">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label className="w-32">Order #</Label>
                      <Input value={orderData.orderNumber} readOnly />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-32">Sales Channel</Label>
                      <Input value={orderData.salesChannel} readOnly className="bg-yellow-50" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-32">Source</Label>
                      <Input value={orderData.source} readOnly />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-32">Order Date</Label>
                      <Input value={orderData.orderDate} readOnly />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label className="w-32">Customer</Label>
                      <Input value={orderData.customer} readOnly />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-32">Terms</Label>
                      <Input value={orderData.terms} readOnly className="bg-yellow-50" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-32">Customer PO</Label>
                      <Input value={orderData.customerPO} readOnly />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-32">Project</Label>
                      <Input value={orderData.project} readOnly />
                    </div>
                  </div>
                </div>

                {/* Totals Section */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="w-32">Subtotal</Label>
                    <Input value={orderData.subtotal} readOnly className="w-32 text-right" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-32">Tax</Label>
                    <Input value={orderData.tax} readOnly className="w-32 text-right" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-32">Cancel Charge</Label>
                    <Input value={orderData.cancelCharge} readOnly className="w-32 text-right" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-32">Total</Label>
                    <Input value={orderData.total} readOnly className="w-32 text-right" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="others">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                  {/* Add other fields from Oracle form */}
                </div>
              </TabsContent>

              <TabsContent value="address">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Bill To Address</h3>
                    <Button variant="outline" size="sm">Address Details</Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <div>3M CENTER</div>
                    <div>ST PAUL, MN 55144</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 