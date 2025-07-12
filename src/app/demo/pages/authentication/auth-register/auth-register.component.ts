// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { RegistrationRequest } from '../../../../theme/shared/models/registration-request';

@Component({
  selector: 'app-auth-register',
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss']
})
export class AuthRegisterComponent {
  registerRequest: RegistrationRequest = { email: '', firstName: '', lastName: '', password: '' };
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg = [];
    this.authService.register(this.registerRequest).subscribe({
      next: () => {
        this.router.navigate(['code-verify']);
      },
      error: (err) => {
        console.error('ERROR', err);
        if (err?.error?.validationErrors && Array.isArray(err.error.validationErrors)) {
          this.errorMsg = err.error.validationErrors;
        } else if (err?.error?.message) {
          this.errorMsg = [err.error.message];
        } else if (typeof err?.error === 'string') {
          this.errorMsg = [err.error];
        } else {
          this.errorMsg = ['Κάτι πήγε στραβά. Προσπαθήστε ξανά.'];
        }
      }
    });
  }
}
