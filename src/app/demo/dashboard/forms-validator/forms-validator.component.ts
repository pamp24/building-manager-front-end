import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { FormsModule, FormGroup } from '@angular/forms';

import { UserService } from '../../../theme/shared/service/user.service';
import { BuildingFormComponent } from './building-form/building-form.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { MultipleBuildingFormComponent } from './multiple-building-form/multiple-building-form.component';
import { ExistingBuildingFormComponent } from './existing-building-form/existing-building-form.component';
import { ApartmentFormComponent } from './apartment-form/apartment-form.component';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-forms-validator',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    NarikCustomValidatorsModule,
    FormsModule,
    BuildingFormComponent,
    RoleFormComponent,
    MultipleBuildingFormComponent,
    ExistingBuildingFormComponent,
    ApartmentFormComponent
  ],
  templateUrl: './forms-validator.component.html',
  styleUrls: ['./forms-validator.component.scss']
})
export class FormsValidatorComponent implements OnInit {
  private authsService = AuthenticationService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedAction: 'many' | 'new' | 'existing' | null = localStorage.getItem('selectedAction') as any;
  currentStep = Number(localStorage.getItem('currentStep')) || 1;
  buildingForm!: FormGroup;
  buildingId!: number;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService
  ) {
    const user = this.authService.currentUserValue;

    if (user?.role === 'BuildingManager') {
      this.currentStep = 3;
    } else if (user?.role === 'PropertyManager') {
      this.currentStep = 2;
    } else {
      this.currentStep = 1;
    }
  }

  ngOnInit(): void {
    const storedStep = localStorage.getItem('currentStep');
    if (storedStep) {
      this.currentStep = +storedStep;
    }
    const storedAction = localStorage.getItem('selectedAction');
    if (storedAction === 'many' || storedAction === 'new' || storedAction === 'existing') {
      this.selectedAction = storedAction;
    }
  }

  steps = [
    { label: 'Role', value: 1 },
    { label: 'Role Specific', value: 2 },
    { label: 'Apartments', value: 3 }
  ];

  onActionSelected(action: 'many' | 'new' | 'existing'): void {
    this.selectedAction = action;
    localStorage.setItem('selectedAction', action);
  }

  goToNextStep(): void {
    this.currentStep++;
  }

  previousStep(): void {
    if (this.currentStep === 3) {
      localStorage.removeItem('buildingId');
    }
    if (this.currentStep > 1) {
      this.currentStep--;
      localStorage.setItem('currentStep', this.currentStep.toString());
    }
  }

  onBuildingFormSubmitted(event: { id: number; form: FormGroup }): void {
    this.buildingId = event.id;
    this.buildingForm = event.form;
    this.currentStep = 3;
    localStorage.setItem('currentStep', '3');
  }
}
