import {
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatCardModule,
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
  ],
})

export class MaterialModule { }
