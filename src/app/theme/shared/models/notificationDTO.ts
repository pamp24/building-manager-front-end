export interface NotificationDTO {
  id: number;
  type: string;        
  message: string;
  payload?: string | null;     
  createdAt: string;   
  read: boolean;
}