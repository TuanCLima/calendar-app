import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  calendarRoute = '/calendar/' + new Date().toLocaleDateString('en-US').replace(/\//g, '-');
}
