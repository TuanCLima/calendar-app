export interface ScheduleItem {
  startDate: Date;
  endDate?: Date;
  isUserSet: boolean;
  slotSize: number;
  title: string;
  description?: string;
}