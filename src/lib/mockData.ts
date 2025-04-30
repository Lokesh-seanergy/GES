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

// Constants for generating mock data
const OCCR_TYPES = [
  "Annual Conference",
  "Trade Show",
  "Developer Conference",
  "Exhibition",
  "Seminar",
  "Workshop",
  "Product Launch",
  "Industry Summit",
  "Networking Event",
  "Training Session"
];

const MARKET_TYPES = [
  "Cloud & Enterprise",
  "Software Development",
  "Technology",
  "Consumer Electronics",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Entertainment"
];

const CITIES = [
  "Las Vegas, NV",
  "San Francisco, CA",
  "New York, NY",
  "Chicago, IL",
  "Orlando, FL",
  "Boston, MA",
  "Seattle, WA",
  "Austin, TX",
  "Denver, CO",
  "Miami, FL"
];

// Hotel names to use as facility IDs
const HOTEL_NAMES = [
  'miccron', 'pepper', 'hilton', 'marriott', 'hyatt',
  'sheraton', 'westin', 'omni', 'wyndham', 'radisson'
];

// Helper to get abbreviation from show name
function getShowAbbreviation(showName: string): string {
  return showName
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase())
    .join('');
}

// Helper to get YYYYMM from yrmo
function getYearMonth(yrmo: string): string {
  return yrmo.replace('-', '');
}

// Function to generate random show data
const generateShowData = (index: number): ShowData => {
  const year = 2025;
  const month = Math.floor(Math.random() * 12) + 1;
  const formattedMonth = month.toString().padStart(2, '0');
  const showId = `SHW${(index + 1).toString().padStart(3, '0')}`;
  const occrType = OCCR_TYPES[Math.floor(Math.random() * OCCR_TYPES.length)];
  const marketType = MARKET_TYPES[Math.floor(Math.random() * MARKET_TYPES.length)];
  const cityOrg = CITIES[Math.floor(Math.random() * CITIES.length)];
  const yrmo = `${year}-${formattedMonth}`;
  
  return {
    showId,
    showName: `${occrType} ${year} - ${cityOrg.split(',')[0]}`,
    occrId: `${showId}-${cityOrg.split(',')[1].trim()}`,
    occrType,
    marketType,
    projectNumber: `${getShowAbbreviation(occrType)}${getYearMonth(yrmo)}`,
    cityOrg,
    yrmo
  };
};

// Predefined shows with specific data
const predefinedShows: ShowData[] = [
  {
    showId: 'SHW001',
    showName: 'Developer Conference',
    occrId: 'SHW001-CA',
    occrType: 'Developer Conference',
    marketType: 'Software Development',
    projectNumber: `${getShowAbbreviation('Developer Conference')}${getYearMonth('2025-04')}`,
    cityOrg: 'San Francisco, CA',
    yrmo: '2025-04'
  },
  {
    showId: 'SHW002',
    showName: 'Annual Tech Summit ',
    occrId: 'SHW002-NV',
    occrType: 'Annual Conference',
    marketType: 'Technology',
    projectNumber: `${getShowAbbreviation('Annual Tech Summit')}${getYearMonth('2025-05')}`,
    cityOrg: 'Las Vegas, NV',
    yrmo: '2025-05'
  },
  {
    showId: 'SHW003',
    showName: 'Healthcare Expo ',
    occrId: 'SHW003-MA',
    occrType: 'Exhibition',
    marketType: 'Healthcare',
    projectNumber: `${getShowAbbreviation('Healthcare Expo')}${getYearMonth('2025-06')}`,
    cityOrg: 'Boston, MA',
    yrmo: '2025-06'
  }
];

// Generate remaining shows
export const mockShows: ShowData[] = [
  ...predefinedShows,
  ...Array.from({ length: 147 }, (_, index) => {
    const show = generateShowData(index + predefinedShows.length);
    const abbr = getShowAbbreviation(show.showName);
    const yyyymm = getYearMonth(show.yrmo);
    return {
      ...show,
      projectNumber: `${abbr}${yyyymm}`
    };
  })
];

// Predefined project data
const predefinedProjects: ProjectData[] = [
  {
    projectName: 'Developer Conference ',
    projectNumber: `${getShowAbbreviation('Developer Conference')}${getYearMonth('2025-04')}`,
    projectType: 'Developer Conference',
    status: 'Planning',
    productionCity: 'San Francisco',
    facilityId: HOTEL_NAMES[0]
  },
  {
    projectName: 'Annual Tech Summit',
    projectNumber: `${getShowAbbreviation('Annual Tech Summit')}${getYearMonth('2025-05')}`,
    projectType: 'Annual Conference',
    status: 'Planning',
    productionCity: 'Las Vegas',
    facilityId: HOTEL_NAMES[1]
  },
  {
    projectName: 'Healthcare Expo ',
    projectNumber: `${getShowAbbreviation('Healthcare Expo')}${getYearMonth('2025-06')}`,
    projectType: 'Exhibition',
    status: 'Planning',
    productionCity: 'Boston',
    facilityId: HOTEL_NAMES[2]
  }
];

// Project data for all shows
export const mockProjectData: ProjectData[] = [
  ...predefinedProjects,
  ...mockShows.slice(predefinedProjects.length, 20).map((show, index) => ({
    projectName: `Project ${show.showName}`,
    projectNumber: show.projectNumber,
    projectType: show.occrType,
    status: ["Active", "Planning", "Completed"][Math.floor(Math.random() * 3)],
    productionCity: show.cityOrg.split(',')[0],
    facilityId: HOTEL_NAMES[(index + predefinedProjects.length) % HOTEL_NAMES.length]
  }))
];

// Predefined facility data
const predefinedFacilities: FacilityData[] = [
  {
    facilityId: HOTEL_NAMES[0],
    facilityName: 'San Francisco Convention Center',
    hall: 'Hall A',
    location1: 'San Francisco Downtown',
    location2: 'Main Exhibition Area',
    areaCode: '415',
    phone: '5555-000012'
  },
  {
    facilityId: HOTEL_NAMES[1],
    facilityName: 'Las Vegas Convention Center',
    hall: 'Hall B',
    location1: 'Las Vegas Strip',
    location2: 'North Exhibition Hall',
    areaCode: '702',
    phone: '5555-000222'
  },
  {
    facilityId: HOTEL_NAMES[2],
    facilityName: 'Boston Convention Center',
    hall: 'Hall C',
    location1: 'Boston Downtown',
    location2: 'East Exhibition Hall',
    areaCode: '617',
    phone: '5555-000333'
  }
];

// Facility data for all projects
export const mockFacilityData: FacilityData[] = [
  ...predefinedFacilities,
  ...mockProjectData.slice(predefinedFacilities.length).map((project, index) => ({
    facilityId: project.facilityId,
    facilityName: `${project.productionCity} Convention Center`,
    hall: `Hall ${String.fromCharCode(65 + (index % 5))}`,
    location1: `${project.productionCity} Downtown`,
    location2: "Main Exhibition Area",
    areaCode: "555",
    phone: `555-${(1000 + index).toString().padStart(4, '0')}`
  }))
];

// --- Existing Customer Data (Ensure it's here or imported if separate) ---

export type CustomerType = 'Exhibitors' | 'ShowOrg' | '3rd party';

export interface CustomerData {
  id: string;
  showId: string;
  customerId: string;
  customerName: string;
  type: CustomerType[];
  isActive: boolean;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  boothNumber: string;
  boothSize: string;
  orders: number;
  booths: number;
  status: string;
  facilityId: string;
  facilityName: string;
  projectNumber: string;
  boothLength?: string;
  boothWidth?: string;
  netTerms?: string;
  riskDesc?: string;
  subContractor?: {
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
  };
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

// Function to generate booth number based on show and customer details
const generateBoothNumber = (showId: string, customerType: CustomerType[], index: number): string => {
  const randomNumber = Math.floor(Math.random() * 999) + 1; // Generate random number between 1 and 999
  const paddedNumber = randomNumber.toString().padStart(3, '0'); // Pad with zeros to ensure 3 digits
  const typeCode = customerType.includes('Exhibitors') ? 'EX' : 
                  customerType.includes('ShowOrg') ? 'SO' : 'TP';
  return `${typeCode}${paddedNumber}`;
};

// Predefined customers for specific shows
const generatePredefinedCustomers = (showId: string): CustomerData[] => {
  const show = predefinedShows.find(s => s.showId === showId);
  const projectNumber = show ? show.projectNumber : 'UNKNOWN';
  const predefinedCustomersMap: { [key: string]: CustomerData[] } = {
    'SHW001': [
      // Show Organizer
      {
        id: `${showId}-SO1`,
        showId,
        customerId: 'DEV001',
        customerName: 'Developer Conference Organization',
        type: ['ShowOrg'],
        isActive: true,
        email: 'organizer@devconf.com',
        phone: '5555-010012',
        address: {
          street: '100 Conference Way',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'USA'
        },
        boothNumber: 'SO123',
        boothSize: '1000',
        orders: 3,
        booths: 2,
        status: 'Active',
        facilityId: HOTEL_NAMES[0],
        facilityName: 'San Francisco Convention Center',
        projectNumber,
        boothLength: '20',
        boothWidth: '10',
        netTerms: '30 NET',
        riskDesc: 'Low Risk',
        zone: 'A',
        boothType: 'Island',
        firstName: 'James',
        lastName: 'Wilson',
        contactType: 'Primary',
        contactRole: 'Event Director',
        sharedBooth: false,
        operationZone: 'Zone 1',
        serviceZone: 'Zone 1',
        targetZone: 'Zone 1',
        emptyZone: 'Zone 1'
      },
      // Regular Customers
      {
        id: `${showId}-1`,
        showId,
        customerId: 'MYM001',
        customerName: 'MYM',
        type: ['3rd party', 'Exhibitors'],
        isActive: true,
        email: 'contact@mym.com',
        phone: '5555-010112',
        address: {
          street: '123 Tech Ave',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'USA'
        },
        boothNumber: 'EX234',
        boothSize: '800',
        orders: 2,
        booths: 1,
        status: 'Active',
        facilityId: HOTEL_NAMES[1],
        facilityName: 'San Francisco Convention Center',
        projectNumber,
        boothLength: '15',
        boothWidth: '8',
        netTerms: '60 NET',
        riskDesc: 'Low Risk',
        zone: 'B',
        boothType: 'Island',
        firstName: 'John',
        lastName: 'Smith',
        contactType: 'Primary',
        contactRole: 'Manager',
        sharedBooth: false,
        operationZone: 'Zone 2',
        serviceZone: 'Zone 2',
        targetZone: 'Zone 2',
        emptyZone: 'Zone 2'
      },
      {
        id: `${showId}-2`,
        showId,
        customerId: '3M001',
        customerName: '3M Solutions',
        type: ['Exhibitors'],
        isActive: true,
        email: 'contact@3msolutions.com',
        phone: '5555-010222',
        address: {
          street: '456 Innovation Blvd',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'USA'
        },
        boothNumber: 'EX345',
        boothSize: '600',
        orders: 1,
        booths: 1,
        status: 'Active',
        facilityId: HOTEL_NAMES[2],
        facilityName: 'San Francisco Convention Center',
        projectNumber,
        boothLength: '12',
        boothWidth: '6',
        netTerms: '45 NET',
        riskDesc: 'Medium Risk',
        zone: 'B',
        boothType: 'Inline',
        firstName: 'Jane',
        lastName: 'Doe',
        contactType: 'Primary',
        contactRole: 'Director',
        sharedBooth: false,
        operationZone: 'Zone 2',
        serviceZone: 'Zone 2',
        targetZone: 'Zone 2',
        emptyZone: 'Zone 2'
      },
      {
        id: `${showId}-3`,
        showId,
        customerId: 'LV001',
        customerName: 'Las Vegas Events',
        type: ['3rd party'],
        isActive: true,
        email: 'contact@lvevents.com',
        phone: '5555-010333',
        address: {
          street: '789 Convention Way',
          city: 'Las Vegas',
          state: 'NV',
          zip: '89109',
          country: 'USA'
        },
        boothNumber: 'TP456',
        boothSize: '400',
        orders: 1,
        booths: 1,
        status: 'Active',
        facilityId: HOTEL_NAMES[3],
        facilityName: 'San Francisco Convention Center',
        projectNumber,
        boothLength: '10',
        boothWidth: '5',
        netTerms: '60 NET',
        riskDesc: 'Low Risk',
        zone: 'C',
        boothType: 'Corner',
        firstName: 'Mike',
        lastName: 'Johnson',
        contactType: 'Primary',
        contactRole: 'Coordinator',
        sharedBooth: false,
        operationZone: 'Zone 3',
        serviceZone: 'Zone 3',
        targetZone: 'Zone 3',
        emptyZone: 'Zone 3'
      },
      {
        id: `${showId}-4`,
        showId,
        customerId: 'TECH001',
        customerName: 'Tech Solutions Inc',
        type: ['Exhibitors', '3rd party'],
        isActive: true,
        email: 'contact@techsol.com',
        phone: '5555-010444',
        address: {
          street: '321 Silicon Valley',
          city: 'San Jose',
          state: 'CA',
          zip: '95110',
          country: 'USA'
        },
        boothNumber: 'EX567',
        boothSize: '500',
        orders: 2,
        booths: 1,
        status: 'Active',
        facilityId: HOTEL_NAMES[4],
        facilityName: 'San Francisco Convention Center',
        projectNumber,
        boothLength: '14',
        boothWidth: '7',
        netTerms: '45 NET',
        riskDesc: 'Medium Risk',
        zone: 'B',
        boothType: 'Peninsula',
        firstName: 'Sarah',
        lastName: 'Lee',
        contactType: 'Primary',
        contactRole: 'Technical Lead',
        sharedBooth: true,
        operationZone: 'Zone 2',
        serviceZone: 'Zone 2',
        targetZone: 'Zone 2',
        emptyZone: 'Zone 2'
      },
      {
        id: `${showId}-5`,
        showId,
        customerId: 'CLOUD001',
        customerName: 'Cloud Computing Services',
        type: ['Exhibitors'],
        isActive: true,
        email: 'contact@cloudserv.com',
        phone: '5555-010555',
        address: {
          street: '567 Cloud Street',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'USA'
        },
        boothNumber: 'EX678',
        boothSize: '700',
        orders: 3,
        booths: 1,
        status: 'Active',
        facilityId: HOTEL_NAMES[5],
        facilityName: 'San Francisco Convention Center',
        projectNumber,
        boothLength: '18',
        boothWidth: '9',
        netTerms: '30 NET',
        riskDesc: 'Low Risk',
        zone: 'A',
        boothType: 'Island',
        firstName: 'Robert',
        lastName: 'Chen',
        contactType: 'Primary',
        contactRole: 'Sales Director',
        sharedBooth: false,
        operationZone: 'Zone 1',
        serviceZone: 'Zone 1',
        targetZone: 'Zone 1',
        emptyZone: 'Zone 1'
      }
    ],
    'SHW002': [
      // Show Organizer
      {
        id: `${showId}-SO1`,
        showId,
        customerId: 'TECH002',
        customerName: 'Tech Summit Organization',
        type: ['ShowOrg'],
        isActive: true,
        email: 'organizer@techsummit.com',
        phone: '555-0200',
        address: {
          street: '200 Summit Blvd',
          city: 'Las Vegas',
          state: 'NV',
          zip: '89109',
          country: 'USA'
        },
        boothNumber: 'SO123',
        boothSize: '1200',
        orders: 4,
        booths: 2,
        status: 'Active',
        facilityId: HOTEL_NAMES[1],
        facilityName: 'Las Vegas Convention Center',
        projectNumber,
        boothLength: '20',
        boothWidth: '10',
        netTerms: '30 NET',
        riskDesc: 'Low Risk',
        zone: 'A',
        boothType: 'Island',
        firstName: 'Michael',
        lastName: 'Brown',
        contactType: 'Primary',
        contactRole: 'Event Director',
        sharedBooth: false,
        operationZone: 'Zone 1',
        serviceZone: 'Zone 1',
        targetZone: 'Zone 1',
        emptyZone: 'Zone 1'
      },
      // Regular customers...
      {
        id: `${showId}-1`,
        showId,
        customerId: 'TECH001',
        customerName: 'TechCorp Solutions',
        type: ['Exhibitors', '3rd party'],
        isActive: true,
        email: 'contact@techcorp.com',
        phone: '5555-020112',
        address: {
          street: '789 Tech Parkway',
          city: 'Las Vegas',
          state: 'NV',
          zip: '89109',
          country: 'USA'
        },
        boothNumber: 'EX234',
        boothSize: '1000',
        orders: 3,
        booths: 2,
        status: 'Active',
        facilityId: HOTEL_NAMES[1],
        facilityName: 'Las Vegas Convention Center',
        projectNumber,
        boothLength: '15',
        boothWidth: '8',
        netTerms: '45 NET',
        riskDesc: 'Low Risk',
        zone: 'B',
        boothType: 'Island',
        firstName: 'Robert',
        lastName: 'Wilson',
        contactType: 'Primary',
        contactRole: 'CEO',
        sharedBooth: false,
        operationZone: 'Zone 2',
        serviceZone: 'Zone 2',
        targetZone: 'Zone 2',
        emptyZone: 'Zone 2'
      },
      // Add more customers for SHW002...
    ],
    'SHW003': [
      // Show Organizer
      {
        id: `${showId}-SO1`,
        showId,
        customerId: 'HEALTH002',
        customerName: 'Healthcare Expo Organization',
        type: ['ShowOrg'],
        isActive: true,
        email: 'organizer@healthexpo.com',
        phone: '555-0300',
        address: {
          street: '300 Medical Drive',
          city: 'Boston',
          state: 'MA',
          zip: '02108',
          country: 'USA'
        },
        boothNumber: 'SO123',
        boothSize: '1100',
        orders: 3,
        booths: 2,
        status: 'Active',
        facilityId: HOTEL_NAMES[2],
        facilityName: 'Boston Convention Center',
        projectNumber,
        boothLength: '18',
        boothWidth: '9',
        netTerms: '30 NET',
        riskDesc: 'Low Risk',
        zone: 'A',
        boothType: 'Island',
        firstName: 'Elizabeth',
        lastName: 'Taylor',
        contactType: 'Primary',
        contactRole: 'Event Director',
        sharedBooth: false,
        operationZone: 'Zone 1',
        serviceZone: 'Zone 1',
        targetZone: 'Zone 1',
        emptyZone: 'Zone 1'
      },
      // Regular customers...
      {
        id: `${showId}-1`,
        showId,
        customerId: 'MED001',
        customerName: 'MedTech Innovations',
        type: ['Exhibitors', '3rd party'],
        isActive: true,
        email: 'contact@medtech.com',
        phone: '5555-030112',
        address: {
          street: '123 Medical Center Blvd',
          city: 'Boston',
          state: 'MA',
          zip: '02108',
          country: 'USA'
        },
        boothNumber: 'EX234',
        boothSize: '800',
        orders: 2,
        booths: 1,
        status: 'Active',
        facilityId: HOTEL_NAMES[2],
        facilityName: 'Boston Convention Center',
        projectNumber,
        boothLength: '12',
        boothWidth: '6',
        netTerms: '60 NET',
        riskDesc: 'Low Risk',
        zone: 'B',
        boothType: 'Island',
        firstName: 'Emily',
        lastName: 'Brown',
        contactType: 'Primary',
        contactRole: 'Manager',
        sharedBooth: false,
        operationZone: 'Zone 2',
        serviceZone: 'Zone 2',
        targetZone: 'Zone 2',
        emptyZone: 'Zone 2'
      },
      // Add more customers for SHW003...
    ]
  };

  return predefinedCustomersMap[showId] || [];
};

// Function to generate customer data for a show
const generateCustomersForShow = (showId: string): CustomerData[] => {
  // Check if we have predefined customers for this show
  const predefinedCustomers = generatePredefinedCustomers(showId);
  if (predefinedCustomers.length > 0) {
    return predefinedCustomers;
  }

  // For other shows, generate random customers
  const customerTypes: CustomerType[] = ['Exhibitors', 'ShowOrg', '3rd party'];
  const riskLevels = ['Low Risk', 'Medium Risk', 'High Risk'];
  const netTermOptions = ['15 NET', '30 NET', '45 NET', '60 NET'];
  const boothSizes = ['200', '400', '600', '800', '1000'];
  const zones = ['A', 'B', 'C', 'D'];
  const boothTypes = ['Island', 'Inline', 'Corner', 'Peninsula'];
  
  const numCustomers = Math.floor(Math.random() * 11) + 10;
  
  return Array.from({ length: numCustomers }, (_, index) => {
    const type = [customerTypes[Math.floor(Math.random() * customerTypes.length)]];
    const boothNumber = generateBoothNumber(showId, type, index);
    const facilityId = HOTEL_NAMES[index % HOTEL_NAMES.length];
    return {
      id: `${showId}-${index + 1}`,
      showId,
      customerId: Math.floor(Math.random() * 100000).toString(),
      customerName: `Customer ${index + 1} for ${showId}`,
      type,
      isActive: Math.random() > 0.2,
      email: `customer${index + 1}.${showId.toLowerCase()}@example.com`,
      phone: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} Business Ave`,
        city: CITIES[Math.floor(Math.random() * CITIES.length)].split(',')[0],
        state: CITIES[Math.floor(Math.random() * CITIES.length)].split(',')[1].trim(),
        zip: Math.floor(Math.random() * 90000 + 10000).toString(),
        country: 'USA'
      },
      boothNumber,
      boothSize: boothSizes[Math.floor(Math.random() * boothSizes.length)],
      orders: Math.floor(Math.random() * 5),
      booths: Math.floor(Math.random() * 3) + 1,
      status: Math.random() > 0.2 ? 'Active' : 'Inactive',
      facilityId,
      facilityName: 'Convention Center',
      projectNumber: `P${Math.floor(Math.random() * 1000) + 1}-${Math.floor(Math.random() * 1000) + 1}`,
      boothLength: (Math.floor(Math.random() * 20) + 10).toString(),
      boothWidth: (Math.floor(Math.random() * 10) + 5).toString(),
      netTerms: netTermOptions[Math.floor(Math.random() * netTermOptions.length)],
      riskDesc: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      zone: zones[Math.floor(Math.random() * zones.length)],
      boothType: boothTypes[Math.floor(Math.random() * boothTypes.length)],
      firstName: `FirstName${index + 1}`,
      lastName: `LastName${index + 1}`,
      contactType: Math.random() > 0.5 ? 'Primary' : 'Secondary',
      contactRole: 'Manager',
      sharedBooth: Math.random() > 0.7,
      operationZone: `Zone ${Math.floor(Math.random() * 4) + 1}`,
      serviceZone: `Zone ${Math.floor(Math.random() * 4) + 1}`,
      targetZone: `Zone ${Math.floor(Math.random() * 4) + 1}`,
      emptyZone: `Zone ${Math.floor(Math.random() * 4) + 1}`
    };
  });
};

// Generate customers for all shows
export const mockCustomers: CustomerData[] = mockShows.flatMap(show => 
  generateCustomersForShow(show.showId)
);

// Key Dates interface
export interface ShowKeyDate {
  dateType: string;
  projectNumber: string;
  facilityId: string;
  dateTime: string;
  notes: string;
}

// General Info interfaces
export interface ShowMeasurements {
  totalSqFtProjected: number;
  totalSqFtActual: number;
  freightProjected: number;
  freightActual: number;
  graphicsProjected: number;
  graphicsActual: number;
}

export interface ShowOptions {
  flooringMandatory: boolean;
  targetedShow: boolean;
  marshalling: boolean;
  noRTW: boolean;
  natlOpsTeam: boolean;
  designCollaboration: boolean;
  cleanFloorPolicy: boolean;
  showOrgBoothPkg: boolean;
  tierPricing: string;
}

export interface ShowComments {
  freightInfo: string;
  showPackage: string;
  specifyLogo: string;
  exhibitorSurvey: string;
}

// Generate mock key dates for a show
const generateKeyDates = (showId: string, projectNumber: string, facilityId: string): ShowKeyDate[] => {
  const dateTypes = ['Move-in', 'Show Start', 'Show End', 'Move-out'];
  const currentDate = new Date('2025-04-01');
  
  return dateTypes.map((dateType, index) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + index);
    
    return {
      dateType,
      projectNumber,
      facilityId,
      dateTime: date.toISOString(),
      notes: `${dateType} schedule for ${showId}`
    };
  });
};

// Generate mock measurements
const generateMeasurements = (): ShowMeasurements => ({
  totalSqFtProjected: Math.floor(Math.random() * 5000) + 5000,
  totalSqFtActual: Math.floor(Math.random() * 5000) + 5000,
  freightProjected: Math.floor(Math.random() * 1000) + 1000,
  freightActual: Math.floor(Math.random() * 1000) + 1000,
  graphicsProjected: Math.floor(Math.random() * 500) + 500,
  graphicsActual: Math.floor(Math.random() * 500) + 500
});

// Generate mock show options
const generateShowOptions = (): ShowOptions => ({
  flooringMandatory: Math.random() > 0.5,
  targetedShow: Math.random() > 0.5,
  marshalling: Math.random() > 0.5,
  noRTW: Math.random() > 0.5,
  natlOpsTeam: Math.random() > 0.5,
  designCollaboration: Math.random() > 0.5,
  cleanFloorPolicy: Math.random() > 0.5,
  showOrgBoothPkg: Math.random() > 0.5,
  tierPricing: ['Standard', 'Premium', 'Custom'][Math.floor(Math.random() * 3)]
});

// Generate mock comments
const generateComments = (showId: string): ShowComments => ({
  freightInfo: `Freight handling instructions for ${showId}. Please coordinate with logistics team.`,
  showPackage: `Standard show package includes basic booth setup, furniture, and electrical connections.`,
  specifyLogo: `Logo placement as per brand guidelines. High-resolution assets required.`,
  exhibitorSurvey: `Survey to be sent 2 days after show completion.`
});

// Add key dates, measurements, options, and comments to the first 20 shows
export const mockShowDetails = mockShows.slice(0, 20).map((show, index) => ({
  showId: show.showId,
  keyDates: generateKeyDates(show.showId, show.projectNumber, mockProjectData[index].facilityId),
  measurements: generateMeasurements(),
  showOptions: generateShowOptions(),
  comments: generateComments(show.showId)
}));

// Order Types and Data
export interface Order {
  orderId: string;
  showId: string;
  occurrenceId: string;
  subTotal: number;
  salesChannel: string;
  terms: string;
  tax: number;
  orderType: string;
  customerPO: string;
  cancelCharge: number;
  source: string;
  project: string;
  orderDate: string;
  boothInfo: string;
  billingAddress: string;
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  serialNo: number;
  orderedItem: string;
  itemDescription: string;
  quantity: number;
  cancellationFee: number;
  quantityCancelled: number;
  uom: string;
  kitPrice: number;
  newPrice: number;
  discount: number;
  extendedPrice: number;
  userItemDescription: string;
  dff: string;
  orderReceivedDate: string;
  status: string;
  itemType: string;
  ato: boolean;
  lineType: string;
  documentNumber: string;
  industryInformation: string;
}

export const mockOrders: Order[] = [
  {
    orderId: "ORD-001",
    showId: "AWS23",
    occurrenceId: "AWS23-LV",
    subTotal: 15000,
    salesChannel: "Direct",
    terms: "Net 30",
    tax: 1500,
    orderType: "New",
    customerPO: "PO-12345",
    cancelCharge: 0,
    source: "Web",
    project: "P2024-001",
    orderDate: "2025-03-20",
    boothInfo: "Booth #A12",
    billingAddress: "123 Main St, New York, NY 10001",
    total: 16500,
    items: [
      {
        serialNo: 1,
        orderedItem: "Booth Package A",
        itemDescription: "Standard 10x10 Booth",
        quantity: 1,
        cancellationFee: 0,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 3000,
        newPrice: 3000,
        discount: 0,
        extendedPrice: 3000,
        userItemDescription: "Standard booth with basic setup",
        dff: "N/A",
        orderReceivedDate: "-03-20",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-001",
        industryInformation: "Technology",
      },
      {
        serialNo: 2,
        orderedItem: "LED Screen",
        itemDescription: "55-inch LED Display",
        quantity: 2,
        cancellationFee: 500,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 2000,
        newPrice: 2000,
        discount: 0,
        extendedPrice: 4000,
        userItemDescription: "High-resolution display for presentations",
        dff: "N/A",
        orderReceivedDate: "2025-03-20",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-002",
        industryInformation: "Technology",
      },
      {
        serialNo: 3,
        orderedItem: "Furniture Package",
        itemDescription: "Basic Booth Furniture Set",
        quantity: 1,
        cancellationFee: 200,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 8000,
        newPrice: 8000,
        discount: 0,
        extendedPrice: 8000,
        userItemDescription: "Includes table, chairs, and storage",
        dff: "N/A",
        orderReceivedDate: "2025-03-20",
        status: "Confirmed",
        itemType: "Furniture",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-003",
        industryInformation: "Technology",
      }
    ]
  },
  {
    orderId: "ORD-002",
    showId: "MSFT24",
    occurrenceId: "BUILD24-SEA",
    subTotal: 25000,
    salesChannel: "Partner",
    terms: "Net 45",
    tax: 2500,
    orderType: "New",
    customerPO: "PO-23456",
    cancelCharge: 0,
    source: "Email",
    project: "P2024-002",
    orderDate: "2025-03-21",
    boothInfo: "Booth #B15",
    billingAddress: "456 Tech Ave, Seattle, WA 98101",
    total: 27500,
    items: [
      {
        serialNo: 1,
        orderedItem: "Premium Booth Package",
        itemDescription: "20x20 Premium Booth",
        quantity: 1,
        cancellationFee: 1000,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 12000,
        newPrice: 12000,
        discount: 0,
        extendedPrice: 12000,
        userItemDescription: "Premium booth with custom branding",
        dff: "N/A",
        orderReceivedDate: "2025-03-21",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-004",
        industryInformation: "Software",
      },
      {
        serialNo: 2,
        orderedItem: "AV Package",
        itemDescription: "Complete Audio-Visual Setup",
        quantity: 1,
        cancellationFee: 800,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 8000,
        newPrice: 8000,
        discount: 0,
        extendedPrice: 8000,
        userItemDescription: "Includes sound system and projectors",
        dff: "N/A",
        orderReceivedDate: "2025-03-21",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-005",
        industryInformation: "Software",
      },
      {
        serialNo: 3,
        orderedItem: "Server Rack",
        itemDescription: "Enterprise Server Rack",
        quantity: 2,
        cancellationFee: 800,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 8000,
        newPrice: 8000,
        discount: 0,
        extendedPrice: 16000,
        userItemDescription: "Enterprise-grade server racks",
        dff: "N/A",
        orderReceivedDate: "2025-03-21",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-006",
        industryInformation: "Cloud Computing",
      }
    ]
  }
];