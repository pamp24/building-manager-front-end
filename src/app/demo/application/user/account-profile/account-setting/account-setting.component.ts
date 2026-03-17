// angular import
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingNotificationSettingsDTO } from 'src/app/theme/shared/models/buildingNotificationSettingsDTO';
import { BuildingSettingsService } from '../../../../../theme/shared/service/building-settings.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';

@Component({
  selector: 'app-account-setting',
  imports: [CommonModule, SharedModule, FormsModule, RouterModule],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss'
})
export class AccountSettingComponent implements OnInit, OnChanges {
  @Input() pmView = false;
  @Input() buildingId?: number;
  initialSettingsJson = '';
  building?: BuildingDTO;
  buildingName = '';
  buildingAddress = '';
  messageBuilding = '';
  loading = false;
  saving = false;

  settings?: BuildingNotificationSettingsDTO;

  constructor(
    private buildingSettingsService: BuildingSettingsService,
    private buildingService: BuildingService
  ) {}

  ngOnInit(): void {
    if (this.buildingId) {
      this.loadSelectedBuilding(this.buildingId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingId'] && this.buildingId) {
      this.loadSelectedBuilding(this.buildingId);
    }
  }

  private loadSelectedBuilding(buildingId: number): void {
    this.loading = true;

    this.buildingService.getBuilding(buildingId).subscribe({
      next: (building) => {
        this.building = building;
        this.buildingName = building.name;
        this.buildingAddress = `${building.street1} ${building.stNumber1}, ${building.city}`;
        this.messageBuilding = '';

        this.loadNotificationSettings(buildingId);
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικίας:', err);
        this.messageBuilding = 'Αποτυχία φόρτωσης στοιχείων πολυκατοικίας.';
        this.loading = false;
      }
    });
  }

  private loadNotificationSettings(buildingId: number): void {
    this.buildingSettingsService.getNotificationSettings(buildingId).subscribe({
      next: (settings) => {
        this.settings = settings;

        this.email_setting = [
          { title: 'Ειδοποιήση για την έκδοση κοινοχρήστων', check: settings.emailForStatementIssued },
          { title: 'Ειδοποιήση για νέα ψηφοφορία στην πολυκατοικία', check: settings.emailForNewPoll },
          { title: 'Ειδοποιήση για νέα ανακοίνωση στην πολυκατοικία', check: settings.emailForNewAnnouncement }
        ];

        this.notification = [
          { title: 'Ειδοποιήση αιτήματος για είσοδο νέου μέλους στην πολυκατοικία', check: settings.appForJoinRequest },
          { title: 'Ειδοποιήση για έξοδο μέλους από την πολυκατοικία', check: settings.appForMemberLeave },
          { title: 'Ειδοποιήση για πληρωμή κοινοχρήστων από μέλος της πολυκατοικίας', check: settings.appForPaymentCompleted },
          { title: 'Ειδοποιήση για νέα ψηφοφορία στην πολυκατοικία', check: settings.appForNewPoll },
          { title: 'Ειδοποιήση για νέα ανακοίνωση στην πολυκατοικία', check: settings.appForNewAnnouncement }
        ];

        this.active_email = [
          { title: 'Όταν κάποιος κάνει αλλαγές στο διαμέρισμά του', check: settings.managerEmailForApartmentChanges },
          { title: 'Λάβατε άμεσο μήνυμα', check: settings.managerEmailForDirectMessage },
          { title: 'Κάποιος σας προσέθεσε σε μια νέα πολυκατοικία', check: settings.managerEmailForAddedToBuilding }
        ];

        const payload = this.buildSettingsPayload();
        this.initialSettingsJson = JSON.stringify(payload);

        this.loading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης ρυθμίσεων:', err);
        this.loading = false;
      }
    });
  }

  get hasChanges(): boolean {
    const currentPayload = this.buildSettingsPayload();
    if (!currentPayload) return false;

    return JSON.stringify(currentPayload) !== this.initialSettingsJson;
  }

  saveSettings(): void {
    if (!this.buildingId) return;

    const payload: BuildingNotificationSettingsDTO = {
      buildingId: this.buildingId,

      emailForStatementIssued: this.email_setting[0].check,
      emailForNewPoll: this.email_setting[1].check,
      emailForNewAnnouncement: this.email_setting[2].check,

      appForJoinRequest: this.notification[0].check,
      appForMemberLeave: this.notification[1].check,
      appForPaymentCompleted: this.notification[2].check,
      appForNewPoll: this.notification[3].check,
      appForNewAnnouncement: this.notification[4].check,

      managerEmailForApartmentChanges: this.active_email[0].check,
      managerEmailForDirectMessage: this.active_email[1].check,
      managerEmailForAddedToBuilding: this.active_email[2].check
    };

    this.saving = true;

    this.buildingSettingsService.updateNotificationSettings(this.buildingId, payload).subscribe({
      next: () => {
        const payload = this.buildSettingsPayload();
        this.initialSettingsJson = JSON.stringify(payload);

        this.saving = false;
        alert('Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς.');
      },
      error: (err) => {
        console.error('Σφάλμα αποθήκευσης ρυθμίσεων:', err);
        this.saving = false;
        alert('Αποτυχία αποθήκευσης ρυθμίσεων.');
      }
    });
  }

  email_setting = [
    { title: 'Ειδοποιήση για την έκδοση κοινοχρήστων', check: true },
    { title: 'Ειδοποιήση για νέα ψηφοφορία στην πολυκατοικία', check: false },
    { title: 'Ειδοποιήση για νέα ανακοίνωση στην πολυκατοικία', check: false }
  ];

  notification = [
    { title: 'Ειδοποιήση αιτήματος για είσοδο νέου μέλους στην πολυκατοικία', check: true },
    { title: 'Ειδοποιήση για έξοδο μέλους από την πολυκατοικία', check: true },
    { title: 'Ειδοποιήση για πληρωμή κοινοχρήστων από μέλος της πολυκατοικίας', check: false },
    { title: 'Ειδοποιήση για νέα ψηφοφορία στην πολυκατοικία', check: false },
    { title: 'Ειδοποιήση για νέα ανακοίνωση στην πολυκατοικία', check: false }
  ];

  active_email = [
    { title: 'Όταν κάποιος κάνει αλλαγές στο διαμέρισμά του', check: true },
    { title: 'Λάβατε άμεσο μήνυμα', check: false },
    { title: 'Κάποιος σας προσέθεσε σε μια νέα πολυκατοικία', check: true }
  ];

  resetSettings(): void {
    if (!this.buildingId) return;

    if (!confirm('Θέλετε να ακυρώσετε τις αλλαγές και να επαναφέρετε τις αποθηκευμένες ρυθμίσεις;')) {
      return;
    }

    this.loadNotificationSettings(this.buildingId);
  }

  private buildSettingsPayload(): BuildingNotificationSettingsDTO | null {
    if (!this.buildingId) return null;

    return {
      buildingId: this.buildingId,

      emailForStatementIssued: this.email_setting[0].check,
      emailForNewPoll: this.email_setting[1].check,
      emailForNewAnnouncement: this.email_setting[2].check,

      appForJoinRequest: this.notification[0].check,
      appForMemberLeave: this.notification[1].check,
      appForPaymentCompleted: this.notification[2].check,
      appForNewPoll: this.notification[3].check,
      appForNewAnnouncement: this.notification[4].check,

      managerEmailForApartmentChanges: this.active_email[0].check,
      managerEmailForDirectMessage: this.active_email[1].check,
      managerEmailForAddedToBuilding: this.active_email[2].check
    };
  }
}
