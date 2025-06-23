// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
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
      alert('Οι κωδικοί δεν ταιριάζουν!');
      return;
    }
    if (!this.token) {
      alert('Λείπει το token επαναφοράς.');
      return;
    }
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        alert('Ο κωδικός επαναφέρθηκε επιτυχώς!');
        this.router.navigate(['/auth/login']); // 🔁 redirect to login
      },
      error: (err) => {
        console.error('Σφάλμα:', err); // DEBUG
        alert('Σφάλμα στην επαναφορά κωδικού:\n' + (err.error?.message || err.message || JSON.stringify(err)));
      }
    });
  }
}
