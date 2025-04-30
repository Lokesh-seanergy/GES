"use client";

import MainLayout from "@/components/mainlayout/MainLayout";
import { useAuthProtection } from "@/hooks/useAuthProtection";
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
import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Activity, Users, MapPin, DollarSign, CheckCircle, LineChart, BarChart, Bell, ClipboardList, ClipboardCheck, Hourglass } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart as RechartsBarChart, Bar, Legend, PieChart as RechartsPieChart, Pie, Cell
} from "recharts";
import dayjs from "dayjs";
import type { TooltipProps } from 'recharts';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/components/NotificationContext";
import * as React from "react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

// Define a type for dashboard tasks
interface DashboardTask {
  id: number;
  task: string;
  boothZone: string;
  customerName: string;
  status: string;
  due?: string;
  timestamp?: string;
}

// Example day-wise data
const dayData = [
  { date: "2024-04-01", shows: 2, exhibitors: 10 },
  { date: "2024-04-02", shows: 1, exhibitors: 8 },
  { date: "2024-05-01", shows: 3, exhibitors: 15 },
  { date: "2024-05-02", shows: 2, exhibitors: 12 },
  { date: "2024-06-01", shows: 4, exhibitors: 20 },
  { date: "2024-06-02", shows: 2, exhibitors: 10 },
  // ... add more daily data as needed
];

function aggregateByMonth(data: { date: string; shows: number; exhibitors: number }[]): { month: string; shows: number; exhibitors: number }[] {
  const result: Record<string, { month: string; shows: number; exhibitors: number }> = {};
  data.forEach((item) => {
    const month = item.date.slice(0, 7); // "YYYY-MM"
    if (!result[month]) result[month] = { month, shows: 0, exhibitors: 0 };
    result[month].shows += item.shows;
    result[month].exhibitors += item.exhibitors;
  });
  return Object.values(result);
}

function aggregateByYear(data: { date: string; shows: number; exhibitors: number }[]): { year: string; shows: number; exhibitors: number }[] {
  const result: Record<string, { year: string; shows: number; exhibitors: number }> = {};
  data.forEach((item) => {
    const year = item.date.slice(0, 4); // "YYYY"
    if (!result[year]) result[year] = { year, shows: 0, exhibitors: 0 };
    result[year].shows += item.shows;
    result[year].exhibitors += item.exhibitors;
  });
  return Object.values(result);
}

export function ShowsExhibitorsChart() {
  const [granularity, setGranularity] = useState("day");

  // Helper to get all dates between min and max in MM/DD/YYYY
  function getContinuousDates(data: { date: string }[]) {
    if (!data.length) return [];
    const sorted = [...data].sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
    const start = dayjs(sorted[0].date);
    const end = dayjs(sorted[sorted.length - 1].date);
    const days = [];
    let d = start;
    while (d.isBefore(end) || d.isSame(end, 'day')) {
      days.push(d.format('YYYY-MM-DD'));
      d = d.add(1, 'day');
    }
    return days;
  }

  const chartData = useMemo(() => {
    if (granularity === "day") {
      // Fill in missing days with 0s
      const allDays = getContinuousDates(dayData);
      const map = Object.fromEntries(dayData.map(d => [d.date, d]));
      return allDays.map(date => ({
        ...map[date],
        label: dayjs(date).format('MM/DD/YYYY'),
        date,
        shows: map[date]?.shows || 0,
        exhibitors: map[date]?.exhibitors || 0,
      }));
    } else if (granularity === "month") {
      return aggregateByMonth(dayData).map(d => ({ ...d, label: dayjs(d.month + '-01').format('MM/YYYY') }));
    } else if (granularity === "year") {
      return aggregateByYear(dayData).map(d => ({ ...d, label: d.year }));
    }
    return [];
  }, [granularity]);

  return (
    <Card className="p-6 rounded-2xl shadow-xl bg-white border border-indigo-100">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-indigo-700">Shows & Exhibitors</CardTitle>
            <CardDescription className="text-indigo-500">Modern visualization with day, month, or year view</CardDescription>
          </div>
          {/* Granularity Selector */}
          <div className="flex gap-2 bg-indigo-100 rounded-lg p-1 w-fit">
            <button
              className={`px-4 py-1 rounded-md font-semibold transition text-indigo-700 ${granularity === 'day' ? 'bg-white shadow' : 'hover:bg-indigo-200'}`}
              onClick={() => setGranularity('day')}
            >Day</button>
            <button
              className={`px-4 py-1 rounded-md font-semibold transition text-indigo-700 ${granularity === 'month' ? 'bg-white shadow' : 'hover:bg-indigo-200'}`}
              onClick={() => setGranularity('month')}
            >Month</button>
            <button
              className={`px-4 py-1 rounded-md font-semibold transition text-indigo-700 ${granularity === 'year' ? 'bg-white shadow' : 'hover:bg-indigo-200'}`}
              onClick={() => setGranularity('year')}
            >Year</button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="showsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="exhibitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontWeight: 'bold', fill: '#6366f1', fontSize: 14 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontWeight: 'bold', fill: '#22c55e', fontSize: 14 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, boxShadow: '0 2px 12px #0001', border: 'none' }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: 8 }} />
            <Area
              type="monotone"
              dataKey="shows"
              stroke="#6366f1"
              fill="url(#showsGradient)"
              name="Shows"
              dot={{ r: 3, fill: '#6366f1' }}
              strokeWidth={3}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="exhibitors"
              stroke="#22c55e"
              fill="url(#exhibitorsGradient)"
              name="Exhibitors"
              dot={{ r: 3, fill: '#22c55e' }}
              strokeWidth={3}
              activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  // This will automatically redirect to login if not authenticated
  useAuthProtection();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // TODO: Replace with real data source
  // const paginatedShows = mockShows.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  // TODO: Replace with real data source
  // const demoOngoingShows = mockShows.map((show, idx) => {
  //   if (idx < 3) return { ...show, occrType: "Ongoing" };
  //   if (idx < 10) return { ...show, occrType: "Complete" };
  //   return { ...show, occrType: "Upcoming" };
  // });

  // TODO: Replace with real data source
  // const showIdx = i % mockShows.length;
  // const show = mockShows[showIdx];

  // TODO: Replace with real data source
  // const janShows = mockShows.filter(s => s.yrmo.endsWith('-01'));
  // const febShows = mockShows.filter(s => s.yrmo.endsWith('-02'));

  // Generate additional mock orders with future dates for demo
  const futureOrderBaseDate = dayjs().add(1, 'day');
  const additionalOrders = Array.from({ length: 20 }).map((_, i) => {
    // TODO: Replace with real data source
    // const showIdx = i % mockShows.length;
    // const show = mockShows[showIdx];
    return {
      orderId: `FUTURE-ORD-${i + 1}`,
      showId: 'SHW001',
      occurrenceId: 'SHW001-LIVE',
      subTotal: 10000 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 1000,
      orderType: "New",
      customerPO: `PO-LIVE-SHW001-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: 'P2024-LIVE-SHW001',
      orderDate: futureOrderBaseDate.add(i, 'day').format('YYYY-MM-DD'),
      boothInfo: `Booth #L1${i + 1}`,
      billingAddress: `123 Live St, City 1, USA`,
      total: 11000 + i * 100,
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
          orderReceivedDate: futureOrderBaseDate.add(i, 'day').format('YYYY-MM-DD'),
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-LIVE-SHW001-${i + 1}`,
          industryInformation: "Demo Industry",
        },
      ],
    };
  });

  // Add exhibitors for January and February shows
  // TODO: Replace with real data source
  // const janShows = mockShows.filter(s => s.yrmo.endsWith('-01'));
  // const febShows = mockShows.filter(s => s.yrmo.endsWith('-02'));
  const janOrders = Array.from({ length: 5 }).map((_, i) => {
    // TODO: Replace with real data source
    // const show = janShows[i % janShows.length];
    return {
      orderId: `JAN-ORD-${i + 1}`,
      showId: 'SHW001',
      occurrenceId: 'SHW001-LIVE',
      subTotal: 9000 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 900,
      orderType: "New",
      customerPO: `PO-LIVE-SHW001-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: 'P2024-LIVE-SHW001',
      orderDate: `2024-01-${(i + 5).toString().padStart(2, '0')}`,
      boothInfo: `Booth #L1${i + 1}`,
      billingAddress: `123 Live St, City 1, USA`,
      total: 9900 + i * 100,
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
          orderReceivedDate: `2024-01-${(i + 5).toString().padStart(2, '0')}`,
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-LIVE-SHW001-${i + 1}`,
          industryInformation: "Demo Industry",
        },
      ],
    };
  });
  const febOrders = Array.from({ length: 3 }).map((_, i) => {
    // TODO: Replace with real data source
    // const show = febShows[i % febShows.length];
    return {
      orderId: `FEB-ORD-${i + 1}`,
      showId: 'SHW001',
      occurrenceId: 'SHW001-LIVE',
      subTotal: 9500 + i * 100,
      salesChannel: i % 2 === 0 ? "Direct" : "Partner",
      terms: "Net 30",
      tax: 950,
      orderType: "New",
      customerPO: `PO-LIVE-SHW001-${i + 1}`,
      cancelCharge: 0,
      source: "Web",
      project: 'P2024-LIVE-SHW001',
      orderDate: `2024-02-0${i + 2}`,
      boothInfo: `Booth #L1${i + 1}`,
      billingAddress: `123 Live St, City 1, USA`,
      total: 10450 + i * 100,
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
          orderReceivedDate: `2024-02-0${i + 2}`,
          status: "Confirmed",
          itemType: "Booth",
          ato: false,
          lineType: "Standard",
          documentNumber: `DOC-LIVE-SHW001-${i + 1}`,
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
      project: 'P2024-LIVE-SHW001',
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
      project: 'P2024-LIVE-SHW002',
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
      project: 'P2024-LIVE-SHW003',
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

  const allOrders = [...janOrders, ...febOrders, ...moreOrders];

  // Calculate monthly breakdowns for each status
  const months = ["01", "02", "03", "04", "05", "06"];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyStatusCounts = months.map((m) => {
    const showsInMonth = allOrders.filter(o => o.orderDate.includes(`-${m}-`));
    return {
      month: m,
      upcoming: showsInMonth.filter(o => o.orderDate.includes("-01-")).length,
      ongoing: showsInMonth.filter(o => o.orderDate.includes("-02-")).length,
      complete: showsInMonth.filter(o => o.orderDate.includes("-03-")).length,
      total: showsInMonth.length,
    };
  });

  // Totals for each status
  const upcomingCount = monthlyStatusCounts.reduce((sum, m) => sum + m.upcoming, 0);
  const ongoingCount = monthlyStatusCounts.reduce((sum, m) => sum + m.ongoing, 0);
  const completedCount = monthlyStatusCounts.reduce((sum, m) => sum + m.complete, 0);

  // Chart data for Shows (total per month)
  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Shows",
        data: monthlyStatusCounts.map(m => m.total),
      },
      {
        label: "Exhibitors",
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

  // Table of all closed shows
  const closedShowsTable = allOrders.filter(o => o.orderDate.includes("-01-")).map(order => ({
    id: order.showId,
    name: order.showId,
    date: order.orderDate,
    location: order.billingAddress,
  }));

  // Only consider ongoing shows for these stats
  const ongoingShowIds = allOrders.map(o => o.showId);

  const ongoingOrders = allOrders.filter(o => ongoingShowIds.includes(o.showId));

  // Total Exhibitors (unique customerPOs in ongoing orders)
  const totalOngoingExhibitors = new Set(ongoingOrders.map(o => o.customerPO)).size;

  // Active Locations (unique cityOrg in ongoing shows)
  const ongoingLocations = new Set(
    allOrders
      .filter(o => o.orderDate.includes("-01-"))
      .map(o => o.billingAddress)
  ).size;

  // Total Revenue (sum of ongoing orders)
  const ongoingRevenue = ongoingOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Fix closed shows count: count all shows with yrmo before today as closed
  const today = dayjs();
  const closedShows = allOrders.filter(o => dayjs(o.orderDate).isBefore(today, 'day'));
  const closedCount = closedShows.length;

  // Update stats to use hardcoded closed shows count
  const stats = [
    { label: "Upcoming Shows", value: upcomingCount, icon: <Calendar className="w-8 h-8 text-blue-500" /> },
    { label: "Closed Shows", value: 47, icon: <CheckCircle className="w-8 h-8 text-gray-500" /> },
    { label: "Ongoing Shows", value: ongoingCount, icon: <Activity className="w-8 h-8 text-green-500" /> },
    { label: "Total Exhibitors", value: totalOngoingExhibitors, icon: <Users className="w-8 h-8 text-purple-500" /> },
    { label: "Active Locations", value: ongoingLocations, icon: <MapPin className="w-8 h-8 text-pink-500" /> },
  ];
  const { notifications, setNotifications } = useNotifications();
  // On mount, add sample notifications if none exist
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications([
        {
          id: 1,
          task: "Review Floor Plan",
          boothZone: "A1",
          customerName: "Acme Corp",
          status: "pending",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          task: "Update Booth Layout",
          boothZone: "B2",
          customerName: "Globex Corporation",
          status: "pending",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);
  const [showTasks, setShowTasks] = useState<{
    todo: DashboardTask[];
    inProgress: DashboardTask[];
    completed: DashboardTask[];
  }>({
    todo: [],
    inProgress: [
      { id: 3, task: "Exhibitor Setup", due: "Jan 7", boothZone: "D4", customerName: "Umbrella Corp", status: "inProgress" },
      { id: 4, task: "Marketing Materials", due: "Jan 12", boothZone: "E5", customerName: "Hooli", status: "inProgress" },
    ],
    completed: [
      { id: 5, task: "Budget Approval", due: "Jan 3", boothZone: "F6", customerName: "Wayne Enterprises", status: "completed" },
      { id: 6, task: "Venue Booking", due: "Jan 1", boothZone: "G7", customerName: "Stark Industries", status: "completed" },
    ],
  });
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const bellRef = useRef(null);

  // Table data from allOrders (first 5 for example)
  const currentYear = dayjs().year();
  const showsTable = allOrders.slice(0, 5).map(order => {
    let dateStr = order.orderDate;
    // Replace the year with the current year if dateStr is in YYYY-MM-DD format
    if (dateStr && dateStr.length === 10) {
      dateStr = `${currentYear}${dateStr.slice(4)}`;
    }
    return {
      id: order.showId,
      name: order.showId,
      date: dateStr,
      location: order.billingAddress,
      status: ["Exhibition", "Workshop"].includes(order.showId) ? "Upcoming" : (order.showId || "Upcoming")
    };
  });
  // Bar chart for top 3 shows with most upcoming orders
  const upcomingOrders = allOrders.filter(o => dayjs(o.orderDate).isAfter(today));
  const ordersByShow = upcomingOrders.reduce((acc, order) => {
    acc[order.showId] = (acc[order.showId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topShows = Object.entries(ordersByShow)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Create a mapping from showId to the 3-letter shortcut and to the full show name
  const showShortcuts = Object.fromEntries(
    allOrders.map(show => [
      show.showId,
      show.showId ? show.showId.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() : show.showId
    ])
  );
  const showNames = Object.fromEntries(
    allOrders.map(show => [
      showShortcuts[show.showId] || show.showId,
      show.showId || show.showId
    ])
  );

  const barData = topShows.map(([showId, count]) => ({
    name: showShortcuts[showId] || showId, // 3-letter code for Y-axis
    Orders: count,
  }));

  // Custom Tooltip for BarChart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length && label) {
      let fullName = showNames[label as string] || label;
      // Remove location and hyphen, keep only conference name and year
      fullName = fullName.replace(/\s*-\s*[^-]+$/, "");
      return (
        <div className="bg-white p-2 rounded shadow text-xs">
          <div className="font-bold">{fullName}</div>
          <div>Orders: {payload[0].value}</div>
        </div>
      );
    }
    return null;
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  useEffect(() => {
    // Helper to check if a reminder already exists
    const hasReminder = (id: number, type: 'todo' | 'inProgress') =>
      notifications.some(
        n => n.id === id && n.status === `reminder-${type}`
      );

    // Find tasks outside the top 5 in To Do and In Progress
    const hiddenTodo = showTasks.todo.slice(5);
    const hiddenInProgress = showTasks.inProgress.slice(5);

    // Add reminders for hidden To Do tasks
    hiddenTodo.forEach(task => {
      if (!hasReminder(task.id, 'todo')) {
        setNotifications(prev => [
          ...prev,
          {
            ...task,
            status: 'reminder-todo',
            task: `Reminder: Accept task - ${task.task}`,
          },
        ]);
      }
    });

    // Add reminders for hidden In Progress tasks
    hiddenInProgress.forEach(task => {
      if (!hasReminder(task.id, 'inProgress')) {
        setNotifications(prev => [
          ...prev,
          {
            ...task,
            status: 'reminder-inProgress',
            task: `Reminder: Mark as Completed - ${task.task}`,
          },
        ]);
      }
    });

    // Remove reminders for tasks that are now visible or completed
    setNotifications(prev =>
      prev.filter(n => {
        if (n.status === 'reminder-todo') {
          // If the task is now visible in To Do or is no longer in To Do, remove reminder
          return (
            showTasks.todo.slice(5).some(t => t.id === n.id)
          );
        }
        if (n.status === 'reminder-inProgress') {
          // If the task is now visible in In Progress or is no longer in In Progress, remove reminder
          return (
            showTasks.inProgress.slice(5).some(t => t.id === n.id)
          );
        }
        return true; // keep all other notifications
      })
    );
  }, [showTasks, setNotifications]);

  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-8">
        {/* Top section: Chart left, stat cards right; Show Details below chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Left column: Chart and Show Tasks below */}
          <div className="flex flex-col gap-6 col-span-2">
            <ShowsExhibitorsChart />
            {/* Show Tasks Card below the chart */}
            <Card className="p-6 rounded-2xl shadow bg-white border border-blue-100">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-blue-700 mb-4">
                  <ClipboardList className="w-7 h-7 text-blue-500" />
                  Show Tasks
              </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* To Do */}
            <div>
                    <div className="flex items-center gap-2 text-base font-semibold text-blue-600 mb-3">
                      <ClipboardCheck className="w-5 h-5" /> To Do
                    </div>
                    <ul className="space-y-4">
                {notifications.filter((n: DashboardTask) => n.status === "pending").map((task: DashboardTask) => (
                        <li key={task.id} className="bg-white rounded-lg p-3 flex flex-row items-center border-l-2 border-blue-400 shadow-sm justify-between">
                          <div>
                            <span className="font-medium">{task.task}</span>
                            <span className="block text-xs text-gray-500">Zone: {task.boothZone} | Customer: {task.customerName}</span>
                          </div>
                          <Button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow px-4 py-2 ml-4 font-semibold" size="sm"
                      onClick={() => {
                        setShowTasks((prev) => ({
                          ...prev,
                          inProgress: [
                            ...prev.inProgress,
                            { ...task, status: "inProgress" }
                          ]
                        }));
                        setNotifications((prev: DashboardTask[]) => prev.filter((n: DashboardTask) => n.id !== task.id));
                      }}
                          >Accept</Button>
                  </li>
                ))}
                {showTasks.todo.map((task: DashboardTask) => (
                        <li key={task.task} className="bg-white rounded-lg p-3 flex flex-row items-center border-l-2 border-blue-400 shadow-sm justify-between">
                          <div>
                            <span className="font-medium">{task.task}</span>
                            <span className="block text-xs text-gray-500">Zone: {task.boothZone} | Customer: {task.customerName}</span>
                          </div>
                  </li>
                ))}
              </ul>
            </div>
                  {/* In Progress */}
            <div>
                    <div className="flex items-center gap-2 text-base font-semibold text-yellow-600 mb-3">
                      <Hourglass className="w-5 h-5" /> In Progress
                    </div>
                    <ul className="space-y-4">
                {showTasks.inProgress.map((task: DashboardTask) => (
                        <li key={task.id} className="bg-white rounded-lg p-3 flex flex-row items-center border-l-2 border-yellow-400 shadow-sm justify-between">
                          <div>
                            <span className="font-medium">{task.task}</span>
                            <span className="block text-xs text-gray-500">Zone: {task.boothZone} | Customer: {task.customerName}</span>
                          </div>
                          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow px-4 py-2 ml-4 font-semibold" size="sm"
                      onClick={() => {
                        setShowTasks((prev) => ({
                          ...prev,
                          inProgress: prev.inProgress.filter((t) => t.id !== task.id),
                          completed: [
                            ...prev.completed,
                            { ...task, status: "completed", due: dayjs().format('MMM D') },
                          ],
                        }));
                      }}
                          >Mark as Completed</Button>
                  </li>
                ))}
              </ul>
            </div>
                  {/* Completed */}
            <div>
                    <div className="flex items-center gap-2 text-base font-semibold text-green-600 mb-3">
                      <CheckCircle className="w-5 h-5" /> Completed
                    </div>
                    <ul className="space-y-4">
                {showTasks.completed
                        .slice(0, 5)
                  .map((task: DashboardTask) => (
                          <li key={task.task} className="bg-white rounded-lg p-3 flex flex-col gap-1 border-l-2 border-green-400 shadow-sm">
                            <span className="font-medium">{task.task}</span>
                            <span className="text-xs text-gray-500">Zone: {task.boothZone} | Customer: {task.customerName}</span>
                      <span className="text-xs text-gray-400">Due: {task.due}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
            </Card>
          </div>
          {/* Right column: Stat cards grid and Show Details below */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl ml-auto">
              {/* First row: Upcoming, Closed */}
              <Card className="flex flex-row items-center p-6 gap-4 rounded-2xl shadow-lg bg-white hover:scale-[1.03] transition-transform duration-200 border-0">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 shadow-inner">
                  {stats[0].icon}
                </div>
                <div className="flex-1 flex flex-col items-start pl-2">
                  <div className="text-4xl font-extrabold text-blue-700 drop-shadow">{stats[0].value}</div>
                  <div className="text-base text-blue-600 mt-1 font-medium">{stats[0].label}</div>
                </div>
              </Card>
              <Card className="flex flex-row items-center p-6 gap-4 rounded-2xl shadow-lg bg-white hover:scale-[1.03] transition-transform duration-200 border-0">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 shadow-inner">
                  {stats[1].icon}
                </div>
                <div className="flex-1 flex flex-col items-start pl-2">
                  <div className="text-4xl font-extrabold text-gray-700 drop-shadow">{stats[1].value}</div>
                  <div className="text-base text-gray-600 mt-1 font-medium">{stats[1].label}</div>
                </div>
              </Card>
              {/* Second row: Ongoing, spanning both columns */}
              <Card className="flex flex-row items-center p-6 gap-4 col-span-2 rounded-2xl shadow-lg bg-white hover:scale-[1.03] transition-transform duration-200 border-0">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 shadow-inner">
                  {stats[2].icon}
                </div>
                <div className="flex-1 flex flex-col items-start pl-2">
                  <div className="text-4xl font-extrabold text-green-700 drop-shadow">{stats[2].value}</div>
                  <div className="text-base text-green-600 mt-1 font-medium">{stats[2].label}</div>
                </div>
              </Card>
              {/* Third row: Total Exhibitors, Active Locations */}
              <Card className="flex flex-row items-center p-6 gap-4 rounded-2xl shadow-lg bg-white hover:scale-[1.03] transition-transform duration-200 border-0">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 shadow-inner">
                  {stats[3].icon}
                </div>
                <div className="flex-1 flex flex-col items-start pl-2">
                  <div className="text-4xl font-extrabold text-purple-700 drop-shadow">{stats[3].value}</div>
                  <div className="text-base text-purple-600 mt-1 font-medium">{stats[3].label}</div>
                </div>
              </Card>
              <Card className="flex flex-row items-center p-6 gap-4 rounded-2xl shadow-lg bg-white hover:scale-[1.03] transition-transform duration-200 border-0">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 shadow-inner">
                  {stats[4].icon}
                </div>
                <div className="flex-1 flex flex-col items-start pl-2">
                  <div className="text-4xl font-extrabold text-pink-700 drop-shadow">{stats[4].value}</div>
                  <div className="text-base text-pink-600 mt-1 font-medium">{stats[4].label}</div>
                </div>
              </Card>
            </div>
            {/* Show Details Card below stat cards */}
            <Card className="lg:row-span-3 flex flex-col justify-between p-6 rounded-2xl shadow-lg bg-white">
              <div className="mb-4">
                <div className="text-2xl font-bold text-indigo-700 mb-2">Show Details</div>
                {/* Notification-style list of shows */}
                <div className="space-y-3">
                  {showsTable.slice(0, 5).map((show) => (
                    <div
                      key={show.id}
                      className="flex items-center justify-between bg-white/80 rounded-xl shadow p-4 hover:bg-indigo-50 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-indigo-700">{show.id}</span>
                          <span className="font-medium text-base">{show.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{show.location}</div>
                      </div>
                      <div className="text-sm text-indigo-600 font-semibold whitespace-nowrap ml-4">
                        {dayjs(show.date).isValid() ? dayjs(show.date).format('MM/DD/YYYY') : show.date}
                      </div>
                    </div>
                  ))}
        </div>
      </div>
            </Card>
          </div>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 font-semibold mb-4">
              <BarChart className="w-5 h-5 text-green-500" />
              Orders for Ongoing Shows
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RechartsBarChart
                data={barData}
                layout="vertical"
                barCategoryGap="30%"
                margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontWeight: 'bold', fill: '#2563eb', fontSize: 16 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontWeight: 'bold', fill: '#222', fontSize: 16 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ borderRadius: 12, boxShadow: '0 2px 12px #0001', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 8 }} />
                <Bar dataKey="Orders" fill="#60a5fa" barSize={32} radius={[16, 16, 16, 16]} animationDuration={1200} animationEasing="ease-out" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
