import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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
        this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία φόρτωσης αιτήσεων.';
      }
    });
  }

  approve(id: number): void {
    this.professionalService.approve(id).subscribe({
      next: () => {
        this.success = 'Η επιχείρηση εγκρίθηκε επιτυχώς.';
        this.pendingBusinesses = this.pendingBusinesses.filter((business) => business.id !== id);
        this.loadStats();
        this.loadBusinesses();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία έγκρισης επιχείρησης.';
      }
    });
  }

  reject(id: number): void {
    const confirmed = confirm('Θέλετε σίγουρα να απορρίψετε αυτή την επιχείρηση;');

    if (!confirmed) {
      return;
    }

    this.professionalService.deactivate(id).subscribe({
      next: () => {
        this.success = 'Η επιχείρηση απορρίφθηκε.';
        this.pendingBusinesses = this.pendingBusinesses.filter((business) => business.id !== id);
        this.loadStats();
        this.loadBusinesses();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία απόρριψης επιχείρησης.';
      }
    });
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'ELECTRICIAN':
        return 'Ηλεκτρολόγος';
      case 'PLUMBER':
        return 'Υδραυλικός';
      case 'ELEVATOR_TECHNICIAN':
        return 'Τεχνικός Ασανσέρ';
      case 'CLEANING_SERVICE':
        return 'Καθαρισμός';
      case 'HEATING_TECHNICIAN':
        return 'Θέρμανση';
      case 'LOCKSMITH':
        return 'Κλειδαράς';
      case 'AIR_CONDITION_TECHNICIAN':
        return 'Κλιματισμός';
      case 'PAINTER':
        return 'Ελαιοχρωματιστής';
      case 'PEST_CONTROL':
        return 'Απεντομώσεις';
      case 'GENERAL_REPAIRS':
        return 'Γενικές Επισκευές';
      case 'OTHER':
        return 'Άλλο';
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
        this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία φόρτωσης επιχειρήσεων.';
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
    if (!confirm('Θέλετε να απενεργοποιήσετε αυτή την επιχείρηση;')) return;

    this.professionalService.deactivate(id).subscribe({
      next: () => {
        this.success = 'Η επιχείρηση απενεργοποιήθηκε.';
        this.loadBusinesses();
        this.loadStats();
        this.loadPending();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία απενεργοποίησης.';
      }
    });
  }

  deleteBusiness(id: number): void {
    if (!confirm('Θέλετε ΟΡΙΣΤΙΚΗ διαγραφή της επιχείρησης;')) return;

    this.professionalService.deleteBusiness(id).subscribe({
      next: () => {
        this.success = 'Η επιχείρηση διαγράφηκε οριστικά.';
        this.loadBusinesses();
        this.loadStats();
        this.loadPending();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία διαγραφής.';
      }
    });
  }

  toggleBusinessActive(business: ProfessionalBusinessDTO): void {
    if (business.active) {
      if (!confirm('Θέλετε να απενεργοποιήσετε αυτή την επιχείρηση;')) return;

      this.professionalService.deactivate(business.id).subscribe({
        next: () => {
          this.success = 'Η επιχείρηση απενεργοποιήθηκε.';
          this.loadBusinesses();
          this.loadStats();
          this.loadPending();
        },
        error: (err) => {
          this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία απενεργοποίησης.';
        }
      });

      return;
    }

    this.professionalService.approve(business.id).subscribe({
      next: () => {
        this.success = 'Η επιχείρηση ενεργοποιήθηκε.';
        this.loadBusinesses();
        this.loadStats();
        this.loadPending();
      },
      error: (err) => {
        this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία ενεργοποίησης.';
      }
    });
  }
}
