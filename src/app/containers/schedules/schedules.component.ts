import { Component } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScheduleItem } from 'src/app/models/ScheduleItem';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent {
  faTrash = faTrash
  hours = Array(12).fill(0);
  scheduleItems = this.schedule.scheduleItems;

  constructor(private schedule: ScheduleService) { 
    console.log('### SchedulesComponent');
    this.scheduleItems = this.schedule.scheduleItems;
  }

  drop(event: CdkDragDrop<ScheduleItem[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const origin = this.scheduleItems[event.previousIndex];
    const destination = this.scheduleItems[event.currentIndex];

    for (var i = event.currentIndex; i < event.currentIndex + origin.slotSize; i++) {
      if (this.scheduleItems[i].isUserSet) {
        alert('You don\'t have permission to override schedule events. You might delete the event in question and try again.')
        return;
      }
    }

    destination.isUserSet = origin.isUserSet;
    destination.slotSize = origin.slotSize;
    destination.endDate = new Date(destination.startDate.getTime() + 15 * 1000 * 60 * origin.slotSize);
    if (destination.slotSize > 1) {
      this.scheduleItems.splice(event.currentIndex + 1, destination.slotSize - 1);
    }

    origin.isUserSet = false;
    
    if (origin.slotSize === 1) {
      origin.endDate = new Date(origin.startDate.getTime() + 15 * 1000 * 60);
    } else {
      origin.endDate = new Date(origin.startDate.getTime() + 15 * 1000 * 60);
      const extraSlots = Array(origin.slotSize - 1).fill(0).map((_, index) => {
        const startDate = new Date(origin.startDate.getTime() + 15 * 1000 * 60 * (index + 1));
        return {
          startDate,
          endDate: new Date(startDate.getTime() + 15 * 1000 * 60),
          isUserSet: false,
          slotSize: 1,
        } as ScheduleItem;
      });
      origin.slotSize = 1;

      if (event.previousIndex < event.currentIndex) {
        this.scheduleItems.splice(event.previousIndex + 1, 0, ...extraSlots);
      } else {
        this.scheduleItems.splice(event.previousIndex, 0, ...extraSlots);
      }
    }
    
  }

  onClick(number: number) {
    this.schedule.deleteItem(number);
  }

  getFormattedTime(date?: Date): string {
    if (!date) {
      return '';
    }

    let hour = date.getHours();
    const minutes = date.getMinutes();

    if (hour > 12) {
      hour -= 12
    }

    return (hour+'').padStart(2, '0') + ':' + (minutes+'').padStart(2, '0');
  }
}
