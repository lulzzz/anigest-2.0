import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DemoUtilsModule } from '../schedule-utils/module';
import { ScheduleComponent } from './schedule.component';
import { DayViewSchedulerComponent } from './day-view-scheduler.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { CalendarModule as PrimeCalendar } from 'primeng/calendar'
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages'
import { FormsModule } from '@angular/forms'
import { SpinnerModule } from 'primeng/spinner'
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload'
import { TextMaskModule } from 'angular2-text-mask'
import localePt from '@angular/common/locales/pt-PT'

registerLocaleData(localePt)

@NgModule({
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FormsModule,
    DemoUtilsModule,
    NgbModule.forRoot(),
    PrimeCalendar,
    ConfirmDialogModule,
    MessagesModule,
    MenuModule,
    SpinnerModule,
    DropdownModule,
    ReactiveFormsModule,
    FileUploadModule,
    TextMaskModule
  ],
  declarations: [ScheduleComponent, DayViewSchedulerComponent],
  exports: [ScheduleComponent]
})
export class ScheduleModule {}
