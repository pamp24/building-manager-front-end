// angular import
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

//icons
import { IconService } from '@ant-design/icons-angular';
import { AimOutline, EnvironmentOutline, MailOutline, PhoneOutline } from '@ant-design/icons-angular/icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BuildingService } from '../../../../../theme/shared/service/building.service';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';

@Component({
  selector: 'app-profiles',
  imports: [CommonModule, SharedModule],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss'
})
export class ProfilesComponent implements OnInit {
  private iconService = inject(IconService);
  buildingForm: FormGroup;
  building?: BuildingDTO;
  errorMessage: string = '';
  buildingData!: BuildingDTO;
  details: { icon: string; text: string }[] = [];

  //ngOnInit
  ngOnInit(): void {
    this.buildingForm = this.fb.group({
      name: [''],
      street1: [''],
      stNumber1: [''],
      street2: [''],
      stNumber2: [''],
      city: [''],
      region: [''],
      postalCode: [''],
      country: [''],
      state: [''],
      floors: [''],
      apartmentsNum: [''],
      sqMetersTotal: [''],
      sqMetersCommonSpaces: [''],
      parkingExists: [false],
      parkingSpacesNum: ['']
    });

    this.buildingService.getMyBuilding().subscribe({
      next: (data) => {
        this.buildingData = data;
        this.buildingForm.patchValue(data); // Προγεμίζει τη φόρμα
      }
    });

    this.buildingService.getMyBuilding().subscribe((data: BuildingDTO) => {
      this.buildingData = data;
      this.details = [
        {
          icon: 'mail',
          text: data?.managerEmail || 'Δεν έχει οριστεί'
        },
        {
          icon: 'phone',
          text: data?.managerPhone || 'Μη διαθέσιμο'
        },
                {
          icon: 'environment',
          text: data?.managerCity || 'Άγνωστη περιοχή'
        },
        {
          icon: 'aim',
          text: data?.managerAddress1 || 'Άγνωστη περιοχή'
        },
      ];
    });
  }

  // constructor
  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService
  ) {
    this.iconService.addIcon(...[MailOutline, PhoneOutline, AimOutline, EnvironmentOutline]);
    this.buildingForm = this.fb.group({
      name: ['', Validators.required],
      street1: ['', Validators.required],
      stNumber1: ['', Validators.required],
      street2: [''],
      stNumber2: [''],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      floors: ['', Validators.required],
      apartmentsNum: ['', Validators.required],
      sqMetersTotal: ['', Validators.required],
      sqMetersCommonSpaces: ['', Validators.required],
      parkingExists: [],
      parkingSpacesNum: [],
      active: [],
      enable: []
    });

    // Διαχείριση ενεργοποίησης/απενεργοποίησης του πεδίου parkingSpacesNum
    this.buildingForm.get('parkingExists')?.valueChanges.subscribe((value) => {
      const control = this.buildingForm.get('parkingSpacesNum');
      if (value) {
        control?.enable();
      } else {
        control?.disable();
      }
    });
  }

  submitChanges(): void {
    if (this.buildingForm.valid) {
      console.log('Updated Building:', this.buildingForm.value);
      // εδώ μπορείς να στείλεις το update στο backend
    }
  }

  skills = [
    {
      title: 'Junior',
      value: 30
    },
    {
      title: 'UX Researcher',
      value: 80
    },
    {
      title: 'Wordpress',
      value: 90
    },
    {
      title: 'HTML',
      value: 30
    },
    {
      title: 'Graphic Design',
      value: 95
    },
    {
      title: 'Code Style',
      value: 75
    }
  ];

  personal_details = [
    {
      title: 'Full Name',
      name: 'Anshan Handgun',
      sub_title: 'Father Name',
      f_name: 'Mr. Deepen Handgun',
      style: 'pt-0'
    },
    {
      title: 'Phone',
      name: '(+1-876) 8654 239 581',
      sub_title: 'Country',
      f_name: 'New York'
    },
    {
      title: 'Email',
      name: 'anshan.dh81@gmail.com',
      sub_title: 'Zip Code',
      f_name: '956 754'
    },
    {
      title: 'Address',
      name: 'Street 110-B Kalians Bag, Dewan, M.P. New York',
      style: 'pb-0'
    }
  ];

  education = [
    {
      title: 'Master Degree (Year)',
      detail: '2014-2017',
      sub_detail: '-',
      style: 'pt-0'
    },
    {
      title: 'Bachelor (Year)',
      detail: '2011-2013',
      sub_detail: 'Imperial College London'
    },
    {
      title: 'School (Year)',
      detail: '2009-2011',
      sub_detail: 'School of London, England',
      style: 'pb-0'
    }
  ];

  employment = [
    {
      title: 'Senior',
      name: 'Senior UI/UX designer (Year)',
      sub_title: 'Job Responsibility',
      f_name:
        'Perform task related to project manager with the 100+ team under my observation. Team management is key role in this company',
      style: 'pt-0'
    },
    {
      title: 'Trainee cum Project Manager (Year)',
      name: '2017-2019',
      sub_title: 'Job Responsibility',
      f_name: 'Team management is key role in this company.'
    },
    {
      title: 'School (Year)',
      name: '2009-2011',
      sub_title: 'Institute',
      f_name: 'School of London, England',
      style: 'pb-0'
    }
  ];
}
