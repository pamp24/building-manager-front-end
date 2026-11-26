import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  BugFill,
  CaretDownFill,
  CaretUpFill,
  CheckOutline,
  ClockCircleFill,
  ClockCircleOutline,
  DeleteOutline,
  EditOutline,
  FileTextFill,
  MessageFill,
  MobileFill,
  PlusCircleOutline,
  ShoppingFill,
  ShoppingOutline,
  TwitterCircleFill,
  TwitterOutline,
  UserOutline,
  WarningFill
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-widget-data',
  imports: [CommonModule, SharedModule, ScrollbarComponent],
  templateUrl: './widget-data.component.html',
  styleUrls: ['./widget-data.component.scss']
})
export class WidgetDataComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        TwitterCircleFill,
        ClockCircleFill,
        TwitterOutline,
        ShoppingOutline,
        CheckOutline,
        UserOutline,
        PlusCircleOutline,
        ClockCircleOutline,
        BugFill,
        WarningFill,
        MobileFill,
        MessageFill,
        ShoppingFill,
        FileTextFill,
        EditOutline,
        DeleteOutline,
        CaretUpFill,
        CaretDownFill
      ]
    );
  }

  // public method
  todoList = [
    {
      text: this.uiLocale.text('Check your Email'),
      checked: true
    },
    {
      text: this.uiLocale.text('Make YouTube Video'),
      checked: true
    },
    {
      text: this.uiLocale.text('Create Banner'),
      checked: true
    },
    {
      text: this.uiLocale.text('Upload Project'),
      checked: false
    },
    {
      text: this.uiLocale.text('Upload Task'),
      checked: false
    },
    {
      text: this.uiLocale.text('Task Issue'),
      checked: false
    },
    {
      text: this.uiLocale.text('Deploy Project'),
      checked: false
    }
  ];

  TrafficSources = [
    {
      title: this.uiLocale.text('Referral'),
      percentage: '20%',
      background: 'progress-primary',
      value: '20'
    },
    {
      title: this.uiLocale.text('Bounce'),
      percentage: '58%',
      background: 'progress-secondary',
      value: '58'
    },
    {
      title: this.uiLocale.text('Internet'),
      percentage: '40%',
      background: 'progress-primary',
      value: '40'
    },
    {
      title: this.uiLocale.text('Social'),
      percentage: '90%',
      background: 'progress-primary',
      value: '90'
    }
  ];

  team_members = [
    {
      src: 'assets/images/user/avatar-1.jpg',
      title: this.uiLocale.text('David Jones'),
      text: this.uiLocale.text('Project Leader'),
      time: '5 min ago',
      space: 'mb-4'
    },
    {
      src: 'assets/images/user/avatar-2.jpg',
      title: this.uiLocale.text('David Jones'),
      text: this.uiLocale.text('HR Manager'),
      time: '1 min ago',
      space: 'mb-4'
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      title: this.uiLocale.text('David Jones'),
      text: this.uiLocale.text('Developer'),
      time: 'Yesterday',
      space: 'mb-4'
    },
    {
      src: 'assets/images/user/avatar-3.jpg',
      title: this.uiLocale.text('David Jones'),
      text: this.uiLocale.text('UI/UX Designer'),
      time: '02-05-2021'
    }
  ];

  latestMessages = [
    {
      time: '2 hrs ago',
      icon: 'twitter',
      title: this.uiLocale.text('+ 1652 Followers'),
      color: 'text-info bg-light-info',
      text: this.uiLocale.text('You’re getting more and more followers, keep it up!'),
      space: 'p-t-20 p-b-30'
    },
    {
      time: '4 hrs ago',
      icon: 'shopping',
      title: this.uiLocale.text('+ 5 New Products were added!'),
      text: this.uiLocale.text('Congratulations!'),
      color: 'text-danger bg-light-danger',
      space: 'p-b-30'
    },
    {
      time: '1 day ago',
      icon: 'check',
      title: this.uiLocale.text('Database backup completed!'),
      text: this.uiLocale.text('Download the latest backup'),
      color: 'text-success bg-light-success',
      space: 'p-b-30'
    },
    {
      time: '2 day ago',
      icon: 'user',
      title: this.uiLocale.text('+2 Friend Requests'),
      text: this.uiLocale.text('This is great, keep it up!'),
      color: 'text-primary bg-light-primary',
      space: 'p-b-0'
    }
  ];

  userActivity = [
    {
      src: 'assets/images/user/avatar-4.jpg',
      status: 'bg-danger',
      time: 'now'
    },
    {
      src: 'assets/images/user/avatar-3.jpg',
      status: 'bg-success',
      time: '2 min ago'
    },
    {
      src: 'assets/images/user/avatar-1.jpg',
      status: 'bg-primary',
      time: '1 day ago'
    },
    {
      src: 'assets/images/user/avatar-2.jpg',
      status: 'bg-warning',
      time: '3 week ago'
    }
  ];

  ProjectTable = [
    {
      src: 'assets/images/user/avatar-4.jpg',
      name: this.uiLocale.text('John Deo'),
      position: 'Graphics Designer',
      theme: 'Mantis Pro',
      date: 'Jun, 26',
      priority: 'Low',
      background: 'bg-warning text-white'
    },
    {
      src: 'assets/images/user/avatar-2.jpg',
      name: this.uiLocale.text('Jenifer Vintage'),
      position: 'Web Designer',
      theme: 'MashAble',
      date: 'March, 31',
      priority: 'Lower',
      background: 'bg-danger text-white'
    },
    {
      src: 'assets/images/user/avatar-3.jpg',
      name: this.uiLocale.text('William Jem'),
      position: 'Developer',
      theme: 'FlatAble',
      date: 'Aug, 02',
      priority: 'Medium',
      background: 'bg-primary text-white'
    },
    {
      src: 'assets/images/user/avatar-1.jpg',
      name: this.uiLocale.text('David Jones'),
      position: 'Developer',
      theme: 'GuruAble',
      date: 'Sep, 22',
      priority: 'High',
      background: 'bg-info text-white'
    },
    {
      src: 'assets/images/user/avatar-5.jpg',
      name: this.uiLocale.text('Stebin Ben'),
      position: 'Leader',
      theme: 'Mantis',
      date: 'Sep, 22',
      priority: 'Higher',
      background: 'bg-success text-white'
    }
  ];

  ProductSales = [
    {
      sale: '2136',
      product: 'HeadPhone',
      price: '$ 926.23',
      color: 'text-success'
    },
    {
      sale: '2546',
      product: 'Iphone 6',
      price: '$ 485.85',
      color: 'text-danger'
    },
    {
      sale: '2681',
      product: 'Jacket',
      price: '$ 786.23',
      color: 'text-primary'
    },
    {
      sale: '2756',
      product: 'HeadPhone',
      price: '$ 563.85',
      color: 'text-info'
    },
    {
      sale: '8765',
      product: 'Sofa',
      price: '$ 769.85',
      color: 'text-danger'
    },
    {
      sale: '3652',
      product: 'Iphone 7',
      price: '$ 754.23',
      color: 'text-warning'
    },
    {
      sale: '7456',
      product: 'Jacket',
      price: '$ 743.85',
      color: 'text-success'
    }
  ];

  TasksCard = [
    {
      background: 'bg-success',
      icon: 'twitter-circle',
      time: '8:50',
      details: 'You’re getting more and more followers, keep it up!'
    },
    {
      background: 'bg-primary',
      icon: 'clock-circle',
      time: 'Sat, 5 Mar',
      details: 'Design mobile Application'
    },
    {
      background: 'bg-danger',
      icon: 'bug',
      time: 'Sun, 17 Feb',
      details: 'Jenny assign you a task Mockup Design.'
    },
    {
      background: 'bg-warning',
      icon: 'warning',
      time: 'Sat, 18 Mar',
      details: 'Design logo'
    },
    {
      background: 'bg-success',
      icon: 'mobile',
      time: 'Sat, 22 Mar',
      details: 'Design mobile Application'
    }
  ];

  tasks = [
    {
      icon: 'feather icon-check f-w-600 bg-success',
      time: '8:50',
      text: this.uiLocale.text('Call to customer Jacob and discuss the')
    },
    {
      icon: 'bg-primary',
      time: 'Sat, 5 Mar',
      text: this.uiLocale.text('Design mobile Application')
    },
    {
      icon: 'bg-danger',
      time: 'Sun, 17 Feb',
      text: this.uiLocale.text('Jeny assign you a task Mockup Design.')
    },
    {
      icon: 'bg-warning',
      time: 'Sat, 18 Mar',
      text: this.uiLocale.text('Design logo')
    }
  ];

  applicationSales = [
    {
      application: 'Mantis Pro',
      text: this.uiLocale.text('Powerful Admin Theme'),
      sale: '16,300',
      price: '$53',
      total: '$15,652'
    },
    {
      application: 'PhotoShop',
      text: this.uiLocale.text('Design Software'),
      sale: '26,421',
      price: '$35',
      total: '$18,785'
    },
    {
      application: 'GuruAble',
      text: this.uiLocale.text('Best Admin Template'),
      sale: '8,265',
      price: '$98',
      total: '$9,652'
    },
    {
      application: 'FlatAble',
      text: this.uiLocale.text('Admin App'),
      sale: '10,652',
      price: '$20',
      total: '$7,856'
    }
  ];

  ActiveTickets = [
    {
      time: '12',
      src: 'assets/images/user/avatar-4.jpg',
      user: 'John Deo',
      text: this.uiLocale.text('[#1183] Workaround for OS X selects printing bug'),
      description: this.uiLocale.text('Chrome fixed the bug several versions ago, thus rendering this...')
    },
    {
      time: '16',
      src: 'assets/images/user/avatar-3.jpg',
      user: 'Jems Win',
      text: this.uiLocale.text('[#1249] Vertically center carousel controls'),
      description: this.uiLocale.text('Try any carousel control and reduce the screen width below...')
    },
    {
      time: '40',
      src: 'assets/images/user/avatar-2.jpg',
      user: 'Jeny Wiliiam',
      text: this.uiLocale.text('[#1254] Inaccurate small pagination height'),
      description: this.uiLocale.text('The height of pagination elements is not consistent with...')
    },
    {
      time: '16',
      src: 'assets/images/user/avatar-3.jpg',
      user: 'Jems Win',
      text: this.uiLocale.text('[#1249] Vertically center carousel controls'),
      description: this.uiLocale.text('Try any carousel control and reduce the screen width below...')
    }
  ];

  latestPost = [
    {
      src: 'assets/images/widget/dashborad-1.jpg'
    },
    {
      src: 'assets/images/widget/dashborad-3.jpg'
    }
  ];

  FeedsCard = [
    {
      title: this.uiLocale.text('You have 3 pending tasks.'),
      time: 'Just Now',
      icon: 'message',
      background: 'bg-primary'
    },
    {
      title: this.uiLocale.text('New order received'),
      time: '1 day ago',
      icon: 'shopping',
      background: 'bg-danger'
    },
    {
      title: this.uiLocale.text('You have 3 pending tasks.'),
      time: '3 week ago',
      icon: 'file-text',
      background: 'bg-success'
    },
    {
      title: this.uiLocale.text('New order received'),
      time: 'around month',
      icon: 'message',
      background: 'bg-primary'
    },
    {
      title: this.uiLocale.text('Order cancelled'),
      time: '2 month ago',
      icon: 'shopping',
      background: 'bg-warning'
    }
  ];

  customersList = [
    {
      src: 'assets/images/widget/GERMANY.jpg',
      country: 'Germany',
      name: this.uiLocale.text('Anjalina Jolly'),
      avrange: '56.23%'
    },
    {
      src: 'assets/images/widget/USA.jpg',
      country: 'USA',
      name: this.uiLocale.text('John Deo'),
      avrange: '25.23%'
    },
    {
      src: 'assets/images/widget/AUSTRALIA.jpg',
      country: 'Australia',
      name: this.uiLocale.text('Jenifer Vintage'),
      avrange: '12.45%'
    },
    {
      src: 'assets/images/widget/UK.jpg',
      country: 'United Kingdom',
      name: this.uiLocale.text('Lori Moore'),
      avrange: '8.65%'
    },
    {
      src: 'assets/images/widget/BRAZIL.jpg',
      country: 'Brazilm',
      name: this.uiLocale.text('Allina D’croze'),
      avrange: '3.56%%'
    },
    {
      src: 'assets/images/widget/AUSTRALIA.jpg',
      country: 'Australia',
      name: this.uiLocale.text('Jenifer Vintage'),
      avrange: '12.45%'
    },
    {
      src: 'assets/images/widget/USA.jpg',
      country: 'USA',
      name: this.uiLocale.text('John Deo'),
      avrange: '25.23%'
    },
    {
      src: 'assets/images/widget/UK.jpg',
      country: 'United Kingdom',
      name: this.uiLocale.text('Lori Moore'),
      avrange: '8.65%'
    }
  ];

  LatestOrder = [
    {
      user: 'John Deo',
      Id: '#81412314',
      src: 'assets/images/widget/PHONE1.jpg',
      product: 'Moto G5',
      qty: '10',
      date: '17-2-2017',
      status: 'Pending',
      bgcolor: 'bg-warning'
    },
    {
      user: 'Jenny William',
      Id: '#68457898',
      src: 'assets/images/widget/PHONE2.jpg',
      product: 'iPhone 8',
      qty: '16',
      date: '20-2-2017',
      status: 'Paid',
      bgcolor: 'bg-primary'
    },
    {
      user: 'Lori Moore',
      Id: '#45457898',
      src: 'assets/images/widget/PHONE3.jpg',
      product: 'Redmi 4',
      qty: '20',
      date: '17-2-2017',
      status: 'Success',
      bgcolor: 'bg-success'
    },
    {
      user: 'Austin Pena',
      Id: '#62446232',
      src: 'assets/images/widget/PHONE4.jpg',
      product: 'Jio',
      qty: '15',
      date: '25-4-2017',
      status: 'Failed',
      bgcolor: 'bg-danger'
    }
  ];

  incomingList = [
    {
      text: this.uiLocale.text('Incoming requests'),
      color: 'bg-primary'
    },
    {
      text: this.uiLocale.text('You have 2 pending requests..'),
      color: 'bg-success'
    },
    {
      text: this.uiLocale.text('You have 3 pending requests..'),
      color: 'bg-danger'
    },
    {
      text: this.uiLocale.text('New order received'),
      color: 'bg-warning'
    },
    {
      text: this.uiLocale.text('Incoming requests'),
      color: 'bg-info'
    },
    {
      text: this.uiLocale.text('The 3 Golden Rules Professional Design..'),
      color: 'bg-success'
    },
    {
      text: this.uiLocale.text('You have 4 pending tasks'),
      color: 'bg-danger'
    },
    {
      text: this.uiLocale.text('New order received'),
      color: 'bg-warning'
    },
    {
      text: this.uiLocale.text('Incoming requests'),
      color: 'bg-info'
    },
    {
      text: this.uiLocale.text('The 3 Golden Rules Professional Design..'),
      color: 'bg-success'
    },
    {
      text: this.uiLocale.text('You have 4 pending tasks'),
      color: 'bg-danger'
    }
  ];

  newCustomerList = [
    {
      src: 'assets/images/user/avatar-1.jpg',
      user: 'Alex Thompson',
      text: this.uiLocale.text('Cheers!'),
      status: 'active'
    },
    {
      src: 'assets/images/user/avatar-2.jpg',
      user: 'John Doue',
      text: this.uiLocale.text('stay hungry stay foolish!'),
      status: 'active'
    },
    {
      src: 'assets/images/user/avatar-3.jpg',
      user: 'Alex Thompson',
      text: this.uiLocale.text('Cheers!'),
      time: '30 min ago'
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      user: 'John Doue',
      text: this.uiLocale.text('Cheers!'),
      time: '10 min ago'
    },
    {
      src: 'assets/images/user/avatar-5.jpg',
      user: 'Shirley Hoe',
      text: this.uiLocale.text('stay hungry stay foolish!'),
      status: 'active'
    },
    {
      src: 'assets/images/user/avatar-1.jpg',
      user: 'John Doue',
      text: this.uiLocale.text('Cheers!'),
      status: 'active'
    },
    {
      src: 'assets/images/user/avatar-2.jpg',
      user: 'Shirley HoJames Alexander',
      text: this.uiLocale.text('stay hungry stay foolish!'),
      status: 'active'
    },
    {
      src: 'assets/images/user/avatar-3.jpg',
      user: 'John Doue',
      text: this.uiLocale.text('Cheers!'),
      time: '10 min ago'
    }
  ];

  recentList = [
    {
      sub: 'Website down for one week',
      department: 'Support',
      time: 'Today 2:00',
      status: 'Open',
      bgcolor: ' bg-light-success'
    },
    {
      sub: 'Loosing control on server',
      department: 'Support',
      time: 'Yesterday',
      status: 'Progress',
      bgcolor: 'bg-light-primary'
    },
    {
      sub: 'Authorizations keys',
      department: 'Support',
      time: '27, Aug',
      status: 'Closed',
      bgcolor: 'bg-light-danger'
    },
    {
      sub: 'Restoring default settings',
      department: 'Support',
      time: 'Today 9:00',
      status: 'Open',
      bgcolor: 'bg-light-success'
    },
    {
      sub: 'Loosing control on server',
      department: 'Support',
      time: 'Yesterday',
      status: 'Progress',
      bgcolor: 'bg-light-primary'
    },
    {
      sub: 'Restoring default settings',
      department: 'Support',
      time: 'Today 9:00',
      status: 'Progress',
      bgcolor: 'bg-light-success'
    },
    {
      sub: 'Loosing control on server',
      department: 'Support',
      time: 'Yesterday',
      status: 'progress',
      bgcolor: 'bg-light-primary'
    },
    {
      sub: 'Authorizations keys',
      department: 'Support',
      time: '27, Aug',
      status: 'Closed',
      bgcolor: 'bg-light-danger'
    }
  ];

  totalRevenue = [
    {
      color: 'text-success',
      name: this.uiLocale.text('Bitcoin'),
      percentage: '+ $145.85'
    },
    {
      color: 'text-danger',
      name: this.uiLocale.text('Ethereum'),
      percentage: '- $6.368'
    },
    {
      color: 'text-success',
      name: this.uiLocale.text('Ripple'),
      percentage: '+ $458.63'
    },
    {
      color: 'text-danger',
      name: this.uiLocale.text('Neo'),
      percentage: '- $5.631'
    },
    {
      color: 'text-danger',
      name: this.uiLocale.text('Bitcoin'),
      percentage: '- $75.86'
    },
    {
      color: 'text-success',
      name: this.uiLocale.text('Ethereum'),
      percentage: '+ $453.63'
    },
    {
      color: 'text-danger',
      name: this.uiLocale.text('Ripple'),
      percentage: '+ $786.63'
    },
    {
      color: 'text-success',
      name: this.uiLocale.text('Neo'),
      percentage: '+ $145.85'
    },
    {
      color: 'text-success',
      name: this.uiLocale.text('Bitcoin'),
      percentage: '- $6.368'
    },
    {
      color: 'text-success',
      name: this.uiLocale.text('Ethereum'),
      percentage: '+ $458.63'
    },
    {
      color: 'text-danger',
      name: this.uiLocale.text('Neo'),
      percentage: '- $5.631'
    },
    {
      color: 'text-danger',
      name: this.uiLocale.text('Ripple'),
      percentage: '+ $145.85'
    },
    {
      color: 'text-success',
      name: this.uiLocale.text('Bitcoin'),
      percentage: '- $75.86'
    },
    {
      color: 'text-success',
      name: this.uiLocale.text('Bitcoin'),
      percentage: '+ $453.63'
    },
    {
      color: 'text-danger',
      name: this.uiLocale.text('Ethereum'),
      percentage: '+ $786.63'
    }
  ];
}
