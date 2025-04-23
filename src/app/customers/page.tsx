"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import MainLayout from "@/components/mainlayout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Users, Box, ClipboardList, Check, X, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { mockShows, mockCustomers, ShowData, Customer, CustomerType } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React from "react";
import Router from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

const customerTypes: CustomerType[] = ['Exhibitors', 'ShowOrg', '3rd party'];

export default function CustomersPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showName, setShowName] = useState("");
  const [occrId, setOccrId] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [originalShow, setOriginalShow] = useState<ShowData | null>(null);
  const [previousShow, setPreviousShow] = useState<ShowData | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
    ee: { customerCount: 0, metric2: 0, metric3: 0 },
    thirdParty: { customerCount: 0, metric2: 0, metric3: 0 }
  });
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const [key, setKey] = useState(Date.now());
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSearchedRef = useRef(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [reloadKey, setReloadKey] = useState(0);
  
  const resetPage = useCallback(() => {
    setSearchQuery("");
    setShowName("");
    setOccrId("");
    setShowSummary(false);
    setOriginalShow(null);
    setPreviousShow(null);
    hasSearchedRef.current = false;
    setFilteredCustomers([]);
    setSummaryData({
      exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
      ee: { customerCount: 0, metric2: 0, metric3: 0 },
      thirdParty: { customerCount: 0, metric2: 0, metric3: 0 }
    });
    setExpandedCustomerId(null);
    setSelectedCustomerForEdit(null);
    setIsDialogOpen(false);
    setKey(Date.now());
  }, []);

  const handleBreadcrumbClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    setSearchQuery("");
    setShowName("");
    setOccrId("");
    setShowSummary(false);
    setFilteredCustomers([]);
    setSummaryData({
      exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
      ee: { customerCount: 0, metric2: 0, metric3: 0 },
      thirdParty: { customerCount: 0, metric2: 0, metric3: 0 }
    });
    hasSearchedRef.current = false;
    setExpandedCustomerId(null);
    setSelectedCustomerForEdit(null);
    
    setKey(Date.now());
    
    window.history.pushState({}, '', '/customers');
    
    resetPage();
  }, [resetPage]);

  const calculateSummaryData = (show: ShowData | null) => {
    if (!show) {
      setSummaryData({
        exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
        ee: { customerCount: 0, metric2: 0, metric3: 0 },
        thirdParty: { customerCount: 0, metric2: 0, metric3: 0 }
      });
      setFilteredCustomers([]);
      return;
    }

    const showCustomers = mockCustomers.filter(
      customer => customer.showId === show.showId
    );
    setFilteredCustomers(showCustomers);

    const exhibitorCustomers = showCustomers.filter(c => c.type.includes('Exhibitors'));
    const eeCustomers = showCustomers.filter(c => c.type.includes('ShowOrg'));
    const thirdPartyCustomers = showCustomers.filter(c => c.type.includes('3rd party'));

    setSummaryData({
      exhibitor: {
        customerCount: exhibitorCustomers.length,
        metric2: 1,
        metric3: 800
      },
      ee: {
        customerCount: eeCustomers.length,
        metric2: 0,
        metric3: 0
      },
      thirdParty: {
        customerCount: thirdPartyCustomers.length,
        metric2: 0,
        metric3: 0
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setExpandedCustomerId(null);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (!query.trim()) {
      hasSearchedRef.current = false;
      
      if (originalShow) {
        setShowName(originalShow.showName);
        setOccrId(originalShow.occrId);
        setShowSummary(true);
        calculateSummaryData(originalShow);
        
        router.push(`/customers?showName=${encodeURIComponent(originalShow.showName)}&occrId=${encodeURIComponent(originalShow.occrId)}`);
      } else {
        resetPage();
        router.push('/customers');
      }
      return;
    }
    
    hasSearchedRef.current = true;
    
    searchTimeoutRef.current = setTimeout(() => {
      const foundShow = mockShows.find(
        (show) =>
          show.showId.toLowerCase().includes(query.toLowerCase()) ||
          show.showName.toLowerCase().includes(query.toLowerCase()) ||
          show.occrId.toLowerCase().includes(query.toLowerCase())
      );
  
      if (foundShow) {
        setPreviousShow(foundShow);
        
        if (query.length > 2) {
          router.push(`/customers?showName=${encodeURIComponent(foundShow.showName)}&occrId=${encodeURIComponent(foundShow.occrId)}`);
        }
        
        setShowName(foundShow.showName);
        setOccrId(foundShow.occrId);
        setShowSummary(true);
        calculateSummaryData(foundShow);
      }
    }, 300);
  };

  const handleDirectInput = (field: 'showName' | 'occrId', value: string) => {
    if (field === 'showName') {
      setShowName(value);
    } else {
      setOccrId(value);
    }
    setExpandedCustomerId(null);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (!value.trim()) {
      hasSearchedRef.current = false;
      
      if (originalShow) {
        setShowName(originalShow.showName);
        setOccrId(originalShow.occrId);
        setShowSummary(true);
        calculateSummaryData(originalShow);
        
        router.push(`/customers?showName=${encodeURIComponent(originalShow.showName)}&occrId=${encodeURIComponent(originalShow.occrId)}`);
      } else {
        resetPage();
        router.push('/customers');
      }
      return;
    }
    
    hasSearchedRef.current = true;
    
    searchTimeoutRef.current = setTimeout(() => {
      let foundShow = null;
      
      if (field === 'showName') {
        foundShow = mockShows.find(
          (show) => show.showName.toLowerCase().includes(value.toLowerCase())
        );
        if (foundShow) {
          setOccrId(foundShow.occrId);
        }
      } else if (field === 'occrId') {
        foundShow = mockShows.find(
          (show) => show.occrId.toLowerCase().includes(value.toLowerCase())
        );
        if (foundShow) {
          setShowName(foundShow.showName);
        }
      }
  
      if (foundShow) {
        setPreviousShow(foundShow);
        
        if (value.length > 2) {
          router.push(`/customers?showName=${encodeURIComponent(foundShow.showName)}&occrId=${encodeURIComponent(foundShow.occrId)}`);
        }
        
        setShowSummary(true);
        calculateSummaryData(foundShow);
      } else {
        setShowSummary(false);
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
      
      const foundShow = mockShows.find(
        (show) => show.showName === urlShowName && show.occrId === urlOccrId
      );
      
      if (foundShow) {
        if (!hasSearchedRef.current) {
          setOriginalShow(foundShow);
        }
        setPreviousShow(foundShow);
        calculateSummaryData(foundShow);
      }
    } else if (isInitialLoad && pathname === "/customers") {
      resetPage();
    }
  }, [searchParams, pathname, resetPage, showName, occrId]);

  const handleCustomerCardClick = (customerId: string) => {
    setExpandedCustomerId(customerId);
    setExpandedRow(customerId);
  };
  
  const openEditDialog = (customer: Customer) => {
      setSelectedCustomerForEdit(customer);
      setEditedCustomer({ ...customer });
      setIsDialogOpen(true);
  }

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedCustomer.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!editedCustomer?.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-()]+$/.test(editedCustomer.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (editedCustomer?.boothNumber && !editedCustomer.boothNumber.trim()) {
      newErrors.boothNumber = "Booth number cannot be empty";
    }
    
    if (editedCustomer?.facilityId && !editedCustomer.facilityId.trim()) {
      newErrors.facilityId = "Facility ID cannot be empty";
    }
    
    if (editedCustomer?.type.includes('3rd party')) {
      if (!editedCustomer?.subContractor?.name?.trim()) {
        newErrors["subContractor.name"] = "Subcontractor name is required for 3rd party";
      }
      
      if (!editedCustomer?.subContractor?.email?.trim()) {
        newErrors["subContractor.email"] = "Subcontractor email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedCustomer.subContractor.email)) {
        newErrors["subContractor.email"] = "Please enter a valid email address";
      }
      
      if (!editedCustomer?.subContractor?.phone?.trim()) {
        newErrors["subContractor.phone"] = "Subcontractor phone is required";
      } else if (!/^[\d\s\-()]+$/.test(editedCustomer.subContractor.phone)) {
        newErrors["subContractor.phone"] = "Please enter a valid phone number";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editedCustomer) {
      const updatedCustomers = filteredCustomers.map(customer =>
        customer.id === editedCustomer.id ? editedCustomer : customer
      );
      setFilteredCustomers(updatedCustomers);
      
      const customerIndex = mockCustomers.findIndex(c => c.id === editedCustomer.id);
      if (customerIndex !== -1) {
        mockCustomers[customerIndex] = { ...editedCustomer };
      }
      
      recalculateSummaryData(updatedCustomers);
      
      setIsDialogOpen(false);
      setSelectedCustomerForEdit(null);
      setKey(Date.now());
    }
  };

  const handleDelete = () => {
    if (selectedCustomerForEdit) {
      const updatedCustomers = filteredCustomers.filter(
        customer => customer.id !== selectedCustomerForEdit.id
      );
      setFilteredCustomers(updatedCustomers);
      
      const customerIndex = mockCustomers.findIndex(c => c.id === selectedCustomerForEdit.id);
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

  const handleInputChange = (
    field: keyof Customer | `subContractor.${keyof NonNullable<Customer['subContractor']>}`,
    value: string | boolean | CustomerType[]
  ) => {
    if (!editedCustomer) return;

    if (errors[field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[field];
      setErrors(updatedErrors);
    }

    if (field.startsWith('subContractor.')) {
      const subField = field.split('.')[1] as keyof NonNullable<Customer['subContractor']>;
      setEditedCustomer({
        ...editedCustomer,
        subContractor: {
          ...(editedCustomer.subContractor || { name: '' }),
          [subField]: value,
        },
      });
    } else {
      setEditedCustomer({
        ...editedCustomer,
        [field as keyof Customer]: value,
      });
    }
  };

  const handleTypeChange = (typeValue: CustomerType) => {
    if (editedCustomer) {
      const currentTypes = editedCustomer.type || [];
      let newTypes = [...currentTypes];
      let updatedSubContractor = editedCustomer.subContractor;

      if (currentTypes.includes(typeValue)) {
        newTypes = currentTypes.filter(t => t !== typeValue);
        if (typeValue === '3rd party') {
          updatedSubContractor = undefined;
        }
      } else {
        newTypes.push(typeValue);
        if (typeValue === '3rd party' && !updatedSubContractor) {
          updatedSubContractor = { name: '' };
        }
      }
      
      setEditedCustomer({
        ...editedCustomer,
        type: newTypes,
        subContractor: updatedSubContractor,
      });
    }
  };

  const recalculateSummaryData = (customers: Customer[]) => {
    const exhibitorCustomers = customers.filter(c => c.type.includes('Exhibitors'));
    const eeCustomers = customers.filter(c => c.type.includes('ShowOrg'));
    const thirdPartyCustomers = customers.filter(c => c.type.includes('3rd party'));

    setSummaryData({
      exhibitor: {
        customerCount: exhibitorCustomers.length,
        metric2: 1,
        metric3: 800
      },
      ee: {
        customerCount: eeCustomers.length,
        metric2: 0,
        metric3: 0
      },
      thirdParty: {
        customerCount: thirdPartyCustomers.length,
        metric2: 0,
        metric3: 0
      }
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
    ? filteredCustomers.find(c => c.id === expandedCustomerId)
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
    setExpandedRow(null); // Reset expanded row
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleCustomerBreadcrumbClick = () => {
    // Reset all form inputs
    setSearchQuery("");
    setShowName("");
    setOccrId("");
    
    // Reset all data display flags
    setShowSummary(false);
    
    // Clear all data
    setOriginalShow(null);
    setPreviousShow(null);
    setFilteredCustomers([]);
    
    // Reset summary data
    setSummaryData({
      exhibitor: { customerCount: 0, metric2: 0, metric3: 0 },
      ee: { customerCount: 0, metric2: 0, metric3: 0 },
      thirdParty: { customerCount: 0, metric2: 0, metric3: 0 }
    });
    
    // Close any open details or edit panels
    setExpandedCustomerId(null);
    setExpandedRow(null);
    setSelectedCustomerForEdit(null);
    setIsDialogOpen(false);
    
    // Reset pagination
    setCurrentPage(1);
    setRowsPerPage(5);
    
    // Clear any error states
    setErrors({});
    
    // Clear timeouts to prevent delayed searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    
    // Reset search flag to prevent auto-searches
    hasSearchedRef.current = false;
    
    // Force component re-renders
    setKey(Date.now());
    setReloadKey(prev => prev + 1);
    
    // Reset URL without triggering navigation events
    router.replace('/customers');
  };

  useEffect(() => {
    // Place your data fetching logic here
    // This will run when the component mounts or when reloadKey changes
  }, [reloadKey]);

  return (
    <MainLayout 
      breadcrumbs={[{
        label: "Customers",
        href: "#",
        onClick: handleCustomerBreadcrumbClick,
      }]}
      key={key}
    >
      <div className="space-y-6 p-6">
        <Card>
           <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-1">
               <Label htmlFor="occrId">Occurrence ID</Label>
               <Input
                 id="occrId"
                 placeholder="Enter occurrence ID"
                 value={occrId}
                 onChange={(e) => handleDirectInput('occrId', e.target.value)}
                 className="bg-white text-sm"
               />
             </div>
             <div className="space-y-1">
               <Label htmlFor="showName">Show Name</Label>
               <Input
                 id="showName"
                 placeholder="Enter show name"
                 value={showName}
                 onChange={(e) => handleDirectInput('showName', e.target.value)}
                 className="bg-white text-sm"
               />
             </div>
             <div className="space-y-1 relative">
               <Label htmlFor="searchQuery">Search</Label>
               <Input
                 id="searchQuery"
                 type="text"
                 placeholder="Search by Show ID, Name, or..."
                 value={searchQuery}
                 onChange={(e) => handleSearch(e.target.value)}
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
                <h3 className="font-semibold text-sm mb-3 text-center">EXHIBITOR SUMMARY</h3>
                <div className="flex justify-around text-center">
                  <div>
                    <Users className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.exhibitor.customerCount}</p>
                  </div>
                  <div>
                    <Box className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.exhibitor.metric2}</p>
                  </div>
                  <div>
                    <ClipboardList className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.exhibitor.metric3}</p>
                  </div>
                </div>
              </Card>
              <Card className="shadow rounded-md p-4">
                <h3 className="font-semibold text-sm mb-3 text-center">E&E SUMMARY</h3>
                <div className="flex justify-around text-center">
                  <div>
                    <Users className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.ee.customerCount}</p>
                  </div>
                  <div>
                    <Box className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.ee.metric2}</p>
                  </div>
                  <div>
                    <ClipboardList className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.ee.metric3}</p>
                  </div>
                </div>
              </Card>
              <Card className="shadow rounded-md p-4">
                <h3 className="font-semibold text-sm mb-3 text-center">3RD PARTY</h3>
                <div className="flex justify-around text-center">
                  <div>
                    <Users className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.thirdParty.customerCount}</p>
                  </div>
                  <div>
                    <Box className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.thirdParty.metric2}</p>
                  </div>
                  <div>
                    <ClipboardList className="w-6 h-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-lg font-semibold">{summaryData.thirdParty.metric3}</p>
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
                        <div className="font-semibold text-base mb-1">{customer.customerName}</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-700 font-semibold">Customer ID:</span> 
                            <span>{customer.customerId}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${customer.isActive ? "text-green-600" : "text-red-600"}`}>
                            <span>{customer.isActive ? 'Active' : 'Inactive'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                           <span className="text-gray-700 font-semibold">Type:</span>
                           <span>{customer.type.join(', ')}</span>
                        </div>
                        {customer.netTerms && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-gray-700 font-semibold">Term:</span>
                            <span>{customer.netTerms}</span>
                          </div>
                        )}
                        {customer.riskDesc && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-gray-700 font-semibold">Risk Desc:</span>
                            <span>{customer.riskDesc}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 border-r md:pr-4 text-sm">
                        <div className="font-semibold text-base mb-1">Address</div>
                        <div className="flex items-start gap-1">
                          <span className="text-gray-700 font-semibold pr-2">Street:</span>
                          <span>{customer.address}</span>
                        </div>
                        <div className="flex items-start gap-1">
                           <span className="text-gray-700 font-semibold pr-2">City/St/Zip:</span>
                           <span>{customer.cityStateZip}</span>
                        </div>
                        <div className="flex items-start gap-1 mt-1">
                           <span className="text-gray-700 font-semibold pr-2">Phone:</span>
                           <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-1 mt-1">
                           <span className="text-gray-700 font-semibold pr-2">Email:</span>
                           <span className="truncate" title={customer.email}>{customer.email}</span>
                        </div>
                      </div>

                      <div 
                        className="flex flex-col justify-between cursor-pointer" 
                        onClick={(e) => handleBoothInfoClick(e, customer.id)}
                      >
                        <div>
                          <div className="font-semibold text-base mb-1">Booth Info</div>
                          <div className="text-sm text-gray-800">{customer.facilityId}</div>
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
                  <div className="space-y-4 md:max-w-xs lg:max-w-sm">
                    {filteredCustomers.map((customer) => (
                      <Card 
                        key={customer.id} 
                        className={cn(
                          "p-4 transition-colors duration-150 ease-in-out",
                          expandedCustomerId === customer.id 
                            ? "bg-blue-50 border border-blue-300 shadow-md"
                            : "bg-white border"
                        )}
                        onClick={() => handleCustomerCardClick(customer.id)}
                      >
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="font-semibold text-base mb-1">{customer.customerName}</div>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-1">
                               <span className="text-gray-700 font-semibold">Customer ID:</span> 
                               <span>{customer.customerId}</span>
                             </div>
                             <div className={`flex items-center gap-1 ${customer.isActive ? "text-green-600" : "text-red-600"}`}>
                               <span>{customer.isActive ? 'Active' : 'Inactive'}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-700 font-semibold">Type:</span>
                            <span>{customer.type.join(', ')}</span>
                          </div>
                          {customer.netTerms && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-gray-700 font-semibold">Term:</span>
                              <span>{customer.netTerms}</span>
                            </div>
                          )}
                          {customer.riskDesc && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-gray-700 font-semibold">Risk Desc:</span>
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
                        <h3 className="text-lg font-semibold mb-4 ">Booth/Zone Details</h3>
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
                                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Service Issue</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody className="divide-y divide-gray-200 bg-white">
                                      {filteredCustomers.map((customer) => (
                                        <React.Fragment key={customer.id}>
                                        <TableRow onClick={() => handleRowClick(customer.id)} className="cursor-pointer">
                                          <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate" title={customer.showId}>
                                              <span className={customer.showId === 'AWS23' ? 'font-semibold' : ''}>
                                                {customer.showId}
                                              </span>
                                          </TableCell>
                                          <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate" title={customer.facilityName}>{customer.facilityName}</TableCell>
                                          <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate" title={customer.boothNumber}>{customer.boothNumber}</TableCell>
                                          <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate" title={customer.boothType || 'N/A'}>{customer.boothType || 'N/A'}</TableCell>
                                          <TableCell className="whitespace-nowrap px-3 py-4 text-sm truncate">
                                              {customer.serviceIssue && customer.serviceIssue.toLowerCase() !== 'none' ? (
                                                <span className="font-medium text-green-600">ACTIVE</span>
                                              ) : (
                                                <span className="font-medium text-gray-500">INACTIVE</span>
                                              )}
                                          </TableCell>
                                        </TableRow>
                                          {expandedRow === customer.id && (
                                          <TableRow>
                                            <TableCell colSpan={5} className="px-3 py-4">
                                                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                                    <div><strong>First Name:</strong> {customer.firstName}</div>
                                                    <div><strong>Last Name:</strong> {customer.lastName}</div>
                                                    <div><strong>Email Id:</strong> {customer.email}</div>
                                                    <div><strong>Country:</strong> {customer.country === 'USA' ? '+1' : customer.country}</div>
                                                    <div><strong>Contact Type:</strong> {customer.contactType}</div>
                                                    <div><strong>Contact Role:</strong> {customer.contactRole}</div>
                                                    <div><strong>Shared Booth:</strong> {customer.sharedBooth ? 'Yes' : 'No'}</div>
                                                    <div><strong>Operation Zone:</strong> {customer.operationZone}</div>
                                                    <div><strong>Service Zone:</strong> {customer.serviceZone}</div>
                                                    <div><strong>Target Zone:</strong> {customer.targetZone}</div>
                                                    <div><strong>Empty Zone:</strong> {customer.emptyZone}</div>
                                                    <div><strong>Service Issue:</strong> {customer.serviceIssue}</div>
                                                  </div>
                                                </div>
                                            </TableCell>
                                          </TableRow>
                                          )}
                                        </React.Fragment>
                                      ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t">
                           <Button 
                               variant="outline"
                               onClick={() => openEditDialog(customerForDetailView)}
                           >
                               Edit Customer
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
              <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setSelectedCustomerForEdit(null); }}>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Edit Customer Details</DialogTitle>
                  </DialogHeader>
                  
                  <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                    <form id="customerForm" onSubmit={handleSave} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerName" className={errors.customerName ? "text-red-500" : ""}>
                            Customer Name<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="customerName"
                            value={editedCustomer?.customerName || ''}
                            onChange={(e) => handleInputChange("customerName", e.target.value)}
                            className={errors.customerName ? "border-red-500" : ""}
                          />
                          {errors.customerName && (
                            <p className="text-xs text-red-500">{errors.customerName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerId" className={errors.customerId ? "text-red-500" : ""}>
                            Customer ID<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="customerId"
                            value={editedCustomer?.customerId || ''}
                            onChange={(e) => handleInputChange("customerId", e.target.value)}
                            className={errors.customerId ? "border-red-500" : ""}
                          />
                          {errors.customerId && (
                            <p className="text-xs text-red-500">{errors.customerId}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="isActive">Status</Label>
                          <select
                            id="isActive"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            value={editedCustomer?.isActive ? "active" : "inactive"}
                            onChange={(e) => handleInputChange("isActive", e.target.value === "active")}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
                            Email<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedCustomer?.email || ''}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-500">{errors.email}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className={errors.phone ? "text-red-500" : ""}>
                            Phone<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            value={editedCustomer?.phone || ''}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={errors.phone ? "border-red-500" : ""}
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-500">{errors.phone}</p>
                          )}
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={editedCustomer?.address || ''}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="facilityId" className={errors.facilityId ? "text-red-500" : ""}>
                            Facility ID
                          </Label>
                          <Input
                            id="facilityId"
                            value={editedCustomer?.facilityId || ''}
                            onChange={(e) => handleInputChange("facilityId", e.target.value)}
                            className={errors.facilityId ? "border-red-500" : ""}
                          />
                          {errors.facilityId && (
                            <p className="text-xs text-red-500">{errors.facilityId}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="boothNumber" className={errors.boothNumber ? "text-red-500" : ""}>
                            Booth Number
                          </Label>
                          <Input
                            id="boothNumber"
                            value={editedCustomer?.boothNumber || ''}
                            onChange={(e) => handleInputChange("boothNumber", e.target.value)}
                            className={errors.boothNumber ? "border-red-500" : ""}
                          />
                          {errors.boothNumber && (
                            <p className="text-xs text-red-500">{errors.boothNumber}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zone">Zone</Label>
                          <Input
                            id="zone"
                            value={editedCustomer?.zone || ''}
                            onChange={(e) => handleInputChange("zone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Type</Label>
                          <div className="flex flex-wrap gap-4">
                            {customerTypes.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
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
                        
                        {editedCustomer?.type.includes('3rd party') && (
                          <>
                            <h3 className="text-lg font-semibold col-span-2 border-t pt-4 mt-2">Subcontractor Details</h3>
                            <div className="space-y-2">
                              <Label 
                                htmlFor="subContractorName" 
                                className={errors["subContractor.name"] ? "text-red-500" : ""}
                              >
                                Company Name<span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="subContractorName"
                                value={editedCustomer.subContractor?.name || ''}
                                onChange={(e) => handleInputChange("subContractor.name", e.target.value)}
                                placeholder="Subcontractor company name"
                                className={errors["subContractor.name"] ? "border-red-500" : ""}
                              />
                              {errors["subContractor.name"] && (
                                <p className="text-xs text-red-500">{errors["subContractor.name"]}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subContractorContact">
                                Contact Name
                              </Label>
                              <Input
                                id="subContractorContact"
                                value={editedCustomer.subContractor?.contactName || ''}
                                onChange={(e) => handleInputChange("subContractor.contactName", e.target.value)}
                                placeholder="Contact person name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label 
                                htmlFor="subContractorPhone"
                                className={errors["subContractor.phone"] ? "text-red-500" : ""}
                              >
                                Phone<span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="subContractorPhone"
                                value={editedCustomer.subContractor?.phone || ''}
                                onChange={(e) => handleInputChange("subContractor.phone", e.target.value)}
                                placeholder="Subcontractor phone"
                                className={errors["subContractor.phone"] ? "border-red-500" : ""}
                              />
                              {errors["subContractor.phone"] && (
                                <p className="text-xs text-red-500">{errors["subContractor.phone"]}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label 
                                htmlFor="subContractorEmail"
                                className={errors["subContractor.email"] ? "text-red-500" : ""}
                              >
                                Email<span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="subContractorEmail"
                                type="email"
                                value={editedCustomer.subContractor?.email || ''}
                                onChange={(e) => handleInputChange("subContractor.email", e.target.value)}
                                placeholder="Subcontractor email"
                                className={errors["subContractor.email"] ? "border-red-500" : ""}
                              />
                              {errors["subContractor.email"] && (
                                <p className="text-xs text-red-500">{errors["subContractor.email"]}</p>
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
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Delete Customer
                    </Button>
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" form="customerForm">Save Changes</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <div className="flex justify-end items-center mt-4">
              <span className="mr-2">Rows per page:</span>
              <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="border rounded-md">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="ml-4">
                {currentPage} of {Math.ceil(filteredCustomers.length / rowsPerPage)}
              </span>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="ml-2"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredCustomers.length / rowsPerPage)}
                className="ml-2"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

