import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OperatorService } from '../operator.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-operator',
  templateUrl: './add-operator.component.html',
  styleUrls: ['./add-operator.component.css']
})
export class AddOperatorComponent implements OnInit {
  public roles = [];
  public centers = [];
  selectedRole = {};
  selectedValue: any;

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private os: OperatorService, private toastr:ToastrService) { 
  this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      user: [null],
      password: [null],
      role:[null],
      Email:[null],
      Exam_center_idExam_center:[null]
    });
  }

  ngOnInit() {

    this.os.getRoles()
    .subscribe(res => this.roles  = Object.values(res)); 

    this.os.getExamCenters().subscribe(res =>{ this.centers = Object.values(res),
    console.log(this.centers)})
  }

  registerUser() {
    const forms = this.registerForm.value
    console.log(forms);
        this.os.registerUser(forms)
      .subscribe(
        res => {
          console.log(res),
          this.toastr.success('Operador criado', 'Notificação')
          localStorage.setItem('token', res.token);
          
        },
        err => console.log(err)
      )   
      this.activeModal.close() 
  }
 
  setNewUser(user){
    this.selectedRole = user;
    console.log(this.selectedRole);
    
    }
  
}
