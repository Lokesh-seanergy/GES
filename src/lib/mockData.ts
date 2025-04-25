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

// Function to generate random show data
const generateShowData = (index: number): ShowData => {
  const year = 2024;
  const month = Math.floor(Math.random() * 12) + 1;
  const formattedMonth = month.toString().padStart(2, '0');
  const showId = `SHW${(index + 1).toString().padStart(3, '0')}`;
  const occrType = OCCR_TYPES[Math.floor(Math.random() * OCCR_TYPES.length)];
  const marketType = MARKET_TYPES[Math.floor(Math.random() * MARKET_TYPES.length)];
  const cityOrg = CITIES[Math.floor(Math.random() * CITIES.length)];
  
  return {
    showId,
    showName: `${occrType} ${year} - ${cityOrg.split(',')[0]}`,
    occrId: `${showId}-${cityOrg.split(',')[1].trim()}`,
    occrType,
    marketType,
    projectNumber: `P${year}-${(index + 1).toString().padStart(3, '0')}`,
    cityOrg,
    yrmo: `${year}-${formattedMonth}`
  };
};

// Predefined shows with specific data
const predefinedShows: ShowData[] = [
  {
    showId: 'SHW001',
    showName: 'Developer Conference 2024 - San Francisco',
    occrId: 'SHW001-CA',
    occrType: 'Developer Conference',
    marketType: 'Software Development',
    projectNumber: 'P2024-001',
    cityOrg: 'San Francisco, CA',
    yrmo: '2024-04'
  },
  {
    showId: 'SHW002',
    showName: 'Annual Tech Summit 2024 - Las Vegas',
    occrId: 'SHW002-NV',
    occrType: 'Annual Conference',
    marketType: 'Technology',
    projectNumber: 'P2024-002',
    cityOrg: 'Las Vegas, NV',
    yrmo: '2024-05'
  },
  {
    showId: 'SHW003',
    showName: 'Healthcare Expo 2024 - Boston',
    occrId: 'SHW003-MA',
    occrType: 'Exhibition',
    marketType: 'Healthcare',
    projectNumber: 'P2024-003',
    cityOrg: 'Boston, MA',
    yrmo: '2024-06'
  }
];

// Generate remaining shows
export const mockShows: ShowData[] = [
  ...predefinedShows,
  ...Array.from({ length: 147 }, (_, index) => generateShowData(index + predefinedShows.length))
];

// Predefined project data
const predefinedProjects: ProjectData[] = [
  {
    projectName: 'Developer Conference 2024',
    projectNumber: 'P2024-001',
    projectType: 'Developer Conference',
    status: 'Planning',
    productionCity: 'San Francisco',
    facilityId: 'FAC001'
  },
  {
    projectName: 'Annual Tech Summit 2024',
    projectNumber: 'P2024-002',
    projectType: 'Annual Conference',
    status: 'Planning',
    productionCity: 'Las Vegas',
    facilityId: 'FAC002'
  },
  {
    projectName: 'Healthcare Expo 2024',
    projectNumber: 'P2024-003',
    projectType: 'Exhibition',
    status: 'Planning',
    productionCity: 'Boston',
    facilityId: 'FAC003'
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
    facilityId: `FAC${(index + predefinedProjects.length + 1).toString().padStart(3, '0')}`
  }))
];

// Predefined facility data
const predefinedFacilities: FacilityData[] = [
  {
    facilityId: 'FAC001',
    facilityName: 'San Francisco Convention Center',
    hall: 'Hall A',
    location1: 'San Francisco Downtown',
    location2: 'Main Exhibition Area',
    areaCode: '415',
    phone: '555-0001'
  },
  {
    facilityId: 'FAC002',
    facilityName: 'Las Vegas Convention Center',
    hall: 'Hall B',
    location1: 'Las Vegas Strip',
    location2: 'North Exhibition Hall',
    areaCode: '702',
    phone: '555-0002'
  },
  {
    facilityId: 'FAC003',
    facilityName: 'Boston Convention Center',
    hall: 'Hall C',
    location1: 'Boston Downtown',
    location2: 'East Exhibition Hall',
    areaCode: '617',
    phone: '555-0003'
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
        phone: '555-0100',
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
        facilityId: 'FAC001',
        facilityName: 'San Francisco Convention Center',
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
        phone: '555-0101',
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
        facilityId: 'FAC001',
        facilityName: 'San Francisco Convention Center',
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
        phone: '555-0102',
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
        facilityId: 'FAC001',
        facilityName: 'San Francisco Convention Center',
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
        phone: '555-0103',
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
        facilityId: 'FAC001',
        facilityName: 'San Francisco Convention Center',
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
        phone: '555-0104',
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
        facilityId: 'FAC001',
        facilityName: 'San Francisco Convention Center',
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
        phone: '555-0105',
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
        facilityId: 'FAC001',
        facilityName: 'San Francisco Convention Center',
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
        facilityId: 'FAC002',
        facilityName: 'Las Vegas Convention Center',
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
        phone: '555-0201',
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
        facilityId: 'FAC002',
        facilityName: 'Las Vegas Convention Center',
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
        facilityId: 'FAC003',
        facilityName: 'Boston Convention Center',
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
        phone: '555-0301',
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
        facilityId: 'FAC003',
        facilityName: 'Boston Convention Center',
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
      facilityId: `FAC${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
      facilityName: 'Convention Center',
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
  const currentDate = new Date('2024-04-01');
  
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