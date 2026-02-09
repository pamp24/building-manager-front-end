// angular import
import { Component, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
// icons
import { IconService } from '@ant-design/icons-angular';
import { CloseOutline, DeleteOutline, EditOutline, PlusOutline } from '@ant-design/icons-angular/icons';

// bootstrap import
import { CommonExpenseStatementService } from '../../../../theme/shared/service/commonExpensesStatement.service';
import { BuildingService } from '../../../../theme/shared/service/building.service';
import { ApartmentService } from '../../../../theme/shared/service/apartment.service';
import { CommonExpenseStatement } from '../../../../theme/shared/models/commonExpenseStatement';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { ApartmentDTO } from '../../../../theme/shared/models/apartmentDTO';
import { ManagerDTO } from '../../../../theme/shared/models/managerDTO';
import { BuildingDTO } from '../../../../theme/shared/models/buildingDTO';

@Component({
  selector: 'app-invoice-edit',
  imports: [SharedModule],
  templateUrl: './invoice-edit.component.html',
  styleUrl: './invoice-edit.component.scss'
})
export class InvoiceEditComponent implements OnInit {
  private iconService = inject(IconService);
  private fb = inject(FormBuilder);
  statementId!: number;
  statement!: CommonExpenseStatement;
  selectedApartments: ApartmentDTO[] = [];
  manager: ManagerDTO | null = null;

  selectedBuilding: BuildingDTO | null = null;

  form: FormGroup = this.fb.group({
    code: ['', Validators.required],
    type: ['', Validators.required],
    month: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    discountPercent: [0],
    taxPercent: [0],
    description: [''],
    items: this.fb.array([])
  });

  expenseCategories = [
    { label: 'ΚΟΙΝΟΧΡΗΣΤΑ', value: 'COMMON' },
    { label: 'ΘΕΡΜΑΝΣΗ', value: 'HEATING' },
    { label: 'ΑΣΑΝΣΕΡ', value: 'ELEVATOR' },
    { label: 'ΑΥΤΟΝΟΜΙΑ', value: 'EQUAL' },
    { label: 'BOILER', value: 'EQUAL' },
    { label: 'ΕΙΔΙΚΕΣ ΔΑΠΑΝΕΣ', value: 'EQUAL' },
    { label: 'ΙΔΙΟΚΤΗΤΩΝ', value: 'EQUAL' },
    { label: 'ΔΑΠΑΝΕΣ ΣΕ ΙΣΑ ΜΕΡΗ', value: 'EQUAL' },
    { label: 'ΑΛΛΕΣ ΔΑΠΑΝΕΣ', value: 'EQUAL' }
  ];

  constructor(
    private commonExpenseStatementService: CommonExpenseStatementService,
    private buildingService: BuildingService,
    private apartmentService: ApartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.iconService.addIcon(...[EditOutline, PlusOutline, CloseOutline, DeleteOutline]);
  }

  ngOnInit(): void {
    this.statementId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Edit statement with id:', this.statementId);

    this.commonExpenseStatementService.getStatementById(this.statementId).subscribe({
      next: (data) => {
        this.statement = data;
        this.loadForm(data);

        if (data.buildingId) {
          this.buildingService.getBuilding(data.buildingId).subscribe({
            next: (building) => {
              this.selectedBuilding = building;
              this.buildingService.getBuildingManager(building.id).subscribe({
                next: (mgr) => (this.manager = mgr)
              });
            }
          });

          this.apartmentService.getApartmentsByBuilding(data.buildingId).subscribe({
            next: (allApts) => {
              this.selectedApartments = allApts;  
              console.log('Διαμερίσματα:', this.selectedApartments);
            }
          });
        }
      },
      error: (err) => console.error('Σφάλμα φόρτωσης statement', err)
    });
  }

  loadForm(statement: CommonExpenseStatement) {
    this.form.patchValue({
      code: statement.code,
      type: statement.type,
      month: statement.month,
      startDate: statement.startDate,
      endDate: statement.endDate,
      discountPercent: statement.discountPercent,
      taxPercent: statement.taxPercent,
      description: statement.description
    });

    // καθάρισε και ξαναγέμισε τα items
    this.items.clear();
    statement.items.forEach((item) => {
      this.items.push(
        this.fb.group({
          category: [item.category, Validators.required],
          descriptionItem: [item.descriptionItem, Validators.required],
          price: [item.price, Validators.required]
        })
      );
    });
  }

  onUpdate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία!');
      return;
    }

    const payload = {
      ...this.form.value,
      id: this.statementId,
      subTotal: this.subTotal,
      total: this.total
    };

    this.commonExpenseStatementService.updateStatement(this.statementId, payload).subscribe({
      next: (updated) => {
        alert('Το παραστατικό ενημερώθηκε!');
        console.log('Updated:', updated);
        this.router.navigate(['/invoice/list']);
      },
      error: (err) => {
        console.error('Σφάλμα ενημέρωσης:', err);
        alert('Σφάλμα κατά την ενημέρωση!');
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
  goBack() {
    this.router.navigate(['/invoice/list']);
  }
}
