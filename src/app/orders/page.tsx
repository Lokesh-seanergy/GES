"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { mockOrders } from "./data";
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

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
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

  useEffect(() => {
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = mockOrders.filter((order) => {
        const query = searchQuery.toLowerCase();
        return (
          (order.orderId?.toLowerCase() || "").includes(query) ||
          (order.showId?.toLowerCase() || "").includes(query) ||
          (order.customerPO?.toLowerCase() || "").includes(query) ||
          (order.orderDate || "").includes(query)
        );
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(mockOrders);
    }
  }, [searchQuery]);

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
      setFilteredOrders(updatedOrders);
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
    const updatedOrders = [...mockOrders, order];
    setFilteredOrders(updatedOrders);
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
                {filteredOrders.map((order) => (
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
                          Order Date:
                        </span>
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="sticky top-24 h-[calc(100vh-10rem)]">
                {selectedOrder ? (
                  <Card className="p-4 shadow-lg relative h-full overflow-y-auto">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                      aria-label="Close details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-semibold mb-4">
                      Order Details
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
                              <TableBody className="divide-y divide-gray-200 bg-white">
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

                    <div className="mt-6 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingOrder(true)}
                      >
                        Edit Order
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select an order to view details
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditingOrder && editedOrder && (
          <Dialog
            open={isEditingOrder}
            onOpenChange={(open) => {
              setIsEditingOrder(open);
              if (!open) setEditedOrder(null);
            }}
          >
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Edit Order Details</DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                <form
                  id="orderForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleOrderSave();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Show ID</Label>
                      <Input
                        value={editedOrder.showId}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            showId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Occurrence ID</Label>
                      <Input
                        value={editedOrder.occurrenceId}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            occurrenceId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sales Channel</Label>
                      <Input
                        value={editedOrder.salesChannel}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            salesChannel: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Terms</Label>
                      <Input
                        value={editedOrder.terms}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            terms: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Order Type</Label>
                      <Input
                        value={editedOrder.orderType}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            orderType: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer PO</Label>
                      <Input
                        value={editedOrder.customerPO}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            customerPO: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cancel Charge</Label>
                      <Input
                        type="number"
                        value={editedOrder.cancelCharge}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            cancelCharge: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Source</Label>
                      <Input
                        value={editedOrder.source}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            source: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Project</Label>
                      <Input
                        value={editedOrder.project}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            project: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Order Date</Label>
                      <Input
                        type="date"
                        value={editedOrder.orderDate}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            orderDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Booth Info</Label>
                      <Input
                        value={editedOrder.boothInfo}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            boothInfo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Billing Address</Label>
                      <Input
                        value={editedOrder.billingAddress}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            billingAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sub Total</Label>
                      <Input
                        type="number"
                        value={editedOrder.subTotal}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            subTotal: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax</Label>
                      <Input
                        type="number"
                        value={editedOrder.tax}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            tax: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        type="number"
                        value={editedOrder.total}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            total: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </form>
              </div>

              <DialogFooter className="flex justify-between border-t pt-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingOrder(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" form="orderForm">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {isEditingItem && editedItem && (
          <Dialog
            open={isEditingItem}
            onOpenChange={(open) => {
              setIsEditingItem(open);
              if (!open) setEditedItem(null);
            }}
          >
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Edit Item Details</DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                <form
                  id="itemForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleItemSave();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ordered Item</Label>
                      <Input
                        value={editedItem.orderedItem}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            orderedItem: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Item Description</Label>
                      <Input
                        value={editedItem.itemDescription}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            itemDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={editedItem.quantity}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity Cancelled</Label>
                      <Input
                        type="number"
                        value={editedItem.quantityCancelled}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            quantityCancelled: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>UOM</Label>
                      <Input
                        value={editedItem.uom}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            uom: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kit Price</Label>
                      <Input
                        type="number"
                        value={editedItem.kitPrice}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            kitPrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Price</Label>
                      <Input
                        type="number"
                        value={editedItem.newPrice}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            newPrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Discount</Label>
                      <Input
                        type="number"
                        value={editedItem.discount}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            discount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Extended Price</Label>
                      <Input
                        type="number"
                        value={editedItem.extendedPrice}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            extendedPrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cancellation Fee</Label>
                      <Input
                        type="number"
                        value={editedItem.cancellationFee}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            cancellationFee: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>User Item Description</Label>
                      <Input
                        value={editedItem.userItemDescription}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            userItemDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>DFF</Label>
                      <Input
                        value={editedItem.dff}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            dff: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Order Received Date</Label>
                      <Input
                        type="date"
                        value={editedItem.orderReceivedDate}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            orderReceivedDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Input
                        value={editedItem.status}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            status: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Item Type</Label>
                      <Input
                        value={editedItem.itemType}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            itemType: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ATO</Label>
                      <Checkbox
                        checked={editedItem.ato}
                        onCheckedChange={(checked) =>
                          setEditedItem({
                            ...editedItem,
                            ato: checked as boolean,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Line Type</Label>
                      <Input
                        value={editedItem.lineType}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            lineType: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Document Number</Label>
                      <Input
                        value={editedItem.documentNumber}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            documentNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Industry Information</Label>
                      <Input
                        value={editedItem.industryInformation}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            industryInformation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </form>
              </div>

              <DialogFooter className="flex justify-between border-t pt-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingItem(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" form="itemForm">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {selectedItem && (
          <Dialog
            open={!!selectedItem}
            onOpenChange={(open) => {
              if (!open) setSelectedItem(null);
            }}
          >
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Item Details</DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Serial No</Label>
                    <p>{selectedItem.serialNo}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      Ordered Item
                    </Label>
                    <p>{selectedItem.orderedItem}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      Item Description
                    </Label>
                    <p>{selectedItem.itemDescription}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Quantity</Label>
                    <p>{selectedItem.quantity}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      Quantity Cancelled
                    </Label>
                    <p>{selectedItem.quantityCancelled}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">UOM</Label>
                    <p>{selectedItem.uom}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Kit Price</Label>
                    <p>${selectedItem.kitPrice}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">New Price</Label>
                    <p>${selectedItem.newPrice}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Discount</Label>
                    <p>${selectedItem.discount}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      Extended Price
                    </Label>
                    <p>${selectedItem.extendedPrice}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      Cancellation Fee
                    </Label>
                    <p>${selectedItem.cancellationFee}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      User Item Description
                    </Label>
                    <p>{selectedItem.userItemDescription}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">DFF</Label>
                    <p>{selectedItem.dff}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      Order Received Date
                    </Label>
                    <p>{formatDate(selectedItem.orderReceivedDate)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Status</Label>
                    <p>{selectedItem.status}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Item Type</Label>
                    <p>{selectedItem.itemType}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">ATO</Label>
                    <p>{selectedItem.ato ? "Yes" : "No"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Line Type</Label>
                    <p>{selectedItem.lineType}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      Document Number
                    </Label>
                    <p>{selectedItem.documentNumber}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">
                    Industry Information
                  </Label>
                  <p>{selectedItem.industryInformation}</p>
                </div>
              </div>

              <DialogFooter className="flex justify-between border-t pt-4 mt-4">
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setEditedItem(selectedItem);
                    setIsEditingItem(true);
                    setSelectedItem(null);
                  }}
                >
                  Edit Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {isNewOrderModalOpen && (
          <Dialog
            open={isNewOrderModalOpen}
            onOpenChange={(open) => {
              setIsNewOrderModalOpen(open);
              if (!open) {
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
              }
            }}
          >
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                <form
                  id="newOrderForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNewOrder();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Show ID</Label>
                      <Input
                        value={newOrder.showId}
                        onChange={(e) =>
                          setNewOrder({ ...newOrder, showId: e.target.value })
                        }
                        placeholder="Enter Show ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer PO</Label>
                      <Input
                        value={newOrder.customerPO}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            customerPO: e.target.value,
                          })
                        }
                        placeholder="Enter Customer PO"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Order Date</Label>
                      <Input
                        type="date"
                        value={newOrder.orderDate}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value);
                          if (!isNaN(newDate.getTime())) {
                            setNewOrder({
                              ...newOrder,
                              orderDate: format(newDate, "yyyy-MM-dd"),
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Order Type</Label>
                      <Input
                        value={newOrder.orderType}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            orderType: e.target.value,
                          })
                        }
                        placeholder="Enter Status"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sub Total</Label>
                      <Input
                        type="number"
                        value={newOrder.subTotal}
                        onChange={(e) => {
                          const subTotal = Number(e.target.value);
                          const tax = (subTotal * 0.1).toFixed(2);
                          setNewOrder({
                            ...newOrder,
                            subTotal,
                            tax: Number(tax),
                            total: (newOrder.subTotal ?? 0) + Number(tax),
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax</Label>
                      <Input
                        type="number"
                        value={newOrder.tax}
                        onChange={(e) => {
                          const tax = Number(e.target.value);
                          setNewOrder({
                            ...newOrder,
                            tax,
                            total: (newOrder.subTotal ?? 0) + tax,
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        type="number"
                        value={newOrder.total}
                        onChange={(e) => {
                          const total = Number(e.target.value);
                          const tax = (total * 0.1).toFixed(2);
                          setNewOrder({
                            ...newOrder,
                            total,
                            tax: Number(tax),
                            subTotal: total - Number(tax),
                          });
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>

              <DialogFooter className="flex justify-between border-t pt-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsNewOrderModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" form="newOrderForm">
                  Create Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
}
