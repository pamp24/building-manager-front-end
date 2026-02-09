// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CompanyService } from 'src/app/theme/shared/service/company.service';
import { CompanyDTO } from 'src/app/theme/shared/models/companyDTO';

@Component({
  selector: 'app-company',
  imports: [CommonModule, SharedModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  company?: CompanyDTO;
  loading = true;
  error?: string;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompany();
  }

  loadCompany(): void {
    this.loading = true;
    this.error = undefined;

    this.companyService.getMyCompany().subscribe({
      next: (c) => {
        this.company = c;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;

        if (err?.status === 404) {
          this.error = 'Δεν υπάρχει εταιρία συνδεδεμένη με τον λογαριασμό σας.';
        } else if (err?.status === 401) {
          this.error = 'Δεν είστε συνδεδεμένος.';
        } else {
          this.error = 'Αποτυχία φόρτωσης εταιρίας.';
        }
      }
    });
  }
}
