// User types
export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
}

// Menu types
export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  image?: string;
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
}

// Order types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  totalAmount: string;
  pickupTime?: string;
  notes?: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

// Table types
export interface Table {
  id: string;
  number: string;
  capacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  description?: string;
  isAvailable?: boolean;
}

// Booking types
export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  tableId: string;
  table: Table;
  bookingDate: string;
  startTime: string;
  endTime: string;
  partySize: number;
  status: BookingStatus;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Date range type
export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
}

// Admin types
export interface RestaurantSettings {
  id: string;
  restaurantName: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  restaurantAddress?: string;
  openingTime: string;
  closingTime: string;
  bookingSlotDuration: number;
  maxAdvanceBookingDays: number;
  pickupTimeSlots: string[];
  isOnline: boolean;
  maintenanceMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalBookings: number;
  activeUsers: number;
  todayOrders: number;
  todayRevenue: number;
  todayBookings: number;
  pendingOrders: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface BookingData {
  date: string;
  bookings: number;
}

export interface PopularItem {
  id: string;
  name: string;
  totalOrdered: number;
  revenue: number;
}