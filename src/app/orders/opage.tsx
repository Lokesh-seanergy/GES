"use client";
"use client";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import MainLayout from "../components/mainlayout/MainLayout";
import { orders } from "../data/orders"; // Import from shared data folder
import OrderList from "../components/orders/OrderList";
import OrderDetail from "../components/orders/OrderDetail";

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Add showId to each order for compatibility with OrderList
  const ordersWithShowId = orders.map((order: { project: any; }) => ({ ...order, showId: order.project }));

  // Filter based on case-insensitive search input
  const filteredOrders = ordersWithShowId.filter((order: { orderId: string; project: string | string[]; customerPo: string | string[]; }) =>
    order.orderId.toLowerCase().includes(search.toLowerCase()) ||
    order.project.includes(search) ||
    order.customerPo.includes(search)
  );

  // Reorder: move selected order to top
  const reorderedOrders = selectedOrderId
    ? [
        ...filteredOrders.filter((order: { orderId: string }) => order.orderId === selectedOrderId),
        ...filteredOrders.filter((order: { orderId: string }) => order.orderId !== selectedOrderId),
      ]
    : filteredOrders;

  const totalPages = Math.ceil(reorderedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = reorderedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  const selectedOrder = filteredOrders.find((order: { orderId: string | null; }) => order.orderId === selectedOrderId);

  return (
    <MainLayout>
      {selectedOrderId ? (
        // ✅ Split View
        <div className="flex flex-col md:flex-row h-full bg-[#f8f9fa]">
          <div className="w-full md:w-[250px] border-r bg-white flex flex-col" style={{ minWidth: 0 }}>
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search by Order ID, Show ID, Customer PO"
                className="w-full px-2 py-1 border rounded text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <OrderList
                orders={paginatedOrders}   // ✅ Send paginatedOrders here
                selectedOrderId={selectedOrderId}
                onSelect={setSelectedOrderId}
                search={search}
              />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
              >
                ← Back to Orders
              </button>
            </div>
            <OrderDetail order={selectedOrder} />
          </div>
        </div>
      ) : (
        // ✅ Full Line View
        <div className="flex flex-col divide-y bg-white rounded-md shadow overflow-hidden">
          {paginatedOrders.map((order: { orderId: string | number | bigint | boolean | ((prevState: string | null) => string | null) | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; showId: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; customerPo: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; orderDate: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
            <div
              key={order.orderId}
              onClick={() => setSelectedOrderId(order.orderId)}
              className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
            >
               <div className="flex flex-col gap-0.5">
        <div className="font-semibold text-blue-900">Order ID: {order.orderId}</div>
        <div className="text-gray-600">Show ID: {order.showId}</div>
        <div className="text-gray-600">Customer PO: {order.customerPo}</div>
        <div className="text-gray-600">Order Date: {order.orderDate}</div>
              </div>
              <div className="text-blue-600 text-sm">View Details ➔</div>
            </div>
          ))}

          {/* ✅ Pagination Controls */}
          <div className="flex justify-between items-center p-4 bg-gray-50">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              ← Previous
            </button>

            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
