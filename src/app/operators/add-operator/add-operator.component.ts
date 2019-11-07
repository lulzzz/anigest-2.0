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
  selectedRole:any = {};
  selectedValue: any;
  schools = []
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private os: OperatorService, private toastr:ToastrService) { 
  this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      role:['', [Validators.required]],
      User_email:['', [Validators.required, Validators.email]],
      Exam_center_idExam_center:['', [Validators.required]],
      School_idSchool:['']
    },
    {
      validator: this.MustMatch('password', 'confirmPassword')
  });
  }

  ngOnInit() {

    this.os.getRoles()
    .subscribe(res => this.roles  = Object.values(res)); 

    this.os.getExamCenters().subscribe(res =>{ this.centers = Object.values(res),
    console.log(this.centers)})
  }
  
    getExamCenter(number){
    this.os.getSchools(number).subscribe(res => {
      this.schools = Object.values(res)
      console.log(this.schools)
    })
  }

  registerUser() {
    const forms = this.registerForm.value
    console.log(forms);
        this.os.registerUser(forms)
      .subscribe(
        res => {
          console.log(res),
          this.toastr.success('Operador criado.', 'Notificação')
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

  MustMatch(controlName: string, matchingControlName: string) {
      return (formGroup: FormGroup) => {
          const control = formGroup.controls[controlName];
          const matchingControl = formGroup.controls[matchingControlName];
  
          if (matchingControl.errors && !matchingControl.errors.mustMatch) {
              // return if another validator has already found an error on the matchingControl
              return;
          }
  
          // set error on matchingControl if validation fails
          if (control.value !== matchingControl.value) {
              matchingControl.setErrors({ mustMatch: true });
          } else {
              matchingControl.setErrors(null);
          }
      }
  }
  
}
