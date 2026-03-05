
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './modules/broadcast/components/Sidebar';
import { MainPanel } from './modules/broadcast/components/MainPanel';
import { ChatPanel } from './components/ChatPanel';
import { HistoryPanel } from './components/history/HistoryPanel';
import { TestPage } from './components/TestPage'; // Imported TestPage
import { NavigationRail } from './components/NavigationRail';
import { InboxSidebar } from './components/InboxSidebar'; // Import InboxSidebar
import { TopNavigation } from './components/TopNavigation';
import { TopNavBar } from './components/TopNavBar'; // New Top Nav
import CreateCampaignModal from './modules/broadcast/components/CreateCampaignModal';
import { CreateChatModal } from './components/CreateChatModal';
import { CallModal } from './components/CallModal'; // Import CallModal
import { GlobalTrace } from './components/GlobalTrace'; // Import GlobalTrace
import { MOCK_CHATS, MOCK_CUSTOMER_PROFILES } from './constants';
import { Campaign, ChatSession } from './types';
import { cn } from './components/ui/base';
import { handleLaunchCampaign, handleCampaignUpdate } from './modules/broadcast/logic/broadcastLogic';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'broadcast' | 'chat' | 'history' | 'test' | 'reports'>('broadcast'); 
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to Dark Mode

  // Inbox Sidebar State
  const [isInboxSidebarOpen, setIsInboxSidebarOpen] = useState(true);

  // Broadcast State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  // Default to null (Intelligence Stack view)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Fetch campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data);
        }
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      }
    };
    fetchCampaigns();
  }, []);

  // Chat State
  const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  
  // Auto-start call logic
  const [autoStartCallId, setAutoStartCallId] = useState<string | null>(null);

  // Global Call State (for calls from Search/CreateChatModal)
  const [globalCallData, setGlobalCallData] = useState<{name: string, avatarColor: string} | null>(null);

  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  // Theme Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Derived Data
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const selectedChat = chats.find(c => c.id === selectedChatId);

  // --- Logic to cleanup empty temporary chats ---
  const cleanupTemporaryChats = (nextId?: string) => {
      // If we have a selected chat, and it's a "new" temporary one
      if (selectedChatId && selectedChatId.startsWith('new-')) {
          const currentChat = chats.find(c => c.id === selectedChatId);
          // If it exists and has no last message (meaning no interaction happened)
          if (currentChat && !currentChat.lastMessage.trim()) {
              // Remove it from the list
              setChats(prev => prev.filter(c => c.id !== selectedChatId));
          }
      }
      return true;
  };

  const onLaunchCampaign = async (formData: any) => {
      await handleLaunchCampaign(formData, setCampaigns, setSelectedCampaignId, setIsCampaignModalOpen, setIsMobileMenuOpen);
  };

  const onCampaignUpdate = (updatedCampaign: Campaign) => {
      handleCampaignUpdate(updatedCampaign, setCampaigns);
  };

  const handleModeChange = (mode: 'broadcast' | 'chat' | 'history' | 'test' | 'reports') => {
      // Cleanup before switching modes
      cleanupTemporaryChats();
      setAppMode(mode);
      setIsMobileMenuOpen(true); // Reset mobile view when switching apps
  };

  const handleCreateAction = () => {
      if (appMode === 'broadcast') {
          setIsCampaignModalOpen(true);
      } else if (appMode === 'chat') {
          setIsChatModalOpen(true);
      }
      // No create action for history or test
  };

  const handleStartNewChat = (customer: any) => {
      // Cleanup previous empty chat if exists before creating a new one
      cleanupTemporaryChats();

      // 1. Check if chat exists
      const existingChat = chats.find(c => c.customerName === customer.name);
      if (existingChat) {
          setSelectedChatId(existingChat.id);
          setIsChatModalOpen(false);
          setAppMode('chat');
          setIsMobileMenuOpen(false); // Close sidebar on mobile
          return;
      }

      // 2. Create new temporary chat session
      const newChatId = `new-${Date.now()}`;
      const newChat: ChatSession = {
          id: newChatId,
          customerName: customer.name,
          customerPhone: '+91 99999 00000', // Mock
          avatarColor: 'bg-blue-200 text-blue-700',
          subject: 'New Conversation',
          source: 'whatsapp',
          priority: 'Medium',
          agentInitials: 'YOU',
          lastMessage: '', // Empty initially - this is our flag for cleanup
          timestamp: 'Just now',
          unreadCount: 0,
          status: 'Open',
          whatsappSessionStatus: 'active',
          tags: [],
          isOnline: true
      };

      // 3. Add to Top of List
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      
      // 4. Create Mock Profile for Right Panel to avoid crash
      MOCK_CUSTOMER_PROFILES[newChatId] = {
          id: `p-${newChatId}`,
          name: customer.name,
          email: 'customer@example.com',
          phone: '+91 99999 00000',
          company: 'New Prospect',
          location: 'Unknown',
          cohorts: [],
          history: [],
          notes: [] // Added notes
      };

      setIsChatModalOpen(false);
      setAppMode('chat');
      setIsMobileMenuOpen(false);
  };

  // Called when a message is sent in ChatPanel to persist the session
  const handleMessageSent = (chatId: string, content: string, sender: 'agent' | 'user' = 'agent') => {
      // Handle Transfer Logic Separately to ensure UI sequencing
      if (sender === 'agent' && content.includes('System: Conversation reassigned to')) {
          const transferee = content.split('reassigned to ')[1] || 'another agent';
          
          // Step 1: Close the Chat Panel immediately
          if (selectedChatId === chatId) setSelectedChatId(null);

          // Step 2: Delay the visual update in Sidebar (Transferred state) by 700ms
          setTimeout(() => {
              setChats(prev => prev.map(chat => {
                  if (chat.id === chatId) {
                      return {
                          ...chat,
                          status: 'Transferred',
                          transferredTo: transferee,
                          tags: chat.tags.filter(t => t !== 'Escalated')
                      };
                  }
                  return chat;
              }));
          }, 700); 

          // Step 3: Remove from list after animation completes (700ms start + 1500ms animation = 2200ms total)
          setTimeout(() => {
              setChats(currentChats => currentChats.filter(c => c.id !== chatId));
          }, 2200);

          return; // Stop normal processing
      }

      setChats(prev => prev.map(chat => {
          if (chat.id === chatId) {
              let lastMsg = content;
              let newTags = chat.tags.filter(t => t !== 'Missed'); // Always remove Missed tag on activity
              const updates: Partial<ChatSession> = {};

              if (sender === 'agent') {
                   // Prefix "You:" for text messages to indicate agent action clearly
                   // We skip this for Call logs or if it already has "You:" or "System:"
                   if (!content.includes('Call') && !content.startsWith('You:') && !content.startsWith('System:') && !content.startsWith('Template:') && !content.startsWith('Flow:') && !content.startsWith('System:')) {
                       lastMsg = `You: ${content}`;
                   }
                   updates.unreadCount = 0;
                   updates.agentInitials = 'YOU'; // Set Last Actor to Agent
                   
                   // Sync Status/Tags for System Messages (Escalation/Resolution)
                   if (content.includes('System: Escalated')) {
                       if (!newTags.includes('Escalated')) newTags.push('Escalated');
                       updates.status = 'Closed'; // Escalated often locks the chat for regular agents
                   } else if (content.includes('System: Resolved')) {
                       newTags = newTags.filter(t => t !== 'Escalated');
                       updates.status = 'Closed';
                   } else if (!content.startsWith('System:')) {
                       // Regular agent message re-opens if closed
                       if (chat.status === 'Closed') {
                           updates.status = 'Open';
                           newTags = newTags.filter(t => t !== 'Escalated');
                       }
                   }

              } else {
                   updates.unreadCount = (chat.unreadCount || 0) + 1;
                   // User reply reopens chat
                   if (chat.status === 'Closed') {
                       updates.status = 'Open';
                       newTags = newTags.filter(t => t !== 'Escalated');
                   }
              }

              return {
                  ...chat,
                  ...updates,
                  lastMessage: lastMsg,
                  timestamp: 'Just now',
                  tags: newTags
              };
          }
          return chat;
      }));
  };

  const handleChatSelect = (id: string) => {
      if (selectedChatId === id) return;
      
      cleanupTemporaryChats(id);
      
      // Clear unread count immediately upon selection
      setChats(prev => prev.map(chat => 
          chat.id === id ? { ...chat, unreadCount: 0 } : chat
      ));

      setSelectedChatId(id);
      setIsMobileMenuOpen(false);
  };

  const handleStartCall = (customer: any) => {
      // Logic same as starting a chat, but we also flag to auto-start call
      cleanupTemporaryChats();

      let targetChatId = '';

      // 1. Check if chat exists
      const existingChat = chats.find(c => c.customerName === customer.name);
      if (existingChat) {
          targetChatId = existingChat.id;
      } else {
          // 2. Create new temporary chat session
          const newChatId = `new-${Date.now()}`;
          const newChat: ChatSession = {
              id: newChatId,
              customerName: customer.name,
              customerPhone: '+91 99999 00000',
              avatarColor: 'bg-blue-200 text-blue-700',
              subject: 'New Call',
              source: 'call',
              priority: 'Medium',
              agentInitials: 'YOU',
              lastMessage: '', 
              timestamp: 'Just now',
              unreadCount: 0,
              status: 'Open',
              whatsappSessionStatus: 'active',
              tags: [],
              isOnline: true
          };

          setChats(prev => [newChat, ...prev]);
          
          MOCK_CUSTOMER_PROFILES[newChatId] = {
              id: `p-${newChatId}`,
              name: customer.name,
              email: 'customer@example.com',
              phone: '+91 99999 00000',
              company: 'New Prospect',
              location: 'Unknown',
              cohorts: [],
              history: [],
              notes: [] // Added notes
          };
          targetChatId = newChatId;
      }

      setSelectedChatId(targetChatId);
      setAutoStartCallId(targetChatId); // Signal ChatPanel to start call
      setIsChatModalOpen(false);
      setAppMode('chat');
      setIsMobileMenuOpen(false);
  };

  return (
    <div className={cn(
        "flex flex-col h-screen w-full overflow-hidden transition-colors duration-300 font-sans relative",
        // Clean Sheet: Slate 200 for Light Mode background
        "bg-[#E2E8F0] dark:bg-[#0B0E14]"
    )}>
      
      {/* Global Trace Animation */}
      <GlobalTrace />

      {/* GLOBAL ATMOSPHERIC STAGE (Dark Mode Only) - High-Opacity Light Leak Effect */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block overflow-hidden z-0">
          {/* Glow Source 1 (Top-Left Corner): Vibrant Electric Violet (#7C3AED) at 20% opacity */}
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#7C3AED] opacity-[0.20] blur-[120px]"></div>
          
          {/* Glow Source 2 (Bottom-Right Corner): Sky Mist Blue (#3B82F6) at 20% opacity */}
          <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#3B82F6] opacity-[0.20] blur-[120px]"></div>
      </div>

      {/* Desktop Top Nav */}
      <div className="hidden md:block relative z-30">
          <TopNavBar />
      </div>

      {/* Top Navigation - Mobile Only */}
      <div className="md:hidden relative z-30">
        <TopNavigation 
            onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            activeTab={appMode as any}
            onTabChange={handleModeChange as any}
            onCreateClick={handleCreateAction}
        />
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative md:pt-[40px] z-10"> {/* Adjusted padding top for fixed nav */}
          
          {/* Navigation Rail - Desktop Only */}
          <div className="hidden md:block h-full shrink-0">
              <NavigationRail 
                activeTab={appMode} 
                onTabChange={handleModeChange} 
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
          </div>

          {/* New: Inbox Sidebar (Only in Chat Mode) */}
          {appMode === 'chat' && (
              <div className="hidden md:block shrink-0 h-full relative z-20">
                  <InboxSidebar isOpen={isInboxSidebarOpen} />
              </div>
          )}

          {/* Sidebar Area - Show for Broadcast & Chat, HIDE for Reports */}
          {(appMode === 'broadcast' || appMode === 'chat') && (
              <div className={cn(
                   "h-full absolute md:relative z-20 md:z-auto transition-transform duration-300 md:translate-x-0 bg-transparent shrink-0",
                   isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                   "w-full md:w-auto" // Let Sidebar component define width
              )}>
                   <Sidebar 
                    mode={appMode as 'broadcast' | 'chat'}
                    items={appMode === 'broadcast' ? campaigns : chats}
                    selectedId={appMode === 'broadcast' ? (selectedCampaignId || '') : (selectedChatId || '')}
                    onSelect={(id) => {
                        if (appMode === 'broadcast') setSelectedCampaignId(id);
                        else handleChatSelect(id);
                    }}
                    onNewAction={handleCreateAction}
                    className="h-full"
                    isInboxSidebarOpen={isInboxSidebarOpen}
                    onToggleInboxSidebar={() => setIsInboxSidebarOpen(!isInboxSidebarOpen)}
                   />
              </div>
          )}

          {/* Panel Area */}
          <div className={cn(
               "flex-1 h-full w-full absolute md:relative transition-transform duration-300 min-w-0 bg-transparent dark:bg-transparent",
               // Mobile menu logic
               ((appMode !== 'history' && appMode !== 'test' && appMode !== 'reports') && !isMobileMenuOpen) ? "translate-x-0" : 
               ((appMode !== 'history' && appMode !== 'test' && appMode !== 'reports') ? "translate-x-full md:translate-x-0" : "translate-x-0")
          )}>
               {appMode === 'reports' ? (
                   <MainPanel 
                        campaign={undefined} // Force empty state for Dashboard
                        onBack={() => setIsMobileMenuOpen(true)}
                        className="h-full w-full"
                        isDarkMode={isDarkMode}
                        onToggleTheme={toggleTheme}
                        onCampaignUpdate={onCampaignUpdate}
                   />
               ) : appMode === 'broadcast' ? (
                   <MainPanel 
                        campaign={selectedCampaign}
                        onBack={() => setIsMobileMenuOpen(true)}
                        className="h-full w-full"
                        isDarkMode={isDarkMode}
                        onToggleTheme={toggleTheme}
                        onCampaignUpdate={onCampaignUpdate}
                   />
               ) : appMode === 'chat' ? (
                   <ChatPanel 
                        session={selectedChat}
                        onBack={() => setIsMobileMenuOpen(true)}
                        onMessageSent={handleMessageSent}
                        autoStartCall={selectedChatId === autoStartCallId}
                        onAutoCallStarted={() => setAutoStartCallId(null)}
                        className="h-full w-full"
                        isDarkMode={isDarkMode}
                        onToggleTheme={toggleTheme}
                   />
               ) : appMode === 'history' ? (
                   <HistoryPanel className="h-full w-full" />
               ) : (
                   <TestPage />
               )}
          </div>
      </div>

      {/* Modals */}
      <CreateCampaignModal 
        isOpen={isCampaignModalOpen} 
        onClose={() => setIsCampaignModalOpen(false)} 
        onLaunch={onLaunchCampaign}
      />
      
      <CreateChatModal 
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onStartChat={handleStartNewChat}
        onStartCall={handleStartCall}
      />

      {/* Global Call Modal */}
      <CallModal 
        isOpen={!!globalCallData}
        onClose={() => setGlobalCallData(null)}
        customerName={globalCallData?.name || 'Unknown'}
        avatarColor={globalCallData?.avatarColor || 'bg-gray-200'}
        onCallEnd={() => setGlobalCallData(null)}
      />

    </div>
  );
};

export default App;
