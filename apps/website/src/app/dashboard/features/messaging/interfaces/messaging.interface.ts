export interface IMessageParticipant {
  id: string;
  name: string;
  role: 'talent' | 'employer' | 'coordinator';
  avatar: string | null;
  online: boolean;
}

export interface IConversation {
  id: string;
  applicationId: string;
  talentProfileId: string;
  projectTitle: string;
  participants: IMessageParticipant[];
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  source: 'api' | 'mock';
}

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read';
  source: 'api' | 'mock';
}

export interface IMessagingContext {
  applicationId?: string;
  talentProfileId?: string;
  conversationId?: string;
}

export interface IMessagingWorkspace {
  conversations: IConversation[];
  activeConversationId: string | null;
  messages: IMessage[];
  source: 'api' | 'mock';
}

export interface ISendMessagePayload {
  conversationId: string;
  senderId: string;
  body: string;
}
