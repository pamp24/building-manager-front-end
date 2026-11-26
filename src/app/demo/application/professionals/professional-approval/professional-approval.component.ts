import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProfessionalAdminStatsDTO, ProfessionalBusinessDTO } from 'src/app/theme/shared/models/professional.model';
import { ProfessionalService } from 'src/app/theme/shared/service/professional.service';

@Component({
  selector: 'app-professional-approval',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './professional-approval.component.html',
  styleUrls: ['./professional-approval.component.scss']
})
export class ProfessionalApprovalComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  pendingBusinesses: ProfessionalBusinessDTO[] = [];

  loading = false;
  error = '';
  success = '';

  totalPending = 0;
  totalApproved = 0;
  totalInactive = 0;
  totalBusinesses = 0;

  stats?: ProfessionalAdminStatsDTO;

  businesses: ProfessionalBusinessDTO[] = [];

  currentPage = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 15];

  totalPages = 0;
  totalElements = 0;

  businessesLoading = false;

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadPending();
    this.loadBusinesses();
  }

  loadStats(): void {
    this.professionalService.getAdminStats().subscribe({
      next: (res) => {
        this.stats = res;
      }
    });
  }

  loadPending(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.professionalService.getPendingApproval().subscribe({
      next: (res) => {
        this.pendingBusinesses = res ?? [];
        this.totalPending = this.pendingBusinesses.length;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.businessErrorDescription || err?.error || err?.message || this.uiLocale.text('Failed to load applications.');
      }
    });
  }

  approve(id: number): void {
    this.professionalService.approve(id).subscribe({
      next: () => {
        this.success = this.uiLocale.text('The operation was successfully approved.');
        this.pendingBusinesses = this.pendingBusinesses.filter((business) => business.id !== id);
        this.loadStats();
        this.loadBusinesses();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || this.uiLocale.text('Failed to approve business.');
      }
    });
  }

  reject(id: number): void {
    const confirmed = confirm(this.uiLocale.text('Are you sure you want to reject this business?'));

    if (!confirmed) {
      return;
    }

    this.professionalService.deactivate(id).subscribe({
      next: () => {
        this.success = this.uiLocale.text('The operation was rejected.');
        this.pendingBusinesses = this.pendingBusinesses.filter((business) => business.id !== id);
        this.loadStats();
        this.loadBusinesses();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || this.uiLocale.text('Business rejection failed.');
      }
    });
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'ELECTRICIAN':
        return this.uiLocale.text('Electrician');
      case 'PLUMBER':
        return this.uiLocale.text('Plumber');
      case 'ELEVATOR_TECHNICIAN':
        return this.uiLocale.text('Elevator technician');
      case 'CLEANING_SERVICE':
        return this.uiLocale.text('Cleaning');
      case 'HEATING_TECHNICIAN':
        return this.uiLocale.text('Heating');
      case 'LOCKSMITH':
        return this.uiLocale.text('Locker');
      case 'AIR_CONDITION_TECHNICIAN':
        return this.uiLocale.text('Air conditioning');
      case 'PAINTER':
        return this.uiLocale.text('Oil painter');
      case 'PEST_CONTROL':
        return this.uiLocale.text('Exterminations');
      case 'GENERAL_REPAIRS':
        return this.uiLocale.text('General Repairs');
      case 'OTHER':
        return this.uiLocale.text('Other');
      default:
        return category;
    }
  }

  loadBusinesses(): void {
    this.businessesLoading = true;

    this.professionalService.getAdminBusinesses(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.businesses = res.content ?? [];
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.businessesLoading = false;
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || this.uiLocale.text('Failed to load business.');
        this.businessesLoading = false;
      }
    });
  }

  changePageSize(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 0;
    this.loadBusinesses();
  }

  previousPage(): void {
    if (this.currentPage === 0) return;

    this.currentPage--;
    this.loadBusinesses();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages - 1) return;

    this.currentPage++;
    this.loadBusinesses();
  }

  deactivateBusiness(id: number): void {
    if (!confirm(this.uiLocale.text('Do you want to disable this business?'))) return;

    this.professionalService.deactivate(id).subscribe({
      next: () => {
        this.success = this.uiLocale.text('The operation was shut down.');
        this.loadBusinesses();
        this.loadStats();
        this.loadPending();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || this.uiLocale.text('Failed to disable.');
      }
    });
  }

  deleteBusiness(id: number): void {
    if (!confirm(this.uiLocale.text('Do you want to FINALLY delete the business?'))) return;

    this.professionalService.deleteBusiness(id).subscribe({
      next: () => {
        this.success = this.uiLocale.text('The operation was permanently deleted.');
        this.loadBusinesses();
        this.loadStats();
        this.loadPending();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || this.uiLocale.text('Delete failed.');
      }
    });
  }

  toggleBusinessActive(business: ProfessionalBusinessDTO): void {
    if (business.active) {
      if (!confirm(this.uiLocale.text('Do you want to disable this business?'))) return;

      this.professionalService.deactivate(business.id).subscribe({
        next: () => {
          this.success = this.uiLocale.text('The operation was shut down.');
          this.loadBusinesses();
          this.loadStats();
          this.loadPending();
        },
        error: (err) => {
          this.error = err?.businessErrorDescription || err?.error || err?.message || this.uiLocale.text('Failed to disable.');
        }
      });

      return;
    }

    this.professionalService.approve(business.id).subscribe({
      next: () => {
        this.success = this.uiLocale.text('The operation was activated.');
        this.loadBusinesses();
        this.loadStats();
        this.loadPending();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || this.uiLocale.text('Activation failed.');
      }
    });
  }
}
