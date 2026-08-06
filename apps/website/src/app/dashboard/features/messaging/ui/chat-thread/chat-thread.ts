import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { IConversation, IMessage } from '../../interfaces';

@Component({
  selector: 'messaging-chat-thread',
  imports: [DatePipe, MatIcon, MatProgressSpinner, TranslocoPipe],
  templateUrl: './chat-thread.html'
})
export class ChatThread {
  readonly conversation = input<IConversation | null>(null);
  readonly currentUserId = input.required<string>();
  readonly loading = input(false);
  readonly messages = input.required<IMessage[]>();
}
