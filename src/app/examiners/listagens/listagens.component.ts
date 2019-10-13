import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExaminerServiceService } from '../examiner-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listagens',
  templateUrl: './listagens.component.html',
  styleUrls: ['./listagens.component.css']
})
export class ListagensComponent implements OnInit {

listagens:FormGroup;

  constructor(private fb:FormBuilder, public activeModal: NgbActiveModal, public es:ExaminerServiceService, private toastr:ToastrService) { this.createForm()}

createForm(){
  this.listagens = this.fb.group({
    Num: [null],
    Examiner_name: [null],
    License_num: [null],
    License_expiration: [null],
    Active: [null],
    Exam_center_idExam_center: 4})
  }

  ngOnInit() {
  }
resetSearch(){
  this.listagens.reset();
}
}
