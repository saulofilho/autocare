export interface Vehicle {
  id: string;
  model: string;
  brand: string;
  year: number;
  licensePlate: string;
  currentKm: number;
  fuelTankCapacity: number; // in Liters
  currentFuelLevel: number; // in Liters
  fuelType: 'Flex' | 'Gasolina' | 'Diesel' | 'Elétrico';
  color: string;
  vin?: string;
  photoUrl?: string;
}

export interface MaintenanceItem {
  id: string;
  name: string;
  category: 'motor' | 'freios' | 'suspensao' | 'fluidos' | 'pneus' | 'eletrica';
  intervalKm: number;
  intervalMonths: number;
  lastServiceKm: number;
  lastServiceDate: string;
  nextServiceKm: number;
  healthPercent: number; // 0 to 100
  urgency: 'ok' | 'warning' | 'critical';
  estimatedCost: number;
  description: string;
  components3dKey?: string;
}

export interface MaintenanceRecord {
  id: string;
  itemId: string;
  itemName: string;
  date: string;
  odometerKm: number;
  workshopName: string;
  workshopId?: string;
  cost: number;
  notes?: string;
  invoiceNumber?: string;
}

export interface FuelLog {
  id: string;
  date: string;
  odometerKm: number;
  fuelType: 'Gasolina Comum' | 'Gasolina Aditivada' | 'Etanol' | 'Diesel S10' | 'GNV' | 'Gasolina' | 'Diesel';
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fullTank: boolean;
  stationName: string;
  calculatedKmPerLiter?: number;
  costPerKm?: number;
}

export interface MechanicReview {
  id: string;
  workshopId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  date: string;
  serviceRendered: string;
  comment: string;
  tags: string[];
  vehicleModel?: string;
}

export interface Workshop {
  id: string;
  name: string;
  category: 'Geral' | 'Freios & Suspensão' | 'Injeção & Motor' | 'Auto Elétrica' | 'Pneus & Alinhamento';
  address: string;
  neighborhood: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  phone: string;
  whatsapp: string;
  isOpen: boolean;
  openHours: string;
  featuredServices: { name: string; price: number; durationMinutes: number }[];
  verifiedPartner: boolean;
  latitude: number;
  longitude: number;
}

export interface ServiceBooking {
  id: string;
  workshopId: string;
  workshopName: string;
  serviceName: string;
  price: number;
  date: string;
  timeSlot: string;
  status: 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  vehiclePlate: string;
  notes?: string;
  createdAt: string;
}

export interface CarComponent3DInfo {
  id: string;
  name: string;
  category: string;
  healthPercent: number;
  statusText: string;
  urgency: 'ok' | 'warning' | 'critical';
  howItWorks: string;
  symptoms: string[];
  maintenanceTip: string;
  estimatedReplacementCost: string;
  recommendedInterval: string;
  position3D: [number, number, number];
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'mileage' | 'fuel' | 'booking' | 'alert';
  read: boolean;
  priority: 'normal' | 'alta';
  actionUrl?: string;
}

export interface MaintenanceTipItem {
  id: string;
  title: string;
  category: 'Economia' | 'Motor' | 'Freios' | 'Pneus' | 'Prevenção' | 'Luzes do Painel';
  summary: string;
  content: string;
  potentialSavings: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  iconName: string;
}

export interface MonthlyCostBreakdown {
  month: string;
  fuel: number;
  maintenance: number;
  fixedCosts: number;
  total: number;
}

export interface OptimizationTip {
  title: string;
  category: string;
  description: string;
  estimatedSavingsYearly: number;
  impact: string;
}
