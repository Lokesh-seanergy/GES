import MainLayout from "@/components/mainlayout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
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
            <h3 className="text-4xl font-bold">04</h3>
            <p className="text-sm text-gray-500">Ongoing Shows</p>
          </div>
        </div>

        {/* Total Exhibits */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-yellow-50 rounded-full p-3 mr-4">
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
              className="text-yellow-500"
            >
              <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
              <path d="M16.5 9.4 7.55 4.24"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-4xl font-bold">256</h3>
            <p className="text-sm text-gray-500">Total Exhibits</p>
          </div>
        </div>

        {/* Active Locations */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-pink-50 rounded-full p-3 mr-4">
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
              className="text-pink-500"
            >
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h3 className="text-4xl font-bold">08</h3>
            <p className="text-sm text-gray-500">Active Locations</p>
          </div>
        </div>
      </div>

      {/* Shows Table Section */}
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
                {[...Array(4)].map((_, index) => (
                  <TableRow key={index} className="border-t border-blue-100">
                    <TableCell className="font-medium text-gray-700 py-4 px-6">
                      #{index % 2 === 0 ? "VU32963" : "VU11563"}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      {index % 2 === 0
                        ? "Consumer Electronics Show 2023J"
                        : "ProMak Manufacturing Show"}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      Apr 09, 2025
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      {index % 2 === 0 ? "Las Vegas, NV" : "Chicago, IL"}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          index % 2 === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {index % 2 === 0 ? "Upcoming" : "Ongoing"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <button className="text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-between items-center px-6 py-4 text-sm border-t">
          <div>SHOWING 10 OF 15 RESULTS</div>
          <div className="flex space-x-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
