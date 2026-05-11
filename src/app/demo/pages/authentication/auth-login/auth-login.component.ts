/* eslint-disable @typescript-eslint/no-explicit-any */
// Angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// project import

import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

// rxjs import
import { IconService } from '@ant-design/icons-angular';
import { EyeInvisibleOutline, EyeOutline } from '@ant-design/icons-angular/icons';
import { AuthenticationResponse } from '../../../../theme/shared/models/authentication-response.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-auth-login',
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authenticationService = inject(AuthenticationService);
  private iconService = inject(IconService);
  private errorMsg: string[] = [];
  // public method
  showPassword: boolean = false;
  rememberMe = true;
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl!: string;
  classList!: { toggle: (arg0: string) => void };

  // constructor
  constructor(private userService: UserService) {
    this.iconService.addIcon(...[EyeOutline, EyeInvisibleOutline]);
  }

  // life cycle hook
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [true]
    });

    if (window.location.pathname !== '/auth/login') {
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/dashboard/default']);
      }
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  // public method
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const password = document.querySelector('#password');
    const type = password?.getAttribute('type') === 'password' ? 'text' : 'password';
    password?.setAttribute('type', type);
  }

  // convenience getter for easy access to form fields
  get formValues() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.errorMsg = [];

    if (this.loginForm.invalid) {
      this.error = 'Παρακαλώ συμπληρώστε email και κωδικό πρόσβασης.';
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;
    this.loading = true;

    this.authenticationService.login(email, password, rememberMe).subscribe({
      next: (response: AuthenticationResponse) => {
        this.loading = false;

        localStorage.setItem('currentUser', JSON.stringify(response.user));

        const inviteCode = localStorage.getItem('inviteCode');

        if (inviteCode) {
          this.userService.acceptInvite(inviteCode).subscribe({
            next: () => {
              localStorage.removeItem('inviteCode');
              this.router.navigate(['/dashboard/default']);
            },
            error: () => {
              localStorage.removeItem('inviteCode');
              this.router.navigate(['/dashboard/default']);
            }
          });
        } else {
          this.router.navigate(['/dashboard/default']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = this.getLoginErrorMessage(err);
      }
    });
  }

  private getLoginErrorMessage(err: any): string {
    if (typeof err === 'string') {
      try {
        const parsed = JSON.parse(err);
        return parsed.businessErrorDescription || parsed.error || 'Παρουσιάστηκε σφάλμα κατά τη σύνδεση.';
      } catch {
        return err;
      }
    }

    return err?.businessErrorDescription || err?.error || err?.message || 'Παρουσιάστηκε σφάλμα κατά τη σύνδεση. Παρακαλώ δοκιμάστε ξανά.';
  }

  socialMedia = [
    { name: 'Google', logo: 'google.svg' },
    { name: 'Twitter', logo: 'twitter.svg' },
    { name: 'Facebook', logo: 'facebook.svg' }
  ];
}
