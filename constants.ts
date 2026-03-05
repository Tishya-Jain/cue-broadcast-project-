
import { Campaign, Member, SalesforceReport, ChatSession, ChatMessage, CustomerProfile, HistoryLog } from './types';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Mumbai customers',
    description: 'Diwali promotional campaign for Mumbai region',
    listType: 'dynamic',
    membersCount: 8123, // Kept for internal logic if needed, but hidden from sidebar
    wabaCount: 3,
    status: 'sent',
    lastModified: '2 mins ago',
    previewTitle: 'Our Diwali sale is live!!',
    previewBody: 'Get flat 50% OFF on TV, Fridges and more!',
    stats: {
      sent: 11000,
      delivered: 10500,
      read: 9800,
      failed: 500,
      replied: 1200,
    }
  },
  {
    id: '2',
    name: 'Ahmedabad customers',
    description: 'Weekly engagement for Ahmedabad base',
    listType: 'dynamic',
    membersCount: 2213,
    wabaCount: 1,
    status: 'scheduled',
    lastModified: '1 hour ago',
    nextScheduled: 'Tomorrow, 10:00 AM',
    nextScheduledTemplate: 'Weekly Digest V2'
  },
  {
    id: '3',
    name: 'Delhi leads - Q3',
    listType: 'static',
    membersCount: 1212,
    wabaCount: 2,
    status: 'sent',
    lastModified: 'Yesterday',
    previewTitle: 'Our Diwali sale is live!!',
    previewBody: 'Get flat 50% OFF on TV, Fridges and more!',
    stats: {
      sent: 1212,
      delivered: 1180,
      read: 950,
      opened: 980,
      replied: 120,
      failed: 32,
    }
  },
  {
    id: '4',
    name: 'Pune renewal pending',
    listType: 'static',
    membersCount: 1234,
    wabaCount: 1,
    status: 'sent',
    lastModified: '2 days ago',
  }
];

export const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Neil Shah', phone: '+91 9876543210', status: 'read', avatarColor: 'bg-purple-200 text-purple-700' },
  { id: '2', name: 'Yuvraj Singh', phone: '+91 9876543210', status: 'delivered', avatarColor: 'bg-red-200 text-red-700' },
  { id: '3', name: 'Yash Raj', phone: '+91 9876543210', status: 'sent', avatarColor: 'bg-green-200 text-green-700' },
  { id: '4', name: 'Deepak', phone: '+91 9876543210', status: 'failed', avatarColor: 'bg-blue-200 text-blue-700' },
  { id: '5', name: 'Mahindra Singh', phone: '+91 9876543210', status: 'read', avatarColor: 'bg-indigo-200 text-indigo-700' },
  { id: '6', name: 'Virat Kohli', phone: '+91 9876543210', status: 'read', avatarColor: 'bg-orange-200 text-orange-700' },
  { id: '7', name: 'Rohit Sharma', phone: '+91 9876543210', status: 'delivered', avatarColor: 'bg-teal-200 text-teal-700' },
  { id: '8', name: 'KL Rahul', phone: '+91 9876543210', status: 'failed', avatarColor: 'bg-pink-200 text-pink-700' },
];

export const MOCK_SF_REPORTS: SalesforceReport[] = [
  { id: 'r1', name: 'All Open Opportunities - Q4', folder: 'Sales Reports', lastRun: 'Today', recordCount: 450 },
  { id: 'r2', name: 'New Leads (Last 30 Days)', folder: 'Marketing Reports', lastRun: 'Yesterday', recordCount: 1200 },
  { id: 'r3', name: 'Churned Customers 2024', folder: 'Support Reports', lastRun: 'Last Week', recordCount: 85 },
  { id: 'r4', name: 'High Value Loan Applicants', folder: 'Sales Reports', lastRun: 'Today', recordCount: 320 },
];

export const WIZARD_STEPS_LABELS = [
  'Campaign Details',
  'Data Source',
  'Audience Mapping',
];

export const MOCK_CHATS: ChatSession[] = [
    {
        id: 'c1',
        customerName: 'Eva Michael',
        customerPhone: '+91 98765 43210',
        avatarColor: 'bg-orange-200 text-orange-700',
        subject: 'Account Upgrade from Sept 2024',
        source: 'whatsapp',
        priority: 'High',
        agentInitials: 'OS',
        lastMessage: 'Oswald (AI): Here is our detailed offering...',
        timestamp: '2d ago',
        unreadCount: 0,
        status: 'Open',
        whatsappSessionStatus: 'expired',
        tags: ['Sales Lead', 'Enterprise'],
        isOnline: true
    },
    {
        id: 'c2',
        customerName: 'Michael Reeves',
        customerPhone: '+91 98123 45678',
        avatarColor: 'bg-yellow-200 text-yellow-700',
        subject: 'Shipping Delay',
        source: 'instagram',
        priority: 'Low',
        agentInitials: 'VR',
        lastMessage: 'Michael: When can i expect my order to be...',
        timestamp: '5d ago',
        unreadCount: 2,
        status: 'Open',
        whatsappSessionStatus: 'active',
        tags: ['Orders & Shipping']
    },
    {
        id: 'c3',
        customerName: 'Kenrick Lamar',
        customerPhone: '+91 99988 77766',
        avatarColor: 'bg-pink-200 text-pink-700',
        subject: '#1245 Subscription Issue',
        source: 'email',
        priority: 'Medium',
        agentInitials: 'VR',
        lastMessage: 'Veronica: Your order will reach you in 2-3 buis...',
        timestamp: '5d ago',
        unreadCount: 0,
        status: 'Closed',
        whatsappSessionStatus: 'expired',
        tags: ['Sales Lead', 'Enterprise']
    },
    {
        id: 'c4',
        customerName: 'Gurpreet Singh',
        customerPhone: '+91 91234 56789',
        avatarColor: 'bg-green-200 text-green-700',
        subject: 'Product Inquiry - Solar Panels',
        source: 'call', // Changed source to call
        priority: 'Medium',
        agentInitials: 'GS',
        lastMessage: "Missed call",
        timestamp: '1h ago',
        unreadCount: 1,
        status: 'Open',
        whatsappSessionStatus: 'active',
        tags: ['New Inquiry', 'Missed'], // Added Missed tag
        isOnline: true
    },
    {
        id: 'c5',
        customerName: 'Dalwinder Kaur',
        customerPhone: '+91 88888 22222',
        avatarColor: 'bg-purple-200 text-purple-700',
        subject: 'Refund Request #9988',
        source: 'sms',
        priority: 'High',
        agentInitials: 'DK',
        lastMessage: 'Hello DALWINDER KAUR, this is ...',
        timestamp: '2w ago',
        unreadCount: 0,
        status: 'Closed',
        whatsappSessionStatus: 'active',
        tags: ['Refund', 'Critical']
    }
];

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
    'c1': [
        {
            id: 'm1',
            sender: 'user',
            type: 'text',
            content: 'Hi, I need help with my loan application.',
            timestamp: '10:30 AM',
            status: 'read'
        },
        {
            id: 'm2',
            sender: 'agent',
            type: 'text',
            content: 'Hello Alex! 👋 I would be happy to help you with that. Can you please confirm your application ID?',
            timestamp: '10:31 AM',
            status: 'read'
        },
        {
            id: 'm3',
            sender: 'user',
            type: 'text',
            content: 'Sure, it is APP-2024-8899.',
            timestamp: '10:32 AM',
            status: 'read'
        },
        {
            id: 'm4',
            sender: 'agent',
            type: 'text',
            content: 'Thanks. Let me check the status for you.',
            timestamp: '10:32 AM',
            status: 'read'
        }
    ],
    'c4': [
        {
            id: 'm1-c4',
            sender: 'user',
            type: 'call',
            content: 'Missed Call',
            timestamp: '10:30 AM',
            status: 'read',
            callData: {
                status: 'missed',
                direction: 'inbound'
            }
        }
    ]
};

export const MOCK_CUSTOMER_PROFILES: Record<string, CustomerProfile> = {
    'c1': {
        id: 'p1',
        name: 'Eva Michael',
        email: 'eva.michael@gmail.com',
        phone: '+91 98765 43210',
        company: 'Paperlayer',
        location: 'Mumbai, India',
        cohorts: ['Paying', 'Enterprise'],
        history: [
            {
                id: 'h1',
                type: 'whatsapp',
                subject: 'Subscription Issue',
                date: 'Sep 20',
                summary: 'Customer reported billing issue. Resolved by issuing credit note.',
                resolution: 'Credit Note Issued'
            },
            {
                id: 'h2',
                type: 'call',
                subject: 'Feature Request',
                date: 'Sep 15',
                summary: 'Customer requested dark mode for dashboard. Ticket raised #FR-998.',
                transcript: 'Agent: Hello... User: I need dark mode...'
            },
            {
                id: 'h3',
                type: 'email',
                subject: 'Order Delay',
                date: 'Aug 12',
                summary: 'Shipment delayed due to rain. Updated ETA provided.',
            }
        ],
        notes: [
            {
                id: 'n1',
                content: 'Customer is very sensitive to pricing. Do not upsell without offering a discount.',
                date: '2023-10-20 14:00',
                agentName: 'Oswald'
            },
            {
                id: 'n2',
                content: 'Promised to follow up next week regarding the API integration.',
                date: '2023-10-18 10:30',
                agentName: 'Alex'
            }
        ]
    },
    'c2': {
        id: 'p2',
        name: 'Michael Reeves',
        email: 'michael.reeves@apple.com',
        phone: '+91 94235 24609',
        company: 'Apple',
        location: 'Mumbai, India',
        cohorts: ['Paying', 'Enterprise'],
        history: [
             {
                id: 'h4',
                type: 'whatsapp',
                subject: 'Login Trouble',
                date: 'Oct 01',
                summary: 'User forgot password. Reset link sent.',
            }
        ],
        notes: []
    },
    'c4': {
        id: 'p4',
        name: 'Gurpreet Singh',
        email: 'gurpreet.s@gmail.com',
        phone: '+91 91234 56789',
        company: 'SolarTech',
        location: 'Chandigarh, India',
        cohorts: ['New Inquiry'],
        history: [],
        notes: []
    }
};

export const MOCK_HISTORY_LOGS: HistoryLog[] = [
    {
        id: 'h1',
        customerName: 'Eva Michael',
        avatarColor: 'bg-orange-200 text-orange-700',
        type: 'call',
        subject: 'Quarterly Review',
        date: '2023-10-25T14:30:00',
        duration: '12m 30s',
        agentName: 'Oswald',
        status: 'Resolved',
        sentimentScore: 85,
        tags: ['Retention', 'Upsell'],
        aiSummary: 'Discussed Q3 performance. Customer happy with ROI. Proposed upgrading to Enterprise plan next month. Action: Send proposal.',
        transcript: 'Agent: Good afternoon Eva...\nCustomer: Hi Oswald, great to hear from you.\n...'
    },
    {
        id: 'h2',
        customerName: 'Michael Reeves',
        avatarColor: 'bg-yellow-200 text-yellow-700',
        type: 'whatsapp',
        subject: 'Shipping Delay #9982',
        date: '2023-10-24T10:15:00',
        agentName: 'Veronica',
        status: 'Resolved',
        sentimentScore: 40,
        tags: ['Complaint', 'Logistics'],
        aiSummary: 'Customer complained about 3-day delay. Issue traced to bad weather in Pune hub. Offered 10% discount coupon as apology. Accepted.',
    },
    {
        id: 'h3',
        customerName: 'Gurpreet Singh',
        avatarColor: 'bg-green-200 text-green-700',
        type: 'call',
        subject: 'Solar Panel Inquiry',
        date: '2023-10-24T09:00:00',
        duration: '4m 12s',
        agentName: 'Gurpreet S.',
        status: 'Open',
        sentimentScore: 70,
        tags: ['New Lead', 'High Intent'],
        aiSummary: 'Inquired about 5kW system for farmhouse. Requested site visit. Scheduled for Saturday.',
        transcript: 'Agent: Hello, this is SolarTech...\nCustomer: Hi, I wanted to ask about rooftop panels...'
    },
    {
        id: 'h4',
        customerName: 'Kenrick Lamar',
        avatarColor: 'bg-pink-200 text-pink-700',
        type: 'email',
        subject: 'Subscription Cancellation',
        date: '2023-10-23T16:45:00',
        agentName: 'Alex',
        status: 'Escalated',
        sentimentScore: 20,
        tags: ['Churn Risk', 'Critical'],
        aiSummary: 'Customer wants to cancel due to pricing. Escalated to retention team for custom offer.',
    },
    {
        id: 'h5',
        customerName: 'Dalwinder Kaur',
        avatarColor: 'bg-purple-200 text-purple-700',
        type: 'sms',
        subject: 'Payment Confirmation',
        date: '2023-10-22T11:20:00',
        agentName: 'System',
        status: 'Resolved',
        sentimentScore: 90,
        tags: ['Automated'],
        aiSummary: 'Automated payment receipt sent for Inv #5544.',
    }
];
