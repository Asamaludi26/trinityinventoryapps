/**
 * API Types & DTOs
 * 
 * Type definitions untuk semua API requests dan responses.
 * Memastikan type safety di seluruh aplikasi.
 */

import {
  Asset,
  Request,
  LoanRequest,
  Handover,
  Dismantle,
  Maintenance,
  Installation,
  AssetReturn,
  Customer,
  User,
  Division,
  AssetCategory,
  Notification,
  StockMovement,
  AssetStatus,
  ItemStatus,
  OrderType,
} from '../../types';

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Paginated response dari backend
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

/**
 * Standard API error response
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================================================
// QUERY PARAMS
// ============================================================================

export interface AssetQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AssetStatus;
  category?: string;
  type?: string;
  location?: string;
}

export interface RequestQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ItemStatus;
  requesterId?: number;
  orderType?: OrderType;
}

export interface LoanRequestQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  requesterId?: number;
}

// ============================================================================
// ASSET DTOs
// ============================================================================

export interface CreateAssetDto {
  name: string;
  brand: string;
  category: string;
  type: string;
  serialNumber?: string;
  macAddress?: string;
  poNumber?: string;
  woRoIntNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  registrationDate: string;
  recordedBy: string;
  status: AssetStatus;
  condition?: string;
  location?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  notes?: string;
  attachments?: File[];
  quantity?: number; // For bulk items
}

export interface UpdateAssetDto {
  name?: string;
  brand?: string;
  category?: string;
  type?: string;
  serialNumber?: string;
  macAddress?: string;
  status?: AssetStatus;
  condition?: string;
  location?: string;
  currentUser?: string | null;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  notes?: string;
}

// ============================================================================
// REQUEST DTOs
// ============================================================================

export interface RequestItemDto {
  itemName: string;
  brand: string;
  quantity: number;
  unit?: string;
  justification?: string;
}

export interface CreateRequestDto {
  items: RequestItemDto[];
  orderType: OrderType;
  justification: string;
  project?: string;
}

export interface UpdateRequestDto {
  status?: ItemStatus;
  items?: RequestItemDto[];
  justification?: string;
  project?: string;
  logisticApprover?: string;
  purchaseApprover?: string;
  finalApprover?: string;
}

export interface ApprovalDto {
  approver: string;
  approvalDate: string;
  notes?: string;
}

export interface RejectionDto {
  rejector: string;
  rejectionDate: string;
  reason: string;
}

// ============================================================================
// LOAN REQUEST DTOs
// ============================================================================

export interface LoanItemDto {
  itemName: string;
  brand: string;
  quantity: number;
  returnDate?: string | null;
  keterangan?: string;
}

export interface CreateLoanRequestDto {
  loanItems: LoanItemDto[];
  notes?: string;
}

export interface ApproveLoanRequestDto {
  approver: string;
  approvalDate: string;
  assignedAssetIds: Record<number, string[]>;
  itemStatuses: Record<number, {
    status: 'approved' | 'rejected' | 'partial';
    reason?: string;
    approvedQuantity: number;
  }>;
}

// ============================================================================
// TRANSACTION DTOs
// ============================================================================

export interface CreateHandoverDto {
  menyerahkan: string;
  penerima: string;
  handoverDate: string;
  items: Array<{
    assetId: string;
    assetName: string;
    notes?: string;
  }>;
  notes?: string;
}

export interface CreateDismantleDto {
  customerId: string;
  dismantleDate: string;
  items: Array<{
    assetId: string;
    condition: string;
    notes?: string;
  }>;
  technician: string;
  notes?: string;
}

export interface CreateMaintenanceDto {
  assetId: string;
  maintenanceDate: string;
  type: string;
  description: string;
  cost?: number;
  technician: string;
  notes?: string;
}

export interface CreateInstallationDto {
  customerId: string;
  installationDate: string;
  items: Array<{
    assetId: string;
    notes?: string;
  }>;
  technician: string;
  notes?: string;
}

// ============================================================================
// STOCK MOVEMENT DTOs
// ============================================================================

export interface CreateStockMovementDto {
  assetName: string;
  brand: string;
  date: string;
  type: string;
  quantity: number;
  referenceId?: string;
  actor: string;
  notes?: string;
}

// ============================================================================
// MASTER DATA DTOs
// ============================================================================

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  divisionId?: number;
  phone?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
  divisionId?: number;
  phone?: string;
}

export interface CreateDivisionDto {
  name: string;
  description?: string;
}

export interface UpdateDivisionDto {
  name?: string;
  description?: string;
}

export interface CreateCustomerDto {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  notes?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  notes?: string;
}

// ============================================================================
// AUTH DTOs
// ============================================================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// ============================================================================
// API CLIENT INTERFACE
// ============================================================================

/**
 * Interface untuk API Client
 * Memastikan konsistensi antara mock dan real implementation
 */
export interface IApiClient {
  // ===== ASSETS =====
  getAssets(params?: AssetQueryParams): Promise<PaginatedResponse<Asset>>;
  getAsset(id: string): Promise<Asset>;
  createAsset(data: CreateAssetDto): Promise<Asset>;
  updateAsset(id: string, data: UpdateAssetDto): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;

  // ===== REQUESTS =====
  getRequests(params?: RequestQueryParams): Promise<PaginatedResponse<Request>>;
  getRequest(id: string): Promise<Request>;
  createRequest(data: CreateRequestDto): Promise<Request>;
  updateRequest(id: string, data: UpdateRequestDto): Promise<Request>;
  approveRequest(id: string, data: ApprovalDto): Promise<Request>;
  rejectRequest(id: string, data: RejectionDto): Promise<Request>;

  // ===== LOAN REQUESTS =====
  getLoanRequests(params?: LoanRequestQueryParams): Promise<PaginatedResponse<LoanRequest>>;
  getLoanRequest(id: string): Promise<LoanRequest>;
  createLoanRequest(data: CreateLoanRequestDto): Promise<LoanRequest>;
  approveLoanRequest(id: string, data: ApproveLoanRequestDto): Promise<LoanRequest>;
  returnLoanRequest(id: string, returnData: any): Promise<LoanRequest>;

  // ===== TRANSACTIONS =====
  getHandovers(params?: any): Promise<PaginatedResponse<Handover>>;
  createHandover(data: CreateHandoverDto): Promise<Handover>;
  deleteHandover(id: string): Promise<void>;

  getDismantles(params?: any): Promise<PaginatedResponse<Dismantle>>;
  createDismantle(data: CreateDismantleDto): Promise<Dismantle>;
  updateDismantle(id: string, data: Partial<Dismantle>): Promise<Dismantle>;
  deleteDismantle(id: string): Promise<void>;

  getMaintenances(params?: any): Promise<PaginatedResponse<Maintenance>>;
  createMaintenance(data: CreateMaintenanceDto): Promise<Maintenance>;
  updateMaintenance(id: string, data: Partial<Maintenance>): Promise<Maintenance>;
  deleteMaintenance(id: string): Promise<void>;

  getInstallations(params?: any): Promise<PaginatedResponse<Installation>>;
  createInstallation(data: CreateInstallationDto): Promise<Installation>;
  deleteInstallation(id: string): Promise<void>;

  getReturns(params?: any): Promise<PaginatedResponse<AssetReturn>>;

  // ===== STOCK MOVEMENTS =====
  getStockMovements(params?: any): Promise<PaginatedResponse<StockMovement>>;
  createStockMovement(data: CreateStockMovementDto): Promise<StockMovement>;

  // ===== MASTER DATA =====
  getUsers(params?: any): Promise<PaginatedResponse<User>>;
  getUser(id: number): Promise<User>;
  createUser(data: CreateUserDto): Promise<User>;
  updateUser(id: number, data: UpdateUserDto): Promise<User>;
  deleteUser(id: number): Promise<void>;

  getDivisions(params?: any): Promise<PaginatedResponse<Division>>;
  getDivision(id: number): Promise<Division>;
  createDivision(data: CreateDivisionDto): Promise<Division>;
  updateDivision(id: number, data: UpdateDivisionDto): Promise<Division>;
  deleteDivision(id: number): Promise<void>;

  getCustomers(params?: any): Promise<PaginatedResponse<Customer>>;
  getCustomer(id: string): Promise<Customer>;
  createCustomer(data: CreateCustomerDto): Promise<Customer>;
  updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;

  getCategories(params?: any): Promise<PaginatedResponse<AssetCategory>>;

  // ===== NOTIFICATIONS =====
  getNotifications(params?: any): Promise<PaginatedResponse<Notification>>;
  markNotificationAsRead(id: number): Promise<void>;
  markAllNotificationsAsRead(recipientId: number): Promise<void>;

  // ===== AUTH =====
  login(data: LoginDto): Promise<LoginResponse>;
  logout(): Promise<void>;
}

