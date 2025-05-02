'use client';

import { useState } from 'react';
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const orderData = {
  orderId: "577725",
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

export default function OrdersPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <Input 
            type="text" 
            placeholder="Search by Order ID, Show ID, or..." 
            className="max-w-xl"
          />
        </div>

        <div className="flex gap-6">
          {/* Order Summary Card */}
          <div className="w-64 bg-blue-50 p-4 rounded-lg">
            <div className="text-lg font-semibold mb-2">{orderData.orderId}</div>
            <div className="text-sm text-gray-600">
              <div>Customer PO: {orderData.customerPO || '-'}</div>
              <div>Date: {orderData.orderDate}</div>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">GES OM: Header - 1</h1>
              <Button variant="outline" className="bg-blue-50 text-blue-600">
                Edit Order
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="mb-4">
                  <div className="text-gray-600">Order #</div>
                  <div className="font-medium">{orderData.orderId}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-600">Sales Channel</div>
                  <div className="font-medium bg-yellow-50 p-2 rounded">{orderData.salesChannel}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-600">Source</div>
                  <div className="font-medium">{orderData.source}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-600">Order Date</div>
                  <div className="font-medium">{orderData.orderDate}</div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <div className="text-gray-600">Customer</div>
                  <div className="font-medium">{orderData.customer}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-600">Terms</div>
                  <div className="font-medium bg-yellow-50 p-2 rounded">{orderData.terms}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-600">Customer PO</div>
                  <div className="font-medium">{orderData.customerPO || '-'}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-600">Project</div>
                  <div className="font-medium">{orderData.project}</div>
                </div>
              </div>
            </div>

            {/* Totals Section */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-end items-center gap-4">
                <div className="text-gray-600">Subtotal:</div>
                <div className="font-medium w-32 text-right">{orderData.subtotal}</div>
              </div>
              <div className="flex justify-end items-center gap-4">
                <div className="text-gray-600">Tax:</div>
                <div className="font-medium w-32 text-right">{orderData.tax}</div>
              </div>
              <div className="flex justify-end items-center gap-4">
                <div className="text-gray-600">Cancel Charge:</div>
                <div className="font-medium w-32 text-right">{orderData.cancelCharge}</div>
              </div>
              <div className="flex justify-end items-center gap-4">
                <div className="text-gray-600">Total:</div>
                <div className="font-medium w-32 text-right">{orderData.total}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-8">
              <Button variant="outline">Actions</Button>
              <Button variant="outline">Book</Button>
              <Button variant="outline">Configurator</Button>
              <Button variant="outline">Line Info +</Button>
              <Button variant="outline">Order Info +</Button>
              <Button variant="outline">RePrice</Button>
              <Button variant="outline">Reasons</Button>
            </div>

            {/* Address Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Bill To Address</h3>
                <Button variant="outline" size="sm">Address Details</Button>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div>3M CENTER</div>
                <div>ST PAUL, MN 55144</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 