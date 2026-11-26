import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProfessionalBusinessDTO } from 'src/app/theme/shared/models/professional.model';
import { ProfessionalImageDTO } from 'src/app/theme/shared/models/professional-image.model';
import { environment } from 'src/environments/environment';
import { ProfessionalService } from 'src/app/theme/shared/service/professional.service';

@Component({
  selector: 'app-professional-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedModule],
  templateUrl: './professional-manage.component.html',
  styleUrls: ['./professional-manage.component.scss']
})
export class ProfessionalManageComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  private readonly phonePattern = /^\+?[0-9()\-\s]{8,20}$/;
  private readonly websitePattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;
  private readonly taxNumberPattern = /^[A-Za-z0-9-]{8,15}$/;
  private route = inject(ActivatedRoute);
  private professionalService = inject(ProfessionalService);
  private location = inject(Location);

  readonly backendUrl = `${environment.apiUrl}/api/v1`;

  professionalId!: number;
  professional?: ProfessionalBusinessDTO;

  images: ProfessionalImageDTO[] = [];

  loading = false;
  saving = false;
  uploading = false;

  error = '';
  success = '';

  selectedImageFile: File | null = null;
  makePrimary = false;

  editMode = false;

  ngOnInit(): void {
    this.professionalId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.professionalId || Number.isNaN(this.professionalId)) {
      this.error = this.uiLocale.text('Invalid business id.');
      return;
    }

    this.loadBusiness();
    this.loadImages();
  }

  loadBusiness(): void {
    this.loading = true;

    this.professionalService.getById(this.professionalId).subscribe({
      next: (res) => {
        this.professional = res;
        this.loading = false;
      },
      error: () => {
        this.error = this.uiLocale.text('Failed to load business.');
        this.loading = false;
      }
    });
  }

  saveBusiness(): void {
    if (!this.professional) return;

    const validationError = this.validateBusiness();

    if (validationError) {
      this.error = validationError;
      this.success = '';
      return;
    }

    this.saving = true;
    this.error = '';
    this.success = '';

    const payload = {
      businessName: this.professional.businessName,
      ownerFullName: this.professional.ownerFullName,
      category: this.professional.category,
      description: this.professional.description,
      phone: this.professional.phone,
      email: this.professional.email,
      website: this.professional.website,
      country: this.professional.country,
      city: this.professional.city,
      region: this.professional.region,
      area: this.professional.area,
      address: this.professional.address,
      taxNumber: this.professional.taxNumber,
      workingHours: this.professional.workingHours
    };

    this.professionalService.update(this.professionalId, payload).subscribe({
      next: (res) => {
        this.professional = res;
        this.success = this.uiLocale.text('The data was saved successfully.');
        this.saving = false;
        this.editMode = false;
      },
      error: () => {
        this.error = this.uiLocale.text('Failed to save data.');
        this.saving = false;
      }
    });
  }

  loadImages(): void {
    this.professionalService.getImages(this.professionalId).subscribe({
      next: (res) => {
        this.images = res ?? [];
      },
      error: () => {
        this.images = [];
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImageFile = input.files?.[0] ?? null;
  }

  uploadSelectedImage(): void {
    if (!this.selectedImageFile) return;

    this.uploading = true;

    this.professionalService.uploadImage(this.professionalId, this.selectedImageFile, this.makePrimary).subscribe({
      next: () => {
        this.selectedImageFile = null;
        this.makePrimary = false;
        this.uploading = false;
        this.loadImages();
        this.loadBusiness();
      },
      error: () => {
        this.error = this.uiLocale.text('Failed to upload image.');
        this.uploading = false;
      }
    });
  }

  setPrimary(imageId: number): void {
    this.professionalService.setPrimaryImage(imageId).subscribe({
      next: () => {
        this.loadImages();
        this.loadBusiness();
      }
    });
  }

  deleteImage(imageId: number): void {
    if (!confirm(this.uiLocale.text('Are you sure you want to delete this image?'))) return;

    this.professionalService.deleteImage(imageId).subscribe({
      next: () => {
        this.loadImages();
        this.loadBusiness();
      }
    });
  }

  getFullImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'assets/images/admin/img-course-1.png';
    if (imageUrl.startsWith('http')) return imageUrl;

    return `${this.backendUrl}${imageUrl}`;
  }

  goBack(): void {
    this.location.back();
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.loadBusiness();
  }

  private validateBusiness(): string {
    const phone = this.professional?.phone?.trim() ?? '';
    const website = this.professional?.website?.trim() ?? '';
    const taxNumber = this.professional?.taxNumber?.trim() ?? '';

    if (!phone || !this.phonePattern.test(phone)) {
      return this.uiLocale.text('Please enter a valid phone number.');
    }

    if (website && !this.websitePattern.test(website)) {
      return this.uiLocale.text('Please enter a valid website.');
    }

    if (taxNumber && !this.taxNumberPattern.test(taxNumber)) {
      return this.uiLocale.text('Please enter a valid VAT number.');
    }

    return '';
  }
}
