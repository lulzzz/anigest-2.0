import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerService } from 'src/app/student/add-student/server.service';
import { SchoolsComponent } from 'src/app/schools/schools.component';
import { DatePipe } from '@angular/common';
import { AddStudentComponent } from 'src/app/student/add-student/add-student.component';
import { EditStudentComponent } from 'src/app/student/edit-student/edit-student.component';
import { BookingService } from '../booking.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css']
})
export class AddBookingComponent implements OnInit {
  
  @Input() idStudent: any;
  @Input() idExaminer:any;

  pipe = new DatePipe('pt-PT');

  addExam: FormGroup;
  searchRes: any;
  public users = [];
  public statuses = [];
  public examTypes= [];
  public selectedUser = {};
  public student = {};
  show: string;
  studentID = {};


  @ViewChild('notificationModal', { static: true }) public notificationModal: TemplateRef<any>;
  @ViewChild('notificationModal2', { static: true }) public notificationModal2: TemplateRef<any>;


  constructor(private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute, public activeModal: NgbActiveModal, private ss: ServerService, private modalService: NgbModal, private service: BookingService) {
    this.createForm();

    this.ss.invokeEvent.subscribe(value => {
      if (value) {
        this.callMyMethod();
      }
    });
  }

  createForm() {
    this.addExam = this.fb.group({
      School_name: [null],
      Student_num: [{ value: '', disabled: true }, Validators.required],
      Student_name: [{ value: '', disabled: true }, Validators.required],
      T_ID_type_idT_ID_type: [{ value: '', disabled: true }, Validators.required],
      Birth_date: [{ value: '', disabled: true }, Validators.required],
      ID_num: [{ value: '', disabled: true }, Validators.required],
      ID_expire_date: [{ value: '', disabled: true }, Validators.required],
      Student_license: [{ value: '', disabled: true }, Validators.required],
      Expiration_date: [{ value: '', disabled: true }, Validators.required],
      Tax_num: [{ value: '', disabled: true }, Validators.required],
      Drive_license_num: [{ value: '', disabled: true }, Validators.required],
      Obs1: [{ value: '', disabled: true }, Validators.required],
      Booked_date: new Date().toISOString(),
      Timeslot_date:[null],
      Exam_type_idExam_type:[null],
      Obs: [null],
      Exam_center_idExam_center: [1],
      Exam_group: [2],
      Student_license_idStudent_license: '',
      Timeslot_idTimeslot:5

    });
  }

  ngOnInit() {
    this.ss.getSchools().subscribe(data => this.users = Object.values(data));
    this.ss.getStatus().subscribe(data => this.statuses = Object.values(data));
    this.service.getExamType().subscribe(data => this.examTypes = Object.values(data));
    console.log(this.idExaminer)


  if(this.idExaminer){
    this.addExam.patchValue({
      School_name: this.idExaminer.School_name,
      Student_num:  this.idExaminer.Student_num,
      Student_name: this.idExaminer.Student_num,
      T_ID_type_idT_ID_type: this.idExaminer.T_ID_type_idT_ID_type,
      Birth_date: this.idExaminer.Birth_date,
      ID_num: this.idExaminer.ID_num,
      ID_expire_date: this.idExaminer.ID_expire_date,
      Student_license: this.idExaminer.Student_license,
      Expiration_date: this.idExaminer.Expiration_date,
      Tax_num: this.idExaminer.Tax_num,
      Drive_license_num: this.idExaminer.Drive_license_num,
      Obs1: this.idExaminer.Obs1,
      Booked_date: this.idExaminer.Booked_date,
      Timeslot_date:this.idExaminer.Timeslot_date,
      Exam_type_idExam_type:this.idExaminer.Exam_type_idExam_type,
      Obs: this.idExaminer.Obs,
      Student_license_idStudent_license: this.idExaminer.Student_license_idStudent_license
    })
  }

  }

  
  setNewUser(user) {
    this.selectedUser = user;
    console.log(this.selectedUser);
    /*     const test = this.addExam.controls['School_name'].value.username;
        console.log('HEEELLOOO', test); */
  }

  onSubmit() {
    const forms = this.addExam.getRawValue();
    console.log(forms);
    this.service.addBooking(forms)
    .subscribe(res => {
      if(res) {
        this.toastr.success('Marcação foi criada com sucesso.','Notificação')
      }
    },
    error => { 
      this.toastr.error('Ocorreu um erro. Por favor, tente novamente.');
    })
    this.activeModal.close()
   
  }

  searchBI(param1) {
    this.ss.getStudentbyBI(param1)
      .subscribe(
        data1 => {
          if (data1) {
            this.student = Object.values(data1)
            this.passData(data1),
              console.log('Student FOUND!!!', this.student),
              this.openModal(this.notificationModal)
          }
          else { console.log('DATA NOT FOUND')
          this.openModal(this.notificationModal2)}
        })
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.open(template, { centered: true, backdrop: 'static' });
  }

  passData(data) {
    this.addExam.patchValue({
      Student_num: data[0].Student_num,
      Student_name: data[0].Student_name,
      T_ID_type_idT_ID_type: data[0].T_ID_type_idT_ID_type,
      Birth_date: data[0].Birth_date,
      ID_num: data[0].ID_num,
      ID_expire_date: this.pipe.transform(data[0].ID_expire_date, 'yyyy-MM-dd'),
      Student_license: data[0].Student_license,
      Expiration_date: this.pipe.transform(data[0].Expiration_date, 'yyyy-MM-dd'),
      Tax_num: data[0].Tax_num,
      Drive_license_num: data[0].Drive_license_num,
      Obs1: data[0].Obs,
      Student_license_idStudent_license: this.student[0].idStudent_license
    })
  }

  clicky() {
    this.show = 'Pass data'
  }
  onNav() {
    const modalRef = this.modalService.open(AddStudentComponent, { size: 'lg', backdrop: 'static' });
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  onPatch() {
    const modalRef = this.modalService.open(EditStudentComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.idStudent = this.student[0];
  }

  callMyMethod() {
    console.log(this.student[0].ID_num);

    this.ss.getStudentbyBI(this.student[0].ID_num)
      .subscribe(
        data => {
          if (data) {
            this.student = Object.values(data),
              this.passData(this.student);
            console.log( this.student)
          }
          else { console.log('DATA NOT FOUND') }
        })
  };

}
