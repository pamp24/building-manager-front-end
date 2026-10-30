import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PublicFooterComponent } from '../public-info/public-footer.component';
import { PublicHeaderComponent } from '../public-info/public-header.component';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule, RouterLink, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  private http = inject(HttpClient);
  readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(100)] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(100)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(254), Validators.pattern(/^[^\s@,;<>"()\[\]]+@[^\s@,;<>"()\[\]]+$/)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(40), Validators.pattern(/[^\r\n]*/)] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/[\s\S]*\S[\s\S]*/), Validators.maxLength(5000)] }),
    privacyAccepted: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] })
  });
  loading = false;
  success = false;
  error = false;

  submit() {
    if (this.loading || this.success) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.loading = true;
    this.error = false;
    this.http.post(`${environment.apiUrl}/api/v1/contact`, {
      firstName: value.firstName.trim(), lastName: value.lastName.trim(), email: value.email.trim(),
      phone: value.phone.trim(), message: value.message.trim(), privacyAccepted: value.privacyAccepted
    }, { observe: 'response' }).pipe(finalize(() => this.loading = false)).subscribe({
      next: response => { this.success = response.status === 204; this.error = !this.success; },
      error: () => this.error = true
    });
  }

  reset() {
    this.form.reset();
    this.success = false;
    this.error = false;
  }
}
