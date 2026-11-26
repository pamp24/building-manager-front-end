import { TranslateModule } from '@ngx-translate/core';
// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-two',
  imports: [TranslateModule, CommonModule, RouterModule],
  templateUrl: './error-two.component.html',
  styleUrls: ['./error-two.component.scss']
})
export class ErrorTwoComponent {}
