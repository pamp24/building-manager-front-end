export interface BuildingNotificationSettingsDTO {
  buildingId: number;

  managerAppForApartmentChanges: boolean;
  managerEmailForApartmentChanges: boolean;
  managerAppForMemberLeave: boolean;
  managerEmailForMemberLeave: boolean;
  managerAppForAddedToBuilding: boolean;
  managerEmailForAddedToBuilding: boolean;

  membersCanCreateAnnouncement: boolean;
  membersCanCreatePoll: boolean;
}
