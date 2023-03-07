export enum Period {
  AM = "am",
  PM = "pm",
}

export interface TimeInfo {
  hours: number;
  minutes: number;
  period: Period;
}