import { TranslateModule } from '@ngx-translate/core';
// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-under-construct',
  imports: [TranslateModule, CommonModule, RouterModule],
  templateUrl: './under-construct.component.html',
  styleUrls: ['./under-construct.component.scss']
})
export class UnderConstructComponent {}
