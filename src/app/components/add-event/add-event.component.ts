import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ScheduleItem } from '../../models/ScheduleItem';
import { Period, TimeInfo } from '../../models/TimeInfo';
import { ScheduleService } from '../../services/schedule.service';
import { NUMBER_OF_SLOTS } from 'src/app/constants/constants';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  timeValues?: TimeInfo[];
  errorMessage = '';
  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    startDate: [new Date()],
    startTimeIndex: [0, Validators.required],
    duration: [1, Validators.required],
  })

  constructor(private fb: FormBuilder, private scheduleService: ScheduleService) {
    this.timeValues= Array(NUMBER_OF_SLOTS).fill(0).map((_, index) => {
      const period = index > 47 ? Period.PM : Period.AM;
      const hours = Math.floor(index / 4);
      const minutes = index % 4 * 15;

      return { hours, minutes, period };
    })
  }

  onSubmit() {
    if (!this.validateInput()) {
      return;
    }
    
    this.errorMessage = '';
    const formValue = this.eventForm.value;
    const startDate = new Date(formValue.startDate!);
    const startTimeIndexNumber = this.eventForm.value.startTimeIndex || 0;
    const startHours =  Math.floor(startTimeIndexNumber / 4);
    const startMinutes = (startTimeIndexNumber % 4) * 15;
    startDate.setHours(startHours, startMinutes, 0);

    const slotSize = this.eventForm.value.duration || 1;
    const endDate = new Date(startDate.getTime() + 15 * 60 * 1000 * slotSize); 

    const scheduleItem: ScheduleItem = {
      title: formValue.title!,
      description: formValue.description || '',
      isUserSet: true,
      slotSize,
      startDate,
      endDate,
    };

    if (!this.scheduleService.addScheduleItem(scheduleItem)) {
      this.errorMessage = 'There\'s an event already scheduled at this time. \n Delete something or book at another time'
    }
  
  }

  validateInput(): boolean {
    const { title } = this.eventForm.value;

    const _title = title?.trim();
    if (!_title || _title.length === 0) {
      this.errorMessage = 'The title is missing.'
      return false;
    }

    return true;
  }

  onChange() {
    this.errorMessage = '';
  }

  pad(num: number): string {
    return (num + "").padStart(2, "0")
  }
}
