import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// Angular import
import { Component, inject } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  BookOutline,
  CreditCardOutline,
  LeftOutline,
  MoreOutline,
  RightOutline,
  RocketOutline,
  UserDeleteOutline
} from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { StateChartComponent } from './state-chart/state-chart.component';
import { ActivityChartComponent } from './activity-chart/activity-chart.component';
import { PmStatisticsChartComponent } from 'src/app/theme/shared/apexchart/pm-statistics-chart/pm-statistics-chart.component.ts';

@Component({
  selector: 'app-membership-dashboard',
  imports: [SharedModule, PmStatisticsChartComponent, StateChartComponent, ActivityChartComponent],
  templateUrl: './membership-dashboard.component.html',
  styleUrl: './membership-dashboard.component.scss'
})
export class MembershipDashboardComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[BookOutline, RocketOutline, CreditCardOutline, LeftOutline, UserDeleteOutline, RightOutline, MoreOutline]);
  }

  // public method
  membership = [
    {
      title: this.uiLocale.text('Registrations'),
      value: '980+',
      date: 'May 23 - June 01 (2018)',
      icon: 'book',
      background: 'bg-light-primary'
    },
    {
      title: this.uiLocale.text('Renewals'),
      value: '1,563',
      date: 'May 23 - June 01 (2018)',
      icon: 'rocket',
      background: 'bg-light-success'
    },
    {
      title: this.uiLocale.text('Revenue'),
      value: '42.6%',
      date: 'May 23 - June 01 (2018)',
      icon: 'credit-card',
      background: 'bg-light-warning'
    },
    {
      title: this.uiLocale.text('Cancellations'),
      value: '30.7%',
      date: 'May 23 - June 01 (2018)',
      icon: 'user-delete',
      background: 'bg-light-danger'
    }
  ];

  tasks = [
    {
      title: this.uiLocale.text('Realize offers!'),
      time: '16:00',
      border_color: 'border-success'
    },
    {
      title: this.uiLocale.text('Add new members.'),
      time: '14:00',
      border_color: 'border-warning'
    },
    {
      title: this.uiLocale.text('Add new benefit list.'),
      time: '13:00',
      border_color: 'border-primary'
    },
    {
      title: this.uiLocale.text('Second offer is end!'),
      time: '09:00',
      border_color: 'border-danger'
    }
  ];

  activityList = [
    {
      image: 'assets/images/user/avatar-4.jpg',
      name: this.uiLocale.text('Airi Satou'),
      email: 'satou123@gmail.com',
      date: '2023/09/12'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      name: this.uiLocale.text('Ashton Cox'),
      email: 'ashton@gmail.com',
      date: '2023/09/12'
    },
    {
      image: 'assets/images/user/avatar-2.jpg',
      name: this.uiLocale.text('Bradley Greer'),
      email: 'greer05@gmail.com',
      date: '2022/09/19'
    },
    {
      image: 'assets/images/user/avatar-5.jpg',
      name: this.uiLocale.text('Brielle Williamson'),
      email: 'bw23@gmail.com',
      date: '2022/08/22'
    },
    {
      image: 'assets/images/user/avatar-1.jpg',
      name: this.uiLocale.text('Colleen Hurst'),
      email: 'hurst006@gmail.com',
      date: '2022/06/26'
    }
  ];

  notifications = [
    {
      image: 'assets/images/user/avatar-1.jpg',
      title: this.uiLocale.text('Brieley join casual membership..'),
      date: 'Today | 9:00 AM'
    },
    {
      image: 'assets/images/user/avatar-5.jpg',
      title: this.uiLocale.text('Ashton end membership planing'),
      date: 'Yesterday | 6:30 PM'
    },
    {
      image: 'assets/images/user/avatar-2.jpg',
      title: this.uiLocale.text('Airi canceled in 2 months membership'),
      date: '05 Feb | 1:45 PM'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      title: this.uiLocale.text('Colleen join Addicted membership'),
      date: '05 Feb | 2:45 PM'
    },
    {
      image: 'assets/images/user/avatar-4.jpg',
      title: this.uiLocale.text('Airi canceled in 2 months membership'),
      date: '05 Feb | 3:45 PM'
    },
    {
      image: 'assets/images/user/avatar-6.jpg',
      title: this.uiLocale.text('Airi canceled in 2 months membership'),
      date: '05 Feb | 4:00 PM'
    },
    {
      image: 'assets/images/user/avatar-7.jpg',
      title: this.uiLocale.text('Colleen join Addicted membership'),
      date: '05 Feb | 5:00 PM'
    }
  ];
}
