export interface IMessageParticipant {
  id: string;
  name: string | null;
  role: 'talent' | 'employer' | 'coordinator' | 'participant';
  avatar: string | null;
  online: boolean;
}

export interface IConversation {
  id: string;
  applicationId: string;
  questId: string;
  talentProfileId: string;
  projectTitle: string;
  participants: IMessageParticipant[];
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  source: 'api';
}

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read';
  source: 'api';
}

export interface IMessagingContext {
  applicationId?: string;
  talentProfileId?: string;
  conversationId?: string;
  participantId?: string;
  questId?: string;
}

export interface IMessagingWorkspace {
  conversations: IConversation[];
  activeConversationId: string | null;
  messages: IMessage[];
  currentUserId: string;
  source: 'api';
}

export interface ISendMessagePayload {
  conversationId: string;
  body: string;
}

export interface IConversationApiResponse {
  id: string;
  title: string | null;
  type: 'direct' | 'application' | 'quest';
  contextType: string | null;
  contextId: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  participantIds: string[];
}

export interface IMessageApiResponse {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  attachmentUrl: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateConversationApiPayload {
  title?: string;
  type?: 'direct' | 'application' | 'quest';
  participantIds: string[];
  contextType?: string;
  contextId?: string;
}

export interface ISendMessageApiPayload {
  content: string;
  attachmentUrl?: string;
}
