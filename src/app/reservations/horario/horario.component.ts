import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router'
import { DAYS_OF_WEEK } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataShareService } from './services/data-share.service'
import { ConfirmationService, Message } from 'primeng/api';
import { WorkHoursService } from './services/work-hours.service'
import { WorkHours } from './classes/work-hours'
import { map } from 'rxjs/operators';
import { TimeslotService } from './services/timeslot.service'
import { DailyGroupService } from './services/daily-group.service'
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

import { ReservationsService } from '../reservations.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css'],
  providers: [ ConfirmationService ]
})
export class HorarioComponent implements OnInit {
  // @Output() onFilter: EventEmitter = new EventEmitter()
  hide = true
  chosen = false
  date: Date = new Date()
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
  weekDay
  pt: any
  minDate: Date;
  maxDate: Date;
  invalidDates: Array<Date>
  groupValue: number = 3
  isDisabled: boolean = false

  messages: Message[] = []
  workHours: any
  workHour: WorkHours
  
  highestGroupId: number
  route: string

  weekTimeslots: any
  subject;
  examinersMessage;

  @ViewChild('newScheduleModal', {static: false}) newScheduleModal: TemplateRef<any>;
  @ViewChild('calendarModal', {static: false}) calendarModal: TemplateRef<any>
  @ViewChild('dayIsWeekend', {static: false}) dayIsWeekend: TemplateRef<any>

  constructor( private router: Router,
    private modalService: NgbModal,
    private confirmationService: ConfirmationService,
    private dataShareService: DataShareService,
    private workHoursService: WorkHoursService,
    private timeslotService: TimeslotService,
    private dailyGroupService: DailyGroupService,
    private auth: AuthService,
    private toastr: ToastrService,
    private service: ReservationsService
      ) { }

  async ngOnInit() {
    this.auth.currentUserSubject.subscribe(message => this.subject = message)
    if (this.router.url.includes("results")) {
      this.route = "results"
    }
    else if (this.router.url.includes("reservations")) {
      this.route = "reservations"
    }
    else if (this.router.url.includes("bookings")) {
      this.route = "bookings"
    }
    this.workHours = await this.getWorkHours()
    this.highestGroupId = await this.getHighestGroupId()
//     this.definePrimeCalendar()
    this.setConfig()
//     this.openModal(this.calendarModal)
  }
  
  getHighestGroupId() {
    return this.dailyGroupService.getDailyGroups().pipe(map(res => res)).toPromise()
  }

  getWorkHours() {
    return this.workHoursService.getHours().pipe(map(res => res)).toPromise()
  }

//   createNewSchedule(groupAmount) {
//     this.groupValue = 3
//     this.dataShareService.defineDate(this.date)
//     this.dataShareService.defineWorkHours(this.workHours)
//     this.dataShareService.defineGroupAmount(groupAmount)
//     this.dataShareService.defineHighestGroupId(this.highestGroupId)
//     this.hide= false
//     this.chosen = true
//   }

  goBack() {
    if (this.route == 'reservations') {
      this.router.navigate(['/reservations'])
    }
    else if (this.route == 'results') {
      this.router.navigate(['/results'])
    }
    else if (this.route == 'bookings') {
      this.router.navigate(['/bookings'])
    }
  }

//   filterWorkDays() {
//     // 0 = Domingo/Sunday, 6 = Sábado/Saturday
//     let weekDays = [0,1,2,3,4,5,6]
//     let enabledDays = []
//       for (let i = 0; i < this.workHours.length; i++) {
//           enabledDays[i] = this.workHours[i].Week_day
//       }
    
//     let disabledDays = weekDays.filter((day) => !enabledDays.includes(day))

//     return disabledDays
//   }

//   openModal(modal) {
//     this.modalService.open(modal, {windowClass: 'modal-animation', centered: false, backdrop: 'static', keyboard: false })
//   }

  disable() {
    this.isDisabled = true
    setTimeout(() => {
      this.isDisabled = false
    }, 2000)
  }

//   async setConfig(date) {
//     if (date != null && date !== '') {
//       this.date = new Date(date)
//       let dateValue = new Date(this.date.getTime() + this.date.getTimezoneOffset() * 60000);
//       this.weekDay = dateValue.getDay()
//       if (this.weekDay === 0) {
//         this.toastr.warning('Selecionou um domingo. Por favor selecione outro dia.', 'Aviso')
//         this.goBack()
//         return
//       }
//       this.hide = true
//       this.weekTimeslots = await this.getWeekTimeslots()
//       let dateExists = false
//       if (this.weekTimeslots.length !== 0) {
//         let tempDate = new Date(dateValue)
//         for (let i = 0; i < this.weekTimeslots.length; i++) {
//           let compareDate = new Date(this.weekTimeslots[i][0].Group_day)
//           let tempDateString = `${tempDate.getFullYear()}-${tempDate.getMonth()+1}-${tempDate.getDate()}`
//           let compDateString = `${compareDate.getFullYear()}-${compareDate.getMonth()+1}-${compareDate.getDate()}`
//           if (tempDateString === compDateString) {
//             this.date = dateValue
//             this.dataShareService.defineDate(this.date)
//             this.dataShareService.defineHighestGroupId(this.highestGroupId)
//             dateExists = true
//             this.hide = false
//           }
//         }
//         if (!dateExists) {
//           if (dateValue <= new Date() || this.route === 'results') {
//             this.date = dateValue
//             this.dataShareService.defineWorkHours(this.workHours)
//             this.dataShareService.defineDate(this.date)
//             this.dataShareService.defineHighestGroupId(this.highestGroupId)
//             this.hide = false
//           }
//           else {
//             if (this.subject.includes('ALL_School')) {
//               this.dataShareService.defineHighestGroupId(this.highestGroupId)
//               if (this.weekendDays.includes(this.weekDay)) {
//                 this.openModal(this.dayIsWeekend)
//               }
//               else {
//                 this.openModal(this.newScheduleModal)
//               }
//             }
//           }
//         }
//       }
//       if (dateValue <= new Date() || this.route == 'results' || !this.subject.includes('ALL_School')) {
//         this.date = dateValue
//         this.dataShareService.defineWorkHours(this.workHours)
//         this.dataShareService.defineDate(this.date)
//         this.dataShareService.defineHighestGroupId(this.highestGroupId)
//         this.hide = false
//       }
//       else {
//         if (this.weekTimeslots.length === 0) {
//           this.dataShareService.defineHighestGroupId(this.highestGroupId)
//           this.openModal(this.newScheduleModal)
//         }
//         if (typeof(this.weekTimeslots) === 'undefined') {
//           this.dataShareService.defineHighestGroupId(this.highestGroupId)
//           if (this.weekendDays.includes(this.weekDay)) {
//             this.openModal(this.dayIsWeekend)
//           }
//           else {
//             this.openModal(this.newScheduleModal)
//           }
//         }
//         else {
//           this.dataShareService.defineHighestGroupId(this.highestGroupId)
//           if (dateExists) {
//             this.dataShareService.defineTimeslots(this.weekTimeslots)
//           }
//           dateExists = false
//           this.date = dateValue
//           this.dataShareService.defineWorkHours(this.workHours)
//           this.dataShareService.defineDate(this.date)
//           this.chosen = true
//         }
//       }
//     }
//     else {
//       this.goBack()
//     }
//   }

  setConfig() {
    this.date = new Date()
    this.dataShareService.defineWorkHours(this.workHours)
    this.dataShareService.defineDate(this.date)
    this.dataShareService.defineHighestGroupId(this.highestGroupId)
    this.hide = false
  }

  async getWeekTimeslots() {
    return await this.timeslotService.getTimeslots(this.date).pipe(map(res => res)).toPromise()
  }

//   definePrimeCalendar() {
//     this.pt = {
//       firstDayOfWeek: 1,
//       dayNames: [ "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado" ],
//       dayNamesShort: [ "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb" ],
//       dayNamesMin: [ "D", "S", "T", "Q", "Q", "S", "S" ],
//       monthNames: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
//       monthNamesShort: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
//       today: "Hoje",
//       clear: "Limpar",
//       dateFormat: 'dd/mm/yy'
//     }
//     let today = new Date()
//     let month = today.getMonth()
//     let year = today.getFullYear()
//     let prevMonth = (month === 0) ? 11 : month -1;
//     let prevYear = (prevMonth === 11) ? year - 1 : year;
//     let nextMonth = (month === 11) ? 0 : month + 1;
//     let nextYear = (nextMonth === 0) ? year + 1 : year;
//     this.minDate = new Date();
//     this.minDate.setMonth(prevMonth);
//     this.minDate.setFullYear(prevYear);
//     this.maxDate = new Date();
//     this.maxDate.setMonth(nextMonth);
//     this.maxDate.setFullYear(nextYear);

//     let invalidDate = new Date();
//     invalidDate.setDate(today.getDate() - 1);
//     this.invalidDates = [today,invalidDate];
//   }

  randomizeExaminers(){
    console.log('HEYA')
    this.service.randomizeExaminers().subscribe(
      res=> {
        this.examinersMessage = res;
        console.log(res)
      }
    )
  }

}
