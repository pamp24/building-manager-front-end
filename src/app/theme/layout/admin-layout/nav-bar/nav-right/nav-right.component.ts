import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, Input, OnInit, output, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MantisConfig } from 'src/app/app-config';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import screenfull from 'screenfull';

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  WindowsOutline,
  TranslationOutline,
  BellOutline,
  MailOutline,
  FullscreenOutline,
  SettingOutline,
  MoonOutline,
  SunOutline,
  FullscreenExitOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  CloseOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline
} from '@ant-design/icons-angular/icons';
import { NotificationService } from 'src/app/theme/shared/service/notification.service';
import { NotificationDropdownComponent } from './notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, RouterModule, ScrollbarComponent, NotificationDropdownComponent],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);
  readonly themeService = inject(ThemeService);

  authenticationService = inject(AuthenticationService);
  private iconService = inject(IconService);
  notifications: any[] = [];

  readonly languages = this.uiLocale.languages;
  get currentLanguage() {
    return this.uiLocale.currentLanguage;
  }

  // public props
  @Input() styleSelectorToggle!: boolean;
  readonly Customize = output();
  windowWidth: number;
  screenFull: boolean = true;
  unreadCount = 0;

  // constructor
  constructor(private notificationService: NotificationService) {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        WindowsOutline,
        TranslationOutline,
        BellOutline,
        MailOutline,
        FullscreenOutline,
        SettingOutline,
        MoonOutline,
        SunOutline,
        FullscreenExitOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        CheckCircleOutline,
        CloseOutline,
        LogoutOutline,
        EditOutline,
        UserOutline,
        ProfileOutline,
        WalletOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline
      ]
    );
  }

  // life cycle
  ngOnInit() {
    setTimeout(() => {
      this.useLanguage(MantisConfig.i18n);
    }, 0);
  }

  // public method
  // user according language change of sidebar menu item
  useLanguage(language: string) {
    void this.uiLocale.setLanguage(language);
  }

  getUserAvatar(): string {
    const url = this.authenticationService.currentUserValue?.profileImageUrl?.trim();

    if (!url) return 'assets/images/user/avatar-1.jpg';
    if (url.startsWith('http')) return url;

    return `${environment.apiUrl}/api/v1${url}`;
  }

  onAvatarError(e: Event) {
    (e.target as HTMLImageElement).src = 'assets/images/user/avatar-1.jpg';
  }

  megaMenus = [
    {
      name: this.uiLocale.text('Authentication'),
      children: [
        {
          title: this.uiLocale.text('Login'),
          url: '/auth/login'
        },
        {
          title: this.uiLocale.text('Register'),
          url: '/auth/register'
        },
        {
          title: this.uiLocale.text('Reset Password'),
          url: '/auth/reset-password'
        },
        {
          title: this.uiLocale.text('Forgot Password'),
          url: '/auth/forgot-password'
        },
        {
          title: this.uiLocale.text('Verification Code'),
          url: '/auth/code-verify'
        }
      ]
    },
    {
      name: this.uiLocale.text('Other Pages'),
      children: [
        {
          title: this.uiLocale.text('About Us'),
          url: '/',
          target: '_blank'
        },
        {
          title: this.uiLocale.text('Contact Us'),
          url: '/contact-us',
          target: '_blank'
        },
        {
          title: this.uiLocale.text('Pricing'),
          url: '/price'
        },
        {
          title: this.uiLocale.text('Payment'),
          url: '/user/user-profile'
        },
        {
          title: this.uiLocale.text('Landing'),
          url: '/',
          target: '_blank'
        }
      ]
    },
    {
      name: this.uiLocale.text('MainTenance Pages'),
      children: [
        {
          title: this.uiLocale.text('Construction'),
          url: '/maintenance/under-construct',
          target: '_blank'
        },
        {
          title: this.uiLocale.text('Coming Soon'),
          url: '/maintenance/coming-soon',
          target: '_blank'
        },
        {
          title: this.uiLocale.text('404 Error'),
          url: '/maintenance/error-404'
        }
      ]
    }
  ];

  profile = [
    {
      icon: 'profile',
      title: this.uiLocale.text('Apartment Building Profile'),
      url: '/user/account-profile'
    },
    {
      icon: 'user',
      title: this.uiLocale.text('Personal profile'),
      url: '/user/user-profile'
    },
    // {
    //   icon: 'edit',
    //   title: 'Social Profile'
    // },
    {
      icon: 'calendar',
      title: this.uiLocale.text('Calendar'),
      url: '/calendar'
    },
    {
      icon: 'line-chart',
      title: this.uiLocale.text('Votes'),
      url: '/polls'
    },
    {
      icon: 'wallet',
      title: this.uiLocale.text('Pricing'),
      url: '/price'
    }
  ];

  setting = [
    {
      icon: 'question-circle',
      title: this.uiLocale.text('Support'),
      url: '/helpdesk/ticket/create'
    },
    {
      icon: 'user',
      title: this.uiLocale.text('Account Settings')
    },
    {
      icon: 'lock',
      title: this.uiLocale.text('Privacy Center')
    },
    {
      icon: 'comment',
      title: this.uiLocale.text('Feedback')
    },
    {
      icon: 'unordered-list',
      title: this.uiLocale.text('History')
    }
  ];

  messageList = [
    {
      userImage: 'assets/images/user/avatar-2.jpg',
      timestamp: '3:00 AM',
      boldText: 'Cristina danny birthday today',
      normalText: "It's",
      dateInfo: '2 min ago'
    },
    {
      userImage: 'assets/images/user/avatar-1.jpg',
      timestamp: '6:00 PM',
      boldText: 'Aida Burg',
      normalText: 'commented your post.',
      dateInfo: '5 August'
    },
    {
      userImage: 'assets/images/user/avatar-3.jpg',
      timestamp: '2:45 PM',
      normalText: 'There was a failure to your setup.',
      dateInfo: '7 hours ago'
    },
    {
      userImage: 'assets/images/user/avatar-4.jpg',
      timestamp: '9:10 PM',
      boldText: 'Cristina Danny invited to join Meeting.',
      dateInfo: 'Daily scrum meeting time'
    }
  ];

  customize() {
    this.styleSelectorToggle = !this.styleSelectorToggle;
    this.Customize.emit();
  }

  toggleTheme(): void {
    this.themeService.setDarkMode(!this.themeService.isDarkMode());
  }

  logout() {
    this.authenticationService.logout();
  }

  // full screen toggle
  toggleFullscreen() {
    this.screenFull = screenfull.isFullscreen;
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
}
