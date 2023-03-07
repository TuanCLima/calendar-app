import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { HomeComponent } from '../components/home/home.component';

const routes: Routes = [
  { path: 'calendar/:date', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
