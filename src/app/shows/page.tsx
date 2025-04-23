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
import { Plus, Pencil, Trash2, ChevronLeft, ArrowUp } from "lucide-react";
import { ArrowUpDown, ArrowDown } from "lucide-react";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface FilterState {
  showId: string;
  showName: string;
  occrId: string;
  occrType: string;
  marketType: string;
  project: string;
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

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    showId: "",
    showName: "",
    occrId: "",
    occrType: "",
    marketType: "",
    project: "",
    cityOrg: "",
    yrmoStart: "",
    yrmoEnd: "",
  });
  const [activeFilters, setActiveFilters] = useState<Partial<FilterState>>({});

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
        // Search filter
        if (debouncedSearch) {
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
          !show.id.toLowerCase().includes(activeFilters.showId.toLowerCase())
        ) {
          return false;
        }
        if (
          activeFilters.showName &&
          !show.name
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
          activeFilters.project &&
          !show.project
            .toLowerCase()
            .includes(activeFilters.project.toLowerCase())
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
      project: "",
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

  // Add pagination constants
  const ITEMS_PER_PAGE = 10;

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate paginated shows
  const paginatedShows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedShows.slice(startIndex, endIndex);
  }, [filteredAndSortedShows, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedShows.length / ITEMS_PER_PAGE);

  // Back to Top button visibility state and functionality
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll handler with proper cleanup
  useEffect(() => {
    let scrollContainer: HTMLDivElement | null = null;

    // Wait for component to mount and DOM to be ready
    setTimeout(() => {
      scrollContainer = document.querySelector(
        ".h-\\[calc\\(100vh-4rem\\)\\]"
      ) as HTMLDivElement;

      if (scrollContainer) {
        const handleScroll = () => {
          if (scrollContainer) {
            setShowBackToTop(scrollContainer.scrollTop > 400);
          }
        };

        scrollContainer.addEventListener("scroll", handleScroll);

        // Return cleanup function
        return () => {
          if (scrollContainer) {
            scrollContainer.removeEventListener("scroll", handleScroll);
          }
        };
      }
    }, 0);

    // Cleanup in case component unmounts before setTimeout
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", () => {});
      }
    };
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(
      ".h-\\[calc\\(100vh-4rem\\)\\]"
    ) as HTMLDivElement;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Breadcrumb state
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "Home", href: "/" },
    { label: "Shows", href: "/shows" },
  ]);

  // Enhanced breadcrumb handling
  const handleBreadcrumbClick = (
    crumb: { label: string; href: string },
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    switch (crumb.href) {
      case "/":
        router.push("/");
        break;
      case "/shows":
        setSelectedShow(null);
        setShowProjectFacilities(false);
        break;
      case "#show":
        if (showProjectFacilities) {
          setShowProjectFacilities(false);
        }
        break;
      default:
        break;
    }
  };

  // Update breadcrumbs with proper hrefs
  useEffect(() => {
    if (selectedShow) {
      const newBreadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Shows", href: "/shows" },
        { label: selectedShow.name, href: "#show" },
      ];

      if (showProjectFacilities) {
        newBreadcrumbs.push({
          label: "Project Facilities",
          href: "#facilities",
        });
      }

      setBreadcrumbs(newBreadcrumbs);
    } else {
      setBreadcrumbs([
        { label: "Home", href: "/" },
        { label: "Shows", href: "/shows" },
      ]);
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

  const router = useRouter();

  return (
    <MainLayout
      breadcrumbs={breadcrumbs}
      breadcrumbClassName="text-lg py-4 bg-gray-50 border-b border-gray-200"
    >
      <div className="h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden scroll-smooth">
        {/* Custom Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center space-x-2 text-sm px-6 py-3 bg-white border-b sticky top-0 z-10"
        >
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <Link
                href={crumb.href}
                className={cn(
                  "transition-colors",
                  crumb.href === "#"
                    ? "text-gray-600 cursor-default"
                    : "text-blue-600 hover:text-blue-800"
                )}
                onClick={(e) => handleBreadcrumbClick(crumb, e)}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Main content container with improved transitions */}
        <div className="flex h-full relative transition-all duration-500 ease-out">
          {/* Master View (Show Information) */}
          <motion.div
            className={cn(
              "bg-white border-r border-gray-200",
              getContainerWidths().showInfo
            )}
            initial={false}
            animate={{
              width: showProjectFacilities
                ? "15%"
                : selectedShow
                ? "25%"
                : "100%",
              transition: containerTransition,
            }}
            layout // Add layout prop for smoother size changes
          >
            <div
              className={cn(
                "h-full overflow-y-auto overflow-x-hidden scroll-smooth",
                selectedShow ? "p-3" : "p-6"
              )}
            >
              {selectedShow ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <h2 className="text-sm font-semibold">Show Details</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToShows}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Show ID</Label>
                      <div className="text-sm font-medium mt-1">
                        {(selectedShow as ShowData).id}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Occr ID</Label>
                      <div className="text-sm font-medium mt-1">
                        {(selectedShow as ShowData).occrId}
                      </div>
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

                  {/* Filter Panel */}
                  <motion.div
                    className={cn(
                      "bg-muted border rounded-md p-4 space-y-3",
                      "transition-all duration-300 ease-in-out",
                      showFilters
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500">Show ID</Label>
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
                        <Label className="text-sm text-gray-500">
                          Show Name
                        </Label>
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
                        <Label className="text-sm text-gray-500">Occr ID</Label>
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
                        <Label className="text-sm text-gray-500">
                          Occr Type
                        </Label>
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
                        <Label className="text-sm text-gray-500">
                          Market Type
                        </Label>
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
                        <Label className="text-sm text-gray-500">
                          Project #
                        </Label>
                        <Input
                          value={filters.project}
                          onChange={(e) =>
                            handleFilterChange("project", e.target.value)
                          }
                          placeholder="Filter by Project #"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500">
                          City Org
                        </Label>
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
                        <Label className="text-sm text-gray-500">
                          YRMO Range
                        </Label>
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
                      <Button
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={applyFilters}
                      >
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
                            <Input
                              placeholder="Enter timezone"
                              className="h-9 px-3 w-full md:w-3/4"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">
                              Project Number
                            </Label>
                            <Input
                              placeholder="Enter projectNumber"
                              className="h-9 px-3 w-full md:w-3/4"
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
                              className="h-9 px-3 w-full md:w-3/4"
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
                            {paginatedShows.map((show) => (
                              <TableRow
                                key={show.id}
                                className={cn(
                                  "cursor-pointer hover:bg-gray-50",
                                  (selectedShow as unknown as ShowData)?.id ===
                                    show.id && "bg-blue-50 hover:bg-blue-50"
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

                      {/* Pagination */}
                      {!selectedShow && filteredAndSortedShows.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4 text-sm border-t">
                          <div>
                            SHOWING{" "}
                            {Math.min(
                              currentPage * ITEMS_PER_PAGE,
                              filteredAndSortedShows.length
                            )}{" "}
                            OF {filteredAndSortedShows.length} RESULTS
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={currentPage === 1}
                              className="w-8 h-8 p-0"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {[...Array(totalPages)].map((_, i) => (
                              <Button
                                key={i + 1}
                                variant={
                                  currentPage === i + 1 ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(i + 1)}
                                className={cn(
                                  "w-8 h-8 p-0",
                                  currentPage === i + 1 &&
                                    "bg-blue-500 text-white hover:bg-blue-600"
                                )}
                              >
                                {i + 1}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(totalPages, prev + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                              className="w-8 h-8 p-0"
                            >
                              <ChevronLeft className="h-4 w-4 rotate-180" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </motion.div>

          {/* Detail View (Show Occurrences) */}
          <AnimatePresence mode="wait">
            {selectedShow && (
              <motion.div
                className={cn(
                  "bg-white border-r border-gray-200",
                  getContainerWidths().occurrences
                )}
                initial={{ x: "100%", opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  width: showProjectFacilities ? "25%" : "75%",
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
                <div className="h-full overflow-y-auto overflow-x-hidden scroll-smooth">
                  {showProjectFacilities ? (
                    // Minimized view when facilities are shown
                    <div className="p-4 space-y-4">
                      <div className="pb-2 border-b">
                        <h2 className="text-sm font-semibold">Show Summary</h2>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-500">
                            Show Name
                          </Label>
                          <div className="text-sm font-medium mt-1">
                            {selectedShow.name}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">YRMO</Label>
                          <div className="text-sm font-medium mt-1">
                            {selectedShow.yrmo}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">
                            Project Number
                          </Label>
                          <div className="text-sm font-medium mt-1">
                            {selectedShow.project}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Full view
                    <div className="p-4">
                      <div className="max-w-5xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center justify-between pb-2 mb-4 border-b">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleBackToShows}
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
                                        onClick={() =>
                                          setShowProjectFacilities(true)
                                        }
                                        className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4"
                                      >
                                        Project Facilities
                                      </Button>
                                      <Button className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
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
                className={cn("bg-white", getContainerWidths().facilities)}
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
                <div className="h-full overflow-y-auto overflow-x-hidden scroll-smooth">
                  <div className="p-4 max-w-[1200px] mx-auto">
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
                            <Input placeholder="Enter notes" className="h-9" />
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Top Button */}
          <AnimatePresence>
            {showBackToTop && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-50"
              >
                <ArrowUp className="h-5 w-5" />
              </motion.button>
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
