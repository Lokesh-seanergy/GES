"use client";

import { useState } from "react";

interface OrderDetailProps {
  order: any;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableOrder, setEditableOrder] = useState(order);

  if (!order) return <div>No order selected.</div>;

  const handleChange = (field: string, value: any) => {
    setEditableOrder((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const updatedLineItems = [...editableOrder.lineItems];
    updatedLineItems[index][field] = value;
    setEditableOrder((prev: any) => ({
      ...prev,
      lineItems: updatedLineItems,
    }));
  };

  const handleSave = () => {
    console.log("Saving changes:", editableOrder);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableOrder(order);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
        )}
      </div>

      {/* Header Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

        {[
          { label: "Order #", field: "orderId" },
          { label: "Status", field: "status" },
          { label: "Customer", field: "customer" },
          { label: "Sales Channel", field: "salesChannel" },
          { label: "Terms", field: "terms" },
          { label: "Order Type", field: "orderType" },
          { label: "Customer PO", field: "customerPo" },
          { label: "Source", field: "source" },
          { label: "Project", field: "project" },
          { label: "Booth", field: "booth" },
          { label: "Order Date", field: "orderDate" },
          { label: "Subtotal", field: "subtotal" },
          { label: "Tax", field: "tax" },
          { label: "Cancel Charge", field: "cancelCharge" },
          { label: "Total", field: "total" },
          { label: "Bill To Address", field: "billToAddress1" },
        ].map((item) => (
          <div key={item.field}>
            <strong>{item.label}:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={editableOrder[item.field]}
                onChange={(e) => handleChange(item.field, e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              editableOrder[item.field]
            )}
          </div>
        ))}
      </div>

      {/* Line Items Table */}
      <table className="min-w-full table-auto border mt-6 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Line", "Ordered Item", "Item Description", "Qty", "Cancellation Fee", "Qty Cancelled",
              "UOM", "Kit Price", "New Price", "Discount", "Extended Price", "User Item Desc", "DFF"
            ].map((col) => (
              <th key={col} className="border px-2 py-1">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableOrder.lineItems.map((item: any, index: number) => (
            <tr key={index}>
              {[
                "line", "orderedItem", "itemDescription", "qty", "cancellationFee", "qtyCancelled",
                "uom", "kitPrice", "newPrice", "discount", "extendedPrice", "userItemDescription", "dff"
              ].map((field) => (
                <td key={field} className="border px-2 py-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item[field]}
                      onChange={(e) => handleLineItemChange(index, field, e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    item[field]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
