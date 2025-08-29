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
  selector: 'app-building',
  imports: [CommonModule, SharedModule],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss'
})
export class BuildingComponent implements OnInit {
  private iconService = inject(IconService);
  buildingForm: FormGroup;
  building?: BuildingDTO;
  errorMessage: string = '';
  buildingData!: BuildingDTO;

  buildings: BuildingDTO[] = [];
  total = 0;
  currentPage = 1;
  pageSize = 1;
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
      parkingExist: [''],
      parkingSpacesNum: [''],
      buildingDescription: [''],
      undergroundFloorExist: [''],
      halfFloorExist: [''],
      overTopFloorExist: [''],
      storageExist: [''],
      storageNum: ['']
    });

    this.buildingService.getMyBuildings().subscribe({
      next: (data: BuildingDTO[]) => {
        this.buildings = data;
        this.total = data.length;
        if (data.length > 0) {
          this.loadBuilding(data[0]); // πρώτο building
        }
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικιών:', err);
      }
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
      parkingExist: [''],
      parkingSpacesNum: [''],
      buildingDescription: [''],
      undergroundFloorExist: [''],
      halfFloorExist: [''],
      overTopFloorExist: [''],
      storageExist: [''],
      storageNum: ['']
    });

    // Διαχείριση ενεργοποίησης/απενεργοποίησης του πεδίου parkingSpacesNum
    this.buildingForm.get('parkingExist')?.valueChanges.subscribe((value) => {
      const control = this.buildingForm.get('parkingSpacesNum');
      if (value) {
        control?.enable();
      } else {
        control?.disable();
      }
    });
    // Διαχείριση ενεργοποίησης/απενεργοποίησης του πεδίου storageNum
    this.buildingForm.get('storageExist')?.valueChanges.subscribe((value) => {
      const control = this.buildingForm.get('storageNum');
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

  loadBuilding(building: BuildingDTO) {
    this.buildingData = building;
    this.buildingForm.patchValue(building);

    this.details = [
      {
        icon: 'mail',
        text: building?.managerEmail || 'Δεν έχει οριστεί'
      },
      {
        icon: 'phone',
        text: building?.managerPhone || 'Μη διαθέσιμο'
      },
      {
        icon: 'environment',
        text: building?.managerCity || 'Άγνωστη περιοχή'
      },
      {
        icon: 'aim',
        text: building?.managerAddress1 || 'Άγνωστη περιοχή'
      }
    ];
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const building = this.buildings[page - 1];
    if (building) {
      this.loadBuilding(building);
    }
  }

  skills = [
    {
      title: 'Πάρκινγκ',
      value: 30
    },
    {
      title: 'Αποθήκη',
      value: 80
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
