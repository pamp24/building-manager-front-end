import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {Input} from '@angular/core';

@Component({
  selector: 'app-existing-building-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './existing-building-form.component.html',
  styleUrl: './existing-building-form.component.scss'
})
export class ExistingBuildingFormComponent {
  @Input() selectedAction!: 'many' | 'new' | 'existing';
  @Output() backClicked = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  form: FormGroup = this.fb.group({
    buildingCode: ['', Validators.required]
  });

  onBack(): void {
    this.backClicked.emit();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const code = this.form.value.buildingCode;
    console.log('Υποβολή με κωδικό πολυκατοικίας:', code);

    // TODO: προσθήκη λογικής υποβολής
  }
}
