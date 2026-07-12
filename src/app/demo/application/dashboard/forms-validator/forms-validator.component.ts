/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';

import { ApartmentFormComponent } from './apartment-form/apartment-form.component';
import { BuildingSetupComponent } from './building-setup/building-setup.component';
import { RoleFormComponent } from './role-form/role-form.component';

import { BuildingMeta } from 'src/app/theme/shared/models/buildingMeta';
import { BuildingSetupResult } from 'src/app/theme/shared/models/building-setup-result';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { WizardStateService } from 'src/app/theme/shared/service/wizard-state.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

export type ActionType = 'new' | 'many' | 'existing';
export type WizardStep = 1 | 2 | 3;

@Component({
  selector: 'app-forms-validator',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    NarikCustomValidatorsModule,
    FormsModule,
    RoleFormComponent,
    ApartmentFormComponent,
    BuildingSetupComponent
  ],
  templateUrl: './forms-validator.component.html',
  styleUrls: ['./forms-validator.component.scss']
})
export class FormsValidatorComponent implements OnInit {
  selectedAction = computed(() => this.wizard.selectedAction());
  currentStep = computed(() => this.wizard.currentStep());

  buildingId?: number;
  buildingMeta!: BuildingMeta;

  constructor(
    private wizard: WizardStateService,
    private buildingService: BuildingService,
    private authenticationService: AuthenticationService
  ) {
    effect(() => {
      const step = this.currentStep();
      const action = this.selectedAction();

      if (step === 2 && !action) {
        this.wizard.setStep(1);
        return;
      }

      if (step === 3 && (!this.buildingId || !this.buildingMeta)) {
        this.wizard.setStep(action ? 2 : 1);
      }
    });
  }

  ngOnInit(): void {
    this.wizard.reset();
  }

  onActionSelected(action: ActionType): void {
    this.buildingId = undefined;
    this.buildingMeta = undefined as any;
    this.wizard.setAction(action);
  }

  onBuildingSetupCompleted(event: BuildingSetupResult): void {
    this.buildingId = event.buildingId;
    this.buildingMeta = event.buildingMeta;
    this.wizard.setBuilding(event.buildingId);
  }

  previousStep(): void {
    const action = this.selectedAction();

    if (action === 'new' && this.currentStep() === 3 && this.buildingId) {
      this.deleteDraftBuildingAndBack();
      return;
    }

    this.wizard.back();
  }

  onWizardFinished(): void {
    this.buildingId = undefined;
    this.buildingMeta = undefined as any;
    this.wizard.reset();
    this.authenticationService.refreshCurrentUserAndReload();
  }

  private deleteDraftBuildingAndBack(): void {
    const id = this.buildingId!;

    this.buildingService.deleteBuilding(id).subscribe({
      next: () => {
        this.buildingId = undefined;
        this.buildingMeta = undefined as any;
        this.wizard.back();
      },
      error: (err) => {
        console.error('Failed to delete draft building', err);
        alert('Δεν ήταν δυνατή η ακύρωση. Η πολυκατοικία δεν διαγράφηκε. Δοκιμάστε ξανά.');
      }
    });
  }
}
