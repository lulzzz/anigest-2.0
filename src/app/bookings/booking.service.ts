import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

url = environment.apiUrl;
ec:number = 4;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  addBooking(forms) {      
  return this.http.post(this.url + 'exames-marcados', forms);
  }

  addExam(forms) {
    return this.http.post(this.url +'exames', forms)
  }

  getExamType(){
    return this
    .http
    .get(this.url +'tipo-exames');
  }

  getID(){
    return this
      .http
      .get(this.url +'tipos-id');
  }

  getAllBookings(){
    return this
    .http
    .get(this.url +'centro-exames/' + this.ec + '/exames-marcados')
  }

  getBookingID(id){
    const params = new HttpParams().append('idBooked', id);
    return this
      .http
      .get(this.url + 'centro-exames/' + this.ec + '/exames-marcados', { params });
  }

  getBookingbyParam(param1,param2){
    const params = new HttpParams().append(param1, param2);
    return this.http.get(this.url + 'centro-exames/' + this.ec + '/exames-marcados', { params })
  }

  getCategory(){
    return this.http.get(this.url +'categorias')
  }

  submitAS(form){
    return this.http.post(this.url + 'exames-marcados?search=true', form)
  }

  deleteBooking(id){
    const params = new HttpParams().append('idBooked', id);
    return this.http.delete(this.url + 'centro-exames/' + this.ec + '/exames-marcados', {params})
  }

  getStatusSicc(){
    return this.http.get(this.url + 'estado-sicc?Process=1')
  }

  getPEP(form){
    return this.http.post(this.url + 'centro-exames/' + this.ec + '/sicc?getPEP=true', form)
  }

  createPEP(form){
    return this.http.post(this.url + 'centro-exames/' + this.ec + '/sicc?createfile=true', form)
  }

  patchBooking(values, id){
    const params = new HttpParams().append('idBooked', id);
    return this.http.patch(this.url + 'exames-marcados', values, {params})
  }

  cancelBooking(id, status) {
    const params = new HttpParams().append('idBooked', id)
    return this.http.patch(this.url + 'exames-marcados', status, {params})
  }
  
}
