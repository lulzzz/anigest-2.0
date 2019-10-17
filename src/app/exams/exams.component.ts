import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ExamService } from './exam.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  searchForm:FormGroup;
  advancedSearch:FormGroup;
  siccForm:FormGroup;
  public exams = [];
  public selectedExams = [];
  public selectedBooking = [];
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;
  count:number;
  statusSicc:Array<any> = [];
  examTypes;
  age:number;
  show:boolean = false;
  siccItem;
  idExam:number;
  subject;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private service: ExamService, private toastr: ToastrService, private auth:AuthService) {
    this.createForm();
 
    this.service.invokeEvent.subscribe(value => {
      if (value) {
        this.onGet();
        setTimeout(() => {
          this.openCard(this.idExam);
        }, 400);

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
      Permit: [null],
      Exam_type_idExam_type: [null],
      T_exam_results_idT_exam_results:[null],
      School_name:[null],
      Student_name: [null],
      Student_num:[null],
      T_ID_type_idT_ID_type:[null],
      ID_num:[null],
      Student_license:[null],
      Timeslot_date:[null],
      Timeslot_date2:[null],
      Status:[null],
      Car_plate:[null],
    });
    this.siccForm = this.fb.group({
      Timeslot_date: [null],
      Timeslot_date2: [null],
      Status_SICC: [null],
      sicc:"ETC"
    })    
  }

  ngOnInit() {
    this.service.getStatusSicc().subscribe( res => {this.statusSicc = Object.values(res),
    console.log(this.statusSicc)});
    this.service.getExamType().subscribe(data => {this.examTypes = Object.values(data), console.log(data)});
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  onShow() {
      this.show = true;
  }
    
  onHide() {
    this.show = false;
  }

  editExam(){
    const modalRef1 = this.modalService.open(EditExamComponent, { backdrop: 'static'});
    modalRef1.componentInstance.data = this.selectedExams[0];
    
    modalRef1.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  onGet(){
    this.service.getAllExams()
    .subscribe(res => {
      if(res) {
        this.exams = Object.values(res);
        this.count = this.exams.length;
        console.log(this.exams);
      }
      else { this.toastr.error('Nenhum resultado foi encontrado.', 'Notificação', {
        timeOut: 20000,
        closeButton: true
      }) }
    },
    error => {
      if(error.status === 404){this.toastr.info('Nenhum resultado foi encontrado.','Notificação', {closeButton:true, timeOut:40000})}
      else  {this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro'), {closeButton:true, timeOut:40000}}
  
    },
    )
  }

  openCard(idExam) {
    this.idExam = idExam;
    this.service.getExamID(idExam)
    .subscribe(
      data1 => { if(data1) { this.selectedExams = Object.values(data1),
       this.age = new Date().getFullYear() - parseInt(data1[0].Birth_date);
        console.log(this.selectedExams);
        console.log(data1[0].sicc_status_idsicc_status);
        this.siccItem = this.statusSicc.filter(item => item.idsicc_status === data1[0].sicc_status_idsicc_status);
      console.log(this.siccItem[0].state)}
      else {console.log('DATA NOT FOUND')}},
      error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro'))  
    }

    open(content) {
      this.modalService.open(content, { size:'lg', backdrop: 'static' })
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
      error=>  this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Notificação'))
    }
  
      resetSearch(){
        this.advancedSearch.reset();
      }

      cancelExam(){}
  
}
