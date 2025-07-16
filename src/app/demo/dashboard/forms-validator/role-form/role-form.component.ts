import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss'
})
export class RoleFormComponent {

selectedAction: 'many' | 'new' | 'existing' | null = null;

  @Output() actionSelected = new EventEmitter<'many' | 'new' | 'existing'>();

  setAction(action: 'many' | 'new' | 'existing') {
    this.selectedAction = action;
    this.actionSelected.emit(action); // Προώθηση στο parent!
  }
}
