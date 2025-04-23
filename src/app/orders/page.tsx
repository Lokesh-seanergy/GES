"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/mainlayout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Order, OrderItem } from "@/types/orders";
import { Pencil } from "lucide-react";
import { mockOrders } from "./data";
import { formatDate, parseDisplayDate } from "@/lib/utils";

export default function OrdersPage() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [editedItem, setEditedItem] = useState<OrderItem | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    orderId: "",
    showId: "",
    customerPO: "",
    orderDate: format(new Date(), "yyyy-MM-dd"),
    orderType: "New",
    total: 0,
    subTotal: 0,
    tax: 0,
    items: []
  });
  const [date, setDate] = useState<Date>();

  const filteredOrders = mockOrders.filter((order) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      (order.orderId?.toLowerCase() || '').includes(query) ||
      (order.showId?.toLowerCase() || '').includes(query) ||
      (order.customerPO?.toLowerCase() || '').includes(query) ||
      (order.orderDate || '').includes(query)
    );
  });

  const handleOrderEdit = () => {
    if (selectedOrder) {
      setEditedOrder({ ...selectedOrder });
      setIsEditingOrder(true);
    }
  };

  const handleItemEdit = (item: OrderItem) => {
    setEditedItem({ ...item });
    setIsEditingItem(true);
  };

  const handleOrderSave = () => {
    if (editedOrder) {
      // In a real app, you would update the backend here
      const updatedOrders = mockOrders.map(order => 
        order.orderId === editedOrder.orderId ? editedOrder : order
      );
      setSelectedOrder(editedOrder);
      setIsEditingOrder(false);
    }
  };

  const handleItemSave = () => {
    if (editedItem && selectedOrder) {
      // In a real app, you would update the backend here
      const updatedItems = selectedOrder.items.map(item =>
        item.serialNo === editedItem.serialNo ? editedItem : item
      );
      const updatedOrder = {
        ...selectedOrder,
        items: updatedItems
      };
      setSelectedOrder(updatedOrder);
      setIsEditingItem(false);
    }
  };

  const handleCreateOrder = () => {
    // In a real app, this would be an API call
    const createdOrder = {
      ...newOrder,
      orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
      items: []
    } as Order;
    
    // Add to mock data
    mockOrders.unshift(createdOrder);
    
    setIsNewOrderModalOpen(false);
    setNewOrder({
      orderId: "",
      showId: "",
      customerPO: "",
      orderDate: format(new Date(), "yyyy-MM-dd"),
      orderType: "New",
      total: 0,
      subTotal: 0,
      tax: 0,
      items: []
    });
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Orders" }]}>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Orders</CardTitle>
                <div className="flex gap-2">
                  <Input
                placeholder="Search by: Order ID | Show ID | Customer PO | Order Date"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                className="w-96"
                  />
              <Button onClick={() => setIsNewOrderModalOpen(true)}>New Order</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Show ID</TableHead>
                    <TableHead>Customer PO</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow
                      key={order.orderId}
                  className="hover:bg-gray-50"
                >
                  <TableCell>
                    <button
                      onClick={() => router.push(`/orders/${order.orderId}`)}
                      className="text-blue-600 hover:underline focus:outline-none"
                    >
                      {order.orderId}
                    </button>
                  </TableCell>
                      <TableCell>{order.showId}</TableCell>
                      <TableCell>{order.customerPO}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">{order.orderType}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

      {/* Order Edit Modal */}
      <Modal
        isOpen={isEditingOrder}
        onClose={() => setIsEditingOrder(false)}
        title="Edit Order"
      >
        {editedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order ID</Label>
                <Input value={editedOrder.orderId} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Show ID</Label>
                <Input value={editedOrder.showId} onChange={(e) => setEditedOrder({ ...editedOrder, showId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Occurrence ID</Label>
                <Input value={editedOrder.occurrenceId} onChange={(e) => setEditedOrder({ ...editedOrder, occurrenceId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Sales Channel</Label>
                <Input value={editedOrder.salesChannel} onChange={(e) => setEditedOrder({ ...editedOrder, salesChannel: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Terms</Label>
                <Input value={editedOrder.terms} onChange={(e) => setEditedOrder({ ...editedOrder, terms: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Order Type</Label>
                <Input value={editedOrder.orderType} onChange={(e) => setEditedOrder({ ...editedOrder, orderType: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Customer PO</Label>
                <Input value={editedOrder.customerPO} onChange={(e) => setEditedOrder({ ...editedOrder, customerPO: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cancel Charge</Label>
                <Input type="number" value={editedOrder.cancelCharge} onChange={(e) => setEditedOrder({ ...editedOrder, cancelCharge: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Input value={editedOrder.source} onChange={(e) => setEditedOrder({ ...editedOrder, source: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Input value={editedOrder.project} onChange={(e) => setEditedOrder({ ...editedOrder, project: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Order Date</Label>
                <Input 
                  type="date" 
                  value={editedOrder.orderDate}
                  onChange={(e) => setEditedOrder({ 
                    ...editedOrder, 
                    orderDate: e.target.value 
                  })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Booth Info</Label>
                <Input value={editedOrder.boothInfo} onChange={(e) => setEditedOrder({ ...editedOrder, boothInfo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Billing Address</Label>
                <Input value={editedOrder.billingAddress} onChange={(e) => setEditedOrder({ ...editedOrder, billingAddress: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Sub Total</Label>
                <Input type="number" value={editedOrder.subTotal} onChange={(e) => setEditedOrder({ ...editedOrder, subTotal: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Tax</Label>
                <Input type="number" value={editedOrder.tax} onChange={(e) => setEditedOrder({ ...editedOrder, tax: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Total</Label>
                <Input type="number" value={editedOrder.total} onChange={(e) => setEditedOrder({ ...editedOrder, total: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditingOrder(false)}>Cancel</Button>
              <Button onClick={handleOrderSave}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Item Edit Modal */}
      <Modal
        isOpen={isEditingItem}
        onClose={() => setIsEditingItem(false)}
        title="Edit Order Item"
      >
        {editedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Serial No</Label>
                <Input value={editedItem.serialNo} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Ordered Item</Label>
                <Input value={editedItem.orderedItem} onChange={(e) => setEditedItem({ ...editedItem, orderedItem: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Item Description</Label>
                <Input value={editedItem.itemDescription} onChange={(e) => setEditedItem({ ...editedItem, itemDescription: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" value={editedItem.quantity} onChange={(e) => setEditedItem({ ...editedItem, quantity: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Quantity Cancelled</Label>
                <Input type="number" value={editedItem.quantityCancelled} onChange={(e) => setEditedItem({ ...editedItem, quantityCancelled: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>UOM</Label>
                <Input value={editedItem.uom} onChange={(e) => setEditedItem({ ...editedItem, uom: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Kit Price</Label>
                <Input type="number" value={editedItem.kitPrice} onChange={(e) => setEditedItem({ ...editedItem, kitPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>New Price</Label>
                <Input type="number" value={editedItem.newPrice} onChange={(e) => setEditedItem({ ...editedItem, newPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Discount</Label>
                <Input type="number" value={editedItem.discount} onChange={(e) => setEditedItem({ ...editedItem, discount: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Extended Price</Label>
                <Input type="number" value={editedItem.extendedPrice} onChange={(e) => setEditedItem({ ...editedItem, extendedPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Cancellation Fee</Label>
                <Input type="number" value={editedItem.cancellationFee} onChange={(e) => setEditedItem({ ...editedItem, cancellationFee: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>User Item Description</Label>
                <Input value={editedItem.userItemDescription} onChange={(e) => setEditedItem({ ...editedItem, userItemDescription: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>DFF</Label>
                <Input value={editedItem.dff} onChange={(e) => setEditedItem({ ...editedItem, dff: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Order Received Date</Label>
                <Input 
                  type="date" 
                  value={editedItem.orderReceivedDate} 
                  onChange={(e) => setEditedItem({ 
                    ...editedItem, 
                    orderReceivedDate: e.target.value 
                  })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input value={editedItem.status} onChange={(e) => setEditedItem({ ...editedItem, status: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Input value={editedItem.itemType} onChange={(e) => setEditedItem({ ...editedItem, itemType: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>ATO</Label>
                <Checkbox checked={editedItem.ato} onCheckedChange={(checked) => setEditedItem({ ...editedItem, ato: checked as boolean })} />
              </div>
              <div className="space-y-2">
                <Label>Line Type</Label>
                <Input value={editedItem.lineType} onChange={(e) => setEditedItem({ ...editedItem, lineType: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Document Number</Label>
                <Input value={editedItem.documentNumber} onChange={(e) => setEditedItem({ ...editedItem, documentNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Industry Information</Label>
                <Input value={editedItem.industryInformation} onChange={(e) => setEditedItem({ ...editedItem, industryInformation: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditingItem(false)}>Cancel</Button>
              <Button onClick={handleItemSave}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Item Details Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Item Details"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Serial No</Label>
                <p>{selectedItem.serialNo}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">UOM</Label>
                <p>{selectedItem.uom}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Quantity</Label>
                <p>{selectedItem.quantity}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Quantity Cancelled</Label>
                <p>{selectedItem.quantityCancelled}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Item Type</Label>
                <p>{selectedItem.itemType}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">ATO</Label>
                <Checkbox checked={selectedItem.ato} disabled />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label className="text-xs text-gray-500">Extended Price</Label>
                <p>${selectedItem.extendedPrice}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Cancellation Fee</Label>
                <p>${selectedItem.cancellationFee}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-500">User Description</Label>
              <p className="text-sm">{selectedItem.userItemDescription}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">DFF</Label>
                <p>{selectedItem.dff}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Order Received Date</Label>
                <p>{formatDate(selectedItem.orderReceivedDate)}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Line Type</Label>
                <p>{selectedItem.lineType}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Document Number</Label>
                <p>{selectedItem.documentNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Industry Information</Label>
              <p>{selectedItem.industryInformation}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* New Order Modal */}
      <Modal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        title="Create New Order"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Show ID</Label>
              <Input
                value={newOrder.showId}
                onChange={(e) => setNewOrder({ ...newOrder, showId: e.target.value })}
                placeholder="Enter Show ID"
              />
            </div>
            <div className="space-y-2">
              <Label>Customer PO</Label>
              <Input
                value={newOrder.customerPO}
                onChange={(e) => setNewOrder({ ...newOrder, customerPO: e.target.value })}
                placeholder="Enter Customer PO"
              />
            </div>
            <div className="space-y-2">
              <Label>Order Date</Label>
              <DatePicker
                date={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    setNewOrder({
                      ...newOrder,
                      orderDate: format(newDate, "yyyy-MM-dd")
                    });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Input
                value={newOrder.orderType}
                onChange={(e) => setNewOrder({ ...newOrder, orderType: e.target.value })}
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
                  const tax = subTotal * 0.1; // 10% tax rate
                  setNewOrder({
                    ...newOrder,
                    subTotal,
                    tax,
                    total: subTotal + tax
                  });
                }}
                placeholder="Enter Sub Total"
              />
            </div>
            <div className="space-y-2">
              <Label>Tax (10%)</Label>
              <Input
                type="number"
                value={newOrder.tax}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <Input
                type="number"
                value={newOrder.total}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsNewOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>Create Order</Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
} 