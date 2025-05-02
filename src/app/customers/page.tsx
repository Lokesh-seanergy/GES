"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X, ChevronRight } from "lucide-react";
import { User, Ruler, FileText } from "lucide-react";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import {
  mockShows,
  mockCustomers,
  mockFacilityData,
  mockProjectData,
  type ShowData,
  type CustomerData,
  type CustomerType,
  type FacilityData,
} from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React from "react";
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
import { ScrollToTop } from "@/components/ui/scroll-to-top";

interface SummaryData {
  exhibitor: {
    customerCount: number;
    metric2: number;
    metric3: number;
  };
  ee: {
    customerCount: number;
    metric2: number;
    metric3: number;
  };
  thirdParty: {
    customerCount: number;
    metric2: number;
    metric3: number;
  };
}

const customerTypes: CustomerType[] = ["Exhibitors", "ShowOrg", "3rd party"];
interface EditedCustomer extends Omit<CustomerData, 'type'> {
  type: CustomerType[];
  cityStateZip?: string;
}

function CustomersContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get show parameters from URL
  const showNameFromUrl = searchParams.get('showName');
  const occrIdFromUrl = searchParams.get('occrId');
  const showIdFromUrl = searchParams.get('showId');

  const [searchQuery, setSearchQuery] = useState("");
  const [showName, setShowName] = useState(showNameFromUrl || "");
  const [occrId, setOccrId] = useState(occrIdFromUrl || "");
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
    ee: { customerCount: 0, metric2: 0, metric3: 0 },
    thirdParty: { customerCount: 0, metric2: 0, metric3: 0 },
  });

  // Initialize with filtered customers if show ID is provided
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>(
    showIdFromUrl ? mockCustomers.filter(customer => customer.showId === showIdFromUrl) : []
  );

  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(
    null
  );
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] =
    useState<CustomerData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<EditedCustomer | null>(null);
  const [key, setKey] = useState(Date.now());
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const occrIdInputRef = useRef<HTMLInputElement>(null);
  const showNameInputRef = useRef<HTMLInputElement>(null);
  const [prioritizedCustomers, setPrioritizedCustomers] = useState<CustomerData[]>(
    []
  );

  // Find the current show and its project
  const currentShow = mockShows.find(show => show.occrId === occrId && show.showName === showName);
  const currentProject = currentShow
    ? mockProjectData.find(project => project.projectNumber === currentShow.projectNumber)
    : undefined;
  const currentFacilityId = currentProject?.facilityId || 'N/A';

  const resetPage = useCallback(() => {
    setSearchQuery("");
    setShowName("");
    setOccrId("");
    setShowSummary(false);
    setFilteredCustomers([]);
    setSummaryData({
      exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
      ee: { customerCount: 0, metric2: 0, metric3: 0 },
      thirdParty: { customerCount: 0, metric2: 0, metric3: 0 },
    });
    setExpandedCustomerId(null);
    setPrioritizedCustomers([]);
    setSelectedCustomerForEdit(null);
    setIsDialogOpen(false);
    setKey(Date.now());

    // Clear any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  const handleCustomerBreadcrumbClick = () => {
    // Reset all form inputs and data
    resetPage();

    // Reset URL without triggering navigation events
    router.replace("/customers");
  };

  const calculateSummaryData = (show: ShowData | null) => {
    if (!show) {
      setSummaryData({
        exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
        ee: { customerCount: 0, metric2: 0, metric3: 0 },
        thirdParty: { customerCount: 0, metric2: 0, metric3: 0 },
      });
      setFilteredCustomers([]);
      setPrioritizedCustomers([]);
      return;
    }

    const showCustomers = mockCustomers.filter(
      (customer) => customer.showId === show.showId
    );
    setFilteredCustomers(showCustomers);
    setPrioritizedCustomers(showCustomers);

    const exhibitorCustomers = showCustomers.filter((c) =>
      c.type.includes("Exhibitors")
    );
    const eeCustomers = showCustomers.filter((c) => c.type.includes("ShowOrg"));
    const thirdPartyCustomers = showCustomers.filter((c) =>
      c.type.includes("3rd party")
    );

    // Calculate total booth sizes for each type
    const calculateTotalBoothArea = (customers: CustomerData[]) =>
      customers.reduce((total, c) => {
        const length = parseFloat(c.boothLength || '0');
        const width = parseFloat(c.boothWidth || '0');
        return total + (isNaN(length) || isNaN(width) ? 0 : length * width);
      }, 0);

    const exhibitorOrderCount = exhibitorCustomers.reduce((total, c) => total + c.orders, 0);
    const eeOrderCount = eeCustomers.reduce((total, c) => total + c.orders, 0);
    const thirdPartyOrderCount = thirdPartyCustomers.reduce((total, c) => total + c.orders, 0);
    const totalOrders = exhibitorOrderCount + eeOrderCount + thirdPartyOrderCount;

    setSummaryData({
      exhibitor: {
        customerCount: exhibitorCustomers.length,
        metric2: calculateTotalBoothArea(exhibitorCustomers),
        metric3: totalOrders,
      },
      ee: {
        customerCount: eeCustomers.length,
        metric2: calculateTotalBoothArea(eeCustomers),
        metric3: 0,
      },
      thirdParty: {
        customerCount: thirdPartyCustomers.length,
        metric2: calculateTotalBoothArea(thirdPartyCustomers),
        metric3: 0,
      },
    });
  };

  // Completely revamped input handlers
  const handleOccrIdChange = (value: string) => {
    setOccrId(value);

    // Cancel any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If input is cleared manually, reset everything
    if (!value.trim()) {
      setShowName("");
      setShowSummary(false);
      setFilteredCustomers([]);
      setSummaryData({
        exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
        ee: { customerCount: 0, metric2: 0, metric3: 0 },
        thirdParty: { customerCount: 0, metric2: 0, metric3: 0 },
      });
      router.push("/customers", { scroll: false });
      return; // Don't proceed to search timeout
    }

    // Set up new search with delay only if input is not empty
    searchTimeoutRef.current = setTimeout(() => {
      const foundShow = mockShows.find((show) =>
        show.occrId.toLowerCase().includes(value.toLowerCase())
      );

      if (foundShow) {
        setShowName(foundShow.showName); // Update the other field
        setShowSummary(true);
        calculateSummaryData(foundShow);
        router.push(
          `/customers?showName=${encodeURIComponent(
            foundShow.showName
          )}&occrId=${encodeURIComponent(foundShow.occrId)}`,
          { scroll: false }
        );
      } else {
        // Keep the typed text, but clear results if no show found
        setShowSummary(false);
        calculateSummaryData(null);
        // Optionally clear the other field if desired, or leave it
        // setShowName("");
      }
    }, 300);
  };

  const handleShowNameChange = (value: string) => {
    setShowName(value);

    // Cancel any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If input is cleared manually, reset everything
    if (!value.trim()) {
      setOccrId("");
      setShowSummary(false);
      setFilteredCustomers([]);
      setSummaryData({
        exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
        ee: { customerCount: 0, metric2: 0, metric3: 0 },
        thirdParty: { customerCount: 0, metric2: 0, metric3: 0 },
      });
      router.push("/customers", { scroll: false });
      return; // Don't proceed to search timeout
    }

    // Set up new search with delay only if input is not empty
    searchTimeoutRef.current = setTimeout(() => {
      const foundShow = mockShows.find((show) =>
        show.showName.toLowerCase().includes(value.toLowerCase())
      );

      if (foundShow) {
        setOccrId(foundShow.occrId); // Update the other field
        setShowSummary(true);
        calculateSummaryData(foundShow);
        router.push(
          `/customers?showName=${encodeURIComponent(
            foundShow.showName
          )}&occrId=${encodeURIComponent(foundShow.occrId)}`,
          { scroll: false }
        );
      } else {
        // Keep the typed text, but clear results if no show found
        setShowSummary(false);
        calculateSummaryData(null);
        // Optionally clear the other field if desired, or leave it
        // setOccrId("");
      }
    }, 300);
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    setExpandedCustomerId(null);

    // Cancel any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Update without search if empty
    if (!value.trim()) {
      return;
    }

    // Set up new search with delay
    searchTimeoutRef.current = setTimeout(() => {
      const foundShow = mockShows.find(
        (show) =>
          show.showId.toLowerCase().includes(value.toLowerCase()) ||
          show.showName.toLowerCase().includes(value.toLowerCase()) ||
          show.occrId.toLowerCase().includes(value.toLowerCase())
      );

      if (foundShow) {
        setShowName(foundShow.showName);
        setOccrId(foundShow.occrId);
        setShowSummary(true);
        calculateSummaryData(foundShow);
        router.push(
          `/customers?showName=${encodeURIComponent(
            foundShow.showName
          )}&occrId=${encodeURIComponent(foundShow.occrId)}`
        );
      } else if (value.length > 2) {
        // Keep the text but clear results
        setShowSummary(false);
        calculateSummaryData(null);
      }
    }, 300);
  };

  useEffect(() => {
    const urlShowName = searchParams.get("showName");
    const urlOccrId = searchParams.get("occrId");

    const isInitialLoad = !showName && !occrId;

    if (urlShowName && urlOccrId) {
      setShowName(urlShowName);
      setOccrId(urlOccrId);
      setShowSummary(true);
      setExpandedCustomerId(null);
      setPrioritizedCustomers([]);

      const foundShow = mockShows.find(
        (show) => show.showName === urlShowName && show.occrId === urlOccrId
      );

      if (foundShow) {
        calculateSummaryData(foundShow);
      }
    } else if (isInitialLoad && pathname === "/customers") {
      resetPage();
    }
  }, [searchParams, pathname, resetPage, showName, occrId]);

  useEffect(() => {
    if (showIdFromUrl) {
      const show = mockShows.find(s => s.showId === showIdFromUrl);
      if (show) {
        setShowName(show.showName);
        setOccrId(show.occrId);
        setShowSummary(true);
        const customers = mockCustomers.filter(c => c.showId === showIdFromUrl);
        setFilteredCustomers(customers);
        calculateSummaryData(show);
      }
    }
  }, [showIdFromUrl]);

  const handleCustomerCardClick = (customerId: string) => {
    const selectedCustomer = filteredCustomers.find((c) => c.id === customerId);
    if (selectedCustomer) {
      const remainingCustomers = filteredCustomers.filter(
        (c) => c.id !== customerId
      );
      setPrioritizedCustomers([selectedCustomer, ...remainingCustomers]);
      setExpandedCustomerId(customerId);
      setExpandedRow(customerId);
    }
  };

  const openEditDialog = (customer: CustomerData) => {
    if (!customer) return;
    setSelectedCustomerForEdit(customer);
    setEditedCustomer({ ...customer } as EditedCustomer);
    setIsDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedCustomer?.customerName?.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!editedCustomer?.customerId?.trim()) {
      newErrors.customerId = "Customer ID is required";
    }

    if (!editedCustomer?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (editedCustomer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedCustomer.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!editedCustomer?.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (editedCustomer.phone && !/^[\d\s\-()]+$/.test(editedCustomer.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (editedCustomer?.boothNumber && !editedCustomer.boothNumber.trim()) {
      newErrors.boothNumber = "Booth number cannot be empty";
    }

    if (editedCustomer?.facilityId && !editedCustomer.facilityId.trim()) {
      newErrors.facilityId = "Facility ID cannot be empty";
    }

    if (editedCustomer?.type.includes("3rd party")) {
      if (!editedCustomer?.subContractor?.name?.trim()) {
        newErrors["subContractor.name"] =
          "Subcontractor name is required for 3rd party";
      }

      if (!editedCustomer?.subContractor?.email?.trim()) {
        newErrors["subContractor.email"] = "Subcontractor email is required";
      } else if (
        editedCustomer.subContractor?.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedCustomer.subContractor.email)
      ) {
        newErrors["subContractor.email"] = "Please enter a valid email address";
      }

      if (!editedCustomer?.subContractor?.phone?.trim()) {
        newErrors["subContractor.phone"] = "Subcontractor phone is required";
      } else if (
        editedCustomer.subContractor?.phone &&
        !/^[\d\s\-()]+$/.test(editedCustomer.subContractor.phone)
      ) {
        newErrors["subContractor.phone"] = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!editedCustomer) return;
    
    try {
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedCustomer),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      setFilteredCustomers((prevCustomers) => {
        if (!prevCustomers) return prevCustomers;
        return prevCustomers.map((customer) =>
          customer.id === editedCustomer.id ? editedCustomer : customer
        );
      });
      
      setEditedCustomer(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDelete = () => {
    if (selectedCustomerForEdit) {
      const updatedCustomers = filteredCustomers.filter(
        (customer) => customer.id !== selectedCustomerForEdit.id
      );
      setFilteredCustomers(updatedCustomers);

      const customerIndex = mockCustomers.findIndex(
        (c) => c.id === selectedCustomerForEdit.id
      );
      if (customerIndex !== -1) {
        mockCustomers.splice(customerIndex, 1);
      }

      recalculateSummaryData(updatedCustomers);

      setIsDialogOpen(false);
      setSelectedCustomerForEdit(null);
      if (expandedCustomerId === selectedCustomerForEdit.id) {
        setExpandedCustomerId(null);
      }
      setKey(Date.now());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setEditedCustomer((prev) => {
      if (!prev) return prev;
      
      if (name === 'type') {
        // Handle type as CustomerType[]
        return {
          ...prev,
          type: [value as CustomerType]
        };
      }
      
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        if (parent === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [child]: value
            }
          };
        }
      }
      
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleTypeChange = (typeValue: CustomerType) => {
    if (editedCustomer) {
      const currentTypes = editedCustomer.type || [];
      let newTypes = [...currentTypes];
      let updatedSubContractor = editedCustomer.subContractor;

      if (currentTypes.includes(typeValue)) {
        newTypes = currentTypes.filter((type) => type !== typeValue);
        if (typeValue === "3rd party") {
          updatedSubContractor = undefined;
        }
      } else {
        newTypes.push(typeValue);
        if (typeValue === "3rd party" && !updatedSubContractor) {
          updatedSubContractor = { name: "", email: "", phone: "" };
        }
      }

      setEditedCustomer({
        ...editedCustomer,
        type: newTypes,
        subContractor: updatedSubContractor,
      });
    }
  };

  const recalculateSummaryData = (customers: CustomerData[]) => {
    const exhibitorCustomers = customers.filter((c) =>
      c.type.includes("Exhibitors")
    );
    const eeCustomers = customers.filter((c) => c.type.includes("ShowOrg"));
    const thirdPartyCustomers = customers.filter((c) =>
      c.type.includes("3rd party")
    );

    setSummaryData({
      exhibitor: {
        customerCount: exhibitorCustomers.length,
        metric2: 1,
        metric3: 800,
      },
      ee: {
        customerCount: eeCustomers.length,
        metric2: 0,
        metric3: 0,
      },
      thirdParty: {
        customerCount: thirdPartyCustomers.length,
        metric2: 0,
        metric3: 0,
      },
    });
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const customerForDetailView = expandedCustomerId
    ? filteredCustomers.find((c) => c.id === expandedCustomerId)
    : null;

  // Click handler for booth info column in 3-column view
  const handleBoothInfoClick = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation(); // Prevent card click (if any)
    setExpandedCustomerId(customerId);
  };

  const handleRowClick = (customerId: string) => {
    setExpandedRow(expandedRow === customerId ? null : customerId);
  };

  const closeDetailsPanel = () => {
    setExpandedCustomerId(null);
    setPrioritizedCustomers(filteredCustomers);
    setExpandedRow(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Clear functions
  const clearOccrId = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset all related states immediately
    setOccrId("");
    setShowName("");
    setShowSummary(false);
    setFilteredCustomers([]);
    setSummaryData({
      exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
      ee: { customerCount: 0, metric2: 0, metric3: 0 },
      thirdParty: { customerCount: 0, metric2: 0, metric3: 0 },
    });

    // Clear any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Update URL without triggering navigation
    router.push("/customers", { scroll: false });

    // Ensure input is blurred
    if (occrIdInputRef.current) {
      occrIdInputRef.current.blur();
    }
  };

  const clearShowName = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowName("");
    setOccrId("");
    setShowSummary(false);
    setFilteredCustomers([]);
    setSummaryData({
      exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
      ee: { customerCount: 0, metric2: 0, metric3: 0 },
      thirdParty: { customerCount: 0, metric2: 0, metric3: 0 },
    });
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    router.push("/customers", { scroll: false });
    showNameInputRef.current?.blur();
  };

  const handleEditCustomer = (editedCustomer: EditedCustomer) => {
    const customerIndex = mockCustomers.findIndex(customer => customer.id === editedCustomer.id);
    if (customerIndex !== -1) {
      mockCustomers[customerIndex] = { ...editedCustomer };
    }
    recalculateSummaryData(mockCustomers);
  };

  // Update the address rendering to use string type
  const formatAddress = (address: CustomerData['address']): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
  };

  return (
    <MainLayout
      breadcrumbs={[
        {
          label: "Customers",
          href: "#",
          onClick: handleCustomerBreadcrumbClick,
        },
      ]}
      key={key}
    >
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="occrId">Occurrence ID</Label>
              <div className="relative">
                <Input
                  id="occrId"
                  placeholder="Enter occurrence ID"
                  value={occrId}
                  onChange={(e) => handleOccrIdChange(e.target.value)}
                  className="bg-white text-sm pr-8"
                  ref={occrIdInputRef}
                />
                {occrId && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={clearOccrId}
                    type="button"
                    aria-label="Clear occurrence ID"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="showName">Show Name</Label>
              <div className="relative">
                <Input
                  id="showName"
                  placeholder="Enter show name"
                  value={showName}
                  onChange={(e) => handleShowNameChange(e.target.value)}
                  className="bg-white text-sm pr-8"
                  ref={showNameInputRef}
                />
                {showName && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={clearShowName}
                    type="button"
                    aria-label="Clear show name"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1 relative">
              <Label htmlFor="searchQuery">Search</Label>
              <Input
                id="searchQuery"
                type="text"
                placeholder="Search by Show ID, Name, or..."
                value={searchQuery}
                onChange={(e) => handleSearchQueryChange(e.target.value)}
                className="pl-8 bg-white text-sm"
              />
              <Search className="absolute left-2.5 bottom-2.5 text-gray-400 h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        {showSummary && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow rounded-md p-4">
                <h3 className="font-semibold text-sm mb-3 text-center">
                  EXHIBITOR SUMMARY
                </h3>
                <div className="flex justify-around text-center">
                  <div title="Customer Count">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold">
                      {summaryData.exhibitor.customerCount}
                    </p>
                    <p className="text-xs text-gray-500">Exhibitor</p>
                  </div>
                  <div title="Booth Measurements">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                      <Ruler className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold">
                      {summaryData.exhibitor.metric2}
                    </p>
                    <p className="text-xs text-gray-500">Booth Sqft</p>
                  </div>
                  <div title="Orders">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-lg font-semibold">
                      {summaryData.exhibitor.metric3}
                    </p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                </div>
              </Card>
              <Card className="shadow rounded-md p-4">
                <h3 className="font-semibold text-sm mb-3 text-center">
                  E&E SUMMARY
                </h3>
                <div className="flex justify-around text-center">
                  <div title="Customer Count">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold">
                      {summaryData.ee.customerCount}
                    </p>
                    <p className="text-xs text-gray-500">Exhibitor</p>
                  </div>
                  <div title="Booth Measurements">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                      <Ruler className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold">
                      {summaryData.ee.metric2}
                    </p>
                    <p className="text-xs text-gray-500">Booth Sqft</p>
                  </div>
                </div>
              </Card>
              <Card className="shadow rounded-md p-4">
                <h3 className="font-semibold text-sm mb-3 text-center">
                  3RD PARTY
                </h3>
                <div className="flex justify-around text-center">
                  <div title="Customer Count">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold">
                      {summaryData.thirdParty.customerCount}
                    </p>
                    <p className="text-xs text-gray-500">Exhibitor</p>
                  </div>
                  <div title="Booth Measurements">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                      <Ruler className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold">
                      {summaryData.thirdParty.metric2}
                    </p>
                    <p className="text-xs text-gray-500">Booth Sqft</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="pt-4">
              {expandedCustomerId === null ? (
                <div className="space-y-4">
                  {paginatedCustomers.map((customer) => (
                    <Card
                      key={customer.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-1 border-r md:pr-4 text-sm">
                        <div className="font-semibold text-base mb-1">
                          {customer.customerName}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-700 font-semibold">
                              Exhibitor ID:
                            </span>
                            <span>{customer.customerId}</span>
                          </div>
                          <div
                            className={`flex items-center gap-1 ${
                              customer.isActive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            <span>
                              {customer.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-700 font-semibold">
                            Type:
                          </span>
                          <span>{customer.type.join(", ")}</span>
                        </div>
                        {customer.netTerms && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-gray-700 font-semibold">
                              Term:
                            </span>
                            <span>{customer.netTerms}</span>
                          </div>
                        )}
                        {customer.riskDesc && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-gray-700 font-semibold">
                              Risk Desc:
                            </span>
                            <span>{customer.riskDesc}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 border-r md:pr-4 text-sm">
                        <div className="font-semibold text-base mb-1">
                          Address
                        </div>
                        <div className="text-gray-600">
                          {formatAddress(customer.address)}
                        </div>
                        <div className="flex items-start gap-1 mt-1">
                          <span className="text-gray-700 font-semibold pr-2">
                            Phone:
                          </span>
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-1 mt-1">
                          <span className="text-gray-700 font-semibold pr-2">
                            Email:
                          </span>
                          <span className="truncate" title={customer.email}>
                            {customer.email}
                          </span>
                        </div>
                      </div>

                      <div
                        className="flex flex-col justify-between cursor-pointer"
                        onClick={(e) => handleBoothInfoClick(e, customer.id)}
                      >
                        <div>
                          <div className="font-semibold text-base mb-1">
                            Booth Info
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-800">
                              <span className="font-medium">Facility ID:</span> {currentFacilityId}
                            </div>
                            <div className="text-sm text-gray-800">
                              <span className="font-medium">Project #:</span> {mockShows.find(show => show.showId === customer.showId)?.projectNumber || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-800">
                              <span className="font-medium">Booth #:</span> {customer.boothNumber}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end text-sm text-gray-600 hover:text-blue-600 mt-2">
                          <span>Booth Details</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
                  <div className="space-y-4 md:max-w-xs lg:max-w-sm h-[calc(100vh-14rem)] overflow-y-auto pr-2">
                    {prioritizedCustomers.map((customer) => (
                      <Card
                        key={customer.id}
                        className={cn(
                          "p-4 transition-all duration-150 ease-in-out border cursor-pointer",
                          expandedCustomerId === customer.id
                            ? "bg-blue-50 border-blue-300 shadow-md"
                            : "bg-white border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                        )}
                        onClick={() => handleCustomerCardClick(customer.id)}
                      >
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="font-semibold text-base mb-1">
                            {customer.customerName}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-700 font-semibold">
                                Exhibitor ID:
                              </span>
                              <span>{customer.customerId}</span>
                            </div>
                            <div
                              className={`flex items-center gap-1 ${
                                customer.isActive
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <span>
                                {customer.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-700 font-semibold">
                              Type:
                            </span>
                            <span>{customer.type.join(", ")}</span>
                          </div>
                          {customer.netTerms && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-gray-700 font-semibold">
                                Term:
                              </span>
                              <span>{customer.netTerms}</span>
                            </div>
                          )}
                          {customer.riskDesc && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-gray-700 font-semibold">
                                Risk Desc:
                              </span>
                              <span>{customer.riskDesc}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="sticky top-24 h-[calc(100vh-10rem)]">
                    {customerForDetailView && (
                      <Card className="p-4 shadow-lg relative h-full overflow-y-auto">
                        <button
                          onClick={closeDetailsPanel}
                          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                          aria-label="Close details"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold mb-4 ">
                          Booth/Zone Details
                        </h3>
                        <div className="flow-root">
                          <div className="-mx-4 overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                              <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <Table className="min-w-full table-fixed divide-y divide-gray-300">
                                  <TableHeader className="bg-gray-50">
                                    <TableRow>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Project #</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Facility</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Booth #</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Booth Type</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Booth Length</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Booth Width</TableHead>
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Service Issue</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody className="divide-y divide-gray-200 bg-white">
                                    {customerForDetailView ? (
                                      <TableRow>
                                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                          {customerForDetailView.projectNumber || 'N/A'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                          {currentFacilityId}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {customerForDetailView.boothNumber || 'N/A'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                          {customerForDetailView.boothType || 'N/A'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                          {customerForDetailView.boothLength || 'N/A'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                          {customerForDetailView.boothWidth || 'N/A'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {customerForDetailView.serviceIssue && customerForDetailView.serviceIssue.toLowerCase() !== 'none' ? (
                                            <span className="font-medium text-green-600">ACTIVE</span>
                                          ) : (
                                            <span className="font-medium text-gray-500">INACTIVE</span>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-400 py-8">Select a customer to view booth/zone details.</TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Project Details Section */}
                        {customerForDetailView && (
                          <div className="mt-8 bg-gray-50 p-6 rounded-md shadow-sm">
                            <h4 className="font-semibold text-base mb-4 text-gray-800">Project Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                              <div><strong>First Name:</strong> {customerForDetailView.firstName || 'N/A'}</div>
                              <div><strong>Last Name:</strong> {customerForDetailView.lastName || 'N/A'}</div>
                              <div><strong>Email Id:</strong> {customerForDetailView.email || 'N/A'}</div>
                              <div><strong>Contact Type:</strong> {customerForDetailView.contactType || 'N/A'}</div>
                              <div><strong>Contact Role:</strong> {customerForDetailView.contactRole || 'N/A'}</div>
                              <div><strong>Shared Booth:</strong> {customerForDetailView.sharedBooth ? 'Yes' : 'No'}</div>
                              <div><strong>Service Zone:</strong> {customerForDetailView.serviceZone || 'N/A'}</div>
                              <div><strong>Target Zone:</strong> {customerForDetailView.targetZone || 'N/A'}</div>
                              <div><strong>Empty Zone:</strong> {customerForDetailView.emptyZone || 'N/A'}</div>
                              <div className="col-span-2">
                                <strong>Service Issue:</strong> {customerForDetailView.serviceIssue || 'N/A'}<br />
                                <strong>Description:</strong> {(!customerForDetailView.serviceIssue || customerForDetailView.serviceIssue.toLowerCase() === 'inactive' || customerForDetailView.serviceIssue.toLowerCase() === 'none') ? '----' : customerForDetailView.serviceIssue}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="mt-6 pt-4 border-t flex gap-2">
                          <Button
                            onClick={() => {
                              // TODO: Implement order functionality
                              alert('Order functionality coming soon!');
                            }}
                          >
                            Order
                          </Button>
                        </div>
                      </Card>
                    )}
                    {!customerForDetailView && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Loading details...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedCustomerForEdit && (
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open: boolean) => {
                  setIsDialogOpen(open);
                  if (!open) setSelectedCustomerForEdit(null);
                }}
              >
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Edit Customer Details</DialogTitle>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                    <form
                      id="customerForm"
                      onSubmit={handleSave}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="customerName"
                            className={
                              errors.customerName ? "text-red-500" : ""
                            }
                          >
                            Customer Name<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="customerName"
                            value={editedCustomer?.customerName || ""}
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                            className={
                              errors.customerName ? "border-red-500" : ""
                            }
                          />
                          {errors.customerName && (
                            <p className="text-xs text-red-500">
                              {errors.customerName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="customerId"
                            className={errors.customerId ? "text-red-500" : ""}
                          >
                            Exhibitor ID<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="customerId"
                            value={editedCustomer?.customerId || ""}
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                            className={
                              errors.customerId ? "border-red-500" : ""
                            }
                          />
                          {errors.customerId && (
                            <p className="text-xs text-red-500">
                              {errors.customerId}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="isActive">Status</Label>
                          <select
                            id="isActive"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            value={
                              editedCustomer?.isActive ? "active" : "inactive"
                            }
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className={errors.email ? "text-red-500" : ""}
                          >
                            Email<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedCustomer?.email || ""}
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-500">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className={errors.phone ? "text-red-500" : ""}
                          >
                            Phone<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            value={editedCustomer?.phone || ""}
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                            className={errors.phone ? "border-red-500" : ""}
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-500">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={editedCustomer?.address?.street || ""}
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="facilityId"
                            className={errors.facilityId ? "text-red-500" : ""}
                          >
                            Facility ID
                          </Label>
                          <Input
                            id="facilityId"
                            value={editedCustomer?.facilityId || ""}
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                            className={
                              errors.facilityId ? "border-red-500" : ""
                            }
                          />
                          {errors.facilityId && (
                            <p className="text-xs text-red-500">
                              {errors.facilityId}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="boothNumber"
                            className={errors.boothNumber ? "text-red-500" : ""}
                          >
                            Booth Number
                          </Label>
                          <Input
                            id="boothNumber"
                            value={editedCustomer?.boothNumber || ""}
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                            className={
                              errors.boothNumber ? "border-red-500" : ""
                            }
                          />
                          {errors.boothNumber && (
                            <p className="text-xs text-red-500">
                              {errors.boothNumber}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zone">Zone</Label>
                          <Input
                            id="zone"
                            value={editedCustomer?.zone || ""}
                            onChange={(e) =>
                              handleInputChange(e)
                            }
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Type</Label>
                          <div className="flex flex-wrap gap-4">
                            {customerTypes.map((type) => (
                              <div
                                key={type}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`type-${type}`}
                                  checked={editedCustomer?.type.includes(type)}
                                  onCheckedChange={() => handleTypeChange(type)}
                                />
                                <label
                                  htmlFor={`type-${type}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {editedCustomer?.type.includes("3rd party") && (
                          <>
                            <h3 className="text-lg font-semibold col-span-2 border-t pt-4 mt-2">
                              Subcontractor Details
                            </h3>
                            <div className="space-y-2">
                              <Label
                                htmlFor="subContractorName"
                                className={
                                  errors["subContractor.name"]
                                    ? "text-red-500"
                                    : ""
                                }
                              >
                                Company Name
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="subContractorName"
                                value={editedCustomer.subContractor?.name || ""}
                                onChange={(e) =>
                                  handleInputChange(e)
                                }
                                placeholder="Subcontractor company name"
                                className={
                                  errors["subContractor.name"]
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {errors["subContractor.name"] && (
                                <p className="text-xs text-red-500">
                                  {errors["subContractor.name"]}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subContractorContact">
                                Contact Name
                              </Label>
                              <Input
                                id="subContractorContact"
                                value={
                                  editedCustomer.subContractor?.contactName ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleInputChange(e)
                                }
                                placeholder="Contact person name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="subContractorPhone"
                                className={
                                  errors["subContractor.phone"]
                                    ? "text-red-500"
                                    : ""
                                }
                              >
                                Phone<span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="subContractorPhone"
                                value={
                                  editedCustomer.subContractor?.phone || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(e)
                                }
                                placeholder="Subcontractor phone"
                                className={
                                  errors["subContractor.phone"]
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {errors["subContractor.phone"] && (
                                <p className="text-xs text-red-500">
                                  {errors["subContractor.phone"]}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="subContractorEmail"
                                className={
                                  errors["subContractor.email"]
                                    ? "text-red-500"
                                    : ""
                                }
                              >
                                Email<span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="subContractorEmail"
                                type="email"
                                value={
                                  editedCustomer.subContractor?.email || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(e)
                                }
                                placeholder="Subcontractor email"
                                className={
                                  errors["subContractor.email"]
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {errors["subContractor.email"] && (
                                <p className="text-xs text-red-500">
                                  {errors["subContractor.email"]}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </form>
                  </div>

                  <DialogFooter className="flex justify-between border-t pt-4 mt-4">
                    <Button
                      type="button"
                      onClick={handleDelete}
                    >
                      Delete Customer
                    </Button>
                    <div className="space-x-2">
                      <Button
                        type="button"
                     
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" form="customerForm">
                        Save Changes
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <div className="flex justify-end items-center mt-4">
              <PageSizeSelector
                pageSize={rowsPerPage}
                setPageSize={(value) => {
                  setRowsPerPage(value);
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              />
              <CustomPagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCustomers.length / rowsPerPage)}
                onPageChange={handlePageChange}
                className="ml-4"
              />
            </div>
          </>
        )}
      </div>
      <ScrollToTop />
    </MainLayout>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersContent />
    </Suspense>
  );
}
