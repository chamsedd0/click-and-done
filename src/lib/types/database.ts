import { Timestamp } from 'firebase/firestore';

/**
 * User Collection Schema
 */
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'client' | 'admin' | 'collaborator';
  profileCompleted: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Website Request Collection Schema
 */
export interface WebsiteRequestData {
  id?: string; // Firestore auto-generated ID (not stored in document)
  userId: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  currentStage: 'requirements' | 'design' | 'development' | 'testing' | 'delivery';
  progress: number; // 0-100
  collaboratorIds: string[];
  assignedAdminId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Basic information (Step 1)
  businessName?: string;
  businessType?: string;
  targetAudience?: string;
  
  // Design preferences (Step 2)
  designPreferences?: {
    colorScheme?: string;
    layoutPreference?: string;
    styleReferences?: string[];
  };
  styleDescription?: string;
  exampleWebsites?: string;
  logoExists?: boolean;
  brandGuidelinesExist?: boolean;
  additionalDesignNotes?: string;
  
  // Functional requirements (Step 3)
  functionalRequirements?: string[];
  contentManagement?: boolean;
  userAccounts?: boolean;
  ecommerce?: boolean;
  contactForm?: boolean;
  newsletter?: boolean;
  blog?: boolean;
  socialMedia?: boolean;
  analytics?: boolean;
  customFeatures?: string;
  
  // Timeline & Budget (Step 4)
  budget?: number;
  budgetFlexible?: boolean;
  deadline?: Timestamp;
  urgency?: 'low' | 'normal' | 'high';
  expectedTimeline?: string;
  additionalTimelineNotes?: string;
}

/**
 * Feedback Collection Schema
 */
export interface FeedbackData {
  id?: string; // Firestore auto-generated ID (not stored in document)
  requestId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string | null;
  stage: string;
  text: string;
  type: 'change_request' | 'comment';
  addressed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Reviews Collection Schema
 */
export interface ReviewData {
  id?: string; // Firestore auto-generated ID (not stored in document)
  requestId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string | null;
  stage: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Payments Collection Schema
 */
export interface PaymentData {
  id?: string; // Firestore auto-generated ID (not stored in document)
  requestId: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'advance' | 'final' | 'installment';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  paymentMethod?: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  paidAt?: Timestamp;
}

/**
 * Files Collection Schema (metadata about files stored in Firebase Storage)
 */
export interface FileData {
  id?: string; // Firestore auto-generated ID (not stored in document)
  requestId: string;
  userId: string;
  userDisplayName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  path: string; // Storage path
  downloadURL: string;
  stage: string;
  version: number;
  createdAt: Timestamp;
}

/**
 * Notifications Collection Schema
 */
export interface NotificationData {
  id?: string; // Firestore auto-generated ID (not stored in document)
  userId: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface WebsiteRequest {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: string;
  progress: number;
  createdAt: number;
  updatedAt: number;
  assignedAdminId?: string;
  businessName?: string;
  businessType?: string;
  targetAudience?: string;
  budget?: number;
  budgetFlexible?: boolean;
  deadline?: number;
  urgency?: string;
  expectedTimeline?: string;
  estimatedHours?: number;
  designPreferences?: {
    colorScheme?: string;
    layoutPreference?: string;
  };
  styleDescription?: string;
  additionalDesignNotes?: string;
  functionalRequirements?: string[];
  contentManagement?: boolean;
  userAccounts?: boolean;
  ecommerce?: boolean;
  contactForm?: boolean;
  newsletter?: boolean;
  blog?: boolean;
  socialMedia?: boolean;
  analytics?: boolean;
  customFeatures?: string;
  collaboratorIds: string[];
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin";
  createdAt: number;
  phone?: string;
  companyName?: string;
  bio?: string;
}

export interface Feedback {
  id: string;
  requestId: string;
  userId: string;
  userDisplayName: string;
  content: string;
  createdAt: number;
}

export interface FileMetadata {
  id: string;
  requestId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadURL: string;
  uploadedBy: string;
  createdAt: number;
}

export interface Payment {
  id: string;
  requestId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  description: string;
  paymentMethod: string;
  createdAt: number;
  completedAt?: number;
}

export interface Conversation {
  id: string;
  title: string;
  participants: string[];
  requestId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: number;
  isRead: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
  isActive: boolean;
  startDate: number;
  renewalDate: number;
}

export interface Usage {
  id: string;
  userId: string;
  currentUsage: number;
  limit: number;
  resetDate: number;
  percentage: number;
} 