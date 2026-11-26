import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, OnInit } from '@angular/core';
// angular import

import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CompanyService } from 'src/app/theme/shared/service/company.service';
import { CompanyDTO } from 'src/app/theme/shared/models/companyDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-company',
  imports: [CommonModule, SharedModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  company?: CompanyDTO;
  companyForm!: FormGroup;
  loading = true;
  error?: string;
  isEditing = false;

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      taxNumber: ['', Validators.required],
      managerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      addressNumber: [''],
      postalCode: [''],
      city: [''],
      region: [''],
      country: ['']
    });

    this.companyForm.disable();
    this.loadCompany();
  }

  hasRole(role: string): boolean {
    return this.authService.currentUserValue?.role === role;
  }

  loadCompany(): void {
    this.loading = true;
    this.error = undefined;

    this.companyService.getMyCompany().subscribe({
      next: (c) => {
        this.company = c;
        this.companyForm.patchValue(c);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 404) this.error = this.uiLocale.text('There is no company associated with your account.');
        else if (err?.status === 401) this.error = this.uiLocale.text('You are not logged in.');
        else this.error = this.uiLocale.text('Failed to load company.');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) this.companyForm.enable();
    else {
      this.companyForm.disable();
      if (this.company) this.companyForm.patchValue(this.company);
    }
  }

  submitChanges(): void {
    if (!this.company || this.companyForm.invalid) return;

    const updated: CompanyDTO = { ...this.company, ...this.companyForm.value };

    this.companyService.updateCompany(updated).subscribe({
      next: (saved) => {
        this.company = saved;
        this.companyForm.patchValue(saved);
        this.toggleEdit();
        alert(this.uiLocale.text('The company has been updated!'));
      },
      error: (err) => {
        console.error(err);
        alert(this.uiLocale.text('Failed to update company.'));
      }
    });
  }
}
