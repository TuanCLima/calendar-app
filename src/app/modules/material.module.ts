import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DialogModule } from '@angular/cdk/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  exports: [
    DragDropModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    DialogModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
})
export class MaterialModule {}
