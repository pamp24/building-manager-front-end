// angular import
import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import cardData from 'src/fake-data/user-card.json';
import { CardPreviewComponent } from './card-preview/card-preview.component';

// bootstrap import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// icons
import { IconService } from '@ant-design/icons-angular';
import { ApartmentService } from '../../../../theme/shared/service/apartment.service';
import {
  EnvironmentOutline,
  LinkOutline,
  MailOutline,
  MoreOutline,
  PhoneOutline,
  PlusOutline,
  SearchOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule, SharedModule, CardPreviewComponent],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  private modalService = inject(NgbModal);
  private iconService = inject(IconService);

  private apartmentService!: ApartmentService;

  // public method
  card_detail = cardData;

  // Constructor
constructor(apartmentService: ApartmentService) {
  this.apartmentService = apartmentService; // ← Εδώ το αποθηκεύεις σωστά
  this.iconService.addIcon(...[SearchOutline, PlusOutline, MoreOutline, MailOutline, PhoneOutline, EnvironmentOutline, LinkOutline]);
}

ngOnInit(): void {
  this.apartmentService.getApartmentsInSameBuilding().subscribe({
    next: (data) => {
      this.card_detail = data.map(ap => ({
        name: ap.ownerFullName || 'Άγνωστο Όνομα',
        position: `Διαμ. ${ap.number}, Όροφος ${ap.floor}`,
        src: 'assets/images/user/avatar-1.jpg',
        description: ap.apDescription || 'Δεν υπάρχει περιγραφή',
        email: ap.ownerEmail,
        phone: ap.ownerPhone,
        street: ap.ownerStreet,
        streetNumber: ap.ownerStreetNumber || 'Άγνωστος Αριθμός',
        city: ap.ownerCity,
        user_skill: [
          { skill: 'Χιλιοστά κοινοχρήστων: ' + ap.commonPercent},
          { skill: 'Χιλιοστά Κοινοχρήστων: ' + ap.elevatorPercent },
          { skill: 'Χιλιοστά Διαμερίσματος: ' + ap.heatingPercent }

        ]
      }));
    },
    error: (err) => {
      console.error('Σφάλμα φόρτωσης διαμερισμάτων:', err);
    }
  });
}

  // public method
  open(preview: ElementRef) {
    this.modalService.open(preview, { size: 'xl' });
  }
}
