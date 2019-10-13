import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerService } from 'src/app/student/add-student/server.service';
import { SchoolsComponent } from 'src/app/schools/schools.component';
import { DatePipe } from '@angular/common';
import { AddStudentComponent } from 'src/app/student/add-student/add-student.component';
import { EditStudentComponent } from 'src/app/student/edit-student/edit-student.component';
import { ExamService } from '../exam.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css']
})
export class EditExamComponent implements OnInit {

  pipe = new DatePipe('pt-PT');

  @Input() data:any;
  editExam: FormGroup;
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


  constructor(private fb: FormBuilder, private route: ActivatedRoute, public activeModal: NgbActiveModal, private ss: ServerService, private modalService: NgbModal, private service: ExamService, private toastr: ToastrService) {
  }

  createForm() {
    this.editExam = this.fb.group({
      Car_plate: this.data.Car_plate,
      Revision: this.data.Revision,
      Complain:this.data.Complain
    })
  }

  ngOnInit() {
    this.ss.getSchools().subscribe(data => this.users = Object.values(data));
    this.ss.getStatus().subscribe(data => this.statuses = Object.values(data));
    this.service.getExamType().subscribe(data => this.examTypes = Object.values(data));
    console.log(this.data);
    this.createForm();
  }

  

  setNewUser(user) {
    this.selectedUser = user;
    console.log(this.selectedUser);
    /*     const test = this.addExam.controls['School_name'].value.username;
        console.log('HEEELLOOO', test); */
  }

 getDirtyValues(editExam){
  let dirtyValues = {};
  console.log(dirtyValues);

  Object.keys(editExam.controls)
    .forEach(key => {
      let currentControl = editExam.controls[key];

      if (currentControl.dirty) {
        if (currentControl.controls)
          dirtyValues[key] = this.getDirtyValues(currentControl);
        else
          dirtyValues[key] = currentControl.value;
      }
    });

  this.service.patchExam(dirtyValues, this.data.idExam)
    .subscribe(res => { this.toastr.success('A reserva foi atualizada com sucesso.', 'Notificação'); })
  this.activeModal.close();
  this.service.sendEvent() 

 }
  

}
