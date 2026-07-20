import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { IProgramOversightRow } from '../../interfaces';

@Component({
  selector: 'program-oversight-table',
  imports: [MatButton, MatIcon, MatProgressBar, MatTableModule, TranslocoPipe],
  templateUrl: './program-oversight-table.html'
})
export class ProgramOversightTable {
  readonly programs = input.required<IProgramOversightRow[]>();
  readonly websiteUrl = input.required<string>();

  protected readonly displayedColumns = ['project', 'talent', 'coordinator', 'progress', 'status', 'action'];

  protected talentHref(program: IProgramOversightRow): string {
    return new URL(program.talentProfileRoute, this.websiteUrl()).toString();
  }
}
