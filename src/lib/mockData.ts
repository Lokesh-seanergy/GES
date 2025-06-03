import dayjs from 'dayjs';

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
  openDate: string;
  closeDate: string;
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

const allShowNames = [
  'WWDC', 'CES', 'Dreamforce', 'Interop', 'TechCrunch Disrupt', 'Gartner Symposium',
  'AWS re:Invent', 'Google I/O', 'Microsoft Build', 'RSA Conference', 'SXSW',
  'Mobile World Congress', 'IFA Berlin', 'Comic-Con', 'NAB Show', 'Auto Expo',
  'Book Fair', 'Toy Fair', 'Fashion Week', 'Art Basel', 'Game Developers Conf.'
];

// Helper to get a random integer between min and max (inclusive)
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

// Helper to get a date string in YYYY-MM-DD format
function getDateString(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

// Get current year and month
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1; // JS months are 0-based

// Helper to get today's date and 5 days from today
const todayStr = dayjs().format('YYYY-MM-DD');
const fifthDayStr = dayjs().add(5, 'day').format('YYYY-MM-DD');

// Generate shows from June 2024 to June 2026 (25 months)
const START_YEAR = 2024;
const START_MONTH = 6; // June
const END_YEAR = 2026;
const END_MONTH = 6; // June
const NUM_MONTHS = (END_YEAR - START_YEAR) * 12 + (END_MONTH - START_MONTH + 1);

const generatedShows: ShowData[] = [];
for (let m = 0; m < NUM_MONTHS; m++) {
  // Calculate year and month for this iteration
  let year = START_YEAR + Math.floor((START_MONTH - 1 + m) / 12);
  let month = ((START_MONTH - 1 + m) % 12) + 1;
  const yrmo = `${year}-${String(month).padStart(2, '0')}`;
  const daysInMonth = dayjs(`${year}-${String(month).padStart(2, '0')}-01`).daysInMonth();
  // Randomly choose number of shows for this month (12–18)
  const numShows = getRandomInt(12, 18);
  for (let i = 0; i < numShows; i++) {
    const showIdx = generatedShows.length;
    let showOpenDate: string;
    let showCloseDate: string;
    // Only the first 3 shows are ongoing for 3 days starting today
    if (showIdx < 3) {
      showOpenDate = dayjs().format('YYYY-MM-DD');
      showCloseDate = dayjs().add(2, 'day').format('YYYY-MM-DD');
    } else {
      // Stagger shows within the month
      const minDay = 1;
      const maxDay = daysInMonth - 4;
      const openDay = Math.min(minDay + i * 2, maxDay > minDay ? maxDay : minDay);
      showOpenDate = getDateString(year, month, openDay);
      const duration = getRandomInt(2, 4);
      const closeDay = Math.min(openDay + duration, daysInMonth);
      showCloseDate = getDateString(year, month, closeDay);
    }
    const showName = allShowNames[(i + m) % allShowNames.length] + (m === 0 && i < 3 ? '' : ` ${yrmo}`);
    generatedShows.push({
      showId: `SHW${(showIdx + 1).toString().padStart(3, '0')}`,
      showName,
      occrId: `SHW${(showIdx + 1).toString().padStart(3, '0')}-ORG`,
      occrType: 'Conference',
      marketType: 'Technology',
      projectNumber: `${getShowAbbreviation(showName)}${yrmo.replace('-', '')}`,
      cityOrg: CITIES[i % CITIES.length],
      yrmo,
      openDate: showOpenDate,
      closeDate: showCloseDate
    });
  }
}
export const mockShows: ShowData[] = generatedShows;

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
  const show = mockShows.find(s => s.showId === showId);
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
const generateCustomersForShow = (show: ShowData): CustomerData[] => {
  const showOrg: CustomerData = {
    id: `${show.showId}-ORG`,
    showId: show.showId,
    customerId: `${show.showId}-ORG`,
    customerName: show.showName,
    type: ['ShowOrg'],
    isActive: true,
    email: `organizer@${show.showName.replace(/\s+/g, '').toLowerCase()}.com`,
    phone: '555-0000',
    address: {
      street: '1 Organizer Plaza',
      city: show.cityOrg.split(',')[0],
      state: show.cityOrg.split(',')[1]?.trim() || '',
      zip: '10000',
      country: 'USA'
    },
    boothNumber: 'ORG1',
    boothSize: '1000',
    orders: 0,
    booths: 1,
    status: 'Active',
    facilityId: HOTEL_NAMES[0],
    facilityName: `${show.cityOrg.split(',')[0]} Convention Center`,
    projectNumber: show.projectNumber,
    boothLength: '20',
    boothWidth: '10',
    netTerms: '30 NET',
    riskDesc: 'Low Risk',
    zone: 'A',
    boothType: 'Island',
    firstName: 'Organizer',
    lastName: 'Team',
    contactType: 'Primary',
    contactRole: 'Event Director',
    sharedBooth: false,
    operationZone: 'Zone 1',
    serviceZone: 'Zone 1',
    targetZone: 'Zone 1',
    emptyZone: 'Zone 1'
  };
  const numExhibitors = getRandomInt(5, 10);
  const numThirdParty = getRandomInt(5, 10);
  const exhibitors: CustomerData[] = Array.from({ length: numExhibitors }, (_, idx) => ({
    id: `${show.showId}-EXH${idx + 1}`,
    showId: show.showId,
    customerId: `${show.showId}-EXH${idx + 1}`,
    customerName: `Exhibitor ${idx + 1} for ${show.showName}`,
    type: ['Exhibitors'],
    isActive: true,
    email: `exhibitor${idx + 1}@${show.showName.replace(/\s+/g, '').toLowerCase()}.com`,
    phone: `555-1${idx.toString().padStart(3, '0')}`,
    address: {
      street: `${100 + idx} Expo Ave`,
      city: show.cityOrg.split(',')[0],
      state: show.cityOrg.split(',')[1]?.trim() || '',
      zip: (10000 + idx).toString(),
      country: 'USA'
    },
    boothNumber: `EX${idx + 1}`,
    boothSize: '400',
    orders: 0,
    booths: 1,
    status: 'Active',
    facilityId: HOTEL_NAMES[1],
    facilityName: `${show.cityOrg.split(',')[0]} Convention Center`,
    projectNumber: show.projectNumber,
    boothLength: '10',
    boothWidth: '10',
    netTerms: '30 NET',
    riskDesc: 'Low Risk',
    zone: 'B',
    boothType: 'Inline',
    firstName: `Exhibitor${idx + 1}`,
    lastName: 'Smith',
    contactType: 'Primary',
    contactRole: 'Manager',
    sharedBooth: false,
    operationZone: 'Zone 2',
    serviceZone: 'Zone 2',
    targetZone: 'Zone 2',
    emptyZone: 'Zone 2'
  }));
  const thirdParty: CustomerData[] = Array.from({ length: numThirdParty }, (_, idx) => ({
    id: `${show.showId}-TP${idx + 1}`,
    showId: show.showId,
    customerId: `${show.showId}-TP${idx + 1}`,
    customerName: `3rd Party ${idx + 1} for ${show.showName}`,
    type: ['3rd party'],
    isActive: true,
    email: `thirdparty${idx + 1}@${show.showName.replace(/\s+/g, '').toLowerCase()}.com`,
    phone: `555-2${idx.toString().padStart(3, '0')}`,
    address: {
      street: `${200 + idx} Partner Rd`,
      city: show.cityOrg.split(',')[0],
      state: show.cityOrg.split(',')[1]?.trim() || '',
      zip: (20000 + idx).toString(),
      country: 'USA'
    },
    boothNumber: `TP${idx + 1}`,
    boothSize: '300',
    orders: 0,
    booths: 1,
    status: 'Active',
    facilityId: HOTEL_NAMES[2],
    facilityName: `${show.cityOrg.split(',')[0]} Convention Center`,
    projectNumber: show.projectNumber,
    boothLength: '8',
    boothWidth: '8',
    netTerms: '30 NET',
    riskDesc: 'Medium Risk',
    zone: 'C',
    boothType: 'Corner',
    firstName: `ThirdParty${idx + 1}`,
    lastName: 'Lee',
    contactType: 'Primary',
    contactRole: 'Coordinator',
    sharedBooth: false,
    operationZone: 'Zone 3',
    serviceZone: 'Zone 3',
    targetZone: 'Zone 3',
    emptyZone: 'Zone 3'
  }));
  return [showOrg, ...exhibitors, ...thirdParty];
};

// Generate customers for all shows
export const mockCustomers: CustomerData[] = mockShows.flatMap(show => generateCustomersForShow(show));

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

// Generate 3-5 orders for each exhibitor/3rd party in each show
export const mockOrders: Order[] = mockCustomers
  .filter(c => c.type.includes('Exhibitors') || c.type.includes('3rd party'))
  .flatMap((customer, custIdx) => {
    const numOrders = getRandomInt(3, 5);
    return Array.from({ length: numOrders }, (_, orderIdx) => {
      const orderNum = `${customer.showId}-${customer.customerId}-${orderIdx + 1}`;
      return {
        orderId: `ORD-${orderNum}`,
        showId: customer.showId,
        occurrenceId: `${customer.showId}-OCC1`,
        subTotal: 10000 + orderIdx * 1000 + custIdx * 500,
        salesChannel: ["Direct", "Partner", "Web"][orderIdx % 3],
        terms: ["Net 30", "Net 45", "Prepaid"][orderIdx % 3],
        tax: 1000 + (orderIdx % 4) * 250,
        orderType: ["New", "Renewal"][orderIdx % 2],
        customerPO: `PO-${customer.customerId}-${orderIdx + 1}`,
        cancelCharge: 0,
        source: ["Web", "Email", "Phone"][orderIdx % 3],
        project: customer.projectNumber,
        orderDate: customer.showId.startsWith('SHW') ? dayjs().add(orderIdx, 'day').format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        boothInfo: customer.boothNumber,
        billingAddress: `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zip}`,
        total: 11000 + orderIdx * 1000 + custIdx * 500,
        items: [
          {
            serialNo: 1,
            orderedItem: "Booth Package",
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
            orderReceivedDate: dayjs().add(orderIdx, 'day').format('YYYY-MM-DD'),
            status: "Confirmed",
            itemType: "Booth",
            ato: false,
            lineType: "Standard",
            documentNumber: `DOC-${orderNum}`,
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
            orderReceivedDate: dayjs().add(orderIdx, 'day').format('YYYY-MM-DD'),
            status: "Confirmed",
            itemType: "Equipment",
            ato: false,
            lineType: "Standard",
            documentNumber: `DOC-${orderNum}-2`,
            industryInformation: "Technology",
          }
        ]
      };
    });
  });