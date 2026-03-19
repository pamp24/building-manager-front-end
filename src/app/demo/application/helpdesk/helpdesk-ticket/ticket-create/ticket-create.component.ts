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

  buildings: BuildingDTO[] = [];
  apartments: ApartmentSelectDTO[] = [];
  availableTargetRoles: SelectOption<SupportTicketTargetRole>[] = [];
  private currentUserRole: string | null = null;

  ngOnInit(): void {
    this.loadCurrentUserRole();
    this.loadBuildings();

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
    const normalizedRole = (this.currentUserRole ?? '').toUpperCase().replace(/\s+/g, '_');

    if (normalizedRole === 'PROPERTYMANAGER' || normalizedRole === 'PROPERTY_MANAGER') {
      this.availableTargetRoles = [{ value: 'ADMIN', label: 'Admin' }];
    } else if (normalizedRole === 'BUILDINGMANAGER' || normalizedRole === 'BUILDING_MANAGER') {
      this.availableTargetRoles = [
        { value: 'PROPERTY_MANAGER', label: 'Property Manager' },
        { value: 'ADMIN', label: 'Admin' }
      ];
    } else if (normalizedRole === 'OWNER' || normalizedRole === 'RESIDENT') {
      this.availableTargetRoles = [
        { value: 'BUILDING_MANAGER', label: 'Building Manager' },
        { value: 'PROPERTY_MANAGER', label: 'Property Manager' }
      ];
    } else {
      this.availableTargetRoles = [];
    }

    this.form.patchValue({
      targetRole: this.availableTargetRoles[0]?.value ?? null
    });
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
    private apartmentService: ApartmentService
  ) {}

  loadBuildings(): void {
    this.loadingBuildings = true;
    this.errorMessage = '';

    this.buildingService
      .getMyBuildings()
      .pipe(finalize(() => (this.loadingBuildings = false)))
      .subscribe({
        next: (buildings: BuildingDTO[]) => {
          this.buildings = buildings ?? [];

          if (this.buildings.length === 1) {
            this.form.patchValue({
              buildingId: this.buildings[0].id
            });
          }
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία φόρτωσης πολυκατοικιών.';
        }
      });
  }

  onBuildingChange(buildingId: number | null): void {
    this.apartments = [];
    this.form.patchValue({ apartmentId: null });

    if (!buildingId) {
      this.initializeTargetRolesFromUserRole();
      return;
    }

    const selectedBuilding = this.buildings.find((b) => b.id === buildingId) ?? null;
    this.refineTargetRolesByBuilding(selectedBuilding);

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

  private refineTargetRolesByBuilding(building: BuildingDTO | null): void {
    this.initializeTargetRolesFromUserRole();

    if (!building) {
      return;
    }

    const hasPropertyManager = !!building.company;

    if (!hasPropertyManager) {
      this.availableTargetRoles = this.availableTargetRoles.filter((option) => option.value !== 'PROPERTY_MANAGER');
    }

    const currentTargetRole = this.form.get('targetRole')?.value;

    if (!currentTargetRole || !this.availableTargetRoles.some((option) => option.value === currentTargetRole)) {
      this.form.patchValue({
        targetRole: this.availableTargetRoles[0]?.value ?? null
      });
    }
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
      const selectedBuilding = this.buildings.find((b) => b.id === selectedBuildingId) ?? null;
      this.refineTargetRolesByBuilding(selectedBuilding);
      this.onBuildingChange(selectedBuildingId);
    } else {
      this.apartments = [];
      this.initializeTargetRolesFromUserRole();
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
