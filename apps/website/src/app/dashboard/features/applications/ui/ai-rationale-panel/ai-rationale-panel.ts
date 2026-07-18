import { Component, computed, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { IMatchInsight, IMatchRationale } from '../../interfaces';

@Component({
  selector: 'app-ai-rationale-panel',
  imports: [MatExpansionModule, MatIcon, TranslocoPipe],
  templateUrl: './ai-rationale-panel.html'
})
export class AiRationalePanel {
  readonly matchResult = input.required<IMatchInsight>();

  protected readonly overlapRationales = computed(() =>
    this.matchResult().rationales.filter((reason) => this.hasOnlyMatchedEvidence(reason))
  );
  protected readonly growthRationales = computed(() =>
    this.matchResult().rationales.filter((reason) => this.hasMissingEvidence(reason))
  );

  private hasOnlyMatchedEvidence(reason: IMatchRationale): boolean {
    const missingSkillIds = new Set(this.matchResult().missingSkills.map((skill) => skill.id));

    return !reason.evidenceSkillIds.some((skillId) => missingSkillIds.has(skillId));
  }

  private hasMissingEvidence(reason: IMatchRationale): boolean {
    const missingSkillIds = new Set(this.matchResult().missingSkills.map((skill) => skill.id));

    return reason.evidenceSkillIds.some((skillId) => missingSkillIds.has(skillId));
  }
}
