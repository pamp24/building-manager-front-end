import { TranslateModule } from '@ngx-translate/core';
// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sizing-table',
  imports: [TranslateModule, CommonModule],
  templateUrl: './sizing-table.component.html',
  styleUrls: ['./sizing-table.component.scss']
})
export class SizingTableComponent {}
