import { TranslateModule } from '@ngx-translate/core';
import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, OnInit } from '@angular/core';
// angular import

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

@Component({
  selector: 'app-reset-password',
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  token: string | null = null;
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  resetPassword() {
    if (this.password !== this.confirmPassword) {
      alert(this.uiLocale.text("The codes don't match!"));
      return;
    }
    if (!this.token) {
      alert(this.uiLocale.text('The reset token is missing.'));
      return;
    }
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        alert(this.uiLocale.text('Password successfully reset!'));
        this.router.navigate(['/auth/login']); // 🔁 redirect to login
      },
      error: (err) => {
        console.error('Σφάλμα:', err); // DEBUG
        alert(this.uiLocale.text('Password reset error:') + (err.error?.message || err.message || JSON.stringify(err)));
      }
    });
  }
}
