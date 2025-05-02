"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import MainLayout from "@/components/mainlayout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Menu } from "lucide-react";

type Order = {
  orderId: string;
  customer: string;
  salesChannel: string;
  terms: string;
  source: string;
  project: string;
  orderDate: string;
  customerPO: string;
  subtotal: string;
  tax: string;
  cancelCharge: string;
  total: string;
};

const orders: Order[] = [
  {
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
  },
  {
    orderId: "577726",
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
  },
  {
    orderId: "577727",
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
  }
];

const MAIN_FIELDS = [
  ["Order#", "orderId", "Customer", "customer"],
  ["Sales Channel", "salesChannel", "Terms", "terms"],
  ["Source", "source", "Customer PO", "customerPO"],
  ["Order Date", "orderDate", "Project", "project"]
];

const TABLE_FIELDS: { key: keyof TableRow; label: string }[] = [
  { key: "orderItem", label: "Order Item" },
  { key: "itemDescription", label: "Item Description" },
  { key: "quantity", label: "Quantity" },
  { key: "cancellationFees", label: "Cancellation Fees" },
  { key: "uom", label: "UOM" },
  { key: "kitPrice", label: "Kit Price" },
  { key: "newPrice", label: "New Price" },
  { key: "discount", label: "Discount" },
  { key: "userItemDescription", label: "User Item Description" },
  { key: "dff", label: "DFF" },
  { key: "orderRecdDate", label: "Order Recd Date" },
  { key: "status", label: "Status" },
  { key: "itemType", label: "Item Type" },
  { key: "ato", label: "ATO" },
  { key: "lineTypes", label: "Line Types" },
  { key: "industryInformation", label: "Industry Information" },
];

type TableRow = {
  orderItem: string;
  itemDescription: string;
  quantity: number;
  cancellationFees: number;
  uom: string;
  kitPrice: number;
  newPrice: number;
  discount: number;
  userItemDescription: string;
  dff: string;
  orderRecdDate: string;
  status: string;
  itemType: string;
  ato: string;
  lineTypes: string;
  industryInformation: string;
};

const MOCK_TABLE_DATA: TableRow[] = [
  {
    orderItem: "1001",
    itemDescription: "Booth Setup",
    quantity: 2,
    cancellationFees: 0,
    uom: "EA",
    kitPrice: 100,
    newPrice: 90,
    discount: 10,
    userItemDescription: "Custom Booth",
    dff: "-",
    orderRecdDate: "2024-06-01",
    status: "Active",
    itemType: "Service",
    ato: "No",
    lineTypes: "Standard",
    industryInformation: "Events"
  },
  {
    orderItem: "1002",
    itemDescription: "Banner Printing",
    quantity: 5,
    cancellationFees: 0,
    uom: "EA",
    kitPrice: 50,
    newPrice: 45,
    discount: 5,
    userItemDescription: "Large Banner",
    dff: "-",
    orderRecdDate: "2024-06-02",
    status: "Active",
    itemType: "Product",
    ato: "Yes",
    lineTypes: "Custom",
    industryInformation: "Printing"
  }
];

// Mock data for Shipping tab table
const SHIPPING_TABLE_FIELDS = [
  { key: "orderItem", label: "Order Item" },
  { key: "pricingDetails", label: "Pricing Details" },
  { key: "pricingContext", label: "Pricing Context" },
  { key: "tax", label: "Tax" },
  { key: "priceList", label: "Price List" },
  { key: "taxCode", label: "Tax Code" },
  { key: "calcPriceFlag", label: "Calculating the Price Flag" },
];
const SHIPPING_TABLE_DATA = [
  {
    orderItem: "1001",
    pricingDetails: "Standard",
    pricingContext: "Online",
    tax: "5.00",
    priceList: "Default",
    taxCode: "TX01",
    calcPriceFlag: "Yes",
  },
  {
    orderItem: "1002",
    pricingDetails: "Discounted",
    pricingContext: "In-Store",
    tax: "2.50",
    priceList: "Special",
    taxCode: "TX02",
    calcPriceFlag: "No",
  },
];

// Pricing Table
const PRICING_TABLE_FIELDS = [
  { key: "orderItem", label: "Order Item" },
  { key: "pricingDetails", label: "Pricing Details" },
  { key: "pricingContext", label: "Pricing Context" },
  { key: "tax", label: "Tax" },
  { key: "priceList", label: "Price List" },
  { key: "taxCode", label: "Tax Code" },
  { key: "calcPriceFlag", label: "Calculate Price Flag" },
];
const PRICING_TABLE_DATA = [
  {
    orderItem: "1001",
    pricingDetails: "Standard",
    pricingContext: "Online",
    tax: "5.00",
    priceList: "Default",
    taxCode: "TX01",
    calcPriceFlag: "Yes",
  },
  {
    orderItem: "1002",
    pricingDetails: "Discounted",
    pricingContext: "In-Store",
    tax: "2.50",
    priceList: "Special",
    taxCode: "TX02",
    calcPriceFlag: "No",
  },
];

// Shipping Table
const SHIPPING2_TABLE_FIELDS = [
  { key: "orderItem", label: "Order Item" },
  { key: "productionCity", label: "Production City" },
  { key: "facility", label: "Facility" },
  { key: "shippingAddress", label: "Shipping Address" },
  { key: "orderMethod", label: "Order Method" },
];
const SHIPPING2_TABLE_DATA = [
  {
    orderItem: "1001",
    productionCity: "San Francisco",
    facility: "Miccron",
    shippingAddress: "123 Main St, SF, CA",
    orderMethod: "Online",
  },
  {
    orderItem: "1002",
    productionCity: "Los Angeles",
    facility: "WestHub",
    shippingAddress: "456 Sunset Blvd, LA, CA",
    orderMethod: "In-Store",
  },
];

const ORDER_ITEMS_PRICE_FIELDS = ["kitPrice", "newPrice", "discount"];
const PRICING_PRICE_FIELDS = ["tax"];
const SHIPPING_PRICE_FIELDS = ["tax"];

function formatCurrency(value: string | number) {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  return isNaN(num) ? '$0.00' : num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDateMMDDYYYY(dateStr: string) {
  if (!dateStr) return '';
  // Try to parse common formats
  let date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // Try to parse DD-MMM-YYYY HH:mm:ss (e.g., 23-APR-2025 11:06:41)
    const match = dateStr.match(/(\d{2})-(\w{3})-(\d{4})/);
    if (match) {
      const [_, day, mon, year] = match;
      const months: Record<string, number> = {
        JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
        JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
      };
      date = new Date(Number(year), months[mon.toUpperCase()], Number(day));
    } else {
      return dateStr;
    }
  }
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0].orderId);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Main");
  const [activeSubTab, setActiveSubTab] = useState("Main");
  const [showColumnOptions, setShowColumnOptions] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() =>
    Object.fromEntries(TABLE_FIELDS.map(f => [f.key, true]))
  );
  const [currencyFields, setCurrencyFields] = useState({
    subtotal: "0.00",
    tax: "0.00",
    cancelCharge: "0.00",
    total: "0.00",
  });

  const [editData, setEditData] = useState({
    main: { ...orders[0] },
    others: {
      warehouse: "Warehouse 1",
      orderMethod: "Online",
      salesPerson: "John Doe",
      exhibitor: "3M",
    },
    address: {
      countryCode: "+1",
      areaCode: "651",
      phoneNumber: "555-1234",
      extension: "123",
      email: "contact@3m.com",
      customer: "3M",
      customerNumber: "07162211",
      customerContact: "Jane Smith",
    },
  });
  const [isDirty, setIsDirty] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 1. Add state for new rows and payment
  const [orderItems, setOrderItems] = useState(MOCK_TABLE_DATA);
  const [pricingRows, setPricingRows] = useState(PRICING_TABLE_DATA);
  const [shippingRows, setShippingRows] = useState(SHIPPING2_TABLE_DATA);
  const [newOrderItem, setNewOrderItem] = useState<TableRow | null>(null);
  const [newPricingRow, setNewPricingRow] = useState<any | null>(null);
  const [newShippingRow, setNewShippingRow] = useState<any | null>(null);
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Scroll to bottom when dirty
  useEffect(() => {
    if (isDirty && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isDirty]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCurrencyChange = useCallback((field: string, value: string) => {
    // Only keep digits
    const digits = value.replace(/\D/g, "");
    // Interpret as cents
    const num = digits ? parseInt(digits, 10) : 0;
    const formatted = (num / 100).toFixed(2);
    setCurrencyFields((prev) => ({ ...prev, [field]: formatted }));
    setIsDirty(true);
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(search.toLowerCase())
  );
  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId) || orders[0];

  const handleShowAll = () => setVisibleColumns(Object.fromEntries(TABLE_FIELDS.map(f => [f.key, true])));
  const handleHideAll = () => setVisibleColumns(Object.fromEntries(TABLE_FIELDS.map(f => [f.key, false])));

  function handleFieldChange(tab: string, field: string, value: string) {
    setEditData((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value },
    }));
    setIsDirty(true);
  }
  function handleSave() {
    // Here you would update your main data state or send to backend
    setIsDirty(false);
  }
  function handleCancel() {
    setEditData({
      main: { ...selectedOrder },
      others: {
        warehouse: "Warehouse 1",
        orderMethod: "Online",
        salesPerson: "John Doe",
        exhibitor: "3M",
      },
      address: {
        countryCode: "+1",
        areaCode: "651",
        phoneNumber: "555-1234",
        extension: "123",
        email: "contact@3m.com",
        customer: "3M",
        customerNumber: "07162211",
        customerContact: "Jane Smith",
      },
    });
    setIsDirty(false);
  }

  // 2. Add row handlers
  const handleAddOrderItem = () => setNewOrderItem({
    orderItem: "",
    itemDescription: "",
    quantity: 0,
    cancellationFees: 0,
    uom: "",
    kitPrice: 0,
    newPrice: 0,
    discount: 0,
    userItemDescription: "",
    dff: "",
    orderRecdDate: "",
    status: "",
    itemType: "",
    ato: "",
    lineTypes: "",
    industryInformation: ""
  });
  const handleSaveOrderItem = () => {
    if (newOrderItem) {
      setOrderItems([...orderItems, newOrderItem]);
      setNewOrderItem(null);
      setPaymentEnabled(true);
    }
  };
  const handleAddPricingRow = () => setNewPricingRow({
    orderItem: "",
    pricingDetails: "",
    pricingContext: "",
    tax: "0.00",
    priceList: "",
    taxCode: "",
    calcPriceFlag: ""
  });
  const handleSavePricingRow = () => {
    if (newPricingRow) {
      setPricingRows([...pricingRows, newPricingRow]);
      setNewPricingRow(null);
      setPaymentEnabled(true);
    }
  };
  const handleAddShippingRow = () => setNewShippingRow({
    orderItem: "",
    productionCity: "",
    facility: "",
    shippingAddress: "",
    orderMethod: ""
  });
  const handleSaveShippingRow = () => {
    if (newShippingRow) {
      setShippingRows([...shippingRows, newShippingRow]);
      setNewShippingRow(null);
      setPaymentEnabled(true);
    }
  };

  // 3. Payment dialog handlers
  const handleOpenPaymentDialog = () => setShowPaymentDialog(true);
  const handleClosePaymentDialog = () => {
    setShowPaymentDialog(false);
    setPaymentEnabled(false);
  };
  const handleConfirmPayment = () => {
    setShowPaymentDialog(false);
    setPaymentEnabled(false);
  };

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-[300px] border-r bg-gray-50 p-4 flex flex-col h-full">
                  <Input
                    type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="flex-1 overflow-auto">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className={`p-3 mb-2 rounded cursor-pointer ${
                  selectedOrderId === order.orderId
                    ? "bg-blue-100"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setSelectedOrderId(order.orderId)}
              >
                <div className="font-medium">Order #{order.orderId}</div>
                <div className="text-sm text-gray-600">
                  {order.customer} - {order.project}
                </div>
                <div className="text-sm text-gray-500">{formatDateMMDDYYYY(order.orderDate)}</div>
              </div>
            ))}
                        </div>
                      </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>

          {/* Top Tabs */}
          <div className="flex gap-2 mb-6">
            {["Main", "Others", "Address"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                className={activeTab === tab ? "bg-blue-600 text-white" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
                  ))}
                </div>

          {/* Main Tab Content */}
          {activeTab === "Main" && (
            <div className="flex flex-col items-center w-full">
              <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
                <div className="text-2xl font-bold mb-6 text-blue-900">Order Details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 auto-rows-min">
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Order#</label>
                    <Input value={editData.main.orderId} onChange={e => handleFieldChange('main', 'orderId', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Customer</label>
                    <Input value={editData.main.customer} onChange={e => handleFieldChange('main', 'customer', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Sales Channel</label>
                    <Input value={editData.main.salesChannel} onChange={e => handleFieldChange('main', 'salesChannel', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Terms</label>
                    <Input value={editData.main.terms} onChange={e => handleFieldChange('main', 'terms', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Source</label>
                    <Input value={editData.main.source} onChange={e => handleFieldChange('main', 'source', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Customer PO</label>
                    <Input value={editData.main.customerPO} onChange={e => handleFieldChange('main', 'customerPO', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Order Date</label>
                    <Input value={editData.main.orderDate} onChange={e => handleFieldChange('main', 'orderDate', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Project</label>
                    <Input value={editData.main.project} onChange={e => handleFieldChange('main', 'project', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Sub Total</label>
                    <Input value={currencyFields.subtotal} onChange={e => handleCurrencyChange('subtotal', e.target.value)} className="text-right" inputMode="decimal" pattern="^\\d*$" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Tax</label>
                    <Input value={currencyFields.tax} onChange={e => handleCurrencyChange('tax', e.target.value)} className="text-right" inputMode="decimal" pattern="^\\d*$" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Cancel Charge</label>
                    <Input value={currencyFields.cancelCharge} onChange={e => handleCurrencyChange('cancelCharge', e.target.value)} className="text-right" inputMode="decimal" pattern="^\\d*$" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Total</label>
                    <Input value={currencyFields.total} onChange={e => handleCurrencyChange('total', e.target.value)} className="text-right" inputMode="decimal" pattern="^\\d*$" />
                  </div>
                </div>
              </div>

              {/* Table Layout and Styling */}
              <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-blue-900">Order Items</div>
                  <button onClick={handleAddOrderItem} className="text-blue-600 border border-blue-200 rounded px-3 py-1 text-sm hover:bg-blue-50">+ Add</button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50 border-b border-gray-200">
                        {TABLE_FIELDS.filter(f => visibleColumns[f.key]).map((field) => (
                          <th key={field.key} className="px-4 py-3 text-left font-bold text-blue-900 whitespace-nowrap border-r border-gray-200 last:border-r-0">
                            {field.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/40">
                          {TABLE_FIELDS.filter(f => visibleColumns[f.key]).map((field) => {
                            const isPrice = ORDER_ITEMS_PRICE_FIELDS.includes(field.key);
                            const isNumber = ["quantity", "cancellationFees"].includes(field.key) || isPrice;
                            return (
                              <td
                                key={field.key}
                                className={`px-4 py-2 whitespace-nowrap border-r border-gray-100 last:border-r-0 ${isNumber ? "text-right" : "text-left"} text-gray-800`}
                              >
                                {isPrice ? formatCurrency(row[field.key as keyof TableRow]) : row[field.key as keyof TableRow]}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      {newOrderItem && (
                        <tr className="border-b border-gray-100 bg-blue-50">
                          {TABLE_FIELDS.filter(f => visibleColumns[f.key]).map((field) => {
                            const isPrice = ORDER_ITEMS_PRICE_FIELDS.includes(field.key);
                            const isNumber = ["quantity", "cancellationFees"].includes(field.key) || isPrice;
                            return (
                              <td key={field.key} className={`px-4 py-2 border-r border-gray-100 last:border-r-0 ${isNumber ? "text-right" : "text-left"}`}>
                                <input
                                  className="bg-white border border-gray-200 rounded px-2 py-1 text-sm w-full"
                                  type={isNumber ? "number" : "text"}
                                  value={newOrderItem[field.key as keyof TableRow] as any}
                                  onChange={e => setNewOrderItem({
                                    ...newOrderItem,
                                    [field.key]: isNumber ? Number(e.target.value) : e.target.value
                                  })}
                                />
                              </td>
                            );
                          })}
                          <td colSpan={1} className="px-2 py-2">
                            <button onClick={handleSaveOrderItem} className="text-green-600 border border-green-200 rounded px-2 py-1 text-xs hover:bg-green-50">Save</button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                              </div>
                            </div>

              <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
                <div className="text-2xl font-bold mb-6 text-blue-900">Pricing</div>
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50 border-b border-gray-200">
                        {PRICING_TABLE_FIELDS.map((field) => (
                          <th key={field.key} className="px-4 py-3 text-left font-bold text-blue-900 whitespace-nowrap border-r border-gray-200 last:border-r-0">
                            {field.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pricingRows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/40">
                          {PRICING_TABLE_FIELDS.map((field) => {
                            const isPrice = PRICING_PRICE_FIELDS.includes(field.key);
                            const isNumber = isPrice;
                            return (
                              <td
                                key={field.key}
                                className={`px-4 py-2 whitespace-nowrap border-r border-gray-100 last:border-r-0 ${isNumber ? "text-right" : "text-left"} text-gray-800`}
                              >
                                {isPrice ? formatCurrency(row[field.key as keyof typeof row]) : row[field.key as keyof typeof row]}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      {newPricingRow && (
                        <tr className="border-b border-gray-100 bg-blue-50">
                          {PRICING_TABLE_FIELDS.map((field) => {
                            const isPrice = PRICING_PRICE_FIELDS.includes(field.key);
                            const isNumber = isPrice;
                            return (
                              <td key={field.key} className={`px-4 py-2 border-r border-gray-100 last:border-r-0 ${isNumber ? "text-right" : "text-left"}`}>
                                <input
                                  className="bg-white border border-gray-200 rounded px-2 py-1 text-sm w-full"
                                  type={isNumber ? "number" : "text"}
                                  value={newPricingRow[field.key as keyof typeof newPricingRow] as any}
                                  onChange={e => setNewPricingRow({
                                    ...newPricingRow,
                                    [field.key]: isNumber ? Number(e.target.value) : e.target.value
                                  })}
                                />
                              </td>
                            );
                          })}
                          <td colSpan={1} className="px-2 py-2">
                            <button onClick={handleSavePricingRow} className="text-green-600 border border-green-200 rounded px-2 py-1 text-xs hover:bg-green-50">Save</button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                          </div>
                        </div>

              <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
                <div className="text-2xl font-bold mb-6 text-blue-900">Shipping</div>
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50 border-b border-gray-200">
                        {SHIPPING2_TABLE_FIELDS.map((field) => (
                          <th key={field.key} className="px-4 py-3 text-left font-bold text-blue-900 whitespace-nowrap border-r border-gray-200 last:border-r-0">
                            {field.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {shippingRows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/40">
                          {SHIPPING2_TABLE_FIELDS.map((field) => {
                            const isPrice = SHIPPING_PRICE_FIELDS.includes(field.key);
                            const isNumber = isPrice;
                          return (
                              <td
                                key={field.key}
                                className={`px-4 py-2 whitespace-nowrap border-r border-gray-100 last:border-r-0 ${isNumber ? "text-right" : "text-left"} text-gray-800`}
                              >
                                {isPrice ? formatCurrency(row[field.key as keyof typeof row]) : row[field.key as keyof typeof row]}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      {newShippingRow && (
                        <tr className="border-b border-gray-100 bg-blue-50">
                          {SHIPPING2_TABLE_FIELDS.map((field) => {
                            const isPrice = SHIPPING_PRICE_FIELDS.includes(field.key);
                            const isNumber = isPrice;
                            return (
                              <td key={field.key} className={`px-4 py-2 border-r border-gray-100 last:border-r-0 ${isNumber ? "text-right" : "text-left"}`}>
                                <input
                                  className="bg-white border border-gray-200 rounded px-2 py-1 text-sm w-full"
                                  type={isNumber ? "number" : "text"}
                                  value={newShippingRow[field.key as keyof typeof newShippingRow] as any}
                                  onChange={e => setNewShippingRow({
                                    ...newShippingRow,
                                    [field.key]: isNumber ? Number(e.target.value) : e.target.value
                                  })}
                                />
                              </td>
                            );
                          })}
                          <td colSpan={1} className="px-2 py-2">
                            <button onClick={handleSaveShippingRow} className="text-green-600 border border-green-200 rounded px-2 py-1 text-xs hover:bg-green-50">Save</button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-center gap-4 py-8">
                <Button onClick={handleSave} className="bg-blue-600 text-white">Save</Button>
                <Button onClick={handleCancel} variant="outline">Cancel</Button>
              </div>
              {paymentEnabled && (
                <div className="flex justify-center gap-4 py-8">
                  <Button onClick={handleOpenPaymentDialog} className="bg-blue-600 text-white">Payment</Button>
                </div>
              )}
            </div>
          )}

          {/* Others and Address tabs can be implemented similarly if needed */}
          {activeTab === "Others" && (
            <div className="flex flex-col items-center w-full">
              <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-100">
                <div className="text-2xl font-bold mb-6 text-blue-900">Other Details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 auto-rows-min">
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Warehouse</label>
                    <Input value={editData.others.warehouse} onChange={e => handleFieldChange('others', 'warehouse', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Order Method</label>
                    <Input value={editData.others.orderMethod} onChange={e => handleFieldChange('others', 'orderMethod', e.target.value)} />
                              </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Sales Person</label>
                    <Input value={editData.others.salesPerson} onChange={e => handleFieldChange('others', 'salesPerson', e.target.value)} />
                      </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Exhibitor</label>
                    <Input value={editData.others.exhibitor} onChange={e => handleFieldChange('others', 'exhibitor', e.target.value)} />
                    </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 py-8">
                <Button onClick={handleSave} className="bg-blue-600 text-white">Save</Button>
                <Button onClick={handleCancel} variant="outline">Cancel</Button>
              </div>
            </div>
          )}

          {activeTab === "Address" && (
            <div className="flex flex-col items-center w-full">
              <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-100">
                <div className="text-2xl font-bold mb-6 text-blue-900">Address Details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 auto-rows-min mb-4">
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Country Code</label>
                    <Input value={editData.address.countryCode} onChange={e => handleFieldChange('address', 'countryCode', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Area Code</label>
                    <Input value={editData.address.areaCode} onChange={e => handleFieldChange('address', 'areaCode', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Phone Number</label>
                    <Input value={editData.address.phoneNumber} onChange={e => handleFieldChange('address', 'phoneNumber', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Extension</label>
                    <Input value={editData.address.extension} onChange={e => handleFieldChange('address', 'extension', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Email</label>
                    <Input value={editData.address.email} onChange={e => handleFieldChange('address', 'email', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Customer</label>
                    <Input value={editData.address.customer} onChange={e => handleFieldChange('address', 'customer', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Customer Number</label>
                    <Input value={editData.address.customerNumber} onChange={e => handleFieldChange('address', 'customerNumber', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                    <label className="block text-gray-600 text-sm">Customer Contact</label>
                    <Input value={editData.address.customerContact} onChange={e => handleFieldChange('address', 'customerContact', e.target.value)} />
                  </div>
                </div>
              </div>
              {/* Shipping, Billing, Deliver cards */}
              {["Shipping", "Billing", "Deliver"].map((title, idx) => (
                <div key={title} className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-100">
                  <div className="text-xl font-bold mb-6 text-blue-900">{title}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 auto-rows-min">
                    <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                      <label className="block text-gray-600 text-sm">Location</label>
                      <div className="bg-blue-50 rounded px-3 py-2 text-blue-900 text-left">Location {idx + 1}</div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                      <label className="block text-gray-600 text-sm">Customer</label>
                      <div className="bg-blue-50 rounded px-3 py-2 text-blue-900 text-left">Customer {idx + 1}</div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                      <label className="block text-gray-600 text-sm">Number</label>
                      <div className="bg-blue-50 rounded px-3 py-2 text-blue-900 text-left">000{idx + 1}</div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                      <label className="block text-gray-600 text-sm">Address</label>
                      <div className="bg-blue-50 rounded px-3 py-2 text-blue-900 text-left">123 Main St, City</div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[180px] max-w-xs">
                      <label className="block text-gray-600 text-sm">Contact</label>
                      <div className="bg-blue-50 rounded px-3 py-2 text-blue-900 text-left">Contact Name</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center gap-4 py-8">
                <Button onClick={handleSave} className="bg-blue-600 text-white">Save</Button>
                <Button onClick={handleCancel} variant="outline">Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 7. Payment Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] flex flex-col items-center">
            <div className="text-lg font-bold mb-4">Confirm Payment</div>
            <div className="mb-6">Are you sure you want to proceed with the payment?</div>
            <div className="flex gap-4">
              <Button onClick={handleConfirmPayment} className="bg-blue-600 text-white">Confirm</Button>
              <Button onClick={handleClosePaymentDialog} variant="outline">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
