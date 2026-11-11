export interface CampusStation {
  id: string;
  name: string;
  code: string;
  coordinates: { lat: number; lng: number };
  totalDocks: number;
  availableBikes: number;
  ebikesCount: number;
  standardCount: number;
  avgBatteryPercent: number;
  geofenceRadiusMeters: number;
  popularDropoff: string;
  description: string;
}

export interface Bicycle {
  id: string;
  code: string;
  type: 'Smart E-Bike' | '7-Speed Pedal';
  batteryPercent?: number;
  currentStationId: string;
  totalDistanceKm: number;
  status: 'Available' | 'In Ride' | 'Maintenance';
  lastServiceDate: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  rollNo: string;
  hostel: string;
  ridesCount: number;
  distanceKm: number;
  co2SavedKg: number;
  greenCredits: number;
}

export interface EcoReward {
  id: string;
  title: string;
  vendor: string;
  costCredits: number;
  category: 'Food & Beverage' | 'Academic Perks' | 'Merchandise';
  discountText: string;
  iconName: string;
}

export const CAMPUS_STATIONS: CampusStation[] = [
  {
    id: 'st-lib',
    name: 'Central Library Hub',
    code: 'TIET-ST-01',
    coordinates: { lat: 30.3548, lng: 76.3688 },
    totalDocks: 24,
    availableBikes: 18,
    ebikesCount: 8,
    standardCount: 10,
    avgBatteryPercent: 82,
    geofenceRadiusMeters: 30,
    popularDropoff: 'CSED Plaza (0.6 km)',
    description: 'Directly in front of the grand TIET Central Library steps. High-demand pickup point between 12:00 PM and 6:00 PM.'
  },
  {
    id: 'st-cos',
    name: 'COS Promenade',
    code: 'TIET-ST-02',
    coordinates: { lat: 30.3562, lng: 76.3712 },
    totalDocks: 20,
    availableBikes: 14,
    ebikesCount: 6,
    standardCount: 8,
    avgBatteryPercent: 88,
    geofenceRadiusMeters: 25,
    popularDropoff: 'Hostel J & M (0.9 km)',
    description: 'Located next to Center for Open Studies (COS) walkway and student juice bars. Prime evening transit hub.'
  },
  {
    id: 'st-hjm',
    name: 'Hostel J & M Gate',
    code: 'TIET-ST-03',
    coordinates: { lat: 30.3531, lng: 76.3664 },
    totalDocks: 32,
    availableBikes: 26,
    ebikesCount: 12,
    standardCount: 14,
    avgBatteryPercent: 91,
    geofenceRadiusMeters: 35,
    popularDropoff: 'CSED Plaza (0.7 km)',
    description: 'Largest residential station serving both Hostel J and Hostel M residents. Heavily used for morning 8:00 AM class rush.'
  },
  {
    id: 'st-hpgn',
    name: 'Hostel PG & N Quad',
    code: 'TIET-ST-04',
    coordinates: { lat: 30.3575, lng: 76.3672 },
    totalDocks: 28,
    availableBikes: 21,
    ebikesCount: 9,
    standardCount: 12,
    avgBatteryPercent: 79,
    geofenceRadiusMeters: 30,
    popularDropoff: 'Central Library (0.5 km)',
    description: 'Situated at the entrance quadrangle of Hostel PG high-rise and Hostel N gardens with illuminated night docking.'
  },
  {
    id: 'st-csed',
    name: 'CSED Building Plaza',
    code: 'TIET-ST-05',
    coordinates: { lat: 30.3541, lng: 76.3729 },
    totalDocks: 26,
    availableBikes: 19,
    ebikesCount: 10,
    standardCount: 9,
    avgBatteryPercent: 85,
    geofenceRadiusMeters: 25,
    popularDropoff: 'Jaggi Market (0.8 km)',
    description: 'Right by the Computer Science department main glass atrium and LP Lecture Halls. Very high turnover throughout lecture periods.'
  },
  {
    id: 'st-tan',
    name: 'Tan Building & Mechanical Labs',
    code: 'TIET-ST-06',
    coordinates: { lat: 30.3518, lng: 76.3695 },
    totalDocks: 18,
    availableBikes: 11,
    ebikesCount: 4,
    standardCount: 7,
    avgBatteryPercent: 74,
    geofenceRadiusMeters: 25,
    popularDropoff: 'Hostel J & M (1.1 km)',
    description: 'Adjacent to Tan Building auditorium, CNC workshops, and Mechanical Engineering research wing.'
  },
  {
    id: 'st-jaggi',
    name: 'Main Cafeteria & Jaggi Market',
    code: 'TIET-ST-07',
    coordinates: { lat: 30.3555, lng: 76.3648 },
    totalDocks: 22,
    availableBikes: 15,
    ebikesCount: 7,
    standardCount: 8,
    avgBatteryPercent: 94,
    geofenceRadiusMeters: 28,
    popularDropoff: 'Central Library (0.7 km)',
    description: 'Conveniently located at the bustling Jaggi shopping complex, Verka milk booth, and campus stationery hub.'
  }
];

export const MOCK_BIKES: Bicycle[] = [
  { id: 'b-101', code: 'EC-VOLT-101', type: 'Smart E-Bike', batteryPercent: 92, currentStationId: 'st-lib', totalDistanceKm: 421.4, status: 'Available', lastServiceDate: '10 Feb 2026' },
  { id: 'b-102', code: 'EC-VOLT-102', type: 'Smart E-Bike', batteryPercent: 78, currentStationId: 'st-lib', totalDistanceKm: 310.8, status: 'Available', lastServiceDate: '08 Feb 2026' },
  { id: 'b-201', code: 'EC-PEDAL-201', type: '7-Speed Pedal', currentStationId: 'st-hjm', totalDistanceKm: 654.1, status: 'Available', lastServiceDate: '01 Feb 2026' },
  { id: 'b-103', code: 'EC-VOLT-103', type: 'Smart E-Bike', batteryPercent: 96, currentStationId: 'st-csed', totalDistanceKm: 289.5, status: 'Available', lastServiceDate: '11 Feb 2026' },
  { id: 'b-202', code: 'EC-PEDAL-202', type: '7-Speed Pedal', currentStationId: 'st-cos', totalDistanceKm: 512.0, status: 'Available', lastServiceDate: '04 Feb 2026' },
  { id: 'b-104', code: 'EC-VOLT-104', type: 'Smart E-Bike', batteryPercent: 64, currentStationId: 'st-hpgn', totalDistanceKm: 184.2, status: 'Available', lastServiceDate: '09 Feb 2026' },
  { id: 'b-203', code: 'EC-PEDAL-203', type: '7-Speed Pedal', currentStationId: 'st-jaggi', totalDistanceKm: 730.6, status: 'Available', lastServiceDate: '06 Feb 2026' },
];

export const CAMPUS_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Arjun Singhania', rollNo: '102203819', hostel: 'Hostel J', ridesCount: 142, distanceKm: 184.5, co2SavedKg: 22.1, greenCredits: 1480 },
  { rank: 2, name: 'Tanvi Aggarwal', rollNo: '102315024', hostel: 'Hostel PG', ridesCount: 128, distanceKm: 162.0, co2SavedKg: 19.4, greenCredits: 1310 },
  { rank: 3, name: 'Gurnoor Singh', rollNo: '102205118', hostel: 'Hostel M', ridesCount: 115, distanceKm: 148.8, co2SavedKg: 17.8, greenCredits: 1220 },
  { rank: 4, name: 'Riya Malhotra', rollNo: '102312092', hostel: 'Hostel N', ridesCount: 98, distanceKm: 129.4, co2SavedKg: 15.5, greenCredits: 1040 },
  { rank: 5, name: 'Aditya Oberoi', rollNo: '102103441', hostel: 'Hostel Q', ridesCount: 89, distanceKm: 116.2, co2SavedKg: 13.9, greenCredits: 950 },
];

export const ECO_REWARDS: EcoReward[] = [
  {
    id: 'rew-1',
    title: 'Free Brewed Coffee or Chai',
    vendor: 'Jaggi Market Canteen',
    costCredits: 250,
    category: 'Food & Beverage',
    discountText: '100% Off Hot Beverage',
    iconName: 'Coffee'
  },
  {
    id: 'rew-2',
    title: '50% Off Thick Milkshake',
    vendor: 'Verka Campus Milk Bar',
    costCredits: 350,
    category: 'Food & Beverage',
    discountText: '50% Off Any Flavor',
    iconName: 'Sparkles'
  },
  {
    id: 'rew-3',
    title: 'Library Overdue Grace Pass',
    vendor: 'TIET Central Library',
    costCredits: 400,
    category: 'Academic Perks',
    discountText: 'Waives 1 book overdue penalty',
    iconName: 'BookOpen'
  },
  {
    id: 'rew-4',
    title: 'EcoCycle Campus Hoodie',
    vendor: 'TIET Merchandise Store',
    costCredits: 1200,
    category: 'Merchandise',
    discountText: 'Free Sustainable Organic Cotton Hoodie',
    iconName: 'Award'
  }
];
