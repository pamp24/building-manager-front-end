/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CloseOutline, DeleteOutline, EditOutline, PlusOutline } from '@ant-design/icons-angular/icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { OnInit } from '@angular/core';

import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { ManagerModalComponent } from './manager-modal/manager-modal.component';
import { ManagerDTO } from 'src/app/theme/shared/models/managerDTO';
import { ManagedBuildingDTO } from '../statement-list/building-selector-inline/building-selector-inline.component';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { CommonExpenseStatementService } from 'src/app/theme/shared/service/commonExpensesStatement.service';
import { CommonExpenseStatement } from 'src/app/theme/shared/models/commonExpenseStatement';
import { ApartmentService } from '../../../../../theme/shared/service/apartment.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statement-create',
  imports: [SharedModule],
  templateUrl: './statement-create.component.html',
  styleUrl: './statement-create.component.scss'
})
export class StatementCreateComponent implements OnInit, OnChanges {
  @Input() buildingId?: number;
  @Input() pmView = false;
  // public props
  private fb = inject(FormBuilder);
  private iconService = inject(IconService);
  modalService = inject(NgbModal);
  isCollapsed = false;
  multiCollapsed = true;
  manager: ManagerDTO | null = null;
  managedBuildings: ManagedBuildingDTO[] = [];
  selectedBuilding: ManagedBuildingDTO | null = null;
  previewCode: string = '';
  selectedApartments: ApartmentDTO[] = [];
  currentBuildingIndex: number = 0;
  currentBuilding: ManagedBuildingDTO | null = null;
  userRole: string | null = null;

  expenseCategories = [
    { label: 'ΚΟΙΝΟΧΡΗΣΤΑ', value: 'COMMON' },
    { label: 'ΘΕΡΜΑΝΣΗ', value: 'HEATING' },
    { label: 'ΑΣΑΝΣΕΡ', value: 'ELEVATOR' },
    { label: 'ΑΥΤΟΝΟΜΙΑ', value: 'EQUAL' }, // αν θες ξεχωριστό κάνουμε άλλο enum
    { label: 'BOILER', value: 'EQUAL' },
    { label: 'ΕΙΔΙΚΕΣ ΔΑΠΑΝΕΣ', value: 'EQUAL' },
    { label: 'ΙΔΙΟΚΤΗΤΩΝ', value: 'EQUAL' },
    { label: 'ΔΑΠΑΝΕΣ ΣΕ ΙΣΑ ΜΕΡΗ', value: 'EQUAL' },
    { label: 'ΑΛΛΕΣ ΔΑΠΑΝΕΣ', value: 'EQUAL' }
  ];

  // constructor
  constructor(
    private commonExpenseStatementService: CommonExpenseStatementService,
    private buildingService: BuildingService,
    private ApartmentService: ApartmentService
  ) {
    this.iconService.addIcon(...[EditOutline, PlusOutline, CloseOutline, DeleteOutline]);
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      this.userRole = parsed.role;
    }

    const buildings$: Observable<any[]> =
      this.userRole === 'PropertyManager' ? this.buildingService.getMyCompanyBuildings() : this.buildingService.getMyManagedBuildings();

    buildings$.subscribe({
      next: (data: any[]) => {
        this.managedBuildings = data as ManagedBuildingDTO[];
        if (data.length > 0) {
          this.selectBuilding(this.managedBuildings[0]);
        }
      },
      error: (err: unknown) => console.error('Σφάλμα φόρτωσης πολυκατοικιών', err)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingId'] && this.buildingId && this.managedBuildings.length > 0) {
      const found = this.managedBuildings.find((b) => b.id === this.buildingId);
      if (found) {
        this.selectBuilding(found);
        this.setCurrentBuildingById(found.id);
      }
    }
  }

  // public methods
  openManagerModal() {
    const modalRef = this.modalService.open(ManagerModalComponent, { size: 'lg', scrollable: true });
    modalRef.componentInstance.buildings = this.managedBuildings;
    modalRef.componentInstance.selectedBuilding = this.selectedBuilding;

    modalRef.result.then(
      (result) => {
        if (result && result.id) {
          this.selectBuilding(result);
        }
      },
      () => {
        console.log('Ο χρήστης έκλεισε το modal χωρίς επιλογή');
      }
    );
  }

  selectBuilding(building: ManagedBuildingDTO) {
    this.selectedBuilding = building;
    this.currentBuilding = building;
    this.currentBuildingIndex = this.managedBuildings.findIndex((b) => b.id === building.id);
    this.buildingId = building.id;

    localStorage.setItem('buildingId', String(building.id));

    this.buildingService.getBuilding(building.id).subscribe({
      next: (data) => {
        if (data.managerId || data.managerFullName) {
          this.manager = {
            id: data.managerId,
            fullName: data.managerFullName,
            email: data.managerEmail,
            phoneNumber: data.managerPhone
          } as ManagerDTO;
        } else if (data.company) {
          this.manager = {
            id: data.company.companyId,
            fullName: data.company.managerName,
            email: data.company.email,
            phoneNumber: data.company.phone
          } as ManagerDTO;
        } else {
          this.manager = null;
        }
      },
      error: (err) => console.error('Σφάλμα φόρτωσης στοιχείων κτιρίου', err)
    });

    this.commonExpenseStatementService.getNextCode(building.id).subscribe({
      next: (code) => this.form.patchValue({ code }),
      error: (err) => console.error('Σφάλμα φόρτωσης κωδικού', err)
    });

    this.ApartmentService.getApartmentsByBuilding(building.id).subscribe({
      next: (apartments) => {
        this.selectedApartments = apartments;
        console.log('Αυτόματα διαμερίσματα:', this.selectedApartments);
      },
      error: (err) => console.error('Σφάλμα φόρτωσης διαμερισμάτων', err)
    });
  }

  setCurrentBuildingById(buildingId: number) {
    const index = this.managedBuildings.findIndex((b) => b.id === buildingId);
    if (index >= 0) {
      this.currentBuildingIndex = index;
      this.currentBuilding = this.managedBuildings[index];
      this.buildingId = this.currentBuilding.id;
    }
  }

  form: FormGroup = this.fb.group({
    code: ['', Validators.required],
    type: ['Νέο', Validators.required],
    month: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    discountPercent: [0],
    taxPercent: [0],
    description: [''],
    items: this.fb.array([this.createItem()])
  });

  statement: CommonExpenseStatement = {
    code: '',
    type: '',
    month: '',
    startDate: '',
    endDate: '',
    discountPercent: 0,
    taxPercent: 0,
    items: [],
    description: ''
  };

  createItem(): FormGroup {
    return this.fb.group({
      category: ['', Validators.required], // <-- ΕΔΩ
      descriptionItem: ['', Validators.required],
      price: [0, Validators.required]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(i: number) {
    // τουλάχιστον ένα item πρέπει να υπάρχει
    if (this.items.length === 1 && i === 0) {
      return;
    }
    this.items.removeAt(i);
  }

  calculateTotals() {
    this.statement.subTotal = this.statement.items.reduce((sum, item) => sum + (item.price || 0), 0);
    const discount = (this.statement.subTotal * this.statement.discountPercent) / 100;
    const taxed = ((this.statement.subTotal - discount) * this.statement.taxPercent) / 100;
    this.statement.total = this.statement.subTotal - discount + taxed;
  }
  onSaveDraft() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Παρακαλώ συμπληρώστε την φόρμα!');
      console.warn('Η φόρμα είναι άκυρη:', this.form.value);
      return;
    }

    if (!this.selectedBuilding) {
      alert('Δεν έχει επιλεγεί πολυκατοικία');
      return;
    }

    const payload = {
      ...this.form.value,
      status: 'DRAFT', // <--- το ορίζουμε εδώ
      subTotal: this.subTotal,
      total: this.total
    };

    console.log('Στέλνω draft payload:', payload);

    this.commonExpenseStatementService.saveDraft(this.selectedBuilding.id, payload).subscribe({
      next: (saved) => {
        alert('Το προσχέδιο αποθηκεύτηκε!');
        console.log('Draft:', saved);
        this.form.reset(); // μηδενίζει τη φόρμα
        this.items.clear(); // καθαρίζει και τα items
        this.addItem(); // βάζει ένα κενό item για νέο draft
      },
      error: (err) => {
        console.error('Σφάλμα API:', err);
        alert('Σφάλμα κατά την αποθήκευση draft!');
      }
    });
  }

  onCreateAndSend() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Παρακαλώ συμπληρώστε την φόρμα!');
      console.warn('Η φόρμα είναι άκυρη:', this.form.value);
      return;
    }

    if (!this.selectedBuilding) {
      alert('Δεν έχει επιλεγεί πολυκατοικία');
      return;
    }

    const payload = {
      ...this.form.value,
      subTotal: this.subTotal,
      total: this.total
    };

    console.log('Στέλνω payload:', payload);

    this.commonExpenseStatementService.createStatement(this.selectedBuilding.id, payload).subscribe({
      next: (saved) => {
        alert('Η κατάσταση κοινοχρήστων δημιουργήθηκε!');
        console.log('Απάντηση API:', saved);

        // Μηδενισμός φόρμας
        this.form.reset({
          code: '',
          type: 'Νέο',
          month: '',
          startDate: '',
          endDate: '',
          discountPercent: 0,
          taxPercent: 0,
          description: '',
          items: []
        });

        //Προσθέτουμε ξανά ένα κενό item
        this.items.clear();
        this.addItem();
      },
      error: (err) => {
        console.error('Σφάλμα API:', err);
        alert('Σφάλμα κατά τη δημιουργία!');
      }
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get subTotal(): number {
    return this.items.controls.reduce((sum, ctrl) => {
      const price = ctrl.get('price')?.value || 0;
      return sum + price;
    }, 0);
  }

  get discount(): number {
    return (this.subTotal * (this.form.get('discountPercent')?.value || 0)) / 100;
  }

  get tax(): number {
    return ((this.subTotal - this.discount) * (this.form.get('taxPercent')?.value || 0)) / 100;
  }

  get total(): number {
    return this.subTotal - this.discount + this.tax;
  }

  generateStatementCode(buildingId: number, seq: number): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const buildingPart = buildingId.toString().padStart(6, '0');
    const seqPart = seq.toString().padStart(6, '0');
    return `${datePart}-${buildingPart}-${seqPart}`;
  }

  removeApartment(apartmentId: number) {
    this.selectedApartments = this.selectedApartments.filter((a) => a.id !== apartmentId);
  }

  loadBuildingsAndManagerDashboard() {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (buildings) => {
        if (buildings && buildings.length > 0) {
          this.managedBuildings = buildings;
          this.setCurrentBuilding(0); // default πρώτη πολυκατοικία
        } else {
          console.warn('Δεν βρέθηκαν πολυκατοικίες για τον διαχειριστή');
        }
      },
      error: (err) => {
        console.error('Σφάλμα κατά τη λήψη των πολυκατοικιών διαχειριστή', err);
      }
    });
  }

  setCurrentBuilding(index: number) {
    this.currentBuildingIndex = index;
    this.currentBuilding = this.managedBuildings[index];
    this.buildingId = this.currentBuilding.id;
  }
}
