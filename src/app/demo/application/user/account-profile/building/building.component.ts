import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AimOutline, EnvironmentOutline, MailOutline, PhoneOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingDocumentDTO } from 'src/app/theme/shared/models/building-document.model';

@Component({
  selector: 'app-building',
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss'
})
export class BuildingComponent implements OnInit {
  @Input() buildingId?: number;
  @Output() companyPresenceChange = new EventEmitter<boolean>();
  @Input() pmView = false;

  private readonly apiBase = `${environment.apiUrl}/api/v1`;
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

  isLoadingDocuments = false;
  isUploadingDocuments = false;
  selectedUploadFiles: File[] = [];
  selectedDocumentCategory = 'OTHER';

  isUploadingBuildingImage = false;
  selectedBuildingImage?: File;

  readonly acceptedBuildingImageTypes = '.jpg,.jpeg,.png,.webp';
  readonly maxBuildingImageSizeMb = 10;

  readonly acceptedDocumentTypes = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx';
  readonly maxUploadFiles = 10;
  readonly maxUploadFileSizeMb = 10;
  readonly documentCategories = ['REGULATION', 'FLOOR_PLAN', 'CONTRACT', 'INSURANCE', 'INVOICE', 'CERTIFICATE', 'TECHNICAL', 'OTHER'];

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private authService: AuthenticationService
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

    this.buildingForm.disable();

    if (this.buildingId) {
      this.loadBuildingById(this.buildingId);
      return;
    }

    this.buildingService.getMyBuildings().subscribe({
      next: (data: BuildingDTO[]) => {
        this.buildings = data;
        this.total = data.length;
        if (data.length > 0) {
          this.loadBuilding(data[0]);
        }
      },
      error: (err) => console.error('Σφάλμα φόρτωσης πολυκατοικιών:', err)
    });
  }

  get buildingDocuments(): BuildingDocumentDTO[] {
    return this.buildingData?.documents ?? [];
  }

  get buildingCoverUrl(): string {
    return this.buildingData?.profileImageUrl ? this.resolveDocumentUrl(this.buildingData.profileImageUrl) : 'assets/images/admin/img-course-1.png';
  }

  private loadBuildingById(id: number): void {
    this.buildingService.getBuilding(id).subscribe({
      next: (building) => this.loadBuilding(building),
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικίας:', err);
        this.companyPresenceChange.emit(false);
      }
    });
  }

  submitChanges(): void {
    if (!this.buildingForm.valid || !this.buildingData) {
      return;
    }

    const updated = { ...this.buildingData, ...this.buildingForm.value };
    this.buildingService.updateBuilding(this.buildingData.id, updated).subscribe({
      next: (data) => {
        this.buildingData = data;
        this.toggleEdit();
        this.loadBuildingDocuments(data.id);
        alert('Οι αλλαγές αποθηκεύτηκαν με επιτυχία!');
      },
      error: (err) => {
        console.error('Σφάλμα αποθήκευσης:', err);
        alert('Αποτυχία αποθήκευσης αλλαγών.');
      }
    });
  }

  loadBuilding(building: BuildingDTO): void {
    this.buildingData = building;
    this.buildingForm.patchValue(building);

    this.companyPresenceChange.emit(!!building.company);

    if (this.buildingData.managerProfileImgUrl?.startsWith('/uploads/')) {
      this.buildingData.managerProfileImgUrl = this.apiBase + this.buildingData.managerProfileImgUrl;
    }

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

    this.loadBuildingDocuments(building.id);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    const building = this.buildings[page - 1];
    if (building) {
      this.loadBuilding(building);
    }
  }

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

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.buildingForm.enable();
      return;
    }

    this.buildingForm.disable();
    this.buildingForm.patchValue(this.buildingData);
    this.selectedUploadFiles = [];
    this.selectedDocumentCategory = 'OTHER';
  }

  hasRole(role: string): boolean {
    return this.authService.currentUserValue?.role === role;
  }

  onDocumentFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const nextFiles = [...this.selectedUploadFiles];

    for (const file of Array.from(input.files)) {
      if (nextFiles.some((existing) => this.isSameFile(existing, file))) {
        continue;
      }

      if (!this.isAllowedDocument(file)) {
        alert(`Το αρχείο "${file.name}" δεν υποστηρίζεται.`);
        continue;
      }

      if (file.size > this.maxUploadFileSizeMb * 1024 * 1024) {
        alert(`Το αρχείο "${file.name}" ξεπερνά το όριο των ${this.maxUploadFileSizeMb}MB.`);
        continue;
      }

      if (nextFiles.length >= this.maxUploadFiles) {
        alert(`Μπορείτε να επιλέξετε έως ${this.maxUploadFiles} αρχεία.`);
        break;
      }

      nextFiles.push(file);
    }

    this.selectedUploadFiles = nextFiles;
    input.value = '';
  }

  removeSelectedUploadFile(index: number): void {
    this.selectedUploadFiles = this.selectedUploadFiles.filter((_, currentIndex) => currentIndex !== index);
  }

  uploadSelectedDocuments(): void {
    if (!this.buildingData?.id || this.selectedUploadFiles.length === 0 || this.isUploadingDocuments) {
      return;
    }

    this.isUploadingDocuments = true;

    this.buildingService
      .uploadBuildingDocuments(this.buildingData.id, this.selectedUploadFiles, this.selectedDocumentCategory)
      .subscribe({
        next: () => {
          this.selectedUploadFiles = [];
          this.selectedDocumentCategory = 'OTHER';
          this.loadBuildingDocuments(this.buildingData.id);
          this.isUploadingDocuments = false;
          alert('Τα αρχεία ανέβηκαν με επιτυχία!');
        },
        error: (err) => {
          console.error('Σφάλμα ανεβάσματος αρχείων:', err);
          this.isUploadingDocuments = false;
          alert(err?.error?.message || 'Η μεταφόρτωση αρχείων απέτυχε.');
        }
      });
  }

  onBuildingImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (!this.isAllowedBuildingImage(file)) {
      alert('Η εικόνα δεν υποστηρίζεται. Επιλέξτε JPG, PNG ή WEBP.');
      input.value = '';
      return;
    }

    if (file.size > this.maxBuildingImageSizeMb * 1024 * 1024) {
      alert(`Η εικόνα ξεπερνά το όριο των ${this.maxBuildingImageSizeMb}MB.`);
      input.value = '';
      return;
    }

    this.selectedBuildingImage = file;
    input.value = '';
  }

  uploadSelectedBuildingImage(): void {
    if (!this.buildingData?.id || !this.selectedBuildingImage || this.isUploadingBuildingImage) {
      return;
    }

    this.isUploadingBuildingImage = true;

    this.buildingService.uploadBuildingImage(this.buildingData.id, this.selectedBuildingImage).subscribe({
      next: (res) => {
        this.buildingData = { ...this.buildingData, profileImageUrl: res.imageUrl };
        this.selectedBuildingImage = undefined;
        this.isUploadingBuildingImage = false;
        alert('Η φωτογραφία ανέβηκε με επιτυχία!');
      },
      error: (err) => {
        console.error('Σφάλμα ανεβάσματος φωτογραφίας:', err);
        this.isUploadingBuildingImage = false;
        alert(err?.error?.message || 'Η μεταφόρτωση της φωτογραφίας απέτυχε.');
      }
    });
  }

  private isAllowedBuildingImage(file: File): boolean {
    const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;
    return allowedMimeTypes.has(file.type) || allowedExtensions.test(file.name);
  }

  getDocumentTypeLabel(document: BuildingDocumentDTO): string {
    const value = `${document.contentType ?? ''} ${document.fileName}`.toLowerCase();

    if (value.includes('pdf')) return 'PDF';
    if (value.match(/\.(jpg|jpeg|png|webp)\b/) || value.includes('image/')) return 'IMG';
    if (value.match(/\.(xls|xlsx)\b/) || value.includes('sheet')) return 'XLS';
    if (value.match(/\.(doc|docx)\b/) || value.includes('word')) return 'DOC';
    return 'FILE';
  }

  getDocumentCategoryKey(category?: string | null): string {
    return category || 'OTHER';
  }

  getDocumentSizeLabel(sizeBytes?: number | null): string {
    if (sizeBytes == null) {
      return 'Άγνωστο μέγεθος';
    }

    if (sizeBytes < 1024) return `${sizeBytes} B`;
    if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  getSelectedUploadFileTypeLabel(file: File): string {
    const value = `${file.type} ${file.name}`.toLowerCase();

    if (value.includes('pdf')) return 'PDF';
    if (value.match(/\.(jpg|jpeg|png|webp)\b/) || value.includes('image/')) return 'IMG';
    if (value.match(/\.(xls|xlsx)\b/) || value.includes('sheet')) return 'XLS';
    if (value.match(/\.(doc|docx)\b/) || value.includes('word')) return 'DOC';
    return 'FILE';
  }

  resolveDocumentUrl(fileUrl: string): string {
    const cleanUrl = fileUrl.trim().replace(/\\/g, '/');

    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    if (cleanUrl.startsWith('/uploads/')) {
      return `${this.apiBase}${cleanUrl}`;
    }

    if (cleanUrl.startsWith('uploads/')) {
      return `${this.apiBase}/${cleanUrl}`;
    }

    return cleanUrl;
  }

  private loadBuildingDocuments(buildingId: number): void {
    this.isLoadingDocuments = true;

    this.buildingService.getBuildingDocuments(buildingId).subscribe({
      next: (documents) => {
        this.buildingData = { ...this.buildingData, documents };
        this.isLoadingDocuments = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης αρχείων πολυκατοικίας:', err);
        this.buildingData = { ...this.buildingData, documents: [] };
        this.isLoadingDocuments = false;
      }
    });
  }

  private isAllowedDocument(file: File): boolean {
    const allowedMimeTypes = new Set([
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]);

    const allowedExtensions = /\.(pdf|jpg|jpeg|png|webp|doc|docx|xls|xlsx)$/i;
    return allowedMimeTypes.has(file.type) || allowedExtensions.test(file.name);
  }

  private isSameFile(left: File, right: File): boolean {
    return left.name === right.name && left.size === right.size && left.lastModified === right.lastModified;
  }
}
