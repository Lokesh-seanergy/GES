// Types for Shows Page
export interface ShowData {
  showId: string;
  showName: string;
  occrId: string;
  occrType: string;
  marketType: string;
  projectNumber: string;
  cityOrg: string;
  yrmo: string;
}

export interface ProjectData {
  projectName: string;
  projectNumber: string;
  projectType: string;
  status: string;
  productionCity: string;
  facilityId: string;
}

export interface FacilityData {
  facilityId: string;
  facilityName: string;
  hall: string;
  location1: string;
  location2: string;
  areaCode: string;
  phone: string;
}

// Mock Data for Shows Page
export const mockShows: ShowData[] = [
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

export const mockProjectData: ProjectData = {
  projectName: "Trade Show Setup 2024",
  projectNumber: "P2024-001",
  projectType: "Exhibition",
  status: "Active",
  productionCity: "Las Vegas",
  facilityId: "LV001", // Matched with mockFacilityData below
};

export const mockFacilityData: FacilityData[] = [
  {
    facilityId: "LV001", // Changed to match mockProjectData
    facilityName: "Main Exhibition Hall",
    hall: "Hall A",
    location1: "North Wing",
    location2: "Level 1",
    areaCode: "702",
    phone: "555-0101",
  },
  {
    facilityId: "LV002",
    facilityName: "Conference Center",
    hall: "Hall B",
    location1: "South Wing",
    location2: "Level 2",
    areaCode: "702",
    phone: "555-0102",
  },
];

// --- Existing Customer Data (Ensure it's here or imported if separate) ---

export type CustomerType = 'Exhibitors' | 'ShowOrg' | '3rd party';

export interface Customer {
  id: string;
  showId: string;
  customerId: string;
  customerName: string;
  type: CustomerType[];
  isActive: boolean;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  facilityId: string;
  facilityName: string;
  netTerms?: string;
  riskDesc?: string;
  subContractor?: {
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
  };
  boothNumber: string;
  zone: string;
  boothType?: string;
  serviceIssue?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  contactType?: string;
  contactRole?: string;
  sharedBooth?: boolean;
  operationZone?: string;
  serviceZone?: string;
  targetZone?: string;
  emptyZone?: string;
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    showId: 'AWS23',
    customerId: '5826',
    customerName: 'Amazon Web Services',
    type: ['ShowOrg'],
    isActive: true,
    email: 'aws.customer1@example.com',
    phone: '123-456-7890',
    address: '123 Any Ave, Suite 100',
    cityStateZip: 'Las Vegas, NV 12345',
    facilityId: 'Facoo11',
    facilityName: 'Las Vegas Convention Center',
    netTerms: '30 NET',
    riskDesc: 'Low Risk',
    boothNumber: 'B101',
    zone: 'A',
    boothType: 'Island',
    serviceIssue: 'Pending electrical setup',
    firstName: 'John',
    lastName: 'Doe',
    country: 'USA',
    contactType: 'Primary',
    contactRole: 'Manager',
    sharedBooth: true,
    operationZone: 'Zone 1',
    serviceZone: 'Zone 2',
    targetZone: 'Zone 3',
    emptyZone: 'Zone 4'
  },
  {
    id: '2',
    showId: 'AWS23',
    customerId: '98214',
    customerName: 'Cloud Solutions Inc',
    type: ['Exhibitors'],
    isActive: true,
    email: 'aws.customer2@example.com',
    phone: '997-854-3210',
    address: '987 Some PL, Suite 200',
    cityStateZip: 'Los Angeles, CA 98765',
    facilityId: 'FAC001',
    facilityName: 'Sands Expo Center',
    netTerms: '15 NET',
    riskDesc: 'Medium Risk',
    boothNumber: 'B102',
    zone: 'B',
    boothType: 'Inline',
    firstName: 'Jane',
    lastName: 'Smith',
    country: 'USA',
    contactType: 'Secondary',
    contactRole: 'Assistant',
    sharedBooth: false,
    operationZone: 'Zone 1',
    serviceZone: 'Zone 2',
    targetZone: 'Zone 3',
    emptyZone: 'Zone 4'
  },
  {
    id: '3',
    showId: 'MSFT24',
    customerId: '5828',
    customerName: 'Azure Technologies',
    type: ['3rd party'],
    isActive: false,
    email: 'msft.customer@example.com',
    phone: '555-123-4567',
    address: '789 Azure Plaza',
    cityStateZip: 'Seattle, WA 98101',
    facilityId: 'FAC003',
    facilityName: 'Seattle Convention Center',
    netTerms: '60 NET',
    riskDesc: 'High Risk - Past Due',
    subContractor: {
      name: 'TechBooth Setup Services',
      contactName: 'John Smith',
      phone: '555-987-6543',
      email: 'john@techboothsetup.com'
    },
    boothNumber: 'C103',
    zone: 'C',
    boothType: 'Peninsula',
    serviceIssue: 'AV equipment malfunction reported',
    firstName: 'Alice',
    lastName: 'Johnson',
    country: 'USA',
    contactType: 'Primary',
    contactRole: 'Director',
    sharedBooth: true,
    operationZone: 'Zone 1',
    serviceZone: 'Zone 2',
    targetZone: 'Zone 3',
    emptyZone: 'Zone 4'
  },
  {
    id: '4',
    showId: 'AWS23',
    customerId: '5827',
    customerName: 'Amazon Web Services kubernates',
    type: ['Exhibitors'],
    isActive: true,
    email: 'aws.customer2@example.com',
    phone: '123-456-7891',
    address: '123 AWS Ave, Suite 1012',
    cityStateZip: 'Las Vegas, NV 12345',
    facilityId: 'FAC005',
    facilityName: 'Venetian Expo',
    netTerms: '30 NET',
    riskDesc: 'Low Risk',
    boothNumber: 'B103',
    zone: 'A',
    boothType: 'Inline',
    firstName: 'Bob',
    lastName: 'Brown',
    country: 'USA',
    contactType: 'Secondary',
    contactRole: 'Coordinator',
    sharedBooth: false,
    operationZone: 'Zone 1',
    serviceZone: 'Zone 2',
    targetZone: 'Zone 3',
    emptyZone: 'Zone 4'
  },
  {
    id: '5',
    showId: 'CES24',
    customerId: '5830',
    customerName: 'Tech Innovations LLC',
    type: ['Exhibitors', '3rd party'],
    isActive: true,
    email: 'contact@techinnovations.com',
    phone: '702-555-8899',
    address: '789 Innovation Ave',
    cityStateZip: 'Las Vegas, NV 89109',
    facilityId: 'FAC006',
    facilityName: 'Las Vegas Convention Center',
    netTerms: 'NET 30',
    riskDesc: 'New Customer',
    subContractor: {
      name: 'BoothMasters Inc',
      contactName: 'Sarah Johnson',
      phone: '702-555-7733',
      email: 'sarah@boothmasters.com'
    },
    boothNumber: 'D105',
    zone: 'D',
    boothType: 'Custom',
    serviceIssue: 'None',
    firstName: 'Charlie',
    lastName: 'Davis',
    country: 'USA',
    contactType: 'Primary',
    contactRole: 'Lead',
    sharedBooth: true,
    operationZone: 'Zone 1',
    serviceZone: 'Zone 2',
    targetZone: 'Zone 3',
    emptyZone: 'Zone 4'
  }
]; 