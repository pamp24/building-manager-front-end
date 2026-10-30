import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonExpenseStatement } from 'src/app/theme/shared/models/commonExpenseStatement';
import { CommonExpenseStatementService } from 'src/app/theme/shared/service/commonExpensesStatement.service';

@Component({
  selector: 'app-statement-apartment-view',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './statement-apartment-view.component.html',
  styleUrl: './statement-apartment-view.component.scss'
})
export class StatementApartmentViewComponent implements OnInit, OnDestroy {
  @Input() statement!: CommonExpenseStatement;
  @Input() apartmentId!: number;

  pdfUrl: SafeResourceUrl | null = null;
  private objectUrl: string | null = null;
  loading = true;

  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer,
    private commonExpenseStatementService: CommonExpenseStatementService
  ) {}

  ngOnInit(): void {
    if (!this.statement?.id || !this.apartmentId) {
      this.loading = false;
      return;
    }

    this.commonExpenseStatementService.downloadApartmentStatementPdf(this.statement.id, this.apartmentId).subscribe({
      next: (blob) => {
        this.objectUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `${this.objectUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης PDF διαμερίσματος:', err);
        this.loading = false;
      }
    });
  }

  download(): void {
    if (!this.statement?.id || !this.apartmentId) return;
    this.commonExpenseStatementService.downloadApartmentStatementPdf(this.statement.id, this.apartmentId).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `statement_${this.statement?.code ?? 'invoice'}_apartment_${this.apartmentId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    });
  }

  print(): void {
    if (!this.objectUrl) return;
    const printWindow = window.open(`${this.objectUrl}#toolbar=0&navpanes=0&scrollbar=0`, '_blank');
    if (!printWindow) return;

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }
}
