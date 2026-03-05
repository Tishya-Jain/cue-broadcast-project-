
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  listType: 'dynamic' | 'static'; // Dynamic = Salesforce/API, Static = CSV Upload
  wabaCount: number; 
  membersCount: number;
  status: 'sent' | 'scheduled' | 'draft' | 'cancelled';
  lastModified: string;
  nextScheduled?: string; // Date string for sidebar display
  nextScheduledTemplate?: string; // Name of the template scheduled
  previewTitle?: string;
  previewBody?: string;
  stats?: {
    sent: number;
    delivered: number;
    read: number;
    opened?: number;
    failed?: number;
    replied: number;
  };
}

export type ChannelSource = 'whatsapp' | 'instagram' | 'email' | 'sms' | 'call';

export interface ChatSession {
    id: string;
    customerName: string;
    customerPhone: string;
    avatarColor: string;
    subject: string; // New: For the bold title (e.g. "Shipping Delay")
    source: ChannelSource; // New: To show icon (WhatsApp/Insta/etc)
    priority: 'High' | 'Medium' | 'Low'; // New
    agentInitials?: string; // New: Bottom right initials (e.g. "VR")
    lastMessage: string;
    timestamp: string; // e.g. "2d ago"
    unreadCount: number;
    status: 'Open' | 'Closed' | 'Transferred'; // Added Transferred
    whatsappSessionStatus?: 'active' | 'expired'; // New: Controls chat input availability
    tags: string[]; // e.g., 'Sales Lead', 'Enterprise'
    isOnline?: boolean;
    transferredTo?: string; // New: For transfer animation
}

export interface NoteItem {
    id: string;
    content: string;
    date: string;
    agentName: string;
}

// New Interface for Right Panel
export interface CustomerProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    location: string;
    cohorts: string[];
    history: ConversationHistoryItem[];
    notes: NoteItem[];
}

// New Interface for History
export interface ConversationHistoryItem {
    id: string;
    type: ChannelSource;
    subject: string;
    date: string;
    summary: string; // AI Summary
    transcript?: string; // Only for calls
    resolution?: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  avatarColor: string;
}

export interface SalesforceReport {
  id: string;
  name: string;
  folder: string;
  lastRun: string;
  recordCount: number;
}

export enum WizardStep {
  DETAILS = 1,
  SOURCE = 2,
  AUDIENCE = 3,
}

export enum ChannelType {
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
}

export enum ScheduleType {
  ONCE = 'once',
  RECURRING = 'recurring',
}

export interface CampaignFormData {
  name: string;
  description: string;
  tags?: string[]; // Added tags support
  sourceType: 'report' | 'soql' | 'excel' | null;
  selectedReportId: string | null;
  uploadedFileName?: string;
  
  // Audience
  audienceSelectionType: 'applicant' | 'fields';
  useHighestIncomeEarner: boolean; // Toggle for AI determination
  includeGuarantor: boolean;
  selectedApplicants: string[]; // e.g. ['primary', 'co-app-1']
  selectedFields: string[];
  
  // Channel
  channels: ChannelType[];
  fallbackEnabled: boolean;
  ensureCommunication: boolean; // AI optimization
  usePreferredLanguage: boolean; // Send in regional language if available
  
  // Schedule
  scheduleType: ScheduleType;
  scheduleDetails: {
    dateTime?: string; // Start DateTime
    endDateTime?: string; // End DateTime (Campaign Expiry)
    recurringFreq?: 'weekly' | 'fortnightly' | 'monthly';
    recurringDays?: string[]; // e.g. ['Mon', 'Tue']
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system'; // Added 'system'
  type: 'text' | 'image' | 'video' | 'audio' | 'template' | 'flow' | 'system' | 'call';
  content: string; // Text content or URL for media
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'scheduled' | 'cancelled';
  // Specific fields for rich messages
  mediaDuration?: string; // For audio/video
  templateData?: {
    title: string;
    body: string;
    imageUrl?: string;
    stats?: {
        sent: number;
        delivered: number;
        read: number;
        failed?: number;
        replied?: number;
        opened?: number; // Specific for Flow
        completed?: number; // Specific for Flow
        dropOff?: { step: string; count: number }[]; // Specific for Flow
    };
  };
  callData?: {
      duration?: number; // in seconds
      status: 'missed' | 'completed' | 'no-answer' | 'busy' | 'failed';
      direction: 'inbound' | 'outbound';
  };
}

export interface CustomerSearchResult {
    opportunityNo: string;
    opportunityName: string;
    customers: {
        name: string;
        role: string;
        status: 'Opted in' | 'Opted out';
        availability: 'Available' | 'DND';
    }[];
}

// History & Analytics Types
export interface HistoryLog {
    id: string;
    customerName: string;
    avatarColor: string;
    type: ChannelSource;
    subject: string;
    date: string; // ISO date string
    duration?: string;
    agentName: string;
    status: 'Resolved' | 'Open' | 'Escalated';
    sentimentScore: number; // 0-100
    tags: string[];
    aiSummary: string;
    transcript?: string; // For calls/chats
    recordingUrl?: string; // For calls
}
