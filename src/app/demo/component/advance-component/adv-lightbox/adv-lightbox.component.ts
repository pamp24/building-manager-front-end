import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// Angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third Party
import { Image, ModalGalleryService, ModalLibConfig } from '@ks89/angular-modal-gallery';

@Component({
  selector: 'app-adv-lightbox',
  imports: [CommonModule, SharedModule],
  templateUrl: './adv-lightbox.component.html',
  styleUrls: ['./adv-lightbox.component.scss']
})
export default class AdvLightboxComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private modalGalleryService = inject(ModalGalleryService);

  // private props
  imageIndex = 0;

  // private method
  openModal(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    if (imagesArrayToUse.length === 0) {
      console.error('Cannot open modal-gallery because images array cannot be empty');
      return;
    }
    if (imageIndex > imagesArrayToUse.length - 1) {
      console.error('Cannot open modal-gallery because imageIndex must be valid');
      return;
    }
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig
    });
  }

  images: Image[] = [
    new Image(0, {
      img: 'assets/images/light-box/sl3.jpg',
      extUrl: 'http://www.google.com'
    }),
    new Image(1, {
      img: 'assets/images/light-box/sl4.jpg',
      description: this.uiLocale.text('Description 2')
    }),
    new Image(2, {
      img: 'assets/images/light-box/sl5.jpg',
      description: this.uiLocale.text('Description 3')
    }),
    new Image(3, {
      img: 'assets/images/light-box/sl6.jpg',
      description: this.uiLocale.text('Description 4')
    })
  ];

  Images = [
    {
      src: 'assets/images/light-box/sl3.jpg'
    },
    {
      src: 'assets/images/light-box/sl4.jpg'
    },
    {
      src: 'assets/images/light-box/sl5.jpg'
    },
    {
      src: 'assets/images/light-box/sl6.jpg'
    }
  ];
}
