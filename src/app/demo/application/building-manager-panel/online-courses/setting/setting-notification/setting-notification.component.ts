import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component } from '@angular/core';
// angular import

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-setting-notification',
  imports: [SharedModule],
  templateUrl: './setting-notification.component.html',
  styleUrl: './setting-notification.component.scss'
})
export class SettingNotificationComponent {
  private readonly uiLocale = inject(UiLocaleService);

  // public method
  notifications = [
    {
      title: this.uiLocale.text('Enrollment Notifications'),
      description: this.uiLocale.text('Get notified via email whenever a student enrolls in your school and/or courses.'),
      type: [
        {
          checked: true,
          name: this.uiLocale.text('When a new student joins the school')
        },
        {
          checked: true,
          name: this.uiLocale.text('When a student enrolls in a paid course')
        },
        {
          checked: false,
          name: this.uiLocale.text('When a student enrolls in a free course')
        }
      ]
    },
    {
      title: this.uiLocale.text('Comment Notifications'),
      description: this.uiLocale.text('Get alerted via email whenever someone engages in a commenting action.'),
      type: [
        {
          checked: true,
          name: this.uiLocale.text('When a new comment is posted that requires moderation')
        },
        {
          checked: false,
          name: this.uiLocale.text('When a new comment is posted on one of your courses')
        },
        {
          checked: true,
          name: this.uiLocale.text("When a new comment is posted in a thread you've commented on")
        }
      ]
    },
    {
      title: this.uiLocale.text('Subscription Notifications'),
      description: this.uiLocale.text('Get email notifications for specific subscription events.'),
      type: [
        {
          checked: true,
          name: this.uiLocale.text('When a subscription payment fails or a subscription is canceled due to non-payment')
        },
        {
          checked: true,
          name: this.uiLocale.text('When a student cancels their subscription to one of your courses')
        }
      ]
    }
  ];
}
