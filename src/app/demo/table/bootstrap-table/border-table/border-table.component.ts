import { TranslateModule } from '@ngx-translate/core';
// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-border-table',
  imports: [TranslateModule, CommonModule],
  templateUrl: './border-table.component.html',
  styleUrls: ['./border-table.component.scss']
})
export class BorderTableComponent {}
