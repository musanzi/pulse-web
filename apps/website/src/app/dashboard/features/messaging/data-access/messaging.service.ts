import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IUser } from '@libs/utils';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import {
  IConversation,
  IConversationApiResponse,
  IMessage,
  IMessageApiResponse,
  IMessageParticipant,
  IMessagingContext,
  IMessagingWorkspace,
  ISendMessageApiPayload,
  ISendMessagePayload
} from '../interfaces';

@Service()
export class MessagingService {
  private readonly http = inject(HttpClient);

  loadWorkspace(context: IMessagingContext): Observable<IMessagingWorkspace> {
    return forkJoin({
      conversations: this.http.get<IConversationApiResponse[]>('/collaboration/conversations'),
      user: this.http.get<IUser>('/auth/me')
    }).pipe(
      switchMap(({ conversations, user }) => {
        const mappedConversations = conversations.map((conversation) => this.toConversation(conversation, user));
        const activeConversation = this.selectConversation(mappedConversations, context);
        const messages$ = activeConversation ? this.loadMessages(activeConversation.id) : of([]);

        return messages$.pipe(
          map((messages) => ({
            activeConversationId: activeConversation?.id ?? null,
            conversations: mappedConversations,
            currentUserId: user.id,
            messages,
            source: 'api' as const
          }))
        );
      })
    );
  }

  loadMessages(conversationId: string): Observable<IMessage[]> {
    return this.http
      .get<IMessageApiResponse[]>(`/collaboration/conversations/${conversationId}/messages`, {
        params: { limit: 100 }
      })
      .pipe(map((messages) => messages.map((message) => this.toMessage(message))));
  }

  sendMessage(payload: ISendMessagePayload): Observable<IMessage> {
    const apiPayload: ISendMessageApiPayload = { content: payload.body.trim() };

    return this.http
      .post<IMessageApiResponse>(`/collaboration/conversations/${payload.conversationId}/messages`, apiPayload)
      .pipe(map((message) => this.toMessage(message)));
  }

  private selectConversation(conversations: IConversation[], context: IMessagingContext): IConversation | undefined {
    return (
      conversations.find((conversation) => conversation.id === context.conversationId) ??
      conversations.find((conversation) => conversation.applicationId === context.applicationId) ??
      conversations.find((conversation) => conversation.questId === context.questId) ??
      conversations.find((conversation) => conversation.talentProfileId === context.talentProfileId) ??
      conversations[0]
    );
  }

  private toConversation(conversation: IConversationApiResponse, user: IUser): IConversation {
    const participants = conversation.participantIds
      .map<IMessageParticipant>((participantId) => ({
        avatar: participantId === user.id ? user.avatar : null,
        id: participantId,
        name: participantId === user.id ? user.name : null,
        online: false,
        role: participantId === user.id ? 'talent' : 'participant'
      }))
      .sort((left) => (left.id === user.id ? -1 : 1));

    return {
      applicationId: conversation.contextType === 'application' ? (conversation.contextId ?? '') : '',
      id: conversation.id,
      lastMessageAt: conversation.lastMessageAt ?? '',
      lastMessagePreview: '',
      participants,
      projectTitle: conversation.title ?? '',
      questId: conversation.contextType === 'quest' ? (conversation.contextId ?? '') : '',
      source: 'api',
      talentProfileId: '',
      unreadCount: conversation.unreadCount
    };
  }

  private toMessage(message: IMessageApiResponse): IMessage {
    return {
      body: message.content,
      conversationId: message.conversationId,
      id: message.id,
      senderId: message.senderId,
      sentAt: message.createdAt,
      source: 'api',
      status: message.status
    };
  }
}
