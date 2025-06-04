// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-placeholder',
  imports: [SharedModule, CommonModule],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss'
})
export class PlaceholderComponent {
  // public props
  inputHight = 100;
  lineHight = 10;
  showLineHight = 10;
  customClass: string = '';
  showH1 = true;
  numberLineShow = 1;
  showLine = 3;
  imgHeight = 150;
  ShowHeader = true;
  showHeaderTitle = true;

  get lines(): number[] {
    return Array.from({ length: this.numberLineShow }, (_, index) => index);
  }
  get allFuture(): number[] {
    return Array.from({ length: this.showLine }, (_, index) => index);
  }
}
