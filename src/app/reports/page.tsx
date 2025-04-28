"use client";

import { useState } from "react";
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { mockOrders } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";
import type { Order } from "@/types/orders";
import { CustomPagination } from "@/components/ui/pagination";
import { PageSizeSelector } from "@/components/ui/page-size-selector";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { CSVLink } from "react-csv";

interface ChartData {
  name: string;
  value: number;
}

// Helper function to group and sum data
const groupAndSum = (
  data: Order[],
  key: keyof Order,
  valueKey: keyof Order = "total"
): ChartData[] => {
  return Object.entries(
    data.reduce((acc: Record<string, number>, item: Order) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) {
        acc[groupKey] = 0;
      }
      acc[groupKey] += Number(item[valueKey]);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
};

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter orders based on search query
  const filteredOrders = mockOrders.filter((order) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(query) ||
      order.showId.toLowerCase().includes(query) ||
      order.customerPO.toLowerCase().includes(query) ||
      order.orderDate.includes(query)
    );
  });

  // Calculate KPIs from filtered data
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const uniqueExhibitors = new Set(
    filteredOrders.map((order) => order.customerPO)
  ).size;
  const showCounts = filteredOrders.reduce(
    (acc: Record<string, number>, order) => {
      acc[order.showId] = (acc[order.showId] || 0) + 1;
      return acc;
    },
    {}
  );
  const mostPopularShow = Object.entries(showCounts).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["No shows", 0]
  )[0];

  // Prepare chart data from filtered data
  const ordersByShow = groupAndSum(filteredOrders, "showId");
  const revenueByShow = groupAndSum(filteredOrders, "showId", "total");
  const revenueByChannel = groupAndSum(filteredOrders, "salesChannel", "total");

  // Prepare time series data from filtered data
  const ordersByDate = filteredOrders
    .sort(
      (a, b) =>
        new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
    )
    .map((order) => ({
      date: formatDate(order.orderDate),
      orders: 1,
      revenue: order.total,
    }));

  // Get recent orders from filtered data
  const recentOrders = filteredOrders.slice(0, 10);

  // Get paginated orders from filtered data
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Reports" }]}>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search Reports by: Order ID | Show ID | Customer PO | Order Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-lg text-gray-500">No matching reports found</p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your search criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {searchQuery
                    ? `Filtered from ${mockOrders.length} total orders`
                    : "All orders"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {searchQuery ? "Filtered revenue" : "Total revenue"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique Exhibitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueExhibitors}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {searchQuery ? "In filtered results" : "Total exhibitors"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Most Popular Show
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mostPopularShow}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {searchQuery ? "Based on filtered data" : "Overall"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Orders by Show */}
            <Card>
              <CardHeader>
                <CardTitle>Orders by Show</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersByShow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Show */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Show</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByShow}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueByShow.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Orders Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Orders Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ordersByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="orders"
                        stroke="#8884d8"
                        name="Orders"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#82ca9d"
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Sales Channel */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Sales Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByChannel}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {revenueByChannel.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="default" asChild>
                  <CSVLink
                    data={filteredOrders.map((order) => ({
                      orderId: order.orderId,
                      showId: order.showId,
                      customerPO: order.customerPO,
                      orderDate: order.orderDate,
                      total: order.total,
                      orderType: order.orderType,
                      salesChannel: order.salesChannel,
                      subTotal: order.subTotal,
                      tax: order.tax,
                      cancelCharge: order.cancelCharge,
                      source: order.source,
                      project: order.project,
                      boothInfo: order.boothInfo,
                      billingAddress: order.billingAddress,
                    }))}
                    filename="orders-report.csv"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </CSVLink>
                </Button>
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
                  {paginatedOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>{order.orderId}</TableCell>
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
      )}
    </MainLayout>
  );
}
