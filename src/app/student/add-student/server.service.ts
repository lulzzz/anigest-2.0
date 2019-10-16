import { Injectable } from '@angular/core';
import { Student } from '../../studentmodel';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
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
  addStudent(number, name, id_type, birth_date, id, id_expiration, school, category, license, license_expiration, fiscal_number, existing_license, observations) {
    const obj = {
      Student_num: number,
      Student_name: name,
      T_ID_type_idT_ID_type: +id_type,
      Birth_date: birth_date,
      ID_num: id,
      ID_expire_date: id_expiration,
      School_idSchool: +school,
      Type_category_idType_category: +category,
      Student_license: license,
      Expiration_date: license_expiration,
      Tax_num: +fiscal_number,
      Drive_license_num: existing_license,
      Obs: observations
    };

    return this.http.post( this.url + 'alunos', obj)
  
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
