import { TranslateModule } from '@ngx-translate/core';
// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-styling-table',
  imports: [TranslateModule, CommonModule],
  templateUrl: './styling-table.component.html',
  styleUrls: ['./styling-table.component.scss']
})
export class StylingTableComponent {}
