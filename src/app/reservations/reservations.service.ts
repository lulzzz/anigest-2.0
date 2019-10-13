import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  private url = environment.apiUrl;
  ec: number = 4;
  invokeEvent: Subject<any> = new Subject(); 

  constructor(private http: HttpClient) { }

  getAllReservations() {
    return this
      .http
      .get(this.url + 'centro-exames/' + this.ec + '/reservas');
  }

  getReservation(id){
    const params = new HttpParams().append('idReservation', id);
    return this.http.get( this.url + 'centro-exames/' + this.ec + '/reservas', {params})
  } 
  
  getReservationbyParam(param1, param2) {
    const params = new HttpParams().append(param1, param2);
    return this.http.get(this.url + 'centro-exames/' + this.ec + '/reservas', { params })
  }

  validateReservation(id) {
    let obj = {
      idReservation: id
    }
    return this.http.patch(this.url + 'centro-exames/' + this.ec + '/reservas?check=true', obj)
  }

  cancelReservation(id) {
    const params = new HttpParams().append('idReservation', id).append('cancel','true')
    return this.http.patch(this.url + 'centro-exames/' + this.ec + '/reservas', '', { params })
  }

  getStatus() {
    return this.http.get(this.url + 'estado-exame?Process=0');
  }

  submitAS(form) {
    return this.http.post(this.url + 'centro-exames/' + this.ec + '/reservas?search=true', form)
  }

  getPendingReservations() {
    return this.http.get(this.url + 'centro-exames/' + this.ec + '/reservas?paid=true')
  }

  getSchools() {
    return this
      .http
      .get(this.url + 'centro-exames/' + this.ec + '/escolas');
  }

  getExamType() {
    return this
      .http
      .get(this.url + 'tipo-exames');
  };

  patchReservation(values, idRes, idStudent){
    const params = new HttpParams().append('idReservation', idRes).append('idTemp_Student', idStudent);
    return this.http.patch(this.url + 'centro-exames/' + this.ec + '/reservas', values, {params})
  }

  sendEvent() { 
    this.invokeEvent.next('Event');      
  }

  randomizeExaminers(){
    const obj = { 
      Exam_center_idExam_center:1
    }
    return this.http.patch(this.url + 'pautas?start=1', obj)
  }

}
