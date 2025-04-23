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
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { ArrowDownCircle } from "lucide-react";
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

interface OccurrenceData {
  id: string;
  showId: string;
  occrId: string;
  occrType: string;
  startDate: string;
  endDate: string;
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

// Mock data for occurrences
const mockOccurrences: OccurrenceData[] = [
  {
    id: "1",
    showId: "AWS23",
    occrId: "AWS23-LV",
    occrType: "Annual Conference",
    startDate: "2024-11-01",
    endDate: "2024-11-05",
  },
  {
    id: "2",
    showId: "CES24",
    occrId: "CES24-LV",
    occrType: "Trade Show",
    startDate: "2024-01-09",
    endDate: "2024-01-12",
  },
];

interface NewShowFormData {
  showId: string;
  showName: string;
  occrId: string;
  occrType: string;
  marketType: string;
  projectNumber: string;
  cityOrg: string;
  yrmo: string;
}

interface NewOccrFormData {
  showId: string;
  occrId: string;
  occrType: string;
  startDate: string;
  endDate: string;
}

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
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const [newShowData, setNewShowData] = useState<NewShowFormData>({
    showId: "",
    showName: "",
    occrId: "",
    occrType: "",
    marketType: "",
    projectNumber: "",
    cityOrg: "",
    yrmo: "",
  });

  const handleNewShowInputChange = (
    field: keyof NewShowFormData,
    value: string
  ) => {
    setNewShowData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateShow = () => {
    const newShow = {
      id: newShowData.showId,
      name: newShowData.showName,
      occrId: newShowData.occrId,
      occrType: newShowData.occrType,
      marketType: newShowData.marketType,
      project: newShowData.projectNumber,
      cityOrg: newShowData.cityOrg,
      yrmo: newShowData.yrmo,
    };

    setShows((prevShows) => [...prevShows, newShow]);
    setIsNewShowOpen(false);
    setNewShowData({
      showId: "",
      showName: "",
      occrId: "",
      occrType: "",
      marketType: "",
      projectNumber: "",
      cityOrg: "",
      yrmo: "",
    });
  };

  const [isNewShowOpen, setIsNewShowOpen] = useState(false);

  const toggleNewShow = () => {
    setIsNewShowOpen(!isNewShowOpen);
    if (!isNewShowOpen) {
      // Reset form when opening
      setNewShowData({
        showId: "",
        showName: "",
        occrId: "",
        occrType: "",
        marketType: "",
        projectNumber: "",
        cityOrg: "",
        yrmo: "",
      });
    }
  };

  // Handle show selection for editing
  const handleShowSelect = (show: ShowData) => {
    setSelectedShow(show);
    setIsEditing(false);
    // Reset occurrence data when selecting a new show
    const matchingOccurrence = mockOccurrences.find(
      (occr) => occr.showId === show.id
    );
    if (matchingOccurrence) {
      setSelectedOccurrence(matchingOccurrence);
      setNewOccrData({
        showId: matchingOccurrence.showId,
        occrId: matchingOccurrence.occrId,
        occrType: matchingOccurrence.occrType,
        startDate: matchingOccurrence.startDate,
        endDate: matchingOccurrence.endDate,
      });
    }
  };

  // Update existing show
  const handleUpdateShow = () => {
    if (!selectedShow) return;

    setShows((prevShows) =>
      prevShows.map((show) =>
        show.id === selectedShow.id
          ? {
              id: newShowData.showId,
              name: newShowData.showName,
              occrId: newShowData.occrId,
              occrType: newShowData.occrType,
              marketType: newShowData.marketType,
              project: newShowData.projectNumber,
              cityOrg: newShowData.cityOrg,
              yrmo: newShowData.yrmo,
            }
          : show
      )
    );

    setIsNewShowOpen(false);
    setIsEditing(false);
    setSelectedShow(null);
    setNewShowData({
      showId: "",
      showName: "",
      occrId: "",
      occrType: "",
      marketType: "",
      projectNumber: "",
      cityOrg: "",
      yrmo: "",
    });
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

  const [occurrences, setOccurrences] =
    useState<OccurrenceData[]>(mockOccurrences);
  const [selectedOccurrence, setSelectedOccurrence] =
    useState<OccurrenceData | null>(null);
  const [isEditingOccr, setIsEditingOccr] = useState(false);
  const [isNewOccrOpen, setIsNewOccrOpen] = useState(false);
  const [showDeleteOccrDialog, setShowDeleteOccrDialog] = useState(false);

  const [newOccrData, setNewOccrData] = useState<NewOccrFormData>({
    showId: "",
    occrId: "",
    occrType: "",
    startDate: "",
    endDate: "",
  });

  const handleNewOccrInputChange = (
    field: keyof NewOccrFormData,
    value: string
  ) => {
    setNewOccrData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateOccr = () => {
    const newOccurrence: OccurrenceData = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      showId: newOccrData.showId,
      occrId: newOccrData.occrId,
      occrType: newOccrData.occrType,
      startDate: newOccrData.startDate,
      endDate: newOccrData.endDate,
    };

    setOccurrences((prevOccurrences) => [...prevOccurrences, newOccurrence]);
    setIsNewOccrOpen(false);
    setNewOccrData({
      showId: "",
      occrId: "",
      occrType: "",
      startDate: "",
      endDate: "",
    });
  };

  // Handle occurrence selection for editing
  const handleOccrSelect = (occurrence: OccurrenceData) => {
    setSelectedOccurrence(occurrence);
    setIsEditingOccr(true);
    setNewOccrData({
      showId: occurrence.showId,
      occrId: occurrence.occrId,
      occrType: occurrence.occrType,
      startDate: occurrence.startDate,
      endDate: occurrence.endDate,
    });
    setIsNewOccrOpen(true);
  };

  // Update existing occurrence
  const handleUpdateOccr = () => {
    if (!selectedOccurrence) return;

    setOccurrences((prevOccurrences) =>
      prevOccurrences.map((occr) =>
        occr.id === selectedOccurrence.id
          ? {
              ...occr,
              showId: newOccrData.showId,
              occrId: newOccrData.occrId,
              occrType: newOccrData.occrType,
              startDate: newOccrData.startDate,
              endDate: newOccrData.endDate,
            }
          : occr
      )
    );

    setIsNewOccrOpen(false);
    setIsEditingOccr(false);
    setSelectedOccurrence(null);
    setNewOccrData({
      showId: "",
      occrId: "",
      occrType: "",
      startDate: "",
      endDate: "",
    });
  };

  // Delete occurrence
  const handleDeleteOccr = (occurrence: OccurrenceData) => {
    setSelectedOccurrence(occurrence);
    setShowDeleteOccrDialog(true);
  };

  const confirmDeleteOccr = () => {
    if (!selectedOccurrence) return;

    setOccurrences((prevOccurrences) =>
      prevOccurrences.filter((occr) => occr.id !== selectedOccurrence.id)
    );
    setShowDeleteOccrDialog(false);
    setSelectedOccurrence(null);
  };

  // Add these animation variants
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

  // Add these handler functions
  const handleChevronClick = (
    e: React.MouseEvent,
    type: "show" | "project"
  ) => {
    e.stopPropagation();
    if (type === "show") {
      setSelectedShow(null);
      setSelectedProject(null);
    } else {
      setSelectedProject(null);
    }
  };

  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("projectInfo");

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

  const handleProjectExpand = (project: ProjectData) => {
    setSelectedProject(project);
  };

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Shows : Show Information", href: "/shows" },
      ]}
      breadcrumbClassName="text-lg py-4 bg-gray-50 border-b border-gray-200"
    >
      <div className="space-y-6 p-6">
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
            <Button variant="outline" className="gap-2">
              <span>Filters</span>
            </Button>
            <Button
              className={`gap-2 ${
                isNewShowOpen
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
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
              className={`gap-2 ${
                isNewOccrOpen
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
              onClick={() => setIsNewOccrOpen(!isNewOccrOpen)}
            >
              <Plus
                className={`h-4 w-4 transition-transform ${
                  isNewOccrOpen ? "rotate-45" : ""
                }`}
              />
              <span>New Occr</span>
            </Button>
          </div>

          <AnimatePresence>
            {isNewShowOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-lg p-8">
                  <h2 className="text-2xl font-semibold mb-8">New Show</h2>
                  <div className="space-y-6">
                    {/* First Row */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="showId"
                          className="text-base font-medium"
                        >
                          Show ID
                        </Label>
                        <Input
                          id="showId"
                          placeholder="Enter showId"
                          value={newShowData.showId}
                          onChange={(e) =>
                            handleNewShowInputChange("showId", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="showName"
                          className="text-base font-medium"
                        >
                          Show Name
                        </Label>
                        <Input
                          id="showName"
                          placeholder="Enter showName"
                          value={newShowData.showName}
                          onChange={(e) =>
                            handleNewShowInputChange("showName", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="occrId"
                          className="text-base font-medium"
                        >
                          Occr ID
                        </Label>
                        <Input
                          id="occrId"
                          placeholder="Enter occrId"
                          value={newShowData.occrId}
                          onChange={(e) =>
                            handleNewShowInputChange("occrId", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="occrType"
                          className="text-base font-medium"
                        >
                          Occr Type
                        </Label>
                        <Input
                          id="occrType"
                          placeholder="Enter occrType"
                          value={newShowData.occrType}
                          onChange={(e) =>
                            handleNewShowInputChange("occrType", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="marketType"
                          className="text-base font-medium"
                        >
                          Market Type
                        </Label>
                        <Input
                          id="marketType"
                          placeholder="Enter marketType"
                          value={newShowData.marketType}
                          onChange={(e) =>
                            handleNewShowInputChange(
                              "marketType",
                              e.target.value
                            )
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="projectNumber"
                          className="text-base font-medium"
                        >
                          Project Number
                        </Label>
                        <Input
                          id="projectNumber"
                          placeholder="Enter projectNumber"
                          value={newShowData.projectNumber}
                          onChange={(e) =>
                            handleNewShowInputChange(
                              "projectNumber",
                              e.target.value
                            )
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Third Row */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="cityOrg"
                          className="text-base font-medium"
                        >
                          City Org
                        </Label>
                        <Input
                          id="cityOrg"
                          placeholder="Enter cityOrg"
                          value={newShowData.cityOrg}
                          onChange={(e) =>
                            handleNewShowInputChange("cityOrg", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yrmo" className="text-base font-medium">
                          YRMO
                        </Label>
                        <Input
                          id="yrmo"
                          placeholder="Enter yrmo"
                          value={newShowData.yrmo}
                          onChange={(e) =>
                            handleNewShowInputChange("yrmo", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsNewShowOpen(false);
                          setIsEditing(false);
                          setSelectedShow(null);
                          setNewShowData({
                            showId: "",
                            showName: "",
                            occrId: "",
                            occrType: "",
                            marketType: "",
                            projectNumber: "",
                            cityOrg: "",
                            yrmo: "",
                          });
                        }}
                        className="h-11 px-6 text-base font-medium"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={
                          isEditing ? handleUpdateShow : handleCreateShow
                        }
                        className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
                      >
                        {isEditing ? "Update Show" : "Create Show"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isNewOccrOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-lg p-8">
                  <h2 className="text-2xl font-semibold mb-8">
                    {isEditingOccr ? "Edit Occurrence" : "New Occurrence"}
                  </h2>
                  <div className="space-y-6">
                    {/* First Row */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="occrShowId"
                          className="text-base font-medium"
                        >
                          Show ID
                        </Label>
                        <Input
                          id="occrShowId"
                          placeholder="Enter Show ID"
                          value={newOccrData.showId}
                          onChange={(e) =>
                            handleNewOccrInputChange("showId", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="occrId"
                          className="text-base font-medium"
                        >
                          Occr ID
                        </Label>
                        <Input
                          id="occrId"
                          placeholder="Enter Occr ID"
                          value={newOccrData.occrId}
                          onChange={(e) =>
                            handleNewOccrInputChange("occrId", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="occrType"
                          className="text-base font-medium"
                        >
                          Occr Type
                        </Label>
                        <Select
                          value={newOccrData.occrType}
                          onValueChange={(value) =>
                            handleNewOccrInputChange("occrType", value)
                          }
                        >
                          <SelectTrigger className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual-conference">
                              Annual Conference
                            </SelectItem>
                            <SelectItem value="trade-show">
                              Trade Show
                            </SelectItem>
                            <SelectItem value="developer-conference">
                              Developer Conference
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="startDate"
                          className="text-base font-medium"
                        >
                          Start Date
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newOccrData.startDate}
                          onChange={(e) =>
                            handleNewOccrInputChange(
                              "startDate",
                              e.target.value
                            )
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="endDate"
                          className="text-base font-medium"
                        >
                          End Date
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newOccrData.endDate}
                          onChange={(e) =>
                            handleNewOccrInputChange("endDate", e.target.value)
                          }
                          className="h-12 px-4 border border-gray-200 rounded-md focus:ring-0 focus:border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsNewOccrOpen(false);
                          setIsEditingOccr(false);
                          setSelectedOccurrence(null);
                          setNewOccrData({
                            showId: "",
                            occrId: "",
                            occrType: "",
                            startDate: "",
                            endDate: "",
                          });
                        }}
                        className="h-11 px-6 text-base font-medium"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={
                          isEditingOccr ? handleUpdateOccr : handleCreateOccr
                        }
                        className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
                      >
                        {isEditingOccr
                          ? "Update Occurrence"
                          : "Create Occurrence"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                    onClick={() => handleSort("id")}
                    className="cursor-pointer text-center font-bold text-gray-900"
                  >
                    <div className="flex items-center justify-center gap-2">
                      Show ID
                      <span className="ml-1">{getSortIcon("id")}</span>
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("name")}
                    className="cursor-pointer text-center font-bold text-gray-900"
                  >
                    <div className="flex items-center justify-center gap-2">
                      Show Name
                      <span className="ml-1">{getSortIcon("name")}</span>
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
                      <span className="ml-1">{getSortIcon("marketType")}</span>
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("project")}
                    className="cursor-pointer text-center font-bold text-gray-900"
                  >
                    <div className="flex items-center justify-center gap-2">
                      Project#
                      <span className="ml-1">{getSortIcon("project")}</span>
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
                  <TableHead className="cursor-pointer text-center font-bold text-gray-900">
                    Occurrences
                  </TableHead>
                  <TableHead className="cursor-pointer text-center font-bold text-gray-900">
                    Actions
                  </TableHead>
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
                    <TableCell className="text-center">{show.id}</TableCell>
                    <TableCell className="text-center">{show.name}</TableCell>
                    <TableCell className="text-center">{show.occrId}</TableCell>
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
                      {show.project}
                    </TableCell>
                    <TableCell className="text-center">
                      {show.cityOrg}
                    </TableCell>
                    <TableCell className="text-center">{show.yrmo}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {occurrences.filter((o) => o.showId === show.id).length}
                        {occurrences
                          .filter((o) => o.showId === show.id)
                          .map((occurrence) => (
                            <div key={occurrence.id} className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOccrSelect(occurrence);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOccr(occurrence);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowSelect(show);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteShow(show);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Show Occurrences Section with AnimatePresence */}
        <AnimatePresence>
          {selectedShow && (
            <div className="relative" style={{ marginTop: "-40px" }}>
              {/* Container for first chevron */}
              <div className="relative h-10 mb-6 mt-2">
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
                  onClick={(e) => handleChevronClick(e, "show")}
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
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Show Occurrences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Section 1: Show */}
                    <Card className="shadow-sm">
                      <CardHeader className="py-3">
                        <CardTitle className="text-base font-semibold">
                          Show Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-3 gap-4 py-3">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">
                            Show Name
                          </Label>
                          <Input
                            value={selectedShow.name}
                            readOnly
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Show ID</Label>
                          <Input
                            value={selectedShow.id}
                            readOnly
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">
                            Description
                          </Label>
                          <Input className="h-9" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Section 2: Show Details */}
                    <div className="space-y-4">
                      {/* Section 2.2: Show Dates */}
                      <Card className="shadow-sm">
                        <CardHeader className="py-3">
                          <CardTitle className="text-base font-semibold">
                            Show Dates
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 py-3">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Open</Label>
                            <Input type="datetime-local" className="h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Close</Label>
                            <Input type="datetime-local" className="h-9" />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Section 2.3: Timezone and Customers */}
                      <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 py-4">
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-sm font-medium">
                              Timezone
                            </Label>
                            <Input
                              placeholder="Enter timezone"
                              className="h-9"
                            />
                          </div>
                          <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 h-9 self-end">
                            Customers
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Section 3: Tabs */}
                    <Card className="shadow-sm">
                      <CardContent className="pt-4 pb-2">
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
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-sm font-medium">
                                      Project Name
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
                                      Project Number
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
                                      Project Type
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
                                      Status
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
                                      Production City
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
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
                                    <TableCell className="py-2">
                                      {mockProjectData.projectName}
                                    </TableCell>
                                    <TableCell className="py-2">
                                      {mockProjectData.projectNumber}
                                    </TableCell>
                                    <TableCell className="py-2">
                                      {mockProjectData.projectType}
                                    </TableCell>
                                    <TableCell className="py-2">
                                      {mockProjectData.status}
                                    </TableCell>
                                    <TableCell className="py-2">
                                      {mockProjectData.productionCity}
                                    </TableCell>
                                    <TableCell className="py-2">
                                      {mockProjectData.facilityId}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                              <div className="flex justify-end gap-2">
                                <Button
                                  className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4"
                                  onClick={() =>
                                    handleProjectExpand(mockProjectData)
                                  }
                                >
                                  Project Facilities
                                </Button>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
                                  Key Contacts
                                </Button>
                              </div>
                            </TabsContent>

                            {/* Key Dates Tab */}
                            <TabsContent value="keyDates" className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium">
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
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-sm font-medium">
                                      Date Type
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
                                      Project Number
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
                                      Facility ID
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
                                      Date/time
                                    </TableHead>
                                    <TableHead className="text-sm font-medium">
                                      Notes
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="py-2">-</TableCell>
                                    <TableCell className="py-2">-</TableCell>
                                    <TableCell className="py-2">-</TableCell>
                                    <TableCell className="py-2">-</TableCell>
                                    <TableCell className="py-2">-</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TabsContent>

                            {/* General Info Tab */}
                            <TabsContent
                              value="generalInfo"
                              className="space-y-6"
                            >
                              {/* Section 3.3.1: Exh Total Sq Ft */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">
                                  Exh Total Sq Ft
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">
                                      Projected
                                    </Label>
                                    <Input className="h-9" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">
                                      Actual
                                    </Label>
                                    <Input className="h-9" />
                                  </div>
                                </div>
                              </div>

                              {/* Section 3.3.2: Exh Freight */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">
                                  Exh Freight
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">
                                      Projected
                                    </Label>
                                    <Input className="h-9" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">
                                      Actual
                                    </Label>
                                    <Input className="h-9" />
                                  </div>
                                </div>
                              </div>

                              {/* Section 3.3.3: Graphics Sq Ft */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">
                                  Graphics Sq Ft
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">
                                      Projected
                                    </Label>
                                    <Input className="h-9" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label className="text-sm font-medium">
                                      Actual
                                    </Label>
                                    <Input className="h-9" />
                                  </div>
                                </div>
                              </div>

                              {/* Section 3.3.4: Other Details */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">
                                  Other Details
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
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
                                    <Checkbox id="rtw" className="h-4 w-4" />
                                    <Label htmlFor="rtw" className="text-sm">
                                      No RTW
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="ops" className="h-4 w-4" />
                                    <Label htmlFor="ops" className="text-sm">
                                      Natl Ops Team
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="design" className="h-4 w-4" />
                                    <Label htmlFor="design" className="text-sm">
                                      Design Collaboration
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="clean" className="h-4 w-4" />
                                    <Label htmlFor="clean" className="text-sm">
                                      Clean Floor Policy
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="booth" className="h-4 w-4" />
                                    <Label htmlFor="booth" className="text-sm">
                                      Show Org Booth Pkg
                                    </Label>
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium">
                                    Tier Pricing
                                  </Label>
                                  <Input className="h-9" />
                                </div>
                              </div>

                              {/* Section 3.3.5: Comments */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">
                                  Comments
                                </h4>
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium">
                                    Freight Info
                                  </Label>
                                  <Textarea className="min-h-[80px]" />
                                </div>
                              </div>

                              {/* Section 3.3.6: Show Package */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">
                                  Show Package
                                </h4>
                                <div className="space-y-3">
                                  <Textarea className="min-h-[80px]" />
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-sm font-medium">
                                        Specify Logo
                                      </Label>
                                      <Input className="h-9" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-sm font-medium">
                                        Send Exhibitor Survey
                                      </Label>
                                      <Input className="h-9" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </div>
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
                          onClick={(e) => handleChevronClick(e, "project")}
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
                          <CardHeader className="pb-4">
                            <CardTitle className="text-xl">
                              Project Facility Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Section 1: Project */}
                            <Card className="shadow-sm">
                              <CardHeader className="py-3">
                                <CardTitle className="text-base font-semibold">
                                  Project
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-4 py-3">
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium">
                                    Project Number
                                  </Label>
                                  <Input
                                    value={selectedProject.projectNumber}
                                    readOnly
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium">
                                    Project Name
                                  </Label>
                                  <Input
                                    value={selectedProject.projectName}
                                    readOnly
                                    className="h-9"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            {/* Section 2: Registration and Table */}
                            <Card className="shadow-sm">
                              <CardContent className="space-y-4 py-4">
                                <div className="flex justify-end items-center text-sm">
                                  <Label className="font-medium">
                                    Registration:
                                  </Label>
                                  <span className="ml-2 text-gray-600">
                                    ----------------Servicecenter(TM)----------------
                                  </span>
                                </div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-sm font-medium text-center py-2">
                                        Facility ID
                                      </TableHead>
                                      <TableHead className="text-sm font-medium text-center py-2">
                                        Facility Name
                                      </TableHead>
                                      <TableHead className="text-sm font-medium text-center py-2">
                                        Hall
                                      </TableHead>
                                      <TableHead className="text-sm font-medium text-center py-2">
                                        Location
                                      </TableHead>
                                      <TableHead className="text-sm font-medium text-center py-2">
                                        Location
                                      </TableHead>
                                      <TableHead className="text-sm font-medium text-center py-2">
                                        Area Code
                                      </TableHead>
                                      <TableHead className="text-sm font-medium text-center py-2">
                                        Phone
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {mockFacilityData.map((facility) => (
                                      <TableRow key={facility.facilityId}>
                                        <TableCell className="text-center py-2">
                                          {facility.facilityId}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
                                          {facility.facilityName}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
                                          {facility.hall}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
                                          {facility.location1}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
                                          {facility.location2}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
                                          {facility.areaCode}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
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
                              <CardContent className="grid grid-cols-3 gap-4 py-4">
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium">
                                    Notes
                                  </Label>
                                  <Input
                                    placeholder="Enter notes"
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium">
                                    Comments
                                  </Label>
                                  <Input
                                    placeholder="Enter comments"
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium">
                                    Special Instructions
                                  </Label>
                                  <Input
                                    placeholder="Enter special instructions"
                                    className="h-9"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-2">
                              <Button className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
                                Auto-Out
                              </Button>
                              <Button className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
                                Details
                              </Button>
                              <Button className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
                                Schedule
                              </Button>
                              <Button className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
                                Material Handling
                              </Button>
                              <Button className="bg-blue-600 text-white hover:bg-blue-700 h-9 px-4">
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

        {/* Delete Occurrence Dialog */}
        <AlertDialog
          open={showDeleteOccrDialog}
          onOpenChange={setShowDeleteOccrDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                occurrence and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteOccr}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
