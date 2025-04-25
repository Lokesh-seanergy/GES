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
import { useState } from "react";

export default function DashboardPage() {
  // This will automatically redirect to login if not authenticated
  useAuthProtection();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Mock data for upcoming and ongoing shows
  const shows = [
    {
      id: "VU32963",
      name: "Consumer Electronics Show 2023J",
      date: "Apr 09, 2025",
      location: "Las Vegas, NV",
      status: "Upcoming",
    },
    {
      id: "VU11563",
      name: "ProMak Manufacturing Show",
      date: "Apr 09, 2025",
      location: "Chicago, IL",
      status: "Ongoing",
    },
    {
      id: "VU32964",
      name: "Tech Expo 2023",
      date: "May 15, 2025",
      location: "San Francisco, CA",
      status: "Upcoming",
    },
    {
      id: "VU11564",
      name: "Industrial Automation Show",
      date: "May 20, 2025",
      location: "Detroit, MI",
      status: "Ongoing",
    },
    {
      id: "VU32965",
      name: "Digital Marketing Conference",
      date: "Jun 01, 2025",
      location: "New York, NY",
      status: "Upcoming",
    },
    {
      id: "VU11565",
      name: "Healthcare Innovation Summit",
      date: "Jun 10, 2025",
      location: "Boston, MA",
      status: "Ongoing",
    },
  ];

  // Paginate shows
  const paginatedShows = shows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Upcoming Shows */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-blue-50 rounded-full p-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <h3 className="text-4xl font-bold">24</h3>
            <p className="text-sm text-gray-500">Upcoming Shows</p>
          </div>
        </div>

        {/* Ongoing Shows */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-green-50 rounded-full p-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-4xl font-bold">12</h3>
            <p className="text-sm text-gray-500">Ongoing Shows</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-purple-50 rounded-full p-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-500"
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-4xl font-bold">$1.2M</h3>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-orange-50 rounded-full p-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <h3 className="text-4xl font-bold">1,234</h3>
            <p className="text-sm text-gray-500">Active Customers</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg shadow mb-8 bg-white">
        <div className="flex flex-row items-center justify-between p-6">
          <h2 className="text-lg font-semibold">UPCOMING & ONGOING SHOWS</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
            <span className="mr-1">+</span> New Show
          </button>
        </div>

        <div className="p-4">
          <div className="rounded-lg overflow-hidden border border-blue-100">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-blue-100/80">
                  <TableHead className="font-medium text-gray-700 py-4 px-6">
                    SHOW ID
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 py-4 px-6">
                    SHOW NAME
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 py-4 px-6">
                    OCCURRENCE DATE
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 py-4 px-6">
                    LOCATION
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 py-4 px-6">
                    STATUS
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 py-4 px-6">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {paginatedShows.map((show) => (
                  <TableRow key={show.id} className="border-t border-blue-100">
                    <TableCell className="font-medium text-gray-700 py-4 px-6">
                      #{show.id}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      {show.name}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      {show.date}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      {show.location}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          show.status === "Upcoming"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {show.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <button className="text-blue-600 hover:text-blue-800">
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              totalPages={Math.ceil(shows.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
