import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslocoPipe } from '@jsverse/transloco';
import { IConversation } from '../../interfaces';

@Component({
  selector: 'messaging-conversation-list',
  imports: [DatePipe, MatBadge, MatIcon, MatListModule, TranslocoPipe],
  templateUrl: './conversation-list.html'
})
export class ConversationList {
  readonly activeConversationId = input<string | null>(null);
  readonly conversations = input.required<IConversation[]>();
  readonly conversationSelected = output<string>();
}
