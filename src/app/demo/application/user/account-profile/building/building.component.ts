// angular import
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { AimOutline, EnvironmentOutline, MailOutline, PhoneOutline } from '@ant-design/icons-angular/icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';

@Component({
  selector: 'app-building',
  imports: [CommonModule, SharedModule],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss'
})
export class BuildingComponent implements OnInit {
  private iconService = inject(IconService);
  buildingForm!: FormGroup;
  buildingData!: BuildingDTO;
  heating: { title: string; name: string; sub_title: string; f_name: string }[] = [];
  buildings: BuildingDTO[] = [];
  total = 0;
  currentPage = 1;
  pageSize = 1;
  details: { icon: string; text: string }[] = [];
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService
  ) {
    this.iconService.addIcon(...[MailOutline, PhoneOutline, AimOutline, EnvironmentOutline]);
  }

  ngOnInit(): void {
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
      parkingExist: [false],
      parkingSpacesNum: [''],
      buildingDescription: [''],
      undergroundFloorExist: [false],
      halfFloorExist: [false],
      overTopFloorExist: [false],
      storageExist: [false],
      storageNum: [''],
      hasCentralHeating: [false],
      heatingType: [''],
      heatingCapacityLitres: ['']
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

    // ξεκινάει σε read-only mode
    this.buildingForm.disable();
  }

  submitChanges(): void {
    if (this.buildingForm.valid && this.buildingData) {
      const updated = { ...this.buildingData, ...this.buildingForm.value };
      this.buildingService.updateBuilding(this.buildingData.id, updated).subscribe({
        next: (data) => {
          this.buildingData = data;
          this.toggleEdit();
          alert('Οι αλλαγές αποθηκεύτηκαν με επιτυχία!');
        },
        error: (err) => {
          console.error('Σφάλμα αποθήκευσης:', err);
          alert('Αποτυχία αποθήκευσης αλλαγών.');
        }
      });
    }
  }

  loadBuilding(building: BuildingDTO) {
    this.buildingData = building;
    this.buildingForm.patchValue(building);

    this.details = [
      { icon: 'mail', text: building?.managerEmail || 'Δεν έχει οριστεί' },
      { icon: 'phone', text: building?.managerPhone || 'Μη διαθέσιμο' },
      { icon: 'environment', text: building?.managerCity || 'Άγνωστη περιοχή' },
      { icon: 'aim', text: building?.managerAddress1 || 'Άγνωστη περιοχή' }
    ];

    this.heating = [
      {
        title: 'Τύπος Θέρμανσης',
        name: this.getTranslatedHeatingType(building?.heatingType),
        sub_title: 'Χωρητικότητα (Λίτρα)',
        f_name: building?.heatingCapacityLitres ? building.heatingCapacityLitres.toString() : '—'
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
    { title: 'Πάρκινγκ', value: 30 },
    { title: 'Αποθήκη', value: 80 }
  ];

  getTranslatedHeatingType(type?: string): string {
    switch (type) {
      case 'OIL':
        return 'Πετρέλαιο';
      case 'NATURAL_GAS':
        return 'Φυσικό Αέριο';
      case 'ELECTRIC':
        return 'Ηλεκτρικό';
      case 'HEAT_PUMP':
        return 'Αντλία Θερμότητας';
      case 'NONE':
        return 'Καθόλου θέρμανση';
      default:
        return 'Δεν έχει οριστεί';
    }
  }

toggleEdit() {
  this.isEditing = !this.isEditing;
  if (this.isEditing) {
    this.buildingForm.enable();
  } else {
    this.buildingForm.disable();
    this.buildingForm.patchValue(this.buildingData); // reset
  }
}
}
