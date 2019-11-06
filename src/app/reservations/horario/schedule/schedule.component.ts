import { Component, ChangeDetectionStrategy, LOCALE_ID, ViewChild, TemplateRef, HostListener } from '@angular/core';

import { CalendarEvent, CalendarDateFormatter, 
  DAYS_OF_WEEK, CalendarEventTitleFormatter } from 'angular-calendar';
  
import { map } from 'rxjs/operators';
import { colors } from '../schedule-utils/colors';
import { Group } from '../classes/group'
import { addHours, startOfDay } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataShareService } from '../services/data-share.service';
import { CustomDateFormatter } from './custom-date-formatter.provider'
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider'
import { ConfirmationService, Message } from 'primeng/api';
import { WorkHours } from '../classes/work-hours'
import { WorkHoursService } from '../services/work-hours.service'
import { TempStudent } from '../classes/temp-student'
import { TimeslotService } from '../services/timeslot.service'
import { DailyGroup } from '../classes/daily-group'
import { DailyGroupService } from '../services/daily-group.service'
import { ChangeDetectorRef } from '@angular/core'
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import { ReservationService} from '../services/reservation.service'
import { DataFetchService } from '../services/data-fetch.service'
import { DatePipe, registerLocaleData } from '@angular/common'
import localePt from '@angular/common/locales/pt-PT'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PautaService } from '../services/pauta.service'
import { ExamService } from '../services/exam.service'
import { Router } from '@angular/router'
import { ReservationsService } from '../../reservations.service'

@Component({
  selector: 'schedule-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'schedule.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
      
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    },
    {
      provide: LOCALE_ID, useValue: 'pt-PT'
    },
    ConfirmationService,
    WorkHoursService,
    DailyGroupService,
    PautaService
  ]
})

export class ScheduleComponent {

//============================LISTENER==================================\\
  @HostListener('document:click', ['$event'])
  eventClicked(event) {
    let toastrMessage = 'Não pode modificar calendários de dias anteriores ou o de hoje.'
    let eventText = event.target.innerText.trim().toLowerCase()
    if (event.target.offsetParent) {
      if (event.target.offsetParent.id === 'deleteX') {
        let chosenEventId = this.dataShareService.getChosenTimeslotId()
        let chosenEvent = this.events.filter((event) => {
          return event.id == chosenEventId
        })
        this.event = chosenEvent[0]
        if (this.userIdSchool == 'null'){
          if (this.event.meta.currentNumStudents === 0) {
            this.deleteEvent()
          }
          else {
            this.toastr.warning('Não pode eliminar um timeslot com reservas criadas.', 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
          }
        }
        else {
          this.toastr.warning('Não tem permissão para realizar essa operação.', 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
        }
      }
    }
    if (eventText == 'numerar') {
      if (this.viewDate.getTime() < new Date().getTime()) {
        this.toastr.warning(toastrMessage, 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
      }
      else{
        this.createPauta()
      }
    }
    else if (eventText == 'novo timeslot') {
      if (this.viewDate.getTime() < new Date().getTime()) {
        this.toastr.warning(toastrMessage, 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
      }
      else{
        this.openModal(this.newTimeslotModal)
      }
    }
    else if (eventText == 'novo grupo') {
      if (this.viewDate.getTime() < new Date().getTime()) {
        this.toastr.warning(toastrMessage, 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
      }
      else{
        this.generateNewGroup('navbar')
      }
    }
    else if (eventText == 'eliminar último grupo') {
      if (this.viewDate.getTime() < new Date().getTime()) {
        this.toastr.warning(toastrMessage, 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
      }
      else{
        let curDate = new Date(this.currentDate)
        let comparisonDate = new Date(curDate.setDate(curDate.getDate()))
        if (comparisonDate.toISOString().includes('23:00:00')) {
          comparisonDate.setHours(comparisonDate.getHours()+1)
        }
        let groupsInDate = this.timeslots.filter((obj) => {
          return new Date(obj[0].Group_day).toISOString() == comparisonDate.toISOString()
        })
        if (groupsInDate[0][0].Max > 1) {
          this.openModal(this.confirmGroupDelete)
        }
        else {
          this.toastr.warning('Não pode eliminar todos os grupos de um calendário', 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
        }
      }
    }
    else if (eventText == 'gerar calendário') {
      if (this.viewDate.getTime() < new Date().getTime()) {
        this.toastr.warning(toastrMessage, 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
      }
      else
      {
        let weekDay = this.viewDate.getDay()
        if (this.events.length > 0) {
          let curDate = new Date(this.currentDate)
          if (curDate.toString().includes('GMT+0100')) {
            curDate.setHours(curDate.getHours()+1)
          }
          let comparisonDate = new Date(curDate.setDate(curDate.getDate()))
          if (comparisonDate.toISOString().includes('23:00:00')) {
            comparisonDate.setHours(comparisonDate.getHours()+1)
          }
          let groupsInDate = this.timeslots.filter((obj) => {
            return new Date(obj[0].Group_day).toISOString() == comparisonDate.toISOString()
          })
          if(groupsInDate.length){
            this.toastr.error('Já foi gerado um calendário neste dia.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
            return
          }
          else {
            if (this.weekendDays.includes(weekDay)) {
              if (this.route === 'reservations') {
                this.openModal(this.dayIsWeekend)
              }
            }
            else {
              if (this.route === 'reservations') {
                this.openModal(this.generateDay)
              }
            }
          }
        }
      }
    }
  }
//============================FORM DEFINITION===========================\\
  
  reservationForm = this.fb.group({
    Student_name: ['', [Validators.required, Validators.minLength(4), this.ValidateString]],
    Student_num:   [''],
    Birth_date: ['', [Validators.required]],
    ID_num: ['', [Validators.required]],
    ID_expire_date: ['', [Validators.required]],
    tax_num: ['', [Validators.required, Validators.minLength(9), this.ValidateTax]],
    Drive_license_num: [''],
    Obs: [''],
    School_Permit: ['', [Validators.required]],
    Student_license: ['', [Validators.required]],
    Expiration_date: ['', [Validators.required]],
    Type_category_idType_category: [''],
    T_ID_type_idT_ID_type: ['', [Validators.required]],
    Exam_type_idExam_type: [''],
    Car_plate: [''],
    idTimeslot: [''],
    exam_expiration_date: ['']
  })
  //=======================CENTER AND DATE VARIABLES=======================\\

  idExamCenter = 4
  viewDate = this.dataShareService.eventDate
  currentDate = this.viewDate.getFullYear() +'/'+(this.viewDate.getMonth()+1)+'/'+this.viewDate.getDate()
  endValue = this.viewDate;
  weekNumber: any
  lockedDates: any[] = []
  intervalValue = 1.5
  datePipe: DatePipe = new DatePipe('pt_PT')

  //=======================PRIMENG VARIABLES=======================\\

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SUNDAY, DAYS_OF_WEEK.SATURDAY];
  pt: any
  minDate: Date;
  maxDate: Date;
  invalidDates: Array<Date>


  //=======================CLASS VARIABLES=======================\\

  groups: Group[] = []
  groupAmount: number
  group: Group
  groupsInDate: Group[] = []
  events: CalendarEvent[] = []
  event: CalendarEvent
  messages: Message[] = []
  workHours: WorkHours[] = []
  workHour: WorkHours
  tempStudent: TempStudent
  timeslots: any[] = [{}]
  timeslot: any = {}
  startHour: any = {}
  endHour: any = {}
  dailyGroup: DailyGroup
  dailyGroups: DailyGroup[] = []
  lastGroupId: number
  highestGroupId: number
  idTypes: any[] = []
  examTypes: any[] = []
  categories: any[] = []
  schools: any[] = []
  school: any
  reservation: any = {}
  reservations: any[] = []
  timeslotReservations: any[] = []
  examStatuses: any[] = []
  examStatus: any
  pautas: any[] = []
  pauta: any
  examiners: any[] = []
  examiner: any
  examinerQualifications: any[] = []
  examinerQualification: any
  examTypeExaminers: any[]
  examResults: any[] = []
  exams: any[] = []
  exam: any
  examsInPauta: any[] = []
  examTypesAllowed: any[] = [];
  examTypesAllowedSchool: any[] = []
  locale:any;

  //=======================MISC. VARIABLES=======================\\

  checkCount: number = 0
  timesChanged: boolean = false
  scheduleLocked: boolean = false
  timeslotExists: boolean = false
  hasReservations: boolean = false
  formIsEditable: boolean = true
  dayLockIcon: boolean
  reservationAmount: number = 1;
  startValue: number = 1
  canClose: boolean = false
  lockedReservationId: any
  createdReservations: number = 0
  reservationIdType: any
  editingReservation: boolean = false
  minimumReservationDate: any
  today: any
  chosenExamType: any
  userIdSchool: any
  userSchoolPermit: any
  selectedOption: any
  examinerQualificationsExamType: any[] = []
  examinersExamType: any[] = [];
  fileToUpload: File = null;
  navigationDisabled: boolean = false;
  todayFormatted: any;
  user: any
  groupValue: number = 3;
  minBirthDate:string;
  maxBirthDate:string;
  minExpDate:string;
  maxExpDate:string;
  hasValidReservations: boolean = false
  previousExamExpirationDate: any = null
  submitted: boolean = false
  isChecked: boolean = false
  lockTimeslotSelection: boolean = false

  public mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
  public taxMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
  public plateMask = [/[A-Z0-9]/, /[A-Z0-9]/, '-', /[A-Z0-9]/, /[A-Z0-9]/, '-', /[A-Z0-9]/, /[A-Z0-9]/]

  hourMask(value) {
    const chars = value.split('');
    const hours: Array<any> = [
      /[0-2]/,
      chars[0] == '2' ? /[0-3]/ : /[0-9]/
    ];

    const minutes: Array<any> = [/[0-5]/, (/[0|5]/)];

    return hours.concat(':').concat(minutes);
  }

  oldEnd: any
  oldStart: any
  oldGroup: any
  subject: any
  route: string

  //=======================END OF VARIABLES=======================\\

  @ViewChild('newTimeslotModal', {static: false}) newTimeslotModal: TemplateRef<any>;
  @ViewChild('confirmGroupDelete', {static: false}) confirmGroupDelete: TemplateRef<any>;
  @ViewChild('generateDay', {static: false}) generateDay: TemplateRef<any>;
  @ViewChild('dayIsWeekend', {static: false}) dayIsWeekend: TemplateRef<any>;
  @ViewChild('examinerTable', {static: false}) examinerTable: TemplateRef<any>;
  @ViewChild('timeslotForm', {static: false}) timeslotForm: TemplateRef<any>;
  @ViewChild('chooseToGenerate', {static: false}) chooseToGenerate: TemplateRef<any>;
  

  constructor(
    private router: Router,
    private dataShareService: DataShareService, 
    private modalService: NgbModal,
    private confirmationService: ConfirmationService,
    private timeslotService: TimeslotService,
    private dailyGroupService: DailyGroupService,
    private reservationService: ReservationService,
    private reservationPatchService: ReservationsService,
    private dataFetchService: DataFetchService,
    private cRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private titleFormatter: CustomEventTitleFormatter,
    private toastr: ToastrService,
    private auth: AuthService,
    private pautaService: PautaService,
    private examService: ExamService,
    public datepipe: DatePipe
    ) {}

  async ngOnInit() {
    this.parseJwt(localStorage.getItem('token'))  
    this.userIdSchool = localStorage.getItem('idSchool')
    this.today = new Date()
    this.todayFormatted = `${this.today.getFullYear()}-${this.today.getMonth()+1}-${this.today.getDate()}`
    this.minimumReservationDate = new Date()
    let dayAmount = 9
    for (let i = 1; i < 10; i++) {
      let tempDate = new Date()
      tempDate.setUTCDate((tempDate.getUTCDate() + i))
      if (tempDate.getUTCDay() === 6 || tempDate.getUTCDay() === 0) {
        dayAmount++
      }
    }
    this.minimumReservationDate.setUTCDate(this.minimumReservationDate.getUTCDate() + dayAmount)
    this.minimumReservationDate.setUTCHours(0,0,0,0)
    
    this.auth.currentUserSubject.subscribe(message => this.subject = message)
    if (this.router.url.includes("reservations")) {
      this.route = "reservations"
    }
    else {
      if (!this.subject.includes('ALL_School')) {
        this.router.navigate(["/"])
      }
      this.route = "results"
      this.dataFetchService.getExaminers().subscribe(res => this.examiners = res)
      // this.dataFetchService.getExaminerQualifications().subscribe(res => this.examinerQualifications = res)
      this.dataFetchService.getExamResults().subscribe(res => this.examResults = res)
      this.dataFetchService.getExams().subscribe(res => this.exams = res)
    }

    this.reservationService.getReservation().subscribe(res => {if (res === null) {this.reservations = []} else { this.reservations = res}})
    registerLocaleData(localePt, 'pt-PT')
    this.pautaService.getPautas().subscribe(res => { if (res === null) { this.pautas = []} else {this.pautas = res}})
    this.dayLockIcon = this.scheduleLocked
    this.dataFetchService.getExamTypes().subscribe((data) => this.examTypes = data, (e) => {},
    async () => {
      this.reservationService.getExamStatus().subscribe(res => this.examStatuses = res)
      if (this.viewDate < new Date()) {
        this.scheduleLocked = true
        this.dayLockIcon = this.scheduleLocked
      }
      this.dataFetchService.getIdTypes().subscribe((data) => this.idTypes = data)
      this.dataFetchService.getCategories().subscribe((data) => this.categories = data)
      this.dataFetchService.getSchools().subscribe((data) => this.schools = data, () => {

      }, () => {
        if (this.userIdSchool !== 'null') {
          let schoolPermit = this.schools.filter((school) => {
            return school.idSchool == this.userIdSchool
          })
          this.userSchoolPermit = schoolPermit[0].Permit
        }
      })
      this.highestGroupId =this.dataShareService.highestGroupId
      this.definePrimeCalendar()
      this.workHours = this.dataShareService.workHours
      this.groupAmount = await this.dataShareService.groupAmount
      this.timeslots = await this.getWeekTimeslots()
      this.weekNumber = this.timeslotService.getWeekNumber(this.viewDate)
      if (typeof(this.highestGroupId) !== 'undefined') {
        for (let key in this.highestGroupId[0]) {
        if (this.highestGroupId[0].hasOwnProperty(key)) {
            this.highestGroupId = this.highestGroupId[0][key]
          }
        }
      }
      if (typeof(this.timeslots) !== 'undefined') {
        for (let i = 0; i < this.timeslots.length; i++) {
          this.genGroup(this.timeslots[i])
        }
      }
      if (typeof(this.groupAmount) != 'undefined'){
        if (this.groupAmount != 0) {
          this.dataShareService.undefineShareService()
          this.generateNewSchedule(this.groupAmount)
        }
      }
      this.checkIfLocked()
      this.refreshTimeslots(this.groups, this.events)
    }) 
    
    this.setMinMaxBirthDate();
    this.setMinExpDate();
  }

  parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    let parsed = JSON.parse(jsonPayload)
    this.user = parsed.user
    console.log(this.user)
  };

  ngOnDestroy(){
    // this.dataShareService.undefineShareService()
    this.groupAmount = null
  }

  handleFileInput(files: FileList, resID) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity(resID)
  }

  uploadFileToActivity(resID) {
    this.reservationService.sendFile(this.fileToUpload, resID).subscribe(data => {
      if (data) {
        this.toastr.success('Modelo 2 enviado com sucesso.','Notificação',{
          timeOut: 10000,
          closeButton: true
        })
      }
      console.log(Object.values(data))
    }, error => {
      this.toastr.error('Ocorreu um erro.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
    });
  }

  defineExaminer() {
    this.pautaService.definePautaExaminer(this.event.meta.pauta.idPauta, this.examiner.idExaminer).subscribe(() => {},
    () => {
      this.toastr.error('Erro ao definir examinador', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
    },
    () => {
      // this.event.meta.pauta.Examiner_qualifications_idExaminer_qualifications = 
      this.getSchedule()
      this.toastr.success('Examinador definido', 'Sucesso',{
          timeOut: 10000,
          closeButton: true
        })
    })
  }

  defineExamResult(exam, newExamResult) {
    let selectedResult = this.examResults.filter((examResult) => {
      return examResult.idT_exam_results == newExamResult
    })
    let examToSend = exam
    examToSend.T_exam_results_idT_exam_results = selectedResult[0].idT_exam_results
    // // updatedResult.
    this.examService.updateExam(examToSend.idExam, examToSend).subscribe(res => console.log(res))
    // console.log(exam)
    // console.log(this.selectedOption)
  }
  
  ValidateString(control: FormControl) {
    let pattern = /[*\\/|":?><0-9\-_;ºª.,!~]/gi; // can change regex with your requirement
    //if validation fails, return error name & value of true
    if (pattern.test(control.value)) {
        return { validString: true };
    }
    //otherwise, if the validation passes, we simply return null
    return null;
  }

  ValidateTax(control: FormControl) {
    let pattern = /[0-9]{9}/
    if (pattern.test(control.value)) {
      return null
    }
    return { validString: true }
  }

  createPauta() {
    let date = this.getCurrentDateFormatted(this.viewDate)
    this.pautaService.createPauta(date).subscribe(() => {},
    () => {
      this.toastr.error('Ocorreu um erro ao numerar as pautas. Verifique se existem pautas por numerar nesta data.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
    },
    () => {
      this.toastr.success('Pautas numeradas', 'Sucesso',{
          timeOut: 10000,
          closeButton: true
        })
      this.getSchedule().then(() => {
        this.pautas = []
        this.pautaService.getPautas().subscribe(res => this.pautas = res,
        () => {
          
        },
        ()=> {
          this.pautas = [...this.pautas]
          this.refreshTimeslots(this.groups, this.events)
          this.reservations = [...this.reservations]
        })
      })
    })
  }

  generateNewSchedule(groupAmount) {
    this.groupValue = 3
    if (this.events.length > 0) {
      let curDate = new Date(this.currentDate)
      let comparisonDate = new Date(curDate.setDate(curDate.getDate()))
      if (comparisonDate.toISOString().includes('23:00:00')) {
        comparisonDate.setHours(comparisonDate.getHours()+1)
      }
      let groupsInDate = this.timeslots.filter((obj) => {
        return new Date(obj[0].Group_day).toISOString() == comparisonDate.toISOString()
      })
      if(groupsInDate.length){
        this.toastr.error('Já foi gerado um calendário neste dia.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
        return
      }
    }
    for (let i = 0; i < groupAmount; i++) {
      this.generateNewGroup('scheduleGen')
    }
    this.sendDailyGroups()
    this.refreshTimeslots(this.groups, this.events)
    
  }

  //=======================SCHEDULE CONFIGURATION=======================\\
  
  async getWeekTimeslots() {
    return await this.timeslotService.getTimeslots(this.viewDate).pipe(map(res => res)).toPromise()    
  }

  refreshTimeslots(groups, events): void {
    this.groups = [...groups]
    this.events = [...events]
    this.cRef.detectChanges()
  }

  setTime(option, newEnd?) {
    if (!this.workHour || this.workHour.Week_day !== this.viewDate.getDay()) {
      this.getWeekDay()
    }
    if (option === 'startHour') {
      if (typeof(this.workHour) == 'undefined') {
        return '08'
      }
      return this.workHour.Start_hour.substr(0,2)
    }
    if (option === 'startMinute') {
      if (typeof(this.workHour) == 'undefined') {
        return '00'
      }
      return this.workHour.Start_hour.substr(3,2)
    }
    if (option === 'endHour') {
      if (typeof(this.workHour) == 'undefined') {
        return '20'
      }
      return this.workHour.End_hour.substr(0,2)
    }
    if (option === 'endMinute') {
      if (typeof(this.workHour) == 'undefined') {
        return '00'
      }
      return this.workHour.End_hour.substr(3,2)
    }
    if (option === 'newEndHour') {
      return newEnd.substr(0,2)
    }
    if (option === 'newEndMinute') {
      return newEnd.substr(3,2)
    }
  }

  goToDate(date) {
    if (date !== '') {
      if (new Date(date).getDay() === 0) {
        this.toastr.warning('Selecionou um domingo. Por favor selecione outro dia.', 'Aviso',{
          timeOut: 10000,
          closeButton: true
        })
      }
      else {
        this.viewDate = new Date(date)
        this.getNewWeekTimeslots()
        this.switchDate('none')
      }
    }
  }

  async getNewWeekTimeslots() {
    let newWeekNumber = this.timeslotService.getWeekNumber(this.viewDate)
    if (newWeekNumber != this.weekNumber) {
      this.getSchedule()
    }
    this.currentDate = this.viewDate.getFullYear() +'/'+(this.viewDate.getMonth()+1)+'/'+this.viewDate.getDate()
    let currentDate = this.getCurrentDateFormatted()
    this.endValue = this.viewDate
    this.groupsInDate = this.groups.filter((group)=> {
      return group.date == currentDate
    })
    this.setTime('startHour')
    this.setTime('startMinute')
    this.setTime('endHour')
    this.setTime('endMinute')
    this.refreshTimeslots(this.groups, this.events)
  }

  filterWorkDays() {
    // 0 = Domingo/Sunday, 6 = Sábado/Saturday
    let weekDays = [0,1,2,3,4,5,6]
    let enabledDays = []
      for (let i = 0; i < this.workHours.length; i++) {
          enabledDays[i] = this.workHours[i].Week_day
      }
    
    let disabledDays = weekDays.filter((day) => !enabledDays.includes(day))

    return disabledDays
  }

  getWeekDay() {
    for (let i = 0; i < this.workHours.length; i++) {
      if (this.workHours[i].Exam_center_idExam_center == this.idExamCenter) {
        if (this.workHours[i].Week_day == this.viewDate.getDay()) {
          this.workHour = this.workHours[i]
          return 0;
        }
      }
    }
  }


  //=======================EVENT GENERATION=======================\\

  checkIfEventExists(index: number) {
    if (typeof(this.events[index]) !== 'undefined') {
      return true
    }
    else {
      return false
    }
  }

  checkIfGroupExists(index: number) {
    if (typeof(this.groups[index]) !== 'undefined') {
      return true
    }
    else {
      return false
    }
  }

  generateNewEvent(startDate: string, endDate: string, group: Group) {
    let currentDate = this.getCurrentDateFormatted()
    this.groupsInDate = this.groups.filter((group)=> {
      return group.date == currentDate
    })
    let eventsInGroup = this.events.filter((event) => {
      return event.meta.group === group
    })
    let sD = new Date(currentDate)
    let eD = new Date(currentDate)
    sD.setHours(parseInt(startDate.substr(0,2)), parseInt(startDate.substr(3,2)))
    eD.setHours(parseInt(endDate.substr(0,2)), parseInt(endDate.substr(3,2)))
    if (eventsInGroup){
      for(let i = 0; i < eventsInGroup.length; i++)  {
        if (eventsInGroup[i].start <= sD && eventsInGroup[i].end >= eD) {
          this.toastr.error('Não pode sobrepor timeslots', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
          return 0
        }
        if (eventsInGroup[i].start > sD && eventsInGroup[i].start < eD) {
          this.toastr.error('Não pode sobrepor timeslots', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
          return 0
        }
        else if (eventsInGroup[i].end > sD && eventsInGroup[i].end < eD) {
          this.toastr.error('Não pode sobrepor timeslots', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
          return 0
        }
      }
    }
    let startFormatted
    let endFormatted
    try {
      startFormatted = parseFloat(`${startDate.substr(0,2)}.${(parseFloat(startDate.substr(3,2).toString()))/0.6}`)
      endFormatted = parseFloat(`${endDate.substr(0,2)}.${(parseFloat(endDate.substr(3,2).toString()))/0.6}`)
    }
    catch {
    }
    if (!startDate || !endDate || !group) {
      this.toastr.error('Dados em falta','Erro',{
          timeOut: 10000,
          closeButton: true
        })
    }
    else if (startFormatted < 8 || startFormatted > 19 || endFormatted < 8 || endFormatted > 20) {
      this.toastr.error('Insira uma hora válida', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
    }
    else if ((startFormatted >= 13 && startFormatted < 14 || endFormatted <= 14 && endFormatted > 13) || (endFormatted > 13 && startFormatted <= 13) || (endFormatted >= 14 && startFormatted < 14)) {
      this.toastr.error('Um timeslot não pode ocupar a hora de almoço', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
    }
    else if (startDate >= endDate) {
      this.toastr.error('Um exame não pode acabar antes de começar','Erro',{
          timeOut: 10000,
          closeButton: true
        })
    }
    else {
      let groupNumber = group.title.substr(6,2)
      let timeslotDate = this.viewDate.getFullYear() + '-' + (this.viewDate.getMonth()+1) + '-' + this.viewDate.getDate()
      startDate.concat(':00')
      endDate.concat(':00')
      let timeslot = {
        Timeslot_date: timeslotDate,
        Begin_time: startDate,
        End_time: endDate,
        Exam_group: groupNumber,
        Exam_type_idExam_type: null,
        Exam_center_idExam_center: this.idExamCenter
      }
      this.timeslotService.addTimeslot(timeslot).subscribe(() => {},
      () => {
        this.toastr.error('Erro ao criar timeslot', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
      },
      () => {
        this.toastr.success('Timeslot criado', 'Sucesso',{
          timeOut: 10000,
          closeButton: true
        })
        this.getSchedule()
      })
      this.events = [...this.events]
    }
  }

  maxReservations() {
    let amount = this.event.meta.maxStudents - this.event.meta.currentNumStudents
    if (amount > 2) {
      amount = 2
    }
    return amount
  }

  genEvents(group, dayGroup, indexOfGroup) {
    let groupEvents = [...group]
    groupEvents.shift()
    let eventsToAdd = groupEvents.filter((event)=> {
      return event.Exam_group == dayGroup.title.substr(6,3)
    })
    let date = group[0].Group_day
    let currentDate = this.getCurrentDateFormatted()
    let groups = this.groups.filter((group) => {
      return group.date == date.substr(0,10)
    })
    let groupCount = groups.length
    for (let i = 0; i > -1 ; i++){
      date = new Date(group[0].Group_day)
      if (typeof(eventsToAdd[i]) !== 'undefined') {
        let hourStart = eventsToAdd[i].Begin_time.substr(0,2)
        let minStart = eventsToAdd[i].Begin_time.substr(3,2)
        let hourEnd = eventsToAdd[i].End_time.substr(0,2)
        let minEnd = eventsToAdd[i].End_time.substr(3,2)
        let id = eventsToAdd[i].idTimeslot
        let color = colors.white
        let canResize = true
        let canDrag = true
        let filterByStatus = []
        if (this.reservations.length) {
          let filterReservations = this.reservations.filter((reservation) => {
            return reservation.idTimeslot == eventsToAdd[i].idTimeslot
          })
          filterByStatus = filterReservations.filter((reservation) => {
            return ((reservation.T_exam_status_idexam_status !== 1 && reservation.Lock_expiration_date === null) || (reservation.Lock_expiration_date !== null && reservation.Account_User !== this.user))
          })
        }
        let startDate = new Date(date.setHours(hourStart,minStart))
        let endDate = new Date(date.setHours(hourEnd, minEnd))
        let sH = `${String(startDate.getHours()).padStart(2,'0')}:${String(startDate.getMinutes()).padStart(2, '0')}`
        let eH = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
        if (endDate.getTime() < new Date().getTime()) {
          color = colors.blue
          canResize = false
          canDrag = false
        }
        else if (startDate.getTime() > new Date().getTime()) {
          if (!filterByStatus.length && eventsToAdd[i].Max_Num_Students) {
            color = colors.white
          }
          else if (filterByStatus.length > 0 && filterByStatus.length < eventsToAdd[i].Max_Num_Students) {
            color = colors.orange
          }
          else if (filterByStatus.length == eventsToAdd[i].Max_Num_Students) {
            color = colors.yellow
          }
        }
        else if (startDate.getTime() <= new Date().getTime() && endDate.getTime() > new Date().getTime()) {
          color = colors.green
          canResize = false
          canDrag = false
        }
        if (!this.subject.includes('ALL_School')) {
          canResize = false
          canDrag = false
        }
        if (this.route != "reservations") {
          canResize = false
          canDrag = false
        }
        let startString = startDate.getFullYear().toString() + (startDate.getMonth()+1).toString() + startDate.getDate().toString()
        let todayString = new Date().getFullYear().toString() + (new Date().getMonth()+1).toString() + new Date().getDate().toString()
        if (startString === todayString) {
          canResize = false
          canDrag = false
        }
        let exist = false
        if (typeof(this.timeslots) !== 'undefined') {
          exist = true
        }

        let timeslotPauta = this.pautas.filter((pauta) => {
          return pauta.Timeslot_idTimeslot == id
        })
        if (eventsToAdd[i].Exam_type_name !== null) {
          let examTypeShort = this.examTypes.filter((type) => {
            return type.Exam_type_name == eventsToAdd[i].Exam_type_name
          })
          eventsToAdd[i].Exam_type_name = examTypeShort[0]
          canResize = false
        }
        if (timeslotPauta.length) {
          this.events[id] = {
            id: id,
            title: `${sH} - ${eH}`,
            start: startDate,
            end: endDate,
            meta: {
              group: this.groups[indexOfGroup],
              exists: exist,
              maxStudents: eventsToAdd[i].Max_Num_Students,
              currentNumStudents: filterByStatus.length || 0,
              examType: eventsToAdd[i].Exam_type_name,
              // examTypeShort: eventsToAdd[i].Exam_type_name.Short,
              pauta: timeslotPauta[0]
            },
            resizable: {
              beforeStart: false,
              afterEnd: canResize
            },
            draggable: canDrag,
            color: color
          }
        }
        else {
          this.events[id] = {
            id: id,
            title: `${sH} - ${eH}`,
            start: startDate,
            end: endDate,
            meta: {
              group: this.groups[indexOfGroup],
              exists: exist,
              maxStudents: eventsToAdd[i].Max_Num_Students,
              currentNumStudents: filterByStatus.length || 0,
              examType: eventsToAdd[i].Exam_type_name
              // examTypeShort: eventsToAdd[i].Exam_type_name.Short
            },
            resizable: {
              beforeStart: false,
              afterEnd: canResize
            },
            draggable: canDrag,
            color: color
          }
        }
        
        
      
      }
      else {
        break;
      }
    }
  }


  //=======================GROUP GENERATION=======================\\

  genGroup(group) {
    let tempDate = new Date(group[0].Group_day)
    let date = `${tempDate.getUTCFullYear()}-${(tempDate.getUTCMonth()+1).toString().padStart(2,'0')}-${(tempDate.getUTCDate()).toString().padStart(2,'0')}`
    let compareDate = new Date(date)
    if (group[0].Day_lock == 1) {
      this.lockedDates.push((compareDate.getDate()))
    }
    let currentDate = this.getCurrentDateFormatted(compareDate)
    this.groupsInDate = this.groups.filter((group) => {
      return group.date == currentDate
    })
    let color = colors.white
    if (this.viewDate < new Date()) {
      color = colors.blue
    }
    else if (this.viewDate.toDateString() == new Date().toDateString()) {
      color = colors.green
    }
    let groupCount = this.groupsInDate.length+1
    for (let i = 0; i < group[0].Max; i++) {
      this.groups[this.groups.length+i] = {
        id: (group[0].idGroups+i),
        title: 'Grupo ' + (groupCount+i),
        date: date,
        color: color,
      }
    }
    
    let dayGroups = this.groups.filter((group) => {
      return group.date == date
    })
    for (let i = 0; i < dayGroups.length; i++) {
      let indexOfGroup = this.groups.indexOf(dayGroups[i])
      this.genEvents(group, dayGroups[i], indexOfGroup)
    }
  }

  generateNewGroup(option?) {
    let maxGroups = 0
    if (option !== 'scheduleGen') {
      let curDate = new Date(this.currentDate)
      let comparisonDate = new Date(curDate.setDate(curDate.getDate()))
      if (comparisonDate.toISOString().includes('23:00:00')) {
        comparisonDate.setHours(comparisonDate.getHours()+1)
      }
      let groupsInDate = this.timeslots.filter((obj) => {
        return new Date(obj[0].Group_day).toISOString() == comparisonDate.toISOString()
      })
      try {
        maxGroups = groupsInDate[0][0].Max
      }
      catch {
        this.toastr.error('Gere o calendário primeiro', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
        return
      }
      let dayLock = groupsInDate[0][0].Day_lock
      if (typeof(option) == 'undefined' || option !== 'scheduleGen') {
      
      let updateObject = {
        Max: maxGroups+1,
        Day_lock: dayLock
      }
      this.dailyGroupService.updateDailyGroup(groupsInDate[0][0].idGroups, updateObject).subscribe()
      }
    }
    
    let eventCount = 0;
    let y = this.startHour
    while (y < (this.endHour-1)) {
      y += this.intervalValue
      eventCount++
    }
    let currentDate = this.getCurrentDateFormatted()
    let eventsInDate = this.events.filter((otherEvent) => {
      return otherEvent.meta.group.date === currentDate
    })
    let groupTitleNumber = 0
    for (let i = 0; i < eventsInDate.length; i++) {
      let eventInDate = eventsInDate[i]
      let eventGroupNumber = parseInt(eventInDate.meta.group.title.substr(6,2))
      if (eventGroupNumber > groupTitleNumber) {
        groupTitleNumber = eventGroupNumber
      }
    }
    let color = colors.white
    if (this.viewDate < new Date()) {
      if (this.viewDate.toDateString() == new Date().toDateString()) {
        color = colors.green
      }
      else {
        color = colors.blue
      } 
    }
    this.highestGroupId++
    this.groups[this.highestGroupId] = {
      id: this.highestGroupId,
      title: 'Grupo ' + (groupTitleNumber+1),
      date: currentDate,
      color: color
    }
  // let startHour = parseFloat(this.workHour.Start_hour.substr(0,2))
    let startHour = 8
    // let startMinute = this.workHour.Start_hour.substr(3,2)
    let startMinute = 30
    startMinute /= 60 
    startHour += startMinute
    // let endHour = parseFloat(this.workHour.End_hour.substr(0,2))
    let endHour = 17
    // let endMinute = this.workHour.End_hour.substr(3,2)
    let endMinute = 0
    endMinute /= 60 
    endHour += endMinute
    let id = (eventCount*(this.groups.length-1))
    for (let eventNumber = 0; eventNumber < 20; eventNumber++) {
      if (startHour >= 13 && startHour < 14){
        startHour = 14
      }
      if ((startHour + this.intervalValue) > 13 && startHour +this.intervalValue <= 14)
      { 
        startHour= 14
      }


      let valid = false
      while (valid === false) {
        let event = this.events.filter((event) => {
          return event.id === id
        })
        if (typeof(event[0]) !== 'undefined') {
          id++
        }
        else {
          valid = true
        }
      }
      let color = colors.white
      let canResize = true
      let canDrag = true
      let startDate = addHours(startOfDay(new Date(this.viewDate)), startHour)
      let endDate = addHours(startOfDay(new Date(this.viewDate)), startHour+this.intervalValue)
      let sH = `${String(startDate.getHours()).padStart(2,'0')}:${String(startDate.getMinutes()).padStart(2, '0')}`
      let eH = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
      if (endDate.getTime() < new Date().getTime()) {
        color = colors.blue
        canResize = false
        canDrag = false
      }
      else if (startDate.getTime() <= new Date().getTime() && endDate.getTime() > new Date().getTime()) {
        color = colors.green
        canResize = false
        canDrag = false
      }
      if (this.route != "reservations") {
        canResize = false
        canDrag = false
      }
      this.events[id] = {
        id: id,
        title: `${sH} - ${eH}`,
        start: startDate,
        end: endDate,
        meta: {
          group: this.groups[this.highestGroupId]
        },
        resizable: {
          beforeStart: false,
          afterEnd: true
        },
        draggable: false,
        color: color
      }
      
      startHour = startHour+this.intervalValue
      if (typeof(option) == 'undefined' || option !== 'scheduleGen') {
        let timeslotDate = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate()
        let timeslot = {
          Timeslot_date: timeslotDate,
          Begin_time: startDate.toTimeString().substr(0, 8),
          End_time: endDate.toTimeString().substr(0, 8),
          Exam_group: maxGroups+1,
          Exam_type_idExam_type: null,
          Exam_center_idExam_center: this.idExamCenter
        }
        if (startHour < endHour) {
          this.timeslotService.addTimeslot(timeslot).subscribe()
        }
        else {
          this.timeslotService.addTimeslot(timeslot).subscribe(() => {

          }, () => {

          }, () => {
            setTimeout(() => {
              this.getSchedule()
              setTimeout(() => {
                this.getSchedule()
                // setTimeout(() => {
                //   this.getSchedule()
                // }, 1000)
              }, 1000)
            }, 500)
          })
        }
      }
      if (startHour >= endHour){
        break;
      }
      id++
    }
    this.groupsInDate = this.groups.filter((group)=> {
      return group.date == currentDate
    })
    if (option !== 'scheduleGen') {
      setTimeout(() => {
        this.getSchedule()
        this.toastr.success('Grupo criado', 'Sucesso',{
          timeOut: 10000,
          closeButton: true
        })
      },1000)      
    }
  }


  //=======================EVENT/GROUP DELETION=======================\\

  deleteGroupNoConfirm() {
    let currentDate = this.getCurrentDateFormatted()
    let filteredGroups = this.groups.filter((group) => {
      return group.date == currentDate
    })
    
    let groupToDelete = filteredGroups.pop()
    let groupPosition = this.groups.indexOf(groupToDelete)
    this.groups.splice(groupPosition, 1)
    let eventsToDelete = this.events.filter((event) => {
      return event.meta.group == groupToDelete
    })
    for (let i = 0; i < this.events.length; i++){
      for (let ind = 0; ind < eventsToDelete.length; ind++) {
        if (this.events[i] == eventsToDelete[ind]) {
          this.timeslotService.deleteTimeslot(this.events[i].id)
          this.events.splice(i, 1)
          this.refreshTimeslots(this.groups, this.events)
        }
      }
    }
    this.refreshTimeslots(this.groups, this.events)
  }

  deleteGroup() {
    let i = this.startHour
    let eventCount = 0
    while (i < (this.endHour-1)) {
      i += this.intervalValue
      eventCount++
    }
    let accept = false
        let currentDate = this.getCurrentDateFormatted()
        let filteredGroups = this.groups.filter((group) => {
          return group.date == currentDate
        })
        
        let groupToDelete = filteredGroups.pop()
        let groupPosition = this.groups.indexOf(groupToDelete)
        this.groups.splice(groupPosition, 1)
        let eventsToDelete = this.events.filter((event) => {
          return event.meta.group == groupToDelete
        })
        let safeToDelete = true
        for (let i = 0; i < eventsToDelete.length; i++) {
          if (typeof(eventsToDelete[i].meta.currentNumStudents) !== 'undefined') {
            if (eventsToDelete[i].meta.currentNumStudents > 0) {
              this.toastr.error('Não é possível eliminar o grupo. Existem exames marcados no mesmo.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
              safeToDelete = false
              break ;
            }
          }
        }
        if (safeToDelete === true ) {          
          for (let i = 0; i < this.events.length; i++){
            for (let ind = 0; ind < eventsToDelete.length; ind++) {
              if (this.events[i] == eventsToDelete[ind]) {
                this.timeslotService.deleteTimeslot(this.events[i].id).subscribe()
                this.events.splice(i, 1)
                this.refreshTimeslots(this.groups, this.events)
                
              }
            }
          }
          this.getSchedule()
          this.toastr.success('Grupo eliminado', 'Notificação',{
          timeOut: 10000,
          closeButton: true
        })
          let curDate = new Date(this.currentDate)
          let comparisonDate = new Date(curDate.setDate(curDate.getDate()))
          if (comparisonDate.toISOString().includes('23:00:00')) {
            comparisonDate.setHours(comparisonDate.getHours()+1)
          }
          let groupsInDate = this.timeslots.filter((obj) => {
            return new Date(obj[0].Group_day).toISOString() == comparisonDate.toISOString()
          })
          let maxGroups = groupsInDate[0][0].Max
          let dayLock = groupsInDate[0][0].Day_lock
          
        
          let updateObject = {
            Max: maxGroups-1,
            Day_lock: dayLock
          }
          if (updateObject.Max < 0) {
            updateObject.Max = 0
          }
          this.dailyGroupService.updateDailyGroup(groupsInDate[0][0].idGroups, updateObject).subscribe()
      
          this.events = [...this.events]
          this.groups = [...this.groups]
        }
  }

  deleteEvent() {
    let eventToDelete: CalendarEvent = this.event
    let eventGroup = eventToDelete.meta.group
    this.event = undefined
    let eventPosition = this.events.indexOf(eventToDelete)
    if (eventToDelete.meta.pauta) {
      this.pautaService.deletePauta(eventToDelete.meta.pauta.idPauta).subscribe(() => {},
      () => {
        this.toastr.error('Erro ao eliminar a pauta', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
      }, () => {
        this.timeslotService.deleteTimeslot(eventToDelete.id).subscribe(() => {},
        (err) => {
          this.toastr.error('Erro ao eliminar o timeslot', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
        },
        () => {
          
          this.events.splice(eventPosition, 1)
          this.events = [...this.events]
          let eventsInGroup = this.events.filter((event) => {
            return event.meta.group == eventGroup
          })
          if (eventsInGroup.length == 0) {
            let groupPosition = this.groups.indexOf(eventGroup)
            this.groups.splice(groupPosition, 1)
            let curDate = new Date(this.currentDate)
            let comparisonDate = new Date(curDate.setDate(curDate.getDate()))
            if (comparisonDate.toISOString().includes('23:00:00')) {
              comparisonDate.setHours(comparisonDate.getHours()+1)
            }
            let groupsInDate = this.timeslots.filter((obj) => {
              return new Date(obj[0].Group_day).toISOString() == comparisonDate.toISOString()
            })
            let maxGroups = groupsInDate[0][0].Max
            let dayLock = groupsInDate[0][0].Day_lock
          
            let updateObject = {
              Max: maxGroups-1,
              Day_lock: dayLock
            }
            if (updateObject.Max < 0) {
              updateObject.Max = 0
            }
            this.dailyGroupService.updateDailyGroup(groupsInDate[0][0].idGroups, updateObject).subscribe()
          }
          this.toastr.success('Timeslot eliminado', 'Sucesso',{
          timeOut: 10000,
          closeButton: true
        })
          this.refreshTimeslots(this.groups, this.events)
        })
      })
    }
    else {
      this.timeslotService.deleteTimeslot(eventToDelete.id).subscribe(() => {},
      (err) => {
        this.toastr.error('Erro ao eliminar o timeslot', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
      },
      () => {
        
        this.events.splice(eventPosition, 1)
        this.events = [...this.events]
        let eventsInGroup = this.events.filter((event) => {
          return event.meta.group == eventGroup
        })
        if (eventsInGroup.length == 0) {
          let curDate = new Date(this.currentDate)
          let comparisonDate = new Date(curDate.setDate(curDate.getDate()))
          if (comparisonDate.toISOString().includes('23:00:00')) {
            comparisonDate.setHours(comparisonDate.getHours()+1)
          }
          let groupsInDate = this.timeslots.filter((obj) => {
            return new Date(obj[0].Group_day).toISOString() == comparisonDate.toISOString()
          })
          let maxGroups = groupsInDate[0][0].Max
          let dayLock = groupsInDate[0][0].Day_lock
          if (maxGroups - 1 === 0) {
            this.dailyGroupService.deleteDailyGroup(groupsInDate[0][0].idGroups).subscribe(res => window.alert(res))
            let groupPosition = this.groups.indexOf(eventGroup)
            this.groups.splice(groupPosition, 1)
            this.groupsInDate = null
            this.getSchedule()
          }
          else {
            let updateObject = {
              Max: maxGroups-1,
              Day_lock: dayLock
            }
            if (updateObject.Max < 0) {
              updateObject.Max = 0
            }
            this.dailyGroupService.updateDailyGroup(groupsInDate[0][0].idGroups, updateObject).subscribe()
            let groupPosition = this.groups.indexOf(eventGroup)
            this.groups.splice(groupPosition, 1)
            this.checkIfGroupDecrease(eventToDelete)
          }
        }
        this.toastr.success('Timeslot eliminado', 'Sucesso',{
          timeOut: 10000,
          closeButton: true
        })
        this.refreshTimeslots(this.groups, this.events)
      })
    }
  }

  checkIfGroupDecrease(deletedEvent) {
    let curDate = new Date(this.currentDate)
    let comparisonDate = new Date(curDate.setDate(curDate.getDate()))
    if (comparisonDate.toISOString().includes('23:00:00')) {
      comparisonDate.setHours(comparisonDate.getHours()+1)
    }
    let groupsInDate = this.timeslots.filter((obj) => {
      return new Date(obj[0].Group_day).toISOString() == comparisonDate.toISOString()
    })
    let deletedGroupNumber = parseInt(deletedEvent.meta.group.title.substr(6,3))
    let maxGroups = groupsInDate[0][0].Max-1
    let viewDateDate = this.viewDate.getFullYear() + '/' + (this.viewDate.getMonth()+1) + '/' + this.viewDate.getDate()
    let eventsInDate: any[] = []
    let eventId = 0
    let changeGroupNumber = []
    let updateNumbers: boolean = false
    for (let i = 0; i < this.events.length; i++) {
      if(this.events[i] != undefined) {
        let eventDate = this.events[i].start.getFullYear() + '/' + (this.events[i].start.getMonth()+1) + '/' + this.events[i].start.getDate()
        if (eventDate == viewDateDate) {
          if (parseInt(this.events[i].meta.group.title.substr(6,3)) > deletedGroupNumber) {
            changeGroupNumber.push(this.events[i])
          }
          if (parseInt(this.events[i].meta.group.title.substr(6,3)) > maxGroups) {
            updateNumbers = true
          }
          eventsInDate[eventId] = this.events[i]
          eventId++
        }
      }
    }
    if (updateNumbers){
      for (let i = 0; i < changeGroupNumber.length; i++) {
        let objectToSend = {
          Exam_group: parseInt(changeGroupNumber[i].meta.group.title.substr(6,3)) - 1,
        }
        this.timeslotService.updateTimeslot(changeGroupNumber[i].id, objectToSend).subscribe()
      }
    }
    this.getSchedule()
  }


  //=======================TIMESLOT OPERATIONS=======================\\
  
  warnInvalid() {
    this.submitted = true
    this.toastr.error('Formulário inválido', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
  }

  goToTop() {
    let top = document.getElementById('top')
    if (top !== null) {
      top.scrollIntoView()
      top = null
    }
  }
  
  checkBoxChecked() {
    if (this.reservationForm.get('exam_expiration_date').value !== null) {
      this.previousExamExpirationDate = this.reservationForm.get('exam_expiration_date').value
    }
    this.isChecked = !this.isChecked
    if (!this.isChecked) {
      this.reservationForm.patchValue({ exam_expiration_date: null })
      this.reservation.exam_expiration_date = null
      this.reservationForm.controls['exam_expiration_date'].markAsDirty()
    }
    if (this.isChecked) {
      this.reservation.exam_expiration_date = this.previousExamExpirationDate
      this.reservationForm.patchValue({ exam_expiration_date: this.datePipe.transform(this.reservation.exam_expiration_date, 'yyyy-MM-dd')})
      this.reservationForm.controls['exam_expiration_date'].markAsDirty()
    }
  }

  async chooseTimeslot(checkIfEvent, modal) {
    this.hasValidReservations = false
    this.examiner = {}
    this.examsInPauta = []
    if (!this.timesChanged) {
      this.chosenExamType = {}
      if (checkIfEvent.target.className.includes('cal-event') && !this.lockTimeslotSelection) {
        this.lockTimeslotSelection = true
        let chosenEventId = this.dataShareService.getChosenTimeslotId()
        let chosenEvent = this.events.filter((event) => {
          return event.id == chosenEventId
        })
        if (typeof(chosenEvent[0].meta.exists !== 'undefined')) {
          if (chosenEvent[0].meta.exists) {
            this.timeslotExists = true
          }
          else {
            this.timeslotExists = false
          }
        }
        else {
          this.timeslotExists = false
        }
        this.event = chosenEvent[0]
        this.reservationService.getReservationByTimeslot(this.event.id).subscribe(res => this.timeslotReservations = res,
        () => {
          
        },
        () => {
          if (this.timeslotReservations) {
            this.timeslotReservations = [...this.timeslotReservations]
            let validReservations = this.timeslotReservations.filter((reservation) => {
              return reservation.Lock_expiration_date === null
            })
            if (validReservations.length) {
              this.hasValidReservations = true
            }
          }
          try {
            this.chosenExamType = this.event.meta.examType
          }
          catch {
            this.chosenExamType = null
          }
          if (this.event.meta.pauta) {
            let chosenType = this.examTypes.filter((type) => {
              return type.idExam_type === this.event.meta.pauta.Exam_type_idExam_type
            })
            this.chosenExamType = chosenType[0]
            if (this.route == "results") {
              this.dataFetchService.getExaminerQualificationsForce(this.event.id).subscribe(res => this.examinersExamType = res,
                () => {

                }, () => {
                  if (typeof(this.event.meta.pauta.Examiner_qualifications_idExaminer_qualifications) !== 'undefined') {
                    let filteredExaminer = this.examiners.filter((examiner) => {
                      for (let i = 0; i < this.examinersExamType.length; i++) {
                        let examinerIWant
                        if (examiner.Examiner_name === this.examinersExamType[i].Examiner_name && examiner.License_num === this.examinersExamType[i].License_num) {

                        }
                      }
                    })
                  }
                })
              // this.dataFetchService.getExaminerQualifications(this.event.meta.pauta.Examiner_qualifications_idExaminer_qualifications)
              //let filteredExaminers = this
              console.log(this.examiners)
              // let filteredExams = this.exams.filter((exam) => {
              //   return exam.idPauta == this.event.meta.pauta.Pauta_num
              // })
              // this.examsInPauta = filteredExams
              // let filteredExaminerQualifications = this.examinerQualifications.filter((examQual) => {
              //   return examQual.Exam_type_idExam_type == this.event.meta.pauta.Exam_type_idExam_type
              // })
              // this.examinerQualificationsExamType = filteredExaminerQualifications
              // for (let i = 0; i < this.examinerQualificationsExamType.length; i++) {
              //   let examinerToAdd = this.examiners.filter((examiner) => {
              //     return examiner.idExaminer == this.examinerQualificationsExamType[i].Examiner_idExaminer
              //   })
              //   this.examinersExamType[i] = examinerToAdd[0]
              // }
              // let c = this.examinerQualificationsExamType.filter((qual) => {
              //   return qual.idExaminer_qualifications === this.event.meta.pauta.Examiner_qualifications_idExaminer_qualifications
              // })
              // if (c.length) {
              //   let examiner = this.examiners.filter((examiner) => {
              //     return examiner.idExaminer == c[0].Examiner_idExaminer
              //   })
              //   this.examiner = examiner[0]
              // }
            }
          }
          if (this.chosenExamType != null) {
            if (this.chosenExamType.Category.length === 1) {
              this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/];
            }
            else if (this.chosenExamType.Category.length === 2) {
              this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
            }
            else if (this.chosenExamType.Category.length >= 3) {
              if (this.chosenExamType.Category.includes(',')) {
                let [a, b, c] = this.chosenExamType.Category.split(',')
                if (a.length >= 3 || b.length >= 3) {
                  this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/, /[a-zA-Z]/];
                }
                else {
                  if (typeof(c) !== "undefined") {
                    if (c.length >= 3) {
                      this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/, /[a-zA-Z]/];
                    }
                    else {
                      if (a.length === 2 || b.length === 2 || c.length === 2) {
                        this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
                      }
                      else {
                        this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/];
                      }
                    }
                  }
                  else {
                    if (a.length === 2 || b.length === 2) {
                      this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
                    }
                    else {
                      this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/];
                    }
                  }
                }
              }
              else {
                this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/, /[a-zA-Z]/];
              }
            }
          }
          this.oldStart = this.event.start
          this.oldEnd = this.event.end
          this.oldGroup = this.event.meta.group
          if (this.route == "results" && !this.scheduleLocked && this.event.meta.currentNumStudents > 0) {
            // this.examTypeExaminers = this.examiners.filter((examiner) => {
            //   return examiner.
            // })
          }
          this.openModal(modal)
          if (this.userIdSchool === 'null') {
            // this.timeslotReservations = this.reservations.filter((reservation) => {
            //   return reservation.idTimeslot == this.event.id
            // })
          }
          else {
            if (this.timeslotReservations !== null) {
              this.timeslotReservations = this.timeslotReservations.filter((reservation) => {
                return (reservation.School_Permit == this.userSchoolPermit)
              })
            }
          }

          try {
            console.log(this.timeslotReservations)
            if (typeof(this.timeslotReservations) !== 'undefined' && this.timeslotReservations.length) {
              for (let i = 0; i < this.timeslotReservations.length; i++) {
                this.hasReservations = true
                this.reservation = this.timeslotReservations[i]
              }
            }
            else {
              this.hasReservations = false
            }
          }
          catch {
            this.reservation = {}
            this.timeslotReservations = []
            this.hasReservations = false
          }
        })
      }
    }
  }

  clearReservations() {
    this.timeslotReservations = []
    this.reservation = {}
    this.hasReservations = false
  }

  getAllowedExaminers() {
    this.dataFetchService.getExaminerQualificationsForce(this.event.id).subscribe(res => this.examinersExamType = res,
       () => {

       }, () => {
        this.openModal(this.examinerTable)
       })
  }

checkValue(val) {
    let stringy = val.substring(15)
    if (stringy.substr(2,1) === '_') {
      stringy = stringy.slice(0, stringy.length-1)
    }
    if (stringy.substr(1,1) === '_') {
      if (stringy.substr(2,1) !== '_') {
        let [a, b] = stringy.split('_')
        stringy = a+b
      }
      else {
        stringy = stringy.slice(0, stringy.length-1)
      }
    }
    if (this.chosenExamType.Category.includes(',')) {
      let [a, b, c] = this.chosenExamType.Category.split(',')
      if (a.includes('E')) {
        a = a + 'E'
      }
      if (b.includes('E')) {
        b = b + 'E'
      }
      if (c !== null && c.includes('E')) {
        c = c + 'E'
      }
      if (stringy === a || stringy === b || stringy === c) {}
      else {
        this.reservationForm.controls['Student_license'].setErrors({'formatError': true})
      }
    }
    else {
      let cat = this.chosenExamType.Category
      if (cat.includes('+')) {
        let [a, b] = cat.split('+')
        cat = a + b
      }
      if (stringy === cat) {}
      else {
        this.reservationForm.controls['Student_license'].setErrors({'formatError': true})
      }
    }
  }
  
  openReservation(reservation, modal, option) {
    this.reservation = reservation
    this.reservationForm.patchValue( {
      Student_name: reservation.Student_name,
      Student_num: reservation.Student_num,
      Birth_date: this.datePipe.transform(reservation.Birth_date, 'yyyy-MM-dd'),
      ID_num: reservation.ID_num,
      ID_expire_date: this.datePipe.transform(reservation.ID_expire_date, 'yyyy-MM-dd') ,
      tax_num: reservation.Tax_num,
      Drive_license_num: reservation.Drive_license_num,
      Obs: reservation.Obs,
      School_Permit: reservation.School_Permit,
      Student_license: reservation.Student_license,
      Expiration_date: this.datePipe.transform(reservation.Expiration_date, 'yyyy-MM-dd'),
      Type_category_idType_category: reservation.Type_category_idType_category,
      T_ID_type_idT_ID_type: reservation.T_ID_type_idT_ID_type,
      Exam_type_idExam_type: reservation.Exam_type_idExam_type,
      Car_plate: reservation.Car_plate,
      idTimeslot: reservation.idTimeslot,
      exam_expiration_date: this.datePipe.transform(reservation.exam_expiration_date, 'yyyy-MM-dd')
    })
    if (this.userIdSchool !== 'null') {
      this.reservationForm.controls['School_Permit'].clearValidators()
      this.reservationForm.controls['School_Permit'].updateValueAndValidity()
      this.reservationForm.patchValue( {
        School_Permit: this.userSchoolPermit
      })
    }
    else {
      this.reservationForm.controls['School_Permit'].setValidators(Validators.required)
      this.reservationForm.controls['School_Permit'].updateValueAndValidity()
    }
    this.reservationIdType = parseInt(reservation.T_ID_type_idT_ID_type)
    if (option === 'view') {
      this.reservationForm.disable()
      this.formIsEditable = false
      this.editingReservation = false
      if (reservation.exam_expiration_date != null) {
        this.isChecked = true
      }
    }
    else if (option === 'edit') {
      this.editingReservation = true
    }
    this.openModal(modal)
  }
  
  modifyTimeslot(newStart, newEnd, newExamType) {
    const event = this.event
    if (newExamType.selectedOption !== null) {
      this.eventTimesChanged({event, newStart, newEnd}, newExamType.selectedOption)
    }
    else {
      this.eventTimesChanged({event, newStart, newEnd})
    }
  }

  selectExaminer(examiner) {
    if (typeof(examiner.Examiner_name !== 'undefined')) {
      this.examiner = examiner
    }
  }

  deselectExaminer() {
    this.examiner = undefined
  }

  sendTimeslots() {
    let viewDateDate = this.viewDate.getFullYear() + '/' + (this.viewDate.getMonth()+1) + '/' + this.viewDate.getDate()
    let eventsInDate: CalendarEvent [] = []
    let eventId = 0
    for (let i = 0; i < this.events.length; i++) {
      if(this.events[i] != undefined) {
        let eventDate = this.events[i].start.getFullYear() + '/' + (this.events[i].start.getMonth()+1) + '/' + this.events[i].start.getDate()
        if (eventDate == viewDateDate) {
          eventsInDate[eventId] = this.events[i]
          eventId++
        }
      }
    }
    this.timeslots = [{}]
    let timeslotDate = eventsInDate[0].start.getFullYear() + '-' + (eventsInDate[0].start.getMonth()+1).toString().padStart(2,'0') + '-' + eventsInDate[0].start.getDate().toString().padStart(2,'0')
    for (let i = 0; i < eventsInDate.length; i++) {
      this.timeslots[i] = {}
      this.timeslots[i].Timeslot_date = timeslotDate
      this.timeslots[i].Begin_time = eventsInDate[i].start.toTimeString().substr(0, 8)
      this.timeslots[i].End_time = eventsInDate[i].end.toTimeString().substr(0, 8)
      this.timeslots[i].Exam_group = parseInt(eventsInDate[i].meta.group.title.substr(6,3))
      this.timeslots[i].Exam_type_idExam_type = null
      this.timeslots[i].Exam_center_idExam_center = this.idExamCenter
      this.timeslotService.addTimeslot(this.timeslots[i]).subscribe(timeslot => this.timeslots.push(timeslot))
    }
  }

  sortExamTypes() {
    let diff = this.event.end.valueOf() - this.event.start.valueOf()
    let diffInHours = diff/1000/60/60
    this.examTypesAllowed = this.examTypes.filter((examType) => {
      let durHours = examType.Duration.substr(0,2)
      let durMinutes = examType.Duration.substr(3,2)
      let hours = new Date()
      let day = new Date()
      day.setHours(0,0,0,0)
      hours.setHours(parseInt(durHours), parseInt(durMinutes),0,0)
      let hourDiff = hours.valueOf() - day.valueOf()
      let hourDiffInHours = hourDiff/1000/60/60
      return hourDiffInHours <= diffInHours
    })
    if (this.userIdSchool != 'null') {
      let theoricalExams = this.examTypesAllowed.filter((examType) => {
        return examType.Description.includes('Teór')
      })
      for (let i = 0; i < theoricalExams.length; i++) {
        let index = this.examTypesAllowed.indexOf(theoricalExams[i])
        this.examTypesAllowed.splice(index, 1)
      }
    }
  }

  async defineExamType(examType) {
    this.event.meta.maxStudents = examType.Num_students,
    this.event.meta.examType = examType
    this.event.meta.examTypeShort = examType.Short
    let dataToSend =this.examTypes.filter((type) => {
      return type == this.event.meta.examType
    })
    let newEnd = new Date(this.event.start)
    let durHours = dataToSend[0].Duration.substr(0,2)
    let durMinutes = dataToSend[0].Duration.substr(3,2)
    newEnd.setHours(newEnd.getHours()+parseInt(durHours))
    newEnd.setMinutes(newEnd.getMinutes()+parseInt(durMinutes))
    let endFormatted = parseFloat(`${newEnd.getHours()}.${(parseInt(newEnd.getMinutes().toString()))}`)
    if (endFormatted > 13 && endFormatted < 14.3) {
      newEnd.setHours(13,0,0,0)
    }
    this.event.end = newEnd
    let formattedEnd = `${newEnd.getHours().toString().padStart(2,'0')}:${(newEnd.getMinutes()).toString().padStart(2,'0')}:${newEnd.getSeconds().toString().padStart(2,'0')}`
    let objectToSend = { 
      Exam_type_idExam_type: dataToSend[0].idExam_type,
      End_time: formattedEnd
    }

    this.timeslotService.updateTimeslot(this.event.id, objectToSend).subscribe(() => {},
    () => {
      this.toastr.error('Erro ao definir o tipo de exame', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
      this.getSchedule()
    },
    () => {
      this.getSchedule()
    })
    
  }

  async getSchedule() {
    this.lockedDates = []
    this.events = []
    this.groups = []
    this.refreshTimeslots(this.groups, this.events)
    setTimeout(async () => {
      this.timeslots = await this.getWeekTimeslots()
      if (this.timeslots.length !== 0) {
        for (let i = 0; i < this.timeslots.length; i++) {
          this.genGroup(this.timeslots[i])
        }
      }
      this.refreshTimeslots(this.groups, this.events)
    }, 100)
    this.reservationService.getReservation().subscribe(res => {if (res === null) {this.reservations = []} else { this.reservations = res}},
    () => {

    }, () => {
      if (this.reservations){
        this.reservations = [...this.reservations]
      }
    })
    this.pautaService.getPautas().subscribe(res => { if (res === null) { this.pautas = []} else {this.pautas = res}})
  }

  updateTimeslot(objectToSend) {
    this.timeslotService.updateTimeslot(objectToSend.id, objectToSend.objectToSend).subscribe()
  }

  async sendDailyGroups() { 
    let currentDate = this.getCurrentDateFormatted()
    let max = this.groups.filter((group) => {
      return group.date == currentDate
    })
    // max is the number of groups in that day
    let daylock = 1
    this.dayLockIcon = true
    this.scheduleLocked = true
    this.lockedDates.push(this.viewDate.getDate())
    let replaced = false
    if (max[0].date.substr(8, 2) == '00') {
      max[0].date = max[0].date.replace('00', '01')
      replaced = true
    }
    let dt = new Date((max[0].date))
    let newDate = this.getCurrentDateFormatted(dt)
    let groupToAdd: DailyGroup = { Group_day: newDate, Max: max.length, Day_lock: daylock }
    this.dailyGroupService.addDailyGroup(groupToAdd).subscribe(() => groupToAdd, () => {

    },
    async () => {
      await this.sendTimeslots()
      setTimeout( async () => {
        this.events = []
        this.groups = []
        this.timeslots = await this.getWeekTimeslots()
        setTimeout(() => {
        if (this.timeslots.length !== 0) {
          for (let i = 0; i < this.timeslots.length; i++) {
            this.genGroup(this.timeslots[i])
            this.groups = [...this.groups]
            this.events = [...this.events]
          }
        }
        // this.timeslotExists = true
        this.refreshTimeslots(this.groups, this.events)
        }, 250)
      }, 850)
    })
    
  }


  //=======================SCHEDULE OPERATIONS=======================\\

  printData() {
    const printContent = document.getElementById("comp");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close(); 
  }

  getExamStatuses() {
    this.reservationService.getExamStatus()
  }

  async createReservation(reservation) {
    this.reservationService.addReservation(reservation).subscribe((res) => {
      if (res) {
        this.toastr.success('Reserva criada com sucesso', 'Notificação',{
          timeOut: 10000,
          closeButton: true
        })
      }
    },
    (e) => {
      this.toastr.error('A reserva não foi criada', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
      this.cancelLockReservation()
    }, 
    () => {
      this.event.meta.currentNumStudents++
      this.timeslotReservations.push(reservation)
      this.reservationService.getReservation().subscribe(res => this.reservations = res, 
        (e) => {
        }, 
        () => {
          this.getSchedule()
        })
    })
  }

  resetReservationForm() {
    this.reservationForm.enable()
    this.formIsEditable = true
    this.reservationForm.reset()
    this.isChecked = false
    this.previousExamExpirationDate = null
    this.submitted = false
  }

  cancelLockReservation() {
    if (this.reservationAmount == 1) {
      this.reservationService.unlockReservation((this.lockedReservationId)).subscribe()
    }
    else if (this.reservationAmount == 2 && this.createdReservations == 0) {
      this.reservationService.unlockReservation(this.lockedReservationId).subscribe()
      // this.reservationService.unlockReservation(this.lockedReservationId+1).subscribe()
    }
    else {
      // this.reservationService.unlockReservation(this.lockedReservationId+1).subscribe()
    }
    this.createdReservations = 0
  }

  setReservationAmount(amount) {
    this.reservationAmount = amount
    this.startValue = 1
    this.createdReservations = 0
    this.lockReservation()
    if (amount == 1) {
      this.canClose = true
    }
    else {
      this.canClose = false
    }
  }

  accumulateReservations() {
    let examType = this.examTypes.filter((type) => {
      return type == this.event.meta.examType
    })
    this.reservationForm.patchValue({idTimeslot: this.event.id, Exam_type_idExam_type: examType[0].Exam_type_idExam_type, Type_category_idType_category: examType[0].Type_category_idType_category})
    if (this.userIdSchool !== 'null') {
      this.reservationForm.patchValue({School_Permit: this.userSchoolPermit})
    }
    let formValues = this.reservationForm.getRawValue()
    console.log(typeof(formValues.exam_expiration_date))
    if (typeof(formValues.exam_expiration_date) == 'string') {
      if (formValues.exam_expiration_date === "" ) {
        this.reservationForm.patchValue({exam_expiration_date: null})
      }
    }
  
    if (formValues.Student_license.toString().substr(16,1) == '_') {
      if (formValues.Student_license.toString().substr(16, 2) == '__') {
        let val = formValues.Student_license.toString().slice(0,formValues.Student_license.toString().length-2)
        this.reservationForm.patchValue({Student_license: val})
      }
      else {
        let val = formValues.Student_license.toString().slice(0,formValues.Student_license.toString().length-1)
        this.reservationForm.patchValue({Student_license: val})
      }
    }

    this.createReservation(this.reservationForm.getRawValue())
    this.createdReservations++
    if (this.createdReservations == this.reservationAmount - 1) {
      this.canClose = true
    }
  }

  async getReservationsById() {
    await this.reservationService.getReservationByTimeslot(this.event.id).subscribe(() => {},
      error => {
        
      })
  }
  checkTimeslotLock() {
    let reservationsInTimeslot = this.reservations.filter((reservation) => {
      return reservation.idTimeslot === this.event.id
    })
    console.log(reservationsInTimeslot)
  }

  async lockReservation() {
    let alreadyLocked = false
    let amountLocked = 0
    let lockedRes = null
    if (this.userIdSchool !== 'null') {
      this.reservationForm.controls['School_Permit'].clearValidators()
      this.reservationForm.controls['School_Permit'].updateValueAndValidity()
    }
    else {
      this.reservationForm.controls['School_Permit'].setValidators(Validators.required)
      this.reservationForm.controls['School_Permit'].updateValueAndValidity()
    }
    if (this.timeslotReservations){
      for (let i = 0; i < this.timeslotReservations.length; i++) {
        if (this.timeslotReservations[i].Lock_expiration_date !== null) {
          alreadyLocked = true
          amountLocked++
          lockedRes = this.timeslotReservations[i]
        }
      }
      if (alreadyLocked === false) {
        await this.reservationService.lockReservation(this.event, this.reservationAmount).subscribe((data) => {
          this.lockedReservationId = data.insertId
        },
          error => { this.toastr.error('Ocorreu um erro ao trancar a reserva', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
        },
        () => {
          this.openModal(this.timeslotForm)
        })
      }
      else {
        if (lockedRes != null && this.reservationAmount !== 2) {
          if (amountLocked === 1 && this.reservationAmount === 1 && lockedRes.Account_User !== this.user) {
            await this.reservationService.lockReservation(this.event, 1).subscribe(res => this.lockedReservationId = res.insertId,
              error => { this.toastr.error('Ocorreu um erro ao trancar a reserva', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })}
              , () => {
                this.openModal(this.timeslotForm)
              })
          }
          else if (amountLocked === 1 && this.reservationAmount === 1 && lockedRes.Account_User === this.user) {
            this.openModal(this.timeslotForm)
          }
        }
        else if (amountLocked === 1 && this.reservationAmount === 2) {
          await this.reservationService.lockReservation(this.event, 1).subscribe(res => this.lockedReservationId = res.insertId,
            error => { this.toastr.error('Ocorreu um erro ao trancar a reserva', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })}
            , () => {
              this.openModal(this.timeslotForm)
            })
        }
        else {
          this.openModal(this.timeslotForm)
        }
      }
    }
    else {
      await this.reservationService.lockReservation(this.event, this.reservationAmount).subscribe((data) => {
        this.lockedReservationId = data.insertId
      },
        error => { this.toastr.error('Ocorreu um erro ao trancar a reserva', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
      },
      () => {
        this.openModal(this.timeslotForm)
      })
    }
  }

  unbookReservation(reservation) {
    this.reservationService.unbookReservation(reservation.idReservation).subscribe(() => {},
    () => {
      this.toastr.error('Ocorreu um erro. A reserva não foi cancelada.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
    }, 
    () => {
      this.reservationService.getReservation().subscribe(res => this.reservations = res,
        () => {
          
        }, 
        () => {
          let index = this.reservations.indexOf(reservation)
          this.reservations[index] = reservation
          // this.reservationService.getReservationByTimeslot(reservation.idTimeslot).subscribe(res => this.timeslotReservations = res)
          this.timeslotReservations = this.reservations.filter((reservation) => {
            return reservation.idTimeslot == this.event.id
          })
          this.event.meta.currentNumStudents--
          setTimeout(() => {
            this.getSchedule().then(() => {
              this.refreshTimeslots(this.groups, this.events)
              this.reservations = [...this.reservations]
              this.toastr.success('Reserva cancelada', 'Sucesso',{
          timeOut: 10000,
          closeButton: true
        })
            })
          },250)    
        }
      )
    })
  }

  checkIfLocked() {
    if (this.lockedDates.includes(this.viewDate.getDate())) {
      this.scheduleLocked = true
    }
    else {
      this.scheduleLocked = false
    }
    if (this.viewDate < new Date()) {
      this.scheduleLocked = true
    }
    this.dayLockIcon = this.scheduleLocked
  }
  
  editReservation(reservationForm) {
    let dirtyValues = {};

    Object.keys(reservationForm.controls)
      .forEach(key => {
        let currentControl = reservationForm.controls[key];
        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.editReservation(currentControl);
          else{
            dirtyValues[key] = currentControl.value;
            this.reservation[key] = currentControl.value
          }
        }
      });

    this.reservationPatchService.patchReservation(dirtyValues, this.reservation.idReservation, this.reservation.idTemp_Student)
      .subscribe(res => { this.toastr.success('A reserva foi atualizada com sucesso.', 'Notificação',{
          timeOut: 10000,
          closeButton: true
        }); },
      error=> this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro',{
          timeOut: 10000,
          closeButton: true
        }), 
      () => {
        let i = this.reservations.indexOf(this.reservation)
        this.reservations[i] = this.reservation
        this.reservations = [...this.reservations]
      })
  }

  lockSchedule() {
    let timeslotGroupsFiltered = []
    for (let i = 0; i < this.timeslots.length; i++) {
      timeslotGroupsFiltered.push(this.timeslots[i][0])
    }
    let viewDate = this.viewDate
    if (viewDate.toUTCString().includes('23:00:00')) {
      viewDate.setHours(viewDate.getHours() + 1)
    }
    let thisDay = timeslotGroupsFiltered.filter((day) => {
      console.log(new Date(day.Group_day).toUTCString())
      console.log(viewDate.toUTCString())
      return new Date(day.Group_day).toUTCString() == viewDate.toUTCString()
    })
    if (thisDay.length) {
      this.scheduleLocked = !this.scheduleLocked
      this.dayLockIcon = this.scheduleLocked
      if (thisDay[0].Day_lock == 1) {
        thisDay[0].Day_lock = 0
        this.lockedDates = this.lockedDates.filter((date) => {
          return date != viewDate.getDate()
        })
      }
      else {
        thisDay[0].Day_lock = 1
        this.lockedDates.push(viewDate.getDate())
      }
      this.dailyGroupService.changeLock(thisDay[0]).subscribe()
    }
    else {
      this.toastr.warning('Não existe um calendário nesta data.', 'Aviso',{
        timeOut: 10000,
        closeButton: true
      })
    }
  }

  async switchDate(buttonPressed) {
    if (this.userIdSchool == 'null') {
      this.navigationDisabled = true
    }
    if (this.viewDate.getDay() === 0) {
      if (buttonPressed === 'previous') {
        this.viewDate.setDate(this.viewDate.getDate() - 1)
      }
      else if (buttonPressed === 'next') {
        this.viewDate.setDate(this.viewDate.getDate() + 1)
      }
    }
    try {
      let newWeekNumber = this.timeslotService.getWeekNumber(this.viewDate)
      if ((newWeekNumber[0] != this.weekNumber[0]) || (newWeekNumber[1] != this.weekNumber[1])) {
        this.weekNumber = {...newWeekNumber}
        await this.getSchedule()
      }
    }
    catch {
      let newWeekNumber = this.timeslotService.getWeekNumber(this.viewDate)
      if ((newWeekNumber[0] != this.weekNumber[0]) || (newWeekNumber[1] != this.weekNumber[1])) {
        this.weekNumber = {...newWeekNumber}
        await this.getSchedule()
      }
    }
    this.currentDate = this.viewDate.getFullYear() +'/'+(this.viewDate.getMonth()+1)+'/'+this.viewDate.getDate()
    let currentDate = this.getCurrentDateFormatted()
    this.checkIfLocked()
    this.endValue = this.viewDate
    if (this.groups.length === 0) {
      if (this.viewDate.getTime() > new Date().getTime()) {
        setTimeout(() => {
          this.groupsInDate = this.groups.filter((group) => {
            return group.date == currentDate
          })
          let weekDay = this.viewDate.getDay()
          if (this.userIdSchool == 'null') {
            if(!this.groupsInDate.length && this.viewDate > new Date()) {
              if (this.weekendDays.includes(weekDay)) {
                if (this.route === 'reservations') {
                  this.openModal(this.dayIsWeekend)
                }
              }
              else {
                if (this.route === 'reservations') {
                  this.openModal(this.chooseToGenerate)
                }
              }
            }
          }
          this.navigationDisabled = false
          setTimeout(() => {
            document.getElementById('hid').click()
          }, 100)
        }, 1000)
      }
      else {
        this.navigationDisabled = false
      }
    }
    else {
      this.groupsInDate = this.groups.filter((group) => {
        return group.date == currentDate
      })
      let weekDay = this.viewDate.getDay()
      if (this.userIdSchool == 'null') {
        if(!this.groupsInDate.length && this.viewDate > new Date()) {
          if (this.weekendDays.includes(weekDay)) {
            if (this.route === 'reservations') {
              this.openModal(this.dayIsWeekend)
            }
          }
          else {
            if (this.route === 'reservations') {
              this.openModal(this.chooseToGenerate)
            }
          }
        }
      }
      this.navigationDisabled = false
    }
    this.setTime('startHour')
    this.setTime('startMinute')
    this.setTime('endHour')
    this.setTime('endMinute')
    this.refreshTimeslots(this.groups, this.events)
    setTimeout(() => {
      this.refreshTimeslots(this.groups, this.events)
    },100)
    setTimeout(() => {
      this.refreshTimeslots(this.groups, this.events)
    },250)
    setTimeout(() => {
      this.refreshTimeslots(this.groups, this.events)
    },500)
  }
  
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }, newExamType?): void {
    this.timesChanged = true
    let update = true
    if (newStart.getTime() == event.start.getTime() && newEnd.getTime() == event.end.getTime()) {
      update= false
    }
    
    let startFormatted = parseFloat(`${newStart.getHours()}.${(parseInt(newStart.getMinutes()))/6}`)
    let endFormatted = parseFloat(`${newEnd.getHours()}.${(parseInt(newEnd.getMinutes()))}`)
    let examTypeDefined = false
    try {
      if (event.meta.examType != null) {
        examTypeDefined = true
      }
    }
    catch {}
    if ((startFormatted >= 13 && startFormatted < 14 || endFormatted <= 14 && endFormatted > 13) || (endFormatted > 13 && startFormatted <= 13) || (endFormatted >= 14 && startFormatted < 14)) {
      this.toastr.error('Um timeslot não pode ocupar a hora de almoço.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
    }
    else {
      if (newStart >= newEnd) {
        this.toastr.error('Um timeslot não pode acabar antes de começar ou no mesmo momento.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
      }
      else {
        if ((newStart.getTime() == event.start.getTime() && newEnd.getTime() > event.end.getTime() && examTypeDefined) || (newStart.getTime() < event.start.getTime() && newEnd.getTime() == event.end.getTime() && examTypeDefined)) {
          let typeOfExam = this.examTypes.filter((type) => {
            return type == event.meta.examType
          })
          let examDuration = typeOfExam[0].Duration
          let compare = new Date()
          compare.setTime(event.start.getTime())
          let h = examDuration.substr(0,2)
          let m = examDuration.substr(3,2)
          compare.setHours(compare.getHours() + parseInt(h), compare.getMinutes() + parseInt(m))
          let maxDuration = (compare.getTime() - event.start.getTime())
          let newDuration = (newEnd.getTime() - newStart.getTime())
          if (newDuration > maxDuration ){
            this.toastr.error('Não pode aumentar a duração de um exame para além da sua duração máxima.', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
            return
          }
        }
        let oldStart = event.start
        event.start = newStart;
        let oldEnd = event.end
        event.meta.update = true
        if (typeof(newExamType) == 'undefined') {
          event.end = newEnd;
        }
        else {
          event.end = newEnd
          event.meta.examType = newExamType.value
          event.meta.examTypeShort = newExamType.value.Short
          event.meta.currentNumStudents = 0
          event.meta.maxStudents = newExamType.value.Num_students
          this.titleFormatter.day(event)
        }
        let stH = `${String(newStart.getHours()).padStart(2,'0')}:${String(newStart.getMinutes()).padStart(2, '0')}`
        let enH = `${String(newEnd.getHours()).padStart(2, '0')}:${String(newEnd.getMinutes()).padStart(2, '0')}`
        let oldEventTitle = event.title
        event.title = `${stH} - ${enH}`
        let eventsInDate = this.events.filter((otherEvent) => {
          return otherEvent.meta.group === event.meta.group
        })
        let operation = 'none'
        let eventPosition
        let resizeElement = eventsInDate.filter((otherEvent) => {
          if (otherEvent !== event && otherEvent.start.toString() === event.start.toString() && otherEvent.end.toString() === event.end.toString() && otherEvent.meta.group === event.meta.group) {
            operation = 'cancel'
            return 0
          }
          if (otherEvent.start < event.start && otherEvent.end > event.end) {
            operation = 'cancel'
            return 0
          }
          if (otherEvent.start > event.start && otherEvent.start < event.end) {
            if (otherEvent.color == colors.blue || otherEvent.color == colors.green) {
              operation = 'cancel'
              return 0
            }
            else {
              operation = 'cancel'
              // return (otherEvent.start > event.start && otherEvent.start < event.end) 
              return 0
            }
          }
          else if (otherEvent.end > event.start && otherEvent.end < event.end) {
            if (otherEvent.color == colors.blue || otherEvent.color == colors.green) {
              operation = 'cancel'
              return 0
            }
            else {
              operation = 'cancel'
              // return (otherEvent.end > event.start && otherEvent.end < event.end)
              return 0
            }
          }
          else {
            return 0
          }
        })
        if (operation == 'cancel') {
          event.start = oldStart
          event.end = oldEnd
          event.title = oldEventTitle
          this.toastr.error('Não pode sobrepor timeslots', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
          resizeElement = []
        }
        else {
          if (operation !== 'none' && operation !== 'cancel') {
            eventPosition = this.events.indexOf(resizeElement[0])
          }
          let eventPositions = []
          for (let i = 0; i < resizeElement.length; i++) {
            eventPositions[i] = this.events.indexOf(resizeElement[i])
          }
          for (let i = 0; i < eventPositions.length; i++) {
            if ((this.events[eventPositions[i]].start > event.start) && (this.events[eventPositions[i]].start < event.end)) { // down
              this.events[eventPositions[i]].start = event.end
            }
            if ((this.events[eventPositions[i]].end > event.start) && (this.events[eventPositions[i]].end < event.end)) { // up
              this.events[eventPositions[i]].end = event.start
            }
            if (this.events[eventPositions[i]].start >= this.events[eventPositions[i]].end) {
              this.timeslotService.deleteTimeslot(this.events[eventPositions[i]].id).subscribe(() => {}, 
              (error) => {
                window.alert(error)
              },
              () => {
                this.events.splice(eventPositions[i], 1)
              })
              
            }
            let sH
            let eH
            try {
              sH = `${String(this.events[eventPositions[i]].start.getHours()).padStart(2,'0')}:${String(this.events[eventPositions[i]].start.getMinutes()).padStart(2, '0')}`
              eH = `${String(this.events[eventPositions[i]].end.getHours()).padStart(2, '0')}:${String(this.events[eventPositions[i]].end.getMinutes()).padStart(2, '0')}`
            }
            catch {
              this.refreshTimeslots(this.groups, this.events)
            }
            this.events[eventPositions[i]].meta.update = true
            this.events[eventPositions[i]].title = `${sH} - ${eH}`
          }
          this.refreshTimeslots(this.groups, this.events)
          this.events = [...this.events];
          if (this.subject.includes('ALL_School') && update == true) {
            this.updateTimeslots()
          }
        }
        // if (event.start > oldStart && event.end == oldEnd) {
        //   this.generateNewEvent(oldStart, event.start, event.meta.group)
        // }
        // else if (event.end < oldEnd && event.start == oldStart) {
        //   this.generateNewEvent(event.end, oldEnd, event.meta.group)
        // }
      }
        
    }
    setTimeout(() => {
      this.timesChanged = false
    }, 100)
  }

  updateTimeslots() {
    let eventsToUpdate = this.events.filter((event) => {
      return event.meta.update == true
    })
    for (let i = 0; i < eventsToUpdate.length; i++) { 
      let id = eventsToUpdate[i].id
      let timeslotDate = eventsToUpdate[i].start.toISOString().substr(0,10)
      let start = eventsToUpdate[i].start.toTimeString().slice(0,8)
      let end = eventsToUpdate[i].end.toTimeString().slice(0,8)
      let objectToSend = {
        Timeslot_date: timeslotDate,
        Begin_time: start,
        End_time: end,
        Exam_group: eventsToUpdate[i].meta.group.title.substr(6,2),
      }
      this.updateTimeslot({id, objectToSend})
      this.events[id].meta.update = false
    }
  }

  askForBooking(reservation) {
    this.reservationService.askForBooking(reservation.idReservation).subscribe(() => {},
    () => {
      this.toastr.error('Ocorreu um erro. Pedido não enviado', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
    }, () => {
      let index = this.reservations.indexOf(reservation)
      this.reservations[index] = reservation
      this.events = []
      this.groups = []
      this.getSchedule().then(() => {
        this.reservationService.getReservation().subscribe(res => this.reservations = res, 
          (e) => {
            
          }, 
          () => {
            this.refreshTimeslots(this.groups, this.events)
            this.reservations = [...this.reservations]
          }
        )
      })
      this.toastr.success('Pedido enviado', 'Sucesso',{
          timeOut: 10000,
          closeButton: true
        })
    })
  }

  getCurrentDateFormatted(date?) {
    if (typeof(date) !== 'undefined') {
      let month = (date.getMonth()+1).toString()
      let day = date.getDate().toString()
      if (month.length === 1) {
        month = `0${month}`
      }
      if (day.length === 1) {
        day = `0${day}`
      }
      return date.getFullYear() + '-' + month + '-' + day
    }
    else {
      let month = (this.viewDate.getMonth()+1).toString()
      let day = (this.viewDate.getDate()).toString()
      if (month.length === 1) {
        month = `0${month}`
      }
      if (day.length === 1) {
        day = `0${day}`
      }
      return this.viewDate.getFullYear() + '-' + month + '-' + day
    }
  }

  openModal(modal) {
    if (this.lockTimeslotSelection) {
      this.lockTimeslotSelection = false
    }
    let currentDate = this.getCurrentDateFormatted()
    if ('newTimeslotModal' in modal._def.references) {
      let tempDate = new Date(currentDate)
      let date = `${tempDate.getUTCFullYear()}-${(tempDate.getUTCMonth()+1).toString().padStart(2,'0')}-${(tempDate.getUTCDate()).toString().padStart(2,'0')}`
      this.groupsInDate = this.groups.filter((group)=> {
        return group.date == date
      })
      if (this.groupsInDate.length > 0) {
        this.modalService.open(modal, {windowClass: 'modal-animation', centered: false , backdrop: 'static', keyboard: false})
      }
      else {
        this.toastr.error('Crie um grupo primeiro', 'Erro',{
          timeOut: 10000,
          closeButton: true
        })
      }
    }
    else {
      if ('reservationAmountForm' in modal._def.references) {
        this.maxReservations()
      }
      this.modalService.open(modal, {windowClass: 'modal-animation', centered: false, size: 'lg', backdrop: 'static', keyboard: false })
    }
    
  }

  groupChanged({ event, newGroup }) {
    event.color = newGroup.color;
    event.meta.group = newGroup;
    this.events = [...this.events];
  }


  //=======================PRIMENG LOCALE CONFIG=======================\\

  definePrimeCalendar() {
    this.pt = {
      firstDayOfWeek: 1,
      dayNames: [ "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado" ],
      dayNamesShort: [ "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb" ],
      dayNamesMin: [ "D", "S", "T", "Q", "Q", "S", "S" ],
      monthNames: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
      monthNamesShort: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
      today: "Hoje",
      clear: "Limpar",
      dateFormat: 'dd/mm/yy'
    }
    let today = new Date()
    let month = today.getMonth()
    let year = today.getFullYear()
    let prevMonth = (month === 0) ? 11 : month -1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);

    let invalidDate = new Date();
    invalidDate.setDate(today.getDate() - 1);
    this.invalidDates = [today,invalidDate];
  }
  
 //////////////////////////////////////DATE LIMITATIONS//////////////////////////////////////////////////

setMinMaxBirthDate() {
  let date = new Date(this.currentDate).getFullYear();
  this.maxBirthDate = '' + (date - 14) + '-12-31';
  this.minBirthDate = '' + (date - 100) + '-12-31';
}

setMinExpDate() {
  let date = new Date().getFullYear();
  this.minExpDate = this.datepipe.transform(this.currentDate, 'yyyy-MM-dd');
  this.maxExpDate = '' + (date + 20) + '-12-31';
}

validateDate(dateVal, type) {
  if (type === 'birthdate') {
    if ((new Date(dateVal).getFullYear()) > (new Date(this.currentDate).getFullYear() - 14)) {
      this.reservationForm.controls['Birth_date'].setErrors({ 'invalid_date': true });
    }
    else if ((new Date(dateVal).getFullYear()) < (new Date(this.currentDate).getFullYear() - 100)){
      this.reservationForm.controls['Birth_date'].setErrors({ 'invalid_date': true });
    }
    else { return null}
  }
  else if (type === 'idexp') {
    if ((new Date(dateVal).setHours(0,0,0,0) < new Date(this.currentDate).setHours(0,0,0,0)) || (new Date(dateVal).getFullYear()) > (new Date(this.currentDate).getFullYear() + 20)){
      this.reservationForm.controls['ID_expire_date'].setErrors({ 'invalid_date': true });
    }
    else {return null}
  }
  else if (type === 'licexp'){
    if ((new Date(dateVal).setHours(0,0,0,0) < new Date(this.currentDate).setHours(0,0,0,0))){
      this.reservationForm.controls['Expiration_date'].setErrors({ 'invalid_date': true });
    }
    else if((new Date(dateVal).getFullYear()) > (new Date(this.currentDate).getFullYear() + 2)){
      this.reservationForm.controls['Expiration_date'].setErrors({ 'invalid_date': true });
    }
    else {return null}
  }

  else if (type === 'teoexp'){
    if ((new Date(dateVal).setHours(0,0,0,0) < new Date(this.currentDate).setHours(0,0,0,0))){
      this.reservationForm.controls['exam_expiration_date'].setErrors({ 'invalid_date': true });
    }
    else if((new Date(dateVal).getFullYear()) > (new Date(this.currentDate).getFullYear() + 20)){
      this.reservationForm.controls['exam_expiration_date'].setErrors({ 'invalid_date': true });
    }
    else {return null}
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
