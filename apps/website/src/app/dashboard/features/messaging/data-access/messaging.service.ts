import { Service } from '@angular/core';
import { map, Observable, timer } from 'rxjs';
import {
  IConversation,
  IMessage,
  IMessageParticipant,
  IMessagingContext,
  IMessagingWorkspace,
  ISendMessagePayload
} from '../interfaces';

const CURRENT_USER: IMessageParticipant = {
  avatar: null,
  id: 'talent-current',
  name: 'Alex Morgan',
  online: true,
  role: 'talent'
};

const MOCK_CONVERSATIONS: IConversation[] = [
  {
    applicationId: 'application-analytics-intern',
    id: 'conversation-northstar',
    lastMessageAt: '2026-07-20T15:42:00.000Z',
    lastMessagePreview: 'Your project evidence gives us a strong place to start.',
    participants: [
      CURRENT_USER,
      {
        avatar: null,
        id: 'employer-maya',
        name: 'Maya Chen',
        online: true,
        role: 'employer'
      }
    ],
    projectTitle: 'Data Analyst Internship',
    source: 'mock',
    talentProfileId: 'talent-current',
    unreadCount: 2
  },
  {
    applicationId: 'application-community-lab',
    id: 'conversation-community-lab',
    lastMessageAt: '2026-07-19T18:10:00.000Z',
    lastMessagePreview: 'I added the milestone notes for your team.',
    participants: [
      CURRENT_USER,
      {
        avatar: null,
        id: 'coordinator-jules',
        name: 'Jules Martin',
        online: false,
        role: 'coordinator'
      }
    ],
    projectTitle: 'Community Insights Lab',
    source: 'mock',
    talentProfileId: 'talent-current',
    unreadCount: 0
  }
];

const MOCK_MESSAGES: Record<string, IMessage[]> = {
  'conversation-community-lab': [
    {
      body: 'I added the milestone notes for your team.',
      conversationId: 'conversation-community-lab',
      id: 'message-4',
      senderId: 'coordinator-jules',
      sentAt: '2026-07-19T18:10:00.000Z',
      source: 'mock',
      status: 'read'
    }
  ],
  'conversation-northstar': [
    {
      body: 'Hi Alex, your Python and analysis evidence stood out in the match review.',
      conversationId: 'conversation-northstar',
      id: 'message-1',
      senderId: 'employer-maya',
      sentAt: '2026-07-20T15:31:00.000Z',
      source: 'mock',
      status: 'read'
    },
    {
      body: 'Thanks, Maya. I can share the dashboard walkthrough and the data-quality notes.',
      conversationId: 'conversation-northstar',
      id: 'message-2',
      senderId: CURRENT_USER.id,
      sentAt: '2026-07-20T15:36:00.000Z',
      source: 'mock',
      status: 'read'
    },
    {
      body: 'Your project evidence gives us a strong place to start.',
      conversationId: 'conversation-northstar',
      id: 'message-3',
      senderId: 'employer-maya',
      sentAt: '2026-07-20T15:42:00.000Z',
      source: 'mock',
      status: 'delivered'
    }
  ]
};

@Service()
export class MessagingService {
  readonly currentUserId = CURRENT_USER.id;

  loadWorkspace(context: IMessagingContext): Observable<IMessagingWorkspace> {
    return timer(250).pipe(map(() => this.createWorkspace(context)));
  }

  loadMessages(conversationId: string): Observable<IMessage[]> {
    return timer(180).pipe(map(() => this.cloneMessages(conversationId)));
  }

  sendMessage(payload: ISendMessagePayload): Observable<IMessage> {
    return timer(220).pipe(
      map(() => ({
        body: payload.body.trim(),
        conversationId: payload.conversationId,
        id: `mock-message-${Date.now()}`,
        senderId: payload.senderId,
        sentAt: new Date().toISOString(),
        source: 'mock' as const,
        status: 'sent' as const
      }))
    );
  }

  private createWorkspace(context: IMessagingContext): IMessagingWorkspace {
    const conversations = MOCK_CONVERSATIONS.map((conversation) => this.cloneConversation(conversation));
    let activeConversation =
      conversations.find((conversation) => conversation.id === context.conversationId) ??
      conversations.find((conversation) => conversation.applicationId === context.applicationId) ??
      conversations.find((conversation) => conversation.talentProfileId === context.talentProfileId);

    if (!activeConversation && (context.applicationId || context.talentProfileId)) {
      activeConversation = this.createContextConversation(context);
      conversations.unshift(activeConversation);
    }

    activeConversation ??= conversations[0];

    return {
      activeConversationId: activeConversation?.id ?? null,
      conversations,
      messages: activeConversation ? this.cloneMessages(activeConversation.id) : [],
      source: 'mock'
    };
  }

  private createContextConversation(context: IMessagingContext): IConversation {
    return {
      applicationId: context.applicationId ?? `application-${context.talentProfileId ?? 'context'}`,
      id: `conversation-${context.applicationId ?? context.talentProfileId ?? 'context'}`,
      lastMessageAt: new Date().toISOString(),
      lastMessagePreview: 'Start a conversation about this match.',
      participants: [
        CURRENT_USER,
        {
          avatar: null,
          id: 'coordinator-digipulse',
          name: 'DigiPulse Coordinator',
          online: true,
          role: 'coordinator'
        }
      ],
      projectTitle: 'AI Match Follow-up',
      source: 'mock',
      talentProfileId: context.talentProfileId ?? CURRENT_USER.id,
      unreadCount: 0
    };
  }

  private cloneConversation(conversation: IConversation): IConversation {
    return {
      ...conversation,
      participants: conversation.participants.map((participant) => ({ ...participant }))
    };
  }

  private cloneMessages(conversationId: string): IMessage[] {
    return (MOCK_MESSAGES[conversationId] ?? []).map((message) => ({ ...message }));
  }
}
