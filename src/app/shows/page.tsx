"use client";

import { useState } from "react";
import MainLayout from "@/components/mainlayout/MainLayout";
import type { BreadcrumbItem } from "@/components/mainlayout/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "@/lib/motion-stub";
import { ArrowDownCircle } from "lucide-react";
import { useNavigationStore } from "@/store/navigationStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Import types and data from centralized file
import {
  ShowData,
  ProjectData,
  FacilityData,
  mockShows,
  mockProjectData,
  mockFacilityData,
} from "@/lib/mockData"; // Updated import

// Icons from Lucide React
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// REMOVE INLINE TYPES - They are now imported
// interface ShowData { ... }
// interface ProjectData { ... }
// interface FacilityData { ... }

// REMOVE INLINE MOCK DATA - It is now imported
// const mockShows: ShowData[] = [ ... ];

type SortField = keyof ShowData;
type SortDirection = "asc" | "desc" | null;

export default function ShowsPage() {
  const router = useRouter();
  const { setActiveStep } = useNavigationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("showId");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedShow, setSelectedShow] = useState<ShowData | null>(null);
  const [activeTab, setActiveTab] = useState("projectInfo");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null
  );

  // REMOVE INLINE MOCK DATA - It is now imported
  // const mockProjectData: ProjectData = { ... };
  // const mockFacilityData: FacilityData[] = [ ... ];

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

  // Filter and sort shows (using imported mockShows)
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

      return matchesSearch;
    })
    .sort((a, b) => {
      if (!sortDirection) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const handleCardExpand = (show: ShowData) => {
    setSelectedShow(show);
    setSelectedProject(null);
    setActiveStep("occurrence");
    setActiveTab("projectInfo");
  };

  const handleProjectExpand = (project: ProjectData) => {
    setSelectedProject(project);
    setActiveStep("dates");
  };

  const handleChevronClick = (
    e: React.MouseEvent<HTMLDivElement>,
    type: "show" | "project"
  ) => {
    e.stopPropagation();
    if (type === "show") {
      setSelectedShow(null);
      setSelectedProject(null);
      setActiveStep("show");
    } else {
      setSelectedProject(null);
      setActiveStep("occurrence");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const chevronVariants = {
    initial: { rotate: 0 },
    rotate: {
      rotate: 180,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Create dynamic breadcrumbs based on navigation state
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const handleShowClick = () => {
      setSelectedShow(null);
      setSelectedProject(null);
      setActiveStep("show");
      setActiveTab("projectInfo"); // Reset active tab to default
    };

    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: "Shows",
        href: "#",
        onClick: handleShowClick,
      },
    ];

    // Add Show details if selected
    if (selectedShow) {
      breadcrumbs.push({
        label: selectedShow.showName,
        href: "#",
        onClick: () => {
          setSelectedProject(null);
          setActiveStep("occurrence");
          setActiveTab("projectInfo");
        },
      });

      // Add current section based on active tab
      breadcrumbs.push({
        label: `Show Occurrences : ${getActiveTabLabel()}`,
        href: "#",
        onClick: () => {
          setSelectedProject(null);
          setActiveStep("occurrence");
          setActiveTab(activeTab); // Keep the current active tab
        },
      });

      // Add Project Facility Details if viewing project
      if (selectedProject) {
        breadcrumbs.push({
          label: "Project Facility Details",
          href: "#",
          onClick: () => {
            setActiveStep("dates");
            setActiveTab("projectInfo");
          },
        });
      }
    }

    return breadcrumbs;
  };

  // Helper function to get the active tab label
  const getActiveTabLabel = () => {
    switch (activeTab) {
      case "projectInfo":
        return "Project Details";
      case "keyDates":
        return "Key Dates";
      case "generalInfo":
        return "General Info";
      default:
        return "Project Details";
    }
  };

  // Add a function to handle navigating to the customers page
  const handleNavigateToCustomers = () => {
    if (selectedShow) {
      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        showName: selectedShow.showName,
        occrId: selectedShow.occrId
      }).toString();
      
      router.push(`/customers?${queryParams}`);
    }
  };
  console.log(selectedShow);

  return (
    <MainLayout
      breadcrumbs={getBreadcrumbs()}
    >
      <div className="space-y-6 p-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by Show ID, Name, Occurrence ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Shows Table */}
            <Card>
              <CardHeader>
              <CardTitle>Show Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        onClick={() => handleSort("showId")}
                      className="cursor-pointer text-center font-bold text-gray-900"
                      >
                      <div className="flex items-center justify-center gap-2">
                        Show ID
                        <span className="ml-1">{getSortIcon("showId")}</span>
                      </div>
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("showName")}
                      className="cursor-pointer text-center font-bold text-gray-900"
                      >
                      <div className="flex items-center justify-center gap-2">
                        Show Name
                        <span className="ml-1">{getSortIcon("showName")}</span>
                      </div>
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("occrId")}
                      className="cursor-pointer text-center font-bold text-gray-900"
                      >
                      <div className="flex items-center justify-center gap-2">
                        Occr ID
                        <span className="ml-1">{getSortIcon("occrId")}</span>
                      </div>
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("occrType")}
                      className="cursor-pointer text-center font-bold text-gray-900"
                    >
                      <div className="flex items-center justify-center gap-2">
                        Occr Type
                        <span className="ml-1">{getSortIcon("occrType")}</span>
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("marketType")}
                      className="cursor-pointer text-center font-bold text-gray-900"
                    >
                      <div className="flex items-center justify-center gap-2">
                        Market Type
                        <span className="ml-1">
                          {getSortIcon("marketType")}
                        </span>
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("projectNumber")}
                      className="cursor-pointer text-center font-bold text-gray-900"
                    >
                      <div className="flex items-center justify-center gap-2">
                        Project#
                        <span className="ml-1">
                          {getSortIcon("projectNumber")}
                        </span>
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("cityOrg")}
                      className="cursor-pointer text-center font-bold text-gray-900"
                    >
                      <div className="flex items-center justify-center gap-2">
                        City Org
                        <span className="ml-1">{getSortIcon("cityOrg")}</span>
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("yrmo")}
                      className="cursor-pointer text-center font-bold text-gray-900"
                    >
                      <div className="flex items-center justify-center gap-2">
                        YRMO
                        <span className="ml-1">{getSortIcon("yrmo")}</span>
                      </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedShows.map((show) => (
                      <TableRow
                        key={show.showId}
                        className={cn(
                          "cursor-pointer hover:bg-gray-50",
                        selectedShow?.showId === show.showId &&
                          "bg-blue-50 hover:bg-blue-50"
                      )}
                      onClick={() => handleCardExpand(show)}
                    >
                      <TableCell className="text-center">
                        {show.showId}
                      </TableCell>
                      <TableCell className="text-center">
                        {show.showName}
                      </TableCell>
                      <TableCell className="text-center">
                        {show.occrId}
                      </TableCell>
                      <TableCell className="text-center">
                          <Badge
                          variant="secondary"
                          className="bg-[#0A0C10] text-white hover:bg-[#0A0C10]/90 px-4 py-1"
                          >
                            {show.occrType}
                          </Badge>
                        </TableCell>
                      <TableCell className="text-center">
                        {show.marketType}
                      </TableCell>
                      <TableCell className="text-center">
                        {show.projectNumber}
                      </TableCell>
                      <TableCell className="text-center">
                        {show.cityOrg}
                      </TableCell>
                      <TableCell className="text-center">{show.yrmo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          {/* Show Occurrences Section */}
          <AnimatePresence>
            {selectedShow && (
              <div className="relative" style={{ marginTop: "-40px" }}>
                {/* Container for first chevron */}
                <div className="relative h-10 mb-6 mt-2">
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => handleChevronClick(e, "show")}
                    initial="initial"
                    animate="rotate"
                    variants={chevronVariants}
                  >
                    <div className="p-3">
                      <ArrowDownCircle className="h-8 w-8 text-blue-600 bg-white rounded-full shadow-sm" />
                    </div>
                  </motion.div>
                </div>

                {/* Show Occurrences Card */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={cardVariants}
                >
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Show Occurrences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Section 1: Show */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-gray-900">
                            Show
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="font-bold text-gray-900">
                              Show Name
                            </Label>
                            <Input value={selectedShow.showName} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-bold text-gray-900">
                              Show ID
                            </Label>
                            <Input value={selectedShow.showId} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-bold text-gray-900">
                              Description
                            </Label>
                            <Input />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Section 2: Show Details */}
                      <div className="space-y-6">
                        {/* Section 2.1: Show Occurrence */}
                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900">
                              Show Occurrence
                            </CardTitle>
                </CardHeader>
                          <CardContent className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                YRMO
                              </Label>
                              <Input value={selectedShow.yrmo} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Occr Type
                              </Label>
                              <Input value={selectedShow.occrType} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Market Type
                              </Label>
                              <Input value={selectedShow.marketType} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Status
                              </Label>
                              <Input />
                            </div>
                            <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Occr ID
                              </Label>
                              <Input value={selectedShow.occrId} readOnly />
                            </div>
                            <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Event City
                              </Label>
                              <Input />
                            </div>
                        <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Pricing Loc
                              </Label>
                              <Input />
                        </div>
                        <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                City Org
                              </Label>
                              <Input value={selectedShow.cityOrg} readOnly />
                        </div>
                        <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Occr Desc
                              </Label>
                              <Input />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Section 2.2: Show Dates */}
                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900">
                              Show Dates
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Open
                              </Label>
                              <Input type="datetime-local" />
                        </div>
                        <div className="space-y-2">
                              <Label className="font-bold text-gray-900">
                                Close
                              </Label>
                              <Input type="datetime-local" />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Section 2.3: Timezone and Customers */}
                        <Card className="shadow-sm">
                          <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex-1 space-y-2">
                              <Label className="font-bold text-gray-900">
                                Timezone
                              </Label>
                              <Input placeholder="Enter timezone" />
                        </div>
                            <Button 
                              className="bg-blue-600 text-white hover:bg-blue-700 px-6 h-10 mt-8"
                              onClick={handleNavigateToCustomers}
                              disabled={!selectedShow}
                            >
                              Customers
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Section 3: Tabs */}
                      <Card className="shadow-sm">
                        <CardContent className="pt-6">
                          <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent">
                              <TabsTrigger
                                value="projectInfo"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-100 hover:bg-gray-200"
                              >
                                Project Info
                              </TabsTrigger>
                              <TabsTrigger
                                value="keyDates"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-100 hover:bg-gray-200"
                              >
                                Key Dates
                              </TabsTrigger>
                              <TabsTrigger
                                value="generalInfo"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-100 hover:bg-gray-200"
                              >
                                General Info
                              </TabsTrigger>
                            </TabsList>

                            {/* Project Info Tab */}
                            <TabsContent
                              value="projectInfo"
                              className="space-y-6"
                            >
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="font-bold text-gray-900">
                                      Project Name
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Project Number
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Project Type
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Status
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Production City
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Facility ID
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() =>
                                      handleProjectExpand(mockProjectData)
                                    }
                                  >
                                    <TableCell>
                                      {mockProjectData.projectName}
                                    </TableCell>
                                    <TableCell>
                                      {mockProjectData.projectNumber}
                                    </TableCell>
                                    <TableCell>
                                      {mockProjectData.projectType}
                                    </TableCell>
                                    <TableCell>
                                      {mockProjectData.status}
                                    </TableCell>
                                    <TableCell>
                                      {mockProjectData.productionCity}
                                    </TableCell>
                                    <TableCell>
                                      {mockProjectData.facilityId}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                              <div className="flex justify-end gap-4">
                                <Button
                                  className="bg-blue-600 text-white hover:bg-blue-700 px-6"
                                  onClick={() =>
                                    handleProjectExpand(mockProjectData)
                                  }
                                >
                                  Project Facilities
                                </Button>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6">
                                  Key Contacts
                                </Button>
                              </div>
                            </TabsContent>

                            {/* Key Dates Tab */}
                            <TabsContent value="keyDates" className="space-y-6">
                              <div className="flex items-center gap-4">
                                <Label className="font-bold text-gray-900">
                                  Show Dates for
                                </Label>
                                <Select>
                                  <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select dates" />
                            </SelectTrigger>
                            <SelectContent>
                                    <SelectItem value="option1">
                                      Option 1
                              </SelectItem>
                                    <SelectItem value="option2">
                                      Option 2
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="font-bold text-gray-900">
                                      Date Type
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Project Number
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Facility ID
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Date/time
                                    </TableHead>
                                    <TableHead className="font-bold text-gray-900">
                                      Notes
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TabsContent>

                            {/* General Info Tab */}
                            <TabsContent
                              value="generalInfo"
                              className="space-y-8"
                            >
                              {/* Section 3.3.1: Exh Total Sq Ft */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900">
                                  Exh Total Sq Ft
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Projected
                                    </Label>
                                    <Input />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Actual
                                    </Label>
                                    <Input />
                                  </div>
                                </div>
                              </div>

                              {/* Section 3.3.2: Exh Freight */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900">
                                  Exh Freight
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Projected
                                    </Label>
                                    <Input />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Actual
                                    </Label>
                                    <Input />
                                  </div>
                                </div>
                              </div>

                              {/* Section 3.3.3: Graphics Sq Ft */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900">
                                  Graphics Sq Ft
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Projected
                                    </Label>
                                    <Input />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Actual
                                    </Label>
                                    <Input />
                                  </div>
                                </div>
                              </div>

                              {/* Section 3.3.4: Other Details */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900">
                                  Other Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="flooring" />
                                    <Label
                                      htmlFor="flooring"
                                      className="font-bold text-gray-900"
                                    >
                                      Flooring Mandatory
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="targeted" />
                                    <Label
                                      htmlFor="targeted"
                                      className="font-bold text-gray-900"
                                    >
                                      Targeted Show
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="marshalling" />
                                    <Label
                                      htmlFor="marshalling"
                                      className="font-bold text-gray-900"
                                    >
                                      Marshalling
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="rtw" />
                                    <Label
                                      htmlFor="rtw"
                                      className="font-bold text-gray-900"
                                    >
                                      No RTW
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="ops" />
                                    <Label
                                      htmlFor="ops"
                                      className="font-bold text-gray-900"
                                    >
                                      Natl Ops Team
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="design" />
                                    <Label
                                      htmlFor="design"
                                      className="font-bold text-gray-900"
                                    >
                                      Design Collaboration
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="clean" />
                                    <Label
                                      htmlFor="clean"
                                      className="font-bold text-gray-900"
                                    >
                                      Clean Floor Policy
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="booth" />
                                    <Label
                                      htmlFor="booth"
                                      className="font-bold text-gray-900"
                                    >
                                      Show Org Booth Pkg
                                    </Label>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="font-bold text-gray-900">
                                    Tier Pricing
                                  </Label>
                                  <Input />
                                </div>
                              </div>

                              {/* Section 3.3.5: Comments */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900">
                                  Comments
                                </h4>
                                <div className="space-y-2">
                                  <Label className="font-bold text-gray-900">
                                    Freight Info
                                  </Label>
                                  <Textarea className="min-h-[100px]" />
                                </div>
                              </div>

                              {/* Section 3.3.6: Show Package */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-900">
                                  Show Package
                                </h4>
                                <div className="space-y-4">
                                  <Textarea className="min-h-[100px]" />
                                  <div className="space-y-4">
                        <div className="space-y-2">
                                      <Label className="font-bold text-gray-900">
                                        Specify Logo
                                      </Label>
                                      <Input />
                        </div>
                        <div className="space-y-2">
                                      <Label className="font-bold text-gray-900">
                                        Send Exhibitor Survey
                                      </Label>
                                      <Input />
                                    </div>
                                  </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
                    </CardContent>
                  </Card>

                  {/* Project Facility Details Section */}
                  <AnimatePresence>
                    {selectedProject && (
                      <div
                        className="relative mt-6"
                        style={{ marginTop: "-55px" }}
                      >
                        {/* Container for second chevron */}
                        <div className="relative h-10 my-6">
                          <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => handleChevronClick(e, "project")}
                            initial="initial"
                            animate="rotate"
                            variants={chevronVariants}
                          >
                            <div className="p-3">
                              <ArrowDownCircle className="h-8 w-8 text-blue-600 bg-white rounded-full shadow-sm" />
                            </div>
                          </motion.div>
                        </div>

                        {/* Project Facility Details Card */}
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={cardVariants}
                        >
                          <Card className="shadow-sm">
                            <CardHeader>
                              <CardTitle>Project Facility Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Section 1: Project */}
                              <Card className="shadow-sm">
                                <CardHeader>
                                  <CardTitle className="text-lg font-bold text-gray-900">
                                    Project
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Project Number
                                    </Label>
                                    <Input
                                      value={selectedProject.projectNumber}
                                      readOnly
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Project Name
                                    </Label>
                                    <Input
                                      value={selectedProject.projectName}
                                      readOnly
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Section 2: Registration and Table */}
                              <Card className="shadow-sm">
                                <CardContent className="space-y-6 pt-6">
                                  <div className="flex justify-end">
                                    <Label className="font-bold text-gray-900">
                                      Registration:
                                    </Label>
                                    <span className="ml-2">
                                      ----------------Servicecenter(TM)----------------
                                    </span>
                                  </div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="font-bold text-gray-900 text-center">
                                          Facility ID
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-900 text-center">
                                          Facility Name
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-900 text-center">
                                          Hall
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-900 text-center">
                                          Location
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-900 text-center">
                                          Location
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-900 text-center">
                                          Area Code
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-900 text-center">
                                          Phone
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {mockFacilityData.map((facility) => (
                                        <TableRow key={facility.facilityId}>
                                          <TableCell className="text-center">
                                            {facility.facilityId}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {facility.facilityName}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {facility.hall}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {facility.location1}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {facility.location2}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {facility.areaCode}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {facility.phone}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>

                              {/* Section 3: Notes and Comments */}
                              <Card className="shadow-sm">
                                <CardContent className="grid grid-cols-3 gap-6 pt-6">
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Notes
                                    </Label>
                                    <Input placeholder="Enter notes" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Comments
                                    </Label>
                                    <Input placeholder="Enter comments" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-bold text-gray-900">
                                      Special Instructions
                                    </Label>
                                    <Input placeholder="Enter special instructions" />
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Action Buttons */}
                              <div className="flex justify-between items-center pt-4">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6">
                                  Auto-Out
                                </Button>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6">
                                  Details
                                </Button>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6">
                                  Schedule
                                </Button>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6">
                                  Material Handling
                                </Button>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6">
                                  Vendor Info
                                </Button>
                              </div>
                </CardContent>
              </Card>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
