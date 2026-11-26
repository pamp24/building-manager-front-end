import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// angular import
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// icons
import { IconService } from '@ant-design/icons-angular';
import { EditOutline, StarFill } from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-courses-view',
  imports: [SharedModule, RouterModule],
  templateUrl: './courses-view.component.html',
  styleUrl: './courses-view.component.scss'
})
export class CoursesViewComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[StarFill, EditOutline]);
  }

  // public method
  courseView = [
    {
      img: 'assets/images/admin/img-course-1.png',
      type: 'free',
      title: this.uiLocale.text('Bootstrap 5 Beginner Course'),
      duration: '10 Months',
      teacher: 'Jimmy Morris',
      students: '+120',
      rating: '4.8'
    },
    {
      img: 'assets/images/admin/img-course-2.png',
      type: 'paid',
      title: this.uiLocale.text('PHP Training Course'),
      duration: '10 Months',
      teacher: 'Nashid Martines',
      students: '+50',
      rating: '4.5'
    },
    {
      img: 'assets/images/admin/img-course-3.png',
      type: 'free',
      title: this.uiLocale.text('MERN Stack Training Course'),
      duration: '10 Months',
      teacher: 'Jack Ronan',
      students: '+100',
      rating: '3.9'
    },
    {
      img: 'assets/images/admin/img-course-4.png',
      type: 'paid',
      title: this.uiLocale.text('Python Training Course'),
      duration: '10 Months',
      teacher: 'Garrett Winters',
      students: '+110',
      rating: '4.5'
    },
    {
      img: 'assets/images/admin/img-course-5.png',
      type: 'paid',
      title: this.uiLocale.text('Web Designing Course'),
      duration: '10 Months',
      teacher: 'Tiger Nixon',
      students: '+110',
      rating: '4.2'
    },
    {
      img: 'assets/images/admin/img-course-6.png',
      type: 'free',
      title: this.uiLocale.text('C Training Course'),
      duration: '10 Months',
      teacher: 'Airi Satou',
      students: '+70',
      rating: '4.6'
    },
    {
      img: 'assets/images/admin/img-course-7.png',
      type: 'free',
      title: this.uiLocale.text('UI/UX Designing Course'),
      duration: '10 Months',
      teacher: 'Sonya Frost',
      students: '+150',
      rating: '4.6'
    },
    {
      img: 'assets/images/admin/img-course-8.png',
      type: 'free',
      title: this.uiLocale.text('SEO Training Course'),
      duration: '10 Months',
      teacher: 'Cedric Kelly',
      students: '+60',
      rating: '4.3'
    }
  ];
}
