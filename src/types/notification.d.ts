export interface Notification {
  success: boolean;
  notifications: {
    id: string;
    isRead: boolean;
  }[];
}
