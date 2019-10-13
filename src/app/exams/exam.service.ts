import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

url = environment.apiUrl;
ec:number = 4;
invokeEvent: Subject<any> = new Subject(); 

  constructor(private http: HttpClient) { }

  getExamType(){
    return this
    .http
    .get( this.url + 'tipo-exames');
  }

  getAllExams(){
    return this
    .http
    .get( this.url + 'centro-exames/' + this.ec + '/exames')
  }

  getExamID(id){
    const params = new HttpParams().append('idExam', id);
    return this
      .http
      .get( this.url + 'centro-exames/' + this.ec + '/exames', { params });
  }

  getBookingID(id){
    const params = new HttpParams().append('idBooked', id);
    return this
      .http
      .get( this.url + 'centro-exames/' + this.ec + '/exames-marcados', { params });
  }

  submitAS(form){
    return this.http.post(this.url + 'exames?search=true', form)
  }

  getStatusSicc(){
    return this.http.get(this.url + 'estado-sicc' )
  }

  patchExam(form, id){
    const params = new HttpParams().append('idExam', id);
    return this.http.patch(this.url + 'exames', form, {params})
  }

  sendEvent() { 
    this.invokeEvent.next('Event');      
  }


}
