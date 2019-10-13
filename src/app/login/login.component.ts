import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  public errorMsg;

  constructor(private auth: AuthService, private router: Router, private fb:FormBuilder) { }

  ngOnInit() {
   
      this.loginForm = this.fb.group({
       user:[],
       password:[]
      });
    }


  loginUser() {
    console.log(this.loginForm.value);
     this.auth.loginUser(this.loginForm.value)
      .subscribe(
        res => {
          console.log(res)
          localStorage.setItem('token', res.token)
          localStorage.setItem('functionalities', res.Functionality);
          localStorage.setItem('idSchool', res.idSchool);
          this.auth.currentUserSubject.next(res.Functionality);
          this.router.navigate(['/'])

          return res.Functionality;
        },
        error => {
        this.errorMsg = error.error.message
          console.log(error.error.message)
        }
      )
 
  }

}
