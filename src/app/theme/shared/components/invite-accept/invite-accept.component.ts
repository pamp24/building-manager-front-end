import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserService } from '../../service';


@Component({
  selector: 'app-invite-accept',
  imports: [],
  templateUrl: './invite-accept.component.html',
  styleUrls: ['./invite-accept.component.scss']
})
export class InviteAcceptComponent implements OnInit {
  email: string = '';
  apartmentId: number = 0;
  role: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.apartmentId = Number(this.route.snapshot.queryParamMap.get('apartmentId'));
    this.role = this.route.snapshot.queryParamMap.get('role') || '';

    if (!this.email || !this.apartmentId || !this.role) {
      alert('Μη έγκυρη πρόσκληση.');
      this.router.navigate(['/']);
      return;
    }

    if (this.authService.isLoggedIn()) {
      // assign user directly
      this.userService.acceptInvite(this.email, this.apartmentId, this.role).subscribe({
        next: () => {
          alert('Η πρόσκληση έγινε αποδεκτή με επιτυχία!');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          alert('Σφάλμα αποδοχής πρόσκλησης.');
        }
      });
    } else {
      // αποθήκευση σε τοπικό storage για χρήση κατά την εγγραφή
      localStorage.setItem('inviteEmail', this.email);
      localStorage.setItem('inviteApartmentId', String(this.apartmentId));
      localStorage.setItem('inviteRole', this.role);
      this.router.navigate(['/register']);  // ή η route εγγραφής σου
    }
  }
}
