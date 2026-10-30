import { Component, Input, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonExpenseItem, CommonExpenseStatement } from 'src/app/theme/shared/models/commonExpenseStatement';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { OnInit } from '@angular/core';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { ManagerDTO } from 'src/app/theme/shared/models/managerDTO';
import { CommonExpenseStatementService } from 'src/app/theme/shared/service/commonExpensesStatement.service';

type StatementCategoryKey = 'COMMON' | 'HEATING' | 'ELEVATOR' | 'EQUAL' | 'BOILER' | 'SPECIAL' | 'OWNERS' | 'OTHER';

interface StatementCategorySection {
  key: StatementCategoryKey;
  label: string;
  items: CommonExpenseItem[];
  total: number;
  emptyRows: number[];
}

interface ApartmentStatementRow {
  apartmentId: number;
  displayIndex: number;
  displayName: string;
  apartmentLabel: string;
  commonPercent: number;
  elevatorPercent: number;
  heatingPercent: number;
  categoryAmounts: Record<StatementCategoryKey, number>;
  total: number;
}

@Component({
  selector: 'app-statement-view',
  templateUrl: './statement-view.component.html',
  styleUrls: ['./statement-view.component.scss'],
  imports: [SharedModule]
})
export class StatementViewComponent implements OnChanges, OnInit {
  @Input() statement!: CommonExpenseStatement;

  selectedBuilding?: BuildingDTO;
  manager?: ManagerDTO;
  apartments: ApartmentDTO[] = [];

  readonly greekMonths = [
    'Ιανουάριος',
    'Φεβρουάριος',
    'Μάρτιος',
    'Απρίλιος',
    'Μάιος',
    'Ιούνιος',
    'Ιούλιος',
    'Αύγουστος',
    'Σεπτέμβριος',
    'Οκτώβριος',
    'Νοέμβριος',
    'Δεκέμβριος'
  ];

  readonly summaryCategoryOrder: StatementCategoryKey[] = ['COMMON', 'HEATING', 'ELEVATOR', 'EQUAL', 'BOILER', 'SPECIAL', 'OWNERS', 'OTHER'];
  readonly apartmentAmountCategories: StatementCategoryKey[] = ['COMMON', 'ELEVATOR', 'HEATING', 'EQUAL', 'BOILER', 'SPECIAL', 'OWNERS', 'OTHER'];

  ngOnChanges() {
    console.log('StatementViewComponent statement:', this.statement);
  }

  constructor(
    public activeModal: NgbActiveModal,
    private buildingService: BuildingService,
    private apartmentService: ApartmentService,
    private commonExpenseStatementService: CommonExpenseStatementService
  ) {}

  ngOnInit() {
    if (!this.statement) return;

    // Από -> Φόρτωσε το κτίριο + manager
    if (this.statement.buildingId) {
      this.buildingService.getBuilding(this.statement.buildingId).subscribe((b: BuildingDTO) => {
        this.selectedBuilding = b;
        this.manager = b.manager; // έρχεται από backend
      });
    }

    // Προς -> Όλα τα διαμερίσματα της πολυκατοικίας
    if (this.statement.buildingId) {
      this.apartmentService.getApartmentsByBuilding(this.statement.buildingId).subscribe((a: ApartmentDTO[]) => {
        this.apartments = a;
      });
    }
  }

  close() {
    this.activeModal.dismiss();
  }

  printStatement(): void {
    const element = document.getElementById('print-section');
    if (!element) {
      console.error('Δεν βρέθηκε το στοιχείο print-section');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1400,height=900');
    if (!printWindow) {
      console.error('Δεν άνοιξε το παράθυρο εκτύπωσης');
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join('');

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>statement_${this.statement?.code ?? 'invoice'}</title>
          ${styles}
        </head>
        <body>
          <div class="print-host">${element.outerHTML}</div>
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }

  get statusBadgeClass(): string {
    const status = this.statement?.status?.toUpperCase();
    switch (status) {
      case 'PAID':
        return 'badge bg-success';
      case 'ISSUED':
        return 'badge bg-warning text-dark';
      case 'EXPIRED':
        return 'badge bg-danger';
      case 'CLOSED':
        return 'badge bg-dark';
      case 'DRAFT':
        return 'badge bg-secondary';
      default:
        return 'badge bg-light text-dark';
    }
  }

  translateStatus(status: string | undefined, isPaid?: boolean): string {
    if (isPaid) return 'Πληρώθηκε';
    switch (status) {
      case 'PAID':
        return 'Πληρώθηκε';
      case 'ISSUED':
        return 'Εκκρεμεί';
      case 'EXPIRED':
        return 'Έληξε';
      case 'CLOSED':
        return 'Ακυρώθηκε';
      case 'DRAFT':
        return 'Πρόχειρο';
      default:
        return status ?? '';
    }
  }

  downloadPDF(): void {
    if (!this.statement?.id) {
      console.error('Δεν βρέθηκε id statement για λήψη PDF');
      return;
    }

    this.commonExpenseStatementService.downloadStatementPdf(this.statement.id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `statement_${this.statement?.code ?? 'invoice'}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    });
  }

  categoryLabelMap: Record<string, string> = {
    COMMON: 'ΚΟΙΝΟΧΡΗΣΤΑ',
    HEATING: 'ΘΕΡΜΑΝΣΗ',
    ELEVATOR: 'ΑΣΑΝΣΕΡ',
    EQUAL: 'ΔΑΠΑΝΕΣ ΣΕ ΙΣΑ ΜΕΡΗ',
    BOILER: 'BOILER',
    SPECIAL: 'ΕΙΔΙΚΕΣ ΔΑΠΑΝΕΣ',
    OWNERS: 'ΙΔΙΟΚΤΗΤΩΝ',
    OTHER: 'ΛΟΙΠΕΣ ΔΑΠΑΝΕΣ'
  };

  translateCategory(category: string | undefined): string {
    if (!category) return '—';
    return this.categoryLabelMap[category] ?? category;
  }

  get categorySections(): StatementCategorySection[] {
    const items = this.statement?.items ?? [];
    return this.summaryCategoryOrder
      .map((key) => {
        const sectionItems = items.filter((item) => item.category === key);
        return {
          key,
          label: this.categoryLabelMap[key],
          items: sectionItems,
          total: sectionItems.reduce((sum, item) => sum + this.getItemAmount(item), 0),
          emptyRows: Array.from({ length: Math.max(1, 4 - sectionItems.length) }, (_, index) => index)
        };
      });
  }

  get apartmentRows(): ApartmentStatementRow[] {
    const allocations = this.statement?.allocations ?? [];
    const itemCategoryMap = new Map<string, StatementCategoryKey>();

    for (const item of this.statement?.items ?? []) {
      if (item.descriptionItem && item.category) {
        itemCategoryMap.set(item.descriptionItem, item.category as StatementCategoryKey);
      }
    }

    return this.apartments.map((apartment, index) => {
      const categoryAmounts: Record<StatementCategoryKey, number> = {
        COMMON: 0,
        HEATING: 0,
        ELEVATOR: 0,
        EQUAL: 0,
        BOILER: 0,
        SPECIAL: 0,
        OWNERS: 0,
        OTHER: 0
      };

      for (const allocation of allocations) {
        if (allocation.apartmentId !== apartment.id) continue;
        const category = itemCategoryMap.get(allocation.itemDescription ?? '') ?? 'OTHER';
        categoryAmounts[category] += Number(allocation.amount ?? 0);
      }

      const total = this.apartmentAmountCategories.reduce((sum, key) => sum + categoryAmounts[key], 0);

      return {
        apartmentId: apartment.id,
        displayIndex: index + 1,
        displayName: apartment.residentFullName || apartment.ownerFullName || `${apartment.ownerLastName ?? ''} ${apartment.ownerFirstName ?? ''}`.trim() || '—',
        apartmentLabel: apartment.fullApartmentName || `${apartment.floor ?? ''}${apartment.number ?? ''}`,
        commonPercent: Number(apartment.commonPercent ?? 0),
        elevatorPercent: Number(apartment.elevatorPercent ?? 0),
        heatingPercent: Number(apartment.heatingPercent ?? 0),
        categoryAmounts,
        total
      };
    });
  }

  get issuerName(): string {
    return this.selectedBuilding?.company?.companyName || this.selectedBuilding?.managerFullName || this.selectedBuilding?.name || '';
  }

  get issuerAddressLine(): string {
    if (this.selectedBuilding?.company) {
      return `${this.selectedBuilding.company.address} ${this.selectedBuilding.company.addressNumber}`.trim();
    }
    return `${this.selectedBuilding?.street1 ?? ''} ${this.selectedBuilding?.stNumber1 ?? ''}`.trim();
  }

  get issuerCityLine(): string {
    if (this.selectedBuilding?.company) {
      return `${this.selectedBuilding.company.city} ${this.selectedBuilding.company.postalCode}`.trim();
    }
    return `${this.selectedBuilding?.city ?? ''} ${this.selectedBuilding?.postalCode ?? ''}`.trim();
  }

  get issuerPhone(): string {
    return this.selectedBuilding?.company?.phone || this.selectedBuilding?.managerPhone || '';
  }

  get buildingAddress(): string {
    return [
      `${this.selectedBuilding?.street1 ?? ''} ${this.selectedBuilding?.stNumber1 ?? ''}`.trim(),
      `${this.selectedBuilding?.street2 ?? ''} ${this.selectedBuilding?.stNumber2 ?? ''}`.trim()
    ]
      .filter(Boolean)
      .join(', ');
  }

  formatMonth(month: string | undefined): string {
    if (!month) return '—';
    const [year, monthPart] = month.split('-');
    const monthIndex = Number(monthPart) - 1;
    if (!year || monthIndex < 0 || monthIndex > 11) return month;
    return `${this.greekMonths[monthIndex]} ${year}`;
  }

  getItemAmount(item: CommonExpenseItem): number {
    return Number(item.amount ?? item.price ?? 0);
  }

  getApartmentCategoryAmount(row: ApartmentStatementRow, category: StatementCategoryKey): number {
    return row.categoryAmounts[category] ?? 0;
  }

  getCategoryGrandTotal(category: StatementCategoryKey): number {
    return this.apartmentRows.reduce((sum, row) => sum + this.getApartmentCategoryAmount(row, category), 0);
  }

  get commonPercentTotal(): number {
    return this.apartmentRows.reduce((sum, row) => sum + row.commonPercent, 0);
  }

  get elevatorPercentTotal(): number {
    return this.apartmentRows.reduce((sum, row) => sum + row.elevatorPercent, 0);
  }

  get heatingPercentTotal(): number {
    return this.apartmentRows.reduce((sum, row) => sum + row.heatingPercent, 0);
  }

  displayAmount(value: number | undefined | null): string {
    const amount = Number(value ?? 0);
    if (!amount) return '';
    return amount.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  displayPercent(value: number | undefined | null): string {
    const amount = Number(value ?? 0);
    if (!amount) return '';
    return amount.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
