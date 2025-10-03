// angular import
import { Component, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CloseOutline, DeleteOutline, EditOutline, PlusOutline } from '@ant-design/icons-angular/icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonExpenseStatementService } from '../../../../theme/shared/service/commonExpensesStatement.service';
import { CommonExpenseStatement } from '../../../../theme/shared/models/commonExpenseStatement';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { OnInit } from '@angular/core';
import { ManagerDTO } from '../../../../theme/shared/models/managerDTO';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { ManagerModalComponent } from './manager-modal/manager-modal.component';
import { ApartmentDTO } from '../../../../theme/shared/models/apartmentDTO';
import { ManagedBuildingDTO } from '../../../../theme/shared/models/managedBuildingDTO';
import { ApartmentService } from '../../../../theme/shared/service/apartment.service';

@Component({
  selector: 'app-invoice-create',
  imports: [SharedModule],
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.scss'
})
export class InvoiceCreateComponent implements OnInit {
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
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (data) => {
        this.managedBuildings = data;
        if (data.length > 0) {
          // default → πρώτη πολυκατοικία
          this.selectBuilding(data[0]);
        }
      },
      error: (err) => console.error('Σφάλμα φόρτωσης πολυκατοικιών', err)
    });
  }

  // public methods
  openManagerModal() {
    const modalRef = this.modalService.open(ManagerModalComponent, { size: 'lg', scrollable: true });
    modalRef.result.then((result) => {
      if (result) {
        this.selectBuilding(result);
      }
    });
  }

selectBuilding(building: ManagedBuildingDTO) {
  this.selectedBuilding = building;
  localStorage.setItem('buildingId', String(building.id));

  // Φέρνουμε τον manager
  this.buildingService.getBuildingManager(building.id).subscribe({
    next: (data) => (this.manager = data)
  });

  // Φέρνουμε τον επόμενο κωδικό
  this.commonExpenseStatementService.getNextCode(building.id).subscribe({
    next: (code) => this.form.patchValue({ code }),
    error: (err) => console.error('Σφάλμα φόρτωσης κωδικού', err)
  });

  // 🔹 Φόρτωσε αυτόματα όλα τα διαμερίσματα της πολυκατοικίας
  this.ApartmentService.getApartmentsByBuilding(building.id).subscribe({
    next: (apartments) => {
      this.selectedApartments = apartments;
      console.log('Αυτόματα διαμερίσματα:', this.selectedApartments);
    },
    error: (err) => console.error('Σφάλμα φόρτωσης διαμερισμάτων', err)
  });
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
}
