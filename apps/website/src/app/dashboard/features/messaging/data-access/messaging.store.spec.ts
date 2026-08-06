import '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { MessagingService } from './messaging.service';
import { MessagingStore } from './messaging.store';

const USER = {
  avatar: null,
  email: 'alex@example.com',
  id: 'user-123',
  name: 'Alex Morgan',
  password: '',
  roles: ['talent']
};

describe('MessagingStore', () => {
  it('loads and sends messages using the collaboration API contract', () => {
    const http = {
      get: vi.fn((url: string) => {
        if (url === '/auth/me') {
          return of(USER);
        }

        if (url === '/collaboration/conversations') {
          return of([
            {
              contextId: 'application-123',
              contextType: 'application',
              id: 'conversation-123',
              lastMessageAt: '2026-07-20T15:42:00.000Z',
              participantIds: ['user-123', 'employer-456'],
              title: 'Data Analyst Internship',
              type: 'application',
              unreadCount: 1
            }
          ]);
        }

        return of([
          {
            attachmentUrl: null,
            content: 'Your profile is a strong fit.',
            conversationId: 'conversation-123',
            createdAt: '2026-07-20T15:42:00.000Z',
            id: 'message-123',
            isDeleted: false,
            senderId: 'employer-456',
            status: 'delivered',
            updatedAt: '2026-07-20T15:42:00.000Z'
          }
        ]);
      }),
      post: vi.fn(() =>
        of({
          attachmentUrl: null,
          content: 'I would like to discuss the role.',
          conversationId: 'conversation-123',
          createdAt: '2026-07-20T15:45:00.000Z',
          id: 'message-124',
          isDeleted: false,
          senderId: 'user-123',
          status: 'sent',
          updatedAt: '2026-07-20T15:45:00.000Z'
        })
      )
    };
    const injector = createEnvironmentInjector([
      { provide: HttpClient, useValue: http },
      MessagingService
    ]);
    const store = runInInjectionContext(injector, () => new MessagingStore());

    store.initialize({ applicationId: 'application-123' });

    expect(http.get).toHaveBeenCalledWith('/auth/me');
    expect(http.get).toHaveBeenCalledWith('/collaboration/conversations');
    expect(http.get).toHaveBeenCalledWith('/collaboration/conversations/conversation-123/messages', {
      params: { limit: 100 }
    });
    expect(store.activeConversation()?.applicationId).toBe('application-123');
    expect(store.activeConversation()?.source).toBe('api');
    expect(store.currentUserId()).toBe('user-123');
    expect(store.messages()[0]?.body).toBe('Your profile is a strong fit.');

    store.sendMessage({ body: 'I would like to discuss the role.', conversationId: 'conversation-123' });

    expect(http.post).toHaveBeenCalledWith('/collaboration/conversations/conversation-123/messages', {
      content: 'I would like to discuss the role.'
    });
    expect(store.sending()).toBe(false);
    expect(store.messages().at(-1)?.source).toBe('api');

    injector.destroy();
  });

  it('does not fabricate a conversation when the API returns an empty inbox', () => {
    const http = {
      get: vi.fn((url: string) => of(url === '/auth/me' ? USER : [])),
      post: vi.fn()
    };
    const injector = createEnvironmentInjector([
      { provide: HttpClient, useValue: http },
      MessagingService
    ]);
    const store = runInInjectionContext(injector, () => new MessagingStore());

    store.initialize({ talentProfileId: 'profile-456' });

    expect(store.activeConversation()).toBeNull();
    expect(store.conversations()).toEqual([]);

    injector.destroy();
  });
});
