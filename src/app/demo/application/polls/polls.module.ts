import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PollsRoutingModule } from './polls-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PollsRoutingModule
  ],
  declarations: [],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class PollsModule {}
