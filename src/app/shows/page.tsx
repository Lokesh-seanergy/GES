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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

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

function YearMonthPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  // Reset user selection when popover is opened, value is cleared, or month/year changes
  useEffect(() => {
    if (open === true && !value) {
      setHasUserSelected(false);
    }
  }, [open, value]);

  // Reset user selection when the calendar month/year changes
  const calendarContentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const calendarNode = calendarContentRef.current;
    if (!calendarNode) return;
    const observer = new MutationObserver(() => {
      setHasUserSelected(false);
    });
    const caption = calendarNode.querySelector('.rdp-caption_label');
    if (caption) {
      observer.observe(caption, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [open]);

  // Only highlight a date if the user has explicitly selected one
  const isValidYrmo = /^\d{4}-\d{2}$/.test(value);
  let selectedDate: Date | undefined = undefined;
  if (isValidYrmo && value !== "" && hasUserSelected) {
    const date = new Date(value + '-01');
    if (!isNaN(date.getTime())) {
      selectedDate = date;
    }
  } else {
    selectedDate = undefined;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? value : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" ref={calendarContentRef}>
        <Calendar
          mode="single"
          selected={hasUserSelected ? selectedDate : undefined}
          onSelect={(date) => {
            if (date) {
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              onChange(`${year}-${month}`);
              setHasUserSelected(true);
              setOpen(false);
            }
          }}
          showOutsideDays={false}
          className="w-[320px] bg-black text-white rounded-md border border-gray-700 shadow"
          classNames={{
            months: "flex flex-col space-y-4",
            month: "space-y-4",
            caption: "flex justify-center items-center pt-1 relative",
            caption_label: "text-lg font-semibold text-white mx-8",
            nav: "flex items-center absolute left-0 right-0 justify-between px-2 top-1 z-10",
            nav_button: "h-7 w-7 bg-gray-800 text-white p-0 rounded hover:bg-gray-700 focus:bg-gray-700 border-none",
            nav_button_previous: "",
            nav_button_next: "",
            table: "w-full border-collapse space-y-1",
            head_row: "hidden",
            head_cell: "hidden",
            row: "hidden",
            cell: "hidden",
            day: "hidden",
            day_selected: "",
            day_today: "",
            ...{},
          }}
        />
      </PopoverContent>
    </Popover>
  );
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

  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Ignore clicks on the Filters button itself
      if (target.closest('button')?.textContent?.includes('Filters')) {
        return;
      }
      // Close filters if click is outside the container
      if (filtersRef.current && !filtersRef.current.contains(target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                    ref={filtersRef}
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
                        <Label className="text-sm text-gray-500 font-semibold">Occurrence ID</Label>
                        <Input
                          value={filters.occrId}
                          onChange={(e) =>
                            handleFilterChange("occrId", e.target.value)
                          }
                          placeholder="Filter by Occurrence ID"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Occurrence Type</Label>
                        <Select
                          value={filters.occrType}
                          onValueChange={(value) =>
                            handleFilterChange("occrType", value)
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select Occurrence Type" />
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
                        <Label className="text-sm text-gray-500 font-semibold">Show Location</Label>
                        <Input
                          value={filters.cityOrg}
                          onChange={(e) =>
                            handleFilterChange("cityOrg", e.target.value)
                          }
                          placeholder="Filter by Show Location"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500 font-semibold">Year-Month</Label>
                        <YearMonthPicker
                          value={filters.yrmoStart}
                          onChange={(val) => handleFilterChange('yrmoStart', val)}
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
                                      <div className="flex justify-center">
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
                                        variant="success"
                                        className="h-9"
                                        onClick={handleCustomerButtonClick}
                                      >
                                        Exhibitor
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
                                    className="data-[state=active]:bg-[#E6F3FF] data-[state=active]:text-[#1A4B7A] bg-gray-50 hover:bg-[#D5E8F9] h-9 border border-[#D1E3F8]"
                                  >
                                    Project Info
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="keyDates"
                                    className="data-[state=active]:bg-[#E6F3FF] data-[state=active]:text-[#1A4B7A] bg-gray-50 hover:bg-[#D5E8F9] h-9 border border-[#D1E3F8]"
                                  >
                                    Key Dates
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="generalInfo"
                                    className="data-[state=active]:bg-[#E6F3FF] data-[state=active]:text-[#1A4B7A] bg-gray-50 hover:bg-[#D5E8F9] h-9 border border-[#D1E3F8]"
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
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Project Name</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Project Number</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Project Type</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Status</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Production City</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Facility ID</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {mockProjectData && mockProjectData.map((project, index) => (
                                            project.projectNumber === selectedShow?.projectNumber && (
                                              <TableRow key={index} className="hover:bg-white/50">
                                                <TableCell className="py-2 text-sm text-center">{project.projectName}</TableCell>
                                                <TableCell className="py-2 text-sm text-center">{project.projectNumber}</TableCell>
                                                <TableCell className="py-2 text-sm text-center">{project.projectType}</TableCell>
                                                <TableCell className="py-2 text-sm text-center">{project.status}</TableCell>
                                                <TableCell className="py-2 text-sm text-center">{project.productionCity}</TableCell>
                                                <TableCell className="py-2 text-sm text-center">{project.facilityId}</TableCell>
                                              </TableRow>
                                            )
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        onClick={() => setShowProjectFacilities(true)}
                                        className="bg-[#E6F3FF] text-[#1A4B7A] hover:bg-[#D5E8F9] border border-[#D1E3F8] h-9 px-4"
                                      >
                                        Project Facilities
                                      </Button>
                                      <Button className="bg-[#E6F3FF] text-[#1A4B7A] hover:bg-[#D5E8F9] border border-[#D1E3F8] h-9 px-4">
                                        Key Contacts
                                      </Button>
                                    </div>
                                  </TabsContent>

                                  {/* Key Dates Tab */}
                                  <TabsContent
                                    value="keyDates"
                                    className="space-y-4"
                                  >
                                    <div className="bg-gray-50 rounded-md p-4">
                                      <div className="flex items-center gap-4 mb-4">
                                        <Label className="text-sm text-gray-500">
                                          Show Dates
                                        </Label>
                                      </div>
                                      <Table>
                                        <TableHeader className="bg-white">
                                          <TableRow className="border-b border-gray-200">
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Date Type</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Project Number</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Facility ID</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Date/time</TableHead>
                                            <TableHead className="text-xs font-semibold text-gray-700 text-center">Notes</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedShowDetails?.keyDates.map((date, index) => (
                                            <TableRow key={index}>
                                              <TableCell className="py-2 text-sm text-center">{date.dateType}</TableCell>
                                              <TableCell className="py-2 text-sm text-center">{date.projectNumber}</TableCell>
                                              <TableCell className="py-2 text-sm text-center">{date.facilityId}</TableCell>
                                              <TableCell className="py-2 text-sm text-center">
                                                {new Date(date.dateTime).toLocaleString()}
                                              </TableCell>
                                              <TableCell className="py-2 text-sm text-center">{date.notes}</TableCell>
                                            </TableRow>
                                          ))}
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
                                            <CardTitle className="text-sm font-semibold">Measurements</CardTitle>
                                          </CardHeader>
                                          <CardContent className="p-4">
                                            <div className="space-y-4">
                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                  <Label className="text-sm text-gray-500">Total Sq Ft (Projected)</Label>
                                                  <Input 
                                                    value={selectedShowDetails?.measurements.totalSqFtProjected} 
                                                    className="h-9 px-3" 
                                                    readOnly
                                                  />
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-sm text-gray-500">Total Sq Ft (Actual)</Label>
                                                  <Input 
                                                    value={selectedShowDetails?.measurements.totalSqFtActual} 
                                                    className="h-9 px-3" 
                                                    readOnly
                                                  />
                                                </div>
                                              </div>
                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                  <Label className="text-sm text-gray-500">Freight (Projected)</Label>
                                                  <Input 
                                                    value={selectedShowDetails?.measurements.freightProjected} 
                                                    className="h-9 px-3" 
                                                    readOnly
                                                  />
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-sm text-gray-500">Freight (Actual)</Label>
                                                  <Input 
                                                    value={selectedShowDetails?.measurements.freightActual} 
                                                    className="h-9 px-3" 
                                                    readOnly
                                                  />
                                                </div>
                                              </div>
                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                  <Label className="text-sm text-gray-500">Graphics (Projected)</Label>
                                                  <Input 
                                                    value={selectedShowDetails?.measurements.graphicsProjected} 
                                                    className="h-9 px-3" 
                                                    readOnly
                                                  />
                                                </div>
                                                <div className="space-y-2">
                                                  <Label className="text-sm text-gray-500">Graphics (Actual)</Label>
                                                  <Input 
                                                    value={selectedShowDetails?.measurements.graphicsActual} 
                                                    className="h-9 px-3" 
                                                    readOnly
                                                  />
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
                                            <CardTitle className="text-sm font-semibold">Show Options</CardTitle>
                                          </CardHeader>
                                          <CardContent className="p-4">
                                            <div className="space-y-4">
                                              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox 
                                                    id="flooring" 
                                                    className="h-4 w-4"
                                                    checked={selectedShowDetails?.showOptions.flooringMandatory}
                                                    disabled
                                                  />
                                                  <Label htmlFor="flooring" className="text-sm">Flooring Mandatory</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox 
                                                    id="targeted" 
                                                    className="h-4 w-4"
                                                    checked={selectedShowDetails?.showOptions.targetedShow}
                                                    disabled
                                                  />
                                                  <Label htmlFor="targeted" className="text-sm">Targeted Show</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox 
                                                    id="marshalling" 
                                                    className="h-4 w-4"
                                                    checked={selectedShowDetails?.showOptions.marshalling}
                                                    disabled
                                                  />
                                                  <Label htmlFor="marshalling" className="text-sm">Marshalling</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox 
                                                    id="rtw" 
                                                    className="h-4 w-4"
                                                    checked={selectedShowDetails?.showOptions.noRTW}
                                                    disabled
                                                  />
                                                  <Label htmlFor="rtw" className="text-sm">No RTW</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox 
                                                    id="ops" 
                                                    className="h-4 w-4"
                                                    checked={selectedShowDetails?.showOptions.natlOpsTeam}
                                                    disabled
                                                  />
                                                  <Label htmlFor="ops" className="text-sm">Natl Ops Team</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox 
                                                    id="design" 
                                                    className="h-4 w-4"
                                                    checked={selectedShowDetails?.showOptions.designCollaboration}
                                                    disabled
                                                  />
                                                  <Label htmlFor="design" className="text-sm">Design Collaboration</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox 
                                                    id="clean" 
                                                    className="h-4 w-4"
                                                    checked={selectedShowDetails?.showOptions.cleanFloorPolicy}
                                                    disabled
                                                  />
                                                  <Label htmlFor="clean" className="text-sm">Clean Floor Policy</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Checkbox 
                                                    id="booth" 
                                                    className="h-4 w-4"
                                                    checked={selectedShowDetails?.showOptions.showOrgBoothPkg}
                                                    disabled
                                                  />
                                                  <Label htmlFor="booth" className="text-sm">Show Org Booth Pkg</Label>
                                                </div>
                                              </div>
                                              <div className="space-y-2">
                                                <Label className="text-sm text-gray-500">Tier Pricing</Label>
                                                <Input 
                                                  value={selectedShowDetails?.showOptions.tierPricing} 
                                                  className="h-9 px-3" 
                                                  readOnly
                                                />
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
                                          <CardTitle className="text-sm font-semibold">Comments</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                          <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">Freight Info</Label>
                                            <Textarea 
                                              value={selectedShowDetails?.comments.freightInfo} 
                                              className="min-h-[80px] px-3 py-2" 
                                              readOnly
                                            />
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card className="shadow-sm">
                                        <CardHeader className="py-3 px-4">
                                          <CardTitle className="text-sm font-semibold">Show Package</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                          <div className="space-y-4">
                                            <Textarea 
                                              value={selectedShowDetails?.comments.showPackage} 
                                              className="min-h-[80px] px-3 py-2" 
                                              readOnly
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                              <div className="space-y-2">
                                                <Label className="text-sm text-gray-500">Specify Logo</Label>
                                                <Input 
                                                  value={selectedShowDetails?.comments.specifyLogo} 
                                                  className="h-9 px-3" 
                                                  readOnly
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label className="text-sm text-gray-500">Send Exhibitor Survey</Label>
                                                <Input 
                                                  value={selectedShowDetails?.comments.exhibitorSurvey} 
                                                  className="h-9 px-3" 
                                                  readOnly
                                                />
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
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Project Facilities Panel */}
          <AnimatePresence mode="wait">
            {showProjectFacilities && (
              <motion.div
                className="bg-white flex-1 overflow-hidden"
                initial={{ x: "100%", opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
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
                  <div className="p-4 w-full">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b">
                      <h2 className="text-lg font-semibold">
                        Project Facilities
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowProjectFacilities(false)}
                        className="h-8 px-2"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Show
                      </Button>
                    </div>

                    {/* Project Facility content */}
                    <Card className="shadow-sm">
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="text-sm font-semibold">
                          Project Facility Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        {/* Project Info */}
                        <div className="space-y-6">
                          {/* Project section */}
                          <div className="space-y-3">
                            <div className="text-sm font-medium">Project</div>
                            <div className="grid grid-cols-2 gap-x-8">
                              <div>
                                <Label className="text-sm mb-1 block">Project Number</Label>
                                <Input 
                                  value={selectedShow?.projectNumber || ''} 
                                  readOnly 
                                  className="h-8 bg-white border-gray-300" 
                                />
                              </div>
                              <div>
                                <Label className="text-sm mb-1 block">Project Name</Label>
                                <Input 
                                  value={selectedShow?.project || ''} 
                                  readOnly 
                                  className="h-8 bg-white border-gray-300" 
                                />
                              </div>
                            </div>
                          </div>

                          {/* Facility Information Table with integrated Servicecenter(TM) */}
                          <div className="mt-4">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="border border-gray-300 bg-gray-100 text-left p-1 text-sm font-normal" style={{ width: '15%' }}>
                                    Facility ID
                                  </th>
                                  <th className="border border-gray-300 bg-gray-100 text-left p-1 text-sm font-normal" style={{ width: '25%' }}>
                                    Facility Name
                                  </th>
                                  <th className="border border-gray-300 bg-gray-100 text-left p-1 text-sm font-normal" style={{ width: '10%' }}>
                                    Hall
                                  </th>
                                  <th className="border border-gray-300 bg-gray-100 text-left p-1 text-sm font-normal" style={{ width: '15%' }}>
                                    Registration Location
                                  </th>
                                  <th colSpan={3} className="border border-gray-300 bg-gray-100 text-left p-1">
                                    <div className="flex items-center gap-2">
                                      <span className="border-t border-gray-300 flex-grow"></span>
                                      <span className="text-sm font-normal">Servicecenter(TM)</span>
                                      <span className="border-t border-gray-300 flex-grow"></span>
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <th className="border border-gray-300 bg-gray-100"></th>
                                  <th className="border border-gray-300 bg-gray-100"></th>
                                  <th className="border border-gray-300 bg-gray-100"></th>
                                  <th className="border border-gray-300 bg-gray-100"></th>
                                  <th className="border border-gray-300 bg-gray-100 text-left p-1 text-sm font-normal" style={{ width: '15%' }}>
                                    Location
                                  </th>
                                  <th className="border border-gray-300 bg-gray-100 text-left p-1 text-sm font-normal" style={{ width: '10%' }}>
                                    Area Code
                                  </th>
                                  <th className="border border-gray-300 bg-gray-100 text-left p-1 text-sm font-normal" style={{ width: '10%' }}>
                                    Phone
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-gray-300 p-1">
                                    <Input 
                                      value="MCCORM" 
                                      readOnly 
                                      className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" 
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-1">
                                    <Input 
                                      value="MCCORMICK PLAC" 
                                      readOnly 
                                      className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" 
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-1">
                                    <Input 
                                      value="" 
                                      readOnly 
                                      className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" 
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-1">
                                    <Input 
                                      value="" 
                                      readOnly 
                                      className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" 
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-1">
                                    <Input 
                                      value="" 
                                      readOnly 
                                      className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" 
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-1">
                                    <Input 
                                      value="" 
                                      readOnly 
                                      className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" 
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-1">
                                    <Input 
                                      value="" 
                                      readOnly 
                                      className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" 
                                    />
                                  </td>
                                </tr>
                                {/* Add more empty rows to match the screenshot */}
                                {[...Array(5)].map((_, index) => (
                                  <tr key={index}>
                                    <td className="border border-gray-300 p-1">
                                      <Input readOnly className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" />
                                    </td>
                                    <td className="border border-gray-300 p-1">
                                      <Input readOnly className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" />
                                    </td>
                                    <td className="border border-gray-300 p-1">
                                      <Input readOnly className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" />
                                    </td>
                                    <td className="border border-gray-300 p-1">
                                      <Input readOnly className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" />
                                    </td>
                                    <td className="border border-gray-300 p-1">
                                      <Input readOnly className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" />
                                    </td>
                                    <td className="border border-gray-300 p-1">
                                      <Input readOnly className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" />
                                    </td>
                                    <td className="border border-gray-300 p-1">
                                      <Input readOnly className="h-7 w-full bg-white border-gray-300 focus:ring-0 focus:border-gray-300" />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Keep the Notes, Comments, and Special Instructions section */}
                          <div className="space-y-6 mt-8">
                            <div>
                              <Label className="text-sm text-gray-600 mb-2 block">Notes</Label>
                              <Textarea 
                                placeholder="Enter notes"
                                className="min-h-[80px] w-full resize-none border-gray-300 rounded-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600 mb-2 block">Comments</Label>
                              <Textarea 
                                placeholder="Enter comments"
                                className="min-h-[80px] w-full resize-none border-gray-300 rounded-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600 mb-2 block">Special Instructions</Label>
                              <Textarea 
                                placeholder="Enter special instructions"
                                className="min-h-[80px] w-full resize-none border-gray-300 rounded-sm"
                              />
                            </div>
                          </div>

                          {/* Action Buttons - Centered with equal spacing */}
                          <div className="flex justify-center items-center gap-4 mt-8">
                            <Button
                              variant="outline"
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
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Top Button */}
          <div className="relative">
            <ScrollToTop />
          </div>
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

      {/* Add Show Dialog */}
      <Dialog 
        open={showDialog} 
        onOpenChange={(open) => setShowDialog(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Show</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new show.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="showId" className="text-right">
                Show ID
              </Label>
              <Input
                id="showId"
                value={newShow.showId}
                onChange={(e) => setNewShow({ ...newShow, showId: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="showName" className="text-right">
                Show Name
              </Label>
              <Input
                id="showName"
                value={newShow.showName}
                onChange={(e) => setNewShow({ ...newShow, showName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="occrId" className="text-right">
                Occr ID
              </Label>
              <Input
                id="occrId"
                value={newShow.occrId}
                onChange={(e) => setNewShow({ ...newShow, occrId: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="occrType" className="text-right">
                Occr Type
              </Label>
              <Input
                id="occrType"
                value={newShow.occrType}
                onChange={(e) => setNewShow({ ...newShow, occrType: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marketType" className="text-right">
                Market Type
              </Label>
              <Input
                id="marketType"
                value={newShow.marketType}
                onChange={(e) => setNewShow({ ...newShow, marketType: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectNumber" className="text-right">
                Project Number
              </Label>
              <Input
                id="projectNumber"
                value={newShow.projectNumber}
                onChange={(e) => setNewShow({ ...newShow, projectNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cityOrg" className="text-right">
                City Org
              </Label>
              <Input
                id="cityOrg"
                value={newShow.cityOrg}
                onChange={(e) => setNewShow({ ...newShow, cityOrg: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="yrmo" className="text-right">
                YRMO
              </Label>
              <Input
                id="yrmo"
                value={newShow.yrmo}
                onChange={(e) => setNewShow({ ...newShow, yrmo: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddShow}>
              Add Show
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-Out Slide-out Container */}
      <motion.div
        style={{ marginTop: "0px" }}
        className={cn(
          "fixed inset-0 w-[500px] bg-white shadow-xl z-50 border-l flex flex-col ml-auto",
          "transition-all duration-300 ease-in-out",
          showAutoOut
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">Labor Orders</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAutoOut(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* Facility Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Facility ID</Label>
                  <Input
                    value="MCCORM"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Project Number</Label>
                  <Input
                    value="0716022"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Facility Name</Label>
                <Input
                  value="MCCORMICK PLACE CONVENTION CENTER"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Auto-Out Table */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Labor Auto-Out Settings</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Item</TableHead>
                    <TableHead>Item Description</TableHead>
                    <TableHead className="w-24">LOB</TableHead>
                    <TableHead className="w-24">Auto-Out %</TableHead>
                    <TableHead className="w-24">ST %</TableHead>
                    <TableHead className="w-24">OT %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>705011</TableCell>
                    <TableCell>LABOR, PLUMBING</TableCell>
                    <TableCell></TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>705060</TableCell>
                    <TableCell>LABOR, ELECTRICAL</TableCell>
                    <TableCell></TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>705061</TableCell>
                    <TableCell>LABOR, ELECTRICAL BOOTH WORK</TableCell>
                    <TableCell></TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>705066</TableCell>
                    <TableCell>LABOR, ELECTRICAL HIGH LIFT</TableCell>
                    <TableCell></TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>705112</TableCell>
                    <TableCell>LABOR, HANGING SIGN CREW</TableCell>
                    <TableCell></TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="border-t p-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAutoOut(false)}>
              Cancel
            </Button>
            <Button variant="success">
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Facility Details Slide-out Container */}
      <motion.div
        style={{ marginTop: "0px" }}
        className={cn(
          "fixed inset-0 w-[800px] bg-white shadow-xl z-50 border-l flex flex-col ml-auto",
          "transition-all duration-300 ease-in-out",
          showFacilityDetails
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">Facility</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFacilityDetails(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* Basic Facility Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Facility ID</Label>
                  <Input className="h-9" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-sm text-gray-500">Facility Name</Label>
                  <Input className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Organization</Label>
                  <Input className="h-9" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-sm text-gray-500">Type</Label>
                  <Select defaultValue="convention-center">
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="convention-center">Convention Center</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Address</h3>
              <div className="grid gap-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Address 1</Label>
                    <Input className="h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Address 2</Label>
                    <Input className="h-8" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">City</Label>
                    <Input className="h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">State</Label>
                    <Input className="h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Zip</Label>
                    <Input className="h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Country</Label>
                    <Input className="h-8" defaultValue="United States" />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Contact Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Primary Contact</h3>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Last Name</Label>
                    <Input className="h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">First Name</Label>
                    <Input className="h-8" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <Input className="h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Email</Label>
                    <Input className="h-8" type="email" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main container for both sections */}
            <div className="grid grid-cols-2 gap-6">
              {/* Facility Specific Services */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Facility Specific Services</h3>
                <div className="grid grid-cols-[1fr,auto] gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">Service Type</Label>
                    <div className="border rounded-md h-[200px] overflow-y-auto bg-white">
                      <div className="grid grid-cols-1 divide-y">
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                        <div className="px-4 py-2 h-8"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">Supplied</Label>
                    <div className="border rounded-md h-[200px] overflow-y-auto bg-white w-[100px]">
                      <div className="grid grid-cols-1 divide-y">
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                        <div className="px-2 py-2 h-8 flex items-center justify-center">
                          <Checkbox className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floor Plan Attachment */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Floor Plan Attachment</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-sm text-gray-500">Attached</Label>
                      <Checkbox />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">Last Updated By</Label>
                    <Input className="h-9" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">Last Updated Date</Label>
                    <Input className="h-9" type="date" readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* Zones, Halls, and Rooms */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Zones</h3>
                <div className="border rounded-md h-[200px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Zones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">A1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">A2</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">A3</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">A4</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Halls</h3>
                <div className="border rounded-md h-[200px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Hall</TableHead>
                        <TableHead className="text-xs">Sq Ft</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">Hall A</TableCell>
                        <TableCell className="text-sm">25,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Hall B</TableCell>
                        <TableCell className="text-sm">30,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Hall C</TableCell>
                        <TableCell className="text-sm">28,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Hall D</TableCell>
                        <TableCell className="text-sm">22,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-gray-500">Sub Total:</Label>
                  <Input className="h-9 w-32 bg-gray-50" value="105,000" readOnly />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Rooms</h3>
                <div className="border rounded-md h-[200px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Rooms</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">Room 101</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Room 102</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Room 201</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Room 202</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Room 301</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t p-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowFacilityDetails(false)}>
              Cancel
            </Button>
            <Button variant="success">
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Material Handling Slide-out Container */}
      <motion.div
        style={{ marginTop: "0px" }}
        className={cn(
          "fixed inset-0 w-[800px] bg-white shadow-xl z-50 border-l flex flex-col ml-auto",
          "transition-all duration-300 ease-in-out",
          showMaterialHandling
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">Material Handling</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMaterialHandling(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* Show Occurrence and Facility sections side by side */}
            <div className="grid grid-cols-2 gap-8">
              {/* Show Occurrence Section */}
              <div>
                <h3 className="text-base font-semibold mb-4">Show Occurrence</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Occr ID</Label>
                    <Input 
                      className="mt-1 w-[250px] h-8" 
                      readOnly 
                      value={selectedShow?.occrId || ''} 
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Project Number</Label>
                    <Input 
                      className="mt-1 w-[250px] h-8" 
                      readOnly 
                      value={selectedShow?.projectNumber || ''} 
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Project Name</Label>
                    <Input 
                      className="mt-1 w-[250px] h-8" 
                      readOnly 
                      value={selectedShow?.project || ''} 
                    />
                  </div>
                </div>
              </div>

              {/* Facility Section */}
              <div>
                <h3 className="text-base font-semibold mb-4">Facility</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Facility ID</Label>
                    <Input className="mt-1 w-[250px] h-8" readOnly />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Facility Name</Label>
                    <Input className="mt-1 w-[250px] h-8" readOnly />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Facility Address</Label>
                    <Input className="mt-1 w-[250px] h-8" readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="space-y-4">
              <Tabs
                value={activeWarehouseTab}
                onValueChange={setActiveWarehouseTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-5 gap-1 bg-gray-100 p-1 h-9">
                  <TabsTrigger
                    value="warehouse"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary h-7"
                  >
                    Warehouse
                  </TabsTrigger>
                  <TabsTrigger
                    value="showSite"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary h-7"
                  >
                    Show Site
                  </TabsTrigger>
                  <TabsTrigger
                    value="marshalling"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary h-7"
                  >
                    Marshalling
                  </TabsTrigger>
                  <TabsTrigger
                    value="freightDates"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary h-7"
                  >
                    Freight Dates
                  </TabsTrigger>
                  <TabsTrigger
                    value="generalInfo"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary h-7"
                  >
                    General Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="warehouse" className="mt-4">
                  <div className="space-y-6">
                    {/* Warehouse Timings */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold">Warehouse Timings</h3>
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead className="text-xs font-medium w-32">Day</TableHead>
                              <TableHead className="text-xs font-medium text-center" colSpan={2}>----- Driver Check In -----</TableHead>
                              <TableHead className="text-xs font-medium text-center" colSpan={2}>Open/Close</TableHead>
                              <TableHead className="text-xs font-medium text-center" colSpan={2}>----- Lunch Time -----</TableHead>
                            </TableRow>
                            <TableRow className="bg-gray-50">
                              <TableHead></TableHead>
                              <TableHead className="text-xs font-medium text-center">From</TableHead>
                              <TableHead className="text-xs font-medium text-center">To</TableHead>
                              <TableHead className="text-xs font-medium text-center">Open</TableHead>
                              <TableHead className="text-xs font-medium text-center">Close</TableHead>
                              <TableHead className="text-xs font-medium text-center">From</TableHead>
                              <TableHead className="text-xs font-medium text-center">To</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Monday - Friday</TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                  defaultValue="" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                  defaultValue="" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                  defaultValue="08:00:00" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                  defaultValue="14:30:00" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                  defaultValue="11:30:00" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                  defaultValue="12:30:00" 
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Saturday</TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Sunday</TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input 
                                  className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="showSite" className="mt-4">
                  <div className="space-y-6">
                    {/* Show Site Address Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Label className="text-sm text-gray-600 w-32">Show Site Address</Label>
                            <Input className="flex-1 h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="onsite-docks" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                          <Label htmlFor="onsite-docks" className="text-sm">Onsite Docks</Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="text-sm text-gray-600 w-32">Show Site Add Desc</Label>
                        <Input className="flex-1 h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>

                    {/* Timings Table */}
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="text-xs font-medium w-32">Week Day</TableHead>
                            <TableHead className="text-xs font-medium text-center" colSpan={2}>
                              ----------Driver Check In----------
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center" colSpan={2}>
                              ----------Unloading----------
                            </TableHead>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableHead></TableHead>
                            <TableHead className="text-xs font-medium text-center">From Time</TableHead>
                            <TableHead className="text-xs font-medium text-center">To Time</TableHead>
                            <TableHead className="text-xs font-medium text-center">From Time</TableHead>
                            <TableHead className="text-xs font-medium text-center">To Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...Array(7)].map((_, index) => (
                            <TableRow key={index}>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="marshalling" className="mt-4">
                  <div className="space-y-6">
                    {/* Yard Information Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Label className="text-sm text-gray-600 w-32">Yard</Label>
                            <Input className="flex-1 h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Label className="text-sm text-gray-600 w-32">Yard Address</Label>
                            <Input className="flex-1 h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="text-sm text-gray-600 w-32">Yard Add Desc</Label>
                        <Input className="flex-1 h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>

                    {/* Timings Table */}
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="text-xs font-medium w-32">Week Day</TableHead>
                            <TableHead className="text-xs font-medium text-center" colSpan={2}>
                              ----------Driver Check In----------
                            </TableHead>
                            <TableHead className="text-xs font-medium text-center" colSpan={2}>
                              ----------Unloading----------
                            </TableHead>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableHead></TableHead>
                            <TableHead className="text-xs font-medium text-center">From Time</TableHead>
                            <TableHead className="text-xs font-medium text-center">To Time</TableHead>
                            <TableHead className="text-xs font-medium text-center">From Time</TableHead>
                            <TableHead className="text-xs font-medium text-center">To Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...Array(7)].map((_, index) => (
                            <TableRow key={index}>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                              <TableCell className="p-1">
                                <Input className="h-8 text-center border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="freightDates" className="mt-4">
                  <div className="space-y-6">
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="text-xs font-medium w-[250px]">Business Type</TableHead>
                            <TableHead className="text-xs font-medium w-[150px]">Week Day</TableHead>
                            <TableHead className="text-xs font-medium">Delivery Date & Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="Outbound Carrier Check In"
                              />
                            </TableCell>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="Thursday"
                              />
                            </TableCell>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="20-MAR-2025 18:00:00"
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="Outbound Carrier Check In"
                              />
                            </TableCell>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="Sunday"
                              />
                            </TableCell>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="23-MAR-2025 12:00:00"
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="Outbound Carrier Check In"
                              />
                            </TableCell>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="Friday"
                              />
                            </TableCell>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="21-MAR-2025 14:00:00"
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="Outbound Carrier Check In"
                              />
                            </TableCell>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="Saturday"
                              />
                            </TableCell>
                            <TableCell className="p-1">
                              <Input 
                                className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                                defaultValue="22-MAR-2025 12:00:00"
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="generalInfo" className="mt-4">
                  <div className="space-y-6">
                    {/* OT Surcharge Rules Section */}
                    <div className="border rounded-md p-4 space-y-4">
                      <div>
                        <Label className="text-sm font-medium">OT Surcharge Rules</Label>
                        <Input 
                          className="mt-1 w-full h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" 
                        />
                      </div>

                      {/* Left Column Checkboxes */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox defaultChecked id="pov-rules" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="pov-rules" className="text-sm">Pov Rules</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="cart-load" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="cart-load" className="text-sm">Cart Load</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hand-carry" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="hand-carry" className="text-sm">Hand Carry</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="freight-pkg" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="freight-pkg" className="text-sm">Freight Pkg</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox defaultChecked id="vehicle-spotting" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="vehicle-spotting" className="text-sm">Vehicle Spotting</Label>
                          </div>
                        </div>

                        {/* Right Column Checkboxes */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox defaultChecked id="machinery" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="machinery" className="text-sm">Machinery</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="access-storage" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="access-storage" className="text-sm">Access Storage</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="refrigeration" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="refrigeration" className="text-sm">Refrigeration</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="freezer" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="freezer" className="text-sm">Freezer</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="special-handling" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="special-handling" className="text-sm">Special Handling</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox defaultChecked id="targeted-show" className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            <Label htmlFor="targeted-show" className="text-sm">Targeted Show</Label>
                          </div>
                        </div>
                      </div>

                      {/* Transportation Plus Section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Transportation Plus</Label>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Available?</Label>
                              <Checkbox defaultChecked className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            </div>
                            <div className="flex items-center gap-4">
                              <Label className="text-sm w-20">Discount %</Label>
                              <Input 
                                className="w-24 h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400"
                                defaultValue="10"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Maximum?</Label>
                              <Checkbox defaultChecked className="border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                            </div>
                            <div className="flex items-center gap-4">
                              <Label className="text-sm w-32">Maximum Weight (cwt)</Label>
                              <Input 
                                className="w-24 h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400"
                                defaultValue="50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="border-t p-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowMaterialHandling(false)}>
              Cancel
            </Button>
            <Button variant="success">
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Facility Schedules Form Container */}
      <motion.div
        style={{ marginTop: "0px" }}
        className={cn(
          "fixed inset-0 w-[800px] bg-white shadow-xl z-50 border-l flex flex-col ml-auto",
          "transition-all duration-300 ease-in-out",
          showSchedules
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">Facility Schedules Form</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSchedules(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* Show Occurrence and Facility sections side by side */}
            <div className="grid grid-cols-2 gap-8">
              {/* Show Occurrence Section */}
              <div>
                <h3 className="text-base font-semibold mb-4">Show Occurrence</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Occr ID</Label>
                    <Input 
                      className="mt-1 w-[250px] h-8" 
                      readOnly 
                      value={selectedShow?.occrId || ''} 
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Project Number</Label>
                    <Input 
                      className="mt-1 w-[250px] h-8" 
                      readOnly 
                      value={selectedShow?.projectNumber || ''} 
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Project Name</Label>
                    <Input 
                      className="mt-1 w-[250px] h-8" 
                      readOnly 
                      value={selectedShow?.project || ''} 
                    />
                  </div>
                </div>
              </div>

              {/* Facility Section */}
              <div>
                <h3 className="text-base font-semibold mb-4">Facility</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Facility ID</Label>
                    <Input className="mt-1 w-[250px] h-8" readOnly />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Facility Name</Label>
                    <Input className="mt-1 w-[250px] h-8" readOnly />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Facility Address</Label>
                    <Input className="mt-1 w-[250px] h-8" readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Schedule For</Label>
                <Select defaultValue="hours-by-date">
                  <SelectTrigger className="w-[200px] h-8">
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours-by-date">Hours By Date</SelectItem>
                    <SelectItem value="other">Other Options</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="text-xs font-medium">Schedule Type</TableHead>
                      <TableHead className="text-xs font-medium">Schedule Date / Time From</TableHead>
                      <TableHead className="text-xs font-medium">From Day</TableHead>
                      <TableHead className="text-xs font-medium">Schedule Date/Time To</TableHead>
                      <TableHead className="text-xs font-medium">To Day</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Show Hours</TableCell>
                      <TableCell>17-MAR-2025 10:00:00</TableCell>
                      <TableCell>Monday</TableCell>
                      <TableCell>17-MAR-2025 17:00:00</TableCell>
                      <TableCell>Monday</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Show Hours</TableCell>
                      <TableCell>18-MAR-2025 10:00:00</TableCell>
                      <TableCell>Tuesday</TableCell>
                      <TableCell>18-MAR-2025 17:00:00</TableCell>
                      <TableCell>Tuesday</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Show Hours</TableCell>
                      <TableCell>19-MAR-2025 10:00:00</TableCell>
                      <TableCell>Wednesday</TableCell>
                      <TableCell>19-MAR-2025 17:00:00</TableCell>
                      <TableCell>Wednesday</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Show Hours</TableCell>
                      <TableCell>20-MAR-2025 09:00:00</TableCell>
                      <TableCell>Thursday</TableCell>
                      <TableCell>20-MAR-2025 13:00:00</TableCell>
                      <TableCell>Thursday</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t p-6">
          <div className="flex justify-end gap-2">
          </div>
        </div>
        <div className="border-t p-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSchedules(false)}>
              Cancel
            </Button>
            <Button variant="success">
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Facility Vendors Form container */}
      <motion.div
        style={{ marginTop: "0px" }}
        className={cn(
          "fixed inset-0 w-[800px] bg-white shadow-xl z-50 border-l flex flex-col ml-auto",
          "transition-all duration-300 ease-in-out",
          showVendorInfo
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">Facility Vendors Form</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVendorInfo(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* Facility Details Section */}
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="text-lg font-medium">Facility Details</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Show Occurrence ID</Label>
                  <Input 
                    className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Project Name</Label>
                  <Input 
                    className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Project Number</Label>
                  <Input 
                    className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Facility Name</Label>
                  <Input 
                    className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Facility ID</Label>
                  <Input 
                    className="h-8 border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Vendor Information Table */}
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="text-lg font-medium">Vendor Information</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-2 text-left text-sm">Vendor Type</th>
                      <th className="border px-4 py-2 text-left text-sm">Vendor Name</th>
                      <th className="border px-4 py-2 text-left text-sm">PO Number</th>
                      <th className="border px-4 py-2 text-left text-sm">Contact Name</th>
                      <th className="border px-4 py-2 text-left text-sm">Area Code</th>
                      <th className="border px-4 py-2 text-left text-sm">Contact Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(4)].map((_, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GES Subcontractor Information Table */}
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="text-lg font-medium">GES Subcontractor Information</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-2 text-left text-sm">Subcont. Type</th>
                      <th className="border px-4 py-2 text-left text-sm">Vendor Name</th>
                      <th className="border px-4 py-2 text-left text-sm">PO Number</th>
                      <th className="border px-4 py-2 text-left text-sm">Contact Name</th>
                      <th className="border px-4 py-2 text-left text-sm">Area Code</th>
                      <th className="border px-4 py-2 text-left text-sm">Contact Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(4)].map((_, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                        <td className="border px-4 py-2">
                          <Input className="h-8 w-full border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}

