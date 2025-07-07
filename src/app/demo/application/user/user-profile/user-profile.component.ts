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
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { UserService } from 'src/app/theme/shared/service';
import { User } from 'src/app/theme/shared/components/_helpers/user';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

//UserUpdateDTO
import { UserUpdateDTO } from 'src/app/theme/shared/models/UserUpdateDTO';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, SharedModule, NgSelectModule, NgApexchartsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private dataService = inject(DataService);
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);
  userForm!: FormGroup;
  user!: User;

  // eslint-disable-next-line
  people$: Observable<any[]> | undefined;
  selectedPeople = [{ name: 'Karyn Wright' }];
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
      region: [''],
      postalCode: ['']
    });

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue(user);
      },
      error: (err) => console.error('Δεν κατάφερε να φορτωθεί ο χρήστης', err)
    });
  }
  //apothikeusi allagon
  savePersonalChanges(): void {
    const updateData: UserUpdateDTO = this.userForm.value;

    this.userService.updateUser(updateData).subscribe({
      next: () => alert('Τα στοιχεία αποθηκεύτηκαν!'),
      error: (err) => console.error('Σφάλμα κατά την αποθήκευση:', err)
    });
  }

  onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.userForm.patchValue({ profileImageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }
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
    this.selectedPeople = [{ name: 'New person' }];
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
      text: 'Post'
    },
    {
      amount: '40',
      text: 'Project'
    },
    {
      amount: '4.5K',
      text: 'Members'
    }
  ];

  personal_info = [
    {
      label: 'First Name',
      value: 'Stein',
      type: 'text',
      detail: 'First Name'
    },
    {
      label: 'Last Name',
      value: 'Ben',
      type: 'text',
      detail: 'Last Name'
    },
    {
      label: 'Email Address',
      value: 'stebin.ben@gmail.com',
      type: 'email',
      detail: 'Enter Your Email'
    },
    {
      label: 'Date of Birth (+18)',
      type: 'date',
      detail: 'Enter Your Date Of Birth Date'
    },
    {
      label: 'Phone Number',
      detail: 'Phone Number',
      type: 'number'
    },
    {
      label: 'Designation',
      detail: 'Designation',
      type: 'text'
    }
  ];

  passwords = [
    {
      label: 'Old Password',
      placeholder: 'Enter Old Password'
    },
    {
      label: 'New Password',
      placeholder: 'Enter New Password'
    },
    {
      label: 'Confirm Password',
      placeholder: 'Enter Confirm Password'
    }
  ];

  condition = [
    {
      text: 'At least 8 characters'
    },
    {
      text: 'At least 1 lower letter (a-z)'
    },
    {
      text: 'At least 1 uppercase letter (A-Z)'
    },
    {
      text: 'At least 1 number (0-9)'
    },
    {
      text: 'At least 1 special characters'
    }
  ];

  setting = [
    {
      title: 'Order Confirmation',
      text: 'You will be notified when customer order any product',
      icon: 'file-done',
      check: true
    },
    {
      title: 'Setup Email Notification',
      text: 'Turn on email notification to get updates through email',
      icon: 'mail',
      check: false
    },
    {
      title: 'Update System Notification',
      text: 'You will be notified when customer order any product',
      icon: 'mail',
      check: true
    },
    {
      title: 'Language Change',
      text: 'You will be notified when customer order any product',
      icon: 'translation',
      check: true
    }
  ];

  cardItems = [
    { id: 'master-card', name: 'Selena Litten', cardNumber: '**** **** **** 3456', cardType: 'master', checked: true },
    { id: 'visa-card', name: 'Stebin Ben', cardNumber: '**** **** **** 7654', cardType: 'visa', checked: false }
  ];

  removeCard(id: string) {
    this.cardItems = this.cardItems.filter((item) => item.id !== id);
  }
}
