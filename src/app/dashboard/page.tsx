"use client";

import MainLayout from "@/components/mainlayout/MainLayout";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import { mockShows, mockProjectData, mockOrders } from "@/lib/mockData";
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
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Activity, Users, MapPin, DollarSign, CheckCircle, LineChart, BarChart, Bell, ClipboardCheck, ListChecks, ClipboardList, Clock, Loader } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line, Legend
} from "recharts";
import dayjs from "dayjs";
import type { TooltipProps } from 'recharts';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/components/NotificationContext";
import { useAuthStore } from '@/store/authStore';

// Define a type for dashboard tasks
interface DashboardTask {
  id: number;
  task: string;
  boothZone: string;
  customerName: string;
  status: string;
  due?: string;
  timestamp?: string;
  acceptedBy?: string;
}

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

  // Assign statuses: first 3 as Ongoing, next 7 as Complete, rest as Upcoming
  const demoOngoingShows = mockShows.map((show, idx) => {
    if (idx < 3) return { ...show, occrType: "Ongoing" };
    if (idx < 10) return { ...show, occrType: "Complete" };
    return { ...show, occrType: "Upcoming" };
  });

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

  // Calculate monthly breakdowns for each status
  const months = ["01", "02", "03", "04", "05", "06"];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyStatusCounts = months.map((m) => {
    const showsInMonth = demoOngoingShows.filter(s => s.yrmo.endsWith(`-${m}`));
    return {
      month: m,
      upcoming: showsInMonth.filter(s => s.occrType === "Upcoming").length,
      ongoing: showsInMonth.filter(s => s.occrType === "Ongoing").length,
      complete: showsInMonth.filter(s => s.occrType === "Complete").length,
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
  const closedShowsTable = demoOngoingShows.filter(s => s.occrType === "Complete").map(show => ({
    id: show.showId,
    name: show.showName,
    date: show.yrmo && show.yrmo.length === 7 ? `${show.yrmo}-01` : show.yrmo,
    location: show.cityOrg,
  }));

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

  // Fix closed shows count: count all shows with yrmo before today as closed
  const today = dayjs();
  const closedShows = demoOngoingShows.filter(s => dayjs(s.yrmo + '-01').isBefore(today, 'day'));
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
  const { userProfile } = useAuthStore();
  // On mount, add sample To Do tasks if none exist
  useEffect(() => {
    if (showTasks.todo.length === 0) {
      setShowTasks(prev => ({
        ...prev,
        todo: [
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
        ],
      }));
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

  // Table data from demoOngoingShows (first 5 for example)
  const currentYear = dayjs().year();
  const showsTable = demoOngoingShows.slice(0, 5).map(show => {
    let dateStr = show.yrmo && show.yrmo.length === 7 ? `${show.yrmo}-01` : show.yrmo;
    // Replace the year with the current year if dateStr is in YYYY-MM-DD format
    if (dateStr && dateStr.length === 10) {
      dateStr = `${currentYear}${dateStr.slice(4)}`;
    }
    return {
      id: show.showId,
      name: show.showName,
      date: dateStr,
      location: show.cityOrg,
      status: ["Exhibition", "Workshop"].includes(show.occrType) ? "Upcoming" : (show.occrType || "Upcoming")
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
    mockShows.map(show => [
      show.showId,
      show.showName ? show.showName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() : show.showId
    ])
  );
  const showNames = Object.fromEntries(
    mockShows.map(show => [
      showShortcuts[show.showId] || show.showId,
      show.showName || show.showId
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

  // Add at the top of the component
  const [chartView, setChartView] = useState<'month' | 'year'>('month');

  // Mock data for day and year views
  const chartDataDay = [
    { name: '01', Shows: 2, Exhibitors: 5 },
    { name: '02', Shows: 3, Exhibitors: 7 },
    { name: '03', Shows: 1, Exhibitors: 4 },
    { name: '04', Shows: 4, Exhibitors: 8 },
    { name: '05', Shows: 2, Exhibitors: 6 },
    { name: '06', Shows: 3, Exhibitors: 9 },
    { name: '07', Shows: 2, Exhibitors: 5 },
  ];

  // Add state for quick range selection
  const [chartRange, setChartRange] = useState<'1m' | '3m' | '6m' | 'yr' | 'ytd'>('ytd');

  // Helper to get start date for each range
  const getRangeStart = () => {
    const today = dayjs();
    switch (chartRange) {
      case '1m': return today.subtract(1, 'month').startOf('day');
      case '3m': return today.subtract(3, 'month').startOf('day');
      case '6m': return today.subtract(6, 'month').startOf('day');
      case 'yr': return today.subtract(1, 'year').startOf('day');
      case 'ytd': return today.startOf('year');
      default: return today.startOf('year');
    }
  };
  const rangeStart = getRangeStart();

  // Filter orders and shows for the selected range
  const filteredOrders = allOrders.filter(o => {
    const orderDate = dayjs(o.orderDate);
    return orderDate.isAfter(rangeStart.subtract(1, 'day')) && orderDate.isBefore(today.add(1, 'day'));
  });
  const filteredShows = demoOngoingShows.filter(s => {
    const showDate = dayjs(s.yrmo + '-01');
    return showDate.isAfter(rangeStart.subtract(1, 'day')) && showDate.isBefore(today.add(1, 'day'));
  });

  // Generate chart data for months in the selected range
  const monthsInRange = [];
  let iterMonth = rangeStart.startOf('month');
  while (iterMonth.isBefore(today, 'month') || iterMonth.isSame(today, 'month')) {
    monthsInRange.push(iterMonth.format('MMMM'));
    iterMonth = iterMonth.add(1, 'month');
  }
  const chartDataMonth = monthsInRange.map((month, i) => {
    const monthNum = (rangeStart.month() + i + 1).toString().padStart(2, '0');
    const year = rangeStart.year() + Math.floor((rangeStart.month() + i) / 12);
    return {
      name: month,
      Shows: filteredShows.filter(s => s.yrmo === `${year}-${monthNum}`).length,
      Exhibitors: filteredOrders.filter(o => o.orderDate.startsWith(`${year}-${monthNum}`)).length,
    };
  });

  // Only declare 'today' once at the top of the quick range logic
  // Define chartDataYear for the year view
  const chartDataYear = [
    { name: '2022', Shows: demoOngoingShows.filter(s => s.yrmo.startsWith('2022')).length, Exhibitors: allOrders.filter(o => o.orderDate.startsWith('2022')).length },
    { name: '2023', Shows: demoOngoingShows.filter(s => s.yrmo.startsWith('2023')).length, Exhibitors: allOrders.filter(o => o.orderDate.startsWith('2023')).length },
    { name: '2024', Shows: demoOngoingShows.filter(s => s.yrmo.startsWith('2024')).length, Exhibitors: allOrders.filter(o => o.orderDate.startsWith('2024')).length },
  ];
  // Only allow 'month' and 'year' views
  const chartDataMap = {
    month: chartDataMonth,
    year: chartDataYear,
  };

  // Add state for undo action
  const [undoInfo, setUndoInfo] = useState<null | {
    task: DashboardTask;
    from: 'todo' | 'inProgress' | 'completed';
    to: 'todo' | 'inProgress' | 'completed';
    timeoutId: NodeJS.Timeout;
  }>(null);

  // Helper to handle Accept with Undo
  const handleAccept = (task: DashboardTask) => {
    setShowTasks((prev) => ({
      ...prev,
      todo: prev.todo.filter((t) => t.id !== task.id),
      inProgress: [
        ...prev.inProgress,
        { ...task, status: 'inProgress', acceptedBy: userProfile?.displayName || userProfile?.email || 'Unknown User' },
      ],
    }));
    const timeoutId = setTimeout(() => setUndoInfo(null), 5000);
    setUndoInfo({ task, from: 'todo', to: 'inProgress', timeoutId });
  };

  // Helper to handle Mark as Completed with Undo
  const handleMarkCompleted = (task: DashboardTask) => {
    setShowTasks((prev) => ({
      ...prev,
      inProgress: prev.inProgress.filter((t) => t.id !== task.id),
      completed: [
        ...prev.completed,
        { ...task, status: 'completed', due: dayjs().format('MMM D') },
      ],
    }));
    const timeoutId = setTimeout(() => setUndoInfo(null), 5000);
    setUndoInfo({ task, from: 'inProgress', to: 'completed', timeoutId });
  };

  // Undo handler
  const handleUndo = () => {
    if (!undoInfo) return;
    clearTimeout(undoInfo.timeoutId);
    if (undoInfo.from === 'todo' && undoInfo.to === 'inProgress') {
      setShowTasks((prev) => ({
        ...prev,
        inProgress: prev.inProgress.filter((t) => t.id !== undoInfo.task.id),
        todo: [...prev.todo, { ...undoInfo.task, status: 'pending' }],
      }));
    } else if (undoInfo.from === 'inProgress' && undoInfo.to === 'completed') {
      setShowTasks((prev) => ({
        ...prev,
        completed: prev.completed.filter((t) => t.id !== undoInfo.task.id),
        inProgress: [...prev.inProgress, { ...undoInfo.task, status: 'inProgress' }],
      }));
    }
    setUndoInfo(null);
  };

  // Update markNotificationAsRead to also add the task to showTasks.todo if not present
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, status: "read" } : n
      )
    );
    const notif = notifications.find(n => n.id === id);
    if (notif && !showTasks.todo.some(t => t.id === notif.id)) {
      setShowTasks(prev => ({
        ...prev,
        todo: [...prev.todo, { ...notif, status: "pending" }]
      }));
    }
  };
  // Update markAllAsRead to add all unread notification tasks to showTasks.todo if not present
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        n.status === "pending" ? { ...n, status: "read" } : n
      )
    );
    const unreadNotifs = notifications.filter(n => n.status === "pending");
    setShowTasks(prev => ({
      ...prev,
      todo: [
        ...prev.todo,
        ...unreadNotifs.filter(notif => !prev.todo.some(t => t.id === notif.id)).map(notif => ({ ...notif, status: "pending" }))
      ]
    }));
  };
  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-8">
        <div className="flex w-full gap-6">
          {/* Left: Main Content */}
          <div className="w-[70%]">
            {/* Shows & Exhibitors Chart */}
            <div className="flex flex-col gap-6">
              <Card className="p-0 rounded-2xl shadow-lg border border-gray-100 bg-white relative overflow-hidden">
                <div className="flex items-center justify-between px-8 pt-8 pb-4">
                  <div>
                    <div className="text-2xl font-extrabold text-blue-800 tracking-tight">Shows & Exhibitors</div>
                    <div className="text-base font-medium text-blue-400">Modern visualization with day, month, or year view</div>
                  </div>
                  {/* Vertical legend at top right */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-1 rounded bg-blue-600 inline-block" />
                      <span className="text-blue-600">Shows</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-1 rounded bg-green-600 inline-block" />
                      <span className="text-green-600">Exhibitors</span>
                    </span>
                  </div>
                </div>
                <div className="px-8 pb-6">
                  <div className="bg-gray-50 rounded-xl shadow-inner p-6">
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart
                        data={chartDataMap[chartView]}
                        margin={{ top: 30, right: 30, left: 0, bottom: 30 }}
                      >
                        <defs>
                          <linearGradient id="showsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="exhibitorsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="4 4" />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={32}
                          tick={{ fontSize: 14, fontWeight: 600, fill: '#222' }}
                          tickFormatter={(value: string) => {
                            const monthMap: Record<string, string> = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June" };
                            if (chartView === 'month') return monthMap[value] || value;
                            return value;
                          }}
                        />
                        <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fontWeight: 500, fill: '#2563eb' }}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white rounded-lg shadow p-3 text-xs">
                                  <div className="font-bold text-base mb-1">{label}</div>
                                  {payload.map((entry, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <span className={entry.dataKey === 'Shows' ? 'text-blue-600 font-semibold' : 'text-green-600 font-semibold'}>
                                        {entry.name}:
                                      </span>
                                      <span className={entry.dataKey === 'Shows' ? 'text-blue-600 font-semibold' : 'text-green-600 font-semibold'}>
                                        {entry.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          dataKey="Shows"
                          name="Shows"
                          type="monotone"
                          fill="url(#showsGradient)"
                          stroke="#2563eb"
                          strokeWidth={2}
                        />
                        <Area
                          dataKey="Exhibitors"
                          name="Exhibitors"
                          type="monotone"
                          fill="url(#exhibitorsGradient)"
                          stroke="#22c55e"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Quick range buttons below chart */}
                  <div className="flex gap-2 bg-white rounded-full p-1 justify-center mt-6">
                    {[
                      { label: '1m', value: '1m' },
                      { label: '3m', value: '3m' },
                      { label: '6m', value: '6m' },
                      { label: 'Yr', value: 'yr' },
                      { label: 'YTD', value: 'ytd' },
                    ].map(btn => (
                      <button
                        key={btn.value}
                        onClick={() => setChartRange(btn.value as typeof chartRange)}
                        className={`px-4 py-1 rounded-full font-semibold transition
                          ${chartRange === btn.value ? 'bg-blue-600 text-white shadow' : 'text-blue-600 hover:bg-blue-200'}
                        `}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
              {/* Show Tasks Section */}
              <Card className="bg-white rounded-2xl shadow-lg p-0 w-full overflow-hidden">
                <div className="flex items-center gap-2 mb-4 px-8 pt-8 pb-4">
                  <ListChecks className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight">Show Tasks</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-6">
                  {/* To Do */}
                  <Card className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
                    <h3 className="flex items-center gap-2 font-bold text-base text-blue-600 mb-2">
                      <ClipboardList className="w-5 h-5 text-blue-600" /> To Do ({showTasks.todo.length})
                    </h3>
                    <ul className="space-y-2">
                      {showTasks.todo.map((task: DashboardTask) => (
                        <Card className="relative bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center border-l-4 border-blue-500 mb-2">
                          <div className="flex-1">
                            <span className="block text-gray-900 font-bold text-base">{task.task}</span>
                            <span className="block text-gray-500 text-sm font-medium mt-1">
                              {task.boothZone && <>Zone: {task.boothZone} | </>}
                              {task.customerName && <>Exhibitor: {task.customerName}</>}
                            </span>
                          </div>
                          <Button
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-sm hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95 transition-all duration-150"
                            onClick={() => handleAccept(task)}
                          >
                            <CheckCircle className="w-5 h-5" />
                            Accept
                          </Button>
                        </Card>
                      ))}
                    </ul>
                  </Card>
                  {/* In Progress */}
                  <Card className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
                    <h3 className="flex items-center gap-2 font-bold text-base text-yellow-600 mb-2">
                      <Activity className="w-5 h-5 text-yellow-600" /> In Progress ({showTasks.inProgress.length})
                    </h3>
                    <ul className="space-y-2">
                      {showTasks.inProgress.map((task: DashboardTask) => (
                        <Card className="relative bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center border-l-4 border-yellow-400 mb-2">
                          <div className="flex-1">
                            <span className="block text-gray-900 font-bold text-base">{task.task}</span>
                            <span className="block text-gray-500 text-sm font-medium mt-1">
                              {task.boothZone && <>Zone: {task.boothZone} | </>}
                              {task.customerName && <>Exhibitor: {task.customerName}</>}
                            </span>
                            {task.acceptedBy && (
                              <span className="block text-xs text-gray-400 mt-1">Accepted by: {task.acceptedBy}</span>
                            )}
                          </div>
                          <Button
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold shadow-sm hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 active:scale-95 transition-all duration-150"
                            onClick={() => handleMarkCompleted(task)}
                          >
                            <CheckCircle className="w-5 h-5 text-white" />
                            Mark as Completed
                          </Button>
                        </Card>
                      ))}
                    </ul>
                  </Card>
                  {/* Completed */}
                  <Card className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
                    <h3 className="flex items-center gap-2 font-bold text-base text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" /> Completed ({showTasks.completed.slice(0, 5).length})
                    </h3>
                    <ul className="space-y-2">
                      {showTasks.completed
                        .slice(0, 5)
                        .map((task: DashboardTask) => (
                          <Card className="relative bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center border-l-4 border-green-500 mb-2">
                            <div className="flex-1 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              <div>
                                <span className="block text-gray-900 font-bold text-base">{task.task}</span>
                                <span className="block text-gray-500 text-sm font-medium mt-1">
                                  {task.boothZone && <>Zone: {task.boothZone} | </>}
                                  {task.customerName && <>Exhibitor: {task.customerName}</>}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">Due: {task.due}</span>
                          </Card>
                        ))}
                    </ul>
                  </Card>
                </div>
              </Card>
            </div>
          </div>
          {/* Right: Stat Cards */}
          <div className="w-[30%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First two stat cards */}
              {stats.slice(0, 2).map((stat) => (
                <Card
                  key={stat.label}
                  className="flex items-center gap-4 p-5 rounded-xl shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow w-full"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    stat.label === "Upcoming Shows" ? "bg-blue-100 text-blue-600" :
                    stat.label === "Closed Shows" ? "bg-gray-100 text-gray-600" :
                    stat.label === "Ongoing Shows" ? "bg-green-100 text-green-600" :
                    stat.label === "Total Exhibitors" ? "bg-purple-100 text-purple-600" :
                    stat.label === "Active Locations" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {stat.icon}
                  </div>
                  <div className="w-px h-10 bg-gray-200 mx-2" />
                  <div className="flex flex-col justify-center">
                    <div className={`text-3xl font-extrabold ${
                      stat.label === "Upcoming Shows" ? "text-blue-600" :
                      stat.label === "Closed Shows" ? "text-gray-600" :
                      stat.label === "Ongoing Shows" ? "text-green-600" :
                      stat.label === "Total Exhibitors" ? "text-purple-600" :
                      stat.label === "Active Locations" ? "text-pink-600" : "text-gray-600"
                    }`}>{stat.value}</div>
                    <div className={`text-base font-semibold mt-1 ${
                      stat.label === "Upcoming Shows" ? "text-blue-600" :
                      stat.label === "Closed Shows" ? "text-gray-600" :
                      stat.label === "Ongoing Shows" ? "text-green-600" :
                      stat.label === "Total Exhibitors" ? "text-purple-600" :
                      stat.label === "Active Locations" ? "text-pink-600" : "text-gray-600"
                    }`}>{stat.label}</div>
                  </div>
                </Card>
              ))}
              {/* Ongoing Shows card, full width */}
              {stats.filter(stat => stat.label === "Ongoing Shows").map((stat) => (
                <Card
                  key={stat.label}
                  className="flex items-center justify-center gap-4 p-5 rounded-xl shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow w-full md:col-span-2"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    stat.label === "Upcoming Shows" ? "bg-blue-100 text-blue-600" :
                    stat.label === "Closed Shows" ? "bg-gray-100 text-gray-600" :
                    stat.label === "Ongoing Shows" ? "bg-green-100 text-green-600" :
                    stat.label === "Total Exhibitors" ? "bg-purple-100 text-purple-600" :
                    stat.label === "Active Locations" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {stat.icon}
                  </div>
                  <div className="w-px h-10 bg-gray-200 mx-2" />
                  <div className="flex flex-col justify-center">
                    <div className={`text-3xl font-extrabold ${
                      stat.label === "Upcoming Shows" ? "text-blue-600" :
                      stat.label === "Closed Shows" ? "text-gray-600" :
                      stat.label === "Ongoing Shows" ? "text-green-600" :
                      stat.label === "Total Exhibitors" ? "text-purple-600" :
                      stat.label === "Active Locations" ? "text-pink-600" : "text-gray-600"
                    }`}>{stat.value}</div>
                    <div className={`text-base font-semibold mt-1 ${
                      stat.label === "Upcoming Shows" ? "text-blue-600" :
                      stat.label === "Closed Shows" ? "text-gray-600" :
                      stat.label === "Ongoing Shows" ? "text-green-600" :
                      stat.label === "Total Exhibitors" ? "text-purple-600" :
                      stat.label === "Active Locations" ? "text-pink-600" : "text-gray-600"
                    }`}>{stat.label}</div>
                  </div>
                </Card>
              ))}
              {/* Remaining stat cards */}
              {stats.slice(3).map((stat) => (
                <Card
                  key={stat.label}
                  className="flex items-center gap-4 p-5 rounded-xl shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow w-full"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    stat.label === "Upcoming Shows" ? "bg-blue-100 text-blue-600" :
                    stat.label === "Closed Shows" ? "bg-gray-100 text-gray-600" :
                    stat.label === "Ongoing Shows" ? "bg-green-100 text-green-600" :
                    stat.label === "Total Exhibitors" ? "bg-purple-100 text-purple-600" :
                    stat.label === "Active Locations" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {stat.icon}
                  </div>
                  <div className="w-px h-10 bg-gray-200 mx-2" />
                  <div className="flex flex-col justify-center">
                    <div className={`text-3xl font-extrabold ${
                      stat.label === "Upcoming Shows" ? "text-blue-600" :
                      stat.label === "Closed Shows" ? "text-gray-600" :
                      stat.label === "Ongoing Shows" ? "text-green-600" :
                      stat.label === "Total Exhibitors" ? "text-purple-600" :
                      stat.label === "Active Locations" ? "text-pink-600" : "text-gray-600"
                    }`}>{stat.value}</div>
                    <div className={`text-base font-semibold mt-1 ${
                      stat.label === "Upcoming Shows" ? "text-blue-600" :
                      stat.label === "Closed Shows" ? "text-gray-600" :
                      stat.label === "Ongoing Shows" ? "text-green-600" :
                      stat.label === "Total Exhibitors" ? "text-purple-600" :
                      stat.label === "Active Locations" ? "text-pink-600" : "text-gray-600"
                    }`}>{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Show Details Card */}
            <div className="mt-6">
              <Card className="p-0 rounded-2xl shadow-lg border border-gray-100 bg-white px-8 pt-8 pb-6">
                <div className="font-extrabold text-2xl mb-6 text-blue-800 tracking-tight">Show Details</div>
                <div className="space-y-4">
                  {showsTable.map((show) => (
                    <Card
                      key={show.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 shadow-sm bg-white hover:bg-blue-50 hover:shadow-md cursor-pointer transition"
                    >
                      <div>
                        <span className={`font-bold ${show.status === "Ongoing" ? "text-green-600" : "text-blue-600"}`}>
                          {show.name}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>Location:</span>
                          <span className="ml-1">{show.location}</span>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${show.status === "Ongoing" ? "text-green-600" : "text-gray-500"}`}>{dayjs(show.date).isValid() ? dayjs(show.date).format('MM-DD-YYYY') : show.date}</div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Undo notification */}
      {undoInfo && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded shadow-lg flex items-center gap-4 z-50">
          <span>Action undone for: <span className="font-bold">{undoInfo.task.task}</span></span>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded"
            onClick={handleUndo}
          >
            Undo
          </button>
        </div>
      )}
    </MainLayout>
  );
}