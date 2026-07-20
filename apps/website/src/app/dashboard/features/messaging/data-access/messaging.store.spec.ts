import '@angular/compiler';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { MessagingService } from './messaging.service';
import { MessagingStore } from './messaging.store';

describe('MessagingStore', () => {
  it('opens an application conversation and appends a mock message', async () => {
    vi.useFakeTimers();
    const injector = createEnvironmentInjector([MessagingService]);
    const store = runInInjectionContext(injector, () => new MessagingStore());

    store.initialize({
      applicationId: 'application-new-match',
      talentProfileId: 'talent-123'
    });
    await vi.advanceTimersByTimeAsync(300);

    expect(store.loadingConversations()).toBe(false);
    expect(store.activeConversation()?.applicationId).toBe('application-new-match');
    expect(store.activeConversation()?.source).toBe('mock');

    store.sendMessage({
      body: 'I would like to discuss the role.',
      conversationId: store.activeConversationId() ?? '',
      senderId: store.currentUserId()
    });
    await vi.advanceTimersByTimeAsync(250);

    expect(store.sending()).toBe(false);
    expect(store.messages().at(-1)?.body).toBe('I would like to discuss the role.');
    expect(store.messages().at(-1)?.source).toBe('mock');

    injector.destroy();
    vi.useRealTimers();
  });

  it('creates a contextual conversation from a talent profile drill-down', async () => {
    vi.useFakeTimers();
    const injector = createEnvironmentInjector([MessagingService]);
    const store = runInInjectionContext(injector, () => new MessagingStore());

    store.initialize({ talentProfileId: 'talent-456' });
    await vi.advanceTimersByTimeAsync(300);

    expect(store.activeConversation()?.talentProfileId).toBe('talent-456');
    expect(store.activeConversation()?.applicationId).toBe('application-talent-456');
    expect(store.activeConversation()?.source).toBe('mock');

    injector.destroy();
    vi.useRealTimers();
  });
});
