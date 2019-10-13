import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.apiUrl;
  public error: any;

  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject(localStorage.getItem('functionalities'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  loginUser(user) {
    return this.http.post<any>(this.url + 'login', user)
      .pipe(
        catchError(this.errorHandler))
  }

  loggedIn() {
    return !!localStorage.getItem('token');

  }

  getToken() {
    return localStorage.getItem('token')
  }

  logoutUser() {
    localStorage.removeItem('token')
    localStorage.removeItem('functionalities')
    this.currentUserSubject.next(null);
    this.router.navigate(['/login'])
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error || "An error has occured");
  }

}
