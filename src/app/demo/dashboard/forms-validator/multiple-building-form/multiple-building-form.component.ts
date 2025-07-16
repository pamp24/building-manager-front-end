import { Component, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiple-building-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './multiple-building-form.component.html',
  styleUrl: './multiple-building-form.component.scss'
})
export class MultipleBuildingFormComponent {
  @Input() selectedAction!: 'many' | 'new' | 'existing';
  @Output() backClicked = new EventEmitter<void>();

  onBack(): void {
    this.backClicked.emit();
  }
}
