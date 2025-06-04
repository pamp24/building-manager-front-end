// angular import
import { Component, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { CdkStepperModule } from '@angular/cdk/stepper';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SiteDetailsComponent } from './site-details/site-details.component';

// third party
import { FileUploadControl, FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { QuillModule } from 'ngx-quill';

// rxjs
import { BehaviorSubject, Subscription } from 'rxjs';

// icons
import { IconService } from '@ant-design/icons-angular';
import { DeleteOutline, EditOutline, EyeOutline, UploadOutline } from '@ant-design/icons-angular/icons';

// bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-site',
  imports: [SharedModule, SiteDetailsComponent, CdkStepperModule, FileUploadModule, QuillModule],
  templateUrl: './site.component.html',
  styleUrl: './site.component.scss'
})
export class SiteComponent implements OnInit, OnDestroy {
  private iconService = inject(IconService);
  private modalService = inject(NgbModal);

  // public props
  fileSub = new Subscription();
  uploadedFiles: Array<File> = [];
  newUploadFile: Array<File> = [];

  // private props
  // eslint-disable-next-line
  readonly uploadedFile: BehaviorSubject<any> = new BehaviorSubject(null);

  readonly control = new FileUploadControl({ listVisible: true, accept: ['image/*'], discardInvalid: true, multiple: false }, [
    FileUploadValidators.accept(['image/*']),
    FileUploadValidators.filesLimit(1)
  ]);

  // constructor
  constructor() {
    this.iconService.addIcon(...[DeleteOutline, UploadOutline, EyeOutline, EditOutline, DeleteOutline]);
  }

  // life cycle
  ngOnInit(): void {
    this.fileSub = this.control.valueChanges.subscribe((values: Array<File>) => this.getImage(values[0]));
  }

  ngOnDestroy(): void {
    this.fileSub.unsubscribe();
  }

  // private method
  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e) => this.uploadedFile.next(e.target!.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next(null);
    }
  }

  presetColors = [
    {
      name: 'Preset 1',
      color_type: [
        {
          color: 'text-green-600'
        },
        {
          color: 'text-green-400'
        },
        {
          color: 'text-green-200'
        }
      ]
    },
    {
      name: 'Preset 2',
      color_type: [
        {
          color: 'text-yellow-600'
        },
        {
          color: 'text-yellow-400'
        },
        {
          color: 'text-yellow-200'
        }
      ]
    },
    {
      name: 'Preset 3',
      color_type: [
        {
          color: 'text-blue-600'
        },
        {
          color: 'text-blue-400'
        },
        {
          color: 'text-blue-200'
        }
      ]
    },
    {
      name: 'Preset 4',
      color_type: [
        {
          color: 'text-gray-600'
        },
        {
          color: 'text-gray-400'
        },
        {
          color: 'text-gray-200'
        }
      ]
    }
  ];

  layoutsColor = [
    {
      name: 'Nav Bar & Footer Background',
      subTitle: 'Fixed, scrolling & email',
      color: 'text-green-400',
      code: '#96D4BF'
    },
    {
      name: 'Navigation Bar Link',
      subTitle: 'Links when nav bar is fixed',
      color: 'text-red-500',
      code: '#FF602E'
    },
    {
      name: 'Navigation Bar',
      subTitle: 'Links when nav bar is scrolling',
      color: 'text-green-200',
      code: '#96C9D4'
    },
    {
      name: 'Homepage Headings & Subtitle',
      subTitle: 'When a background is set',
      color: 'text-gray-400',
      code: '#A7A6A6'
    },
    {
      name: 'Course Page Heading & Subtitle',
      subTitle: 'When a background is set',
      color: 'text-gray-200',
      code: '#E6F5F0'
    },
    {
      name: 'Headings',
      subTitle: '<h1> to <h5>',
      color: 'text-gray-500',
      code: '#737373'
    },
    {
      name: 'Body text',
      subTitle: '<body>, <p>',
      color: 'text-gray-800',
      code: '#3A3A3A'
    },
    {
      name: 'Buttons & Links',
      subTitle: '<a>, <button>',
      color: 'text-green-500',
      code: '#52c41a'
    }
  ];

  userList = [
    {
      image: 'assets/images/user/avatar-1.jpg',
      name: 'Airi Satou',
      date: '2023/09/12',
      time: '09:05 PM'
    },
    {
      image: 'assets/images/user/avatar-2.jpg',
      name: 'Ashton Cox',
      date: '2023/12/24',
      time: '09:05 PM'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      name: 'Bradley Greer',
      date: '2022/09/19',
      time: '09:05 PM'
    },
    {
      image: 'assets/images/user/avatar-4.jpg',
      name: 'Brielle Williamson',
      date: '2022/08/22',
      time: '09:05 PM'
    },
    {
      image: 'assets/images/user/avatar-5.jpg',
      name: 'Airi Satou',
      date: '2023/09/12',
      time: '09:05 PM'
    },
    {
      image: 'assets/images/user/avatar-6.jpg',
      name: 'Ashton Cox',
      date: '2023/12/24',
      time: '09:05 PM'
    },
    {
      image: 'assets/images/user/avatar-7.jpg',
      name: 'Bradley Greer',
      date: '2022/09/19',
      time: '09:05 PM'
    }
  ];

  schoolPage = [
    {
      title: 'Main Page',
      url: '/main.page',
      status: 'Published',
      background: 'text-bg-success'
    },
    {
      title: 'Login Page',
      url: '/login-page.design',
      status: 'Published',
      background: 'text-bg-success'
    },
    {
      title: 'Privacy Policy',
      url: '/privacy-policy',
      status: 'Unpublished',
      background: 'text-bg-danger'
    },
    {
      title: 'Main Page',
      url: '/main.page',
      status: 'Published',
      background: 'text-bg-success'
    },
    {
      title: 'Login Page',
      url: '/login-page.design',
      status: 'Published',
      background: 'text-bg-success'
    },
    {
      title: 'Privacy Policy',
      url: '/privacy-policy',
      status: 'Unpublished',
      background: 'text-bg-danger'
    },
    {
      title: 'Main Page',
      url: '/main.page',
      status: 'Published',
      background: 'text-bg-success'
    },
    {
      title: 'Login Page',
      url: '/login-page.design',
      status: 'Published',
      background: 'text-bg-success'
    },
    {
      title: 'Privacy Policy',
      url: '/privacy-policy',
      status: 'Unpublished',
      background: 'text-bg-danger'
    }
  ];

  bioModal(bioDetails: ElementRef) {
    this.modalService.open(bioDetails);
  }
}
