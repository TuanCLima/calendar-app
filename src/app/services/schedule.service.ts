import { Injectable } from '@angular/core';
import { ScheduleItem } from '../models/ScheduleItem';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  scheduleItems: ScheduleItem[] = [];
  map: Map<string, ScheduleItem[]> = new Map();
  contextDate: Date = new Date();

  constructor() {
    console.log('### ScheduleService constructor');
    this.loadItems()
  }

  loadItems() {
    this.scheduleItems = Array(24 * 4).fill(0).map((_, index) => {
      let isUserSet = false;

      if (index === 7) {
        isUserSet = true;
      }

      const date = new Date();
      date.setHours(Math.floor(index / 4), (index % 4) * 15, 0)
      const startDate = structuredClone(date);
      index++;
      date.setHours(Math.floor(index / 4), (index % 4) * 15, 0)
      return {
        startDate,
        endDate: date,
        isUserSet,
        slotSize: 1,
      } as ScheduleItem;
    });
    
    this.scheduleItems.splice(4, 1)
    this.scheduleItems[3].endDate?.setHours(1, 15, 0)
    this.scheduleItems[3].isUserSet = true;
    this.scheduleItems[3].slotSize = 2;
  }

  setContextDate(dateString: string) {
    const scheduleItems = this.map.get(dateString);
    console.log('###', dateString, scheduleItems);
    if (scheduleItems) {
      this.scheduleItems = scheduleItems
    } else {
      this.loadItems();
      this.map.set(dateString, this.scheduleItems);
    }
  }

  addScheduleItem(scheduleItem: ScheduleItem): boolean {
    console.log('###', this.scheduleItems);
    let startIndex;
    for (let i = 0; i < this.scheduleItems.length; i++) {
      if (
        this.scheduleItems[i].startDate.getHours() >= scheduleItem.startDate.getHours() &&
        this.scheduleItems[i].startDate.getMinutes() >= scheduleItem.startDate.getMinutes()
      ) {
        startIndex = i;

        for (let j = i; j < i + scheduleItem.slotSize; j++) {
          if (this.scheduleItems[j].isUserSet) {

            return false;
          }
        }
        break;
      }
    }

    if (startIndex !== undefined) {
      this.scheduleItems[startIndex] = scheduleItem;
      if (scheduleItem.slotSize > 1) {
        this.scheduleItems.splice(startIndex + 1, scheduleItem.slotSize - 1)
      }
      return true;
    }

    return false;
  }

  deleteItem(index: number) {
    const item = this.scheduleItems[index];
    const previousSlotSize = item.slotSize;
    item.description = '';
    item.title = '';
    item.isUserSet = false;
    item.slotSize = 1;
    item.endDate = new Date(item.startDate.getTime() + 15 * 60 * 1000)

    if (previousSlotSize > 1) {
      const stubSlots = Array(previousSlotSize - 1).fill(0).map((_, idx) => {
        const startDate = new Date(item.startDate.getTime() + 15 * 1000 * 60 * (idx + 1));
        return {
          title: '',
          description: '',
          isUserSet: false,
          slotSize: 1,
          startDate,
          endDate: new Date(startDate.getTime() + 15 * 1000 * 60),
        } as ScheduleItem;
      });

      this.scheduleItems.splice(index + 1, 0, ...stubSlots);
    }
  }
}
