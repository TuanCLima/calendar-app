import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';

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
}
