import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoPipe } from '@jsverse/transloco';
import { IQuestRecommendation, ISkillGap } from '../../interfaces';

@Component({
  selector: 'app-skill-gap-accordion',
  imports: [MatButton, MatExpansionModule, MatIcon, MatProgressBarModule, TranslocoPipe],
  templateUrl: './skill-gap-accordion.html'
})
export class SkillGapAccordion {
  readonly gaps = input.required<ISkillGap[]>();
  readonly questsBySkill = input<Record<string, IQuestRecommendation[]>>({});
  readonly questSelected = output<string>();
  readonly skillOpened = output<string>();
}
