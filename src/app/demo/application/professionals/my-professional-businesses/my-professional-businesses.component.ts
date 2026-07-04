import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';
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
  businesses: ProfessionalBusinessDTO[] = [];

  loading = false;
  error = '';

  readonly backendUrl = 'http://localhost:8080/api/v1';

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
        this.error = 'Αποτυχία φόρτωσης επιχειρήσεων.';
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
    if (business.verified && business.active) return 'Εγκεκριμένη';
    if (!business.verified && !business.active) return 'Σε αναμονή έγκρισης';
    if (business.verified && !business.active) return 'Ανενεργή';

    return 'Άγνωστη κατάσταση';
  }

  getStatusClass(business: ProfessionalBusinessDTO): string {
    if (business.verified && business.active) return 'bg-success';
    if (!business.verified && !business.active) return 'bg-warning text-dark';
    if (business.verified && !business.active) return 'bg-secondary';

    return 'bg-light text-dark';
  }
}
