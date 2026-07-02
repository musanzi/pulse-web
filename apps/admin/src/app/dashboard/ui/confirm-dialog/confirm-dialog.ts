import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { IConfirmDialog } from '../../interfaces/confirm-dialog.interface';

@Component({
  selector: 'admin-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, TranslocoPipe],
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {
  protected readonly data = inject<IConfirmDialog>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>);
}
