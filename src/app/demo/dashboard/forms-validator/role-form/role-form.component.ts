import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss'
})
export class RoleFormComponent {
  @Output() actionSelected = new EventEmitter<'many' | 'new' | 'existing'>();
  @Output() formCompleted = new EventEmitter<void>();

  selectedAction: 'many' | 'new' | 'existing' | null = null;

  setAction(action: 'many' | 'new' | 'existing') {
    this.selectedAction = action;
    this.actionSelected.emit(action);  // <- απαραίτητο
    this.formCompleted.emit();         // <- για να πας στο επόμενο βήμα
  }
}
