"use client";

import MainLayout from "@/components/mainlayout/MainLayout";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import { mockShows, mockProjectData } from "@/lib/mockData";
import { mockOrders } from "@/app/orders/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomPagination } from "@/components/ui/pagination";
import { PageSizeSelector } from "@/components/ui/page-size-selector";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Activity, Users, MapPin, DollarSign } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from "recharts";
import dayjs from "dayjs";

export default function DashboardPage() {
  // This will automatically redirect to login if not authenticated
  useAuthProtection();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Use mockShows for dashboard tables
  const paginatedShows = mockShows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add some ongoing shows for demo
  const demoOngoingShows = mockShows.map((show, idx) =>
    idx < 3 ? { ...show, occrType: "Ongoing" } : show
  );

  // Generate additional mock orders with future dates for demo
  const futureOrderBaseDate = dayjs().add(1, 'day');
  const additionalOrders = Array.from({ length: 20 }).map((_, i) => {
    const showIdx = i % mockShows.length;
    const show = mockShows[showIdx];
    return {
      orderId: `FUTURE-ORD-${i + 1}`,
      showId: show.showId,
      occurrenceId: `${show.showId}-FUTURE`,
      subTotal: 10000 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 1000,
      orderType: "New",
      customerPO: `PO-FUTURE-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: show.projectNumber || `P2024-FUTURE-${i + 1}`,
      orderDate: futureOrderBaseDate.add(i, 'day').format('YYYY-MM-DD'),
      boothInfo: `Booth #${i + 100}`,
      billingAddress: `123 Future St, City ${i + 1}, USA`,
      total: 11000 + i * 100,
      items: [
        {
          serialNo: 1,
          orderedItem: "Future Booth Package",
          itemDescription: "Demo Booth",
          quantity: 1,
          cancellationFee: 0,
          quantityCancelled: 0,
          uom: "EA",
          kitPrice: 10000,
          newPrice: 10000,
          discount: 0,
          extendedPrice: 10000,
          userItemDescription: "Demo booth for future show",
          dff: "N/A",
          orderReceivedDate: futureOrderBaseDate.add(i, 'day').format('YYYY-MM-DD'),
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-FUTURE-${i + 1}`,
          industryInformation: "Demo Industry",
        },
      ],
    };
  });

  // Add exhibitors for January and February shows
  const janShows = mockShows.filter(s => s.yrmo.endsWith('-01'));
  const febShows = mockShows.filter(s => s.yrmo.endsWith('-02'));
  const janOrders = Array.from({ length: 5 }).map((_, i) => {
    const show = janShows[i % janShows.length];
    return {
      orderId: `JAN-ORD-${i + 1}`,
      showId: show.showId,
      occurrenceId: `${show.showId}-JAN`,
      subTotal: 9000 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 900,
      orderType: "New",
      customerPO: `PO-JAN-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: show.projectNumber || `P2024-JAN-${i + 1}`,
      orderDate: `2024-01-${(i + 5).toString().padStart(2, '0')}`,
      boothInfo: `Booth #J${i + 1}`,
      billingAddress: `123 Jan St, City ${i + 1}, USA`,
      total: 9900 + i * 100,
      items: [
        {
          serialNo: 1,
          orderedItem: "Jan Booth Package",
          itemDescription: "Demo Booth",
          quantity: 1,
          cancellationFee: 0,
          quantityCancelled: 0,
          uom: "EA",
          kitPrice: 9000,
          newPrice: 9000,
          discount: 0,
          extendedPrice: 9000,
          userItemDescription: "Demo booth for Jan show",
          dff: "N/A",
          orderReceivedDate: `2024-01-${(i + 5).toString().padStart(2, '0')}`,
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-JAN-${i + 1}`,
          industryInformation: "Demo Industry",
        },
      ],
    };
  });
  const febOrders = Array.from({ length: 3 }).map((_, i) => {
    const show = febShows[i % febShows.length];
    return {
      orderId: `FEB-ORD-${i + 1}`,
      showId: show.showId,
      occurrenceId: `${show.showId}-FEB`,
      subTotal: 9500 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 950,
      orderType: "New",
      customerPO: `PO-FEB-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: show.projectNumber || `P2024-FEB-${i + 1}`,
      orderDate: `2024-02-0${i + 2}`,
      boothInfo: `Booth #F${i + 1}`,
      billingAddress: `123 Feb St, City ${i + 1}, USA`,
      total: 10450 + i * 100,
      items: [
        {
          serialNo: 1,
          orderedItem: "Feb Booth Package",
          itemDescription: "Demo Booth",
          quantity: 1,
          cancellationFee: 0,
          quantityCancelled: 0,
          uom: "EA",
          kitPrice: 9500,
          newPrice: 9500,
          discount: 0,
          extendedPrice: 9500,
          userItemDescription: "Demo booth for Feb show",
          dff: "N/A",
          orderReceivedDate: `2024-02-0${i + 2}`,
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-FEB-${i + 1}`,
          industryInformation: "Demo Industry",
        },
      ],
    };
  });

  // Add more upcoming orders for SHW001, SHW002, SHW003 for live data effect
  const moreOrders = [
    ...Array.from({ length: 10 }).map((_, i) => ({
      orderId: `LIVE-ORD-SHW001-${i + 1}`,
      showId: 'SHW001',
      occurrenceId: 'SHW001-LIVE',
      subTotal: 12000 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 1200,
      orderType: "New",
      customerPO: `PO-LIVE-SHW001-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: `P2024-LIVE-SHW001`,
      orderDate: dayjs().add(i + 1, 'day').format('YYYY-MM-DD'),
      boothInfo: `Booth #L1${i + 1}`,
      billingAddress: `123 Live St, City 1, USA`,
      total: 13200 + i * 100,
      items: [
        {
          serialNo: 1,
          orderedItem: "Live Booth Package",
          itemDescription: "Demo Booth",
          quantity: 1,
          cancellationFee: 0,
          quantityCancelled: 0,
          uom: "EA",
          kitPrice: 12000,
          newPrice: 12000,
          discount: 0,
          extendedPrice: 12000,
          userItemDescription: "Demo booth for live show",
          dff: "N/A",
          orderReceivedDate: dayjs().add(i + 1, 'day').format('YYYY-MM-DD'),
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-LIVE-SHW001-${i + 1}`,
          industryInformation: "Demo Industry",
        },
      ],
    })),
    ...Array.from({ length: 15 }).map((_, i) => ({
      orderId: `LIVE-ORD-SHW002-${i + 1}`,
      showId: 'SHW002',
      occurrenceId: 'SHW002-LIVE',
      subTotal: 13000 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 1300,
      orderType: "New",
      customerPO: `PO-LIVE-SHW002-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: `P2024-LIVE-SHW002`,
      orderDate: dayjs().add(i + 2, 'day').format('YYYY-MM-DD'),
      boothInfo: `Booth #L2${i + 1}`,
      billingAddress: `123 Live St, City 2, USA`,
      total: 14300 + i * 100,
      items: [
        {
          serialNo: 1,
          orderedItem: "Live Booth Package",
          itemDescription: "Demo Booth",
          quantity: 1,
          cancellationFee: 0,
          quantityCancelled: 0,
          uom: "EA",
          kitPrice: 13000,
          newPrice: 13000,
          discount: 0,
          extendedPrice: 13000,
          userItemDescription: "Demo booth for live show",
          dff: "N/A",
          orderReceivedDate: dayjs().add(i + 2, 'day').format('YYYY-MM-DD'),
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-LIVE-SHW002-${i + 1}`,
          industryInformation: "Demo Industry",
        },
      ],
    })),
    ...Array.from({ length: 12 }).map((_, i) => ({
      orderId: `LIVE-ORD-SHW003-${i + 1}`,
      showId: 'SHW003',
      occurrenceId: 'SHW003-LIVE',
      subTotal: 14000 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 1400,
      orderType: "New",
      customerPO: `PO-LIVE-SHW003-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: `P2024-LIVE-SHW003`,
      orderDate: dayjs().add(i + 3, 'day').format('YYYY-MM-DD'),
      boothInfo: `Booth #L3${i + 1}`,
      billingAddress: `123 Live St, City 3, USA`,
      total: 15400 + i * 100,
      items: [
        {
          serialNo: 1,
          orderedItem: "Live Booth Package",
          itemDescription: "Demo Booth",
          quantity: 1,
          cancellationFee: 0,
          quantityCancelled: 0,
          uom: "EA",
          kitPrice: 14000,
          newPrice: 14000,
          discount: 0,
          extendedPrice: 14000,
          userItemDescription: "Demo booth for live show",
          dff: "N/A",
          orderReceivedDate: dayjs().add(i + 3, 'day').format('YYYY-MM-DD'),
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-LIVE-SHW003-${i + 1}`,
          industryInformation: "Demo Industry",
        },
      ],
    })),
  ];

  const allOrders = [...mockOrders, ...additionalOrders, ...janOrders, ...febOrders, ...moreOrders];

  // Calculate show status counts
  const ongoingCount = demoOngoingShows.filter(s => s.occrType === "Ongoing").length;
  const completedCount = demoOngoingShows.filter(s => s.occrType === "Complete").length;
  const upcomingCount = demoOngoingShows.length - ongoingCount - completedCount;

  // Only consider ongoing shows for these stats
  const ongoingShowIds = demoOngoingShows
    .filter(s => s.occrType === "Ongoing")
    .map(s => s.showId);

  const ongoingOrders = allOrders.filter(o => ongoingShowIds.includes(o.showId));

  // Total Exhibitors (unique customerPOs in ongoing orders)
  const totalOngoingExhibitors = new Set(ongoingOrders.map(o => o.customerPO)).size;

  // Active Locations (unique cityOrg in ongoing shows)
  const ongoingLocations = new Set(
    demoOngoingShows
      .filter(s => s.occrType === "Ongoing")
      .map(s => s.cityOrg)
  ).size;

  // Total Revenue (sum of ongoing orders)
  const ongoingRevenue = ongoingOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const stats = [
    { label: "Upcoming Shows", value: upcomingCount, icon: <Calendar className="w-8 h-8 text-blue-500" /> },
    { label: "Ongoing Shows", value: ongoingCount, icon: <Activity className="w-8 h-8 text-green-500" /> },
    { label: "Total Exhibitors", value: totalOngoingExhibitors, icon: <Users className="w-8 h-8 text-purple-500" /> },
    { label: "Active Locations", value: ongoingLocations, icon: <MapPin className="w-8 h-8 text-pink-500" /> },
    { label: "Total Revenue", value: `$${ongoingRevenue.toLocaleString()}` , icon: <DollarSign className="w-8 h-8 text-yellow-500" /> },
  ];
  const showTasks = {
    todo: [
      { task: "Review Floor Plan", due: "Jan 5" },
      { task: "Update Booth Layout", due: "Jan 10" },
      { task: "Vendor Registration", due: "Jan 15" },
    ],
    inProgress: [
      { task: "Exhibitor Setup", due: "Jan 7" },
      { task: "Marketing Materials", due: "Jan 12" },
    ],
    completed: [
      { task: "Budget Approval", due: "Jan 3" },
      { task: "Venue Booking", due: "Jan 1" },
    ],
  };
  // Table data from demoOngoingShows (first 5 for example)
  const showsTable = demoOngoingShows.slice(0, 5).map(show => ({
    id: show.showId,
    name: show.showName,
    date: show.yrmo,
    location: show.cityOrg,
    status: ["Exhibition", "Workshop"].includes(show.occrType) ? "Upcoming" : (show.occrType || "Upcoming")
  }));
  // Chart data from demoOngoingShows and mockOrders (example logic)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Shows",
        data: [
          demoOngoingShows.filter(s => s.yrmo.endsWith("-01")).length,
          demoOngoingShows.filter(s => s.yrmo.endsWith("-02")).length,
          demoOngoingShows.filter(s => s.yrmo.endsWith("-03")).length,
          demoOngoingShows.filter(s => s.yrmo.endsWith("-04")).length,
          demoOngoingShows.filter(s => s.yrmo.endsWith("-05")).length,
          demoOngoingShows.filter(s => s.yrmo.endsWith("-06")).length,
        ],
      },
      {
        label: "Exhibits",
        data: [
          allOrders.filter(o => o.orderDate.includes("-01-")).length,
          allOrders.filter(o => o.orderDate.includes("-02-")).length,
          allOrders.filter(o => o.orderDate.includes("-03-")).length,
          allOrders.filter(o => o.orderDate.includes("-04-")).length,
          allOrders.filter(o => o.orderDate.includes("-05-")).length,
          allOrders.filter(o => o.orderDate.includes("-06-")).length,
        ],
      },
    ],
  };

  // Bar chart for top 3 shows with most upcoming orders
  const today = dayjs();
  const upcomingOrders = allOrders.filter(o => dayjs(o.orderDate).isAfter(today));
  const ordersByShow = upcomingOrders.reduce((acc, order) => {
    acc[order.showId] = (acc[order.showId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topShows = Object.entries(ordersByShow)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Create a mapping from showId to the first 3 letters of the show name (uppercase)
  const showShortcuts = Object.fromEntries(
    mockShows.map(show => [
      show.showId,
      show.showName ? show.showName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() : show.showId
    ])
  );

  const barData = {
    labels: topShows.map(([showId]) => showShortcuts[showId] || showId),
    datasets: [
      {
        label: "Orders",
        data: topShows.map(([, count]) => count),
      },
    ],
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex flex-row items-center p-6 gap-4">
              <div>{stat.icon}</div>
              <div className="h-10 w-px bg-gray-200 mx-3" />
              <div className="flex flex-col items-center pl-2">
                <div className="text-3xl font-bold leading-tight">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">SHOWS & EXHIBITS BY MONTH</div>
              <div className="text-xs text-gray-400">Jan - Jun 2024</div>
            </div>
            <div className="h-56 bg-white rounded-lg shadow border p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.labels.map((label, i) => ({
                  name: label,
                  Shows: chartData.datasets[0].data[i],
                  Exhibits: chartData.datasets[1].data[i],
                }))}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} padding={{ left: 20, right: 20 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Shows"
                    stroke="#60a5fa"
                    fill="rgba(96, 165, 250, 0.2)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Exhibits"
                    stroke="#38bdf8"
                    fill="rgba(56, 189, 248, 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">ORDERS FOR UPCOMING SHOWS</div>
              <div className="text-xs text-green-600 font-semibold">+12.5% from last month</div>
            </div>
            <div className="h-64 bg-white rounded-lg shadow border p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData.labels.slice(0, 3).map((label, i) => ({
                    name: label,
                    Orders: barData.datasets[0].data[i],
                  }))}
                  layout="vertical"
                  barCategoryGap="30%"
                >
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    hide
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontWeight: 'bold', fill: '#222' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="Orders" fill="#60a5fa" barSize={32} radius={[16, 16, 16, 16]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        {/* Show Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">SHOW TASKS</h2>
            <Button variant="success" className="px-4 py-2"> <Plus className="h-4 w-4 mr-2" /> New Task </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">To Do</h3>
              <ul className="space-y-2">
                {showTasks.todo.map((task) => (
                  <li key={task.task} className="bg-gray-50 rounded p-3 flex justify-between items-center">
                    <span>{task.task}</span>
                    <span className="text-xs text-gray-400">Due: {task.due}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">In Progress</h3>
              <ul className="space-y-2">
                {showTasks.inProgress.map((task) => (
                  <li key={task.task} className="bg-gray-50 rounded p-3 flex justify-between items-center">
                    <span>{task.task}</span>
                    <span className="text-xs text-gray-400">Due: {task.due}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Completed</h3>
              <ul className="space-y-2">
                {showTasks.completed.map((task) => (
                  <li key={task.task} className="bg-gray-50 rounded p-3 flex justify-between items-center">
                    <span>{task.task}</span>
                    <span className="text-xs text-gray-400">Due: {task.due}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Upcoming & Ongoing Shows Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">UPCOMING & ONGOING SHOWS</h2>
            <Button variant="success" className="px-4 py-2"> <Plus className="h-4 w-4 mr-2" /> New Show </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead>SHOW ID</TableHead>
                <TableHead>SHOW NAME</TableHead>
                <TableHead>OCCURRENCE DATE</TableHead>
                <TableHead>LOCATION</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showsTable.map((show) => (
                <TableRow key={show.id}>
                  <TableCell>{show.id}</TableCell>
                  <TableCell>{show.name}</TableCell>
                  <TableCell>{show.date}</TableCell>
                  <TableCell>{show.location}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
                        ${show.status === "Ongoing"
                          ? "bg-green-100 text-green-800"
                          : show.status === "Upcoming"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"}
                      `}
                    >
                      {show.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
