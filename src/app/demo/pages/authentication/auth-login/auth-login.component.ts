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

  // public method
  showPassword: boolean = false;



  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl!: string;
  classList!: { toggle: (arg0: string) => void };

  // constructor
  constructor() {
    // redirect to home if already logged in
    this.iconService.addIcon(...[EyeOutline, EyeInvisibleOutline]);
  }

  // life cycle hook
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
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

  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  this.authenticationService.login(email, password).subscribe({
    next: (response: AuthenticationResponse) => {
      console.log('User role from backend:', response.user.role);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      if (response.user.role && response.user.role.includes('Admin')) {
        this.router.navigate(['/dashboard/default']);
      } else {
        this.router.navigate(['/dashboard/default']);
      }
    },
    error: (err) => {
      this.error = 'Λάθος email ή κωδικός';
    }
  });
}

  socialMedia = [
    { name: 'Google', logo: 'google.svg' },
    { name: 'Twitter', logo: 'twitter.svg' },
    { name: 'Facebook', logo: 'facebook.svg' }
  ];
}
