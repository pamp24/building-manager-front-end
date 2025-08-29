import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/theme/shared/service';
import { UserTableDto } from 'src/app/theme/shared/models/userTableDTO';
import { Inject } from '@angular/core';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {
  tables: UserTableDto[] = [];
  emailToInvite = '';
  isSending = false;

  constructor(
    private userService: UserService,
    @Inject(AuthenticationService) private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsersInSameBuilding().subscribe({
      next: (data) => {
        this.tables = data;
      },
      error: (err: unknown) => {
        console.error('Σφάλμα φόρτωσης χρηστών:', err);
      }
    });
  }

  sendInvite(): void {
    if (!this.emailToInvite) {
      alert('Παρακαλώ εισάγετε email.');
      return;
    }

    this.isSending = true;
    this.userService.inviteUserToBuilding(this.emailToInvite).subscribe({
      next: () => {
        alert('Η πρόσκληση στάλθηκε με επιτυχία!');
        this.emailToInvite = '';
        this.isSending = false;
      },
      error: (err: unknown) => {
        console.error('Σφάλμα αποστολής πρόσκλησης:', err);
        alert('Απέτυχε η αποστολή πρόσκλησης.');
        this.isSending = false;
      }
    });
  }

  getTranslatedRole(role: string): string {
    switch (role) {
      case 'Owner':
        return 'Ιδιοκτήτης';
      case 'Resident':
        return 'Ένοικος';
      case 'BuildingManager':
        return 'Διαχειριστής';
      case 'PropertyManager':
        return 'Εταιρία Διαχείρισης';
      default:
        return role;
    }
  }

  getTranslatedStatus(status: string): string {
    switch (status) {
      case 'Joined':
        return 'Μέλος';
      case 'Invited':
        return 'Προσκεκλημένος';
      default:
        return status;
    }
  }
  
  hasRole(role: string): boolean {
    const user = this.authService.currentUserValue;
    return user?.role === role;
  }
}
