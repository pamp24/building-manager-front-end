import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component } from '@angular/core';
// angular import

import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { Router } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-code-verify',
  imports: [CommonModule, SharedModule, CodeInputModule],
  templateUrl: './code-verify.component.html',
  styleUrls: ['./code-verify.component.scss']
})
export class CodeVerifyComponent {
  private readonly uiLocale = inject(UiLocaleService);

  message = '';
  isOkay = false;
  submitted = false;
  code: string = ''; // <-- αποθηκεύουμε τον κωδικό

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  private confirmAccount(token: string) {
    this.submitted = true;
    this.authService.confirm(token).subscribe({
      next: () => {
        this.isOkay = true;
        this.message = this.uiLocale.text('Your account has been successfully activated. Now you can proceed to the entrance.');
      },
      error: () => {
        this.isOkay = false;
        this.message = this.uiLocale.text('The token has expired or is invalid');
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  onCodeCompleted(token: string) {
    this.code = token;
  }

  onSubmit() {
    if (this.code && this.code.length === 6) {
      this.isOkay = true;
      this.confirmAccount(this.code);
    } else {
      this.message = this.uiLocale.text('Please enter a valid code.');
      this.submitted = true;
      this.isOkay = false;
    }
  }
}
