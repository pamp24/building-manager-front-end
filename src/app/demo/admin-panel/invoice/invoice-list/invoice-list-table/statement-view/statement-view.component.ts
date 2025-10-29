import { Component, Input, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonExpenseStatement } from 'src/app/theme/shared/models/commonExpenseStatement';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { UserService } from 'src/app/theme/shared/service';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { OnInit } from '@angular/core';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { ManagerDTO } from '../../../../../../theme/shared/models/managerDTO';

@Component({
  selector: 'app-statement-view',
  templateUrl: './statement-view.component.html',
  styleUrls: ['./statement-view.component.scss'],
  imports: [SharedModule]
})
export class StatementViewComponent implements OnChanges, OnInit {
  @Input() statement!: CommonExpenseStatement;

  selectedBuilding!: BuildingDTO;
  manager?: ManagerDTO;
  apartments: ApartmentDTO[] = [];

  ngOnChanges() {
    console.log('StatementViewComponent statement:', this.statement);
  }

  constructor(
    public activeModal: NgbActiveModal,
    private buildingService: BuildingService,
    private userService: UserService,
    private apartmentService: ApartmentService
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
    const element = document.getElementById('print-section');
    if (!element) {
      console.error('Δεν βρέθηκε το στοιχείο print-section');
      return;
    }

    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      const imgData: string = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`statement_${this.statement?.code ?? 'invoice'}.pdf`);
    });
  }
}
