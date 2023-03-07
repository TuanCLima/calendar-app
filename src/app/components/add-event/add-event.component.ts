import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ScheduleItem } from '../../models/ScheduleItem';
import { Period, TimeInfo } from '../../models/TimeInfo';
import { ScheduleService } from '../../services/schedule.service';
import { NUMBER_OF_SLOTS, _15_MINUTES } from 'src/app/constants/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { toDashedDateStr } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
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
  });
  currentDate = new Date();
  scheduleItem?: ScheduleItem;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.timeValues = Array(NUMBER_OF_SLOTS)
      .fill(0)
      .map((_, index) => {
        const period = index > 47 ? Period.PM : Period.AM;
        const hours = Math.floor(index / 4);
        const minutes = (index % 4) * 15;

        return { hours, minutes, period };
      });

    this.route.params.subscribe((params) => {
      this.currentDate = new Date(params['date']);
      this.eventForm.setValue({
        ...this.eventForm.value,
        title: this.eventForm.value.title || '',
        description: this.eventForm.value.description || '',
        startTimeIndex: this.eventForm.value.startTimeIndex || 0,
        duration: this.eventForm.value.duration || 0,
        startDate: this.currentDate,
      });

      this.scheduleItem = undefined;
    });

    this.scheduleService.scheduleItemEmitter.subscribe((scheduleItem) => {
      this.scheduleItem = scheduleItem;
    });
  }

  onSubmit() {
    if (!this.validateInput()) {
      return;
    }

    this.errorMessage = '';
    const formValue = this.eventForm.value;
    const startDate = new Date(formValue.startDate!);
    const startTimeIndexNumber = this.eventForm.value.startTimeIndex || 0;
    const startHours = Math.floor(startTimeIndexNumber / 4);
    const startMinutes = (startTimeIndexNumber % 4) * 15;
    startDate.setHours(startHours, startMinutes, 0);

    const slotSize = this.eventForm.value.duration || 1;
    const endDate = new Date(startDate.getTime() + _15_MINUTES * slotSize);

    const scheduleItem: ScheduleItem = {
      title: formValue.title!,
      description: formValue.description || '',
      isUserSet: true,
      slotSize,
      startDate,
      endDate,
    };

    if (!this.scheduleService.addScheduleItem(scheduleItem)) {
      this.errorMessage =
        "There's an event already scheduled at this time. \n Delete something or book at another time";
    } else {
      const dashedCurrentDate = toDashedDateStr(this.currentDate);
      const dashedStartDate = toDashedDateStr(scheduleItem.startDate);
      if (dashedStartDate !== dashedCurrentDate) {
        this.router.navigate(['calendar/', dashedStartDate]);
      }
    }
  }

  validateInput(): boolean {
    const { title } = this.eventForm.value;

    const _title = title?.trim();
    if (!_title || _title.length === 0) {
      this.errorMessage = 'The title is missing.';
      return false;
    }

    return true;
  }

  onChange() {
    this.errorMessage = '';
  }

  pad(num: number): string {
    return (num + '').padStart(2, '0');
  }

  startsAt(date?: Date): string {
    if (!date) {
      return '';
    }

    const localeDate = date.toLocaleTimeString('en-US');
    return (
      this.pad(date.getHours()) +
      ':' +
      this.pad(date.getMinutes()) +
      localeDate.substring(localeDate.length, localeDate.length - 3)
    );
  }
}
