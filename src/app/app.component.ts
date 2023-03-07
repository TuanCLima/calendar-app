import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calendar-app';
  calendarRoute = '/calendar/' + new Date().toLocaleDateString('en-US').replace(/\//g, '-');
}
