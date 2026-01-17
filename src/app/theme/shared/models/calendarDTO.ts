export interface CalendarDTO {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  colorPrimary?: string;
  buildingId: number;
  active: boolean;
  pinned: boolean;
}
