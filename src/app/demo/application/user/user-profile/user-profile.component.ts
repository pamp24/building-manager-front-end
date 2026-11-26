import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataService } from 'src/app/demo/forms/forms-plugins/forms-select/data.service';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
// rxjs import
import { Observable } from 'rxjs';
// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
// bootstrap import
import { NgSelectModule } from '@ng-select/ng-select';
// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CreditCardOutline,
  DeleteOutline,
  FacebookFill,
  FileDoneOutline,
  LineOutline,
  LinkedinFill,
  LockOutline,
  MailOutline,
  MoreOutline,
  SettingOutline,
  TranslationOutline,
  TwitterSquareFill,
  UserOutline,
  PlusOutline
} from '@ant-design/icons-angular/icons';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { UserService } from 'src/app/theme/shared/service';
import { User } from 'src/app/theme/shared/components/_helpers/user';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

//UserUpdateDTO
import { UserUpdateDTO } from 'src/app/theme/shared/models/UserUpdateDTO';
import { MantisConfig } from 'src/app/app-config';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, SharedModule, NgSelectModule, NgApexchartsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  apiBase = environment.apiUrl + '/api/v1';
  private dataService = inject(DataService);
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);
  userForm!: FormGroup;
  user!: User;

  isEditing = false;
  private initialFormValue: any;

  private calculateProfileCompletion(): number {
    const totalFields = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'phoneNumber',
      'profileImageUrl',
      'address1',
      'addressNumber1',
      'country',
      'state',
      'city',
      'postalCode'
    ];
    const filledCount = totalFields.filter((field) => !!this.userForm.get(field)?.value).length;
    const percentage = Math.round((filledCount / totalFields.length) * 100);
    return percentage;
  }

  people$: Observable<any[]> | undefined;
  selectedPeople = [{ name: this.uiLocale.text('Karyn Wright') }];
  isDarkMode!: boolean;
  chartOptions!: Partial<ApexOptions>;
  currentUser$!: Observable<unknown>;

  // constructor
  constructor(
    public authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.iconService.addIcon(
      ...[
        TwitterSquareFill,
        FacebookFill,
        LinkedinFill,
        UserOutline,
        CreditCardOutline,
        LockOutline,
        SettingOutline,
        LineOutline,
        DeleteOutline,
        FileDoneOutline,
        TranslationOutline,
        MailOutline,
        MoreOutline,
        PlusOutline
      ]
    );
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // life cycle event
  ngOnInit() {
    setTimeout(() => {
      this.useLanguage(MantisConfig.i18n);
    }, 0);
    this.chartOptions = {
      series: [30],
      chart: {
        height: 150,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '60%',
            background: 'transparent',
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front'
          },
          track: {
            background: '#ffffff50',
            strokeWidth: '50%'
          },
          dataLabels: {
            show: true,
            name: {
              show: false
            },
            value: {
              offsetY: 7,
              color: '#153364',
              fontSize: '20px',
              fontWeight: '700',
              show: true
            }
          }
        }
      },
      colors: ['#1677ff'],
      fill: {
        type: 'solid'
      },
      stroke: {
        lineCap: 'round'
      }
    };

    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      dateOfBirth: [''],
      phoneNumber: [''],
      profileImageUrl: [''],
      address1: [''],
      addressNumber1: [''],
      address2: [''],
      addressNumber2: [''],
      country: [''],
      state: [''],
      city: [''],
      region: [''],
      postalCode: ['']
    });

    this.setFormEditing(false);

    this.userForm.valueChanges.subscribe(() => {
      const completion = this.calculateProfileCompletion();
      this.updateChart(completion);
    });

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;

        this.userForm.patchValue(user, { emitEvent: false });

        this.initialFormValue = this.userForm.getRawValue();

        const completion = this.calculateProfileCompletion();
        this.updateChart(completion);

        this.setFormEditing(false);
      },
      error: (err) => console.error('Δεν κατάφερε να φορτωθεί ο χρήστης', err)
    });
  }

  useLanguage(language: string) {
    void this.uiLocale.setLanguage(language);
  }

  private setFormEditing(editing: boolean): void {
    this.isEditing = editing;

    if (editing) {
      this.userForm.enable({ emitEvent: false });

      this.userForm.get('email')?.disable({ emitEvent: false });
    } else {
      this.userForm.disable({ emitEvent: false });
    }
  }

  toggleEdit(): void {
    if (!this.isEditing) {
      // πάμε σε edit mode
      this.setFormEditing(true);
      return;
    }

    this.userForm.reset(this.initialFormValue, { emitEvent: false });
    this.setFormEditing(false);
    const completion = this.calculateProfileCompletion();
    this.updateChart(completion);
  }

  savePersonalChanges(): void {
    if (!this.isEditing) return;
    const updateData: UserUpdateDTO = this.userForm.getRawValue();
    this.userService.updateUser(updateData).subscribe({
      next: () => {
        alert(this.uiLocale.text('Data saved!'));
        this.initialFormValue = this.userForm.getRawValue();
        this.setFormEditing(false);
        const completion = this.calculateProfileCompletion();
        this.updateChart(completion);
      },
      error: (err) => console.error('Σφάλμα κατά την αποθήκευση:', err)
    });
  }

  private updateChart(percentage: number): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: [percentage]
    };
  }

  // private method
  private isDarkTheme(isDark: boolean) {
    this.isDarkMode = isDark;
  }

  // public method
  clearModel() {
    this.selectedPeople = [];
  }

  changeModel() {
    this.selectedPeople = [{ name: this.uiLocale.text('New person') }];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // preview άμεσα
    const reader = new FileReader();
    reader.onload = () => {
      if (this.user) this.user.profileImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    // upload
    this.userService.uploadProfileImage(file).subscribe({
      next: (res) => {
        // backend δίνει π.χ. /uploads/profile-images/xxx.jpg
        this.user.profileImageUrl = res.imageUrl;

        // ⭐ ΕΔΩ ενημερώνεις localStorage + authenticationService
        this.authenticationService.updateCurrentUserProfileImage(res.imageUrl);
      },
      error: (err) => {
        console.error('Σφάλμα upload:', err);
      }
    });
  }

  imgSrc(url?: string | null): string {
    if (!url) return 'assets/images/user/avatar-5.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads/')) return `${this.apiBase}${url}`;
    return url;
  }

  socialMedia = [
    {
      background: 'text-twitter',
      icon: 'twitter-square'
    },
    {
      background: 'text-facebook',
      icon: 'facebook'
    },
    {
      background: 'text-linkedin',
      icon: 'linkedin'
    }
  ];

  details = [
    {
      amount: '86',
      text: this.uiLocale.text('Post')
    },
    {
      amount: '40',
      text: this.uiLocale.text('Project')
    },
    {
      amount: '4.5K',
      text: this.uiLocale.text('Members')
    }
  ];

  personal_info = [
    {
      label: this.uiLocale.text('First Name'),
      value: 'Stein',
      type: 'text',
      detail: 'First Name'
    },
    {
      label: this.uiLocale.text('Last Name'),
      value: 'Ben',
      type: 'text',
      detail: 'Last Name'
    },
    {
      label: this.uiLocale.text('Email Address'),
      value: 'stebin.ben@gmail.com',
      type: 'email',
      detail: 'Enter Your Email'
    },
    {
      label: this.uiLocale.text('Date of Birth (+18)'),
      type: 'date',
      detail: 'Enter Your Date Of Birth Date'
    },
    {
      label: this.uiLocale.text('Phone Number'),
      detail: 'Phone Number',
      type: 'number'
    },
    {
      label: this.uiLocale.text('Designation'),
      detail: 'Designation',
      type: 'text'
    }
  ];

  passwords = [
    {
      label: this.uiLocale.text('Old Code'),
      placeholder: this.uiLocale.text('Enter the old password')
    },
    {
      label: this.uiLocale.text('New Code'),
      placeholder: this.uiLocale.text('Enter the new password')
    },
    {
      label: this.uiLocale.text('Code Confirmation'),
      placeholder: this.uiLocale.text('Re-enter the new password')
    }
  ];

  condition = [
    {
      text: this.uiLocale.text('At least 8 characters')
    },
    {
      text: this.uiLocale.text('At least 1 lowercase letter (a-z)')
    },
    {
      text: this.uiLocale.text('At least 1 capital letter (A-Z)')
    },
    {
      text: this.uiLocale.text('At least 1 number (0-9)')
    },
    {
      text: this.uiLocale.text('At least 1 special character')
    }
  ];

  setting = [
    {
      title: this.uiLocale.text('Order Confirmation'),
      text: this.uiLocale.text('You will be notified when customer order any product'),
      icon: 'file-done',
      check: true
    },
    {
      title: this.uiLocale.text('Setup Email Notification'),
      text: this.uiLocale.text('Turn on email notification to get updates through email'),
      icon: 'mail',
      check: false
    },
    {
      title: this.uiLocale.text('Update System Notification'),
      text: this.uiLocale.text('You will be notified when customer order any product'),
      icon: 'mail',
      check: true
    },
    {
      title: this.uiLocale.text('Language Change'),
      text: this.uiLocale.text('You will be notified when customer order any product'),
      icon: 'translation',
      check: true
    }
  ];

  cardItems = [
    {
      id: 'master-card',
      name: this.uiLocale.text('Selena Litten'),
      cardNumber: '**** **** **** 3456',
      cardType: 'master',
      checked: true
    },
    { id: 'visa-card', name: this.uiLocale.text('Stebin Ben'), cardNumber: '**** **** **** 7654', cardType: 'visa', checked: false }
  ];

  removeCard(id: string) {
    this.cardItems = this.cardItems.filter((item) => item.id !== id);
  }
}
