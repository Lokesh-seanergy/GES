"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/mainlayout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Icons from Lucide React
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";

// Types
interface ShowData {
  showId: string;
  showName: string;
  occrId: string;
  occrType: string;
  marketType: string;
  projectNumber: string;
  cityOrg: string;
  yrmo: string;
}

// Mock data
const mockShows: ShowData[] = [
  {
    showId: "AWS23",
    showName: "AWS re:Invent 2024",
    occrId: "AWS23-LV",
    occrType: "Annual Conference",
    marketType: "Cloud & Enterprise",
    projectNumber: "P2024-001",
    cityOrg: "Las Vegas, NV",
    yrmo: "2024-11",
  },
  {
    showId: "MSFT24",
    showName: "Microsoft Build 2024",
    occrId: "BUILD24-SEA",
    occrType: "Developer Conference",
    marketType: "Software Development",
    projectNumber: "P2024-002",
    cityOrg: "Seattle, WA",
    yrmo: "2024-05",
  },
  {
    showId: "GGL24",
    showName: "Google I/O 2024",
    occrId: "IO24-SF",
    occrType: "Developer Conference",
    marketType: "Technology",
    projectNumber: "P2024-003",
    cityOrg: "San Francisco, CA",
    yrmo: "2024-05",
  },
  {
    showId: "WWDC24",
    showName: "Apple WWDC 2024",
    occrId: "WWDC24-CUP",
    occrType: "Developer Conference",
    marketType: "Software & Hardware",
    projectNumber: "P2024-004",
    cityOrg: "Cupertino, CA",
    yrmo: "2024-06",
  },
  {
    showId: "CES24",
    showName: "CES 2024",
    occrId: "CES24-LV",
    occrType: "Trade Show",
    marketType: "Consumer Electronics",
    projectNumber: "P2024-005",
    cityOrg: "Las Vegas, NV",
    yrmo: "2024-01",
  },
];

type SortField = keyof ShowData;
type SortDirection = "asc" | "desc" | null;

export default function ShowsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortField, setSortField] = useState<SortField>("showId");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedShow, setSelectedShow] = useState<ShowData | null>(null);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    if (sortDirection === "asc")
      return <ArrowUp className="h-4 w-4 text-blue-500" />;
    if (sortDirection === "desc")
      return <ArrowDown className="h-4 w-4 text-blue-500" />;
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  };

  // Filter and sort shows
  const filteredAndSortedShows = [...mockShows]
    .filter((show) => {
      const searchFields = [
        show.showId,
        show.showName,
        show.occrId,
        show.occrType,
        show.marketType,
        show.projectNumber,
        show.cityOrg,
        show.yrmo,
      ].map((field) => field.toLowerCase());

      const matchesSearch = searchFields.some((field) =>
        field.includes(searchQuery.toLowerCase())
      );

      if (filterType === "all") return matchesSearch;
      return (
        matchesSearch &&
        show.occrType.toLowerCase().includes(filterType.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortDirection) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  // Handle show selection
  const handleShowClick = (show: ShowData) => {
    setSelectedShow({ ...show });
  };

  // Handle input changes
  const handleInputChange = (field: keyof ShowData, value: string) => {
    if (selectedShow) {
      setSelectedShow({
        ...selectedShow,
        [field]: value,
      });
    }
  };

  // Close details panel
  const handleCloseDetails = () => {
    setSelectedShow(null);
  };

  // Reset selected show when search or filter changes
  useEffect(() => {
    setSelectedShow(null);
  }, [searchQuery, filterType]);

  return (
    <MainLayout breadcrumbs={[{ label: "Shows" }]}>
      <div className="space-y-6 p-6">
        {/* Title */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Show Information</h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-none shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by Show ID, Name, Occurrence ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("conference")}>
                    Conferences
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("trade show")}>
                    Trade Shows
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shows Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Show Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        onClick={() => handleSort("showId")}
                        className="cursor-pointer"
                      >
                        Show ID {getSortIcon("showId")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("showName")}
                        className="cursor-pointer"
                      >
                        Show Name {getSortIcon("showName")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("occrId")}
                        className="cursor-pointer"
                      >
                        Occurrence ID {getSortIcon("occrId")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("occrType")}
                        className="cursor-pointer"
                      >
                        Type {getSortIcon("occrType")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedShows.map((show) => (
                      <TableRow
                        key={show.showId}
                        className={cn(
                          "cursor-pointer hover:bg-gray-50",
                          selectedShow?.showId === show.showId && "bg-blue-50"
                        )}
                        onClick={() => handleShowClick(show)}
                      >
                        <TableCell>{show.showId}</TableCell>
                        <TableCell>{show.showName}</TableCell>
                        <TableCell>{show.occrId}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              show.occrType.toLowerCase().includes("conference")
                                ? "default"
                                : "secondary"
                            }
                          >
                            {show.occrType}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Show Details */}
          <div className="lg:col-span-1">
            {selectedShow ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Show Details
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseDetails}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="info">Show Info</TabsTrigger>
                      <TabsTrigger value="occurrences">
                        Show Occurrences
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Show ID</Label>
                          <Input
                            value={selectedShow.showId}
                            onChange={(e) =>
                              handleInputChange("showId", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Show Name</Label>
                          <Input
                            value={selectedShow.showName}
                            onChange={(e) =>
                              handleInputChange("showName", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Market Type</Label>
                          <Input
                            value={selectedShow.marketType}
                            onChange={(e) =>
                              handleInputChange("marketType", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Project Number</Label>
                          <Input
                            value={selectedShow.projectNumber}
                            onChange={(e) =>
                              handleInputChange("projectNumber", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="occurrences">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Occurrence ID</Label>
                          <Input
                            value={selectedShow.occrId}
                            onChange={(e) =>
                              handleInputChange("occrId", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Occurrence Type</Label>
                          <Select
                            value={selectedShow.occrType}
                            onValueChange={(value) =>
                              handleInputChange("occrType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Annual Conference">
                                Annual Conference
                              </SelectItem>
                              <SelectItem value="Developer Conference">
                                Developer Conference
                              </SelectItem>
                              <SelectItem value="Trade Show">
                                Trade Show
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            value={selectedShow.cityOrg}
                            onChange={(e) =>
                              handleInputChange("cityOrg", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year/Month</Label>
                          <Input
                            value={selectedShow.yrmo}
                            onChange={(e) =>
                              handleInputChange("yrmo", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Select a show to view details
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
