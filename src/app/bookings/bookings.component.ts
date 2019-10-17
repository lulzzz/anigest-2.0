import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BookingService } from './booking.service';
import { ToastrService } from 'ngx-toastr';
import * as html2canvas from 'html2canvas';
import { disableCursor } from '@fullcalendar/core';
import { ServerService } from '../student/add-student/server.service';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  
  public mask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  searchForm:FormGroup;
  startExamForm:FormGroup;
  siccForm: FormGroup;
  advancedSearch:FormGroup;
  public exams = [];
  public selectedBookings = [];
  public errorMsg;
  public result;
  idStudent;
  @ViewChild('notificationModal', { static: false }) public content: TemplateRef<any>;
  param1;
  param2;
  categories = [];
  resultAS;
  item1;
  item2;
  item3;
  public show:boolean = false;
  public createState:boolean = false;
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;
  count: Number;
  schools = [];
  statuses = [];
  examTypes = [];
  ids = [];
  statusSicc = [];
  subject;
  pepResults=[];
  pepValues;
  

  constructor(private modalService: NgbModal, private fb: FormBuilder, private service: BookingService, private toastr: ToastrService, private ss: ServerService, private auth: AuthService) {
    this.createForm();
   }
  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    });

    this.advancedSearch = this.fb.group({
      School_name: [null],
      Student_num: [null],
      Student_name: [null],
      Permit:[null],
      T_ID_type_idT_ID_type: [null],
      ID_num: [null],
      Student_license: [null],
      Booked_date1: [null],
      Booked_date2: [null],
      Timeslot_date1:[null],
      Timeslot_date2:[null],
      Exam_type_idExam_type:[null],
      Status:[null],
      T_exam_results_idT_exam_results:[null]
    });

    this.siccForm = this.fb.group({
      Pauta_num: [null],
      Timeslot_date1: [null],
      Timeslot_date2: [null],
      Exam_type_idExam_type: [null],
      Student_license: [null],
      Status_SICC: [null],
      sicc:"PEP"
    })

  }


  ngOnInit() {
    this.ss.getSchools().subscribe(data => this.schools = Object.values(data));
    this.ss.getStatus().subscribe(data => this.statuses = Object.values(data));
    this.ss.getIdType().subscribe(data => this.ids = Object.values(data));
    this.service.getExamType().subscribe(data => {this.examTypes = Object.values(data), console.log(data)});
    this.service.getStatusSicc().subscribe( res => {this.statusSicc = Object.values(res), console.log(res)});
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)});

  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  onShow(){
    this.show = true;
  }

  onHide(){
    this.show = false;
  }
  
  addBooking(){
    const modalRef1 = this.modalService.open(AddBookingComponent, {size: 'lg', backdrop: 'static'});
    
    modalRef1.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  editBooking(){
    const modalRef1 = this.modalService.open(EditBookingComponent, {size: 'lg', backdrop: 'static'});
    modalRef1.componentInstance.idExaminer = this.selectedBookings[0];
  }

  onGet(){
    this.service.getAllBookings()
    .subscribe(res => {
      if(res) {
        this.exams = Object.values(res);
        this.count = this.exams.length;
        console.log(this.exams);
      }
      else {
        this.toastr.error('Nenhum resultado foi encontrado.','Notificação', {
          timeOut: 10000,
          closeButton: true
        })}
    },
    error => { 
      this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro', {
        timeOut: 10000,
        closeButton: true
      });
      console.log(error)
    },
    )
  }

  onGetBookings(param1, param2) {
    this.param1 = param1;
    this.param2 = param2;
    this.service.getBookingbyParam(this.param1, this.param2)
      .subscribe(
        data1 => {
          if (data1) { this.exams = Object.values(data1),
            this.count = this.exams.length; }
          else { this.toastr.error('Nenhum resultado foi encontrado.','Notificação', {
            timeOut: 10000,
            closeButton: true
          }) }
        },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro', {
          timeOut: 10000,
          closeButton: true
        }));
  }


  openCard(id) {
    this.service.getBookingID(id)
    .subscribe(
      data1 => { if(data1) { this.selectedBookings = Object.values(data1),
        // this.startExamForm.patchValue({Booked_idBooked: this.selectedBookings[0].idBooked}) 
        console.log(this.selectedBookings)}
      else {console.log('DATA NOT FOUND')}})  
    }

  onSubmit(){
    const forms = this.startExamForm.value;
    this.service.addExam(forms)
    .subscribe(res => { this.result = Object.values(res),
      console.log(this.result[1]),
      this.openModal(this.content)},
    error => { 
      this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro', {
        timeOut: 10000,
        closeButton: true
      });
    }
    )
    this.startExamForm.reset();
    console.log(forms)
  }

  openModal(template: TemplateRef<any>) {
    this.service.getCategory().subscribe( res => {this.categories = Object.values(res)})
    this.modalService.open(template, { size:'lg', centered: true, backdrop: 'static' });
   console.log(template)
  }

  submitAdvancedSearch(advancedSearch){
    let dirtyValues = {};
    console.log(dirtyValues);
  
    Object.keys(advancedSearch.controls)
        .forEach(key => {
            let currentControl = advancedSearch.controls[key];
  
            if (currentControl.dirty) {
                if (currentControl.controls)
                    dirtyValues[key] = this.submitAdvancedSearch(currentControl);
                else
                    dirtyValues[key] = currentControl.value;
            }
        });
        dirtyValues["Exam_center_idExam_center"]="4";
  
    
    this.service.submitAS(dirtyValues)
    .subscribe(res =>{
  this.exams = Object.values(res),
  console.log(this.exams)},
    error=>  this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro', {
      timeOut: 10000,
      closeButton: true
    }))
  }

  submitPEP(advancedSearch, template){
    this.createState = true;
    let dirtyValues = {};
    console.log(dirtyValues);
  
    Object.keys(advancedSearch.controls)
        .forEach(key => {
            let currentControl = advancedSearch.controls[key];
  
            if (currentControl.dirty) {
                if (currentControl.controls)
                    dirtyValues[key] = this.submitAdvancedSearch(currentControl);
                else
                    dirtyValues[key] = currentControl.value;
            }
        });
        dirtyValues["sicc"]="PEP";
       
        this.pepValues = dirtyValues;
    this.service.getPEP(dirtyValues)
    .subscribe(res =>{
      if(res){
        this.pepResults = Object.values(res)
        console.log(res)
         this.modalService.open(template, { windowClass: 'myclass', centered: true, backdrop: 'static' }); 
      }
      else { this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro', {
        timeOut: 10000,
        closeButton: true
      })}
    
/*     this.toastr.success('Ficheiro criado com sucesso','Notificação')},
    error=>  this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Notificação')) */
  })}

  sendPEPResults(template){
    this.createState = false;
    this.service.createPEP(this.pepValues)
    .subscribe(res =>{
      if(res){
        this.toastr.success('Ficheiro criado com sucesso','Notificação',
        {
          timeOut: 10000,
          closeButton: true
        });
        this.modalService.open(template, { windowClass: 'myclass', centered: true, backdrop: 'static' }); 
      }
      else {this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro',
      {
        timeOut: 10000,
        closeButton: true
      })}
    })
  }

  onNav(){
     const modalRef = this.modalService.open(AddBookingComponent, {size: 'lg', backdrop: 'static'});
     modalRef.componentInstance.idStudent = this.selectedBookings[0]; 
  }

  resetSearch(){
    this.advancedSearch.reset();
  }

  cancelBooking(id){
    console.log(this.selectedBookings[0].idBooked)
    const status = {
      T_exam_status_idexam_status:8
    }
    console.log(status)
    this.service.cancelBooking(id, status)
    .subscribe(res => {this.toastr.warning('Marcação foi cancelada.','Notificação',
    {
      timeOut: 10000,
      closeButton: true
    })},
    error => {this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro',
    {
      timeOut: 10000,
      closeButton: true
    })})
  }

  resetModal(){
    this.siccForm.reset()
  }
}
