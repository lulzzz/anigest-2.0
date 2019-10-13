import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReservationsService } from './reservations.service';
import { EditReservationComponent } from './edit-reservation/edit-reservation.component';


import { ConfirmationService, Message } from 'primeng/api';
import { WorkHoursService } from './horario/services/work-hours.service'

import { TimeslotService } from './horario/services/timeslot.service'
import { DailyGroupService } from './horario/services/daily-group.service'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'



@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  providers: [ConfirmationService]
})
export class ReservationsComponent implements OnInit {

  searchForm: FormGroup;
  advancedSearch: FormGroup;
  public exams = [];
  public selectedReservation;
  public result;
  param1;
  param2;
  idStudent;
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;
  count: number;
  public show: boolean = false;
  status = [];
  schools;
  examTypes;
  searchParams:boolean = false;
  idReservation;
  //////////////////////////////////////////////

  subject;
  

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: ReservationsService,
    private auth: AuthService,
    private router: Router
        ) {
    this.createForm();

    this.service.invokeEvent.subscribe(value => {
      if (value) {
        
        setTimeout(() => {
          this.onGetReservation(this.param1, this.param2);
          this.openCard( this.idReservation);
        }, 300);
      
    
        console.log('ENDDDDDDD')
      }
    }); 

  }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    });
    this.advancedSearch = this.fb.group({
      Student_name: [null, Validators.required],
      ID_num: [null, Validators.required],
      School_idSchool: [null],
      Type_category_idType_category: [null],
      Tax_num: [null],
      Permit: [null],
      Timeslot_date1: [null],
      Timeslot_date2: [null],
      T_exam_status_idexam_status: [null],
      Exam_center_idExam_center: 4
    });
  }

  ngOnInit() {
    this.service.getExamType().subscribe(res => {
    this.examTypes = Object.values(res),
      console.log(this.examTypes)
    });
    this.service.getSchools().subscribe(res => {
    this.schools = Object.values(res),
      console.log(this.schools)
    });
    this.auth.currentUserSubject.subscribe(message => {
    this.subject = message,
      console.log(this.subject)
    });
    this.service.getStatus().subscribe(res => {
    this.status = Object.values(res),
      console.log(this.status)
    });

  
    ////////////////////////////////////////////////////////////////////////
    
  }

  onShow() {
    setTimeout(() => {
      this.show = true;
    },
   200)}
    

  onHide() {
    this.show = false;
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

getHorario(){
  this.router.navigate(['/reservations/schedule'])
}



  onGetReservation(param1, param2) {
    this.searchParams = true;
    console.log('HEEEEEEEY')
    this.param1 = param1;
    this.param2 = param2;
    if (param1 == 'getAllReservations') {
      this.service.getAllReservations().subscribe(
        res=> {this.exams = Object.values(res) }
      )
    }
    else{
    this.service.getReservationbyParam(this.param1, this.param2)
      .subscribe(
        data1 => {
          if (data1) {
          this.exams = Object.values(data1),
            this.count = this.exams.length;
          }
          else { this.toastr.error('Nenhuma reserva foi encontrada.', 'Notificação') }

        },
        error => { this.toastr.error('Ocorreu um erro. Por favor, tente novamente.') });
  }}

  openCard(id) {
    this.idReservation = id;
    this.service.getReservation(id).subscribe(
      res=> { 
        if (res) {
          this.selectedReservation = Object.values(res);
      console.log(this.selectedReservation)}
      else { this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro') }
        })
  }


  validateRes(id) {
    console.log(id);
    this.service.validateReservation(id).subscribe(
      res => {
        if (res) { this.toastr.success('A reserva foi validada com sucesso', 'Notificação') }
        else { this.toastr.error('Ocorreu um erro. Por favor, tente novamente', 'Notificação') }
      },
      error => { this.toastr.error('Ocorreu um erro. Por favor, tente novamente', 'Notificação') }
    )
  }

  cancelReservation(id) {
    this.service.cancelReservation(id)
      .subscribe(res => { this.toastr.success('Reserva foi cancelada.', 'Notificação') }),
      error => { this.toastr.error('Ocorreu um erro. Por favor, tente novamente', 'Notificação') }
  }

  onEdit() {
    const modalRef = this.modalService.open(EditReservationComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.Reservation = this.selectedReservation[0];
  }
  openModal(template: TemplateRef<any>) {

    this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  submitAdvancedSearch(advancedSearch) {
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

    this.service.submitAS(dirtyValues)
      .subscribe(res => {
        if (Object.values(res).length <= 100) {
          this.exams = Object.values(res),
            this.count = this.exams.length;
            this.searchParams = false;
        }
        else { this.toastr.info('A pesquisa retornou muitos resultados. Por favor execute uma pesquisa mais especifica.', 'Notificação') }
        console.log(this.exams)
      },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação'))
  }

  resetSearch() {
    this.advancedSearch.reset();
  }
  /////////////////////////////////////////////////////////////////////////////////////

  


  pendingRes() {
    this.service.getPendingReservations().subscribe(data1 => {
      if (data1) {
      this.exams = Object.values(data1),
        this.count = this.exams.length;
      }
      else { this.toastr.error('Nenhuma reserva foi encontrada.', 'Notificação') }

    },
      error => { this.toastr.error('Ocorreu um erro. Por favor, tente novamente.') });
  }
}

