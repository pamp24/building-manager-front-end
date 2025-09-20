import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/theme/shared/service';
import { inject } from '@angular/core';
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

    // Έλεγχος: αν ο χρήστης είναι ήδη συνδεδεμένος
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      // Αν δεν είναι logged in -> σώσε τον κωδικό και στείλε login
      localStorage.setItem('inviteCode', this.inviteCode);
      this.router.navigate(['/login']);
      return;
    }

    // Αν είναι logged in -> κάλεσε acceptInvite
    this.userService.acceptInvite(this.inviteCode).subscribe({
      next: () => {
        this.message = 'Η πρόσκληση έγινε αποδεκτή με επιτυχία!';
        this.loading = false;
        // Προώθηση στο dashboard
        this.router.navigate(['/dashboard/default']);
      },
      error: (err) => {
        this.message = 'Σφάλμα κατά την αποδοχή της πρόσκλησης.';
        console.error(err);
        this.loading = false;
        this.router.navigate(['/dashboard/default']);
      }
    });
  }
}

