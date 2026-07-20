import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { TalentProfileDirectoryService } from '../../data-access';

@Component({
  selector: 'talent-profile-detail',
  imports: [MatButton, MatCard, MatCardContent, MatIcon, MatProgressSpinner, RouterLink, TranslocoPipe],
  templateUrl: './talent-profile.html'
})
export class TalentProfileDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly talentProfileDirectory = inject(TalentProfileDirectoryService);
  private readonly talentProfileId = this.route.snapshot.paramMap.get('talentProfileId') ?? 'talent-123';

  protected readonly profile = toSignal(this.talentProfileDirectory.findById(this.talentProfileId), {
    initialValue: null
  });
}
