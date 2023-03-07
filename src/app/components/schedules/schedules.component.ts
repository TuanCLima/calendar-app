import { Component } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ScheduleItem } from 'src/app/models/ScheduleItem';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { _15_MINUTES } from 'src/app/constants/constants';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css'],
})
export class SchedulesComponent {
  faTrash = faTrash;
  hours = Array(12).fill(0);
  scheduleItems = this.schedule.scheduleItems;

  constructor(private schedule: ScheduleService) {
    this.schedule.dayTracker.subscribe(() => {
      this.scheduleItems = this.schedule.scheduleItems;
    })
  }

  onDrop(event: CdkDragDrop<ScheduleItem[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const origin = this.scheduleItems[event.previousIndex];
    const destination = this.scheduleItems[event.currentIndex];

    for (let i = event.currentIndex; i < event.currentIndex + origin.slotSize; i++) {
      if (this.scheduleItems[i].isUserSet) {
        alert(
          "You don't have permission to override schedule events. You might delete the event in question and try again."
        );
        return;
      }
    }

    destination.isUserSet = origin.isUserSet;
    destination.title = origin.title;
    destination.description = origin.description;
    destination.slotSize = origin.slotSize;
    destination.endDate = new Date(
      destination.startDate.getTime() + _15_MINUTES * origin.slotSize
    );
    if (destination.slotSize > 1) {
      this.scheduleItems.splice(
        event.currentIndex + 1,
        destination.slotSize - 1
      );
    }

    origin.isUserSet = false;
    origin.title = '';
    origin.description = '';

    if (origin.slotSize === 1) {
      origin.endDate = new Date(origin.startDate.getTime() + _15_MINUTES);
    } else {
      origin.endDate = new Date(origin.startDate.getTime() + _15_MINUTES);
      const extraSlots = Array(origin.slotSize - 1)
        .fill(0)
        .map((_, index) => {
          const startDate = new Date(
            origin.startDate.getTime() + _15_MINUTES * (index + 1)
          );
          return {
            startDate,
            endDate: new Date(startDate.getTime() + _15_MINUTES),
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

  onDelete(number: number) {
    this.schedule.deleteItem(number);
    this.schedule.emitScheduleItem();
  }

  getFormattedTime(date?: Date): string {
    if (!date) {
      return '';
    }

    let hour = date.getHours();
    const minutes = date.getMinutes();

    if (hour > 12) {
      hour -= 12;
    }

    return (hour + '').padStart(2, '0') + ':' + (minutes + '').padStart(2, '0');
  }

  onClick(scheduleItem: ScheduleItem) {
    if (!scheduleItem.isUserSet) {
      return;
    }

    this.schedule.emitScheduleItem(scheduleItem);
  }
}
