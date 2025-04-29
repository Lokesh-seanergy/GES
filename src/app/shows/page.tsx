"use client";

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronLeft, ArrowUp, ArrowUpDown, ArrowDown, ChevronRight, X } from "lucide-react";
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
import MainLayout from "@/components/mainlayout/MainLayout";
import { mockShows, mockProjectData, mockFacilityData, mockShowDetails, ShowKeyDate, ShowMeasurements, ShowOptions, ShowComments } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomPagination } from "@/components/ui/pagination";
import { PageSizeSelector } from "@/components/ui/page-size-selector";
import dayjs from "dayjs";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

interface ShowData {
  showId: string;
  showName: string;
  occrId: string;
  occrType: string;
  marketType: string;
  projectNumber: string;
  cityOrg: string;
  yrmo: string;
  project?: string; // Making project optional for backward compatibility
  name?: string; // Making name optional for backward compatibility
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

interface FilterState {
  showId: string;
  showName: string;
  occrId: string;
  occrType: string;
  marketType: string;
  projectNumber: string;
  cityOrg: string;
  yrmoStart: string;
  yrmoEnd: string;
}

const OCCR_TYPES = [
  "Annual Conference",
  "Trade Show",
  "Developer Conference",
  "Exhibition",
  "Seminar",
  "Workshop",
];

const MARKET_TYPES = [
  "Cloud & Enterprise",
  "Consumer Electronics",
  "Technology",
  "Software Development",
  "Software & Hardware",
  "Healthcare",
  "Finance",
  "Education",
];

type SortField = 'showId' | 'showName' | 'occrId' | 'occrType' | 'marketType' | 'projectNumber' | 'cityOrg' | 'yrmo';
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

// Add pagination interface
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// Main component
export default function ShowsPage() {
  const router = useRouter();

  // Search state
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText);
  const { setQuery } = useSearchStore();

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    showId: "",
    showName: "",
    occrId: "",
    occrType: "",
    marketType: "",
    projectNumber: "",
    cityOrg: "",
    yrmoStart: "",
    yrmoEnd: "",
  });
  const [activeFilters, setActiveFilters] = useState<Partial<FilterState>>({});

  // Sort state
  const [sortField, setSortField] = useState<SortField>("showId");
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
  const [shows, setShows] = useState<ShowData[]>(mockShows.map(show => ({
    showId: show.showId,
    showName: show.showName,
    occrId: show.occrId,
    occrType: show.occrType,
    marketType: show.marketType,
    projectNumber: show.projectNumber,
    cityOrg: show.cityOrg,
    yrmo: show.yrmo
  })));
  const [selectedShow, setSelectedShow] = useState<ShowData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isNewShowOpen, setIsNewShowOpen] = useState(false);
  const [isNewOccrOpen, setIsNewOccrOpen] = useState(false);
  const [newShow, setNewShow] = useState<ShowData>({
    showId: '',
    showName: '',
    occrId: '',
    occrType: '',
    marketType: '',
    projectNumber: '',
    cityOrg: '',
    yrmo: ''
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

  const [showDialog, setShowDialog] = useState(false);

  const [selectedShowDetails, setSelectedShowDetails] = useState<(typeof mockShowDetails)[0] | null>(null);

  const [showAutoOut, setShowAutoOut] = useState(false);
  const [autoOutData, setAutoOutData] = useState({
    facilityId: "",
    facilityName: "",
    projectNumber: "",
  });

  const [showFacilityDetails, setShowFacilityDetails] = useState(false);

  // Add state for Facility Schedules Form
  const [showSchedules, setShowSchedules] = useState(false);

  // Add state for Material Handling
  const [showMaterialHandling, setShowMaterialHandling] = useState(false);
  const [activeWarehouseTab, setActiveWarehouseTab] = useState("warehouse");

  // Add state for Facility Vendors Form
  const [showVendorInfo, setShowVendorInfo] = useState(false);

  const filteredAndSortedShows = useMemo(() => {
    return [...shows]
      .filter((show) => {
        // Search filter
        if (debouncedSearch) {
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

          const searchTerms = debouncedSearch.toLowerCase().split(" ");
          if (
            !searchTerms.every((term) =>
              searchFields.some((field) => field.includes(term))
            )
          ) {
            return false;
          }
        }

        // Active filters
        if (
          activeFilters.showId &&
          !show.showId.toLowerCase().includes(activeFilters.showId.toLowerCase())
        ) {
          return false;
        }
        if (
          activeFilters.showName &&
          !show.showName
            .toLowerCase()
            .includes(activeFilters.showName.toLowerCase())
        ) {
          return false;
        }
        if (
          activeFilters.occrId &&
          !show.occrId
            .toLowerCase()
            .includes(activeFilters.occrId.toLowerCase())
        ) {
          return false;
        }
        if (
          activeFilters.occrType &&
          show.occrType !== activeFilters.occrType
        ) {
          return false;
        }
        if (
          activeFilters.marketType &&
          show.marketType !== activeFilters.marketType
        ) {
          return false;
        }
        if (
          activeFilters.projectNumber &&
          !show.projectNumber
            .toLowerCase()
            .includes(activeFilters.projectNumber.toLowerCase())
        ) {
          return false;
        }
        if (
          activeFilters.cityOrg &&
          !show.cityOrg
            .toLowerCase()
            .includes(activeFilters.cityOrg.toLowerCase())
        ) {
          return false;
        }
        if (activeFilters.yrmoStart && show.yrmo < activeFilters.yrmoStart) {
          return false;
        }
        if (activeFilters.yrmoEnd && show.yrmo > activeFilters.yrmoEnd) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (!sortDirection) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
  }, [debouncedSearch, sortField, sortDirection, shows, activeFilters]);

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
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 text-primary" />
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

  const handleAddShow = () => {
    // Add the new show to the shows array
    setShows((prevShows) => [...prevShows, newShow]);
    // Reset the newShow state
    setNewShow({
      showId: "",
      showName: "",
      occrId: "",
      occrType: "",
      marketType: "",
      projectNumber: "",
      cityOrg: "",
      yrmo: "",
    });
    // Close the dialog
    setShowDialog(false);
    setIsNewShowOpen(false);
  };

  // Handle show selection for editing
  const handleShowSelect = (show: ShowData) => {
    setSelectedShow(show);
    const details = mockShowDetails.find(details => details.showId === show.showId);
    setSelectedShowDetails(details || null);
  };

  // Delete show
  const handleDeleteShow = (showId: string) => {
    setShows(prev => prev.filter(show => show.showId !== showId));
  };

  const confirmDelete = () => {
    if (!selectedShow) return;

    setShows((prevShows) =>
      prevShows.filter((show) => show.showId !== selectedShow.showId)
    );
    setShowDeleteDialog(false);
    setSelectedShow(null);
  };

  const [activeTab, setActiveTab] = useState("projectInfo");

  const validateMonth = (month: string): string => {
    const monthNum = parseInt(month, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return "";
    return monthNum.toString().padStart(2, "0");
  };

  const handleYrmoInput = (value: string) => {
    // Allow only digits and hyphens initially
    const cleaned = value.replace(/[^\d\-]/g, "");

    // Handle the first date (before the colon)
    let formattedValue = cleaned;

    // Auto-insert hyphen after year if needed
    if (cleaned.length >= 4 && !cleaned.includes("-")) {
      const year = cleaned.slice(0, 4);
      const month = cleaned.slice(4, 6);
      const validMonth = validateMonth(month);
      formattedValue = month ? `${year}-${validMonth}` : year;
    }

    // Format as a range if there's enough digits
    if (cleaned.length > 6) {
      const firstDate = cleaned.slice(0, 7); // YYYY-MM
      const [firstYear, firstMonth] = firstDate.split("-");
      const validFirstMonth = validateMonth(firstMonth || "");
      const firstPart = validFirstMonth
        ? `${firstYear}-${validFirstMonth}`
        : firstYear;

      const remainingDigits = cleaned.slice(7).replace(/[^\d]/g, "");

      if (remainingDigits.length > 0) {
        let secondPart = remainingDigits;
        if (remainingDigits.length >= 4) {
          const secondYear = remainingDigits.slice(0, 4);
          const secondMonth = remainingDigits.slice(4, 6);
          const validSecondMonth = validateMonth(secondMonth || "");
          secondPart = validSecondMonth
            ? `${secondYear}-${validSecondMonth}`
            : secondYear;
        }
        formattedValue = `${firstPart} : ${secondPart}`;
      }
    }

    // Update the filters based on the formatted value
    const parts = formattedValue.split(" : ");
    setFilters((prev) => ({
      ...prev,
      yrmoStart: parts[0] || "",
      yrmoEnd: parts[1] || "",
    }));
  };

  const formatYrmoRange = (start: string, end: string) => {
    if (!start && !end) return "";
    if (!end) return start;
    return `${start} : ${end}`;
  };

  // Filter handlers
  const handleFilterChange = (field: keyof FilterState, value: string) => {
    if (field === "yrmoStart") {
      handleYrmoInput(value);
    } else {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }
  };

  const resetFilters = () => {
    setFilters({
      showId: "",
      showName: "",
      occrId: "",
      occrType: "",
      marketType: "",
      projectNumber: "",
      cityOrg: "",
      yrmoStart: "",
      yrmoEnd: "",
    });
    setActiveFilters({});
  };

  const applyFilters = () => {
    setActiveFilters(filters);
    setShowFilters(false);
  };

  const removeFilter = (field: keyof FilterState) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
    setFilters((prev) => ({ ...prev, [field]: "" }));
  };

  const [showProjectFacilities, setShowProjectFacilities] = useState(false);

  // Get container widths based on current state
  const getContainerWidths = () => {
    if (showProjectFacilities) {
      return {
        showInfo: "w-[15%]",
        occurrences: "w-[25%]",
        facilities: "w-[60%]",
      };
    }
    if (selectedShow) {
      return {
        showInfo: "w-1/4",
        occurrences: "w-3/4",
        facilities: "w-0",
      };
    }
    return {
      showInfo: "w-full",
      occurrences: "w-0",
      facilities: "w-0",
    };
  };

  // Handle back navigation
  const handleBackToShows = () => {
    if (showProjectFacilities) {
      setShowProjectFacilities(false);
    } else {
      setSelectedShow(null);
    }
  };

  // Add pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 150
  });

  // Update filtered and sorted shows with pagination
  const paginatedShows = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredAndSortedShows.slice(startIndex, endIndex);
  }, [filteredAndSortedShows, pagination.currentPage, pagination.itemsPerPage]);

  // Add pagination handlers
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleItemsPerPageChange = (value: string) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: parseInt(value),
      currentPage: 1 // Reset to first page when changing items per page
    }));
  };

  // Breadcrumb state
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { label: "Shows", href: "#" },
  ]);

  // Update breadcrumbs when show selection changes
  useEffect(() => {
    if (selectedShow) {
      const newBreadcrumbs: BreadcrumbItem[] = [
        {
          label: "Shows",
          href: "#",
          onClick: () => {
            setSelectedShow(null);
            setShowProjectFacilities(false);
          },
        },
      ];

      // Add the selected show
      newBreadcrumbs.push({
        label: selectedShow.showName,
        href: "#",
      });

      // Add project facilities if needed
      if (showProjectFacilities) {
        newBreadcrumbs.push({
          label: "Project Facilities",
          href: "#",
          onClick: () => setShowProjectFacilities(false),
        });
      }

      setBreadcrumbs(newBreadcrumbs);
    } else {
      setBreadcrumbs([{ label: "Shows", href: "#" }]);
    }
  }, [selectedShow, showProjectFacilities]);

  // Enhanced container transition configuration
  const containerTransition = {
    type: "spring",
    stiffness: 150, // Reduced for smoother motion
    damping: 20, // Reduced for smoother settling
    mass: 0.8, // Added mass for more natural movement
    restDelta: 0.001, // More precise stopping point
  };

  const handleCustomerButtonClick = () => {
    if (selectedShowDetails && selectedShow) {
      router.push(`/customers?showId=${selectedShowDetails.showId}&showName=${encodeURIComponent(selectedShow.showName)}&occrId=${encodeURIComponent(selectedShow.occrId)}`);
    }
  };

  const handleCloseShowDialog = () => {
    setIsNewShowOpen(false);
  };

  const handleAutoOutClick = () => {
    setShowAutoOut(true);
  };

  const handleDetailsClick = () => {
    setShowFacilityDetails(true);
  };

  // Add handler for Schedule button
  const handleScheduleClick = () => {
    setShowSchedules(true);
  };

  // Add handler for Material Handling button
  const handleMaterialHandlingClick = () => {
    setShowMaterialHandling(true);
  };

  // Add click handler for Vendor Info button
  const handleVendorInfoClick = () => {
    setShowVendorInfo(true);
  };

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden scroll-smooth">
        {/* Main content container with improved transitions */}
        <div className="flex h-full w-full relative transition-all duration-500 ease-out">
          {/* Show Details sidebar */}
          <motion.div
            className={cn(
              "bg-white border-r border-gray-200 overflow-hidden shrink-0",
              showProjectFacilities ? "w-[180px]" : selectedShow ? "w-[180px]" : "w-full"
            )}
            initial={false}
            animate={{
              width: showProjectFacilities
                ? "180px"
                : selectedShow
                ? "180px"
                : "100%",
              transition: containerTransition,
            }}
            layout
          >
            <div className={cn(
              "h-full overflow-y-auto overflow-x-hidden scroll-smooth",
              selectedShow ? "p-2" : "px-4 py-6"
            )}>
              {selectedShow ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <h2 className="text-sm font-semibold">Show Details</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToShows}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">Show ID</Label>
                      <div className="text-sm font-medium truncate">{selectedShow.showId}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Occr ID</Label>
                      <div className="text-sm font-medium truncate">{selectedShow.occrId}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <SearchBar
                        placeholder="Search by Show ID, Show Name, Market Type, etc."
                        value={searchText}
                        onChange={handleSearchChange}
                        onClear={clearSearch}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <span>Filters</span>
                      <span
                        className={cn(
                          "transition-transform",
                          showFilters ? "rotate-180" : ""
                        )}
                      >
                        ▼
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
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
                      variant="outline"
                      className="gap-2"
                      onClick={toggleNewOccr}
                    >
                      <Plus
                        className={`h-4 w-4 transition-transform ${
                          isNewOccrOpen ? "rotate-45" : ""
                        }`}
                      />
                      <span>New Occurrence</span>
                    </Button>
                  </div>

                  {/* Filter Panel */}
                  <motion.div
                    className={cn(
                      "bg-muted border rounded-md p-4",
                      "transition-all duration-300 ease-in-out absolute z-10 w-full",
                      showFilters
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Show ID</Label>
                        <Input
                          value={filters.showId}
                          onChange={(e) =>
                            handleFilterChange("showId", e.target.value)
                          }
                          placeholder="Filter by Show ID"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Show Name</Label>
                        <Input
                          value={filters.showName}
                          onChange={(e) =>
                            handleFilterChange("showName", e.target.value)
                          }
                          placeholder="Filter by Show Name"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Occr ID</Label>
                        <Input
                          value={filters.occrId}
                          onChange={(e) =>
                            handleFilterChange("occrId", e.target.value)
                          }
                          placeholder="Filter by Occr ID"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Occr Type</Label>
                        <Select
                          value={filters.occrType}
                          onValueChange={(value) =>
                            handleFilterChange("occrType", value)
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select Occr Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {OCCR_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Market Type</Label>
                        <Select
                          value={filters.marketType}
                          onValueChange={(value) =>
                            handleFilterChange("marketType", value)
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select Market Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {MARKET_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Project #</Label>
                        <Input
                          value={filters.projectNumber}
                          onChange={(e) =>
                            handleFilterChange("projectNumber", e.target.value)
                          }
                          placeholder="Filter by Project #"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">City Org</Label>
                        <Input
                          value={filters.cityOrg}
                          onChange={(e) =>
                            handleFilterChange("cityOrg", e.target.value)
                          }
                          placeholder="Filter by City Org"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Year/Month Range</Label>
                        <Input
                          type="text"
                          value={formatYrmoRange(
                            filters.yrmoStart,
                            filters.yrmoEnd
                          )}
                          onChange={(e) =>
                            handleFilterChange("yrmoStart", e.target.value)
                          }
                          className="h-9"
                          placeholder="YYYY-MM : YYYY-MM"
                          maxLength={21}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                      <Button variant="success" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </motion.div>

                  {/* Active Filter Tags */}
                  {Object.entries(activeFilters).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(activeFilters)
                        .filter(([_, value]) => value && value.trim() !== "")
                        .map(([key, value]) => (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 py-1 text-xs"
                          >
                            {key}: {value}
                            <button
                              onClick={() =>
                                removeFilter(key as keyof FilterState)
                              }
                              className="ml-1 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                    </div>
                  )}

                  {/* New Show Form */}
                  <motion.div
                    style={{ marginTop: "0px" }}
                    className={cn(
                      "fixed inset-0 w-[500px] bg-white shadow-xl z-50 border-l flex flex-col ml-auto",
                      "transition-all duration-300 ease-in-out",
                      isNewShowOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                    )}
                  >
                    <div className="border-b bg-white sticky top-0 z-10">
                      <div className="flex items-center justify-between p-4">
                        <h2 className="text-xl font-semibold">New Show</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCloseShowDialog}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <div className="p-6 space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Show ID</Label>
                            <Input
                              value={newShow.showId}
                              onChange={handleNewShowChange("showId")}
                              placeholder="Enter Show ID"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Show Name</Label>
                            <Input
                              value={newShow.showName}
                              onChange={handleNewShowChange("showName")}
                              placeholder="Enter Show Name"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Occr ID</Label>
                              <Input
                                value={newShow.occrId}
                                onChange={handleNewShowChange("occrId")}
                                placeholder="Enter Occr ID"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Occr Type</Label>
                              <Select
                                value={newShow.occrType}
                                onValueChange={(value) =>
                                  setNewShow((prev) => ({ ...prev, occrType: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Occr Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {OCCR_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Market Type</Label>
                            <Select
                              value={newShow.marketType}
                              onValueChange={(value) =>
                                setNewShow((prev) => ({ ...prev, marketType: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Market Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {MARKET_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Project Number</Label>
                              <Input
                                value={newShow.projectNumber}
                                onChange={handleNewShowChange("projectNumber")}
                                placeholder="Enter Project Number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>City Org</Label>
                              <Input
                                value={newShow.cityOrg}
                                onChange={handleNewShowChange("cityOrg")}
                                placeholder="Enter City Org"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Year/Month</Label>
                            <Input
                              value={newShow.yrmo}
                              onChange={handleNewShowChange("yrmo")}
                              placeholder="YYYY-MM"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t p-6">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCloseShowDialog}>
                          Cancel
                        </Button>
                        <Button variant="outline" onClick={handleAddShow}>
                          Create Show
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  {/* New Occurrence Form */}
                  <motion.div
                    style={{ marginTop: "0px" }}
                    className={cn(
                      "fixed inset-0 w-[500px] bg-white shadow-xl z-50 border-l flex flex-col ml-auto",
                      "transition-all duration-300 ease-in-out",
                      isNewOccrOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                    )}
                  >
                    <div className="border-b bg-white sticky top-0 z-10">
                      <div className="flex items-center justify-between p-4">
                        <h2 className="text-xl font-semibold">New Occurrence</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsNewOccrOpen(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <div className="p-6 space-y-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Show ID</Label>
                              <Input
                                value={newOccr.showId}
                                onChange={handleNewOccrChange("showId")}
                                placeholder="Enter Show ID"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Occr ID</Label>
                              <Input
                                value={newOccr.occrId}
                                onChange={handleNewOccrChange("occrId")}
                                placeholder="Enter Occr ID"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Occr Type</Label>
                            <Select
                              value={newOccr.occrType}
                              onValueChange={(value) =>
                                setNewOccr((prev) => ({ ...prev, occrType: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Occr Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {OCCR_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={newOccr.description}
                              onChange={(e) =>
                                setNewOccr((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Enter Description"
                              className="h-20"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Open Date</Label>
                              <Input
                                type="text"
                                placeholder="MM/DD/YYYY"
                                value={dayjs().format('MM/DD/YYYY')}
                                onChange={(e) => {
                                  const date = dayjs(e.target.value, 'MM/DD/YYYY');
                                  if (date.isValid()) {
                                    setNewOccr((prev) => ({
                                      ...prev,
                                      open: e.target.value,
                                    }));
                                  }
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-500">
                                Close
                              </Label>
                              <Input
                                type="text"
                                placeholder="MM/DD/YYYY"
                                className="h-9 px-3 w-full md:w-3/4"
                                value={dayjs().add(1, 'day').format('MM/DD/YYYY')}
                                onChange={(e) => {
                                  const date = dayjs(e.target.value, 'MM/DD/YYYY');
                                  if (date.isValid()) {
                                    setNewOccr((prev) => ({
                                      ...prev,
                                      close: e.target.value,
                                    }));
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Project Number</Label>
                              <Input
                                value={newOccr.projectNumber}
                                onChange={handleNewOccrChange("projectNumber")}
                                placeholder="Enter Project Number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Facility ID</Label>
                              <Input
                                value={newOccr.facilityId}
                                onChange={handleNewOccrChange("facilityId")}
                                placeholder="Enter Facility ID"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t p-6">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsNewOccrOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="outline" onClick={handleAddShow}>
                          Create Occurrence
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Shows Table */}
                  <Card
                    className={cn(
                      "shadow-sm",
                      selectedShow && "border-0 shadow-none"
                    )}
                  >
                    <CardContent
                      className={cn("px-0", selectedShow ? "py-2" : "py-3")}
                    >
                      {/* Section Title above the table */}
                      <div className="flex items-center justify-between px-4 pb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Show Information</h2>
                      </div>
                      <div className="border-b border-gray-200" />
                      <div className="overflow-x-auto px-4 mt-4">
                        <Table>
                          <TableHeader className="bg-[#E6F0FA] sticky top-0">
                            <TableRow className="border-b border-gray-200">
                              <TableHead
                                className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                onClick={() => handleSort("showId")}
                              >
                                <div className="flex items-center gap-2">
                                  Show ID {getSortIcon("showId")}
                                </div>
                              </TableHead>
                              {!selectedShow && (
                                <>
                                  <TableHead
                                    className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                    onClick={() => handleSort("showName")}
                                  >
                                    <div className="flex items-center gap-2">
                                      Show Name {getSortIcon("showName")}
                                    </div>
                                  </TableHead>
                                  <TableHead
                                    className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                    onClick={() => handleSort("occrId")}
                                  >
                                    <div className="flex items-center gap-2">
                                      Occurrence ID {getSortIcon("occrId")}
                                    </div>
                                  </TableHead>
                                  <TableHead
                                    className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                    onClick={() => handleSort("occrType")}
                                  >
                                    <div className="flex items-center gap-2">
                                      Occurrence Type {getSortIcon("occrType")}
                                    </div>
                                  </TableHead>
                                  <TableHead
                                    className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                    onClick={() => handleSort("marketType")}
                                  >
                                    <div className="flex items-center gap-2">
                                      Market Type {getSortIcon("marketType")}
                                    </div>
                                  </TableHead>
                                  <TableHead
                                    className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                    onClick={() => handleSort("projectNumber")}
                                  >
                                    <div className="flex items-center gap-2">
                                      Project# {getSortIcon("projectNumber")}
                                    </div>
                                  </TableHead>
                                  <TableHead
                                    className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                    onClick={() => handleSort("cityOrg")}
                                  >
                                    <div className="flex items-center gap-2">
                                      Show Location {getSortIcon("cityOrg")}
                                    </div>
                                  </TableHead>
                                  <TableHead
                                    className="text-sm font-semibold text-gray-700 cursor-pointer px-4 py-3"
                                    onClick={() => handleSort("yrmo")}
                                  >
                                    <div className="flex items-center gap-2">
                                      Year/Month {getSortIcon("yrmo")}
                                    </div>
                                  </TableHead>
                                  <TableHead className="text-sm font-semibold text-gray-700 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      Actions
                                    </div>
                                  </TableHead>
                                </>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedShows.map((show) => (
                              <TableRow
                                key={show.showId}
                                className={cn(
                                  "cursor-pointer hover:bg-gray-50",
                                  (selectedShow as unknown as ShowData)?.showId ===
                                    show.showId && "bg-blue-50 hover:bg-blue-50"
                                )}
                                onClick={() => handleShowSelect(show)}
                              >
                                <TableCell className="py-2 px-4">{show.showId}</TableCell>
                                {!selectedShow && (
                                  <>
                                    <TableCell className="py-2 px-4">{show.showName}</TableCell>
                                    <TableCell className="py-2 px-4">{show.occrId}</TableCell>
                                    <TableCell className="py-2 px-4">
                                      <span className={cn(
                                        'rounded px-2 py-0.5 text-xs font-medium',
                                        show.occrType.toLowerCase().includes('upcoming') && 'bg-yellow-100 text-yellow-800',
                                        show.occrType.toLowerCase().includes('ongoing') && 'bg-green-100 text-green-800',
                                        show.occrType.toLowerCase().includes('conference') && 'bg-blue-100 text-blue-800',
                                        show.occrType.toLowerCase().includes('exhibition') && 'bg-purple-100 text-purple-800',
                                        show.occrType.toLowerCase().includes('workshop') && 'bg-pink-100 text-pink-800',
                                        !show.occrType.toLowerCase().match(/(upcoming|ongoing|conference|exhibition|workshop)/) && 'bg-slate-200 text-slate-800'
                                      )}>
                                        {show.occrType}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-2 px-4">{show.marketType}</TableCell>
                                    <TableCell className="py-2 px-4">{show.projectNumber}</TableCell>
                                    <TableCell className="py-2 px-4">{show.cityOrg}</TableCell>
                                    <TableCell className="py-2 px-4">{show.yrmo}</TableCell>
                                    <TableCell className="py-2 px-4">
                                      <div className="flex items-center gap-2">
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
                                            handleDeleteShow(show.showId);
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
                  {/* Pagination controls outside the card */}
                  <div className="flex items-center justify-between mt-4">
                    <PageSizeSelector
                      pageSize={pagination.itemsPerPage}
                      setPageSize={(value) => {
                        setPagination(prev => ({
                          ...prev,
                          itemsPerPage: value,
                          currentPage: 1
                        }));
                      }}
                    />
                    <CustomPagination
                      currentPage={pagination.currentPage}
                      totalPages={Math.ceil(filteredAndSortedShows.length / pagination.itemsPerPage)}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Detail View (Show Occurrences) */}
          <AnimatePresence mode="wait">
            {selectedShow && (
              <motion.div
                className={cn(
                  "bg-white border-r border-gray-200 overflow-hidden shrink-0",
                  showProjectFacilities ? "w-[200px]" : "flex-1"
                )}
                initial={{ x: "100%", opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  width: showProjectFacilities ? "200px" : "auto",
                }}
                exit={{
                  x: "100%",
                  opacity: 0,
                  transition: {
                    ...containerTransition,
                    duration: 0.3,
                  },
                }}
                transition={containerTransition}
                layout
              >
                <div className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth">
                  {showProjectFacilities ? (
                    // Minimized view when facilities are shown
                    <div className="p-3 space-y-2">
                      <div className="pb-2 border-b">
                        <h2 className="text-sm font-semibold">Show Summary</h2>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-gray-500">Show Name</Label>
                          <div 
                            className="text-sm font-medium truncate cursor-default" 
                            title={selectedShow.showName}
                          >
                            {selectedShow.showName}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">YRMO</Label>
                          <div className="text-sm font-medium">{selectedShow.yrmo}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Project Number</Label>
                          <div className="text-sm font-medium truncate">{selectedShow.projectNumber}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Full view
                    <div className="p-3">
                      <div className="max-w-full mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center justify-between pb-2 mb-3 border-b">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleBackToShows}
                              className="h-7 px-2"
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Back to Shows
                            </Button>
                            <span className="mx-2">•</span>
                            <span className="font-medium text-gray-900">{selectedShow.showName}</span>
                            <span className="mx-2">•</span>
                            <span>{selectedShow.showId}</span>
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
                                      value={selectedShow.showName}
                                      readOnly
                                      className="h-9 px-3 w-full md:w-3/4"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-500">
                                      Show ID
                                    </Label>
                                    <Input
                                      value={selectedShow.showId}
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
                                      type="text"
                                      placeholder="MM/DD/YYYY"
                                      className="h-9 px-3 w-full md:w-3/4"
                                      value={dayjs().format('MM/DD/YYYY')}
                                      onChange={(e) => {
                                        const date = dayjs(e.target.value, 'MM/DD/YYYY');
                                        if (date.isValid()) {
                                          // Handle date change
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-500">
                                      Close
                                    </Label>
                                    <Input
                                      type="text"
                                      placeholder="MM/DD/YYYY"
                                      className="h-9 px-3 w-full md:w-3/4"
                                      value={dayjs().add(1, 'day').format('MM/DD/YYYY')}
                                      onChange={(e) => {
                                        const date = dayjs(e.target.value, 'MM/DD/YYYY');
                                        if (date.isValid()) {
                                          // Handle date change
                                        }
                                      }}
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
                                      <Button
                                        variant="outline"
                                        className="h-9"
                              size="sm"
                              className="h-8 px-6 bg-[#E6F3FF] hover:bg-[#D5E8F9] border-gray-300 min-w-[100px]"
                              onClick={handleAutoOutClick}
                            >
                              Auto-Out
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-6 bg-[#E6F3FF] hover:bg-[#D5E8F9] border-gray-300 min-w-[100px]"
                              onClick={handleDetailsClick}
                            >
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-6 bg-[#E6F3FF] hover:bg-[#D5E8F9] border-gray-300 min-w-[100px]"
                              onClick={handleScheduleClick}
                            >
                              Schedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-6 bg-[#E6F3FF] hover:bg-[#D5E8F9] border-gray-300 min-w-[100px]"
                              onClick={handleMaterialHandlingClick}
                            >
                              Material Handling
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-6 bg-[#E6F3FF] hover:bg-[#D5E8F9] border-gray-300 min-w-[100px]"
                              onClick={handleVendorInfoClick}
                            >
                              Vendor Info
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Back to Top Button */}
          <div className="relative">
            <ScrollToTop />
          </div>
        </div> {/* closes .flex h-full w-full ... */}
      </div> {/* closes .h-[calc(100vh-4rem)] ... */}
    </MainLayout>
  );
}



