// Angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { FormsModule, NgForm } from '@angular/forms';

class FormInput {
  role!: string;
  email!: string;
  password!: string;
  confirmPassword!: string;
  requiredInput!: string;
  url!: string;
  phone!: string;
  cmbGear!: string;
  address!: string;
  file!: string;
  switcher!: string;
}

interface FormData {
  role: string | null;
  basicInfo: Record<string, unknown>;
  roleSpecific: Record<string, unknown>;
}

@Component({
  selector: 'app-forms-validator',
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule, FormsModule],
  templateUrl: './forms-validator.component.html',
  styleUrls: ['./forms-validator.component.scss']
})
export class FormsValidatorComponent {
  isSubmitted = false;

  currentStep = 1;
  steps = [
    { label: 'Role', value: 1 },
    { label: 'Basic Info', value: 2 },
    { label: 'Role Specific', value: 3 }
  ];
  formInput: FormInput = {
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
    requiredInput: '',
    url: '',
    phone: '',
    cmbGear: '',
    address: '',
    file: '',
    switcher: ''
  };

  formData: FormData = {
    role: null,
    basicInfo: {},
    roleSpecific: {}
  };

  nextStep(form: NgForm, data?: string | Record<string, unknown>): void {
    if (!form.valid) {
      form.form.markAllAsTouched();
      return;
    }
    if (this.currentStep === 1 && typeof data === 'string') {
      this.formData.role = data;
    } else if (this.currentStep === 2 && data && typeof data === 'object') {
      this.formData.basicInfo = data;
    }
    this.currentStep++;
  }
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isSubmit(data: Record<string, unknown>) {
    this.formData.roleSpecific = data;
    // Κάνε το API call εδώ
    console.log('Sending to backend:', this.formData);
    // this.http.post('/api/register', this.formData).subscribe(...)
  }

  save(form: NgForm): void {
    this.isSubmitted = true;
    if (form.valid) {
      // Handle successful form submission here
      console.log('Form submitted:', this.formInput);
    } else {
      // Handle validation errors here
      console.log('Form is invalid');
    }
  }
}
