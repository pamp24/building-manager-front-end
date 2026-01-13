/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { FormsModule } from '@angular/forms';

import { RoleFormComponent } from './role-form/role-form.component';
import { ApartmentFormComponent } from './apartment-form/apartment-form.component';
import { BuildingSetupComponent } from './building-setup/building-setup.component';
import { WizardStateService } from 'src/app/theme/shared/service/wizard-state.service';
import { BuildingMeta } from 'src/app/theme/shared/models/buildingMeta';
import { BuildingSetupResult } from 'src/app/theme/shared/models/building-setup-result';
import { BuildingService } from 'src/app/theme/shared/service/building.service';

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
    private buildingService: BuildingService
  ) {
    effect(() => {
      console.log('GUARD CHECK:', {
        step: this.currentStep(),
        action: this.selectedAction(),
        buildingId: this.buildingId,
        hasMeta: !!this.buildingMeta
      });
      const step = this.currentStep();
      const action = this.selectedAction();

      // Step 2 χωρίς action -> reset στο Step 1
      if (step === 2 && !action) {
        this.wizard.setStep(1);
        return;
      }

      // Step 3 χωρίς building data -> γύρνα πίσω
      if (step === 3) {
        const hasBuildingId = !!this.buildingId;
        const hasMeta = !!this.buildingMeta;

        if (!hasBuildingId || !hasMeta) {
          // αν έχει action, πάμε step2, αλλιώς step1
          this.wizard.setStep(action ? 2 : 1);
        }
      }
    });
  }
  ngOnInit() {
    this.wizard.reset();
  }

  onActionSelected(action: ActionType) {
    console.log('ACTION SELECTED:', action);
    this.wizard.setAction(action);
    console.log('STATE AFTER setAction:', {
      step: this.wizard.currentStep(),
      action: this.wizard.selectedAction(),
      buildingId: this.wizard.buildingId()
    });
  }

  onBuildingSetupCompleted(event: BuildingSetupResult): void {
    this.buildingId = event.buildingId;
    this.buildingMeta = event.buildingMeta;
    this.wizard.setBuilding(event.buildingId);
  }

  previousStep(): void {
    if (this.currentStep() === 3 && this.buildingId) {
      this.deleteDraftBuildingAndBack();
      return;
    }

    this.wizard.back();
  }

  private deleteDraftBuildingAndBack(): void {
    const id = this.buildingId!;
    this.buildingService.deleteBuilding(id).subscribe({
      next: () => {
        console.log('Draft building deleted');
        this.buildingId = undefined;
        this.buildingMeta = undefined as any;

        this.wizard.back(); // πήγαινε πίσω στο step 2
      },
      error: (err) => {
        console.error('Failed to delete draft building', err);
        alert('Δεν ήταν δυνατή η ακύρωση. Η πολυκατοικία δεν διαγράφηκε. Δοκιμάστε ξανά.');
        // εδώ ΔΕΝ κάνεις back
      }
    });
  }

  onWizardFinished(): void {
    this.wizard.reset();
  }
}
