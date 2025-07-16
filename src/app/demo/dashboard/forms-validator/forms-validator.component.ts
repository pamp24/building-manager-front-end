// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../theme/shared/service/user.service';
import { UserFormComponent } from './user-form/user-form.component';
import { BuildingFormComponent } from './building-form/building-form.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { ViewChild } from '@angular/core';
import { MultipleBuildingFormComponent } from './multiple-building-form/multiple-building-form.component';
import { ExistingBuildingFormComponent } from './existing-building-form/existing-building-form.component';

@Component({
  selector: 'app-forms-validator',
  imports: [
    CommonModule,
    SharedModule,
    NarikCustomValidatorsModule,
    FormsModule,
    UserFormComponent,
    BuildingFormComponent,
    RoleFormComponent,
    MultipleBuildingFormComponent,
    ExistingBuildingFormComponent
  ],
  templateUrl: './forms-validator.component.html',
  styleUrls: ['./forms-validator.component.scss']
})
export class FormsValidatorComponent implements OnInit {
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;
  isSubmitted = false;
  showUserForm = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedAction: 'many' | 'new' | 'existing' | null = localStorage.getItem('selectedAction') as any;
  currentStep = Number(localStorage.getItem('currentStep')) || 1;

  onActionSelected(action: 'many' | 'new' | 'existing'): void {
    this.selectedAction = action;
    localStorage.setItem('selectedAction', action);
    this.currentStep = 3;
    localStorage.setItem('currentStep', '3');
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      const isComplete =
        user.firstName &&
        user.lastName &&
        user.dateOfBirth &&
        user.address1 &&
        user.addressNumber1 &&
        user.country &&
        user.city &&
        user.state &&
        user.postalCode;
      if (isComplete) {
        this.currentStep = 2;
      } else {
        this.currentStep = 1;
      }
    });
  }

  constructor(private userService: UserService) {}
  nextStep(): void {
    const form = this.userFormComponent?.userForm;

    if (this.currentStep === 2 && form?.invalid) {
      form.markAllAsTouched();
      return;
    }

    if (this.currentStep === 2) {
      console.log('User form submitted', form?.value);
    }

    this.currentStep++;
  }

  onUserFormCompleted(): void {
    console.log('User form completed');
    this.showUserForm = false;
    this.currentStep = 2;
  }
  steps = [
    { label: 'Basic Info', value: 1 },
    { label: 'Role', value: 2 },
    { label: 'Role Specific', value: 3 },
    { label: 'Apartments', value: 4 }
  ];

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      localStorage.setItem('currentStep', this.currentStep.toString());
    }
  }
}
