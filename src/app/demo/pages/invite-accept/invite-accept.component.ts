import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/theme/shared/service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

@Component({
  selector: 'app-invite-accept',
  styleUrls: ['./invite-accept.component.scss'],
  templateUrl: './invite-accept.component.html'
})
export class InviteAcceptComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private userService = inject(UserService);

  inviteCode: string | null = null;
  loading = true;
  message = '';

  ngOnInit(): void {
    this.inviteCode = this.route.snapshot.queryParamMap.get('code');

    if (!this.inviteCode) {
      this.message = 'Μη έγκυρη πρόσκληση.';
      this.loading = false;
      return;
    }

    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      // Αν δεν είναι logged in -> σώσε τον κωδικό και πήγαινε login
      localStorage.setItem('inviteCode', this.inviteCode);
      localStorage.setItem('redirectAfterLogin', `/invite/accept?code=${this.inviteCode}`);
      this.router.navigate(['/login']);
      return;
    }

    // Αν είναι logged in -> κάλεσε acceptInvite
    this.userService.acceptInvite(this.inviteCode).subscribe({
      next: () => {
        this.message = 'Η πρόσκληση έγινε αποδεκτή με επιτυχία!';
        this.loading = false;
        this.router.navigate(['/dashboard/default']);
      },
      error: (err) => {
        this.message = err.error?.message || 'Σφάλμα κατά την αποδοχή της πρόσκλησης.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
