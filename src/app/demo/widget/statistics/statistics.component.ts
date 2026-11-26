import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  AimOutline,
  BarChartOutline,
  CalendarOutline,
  ContactsOutline,
  DollarCircleFill,
  DownloadOutline,
  EyeOutline,
  FacebookOutline,
  FallOutline,
  FieldTimeOutline,
  FileProtectOutline,
  FileTextOutline,
  LinkedinOutline,
  PlusOutline,
  RedditOutline,
  RiseOutline,
  ScheduleFill,
  ShoppingFill,
  TwitterOutline,
  YoutubeOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-statistics',
  imports: [CommonModule, SharedModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        BarChartOutline,
        CalendarOutline,
        FileTextOutline,
        DownloadOutline,
        DollarCircleFill,
        ScheduleFill,
        ShoppingFill,
        FacebookOutline,
        TwitterOutline,
        YoutubeOutline,
        LinkedinOutline,
        EyeOutline,
        AimOutline,
        FieldTimeOutline,
        RiseOutline,
        FallOutline,
        PlusOutline,
        ContactsOutline,
        FileProtectOutline,
        RedditOutline
      ]
    );
  }

  // public method
  static_card = [
    {
      earning: '$30200',
      name: this.uiLocale.text('All Earnings'),
      icon: 'bar-chart',
      color: 'text-secondary'
    },
    {
      earning: '145',
      name: this.uiLocale.text('Task'),
      icon: 'calendar',
      color: 'text-danger'
    },
    {
      earning: '290+',
      name: this.uiLocale.text('Page Views'),
      icon: 'file-text',
      color: 'text-success'
    },
    {
      earning: '500',
      name: this.uiLocale.text('Downloads'),
      icon: 'download',
      color: 'text-primary'
    }
  ];

  EcommerceMetrix = [
    {
      color: 'bg-primary',
      icons: 'dollar-circle',
      title: this.uiLocale.text('Revenue'),
      amount: '$4,500',
      description: this.uiLocale.text('$50,032 Last Month')
    },
    {
      color: 'bg-warning',
      icons: 'schedule',
      title: this.uiLocale.text('Orders Received'),
      amount: '486',
      description: this.uiLocale.text('20% Increase')
    },
    {
      color: 'bg-success',
      icons: 'shopping',
      title: this.uiLocale.text('Total Sales'),
      amount: '1641',
      description: this.uiLocale.text('$1,055 Revenue Generated')
    }
  ];

  HoverSocialCard = [
    {
      name: this.uiLocale.text('Facebook Users'),
      total: '1165 +',
      icon: 'facebook',
      color: 'bg-primary'
    },
    {
      name: this.uiLocale.text('Twitter Users'),
      total: '780 +',
      icon: 'twitter',
      color: 'bg-info'
    },
    {
      name: this.uiLocale.text('Linked In Users'),
      total: '998 +',
      icon: 'linkedin',
      color: 'bg-dark'
    },
    {
      name: this.uiLocale.text('Youtube Videos'),
      total: '650 +',
      icon: 'youtube',
      color: 'bg-danger'
    }
  ];

  RoundIconCard = [
    {
      name: this.uiLocale.text('Impressions'),
      time: 'May 23 - June 01 (2018)',
      total: '1,563',
      color: 'bg-light-primary text-primary',
      icon: 'eye'
    },
    {
      name: this.uiLocale.text('Goal'),
      time: 'May 28 - June 01 (2018)',
      total: '30,564',
      color: 'bg-light-success text-success',
      icon: 'aim'
    },
    {
      name: this.uiLocale.text('Impact'),
      time: 'May 30 - June 01 (2018)',
      total: '42.6%',
      color: 'bg-light-warning text-warning',
      icon: 'field-time'
    }
  ];

  AnalyticEcommerce = [
    {
      title: this.uiLocale.text('Total Page Views'),
      amount: '4,42,236',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '59.3%',
      color: 'text-primary',
      number: '35,000'
    },
    {
      title: this.uiLocale.text('Total Users'),
      amount: '78,250',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '70.5%',
      color: 'text-primary',
      number: '8,900'
    },
    {
      title: this.uiLocale.text('Total Order'),
      amount: '18,800',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '1,943'
    },
    {
      title: this.uiLocale.text('Total Sales'),
      amount: '$35,078',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '$20,395'
    }
  ];

  summaryIncome = [
    {
      title: this.uiLocale.text('Published Project'),
      color: 'primary',
      background: 'progress-primary',
      value: '30',
      percentage: '30%'
    },
    {
      title: this.uiLocale.text('Completed Task'),
      color: 'success',
      background: 'progress-success',
      value: '90',
      percentage: '90%'
    },
    {
      title: this.uiLocale.text('Pending Task'),
      color: 'danger',
      background: 'progress-danger',
      value: '50',
      percentage: '50%'
    },
    {
      title: this.uiLocale.text('Issues'),
      color: 'warning',
      background: 'progress-warning',
      value: '55',
      percentage: '55%'
    }
  ];

  userCounter = [
    {
      background: 'success',
      icon: 'contacts',
      value: '1,658',
      details: 'Daily user'
    },
    {
      background: 'bg-primary',
      icon: 'file-protect',
      value: '1K',
      details: 'Daily page view'
    },
    {
      background: 'warning',
      icon: 'reddit',
      value: '5,678',
      details: 'Last month visitor'
    }
  ];
}
