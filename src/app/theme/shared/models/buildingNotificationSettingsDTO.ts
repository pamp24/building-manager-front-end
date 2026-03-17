export interface BuildingNotificationSettingsDTO {
  buildingId: number;

  emailForStatementIssued: boolean;
  emailForNewPoll: boolean;
  emailForNewAnnouncement: boolean;

  appForJoinRequest: boolean;
  appForMemberLeave: boolean;
  appForPaymentCompleted: boolean;
  appForNewPoll: boolean;
  appForNewAnnouncement: boolean;

  managerEmailForApartmentChanges: boolean;
  managerEmailForDirectMessage: boolean;
  managerEmailForAddedToBuilding: boolean;
}