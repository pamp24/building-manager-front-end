import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';
import { ProfessionalService } from 'src/app/theme/shared/service/professional.service';
import { ProfessionalBusinessDTO } from 'src/app/theme/shared/models/professional.model';

@Component({
  selector: 'app-my-professional-businesses',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './my-professional-businesses.component.html',
  styleUrls: ['./my-professional-businesses.component.scss']
})
export class MyProfessionalBusinessesComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  businesses: ProfessionalBusinessDTO[] = [];

  loading = false;
  error = '';

  readonly backendUrl = `${environment.apiUrl}/api/v1`;

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit(): void {
    this.loadBusinesses();
  }

  loadBusinesses(): void {
    this.loading = true;
    this.error = '';

    this.professionalService.getMyBusinesses().subscribe({
      next: (res) => {
        this.businesses = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = this.uiLocale.text('Failed to load business.');
        this.loading = false;
      }
    });
  }

  getImageUrl(business: ProfessionalBusinessDTO): string {
    if (!business.primaryImageUrl) {
      return 'assets/images/admin/img-course-1.png';
    }

    if (business.primaryImageUrl.startsWith('http')) {
      return business.primaryImageUrl;
    }

    return `${this.backendUrl}${business.primaryImageUrl}`;
  }

  getStatusLabel(business: ProfessionalBusinessDTO): string {
    if (business.verified && business.active) return this.uiLocale.text('Approved');
    if (!business.verified && !business.active) return this.uiLocale.text('Awaiting approval');
    if (business.verified && !business.active) return this.uiLocale.text('Inactive');

    return this.uiLocale.text('Unknown status');
  }

  getStatusClass(business: ProfessionalBusinessDTO): string {
    if (business.verified && business.active) return 'bg-success';
    if (!business.verified && !business.active) return 'bg-warning text-dark';
    if (business.verified && !business.active) return 'bg-secondary';

    return 'bg-light text-dark';
  }
}
