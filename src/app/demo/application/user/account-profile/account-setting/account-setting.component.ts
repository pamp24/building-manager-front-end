// angular import
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingNotificationSettingsDTO } from 'src/app/theme/shared/models/buildingNotificationSettingsDTO';
import { NotificationPreferenceDTO } from 'src/app/theme/shared/models/notificationPreferenceDTO';
import { BuildingSettingsService } from '../../../../../theme/shared/service/building-settings.service';
import { NotificationPreferenceService } from '../../../../../theme/shared/service/notification-preference.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

interface SettingItem {
  key: string;
  title: string;
  check: boolean;
}

interface ManagerOption {
  title: string;
  appKey: string;
  appCheck: boolean;
  emailKey: string;
  emailCheck: boolean;
}

@Component({
  selector: 'app-account-setting',
  imports: [CommonModule, SharedModule, FormsModule, RouterModule],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss'
})
export class AccountSettingComponent implements OnInit, OnChanges {
  @Input() pmView = false;
  @Input() buildingId?: number;

  private activeBuildingId?: number;

  initialPrefsJson = '';
  initialBuildingJson = '';
  building?: BuildingDTO;
  buildingName = '';
  buildingAddress = '';
  messageBuilding = '';
  loading = false;
  saving = false;

  settings?: BuildingNotificationSettingsDTO;
  preferences?: NotificationPreferenceDTO;

  appItems: SettingItem[] = [];
  emailItems: SettingItem[] = [];
  smsItems: SettingItem[] = [];
  managerOptions: ManagerOption[] = [];
  memberCreateItems: SettingItem[] = [];

  isManager = false;

  constructor(
    private buildingSettingsService: BuildingSettingsService,
    private notificationPreferenceService: NotificationPreferenceService,
    private buildingService: BuildingService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.resolveBuilding();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingId'] && this.buildingId) {
      this.loadSelectedBuilding(this.buildingId);
    }
  }

  /**
   * Βρίσκει την πολυκατοικία που θα ρυθμιστούν οι ειδοποιήσεις.
   * Αν δεν δόθηκε buildingId (π.χ. από το προφίλ χρήστη), παίρνει
   * αυτόματα το τρέχον κτήριο του χρήστη.
   */
  private resolveBuilding(): void {
    if (this.buildingId) {
      this.loadSelectedBuilding(this.buildingId);
      return;
    }

    const currentBuildingId = this.authenticationService.currentUserValue?.currentBuildingId;
    if (currentBuildingId) {
      this.loadSelectedBuilding(currentBuildingId);
      return;
    }

    this.loading = true;
    this.buildingService.getMyBuildings().subscribe({
      next: (buildings) => {
        if (buildings && buildings.length) {
          this.loadSelectedBuilding(buildings[0].id);
        } else {
          this.messageBuilding = 'Δεν έχετε πολυκατοικία για να ρυθμίσετε ειδοποιήσεις.';
          this.loading = false;
        }
      },
      error: () => {
        this.messageBuilding = 'Αποτυχία φόρτωσης της πολυκατοικίας.';
        this.loading = false;
      }
    });
  }

  private loadSelectedBuilding(buildingId: number): void {
    this.activeBuildingId = buildingId;
    this.loading = true;
    this.isManager = this.pmView;

    this.buildingService.getBuilding(buildingId).subscribe({
      next: (building) => {
        this.building = building;
        this.buildingName = building.name;
        this.buildingAddress = `${building.street1} ${building.stNumber1}, ${building.city}`;
        this.messageBuilding = '';

        const uid = this.authenticationService.currentUserValue?.id;
        const role = (this.authenticationService.currentUserValue?.role ?? '').toUpperCase().replace(/\s/g, '');
        this.isManager =
          this.pmView ||
          (building.managerId != null && building.managerId === uid) ||
          role === 'ADMIN' ||
          role === 'BUILDINGMANAGER' ||
          role === 'BUILDING_MANAGER' ||
          role === 'PROPERTYMANAGER' ||
          role === 'PROPERTY_MANAGER';

        this.loadPreferences();
        this.loadBuildingSettings(buildingId);
      },
      error: () => {
        console.error('Σφάλμα φόρτωσης πολυκατοικίας');
        this.messageBuilding = 'Αποτυχία φόρτωσης στοιχείων πολυκατοικίας.';
        this.loading = false;
      }
    });
  }

  private loadPreferences(): void {
    this.notificationPreferenceService.getPreferences().subscribe({
      next: (prefs) => {
        this.preferences = prefs;

        this.appItems = [
          { key: 'appForStatementIssued', title: 'Παραστατικό κοινοχρήστων', check: !!prefs.appForStatementIssued },
          { key: 'appForNewPoll', title: 'Νέα ψηφοφορία', check: !!prefs.appForNewPoll },
          { key: 'appForNewAnnouncement', title: 'Νέα ανακοίνωση', check: !!prefs.appForNewAnnouncement },
          { key: 'appForAddedToBuilding', title: 'Προσθήκη σε πολυκατοικία', check: !!prefs.appForAddedToBuilding }
        ];

        this.emailItems = [
          { key: 'emailForStatementIssued', title: 'Παραστατικό κοινοχρήστων', check: !!prefs.emailForStatementIssued },
          { key: 'emailForNewPoll', title: 'Νέα ψηφοφορία', check: !!prefs.emailForNewPoll },
          { key: 'emailForNewAnnouncement', title: 'Νέα ανακοίνωση', check: !!prefs.emailForNewAnnouncement },
          { key: 'emailForAddedToBuilding', title: 'Προσθήκη σε πολυκατοικία', check: !!prefs.emailForAddedToBuilding }
        ];

        this.smsItems = [
          { key: 'smsForStatementIssued', title: 'Παραστατικό κοινοχρήστων', check: !!prefs.smsForStatementIssued },
          { key: 'smsForNewPoll', title: 'Νέα ψηφοφορία', check: !!prefs.smsForNewPoll },
          { key: 'smsForNewAnnouncement', title: 'Νέα ανακοίνωση', check: !!prefs.smsForNewAnnouncement },
          { key: 'smsForAddedToBuilding', title: 'Προσθήκη σε πολυκατοικία', check: !!prefs.smsForAddedToBuilding }
        ];

        this.initialPrefsJson = JSON.stringify(this.buildPrefsPayload());
        this.loading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης προσωπικών ρυθμίσεων:', err);
        this.loading = false;
      }
    });
  }

  private loadBuildingSettings(buildingId: number): void {
    if (!this.isManager) {
      this.initialBuildingJson = '{}';
      this.loading = false;
      return;
    }

    this.buildingSettingsService.getNotificationSettings(buildingId).subscribe({
      next: (settings) => {
        this.settings = settings;

        this.managerOptions = [
          {
            title: 'Προσθήκη νέου μέλους',
            appKey: 'managerAppForAddedToBuilding',
            appCheck: !!settings.managerAppForAddedToBuilding,
            emailKey: 'managerEmailForAddedToBuilding',
            emailCheck: !!settings.managerEmailForAddedToBuilding
          },
          {
            title: 'Έξοδος μέλους από πολυκατοικία',
            appKey: 'managerAppForMemberLeave',
            appCheck: !!settings.managerAppForMemberLeave,
            emailKey: 'managerEmailForMemberLeave',
            emailCheck: !!settings.managerEmailForMemberLeave
          }
        ];

        this.memberCreateItems = [
          { key: 'membersCanCreateAnnouncement', title: 'Τα μέλη μπορούν να δημιουργούν ανακοινώσεις', check: !!settings.membersCanCreateAnnouncement },
          { key: 'membersCanCreatePoll', title: 'Τα μέλη μπορούν να δημιουργούν ψηφοφορίες', check: !!settings.membersCanCreatePoll }
        ];

        this.initialBuildingJson = JSON.stringify(this.buildBuildingPayload());
        this.loading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης ρυθμίσεων πολυκατοικίας:', err);
        this.loading = false;
      }
    });
  }

  get hasChanges(): boolean {
    const prefsChanged =
      this.preferences != null &&
      JSON.stringify(this.buildPrefsPayload()) !== this.initialPrefsJson;

    let buildingChanged = false;
    if (this.isManager) {
      buildingChanged =
        this.settings != null &&
        JSON.stringify(this.buildBuildingPayload()) !== this.initialBuildingJson;
    }

    return prefsChanged || buildingChanged;
  }

  saveSettings(): void {
    const prefsPayload = this.buildPrefsPayload();
    if (!prefsPayload) return;

    this.saving = true;

    this.notificationPreferenceService.updatePreferences(prefsPayload).subscribe({
      next: () => {
        this.initialPrefsJson = JSON.stringify(prefsPayload);

        if (!this.isManager) {
          this.saving = false;
          alert('Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς.');
          return;
        }

        const buildingPayload = this.buildBuildingPayload();
        if (!buildingPayload || !this.activeBuildingId) {
          this.saving = false;
          alert('Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς.');
          return;
        }

        this.buildingSettingsService.updateNotificationSettings(this.activeBuildingId, buildingPayload).subscribe({
          next: () => {
            this.initialBuildingJson = JSON.stringify(buildingPayload);
            this.saving = false;
            alert('Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς.');
          },
          error: (err) => {
            console.error('Σφάλμα αποθήκευσης ρυθμίσεων πολυκατοικίας:', err);
            this.saving = false;
            alert('Αποτυχία αποθήκευσης ρυθμίσεων.');
          }
        });
      },
      error: (err) => {
        console.error('Σφάλμα αποθήκευσης προσωπικών ρυθμίσεων:', err);
        this.saving = false;
        alert('Αποτυχία αποθήκευσης ρυθμίσεων.');
      }
    });
  }

  toggleMemberPermission(): void {
    // Όχι πλέον σε χρήση: τα δικαιώματα δημιουργίας μελών ρυθμίζονται
    // μέσω των καθολικών διακοπτών membersCanCreateAnnouncement / membersCanCreatePoll.
  }

  resetSettings(): void {
    if (!confirm('Θέλετε να ακυρώσετε τις αλλαγές και να επαναφέρετε τις αποθηκευμένες ρυθμίσεις;')) {
      return;
    }

    if (this.activeBuildingId != null) {
      this.loadBuildingSettings(this.activeBuildingId);
    }
    this.loadPreferences();
  }

  private buildPrefsPayload(): NotificationPreferenceDTO | null {
    if (!this.preferences) return null;

    const current = this.preferences;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      appForJoinRequest: current.appForJoinRequest ?? true,
      appForMemberLeave: current.appForMemberLeave ?? true,
      appForPaymentCompleted: current.appForPaymentCompleted ?? false
    };

    [...this.appItems, ...this.emailItems, ...this.smsItems].forEach((item) => {
      payload[item.key] = item.check;
    });

    return payload as NotificationPreferenceDTO;
  }

  private buildBuildingPayload(): BuildingNotificationSettingsDTO | null {
    if (!this.activeBuildingId) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      buildingId: this.activeBuildingId
    };

    this.managerOptions.forEach((opt) => {
      payload[opt.appKey] = opt.appCheck;
      payload[opt.emailKey] = opt.emailCheck;
    });

    this.memberCreateItems.forEach((item) => {
      payload[item.key] = item.check;
    });

    return payload as BuildingNotificationSettingsDTO;
  }
}
