import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { MessagingStore } from '../../data-access';
import { IMessagingContext } from '../../interfaces';
import { ChatThread, ConversationList, MessageComposer } from '../../ui';

@Component({
  selector: 'app-messaging',
  imports: [ChatThread, ConversationList, MatIcon, MessageComposer, TranslocoPipe],
  templateUrl: './messaging.html'
})
export class Messaging {
  protected readonly messagingStore = inject(MessagingStore);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const queryParams = this.route.snapshot.queryParamMap;
    const context: IMessagingContext = {
      applicationId: queryParams.get('applicationId') ?? undefined,
      conversationId: queryParams.get('conversationId') ?? undefined,
      participantId: queryParams.get('participantId') ?? undefined,
      questId: queryParams.get('questId') ?? undefined,
      talentProfileId: queryParams.get('talentProfileId') ?? undefined
    };

    this.messagingStore.initialize(context);
  }

  protected sendMessage(body: string): void {
    const conversationId = this.messagingStore.activeConversationId();

    if (!conversationId) {
      return;
    }

    this.messagingStore.sendMessage({
      body,
      conversationId
    });
  }
}
