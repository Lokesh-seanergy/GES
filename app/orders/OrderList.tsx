import React, { useEffect, useRef } from "react";

interface Order {
  orderId: string;
  showId: string;
  customerPo: string;
  orderDate: string;
}

interface OrderListProps {
  orders: Order[];
  selectedOrderId: string | null;
  onSelect: (orderId: string) => void;
  search: string;
}

export default function OrderList({ orders, selectedOrderId, onSelect, search }: OrderListProps) {
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (selectedOrderId && itemRefs.current[selectedOrderId]) {
      itemRefs.current[selectedOrderId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedOrderId]);

  const filtered = orders.filter(order =>
    order.orderId.toLowerCase().includes(search.toLowerCase()) ||
    order.showId.toLowerCase().includes(search.toLowerCase()) ||
    order.customerPo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-y-auto h-full pr-2">
      {filtered.map(order => (
        <div
          key={order.orderId}
          ref={(el) => itemRefs.current[order.orderId] = el}
          className={`mb-1 p-2 rounded cursor-pointer border transition-all ${
            order.orderId === selectedOrderId
              ? "bg-blue-50 border-blue-500"
              : "bg-gray-50 border-transparent hover:border-blue-300"
          }`}
          onClick={() => onSelect(order.orderId)}
        >
<<<<<<< Updated upstream
          <div className="font-bold text-blue-900">ORDER ID:{order.orderId}</div>
          <div className="text-xs text-gray-600">Customer PO: {order.customerPo}</div>
          <div className="text-xs text-gray-500">Order Date: {order.orderDate}</div>
        </div>
=======
          <div className="text-sm flex flex-row flex-wrap gap-x-4 gap-y-1 whitespace-nowrap">
  <span className="font-bold text-blue-900">Order ID: {order.orderId}</span>
  
  <span className="text-gray-600">Customer PO: {order.customerPo}</span>
  <span className="text-gray-500">Order Date: {order.orderDate}</span>
</div>
</div>
>>>>>>> Stashed changes
      ))}
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No orders found.</div>
      )}
    </div>
  );
}
