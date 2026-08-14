import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BidiModule } from '@angular/cdk/bidi';

// project import
import { CardComponent } from './components/card/card.component';

// third party
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from '@ant-design/icons-angular';
import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { TranslateModule } from '@ngx-translate/core';

// bootstrap import
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
  NgbModule,
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CodeInputModule } from 'angular-code-input';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CodeInputModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule,
    CardComponent,
    BidiModule,
    TranslateModule,
    IconModule
  ],
  exports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule,
    CardComponent,
    TranslateModule,
    IconModule,
    BidiModule
  ]
})
export class SharedModule {}
