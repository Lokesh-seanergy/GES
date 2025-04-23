"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft } from "lucide-react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { create } from "zustand";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ShowData {
  id: string;
  name: string;
  occrId: string;
  occrType: string;
  marketType: string;
  project: string;
  cityOrg: string;
  yrmo: string;
}

interface ProjectData {
  projectName: string;
  projectNumber: string;
  projectType: string;
  status: string;
  productionCity: string;
  facilityId: string;
}

interface FacilityData {
  facilityId: string;
  facilityName: string;
  hall: string;
  location1: string;
  location2: string;
  areaCode: string;
  phone: string;
}

type SortField =
  | "id"
  | "name"
  | "occrId"
  | "occrType"
  | "marketType"
  | "project"
  | "cityOrg"
  | "yrmo";
type SortDirection = "asc" | "desc";

// Basic store for search
interface SearchState {
  query: string;
  setQuery: (query: string) => void;
}

const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));

// Debounce hook
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Mock data
const mockShows: ShowData[] = [
  {
    id: "AWS23",
    name: "AWS re:Invent 2024",
    occrId: "AWS23-LV",
    occrType: "Annual Conference",
    marketType: "Cloud & Enterprise",
    project: "P2024-001",
    cityOrg: "Las Vegas, NV",
    yrmo: "2024-11",
  },
  {
    id: "CES24",
    name: "CES 2024",
    occrId: "CES24-LV",
    occrType: "Trade Show",
    marketType: "Consumer Electronics",
    project: "P2024-005",
    cityOrg: "Las Vegas, NV",
    yrmo: "2024-01",
  },
  {
    id: "GGL24",
    name: "Google I/O 2024",
    occrId: "IO24-SF",
    occrType: "Developer Conference",
    marketType: "Technology",
    project: "P2024-003",
    cityOrg: "San Francisco, CA",
    yrmo: "2024-05",
  },
  {
    id: "MSFT24",
    name: "Microsoft Build 2024",
    occrId: "BUILD24-SEA",
    occrType: "Developer Conference",
    marketType: "Software Development",
    project: "P2024-002",
    cityOrg: "Seattle, WA",
    yrmo: "2024-05",
  },
  {
    id: "WWDC24",
    name: "Apple WWDC 2024",
    occrId: "WWDC24-CUP",
    occrType: "Developer Conference",
    marketType: "Software & Hardware",
    project: "P2024-004",
    cityOrg: "Cupertino, CA",
    yrmo: "2024-06",
  },
];

const mockProjectData: ProjectData = {
  projectName: "Trade Show Setup 2024",
  projectNumber: "P2024-001",
  projectType: "Exhibition",
  status: "Active",
  productionCity: "Las Vegas",
  facilityId: "LV001",
};

const mockFacilityData: FacilityData[] = [
  {
    facilityId: "F001",
    facilityName: "Main Exhibition Hall",
    hall: "Hall A",
    location1: "North Wing",
    location2: "Level 1",
    areaCode: "702",
    phone: "555-0101",
  },
  {
    facilityId: "F002",
    facilityName: "Conference Center",
    hall: "Hall B",
    location1: "South Wing",
    location2: "Level 2",
    areaCode: "702",
    phone: "555-0102",
  },
];

// Main component
export default function ShowsPage() {
  // Search state
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText);
  const { setQuery } = useSearchStore();

  // Sort state
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Update search store with debounced value
  useEffect(() => {
    setQuery(debouncedSearch);
  }, [debouncedSearch, setQuery]);

  // Search handlers
  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  // Filtered and sorted shows
  const [shows, setShows] = useState<ShowData[]>(mockShows);
  const [selectedShow, setSelectedShow] = useState<ShowData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isNewShowOpen, setIsNewShowOpen] = useState(false);
  const [isNewOccrOpen, setIsNewOccrOpen] = useState(false);
  const [newShow, setNewShow] = useState({
    id: "",
    name: "",
    occrId: "",
    occrType: "",
    marketType: "",
    project: "",
    cityOrg: "",
    yrmo: "",
  });

  const [newOccr, setNewOccr] = useState({
    showId: "",
    occrId: "",
    occrType: "",
    description: "",
    open: "",
    close: "",
    timezone: "",
    projectNumber: "",
    facilityId: "",
  });

  const filteredAndSortedShows = useMemo(() => {
    return [...shows]
      .filter((show) => {
        if (!debouncedSearch) return true;

        const searchFields = [
          show.id,
          show.name,
          show.occrId,
          show.occrType,
          show.marketType,
          show.project,
          show.cityOrg,
          show.yrmo,
        ].map((field) => field.toLowerCase());

        const searchTerms = debouncedSearch.toLowerCase().split(" ");
        return searchTerms.every((term) =>
          searchFields.some((field) => field.includes(term))
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
  }, [debouncedSearch, sortField, sortDirection, shows]);

  // Sort handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const toggleNewShow = () => {
    setIsNewShowOpen(!isNewShowOpen);
    if (isNewOccrOpen) setIsNewOccrOpen(false);
  };

  const toggleNewOccr = () => {
    setIsNewOccrOpen(!isNewOccrOpen);
    if (isNewShowOpen) setIsNewShowOpen(false);
  };

  const handleNewShowChange =
    (field: keyof typeof newShow) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewShow((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleNewOccrChange =
    (field: keyof typeof newOccr) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewOccr((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const createShow = () => {
    setShows((prev) => [
      ...prev,
      {
        id: newShow.id,
        name: newShow.name,
        occrId: newShow.occrId,
        occrType: newShow.occrType,
        marketType: newShow.marketType,
        project: newShow.project,
        cityOrg: newShow.cityOrg,
        yrmo: newShow.yrmo,
      },
    ]);
    setNewShow({
      id: "",
      name: "",
      occrId: "",
      occrType: "",
      marketType: "",
      project: "",
      cityOrg: "",
      yrmo: "",
    });
    setIsNewShowOpen(false);
  };

  const createOccr = () => {
    // Here you would typically update both the shows and occurrences
    // For now, we'll just close the form
    setNewOccr({
      showId: "",
      occrId: "",
      occrType: "",
      description: "",
      open: "",
      close: "",
      timezone: "",
      projectNumber: "",
      facilityId: "",
    });
    setIsNewOccrOpen(false);
  };

  // Handle show selection for editing
  const handleShowSelect = (show: ShowData) => {
    setSelectedShow(show);
  };

  // Delete show
  const handleDeleteShow = (show: ShowData) => {
    setSelectedShow(show);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedShow) return;

    setShows((prevShows) =>
      prevShows.filter((show) => show.id !== selectedShow.id)
    );
    setShowDeleteDialog(false);
    setSelectedShow(null);
  };

  const [activeTab, setActiveTab] = useState("projectInfo");

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Shows : Show Information", href: "/shows" },
      ]}
      breadcrumbClassName="text-lg py-4 bg-gray-50 border-b border-gray-200"
    >
      <div className="h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex h-full">
          {/* Master View (Show Information) */}
          <motion.div
            className={cn(
              "bg-white border-r border-gray-200",
              selectedShow ? "w-1/4" : "w-full"
            )}
            initial={false}
            animate={{
              width: selectedShow ? "25%" : "100%",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
          >
            <div
              className={cn(
                "h-full overflow-y-auto",
                selectedShow ? "p-3" : "p-6"
              )}
            >
              <div className="space-y-4">
                {!selectedShow && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <SearchBar
                          placeholder="Search by Show ID, Show Name, Market Type, etc."
                          value={searchText}
                          onChange={handleSearchChange}
                          onClear={clearSearch}
                        />
                      </div>
                      <Button variant="outline" className="gap-2">
                        <span>Filters</span>
                      </Button>
                      <Button
                        className={cn(
                          "gap-2",
                          isNewShowOpen
                            ? "bg-gray-600 hover:bg-gray-700"
                            : "bg-blue-600 hover:bg-blue-700",
                          "text-white"
                        )}
                        onClick={toggleNewShow}
                      >
                        <Plus
                          className={`h-4 w-4 transition-transform ${
                            isNewShowOpen ? "rotate-45" : ""
                          }`}
                        />
                        <span>New Show</span>
                      </Button>
                      <Button
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={toggleNewOccr}
                      >
                        <Plus
                          className={`h-4 w-4 transition-transform ${
                            isNewOccrOpen ? "rotate-45" : ""
                          }`}
                        />
                        <span>New Occr</span>
                      </Button>
                    </div>

                    {/* New Show Form */}
                    {isNewShowOpen && (
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle>New Show</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Show ID
                              </Label>
                              <Input
                                placeholder="Enter showId"
                                className="h-9"
                                value={newShow.id}
                                onChange={handleNewShowChange("id")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Show Name
                              </Label>
                              <Input
                                placeholder="Enter showName"
                                className="h-9"
                                value={newShow.name}
                                onChange={handleNewShowChange("name")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Occr ID
                              </Label>
                              <Input
                                placeholder="Enter occrId"
                                className="h-9"
                                value={newShow.occrId}
                                onChange={handleNewShowChange("occrId")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Occr Type
                              </Label>
                              <Input
                                placeholder="Enter occrType"
                                className="h-9"
                                value={newShow.occrType}
                                onChange={handleNewShowChange("occrType")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Market Type
                              </Label>
                              <Input
                                placeholder="Enter marketType"
                                className="h-9"
                                value={newShow.marketType}
                                onChange={handleNewShowChange("marketType")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Project Number
                              </Label>
                              <Input
                                placeholder="Enter projectNumber"
                                className="h-9"
                                value={newShow.project}
                                onChange={handleNewShowChange("project")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                City Org
                              </Label>
                              <Input
                                placeholder="Enter cityOrg"
                                className="h-9"
                                value={newShow.cityOrg}
                                onChange={handleNewShowChange("cityOrg")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                YRMO
                              </Label>
                              <Input
                                placeholder="Enter yrmo"
                                className="h-9"
                                value={newShow.yrmo}
                                onChange={handleNewShowChange("yrmo")}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-4 mt-6">
                            <Button variant="outline" onClick={toggleNewShow}>
                              Cancel
                            </Button>
                            <Button
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              onClick={createShow}
                            >
                              Create Show
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* New Occr Form */}
                    {isNewOccrOpen && (
                      <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle>New Occurrence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Show ID
                              </Label>
                              <Input
                                placeholder="Enter showId"
                                className="h-9"
                                value={newOccr.showId}
                                onChange={handleNewOccrChange("showId")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Occr ID
                              </Label>
                              <Input
                                placeholder="Enter occrId"
                                className="h-9"
                                value={newOccr.occrId}
                                onChange={handleNewOccrChange("occrId")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Occr Type
                              </Label>
                              <Input
                                placeholder="Enter occrType"
                                className="h-9"
                                value={newOccr.occrType}
                                onChange={handleNewOccrChange("occrType")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Description
                              </Label>
                              <Input
                                placeholder="Enter description"
                                className="h-9"
                                value={newOccr.description}
                                onChange={handleNewOccrChange("description")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Open
                              </Label>
                              <Input
                                type="datetime-local"
                                className="h-9"
                                value={newOccr.open}
                                onChange={handleNewOccrChange("open")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Close
                              </Label>
                              <Input
                                type="datetime-local"
                                className="h-9"
                                value={newOccr.close}
                                onChange={handleNewOccrChange("close")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Timezone
                              </Label>
                              <Input
                                placeholder="Enter timezone"
                                className="h-9"
                                value={newOccr.timezone}
                                onChange={handleNewOccrChange("timezone")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Project Number
                              </Label>
                              <Input
                                placeholder="Enter projectNumber"
                                className="h-9"
                                value={newOccr.projectNumber}
                                onChange={handleNewOccrChange("projectNumber")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Facility ID
                              </Label>
                              <Input
                                placeholder="Enter facilityId"
                                className="h-9"
                                value={newOccr.facilityId}
                                onChange={handleNewOccrChange("facilityId")}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-4 mt-6">
                            <Button variant="outline" onClick={toggleNewOccr}>
                              Cancel
                            </Button>
                            <Button
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              onClick={createOccr}
                            >
                              Create Occurrence
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {/* Shows Table */}
                <Card
                  className={cn(
                    "shadow-sm",
                    selectedShow && "border-0 shadow-none"
                  )}
                >
                  <CardHeader
                    className={cn(
                      "pb-0",
                      selectedShow ? "px-2 py-2" : "px-4 py-3"
                    )}
                  >
                    <CardTitle
                      className={cn(
                        "flex items-center justify-between",
                        selectedShow
                          ? "text-sm font-medium"
                          : "text-base font-semibold"
                      )}
                    >
                      Show Information
                      {selectedShow && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedShow(null)}
                          className="h-7 w-7 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    className={cn("px-0", selectedShow ? "py-2" : "py-3")}
                  >
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-gray-50 sticky top-0">
                          <TableRow className="border-b border-gray-200">
                            <TableHead
                              className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                              onClick={() => handleSort("id")}
                            >
                              <div className="flex items-center justify-center gap-2">
                                Show ID {getSortIcon("id")}
                              </div>
                            </TableHead>
                            {!selectedShow && (
                              <>
                                <TableHead
                                  className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                  onClick={() => handleSort("name")}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    Show Name {getSortIcon("name")}
                                  </div>
                                </TableHead>
                              </>
                            )}
                            <TableHead
                              className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                              onClick={() => handleSort("occrId")}
                            >
                              <div className="flex items-center justify-center gap-2">
                                Occr ID {getSortIcon("occrId")}
                              </div>
                            </TableHead>
                            {!selectedShow && (
                              <>
                                <TableHead
                                  className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                  onClick={() => handleSort("occrType")}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    Occr Type {getSortIcon("occrType")}
                                  </div>
                                </TableHead>
                                <TableHead
                                  className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                  onClick={() => handleSort("marketType")}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    Market Type {getSortIcon("marketType")}
                                  </div>
                                </TableHead>
                                <TableHead
                                  className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                  onClick={() => handleSort("project")}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    Project# {getSortIcon("project")}
                                  </div>
                                </TableHead>
                                <TableHead
                                  className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                  onClick={() => handleSort("cityOrg")}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    City Org {getSortIcon("cityOrg")}
                                  </div>
                                </TableHead>
                                <TableHead
                                  className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                  onClick={() => handleSort("yrmo")}
                                >
                                  <div className="flex items-center justify-center gap-2">
                                    YRMO {getSortIcon("yrmo")}
                                  </div>
                                </TableHead>
                                <TableHead className="text-sm font-semibold text-gray-700 px-4 py-3">
                                  <div className="flex items-center justify-center">
                                    Actions
                                  </div>
                                </TableHead>
                              </>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSortedShows.map((show) => (
                            <TableRow
                              key={show.id}
                              className={cn(
                                "cursor-pointer hover:bg-gray-50",
                                selectedShow?.id === show.id &&
                                  "bg-blue-50 hover:bg-blue-50"
                              )}
                              onClick={() => handleShowSelect(show)}
                            >
                              <TableCell className="text-center py-2 px-4">
                                {show.id}
                              </TableCell>
                              {!selectedShow && (
                                <TableCell className="text-center py-2 px-4">
                                  {show.name}
                                </TableCell>
                              )}
                              <TableCell className="text-center py-2 px-4">
                                {show.occrId}
                              </TableCell>
                              {!selectedShow && (
                                <>
                                  <TableCell className="text-center py-2 px-4">
                                    <Badge
                                      variant="secondary"
                                      className="bg-[#0A0C10] text-white hover:bg-[#0A0C10]/90 px-2 py-0.5 text-xs"
                                    >
                                      {show.occrType}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center py-2 px-4">
                                    {show.marketType}
                                  </TableCell>
                                  <TableCell className="text-center py-2 px-4">
                                    {show.project}
                                  </TableCell>
                                  <TableCell className="text-center py-2 px-4">
                                    {show.cityOrg}
                                  </TableCell>
                                  <TableCell className="text-center py-2 px-4">
                                    {show.yrmo}
                                  </TableCell>
                                  <TableCell className="text-center py-2 px-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleShowSelect(show);
                                        }}
                                        className="h-7 w-7 p-0"
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteShow(show);
                                        }}
                                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Detail View (Show Occurrences) */}
          <AnimatePresence>
            {selectedShow && (
              <motion.div
                className="flex-1 bg-white overflow-y-auto"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="p-4 max-w-5xl mx-auto">
                  {/* Breadcrumb */}
                  <div className="flex items-center justify-between pb-2 mb-4 border-b">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedShow(null)}
                        className="h-8 px-2"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Shows
                      </Button>
                      <span className="mx-2">•</span>
                      <span className="font-medium text-gray-900">
                        {selectedShow.name}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{selectedShow.id}</span>
                    </div>
                  </div>

                  {/* Show Occurrences Content */}
                  <div className="space-y-4">
                    {/* Section 1: Basic Info */}
                    <Card className="shadow-sm">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-semibold">
                          Show Occurrences
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Show Name
                              </Label>
                              <Input
                                value={selectedShow.name}
                                readOnly
                                className="h-9 px-3 w-full md:w-3/4"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Show ID
                              </Label>
                              <Input
                                value={selectedShow.id}
                                readOnly
                                className="h-9 px-3 w-full md:w-3/4"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Description
                              </Label>
                              <Input className="h-9 px-3 w-full md:w-3/4" />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Open
                              </Label>
                              <Input
                                type="datetime-local"
                                className="h-9 px-3 w-full md:w-3/4"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Close
                              </Label>
                              <Input
                                type="datetime-local"
                                className="h-9 px-3 w-full md:w-3/4"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Timezone
                              </Label>
                              <div className="flex gap-4 items-end">
                                <Input
                                  placeholder="Enter timezone"
                                  className="h-9 px-3 w-full md:w-3/4"
                                />
                                <Button className="h-9 bg-blue-600 text-white hover:bg-blue-700">
                                  Customers
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Section 2: Tabs */}
                    <Card className="shadow-sm">
                      <CardContent className="p-4">
                        <Tabs
                          value={activeTab}
                          onValueChange={setActiveTab}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent h-9">
                            <TabsTrigger
                              value="projectInfo"
                              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-50 hover:bg-gray-100 h-9"
                            >
                              Project Info
                            </TabsTrigger>
                            <TabsTrigger
                              value="keyDates"
                              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-50 hover:bg-gray-100 h-9"
                            >
                              Key Dates
                            </TabsTrigger>
                            <TabsTrigger
                              value="generalInfo"
                              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-50 hover:bg-gray-100 h-9"
                            >
                              General Info
                            </TabsTrigger>
                          </TabsList>

                          <div className="mt-4">
                            {/* Project Info Tab */}
                            <TabsContent
                              value="projectInfo"
                              className="space-y-4"
                            >
                              <div className="bg-gray-50 rounded-md p-4">
                                <Table>
                                  <TableHeader className="bg-white">
                                    <TableRow className="border-b border-gray-200">
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Project Name
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Project Number
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Project Type
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Status
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Production City
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Facility ID
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow className="hover:bg-white/50">
                                      <TableCell className="py-2 text-sm">
                                        {mockProjectData.projectName}
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        {mockProjectData.projectNumber}
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        {mockProjectData.projectType}
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        {mockProjectData.status}
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        {mockProjectData.productionCity}
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        {mockProjectData.facilityId}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => {
                                    const facilityTable =
                                      document.getElementById("facilityTable");
                                    if (facilityTable) {
                                      facilityTable.style.display =
                                        facilityTable.style.display === "none"
                                          ? "block"
                                          : "none";
                                    }
                                  }}
                                  className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4"
                                >
                                  Project Facilities
                                </Button>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
                                  Key Contacts
                                </Button>
                              </div>
                              <div
                                id="facilityTable"
                                style={{ display: "none" }}
                                className="mt-4"
                              >
                                <Card className="shadow-sm">
                                  <CardHeader className="py-3 px-4">
                                    <CardTitle className="text-sm font-semibold">
                                      Project Facility Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    {/* Project Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                      <div className="space-y-2">
                                        <Label className="text-sm text-gray-500">
                                          Project Number
                                        </Label>
                                        <Input
                                          value={mockProjectData.projectNumber}
                                          readOnly
                                          className="h-9"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-gray-500">
                                          Project Name
                                        </Label>
                                        <Input
                                          value={mockProjectData.projectName}
                                          readOnly
                                          className="h-9"
                                        />
                                      </div>
                                    </div>

                                    {/* Registration Header */}
                                    <div className="flex justify-end mb-4">
                                      <Label className="text-sm font-medium">
                                        Registration:
                                      </Label>
                                      <span className="ml-2 text-sm">
                                        ----------------Servicecenter(TM)----------------
                                      </span>
                                    </div>

                                    {/* Facilities Table */}
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-xs font-semibold text-gray-700">
                                            Facility ID
                                          </TableHead>
                                          <TableHead className="text-xs font-semibold text-gray-700">
                                            Facility Name
                                          </TableHead>
                                          <TableHead className="text-xs font-semibold text-gray-700">
                                            Hall
                                          </TableHead>
                                          <TableHead className="text-xs font-semibold text-gray-700">
                                            Location
                                          </TableHead>
                                          <TableHead className="text-xs font-semibold text-gray-700">
                                            Location
                                          </TableHead>
                                          <TableHead className="text-xs font-semibold text-gray-700">
                                            Area Code
                                          </TableHead>
                                          <TableHead className="text-xs font-semibold text-gray-700">
                                            Phone
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {mockFacilityData.map((facility) => (
                                          <TableRow key={facility.facilityId}>
                                            <TableCell className="py-2 text-sm">
                                              {facility.facilityId}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                              {facility.facilityName}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                              {facility.hall}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                              {facility.location1}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                              {facility.location2}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                              {facility.areaCode}
                                            </TableCell>
                                            <TableCell className="py-2 text-sm">
                                              {facility.phone}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>

                                    {/* Notes and Comments */}
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                      <div className="space-y-2">
                                        <Label className="text-sm text-gray-500">
                                          Notes
                                        </Label>
                                        <Input
                                          placeholder="Enter notes"
                                          className="h-9"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-gray-500">
                                          Comments
                                        </Label>
                                        <Input
                                          placeholder="Enter comments"
                                          className="h-9"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-gray-500">
                                          Special Instructions
                                        </Label>
                                        <Input
                                          placeholder="Enter special instructions"
                                          className="h-9"
                                        />
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center mt-6">
                                      <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 h-9">
                                        Auto-Out
                                      </Button>
                                      <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 h-9">
                                        Details
                                      </Button>
                                      <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 h-9">
                                        Schedule
                                      </Button>
                                      <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 h-9">
                                        Material Handling
                                      </Button>
                                      <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 h-9">
                                        Vendor Info
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>

                            {/* Key Dates Tab */}
                            <TabsContent value="keyDates" className="space-y-4">
                              <div className="bg-gray-50 rounded-md p-4">
                                <div className="flex items-center gap-4 mb-4">
                                  <Label className="text-sm text-gray-500">
                                    Show Dates for
                                  </Label>
                                  <Select>
                                    <SelectTrigger className="w-[180px] h-9">
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
                                  <TableHeader className="bg-white">
                                    <TableRow className="border-b border-gray-200">
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Date Type
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Project Number
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Facility ID
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Date/time
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-gray-700">
                                        Notes
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="py-2 text-sm">
                                        -
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        -
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        -
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        -
                                      </TableCell>
                                      <TableCell className="py-2 text-sm">
                                        -
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </TabsContent>

                            {/* General Info Tab */}
                            <TabsContent
                              value="generalInfo"
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Measurements */}
                                <div className="space-y-4">
                                  <Card className="shadow-sm">
                                    <CardHeader className="py-3 px-4">
                                      <CardTitle className="text-sm font-semibold">
                                        Measurements
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">
                                              Total Sq Ft (Projected)
                                            </Label>
                                            <Input className="h-9 px-3" />
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">
                                              Total Sq Ft (Actual)
                                            </Label>
                                            <Input className="h-9 px-3" />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">
                                              Freight (Projected)
                                            </Label>
                                            <Input className="h-9 px-3" />
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">
                                              Freight (Actual)
                                            </Label>
                                            <Input className="h-9 px-3" />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">
                                              Graphics (Projected)
                                            </Label>
                                            <Input className="h-9 px-3" />
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">
                                              Graphics (Actual)
                                            </Label>
                                            <Input className="h-9 px-3" />
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Show Options */}
                                <div className="space-y-4">
                                  <Card className="shadow-sm">
                                    <CardHeader className="py-3 px-4">
                                      <CardTitle className="text-sm font-semibold">
                                        Show Options
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="flooring"
                                              className="h-4 w-4"
                                            />
                                            <Label
                                              htmlFor="flooring"
                                              className="text-sm"
                                            >
                                              Flooring Mandatory
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="targeted"
                                              className="h-4 w-4"
                                            />
                                            <Label
                                              htmlFor="targeted"
                                              className="text-sm"
                                            >
                                              Targeted Show
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="marshalling"
                                              className="h-4 w-4"
                                            />
                                            <Label
                                              htmlFor="marshalling"
                                              className="text-sm"
                                            >
                                              Marshalling
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="rtw"
                                              className="h-4 w-4"
                                            />
                                            <Label
                                              htmlFor="rtw"
                                              className="text-sm"
                                            >
                                              No RTW
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="ops"
                                              className="h-4 w-4"
                                            />
                                            <Label
                                              htmlFor="ops"
                                              className="text-sm"
                                            >
                                              Natl Ops Team
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="design"
                                              className="h-4 w-4"
                                            />
                                            <Label
                                              htmlFor="design"
                                              className="text-sm"
                                            >
                                              Design Collaboration
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="clean"
                                              className="h-4 w-4"
                                            />
                                            <Label
                                              htmlFor="clean"
                                              className="text-sm"
                                            >
                                              Clean Floor Policy
                                            </Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id="booth"
                                              className="h-4 w-4"
                                            />
                                            <Label
                                              htmlFor="booth"
                                              className="text-sm"
                                            >
                                              Show Org Booth Pkg
                                            </Label>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-sm text-gray-500">
                                            Tier Pricing
                                          </Label>
                                          <Input className="h-9 px-3" />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>

                              {/* Comments & Package */}
                              <div className="grid grid-cols-1 gap-4">
                                <Card className="shadow-sm">
                                  <CardHeader className="py-3 px-4">
                                    <CardTitle className="text-sm font-semibold">
                                      Comments
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm text-gray-500">
                                        Freight Info
                                      </Label>
                                      <Textarea className="min-h-[80px] px-3 py-2" />
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="shadow-sm">
                                  <CardHeader className="py-3 px-4">
                                    <CardTitle className="text-sm font-semibold">
                                      Show Package
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-4">
                                    <div className="space-y-4">
                                      <Textarea className="min-h-[80px] px-3 py-2" />
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label className="text-sm text-gray-500">
                                            Specify Logo
                                          </Label>
                                          <Input className="h-9 px-3" />
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="text-sm text-gray-500">
                                            Send Exhibitor Survey
                                          </Label>
                                          <Input className="h-9 px-3" />
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>
                          </div>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              show and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
