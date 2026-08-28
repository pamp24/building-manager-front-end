export interface NotificationPreferenceDTO {
  userId: number;

  emailForStatementIssued: boolean;
  emailForNewPoll: boolean;
  emailForNewAnnouncement: boolean;
  emailForAddedToBuilding: boolean;

  appForStatementIssued: boolean;
  appForNewPoll: boolean;
  appForNewAnnouncement: boolean;
  appForAddedToBuilding: boolean;
  appForJoinRequest: boolean;
  appForMemberLeave: boolean;
  appForPaymentCompleted: boolean;

  smsForStatementIssued: boolean;
  smsForNewPoll: boolean;
  smsForNewAnnouncement: boolean;
  smsForAddedToBuilding: boolean;
}
