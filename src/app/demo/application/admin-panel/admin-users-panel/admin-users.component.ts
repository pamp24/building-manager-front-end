/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IconService } from '@ant-design/icons-angular';
import { UserSwitchOutline, StopOutline, CheckCircleOutline, TeamOutline } from '@ant-design/icons-angular/icons';

import { AdminUserDTO } from 'src/app/theme/shared/models/adminUserDTO';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private iconService = inject(IconService);

  users: AdminUserDTO[] = [];
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  loading = true;
  error?: string;
  updatingId?: number;

  constructor(private userService: UserService) {
    this.iconService.addIcon(...[UserSwitchOutline, StopOutline, CheckCircleOutline, TeamOutline]);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Αποτυχία φόρτωσης χρηστών.';
      }
    });
  }

  get filteredUsers(): AdminUserDTO[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.users.filter((user) => {
      const matchesSearch =
        !search ||
        [user.fullName, user.firstName, user.lastName, user.email, user.role]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(search));

      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus =
        !this.selectedStatus ||
        (this.selectedStatus === 'enabled' && user.enabled) ||
        (this.selectedStatus === 'disabled' && !user.enabled);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  get availableRoles(): string[] {
    return [...new Set(this.users.map((user) => user.role).filter((role): role is string => !!role))].sort((a, b) =>
      a.localeCompare(b)
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
  }

  toggleEnabled(user: AdminUserDTO): void {
    const newValue = !user.enabled;

    if (newValue) {
      const confirmed = confirm(`Θέλετε να ενεργοποιήσετε τον χρήστη "${user.fullName}";`);
      if (!confirmed) {
        return;
      }
    } else {
      const confirmed = confirm(`Θέλετε να απενεργοποιήσετε τον χρήστη "${user.fullName}";`);
      if (!confirmed) {
        return;
      }
    }

    this.updatingId = user.id;
    this.userService.setUserEnabled(user.id, newValue).subscribe({
      next: (updated) => {
        this.updatingId = undefined;
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updated;
        }
      },
      error: (err) => {
        this.updatingId = undefined;
        console.error(err);
        this.error = err?.error?.message || 'Αποτυχία ενημέρωσης χρήστη.';
      }
    });
  }

  trackById = (_: number, user: AdminUserDTO) => user.id;

  imgSrc(url?: string | null): string {
    if (!url) return 'assets/images/user/avatar-1.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) return `${environment.apiUrl}${url}`;
    return url;
  }
}
