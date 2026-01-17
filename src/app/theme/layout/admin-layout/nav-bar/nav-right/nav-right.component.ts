/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, Input, OnInit, output, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { AuthenticationService } from 'src/app/theme/shared/service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MantisConfig } from 'src/app/app-config';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';

// third party
import { TranslateService } from '@ngx-translate/core';
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
  authenticationService = inject(AuthenticationService);
  private translate = inject(TranslateService);
  private iconService = inject(IconService);
  notifications: any[] = [];

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
    this.translate.use(language);
  }

  megaMenus = [
    {
      name: 'Authentication',
      children: [
        {
          title: 'Login',
          url: '/auth/login'
        },
        {
          title: 'Register',
          url: '/auth/register'
        },
        {
          title: 'Reset Password',
          url: '/auth/reset-password'
        },
        {
          title: 'Forgot Password',
          url: '/auth/forgot-password'
        },
        {
          title: 'Verification Code',
          url: '/auth/code-verify'
        }
      ]
    },
    {
      name: 'Other Pages',
      children: [
        {
          title: 'About Us',
          url: '/',
          target: '_blank'
        },
        {
          title: 'Contact Us',
          url: '/contact-us',
          target: '_blank'
        },
        {
          title: 'Pricing',
          url: '/price'
        },
        {
          title: 'Payment',
          url: '/user/user-profile'
        },
        {
          title: 'Landing',
          url: '/',
          target: '_blank'
        }
      ]
    },
    {
      name: 'MainTenance Pages',
      children: [
        {
          title: 'Construction',
          url: '/maintenance/under-construct',
          target: '_blank'
        },
        {
          title: 'Coming Soon',
          url: '/maintenance/coming-soon',
          target: '_blank'
        },
        {
          title: '404 Error',
          url: '/maintenance/error-404'
        }
      ]
    }
  ];

  profile = [
    {
      icon: 'profile',
      title: 'Προφιλ Πολυκατοικίας',
      url: '/user/account-profile'
    },
    {
      icon: 'user',
      title: 'Προσωπικό προφίλ',
      url: '/user/user-profile'
    },
    // {
    //   icon: 'edit',
    //   title: 'Social Profile'
    // },
    {
      icon: 'calendar',
      title: 'Ημερολόγιο',
      url: '/calendar'
    },
    {
      icon: 'line-chart',
      title: 'Ψηφοφορίες',
      url: '/polls'
    },
    {
      icon: 'wallet',
      title: 'Τιμολόγηση',
      url: '/price'
    }
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Υποστήριξη',
      url: '/helpdesk/ticket/create'
    },
    {
      icon: 'user',
      title: 'Ρυθμίσεις λογαριασμού'
    },
    {
      icon: 'lock',
      title: 'Privacy Center'
    },
    {
      icon: 'comment',
      title: 'Feedback'
    },
    {
      icon: 'unordered-list',
      title: 'Ιστορικό'
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
