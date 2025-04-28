"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { mockOrders } from "@/lib/mockData";
import type { Order, OrderItem } from "@/types/orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CustomPagination } from "@/components/ui/pagination";
import { PageSizeSelector } from "@/components/ui/page-size-selector";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [editedItem, setEditedItem] = useState<OrderItem | null>(null);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    showId: "",
    occurrenceId: "",
    salesChannel: "",
    terms: "",
    orderType: "",
    customerPO: "",
    cancelCharge: 0,
    source: "",
    project: "",
    orderDate: "",
    boothInfo: "",
    billingAddress: "",
    subTotal: 0,
    tax: 0,
    items: [],
  });

  // Filter orders based on search query
  const filteredOrders = mockOrders.filter((order) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      (order.orderId?.toLowerCase() || "").includes(query) ||
      (order.showId?.toLowerCase() || "").includes(query) ||
      (order.customerPO?.toLowerCase() || "").includes(query) ||
      (order.orderDate || "").includes(query)
    );
  });

  // Paginate orders
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setSelectedItem(null);
  };

  const handleItemClick = (item: OrderItem) => {
    setSelectedItem(item);
  };

  const handleOrderSave = () => {
    if (editedOrder) {
      // In a real app, you would update the backend here
      const updatedOrders = mockOrders.map((order) =>
        order.orderId === editedOrder.orderId ? editedOrder : order
      );
      setSelectedOrder(editedOrder);
      setIsEditingOrder(false);
    }
  };

  const handleItemSave = () => {
    if (editedItem && selectedOrder) {
      // In a real app, you would update the backend here
      const updatedItems = selectedOrder.items.map((item) =>
        item.serialNo === editedItem.serialNo ? editedItem : item
      );
      const updatedOrder = {
        ...selectedOrder,
        items: updatedItems,
      };
      setSelectedOrder(updatedOrder);
      setIsEditingItem(false);
    }
  };

  const handleNewOrder = () => {
    const order = {
      ...newOrder,
      orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
      items: [],
    } as Order;

    // In a real app, you would save to the backend here
    setSelectedOrder(order);
    setIsNewOrderModalOpen(false);
    setNewOrder({
      showId: "",
      occurrenceId: "",
      salesChannel: "",
      terms: "",
      orderType: "",
      customerPO: "",
      cancelCharge: 0,
      source: "",
      project: "",
      orderDate: "",
      boothInfo: "",
      billingAddress: "",
      subTotal: 0,
      tax: 0,
      items: [],
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <MainLayout
      breadcrumbs={[
        {
          label: "Orders",
          href: "#",
          onClick: () => {
            setSelectedOrder(null);
            setSelectedItem(null);
          },
        },
      ]}
    >
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-96">
                <Input
                  type="text"
                  placeholder="Search by Order ID, Show ID, or..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                <Search className="absolute left-2.5 top-2.5 text-gray-400 h-4 w-4" />
              </div>
              <Button onClick={() => setIsNewOrderModalOpen(true)}>
                New Order
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
              <div className="space-y-4 md:max-w-xs lg:max-w-sm h-[calc(100vh-14rem)] overflow-y-auto pr-2">
                {paginatedOrders.map((order) => (
                  <Card
                    key={order.orderId}
                    className={`p-4 transition-all duration-150 ease-in-out border cursor-pointer ${
                      selectedOrder?.orderId === order.orderId
                        ? "bg-blue-50 border-blue-300 shadow-md"
                        : "bg-white border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                    }`}
                    onClick={() => handleOrderClick(order)}
                  >
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="font-semibold text-base mb-1">
                        {order.orderId}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-700 font-semibold">
                            Show ID:
                          </span>
                          <span>{order.showId}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${
                            order.orderType === "Active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span>{order.orderType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-700 font-semibold">
                          Customer PO:
                        </span>
                        <span>{order.customerPO}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-700 font-semibold">
                          Date:
                        </span>
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                {selectedOrder ? (
                  <Card className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">
                        Order Details
                      </h2>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditingOrder(true)}
                        >
                          Edit Order
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsNewOrderModalOpen(true)}
                        >
                          New Order
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-gray-500">
                          Order ID
                        </Label>
                        <div className="text-sm font-medium">
                          {selectedOrder.orderId}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">
                          Show ID
                        </Label>
                        <div className="text-sm font-medium">
                          {selectedOrder.showId}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">
                          Customer PO
                        </Label>
                        <div className="text-sm font-medium">
                          {selectedOrder.customerPO}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">
                          Order Type
                        </Label>
                        <div className="text-sm font-medium">
                          {selectedOrder.orderType}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">
                          Order Date
                        </Label>
                        <div className="text-sm font-medium">
                          {formatDate(selectedOrder.orderDate)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">
                          Total
                        </Label>
                        <div className="text-sm font-medium">
                          ${selectedOrder.total.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Order Items
                      </h3>
                      <div className="flow-root">
                        <div className="-mx-4 overflow-x-auto">
                          <div className="inline-block min-w-full align-middle">
                            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                              <Table className="min-w-full table-fixed divide-y divide-gray-300">
                                <TableHeader className="bg-gray-50">
                                  <TableRow>
                                    <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      Serial No
                                    </TableHead>
                                    <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      Ordered Item
                                    </TableHead>
                                    <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      Quantity
                                    </TableHead>
                                    <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      UOM
                                    </TableHead>
                                    <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      Status
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedOrder.items.map((item) => (
                                    <TableRow
                                      key={item.serialNo}
                                      onClick={() => handleItemClick(item)}
                                      className="cursor-pointer"
                                    >
                                      <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {item.serialNo}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {item.orderedItem}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {item.quantity}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {item.uom}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {item.status}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select an order to view details
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <PageSizeSelector
                pageSize={itemsPerPage}
                setPageSize={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
              />
              <CustomPagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
