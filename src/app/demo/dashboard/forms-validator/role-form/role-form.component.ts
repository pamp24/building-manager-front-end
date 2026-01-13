import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActionType } from '../forms-validator.component';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent {
  @Output() actionSelected = new EventEmitter<ActionType>();

  select(action: ActionType): void {
    this.actionSelected.emit(action);
  }
}