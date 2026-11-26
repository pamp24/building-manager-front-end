import { TranslateModule } from '@ngx-translate/core';
import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { UserService } from 'src/app/theme/shared/service';

@Component({
  imports: [TranslateModule],

  selector: 'app-invite-accept',
  styleUrls: ['./invite-accept.component.scss'],
  templateUrl: './invite-accept.component.html'
})
export class InviteAcceptComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

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
      this.message = this.uiLocale.text('Invalid invitation.');
      this.loading = false;
      return;
    }

    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      localStorage.setItem('inviteCode', this.inviteCode);
      localStorage.setItem('redirectAfterLogin', `/invite/accept?code=${this.inviteCode}`);
      this.router.navigate(['/login']);
      return;
    }

    this.userService.acceptInvite(this.inviteCode).subscribe({
      next: () => {
        this.message = this.uiLocale.text('Invitation successfully accepted!');
        this.loading = false;
        this.authService.refreshCurrentUserAndReload();
      },
      error: (err) => {
        this.message = err.error?.message || this.uiLocale.text('Error accepting invitation.');
        console.error(err);
        this.loading = false;
      }
    });
  }
}
