import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionalBusinessDTO } from 'src/app/theme/shared/models/professional.model';
import { ProfessionalReviewDTO } from 'src/app/theme/shared/models/professional-review.model';
import { ProfessionalService } from 'src/app/theme/shared/service/professional.service';
import { ProfessionalImageDTO } from 'src/app/theme/shared/models/professional-image.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-professional-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './professional-details-modal.component.html',
  styleUrls: ['./professional-details-modal.component.scss']
})
export class ProfessionalDetailsModalComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() professional!: ProfessionalBusinessDTO;

  reviews: ProfessionalReviewDTO[] = [];
  loadingReviews = false;
  submittingReview = false;

  rating = 5;
  comment = '';

  images: ProfessionalImageDTO[] = [];
  loadingImages = false;
  uploadingImage = false;
  selectedImageFile: File | null = null;
  makePrimary = false;
  currentImageIndex = 0;

  readonly backendUrl = `${environment.apiUrl}/api/v1`;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private professionalService: ProfessionalService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
    this.loadImages();
  }

  loadReviews(): void {
    this.loadingReviews = true;

    this.professionalService.getReviews(this.professional.id).subscribe({
      next: (res) => {
        this.reviews = res ?? [];
        this.loadingReviews = false;
      },
      error: () => {
        this.reviews = [];
        this.loadingReviews = false;
      }
    });
  }

  submitReview(): void {
    if (!this.rating || this.rating < 1 || this.rating > 5) return;

    this.submittingReview = true;

    this.professionalService
      .createReview(this.professional.id, {
        rating: this.rating,
        comment: this.comment
      })
      .subscribe({
        next: () => {
          this.comment = '';
          this.rating = 5;
          this.submittingReview = false;
          this.loadReviews();
        },
        error: () => {
          this.submittingReview = false;
        }
      });
  }

  getStars(rating: number): number[] {
    return Array(rating || 0).fill(0);
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'ELECTRICIAN':
        return this.uiLocale.text('Electrician');
      case 'PLUMBER':
        return this.uiLocale.text('Plumber');
      case 'ELEVATOR_TECHNICIAN':
        return this.uiLocale.text('Elevator technician');
      case 'CLEANING_SERVICE':
        return this.uiLocale.text('Cleaning');
      case 'HEATING_TECHNICIAN':
        return this.uiLocale.text('Heating');
      case 'LOCKSMITH':
        return this.uiLocale.text('Locker');
      case 'AIR_CONDITION_TECHNICIAN':
        return this.uiLocale.text('Air conditioning');
      case 'PAINTER':
        return this.uiLocale.text('Oil painter');
      case 'PEST_CONTROL':
        return this.uiLocale.text('Exterminations');
      case 'GENERAL_REPAIRS':
        return this.uiLocale.text('General Repairs');
      default:
        return category;
    }
  }

  loadImages(): void {
    this.loadingImages = true;

    this.professionalService.getImages(this.professional.id).subscribe({
      next: (res) => {
        this.images = res ?? [];
        this.currentImageIndex = this.images.length ? Math.min(this.currentImageIndex, this.images.length - 1) : 0;
        this.loadingImages = false;
      },
      error: () => {
        this.images = [];
        this.loadingImages = false;
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.selectedImageFile = null;
      return;
    }

    this.selectedImageFile = file;
  }

  uploadSelectedImage(): void {
    if (!this.selectedImageFile) return;

    this.uploadingImage = true;

    this.professionalService.uploadImage(this.professional.id, this.selectedImageFile, this.makePrimary).subscribe({
      next: () => {
        this.selectedImageFile = null;
        this.makePrimary = false;
        this.uploadingImage = false;
        this.loadImages();
      },
      error: () => {
        this.uploadingImage = false;
      }
    });
  }

  deleteImage(imageId: number): void {
    const confirmed = confirm(this.uiLocale.text('Are you sure you want to delete this image?'));

    if (!confirmed) return;

    this.professionalService.deleteImage(imageId).subscribe({
      next: () => this.loadImages()
    });
  }

  setPrimary(imageId: number): void {
    this.professionalService.setPrimaryImage(imageId).subscribe({
      next: () => this.loadImages()
    });
  }

  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return 'assets/images/admin/img-course-1.png';
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    return `${this.backendUrl}${imageUrl}`;
  }

  getPrimaryImageUrl(): string {
    const primary = this.images.find((img) => img.primaryImage);
    const first = this.images[0];

    return this.getFullImageUrl(primary?.imageUrl || first?.imageUrl || '');
  }

  getCurrentUserId(): number | null {
    const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    if (!raw) return null;

    try {
      return JSON.parse(raw)?.id ?? null;
    } catch {
      return null;
    }
  }

  canManageBusiness(): boolean {
    const currentUserId = this.getCurrentUserId();

    return currentUserId != null && this.professional.createdByUserId === currentUserId;
  }

  goToManage(): void {
    this.activeModal.close();
    this.router.navigate(['/professionals/manage', this.professional.id]);
  }

  getCurrentImageUrl(): string {
    if (!this.images.length) {
      return 'assets/images/admin/img-course-1.png';
    }

    const currentImage = this.images[this.currentImageIndex];

    return this.getFullImageUrl(currentImage?.imageUrl);
  }

  previousImage(): void {
    if (!this.images.length) return;

    this.currentImageIndex = this.currentImageIndex === 0 ? this.images.length - 1 : this.currentImageIndex - 1;
  }

  nextImage(): void {
    if (!this.images.length) return;

    this.currentImageIndex = this.currentImageIndex === this.images.length - 1 ? 0 : this.currentImageIndex + 1;
  }
}
