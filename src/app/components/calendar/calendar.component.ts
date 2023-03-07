import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';
import { toDashedDateStr } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  selectedDateString: string = '';

  constructor(private route: ActivatedRoute, private scheduleService: ScheduleService) {
    this.route.params.subscribe((params) => {
      this.selectedDateString = params['date'];
      this.scheduleService.setContextDate(this.selectedDateString);
    });
  }

  loadNextDay(isNextDay: boolean) {
    const incrementer = isNextDay ? 1 : -1
    const today = new Date(this.selectedDateString);
    const nextDate = new Date(today.getTime() + incrementer * 24 * 60 * 60 * 1000);
    const nextDateString = toDashedDateStr(nextDate);
    return nextDateString;
  }

  getWithWeekDayFormat() {
    return new Date(this.selectedDateString).toDateString();
  }
}
