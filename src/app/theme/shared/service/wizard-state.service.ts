import { Injectable, computed, effect, signal } from '@angular/core';

export type ActionType = 'new' | 'many' | 'existing';
export type WizardStep = 1 | 2 | 3;

export interface WizardState {
  selectedAction: ActionType | null;
  currentStep: WizardStep;
  buildingId: number | null;
}

const STORAGE_KEY = 'wizardState_v1';

const DEFAULT_STATE: WizardState = {
  selectedAction: null,
  currentStep: 1,
  buildingId: null
};

@Injectable({ providedIn: 'root' })
export class WizardStateService {
  private readonly _state = signal<WizardState>(this.load());

  // ✅ expose readonly “signal view”
  readonly state = computed(() => this._state());

  // ✅ convenience getters (optional)
  readonly selectedAction = computed(() => this._state().selectedAction);
  readonly currentStep = computed(() => this._state().currentStep);
  readonly buildingId = computed(() => this._state().buildingId);

  constructor() {
    // ✅ persist automatically on any change
    effect(() => {
      const s = this._state();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    });
  }

  setAction(action: ActionType): void {
    this.patch({ selectedAction: action, currentStep: 2 });
  }

  setBuilding(buildingId: number): void {
    this.patch({ buildingId, currentStep: 3 });
  }

  setStep(step: WizardStep): void {
    this.patch({ currentStep: step });
  }

  back(): void {
    const s = this._state();

    if (s.currentStep === 2) {
      this.patch({ currentStep: 1, selectedAction: null });
      return;
    }

    if (s.currentStep === 3) {
      this.patch({ currentStep: 2 });
      return;
    }
  }

  reset(): void {
    this._state.set(DEFAULT_STATE);
  }

  private patch(partial: Partial<WizardState>): void {
    this._state.update((prev) => ({ ...prev, ...partial }));
  }

  private load(): WizardState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;

      const parsed = JSON.parse(raw) as Partial<WizardState>;
      const step = parsed.currentStep;
      const action = parsed.selectedAction;

      const stepOk = step === 1 || step === 2 || step === 3;
      const actionOk = action === null || action === 'new' || action === 'many' || action === 'existing';

      if (!stepOk || !actionOk) return DEFAULT_STATE;

      return {
        selectedAction: action ?? null,
        currentStep: (step ?? 1) as WizardStep,
        buildingId: typeof parsed.buildingId === 'number' ? parsed.buildingId : null
      };
    } catch {
      return DEFAULT_STATE;
    }
  }
}
