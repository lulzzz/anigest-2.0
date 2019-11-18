import { Injectable } from '@angular/core';
import { Student } from '../../studentmodel';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';


@Injectable()


export class ServerService {
  
  invokeEvent: Subject<any> = new Subject(); 
 private url = environment.apiUrl;
 ec:number = 4;

  constructor(private http: HttpClient, private auth: AuthService) {
    // this.auth.currentUserSubject.subscribe(message => this.ec = message.idExam_center)     
  }

  //eliminate unary operator
  addStudent(form) {
    return this.http.post( this.url + 'alunos', form)
  
  }

  addCheque(form){
    return this.http.post('url', form);
  }

  getStudents(): Observable<Student[]> {
    return this
      .http
      .get<Student[]>(this.url + 'centro-exames/' + this.ec + '/alunos');
    /*            .pipe(map(
                (response: Response) => {
                   const data = response.json();
                   return data;
                }
             ));    */
  }

  getStudentbyParam(param1, param2) {
    const params = new HttpParams().append(param1, param2);
    return this.http.get(this.url +'centro-exames/' + this.ec + '/alunos', { params })
      .pipe(
        catchError(this.errorHandler));
  }

  getSchools(){
    return this
           .http
           .get(this.url +'centro-exames/' + this.ec + '/escolas');
  }

  getStatus(){
    return this
    .http
    .get(this.url +'estado-exame?Process=1');
  }

  getIdType() {
    return this
      .http
      .get(this.url +'tipos-id');
  };

  getCategory() {
    return this
      .http
      .get(this.url +'categorias');
  };

  deleteStudent1(idStudent) {
    const params = new HttpParams().append('idStudent', idStudent);
    return this
      .http
      .delete(this.url +'alunos', { params });
  }

  getStudent(idStudent): Observable<Student> {
    const params = new HttpParams().append('idStudent', idStudent);
    return this
      .http
      .get<Student>(this.url +'centro-exames/' + this.ec + '/alunos', { params });
  }

  getStudentbyBI(param1) {
    const params = new HttpParams().append('ID_num', param1);
    return this.http.get(this.url + 'centro-exames/' + this.ec + '/alunos', { params })
      .pipe(
        catchError(this.errorHandler));
  }
  
  getStudentbyTaxNum(param1) {
    const params = new HttpParams().append('Tax_num', param1);
    return this.http.get(this.url + 'centro-exames/' + this.ec + '/alunos', { params })
      .pipe(
        catchError(this.errorHandler));
  }

  patchStudent(dirtyValues, idStudent, idStudent_license) {
    const params = new HttpParams().append('idStudent', idStudent).append('idStudent_license', idStudent_license);
    return this.http.patch(this.url +'alunos', dirtyValues, { params })
  }
  refreshStudentTry(){
    this.http.get(this.url + 'centro-exames/' + this.ec + '/alunos');
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error || "An error has occured");
  }

  sendSomething() { 
    this.invokeEvent.next('hi');      
  }

  submitAS(form){
    return this.http.post(this.url + 'alunos?search=true', form)
  }
  
}

// http://192.168.0.106:4200/api/categorias
//https://fir-861f8.firebaseio.com/newdata.json
