import { Component } from '@angular/core';
import { toDashedDateStr } from './utilities/utilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calendar-app';
  calendarRoute = '/calendar/' + toDashedDateStr(new Date());
}
