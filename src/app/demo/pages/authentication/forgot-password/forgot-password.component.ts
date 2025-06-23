// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, RouterModule, SharedModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  authenticationService = inject(AuthenticationService);
  emailSent = false;
  email = '';

  constructor(private router: Router) {}

sendResetEmail() {
  this.authenticationService.sendResetPasswordEmail(this.email).subscribe({
    next: () => {
      console.log('Email αποστάλθηκε επιτυχώς');
      this.emailSent = true;
      this.router.navigate(['/auth/check-email']); 
    },
    error: (err) => {
      console.error('Σφάλμα κατά την αποστολή:', err);
    }
  });
}

}
