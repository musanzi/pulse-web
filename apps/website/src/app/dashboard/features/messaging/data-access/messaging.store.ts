import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { IMessagingContext, IMessagingState, ISendMessagePayload } from '../interfaces';
import { MessagingService } from './messaging.service';

const initialState: IMessagingState = {
  activeConversationId: null,
  conversations: [],
  currentUserId: 'talent-current',
  error: null,
  loadingConversations: false,
  loadingMessages: false,
  messages: [],
  sending: false
};

export const MessagingStore = signalStore(
  withState(initialState),
  withProps(() => ({ messagingService: inject(MessagingService) })),
  withComputed(({ activeConversationId, conversations }) => ({
    activeConversation: computed(
      () => conversations().find((conversation) => conversation.id === activeConversationId()) ?? null
    )
  })),
  withMethods(({ messagingService, ...store }) => ({
    initialize: rxMethod<IMessagingContext>(
      pipe(
        tap(() => patchState(store, { error: null, loadingConversations: true, loadingMessages: true })),
        switchMap((context) =>
          messagingService.loadWorkspace(context).pipe(
            tap((workspace) =>
              patchState(store, {
                activeConversationId: workspace.activeConversationId,
                conversations: workspace.conversations,
                currentUserId: messagingService.currentUserId,
                messages: workspace.messages
              })
            ),
            catchError(() => {
              patchState(store, { error: 'messaging.errors.load' });
              return of(null);
            }),
            finalize(() => patchState(store, { loadingConversations: false, loadingMessages: false }))
          )
        )
      )
    ),
    selectConversation: rxMethod<string>(
      pipe(
        tap((conversationId) =>
          patchState(store, {
            activeConversationId: conversationId,
            error: null,
            loadingMessages: true,
            messages: []
          })
        ),
        switchMap((conversationId) =>
          messagingService.loadMessages(conversationId).pipe(
            tap((messages) =>
              patchState(store, {
                conversations: store
                  .conversations()
                  .map((conversation) =>
                    conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
                  ),
                messages
              })
            ),
            catchError(() => {
              patchState(store, { error: 'messaging.errors.messages' });
              return of(null);
            }),
            finalize(() => patchState(store, { loadingMessages: false }))
          )
        )
      )
    ),
    sendMessage: rxMethod<ISendMessagePayload>(
      pipe(
        tap(() => patchState(store, { error: null, sending: true })),
        switchMap((payload) =>
          messagingService.sendMessage(payload).pipe(
            tap((message) =>
              patchState(store, {
                conversations: store
                  .conversations()
                  .map((conversation) =>
                    conversation.id === message.conversationId
                      ? { ...conversation, lastMessageAt: message.sentAt, lastMessagePreview: message.body }
                      : conversation
                  ),
                messages: [...store.messages(), message]
              })
            ),
            catchError(() => {
              patchState(store, { error: 'messaging.errors.send' });
              return of(null);
            }),
            finalize(() => patchState(store, { sending: false }))
          )
        )
      )
    )
  }))
);
