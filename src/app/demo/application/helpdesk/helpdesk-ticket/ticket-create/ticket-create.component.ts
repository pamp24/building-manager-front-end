import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketRequest,
  SupportTicketResponse,
  SupportTicketTargetRole
} from 'src/app/theme/shared/models/supportTicket';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { SupportTicketService } from 'src/app/theme/shared/service/supportTicket.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

type SelectOption<T> = {
  value: T;
  label: string;
};

type ApartmentSelectDTO = ApartmentDTO & {
  label: string;
};

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.scss'
})
export class TicketCreateComponent implements OnInit {
  form = this.fb.group({
    buildingId: [null as number | null, Validators.required],
    apartmentId: [null as number | null],
    targetRole: [null as SupportTicketTargetRole | null, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    priority: ['MEDIUM' as SupportTicketPriority, Validators.required],
    category: ['OTHER' as SupportTicketCategory, Validators.required]
  });

  allBuildings: BuildingDTO[] = [];
  buildings: BuildingDTO[] = [];
  apartments: ApartmentSelectDTO[] = [];
  availableTargetRoles: SelectOption<SupportTicketTargetRole>[] = [];
  private currentUserRole: string | null = null;

  ngOnInit(): void {
    this.loadCurrentUserRole();
    this.loadBuildings();
    this.syncBuildingControlState();

    this.form.get('targetRole')?.valueChanges.subscribe((targetRole) => {
      this.onTargetRoleChange(targetRole);
    });

    this.form.get('buildingId')?.valueChanges.subscribe((buildingId) => {
      this.onBuildingChange(buildingId);
    });
  }

  private loadCurrentUserRole(): void {
    const currentUserRaw = localStorage.getItem('currentUser');

    if (!currentUserRaw) {
      this.currentUserRole = null;
      this.availableTargetRoles = [];
      this.form.patchValue({ targetRole: null });
      return;
    }

    try {
      const currentUser = JSON.parse(currentUserRaw);
      this.currentUserRole = currentUser?.role ?? null;
    } catch (error) {
      console.error('Failed to parse currentUser from localStorage', error);
      this.currentUserRole = null;
    }

    this.initializeTargetRolesFromUserRole();
  }

  private initializeTargetRolesFromUserRole(): void {
    const normalizedRole = this.getNormalizedCurrentUserRole();

    if (normalizedRole === 'ADMIN') {
      this.availableTargetRoles = [
        { value: 'BUILDING_MANAGER', label: 'BUILDING_MANAGER' },
        { value: 'PROPERTY_MANAGER', label: 'PROPERTY_MANAGER' }
      ];
    } else if (normalizedRole === 'PROPERTYMANAGER' || normalizedRole === 'PROPERTY_MANAGER') {
      this.availableTargetRoles = [{ value: 'ADMIN', label: 'ADMIN' }];
    } else if (normalizedRole === 'PROPERTYAGENT' || normalizedRole === 'PROPERTY_AGENT') {
      this.availableTargetRoles = [{ value: 'PROPERTY_MANAGER', label: 'PROPERTY_MANAGER' }];
    } else if (normalizedRole === 'BUILDINGMANAGER' || normalizedRole === 'BUILDING_MANAGER') {
      this.availableTargetRoles = [
        { value: 'PROPERTY_MANAGER', label: 'PROPERTY_MANAGER' },
        { value: 'ADMIN', label: 'ADMIN' }
      ];
    } else if (normalizedRole === 'OWNER' || normalizedRole === 'RESIDENT') {
      this.availableTargetRoles = [
        { value: 'BUILDING_MANAGER', label: 'BUILDING_MANAGER' },
        { value: 'PROPERTY_MANAGER', label: 'PROPERTY_MANAGER' }
      ];
    } else {
      this.availableTargetRoles = [];
    }

    this.form.patchValue({
      targetRole: null
    });
  }

  private getNormalizedCurrentUserRole(): string {
    return (this.currentUserRole ?? '').toUpperCase().replace(/\s+/g, '_');
  }

  priorities: SelectOption<SupportTicketPriority>[] = [
    { value: 'LOW', label: 'Χαμηλή' },
    { value: 'MEDIUM', label: 'Μεσαία' },
    { value: 'HIGH', label: 'Υψηλή' },
    { value: 'URGENT', label: 'Επείγουσα' }
  ];

  categories: SelectOption<SupportTicketCategory>[] = [
    { value: 'MAINTENANCE', label: 'Συντήρηση' },
    { value: 'PAYMENTS', label: 'Πληρωμές' },
    { value: 'DOCUMENTS', label: 'Έγγραφα' },
    { value: 'COMPLAINT', label: 'Παράπονο' },
    { value: 'CLEANING', label: 'Καθαρισμός' },
    { value: 'HEATING', label: 'Θέρμανση' },
    { value: 'ELEVATOR', label: 'Ασανσέρ' },
    { value: 'PLUMBING', label: 'Υδραυλικά' },
    { value: 'ELECTRICAL', label: 'Ηλεκτρολογικά' },
    { value: 'OTHER', label: 'Άλλο' }
  ];

  loadingBuildings = false;
  loadingApartments = false;
  submitting = false;

  submitSuccess = false;
  errorMessage = '';

  createdTicket: SupportTicketResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private supportTicketService: SupportTicketService,
    private buildingService: BuildingService,
    private apartmentService: ApartmentService,
    private authenticationService: AuthenticationService
  ) {}

  loadBuildings(): void {
    this.loadingBuildings = true;
    this.errorMessage = '';

    const buildingsRequest =
      this.getNormalizedCurrentUserRole() === 'ADMIN'
        ? this.buildingService.getAllBuildingsForAdmin()
        : this.buildingService.getMyBuildings();

    buildingsRequest
      .pipe(finalize(() => (this.loadingBuildings = false)))
      .subscribe({
        next: (buildings: BuildingDTO[]) => {
          this.allBuildings = buildings ?? [];
          this.applyBuildingFilter();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία φόρτωσης πολυκατοικιών.';
        }
      });
  }

  onTargetRoleChange(targetRole: SupportTicketTargetRole | null): void {
    this.syncBuildingControlState(targetRole);
    this.applyBuildingFilter(targetRole);
  }

  onBuildingChange(buildingId: number | null): void {
    this.apartments = [];
    this.form.patchValue({ apartmentId: null });

    if (!buildingId) {
      return;
    }

    this.loadingApartments = true;
    this.errorMessage = '';

    this.apartmentService
      .getApartmentsByBuilding(buildingId)
      .pipe(finalize(() => (this.loadingApartments = false)))
      .subscribe({
        next: (apartments: ApartmentDTO[]) => {
          this.apartments = (apartments ?? []).map((apartment) => ({
            ...apartment,
            label: this.buildApartmentLabel(apartment)
          }));
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία φόρτωσης διαμερισμάτων.';
        }
      });
  }

  private applyBuildingFilter(targetRole = this.form.get('targetRole')?.value ?? null): void {
    this.buildings = this.allBuildings.filter((building) => this.supportsTargetRole(building, targetRole));

    const selectedBuildingId = this.form.get('buildingId')?.value ?? null;
    const selectedBuildingStillAvailable = this.buildings.some((building) => building.id === selectedBuildingId);

    if (!selectedBuildingStillAvailable) {
      const nextBuildingId = this.buildings.length === 1 ? this.buildings[0].id : null;

      this.form.patchValue(
        {
          buildingId: nextBuildingId,
          apartmentId: null
        },
        { emitEvent: false }
      );
      this.apartments = [];

      if (nextBuildingId != null) {
        this.onBuildingChange(nextBuildingId);
      }
    }
  }

  private syncBuildingControlState(targetRole = this.form.get('targetRole')?.value ?? null): void {
    const buildingControl = this.form.get('buildingId');

    if (!buildingControl) {
      return;
    }

    if (targetRole) {
      buildingControl.enable({ emitEvent: false });
      return;
    }

    buildingControl.disable({ emitEvent: false });
  }

  private supportsTargetRole(building: BuildingDTO, targetRole: SupportTicketTargetRole | null): boolean {
    if (!targetRole) {
      return false;
    }

    if (targetRole === 'PROPERTY_MANAGER') {
      return !!building.company;
    }

    if (targetRole === 'BUILDING_MANAGER') {
      return !!building.managerFullName || !!building.manager?.fullName;
    }

    if (targetRole === 'ADMIN') {
      return true;
    }

    return false;
  }

  submit(): void {
    this.submitSuccess = false;
    this.errorMessage = '';
    this.createdTicket = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const payload: SupportTicketRequest = {
      buildingId: raw.buildingId as number,
      apartmentId: raw.apartmentId ?? null,
      targetRole: raw.targetRole as SupportTicketTargetRole,
      title: raw.title?.trim() ?? '',
      description: raw.description?.trim() ?? '',
      priority: raw.priority as SupportTicketPriority,
      category: raw.category as SupportTicketCategory
    };

    this.submitting = true;

    this.supportTicketService
      .createTicket(payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (response: SupportTicketResponse) => {
          this.createdTicket = response;
          this.submitSuccess = true;
          this.errorMessage = '';

          this.form.reset({
            buildingId: null,
            apartmentId: null,
            targetRole: null,
            title: '',
            description: '',
            priority: 'MEDIUM',
            category: 'OTHER'
          });

          this.apartments = [];
          this.availableTargetRoles = [];
          this.initializeTargetRolesFromUserRole();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία δημιουργίας support ticket.';
        }
      });
  }

  clearForm(): void {
    const selectedBuildingId = this.form.get('buildingId')?.value ?? null;

    this.submitSuccess = false;
    this.errorMessage = '';
    this.createdTicket = null;

    this.form.reset({
      buildingId: selectedBuildingId,
      apartmentId: null,
      targetRole: null,
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'OTHER'
    });

    if (selectedBuildingId) {
      this.onBuildingChange(selectedBuildingId);
    } else {
      this.apartments = [];
      this.applyBuildingFilter();
    }
  }

  private buildApartmentLabel(apartment: ApartmentDTO): string {
    const apartmentAny = apartment as unknown as {
      number?: string | number;
      apartmentNumber?: string | number;
      floor?: string | number | null;
    };

    const number = apartmentAny.number ?? apartmentAny.apartmentNumber ?? 'Διαμέρισμα';
    const floor = apartmentAny.floor;

    return floor !== undefined && floor !== null && floor !== '' ? `${number} - Όροφος ${floor}` : `${number}`;
  }

  getSelectedRecipientName(): string {
    const targetRole = this.form.get('targetRole')?.value;
    const buildingId = this.form.get('buildingId')?.value;
    const selectedBuilding = this.buildings.find((building) => building.id === buildingId) ?? null;

    if (!targetRole || !selectedBuilding) {
      return '-';
    }

    if (targetRole === 'BUILDING_MANAGER') {
      return selectedBuilding.managerFullName || selectedBuilding.manager?.fullName || '-';
    }

    if (targetRole === 'PROPERTY_MANAGER') {
      return selectedBuilding.company?.managerName || selectedBuilding.company?.companyName || '-';
    }

    if (targetRole === 'ADMIN') {
      const currentUser = this.authenticationService.currentUserValue;
      const fullName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ').trim();

      return fullName || 'Admin';
    }

    return '-';
  }

  get buildingId() {
    return this.form.get('buildingId');
  }

  get targetRole() {
    return this.form.get('targetRole');
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }
}
