"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { mockOrders } from "@/lib/mockData";
import type { Order, OrderItem } from "@/types/orders";
import { Button } from "@/components/ui/button";
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
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useSearchParams } from "next/navigation";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
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

  const searchParams = useSearchParams();
  const projectNumber = searchParams.get("projectNumber");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const boothNumber = searchParams.get("boothNumber");

  // Filter orders based on search query and remove ORD-002
  const filteredOrders = mockOrders
    .filter((order) => order.orderId !== 'ORD-002')
    .filter((order) => {
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

  useEffect(() => {
    if (!selectedOrder && paginatedOrders.length > 0) {
      setSelectedOrder(paginatedOrders[0]);
    }
  }, [paginatedOrders, selectedOrder]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
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

  return (
    <MainLayout
      breadcrumbs={[
        {
          label: "Orders",
          href: "#",
          onClick: () => {
            setSelectedOrder(null);
          },
        },
      ]}
    >
      <div className="h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden scroll-smooth">
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
                        {(projectNumber || firstName || lastName || boothNumber) && (
                          <div className="mb-1 flex flex-wrap gap-2 text-sm text-black font-normal">
                            {projectNumber && (
                              <span>Project #: {projectNumber}</span>
                            )}
                            {boothNumber && (
                              <span>Booth #: {boothNumber}</span>
                            )}
                            {(firstName || lastName) && (
                              <span>Exhibitor: {firstName} {lastName}</span>
                            )}
                          </div>
                        )}
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
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditingOrder(true);
                            setEditedOrder(selectedOrder ? { ...selectedOrder } : null);
                          }}
                        >
                          Edit Order
                        </Button>
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
                            ${selectedOrder.items.reduce((sum, item) => sum + (item.newPrice || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Serial No</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ordered Item</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {isEditingOrder && editedOrder
                                      ? editedOrder.items.map((item, idx) => (
                                          <TableRow key={item.serialNo}>
                                            <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.serialNo}</TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                              {item.isNew ? (
                                                <input
                                                  className="border rounded px-2 py-1 w-full"
                                                  value={item.orderedItem}
                                                  onChange={e => {
                                                    const newItems = [...editedOrder.items];
                                                    newItems[idx] = { ...item, orderedItem: e.target.value };
                                                    setEditedOrder({ ...editedOrder, items: newItems });
                                                  }}
                                                />
                                              ) : (
                                                item.orderedItem
                                              )}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                              {item.isNew ? (
                                                <input
                                                  type="number"
                                                  className="border rounded px-2 py-1 w-16"
                                                  value={item.quantity}
                                                  onChange={e => {
                                                    const newItems = [...editedOrder.items];
                                                    newItems[idx] = { ...item, quantity: Number(e.target.value) };
                                                    setEditedOrder({ ...editedOrder, items: newItems });
                                                  }}
                                                />
                                              ) : (
                                                item.quantity
                                              )}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                              {item.isNew ? (
                                                <input
                                                  type="number"
                                                  className="border rounded px-2 py-1 w-24"
                                                  value={item.newPrice}
                                                  onChange={e => {
                                                    const newItems = [...editedOrder.items];
                                                    newItems[idx] = { ...item, newPrice: Number(e.target.value) };
                                                    setEditedOrder({ ...editedOrder, items: newItems });
                                                  }}
                                                />
                                              ) : (
                                                item.newPrice
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      : selectedOrder.items.map((item) => (
                                          <TableRow key={item.serialNo}>
                                            <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.serialNo}</TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                              {item.orderedItem}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                              {item.quantity}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                              {item.newPrice}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isEditingOrder && editedOrder && (() => {
                          const originalTotal = selectedOrder.items.reduce((sum, item) => sum + (item.newPrice || 0), 0);
                          const newTotal = editedOrder.items.reduce((sum, item) => sum + (item.newPrice || 0), 0);
                          const diff = newTotal - originalTotal;
                          return (
                            <>
                              {diff > 0 && (
                                <div className="mt-2 text-green-700 font-semibold">
                                  Additional amount to be paid: ${diff.toLocaleString()}
                                </div>
                              )}
                              <div className="flex gap-2 mt-4 items-center">
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    if (!editedOrder) return;
                                    const maxSerial = editedOrder.items.reduce((max, item) => Math.max(max, item.serialNo), 0);
                                    const newItem = {
                                      serialNo: maxSerial + 1,
                                      orderedItem: '',
                                      itemDescription: '',
                                      quantity: 1,
                                      cancellationFee: 0,
                                      quantityCancelled: 0,
                                      uom: '',
                                      kitPrice: 0,
                                      newPrice: 0,
                                      discount: 0,
                                      extendedPrice: 0,
                                      userItemDescription: '',
                                      dff: '',
                                      orderReceivedDate: '',
                                      status: '',
                                      itemType: '',
                                      ato: false,
                                      lineType: '',
                                      documentNumber: '',
                                      industryInformation: '',
                                      isNew: true,
                                    };
                                    setEditedOrder({
                                      orderId: editedOrder.orderId || '',
                                      showId: editedOrder.showId || '',
                                      occurrenceId: editedOrder.occurrenceId || '',
                                      subTotal: editedOrder.subTotal || 0,
                                      salesChannel: editedOrder.salesChannel || '',
                                      terms: editedOrder.terms || '',
                                      tax: editedOrder.tax || 0,
                                      orderType: editedOrder.orderType || '',
                                      customerPO: editedOrder.customerPO || '',
                                      cancelCharge: editedOrder.cancelCharge || 0,
                                      source: editedOrder.source || '',
                                      project: editedOrder.project || '',
                                      orderDate: editedOrder.orderDate || '',
                                      boothInfo: editedOrder.boothInfo || '',
                                      billingAddress: editedOrder.billingAddress || '',
                                      total: editedOrder.total || 0,
                                      items: [...editedOrder.items, newItem],
                                    });
                                  }}
                                >
                                  Add Item
                                </Button>
                                {diff > 0 && (
                                  <Button variant="default" onClick={() => alert('Proceed to payment!')}>Make Payment</Button>
                                )}
                                <Button variant="outline" onClick={() => setIsEditingOrder(false)}>Cancel</Button>
                              </div>
                            </>
                          );
                        })()}
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

        <ScrollToTop />
      </div>
    </MainLayout>
  );
}
