import { IConversation, IMessage } from './messaging.interface';

export interface IMessagingState {
  conversations: IConversation[];
  activeConversationId: string | null;
  messages: IMessage[];
  currentUserId: string;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sending: boolean;
  error: string | null;
}
