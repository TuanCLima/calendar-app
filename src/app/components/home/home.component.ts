import { Component } from '@angular/core';
import { toDashedDateStr } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  calendarRoute = '/calendar/' + toDashedDateStr(new Date());
}
