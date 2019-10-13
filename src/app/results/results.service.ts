import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  private url = environment.apiUrl;
  ec: number = 4;
  invokeEvent: Subject<any> = new Subject(); 


  constructor(private http: HttpClient) {
  }

  getExaminers() {
    return this
      .http
      .get(this.url + 'centro-exames/' + this.ec + '/examinadores');
  }

  getAllResults() {
    return this
      .http
      .get(this.url + 'centro-exames/' + this.ec + '/pautas');
  }

  getPautaID(id) {
    const params = new HttpParams().append('idPauta', id);
    return this
      .http
      .get(this.url + 'centro-exames/' + this.ec + '/pautas', { params });
  }

  getPautabyNum(num) {
    const params = new HttpParams().append('Pauta_num', num);
    return this
      .http
      .get(this.url + 'centro-exames/' + this.ec + '/pautas', { params });
  }

  patchPauta(form, idPauta) {
    const params = new HttpParams().append('idPauta', idPauta);
    return this.http.patch(this.url + 'pautas', form, { params })
  }

  numerarPauta(pauta) {
    return this.http.post(this.url + 'centro-exames/' + this.ec + '/pautas', pauta)
  }

  startPauta() {
    let obj = {
      Exam_center_idExam_center: 4
    }
    return this.http.patch(this.url + 'pautas?start=true', obj)
  }

  getExamType() {
    return this
      .http
      .get(this.url + 'tipo-exames');
  }

  submitAS(form) {
    return this.http.post(this.url + 'pautas?search=true', form)
  }

  getResults() {
    return this.http.get(this.url + 'exames-resultados')
  }

  sendResults(form, idPauta) {
    const params = new HttpParams().append('idPauta', idPauta);
    return this.http.patch(this.url + 'pautas?Result=true', form, { params })
  }

  sendEvent() { 
    this.invokeEvent.next('Event');      
  }


}
