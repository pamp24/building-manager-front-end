import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// angular import
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { BulkBuildingsComponent } from './bulk-buildings.component';
import { RouterModule } from '@angular/router';

// icons
import { IconService } from '@ant-design/icons-angular';
import { EditOutline } from '@ant-design/icons-angular/icons';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { environment } from 'src/environments/environment';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-buildings',
  imports: [SharedModule, RouterModule, BulkBuildingsComponent],
  templateUrl: './buildings.component.html',
  styleUrl: './buildings.component.scss'
})
export class BuildingsViewComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);
  private modal = inject(NgbModal);
  private auth = inject(AuthenticationService);

  get isPropertyManager(): boolean {
    return this.auth.currentUserValue?.role === 'PropertyManager';
  }
  bulkSending = false;
  bulkRefresh = false;
  openBulk(content: TemplateRef<unknown>): void {
    if (!this.isPropertyManager) return;
    this.bulkRefresh = false;
    this.bulkSending = false;
    const ref = this.modal.open(content, { size: 'lg', scrollable: true, beforeDismiss: () => !this.bulkSending });
    ref.result.then(
      () => {
        if (this.bulkRefresh) this.load();
      },
      () => {
        if (this.bulkRefresh) this.load();
      }
    );
  }

  buildings: BuildingDTO[] = [];
  loading = true;
  error?: string;
  readonly placeholderImage = 'assets/images/admin/img-course-1.png';

  imageUrl(value: string | null | undefined): string {
    const url = value?.trim().replace(/\\/g, '/') || '';
    if (/^https?:\/\//i.test(url)) {
      try {
        const parsed = new URL(url);
        return parsed.username || parsed.password ? this.placeholderImage : parsed.href;
      } catch {
        return this.placeholderImage;
      }
    }
    if (/^\/?(?:api\/v1\/)?uploads\//.test(url)) {
      return `${environment.apiUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    }
    return this.placeholderImage;
  }

  imageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (image.getAttribute('src') !== this.placeholderImage) {
      image.src = this.placeholderImage;
    }
  }

  constructor(private buildingService: BuildingService) {
    this.iconService.addIcon(...[EditOutline]);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    this.buildingService.getMyBuildings().subscribe({
      next: (data) => {
        this.buildings = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = this.uiLocale.text('Failed to load company apartment buildings.');
      }
    });
  }

  trackById = (_: number, b: BuildingDTO) => b.id;
}
