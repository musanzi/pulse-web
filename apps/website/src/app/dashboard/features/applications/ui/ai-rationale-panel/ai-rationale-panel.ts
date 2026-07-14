import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { IMatchInsight } from '../../interfaces';

@Component({
  selector: 'app-ai-rationale-panel',
  imports: [MatExpansionModule, MatIcon, TranslocoPipe],
  templateUrl: './ai-rationale-panel.html'
})
export class AiRationalePanel {
  readonly insight = input.required<IMatchInsight>();
}
