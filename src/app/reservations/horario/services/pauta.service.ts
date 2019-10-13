import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PautaService {

  constructor(private http: HttpClient) { }
  private url = `${environment.apiUrl}centro-exames/4/pautas`
  private envUrl = environment.apiUrl

  getPautas() {
    return this.http.get<any>(this.url)
  }

  createPauta(date) {
    let obj = {
      Timeslot_date: date
    }
    return this.http.post<any>(`${this.url}`, obj)
  }

  definePautaExaminer(idPauta, idExaminer) {
    let F_reason = 'teste'
    let obj = {
      idExaminer,
      F_reason
    }
    return this.http.patch<any>(`${this.envUrl}pautas?idPauta=${idPauta}`, obj)
  }

  deletePauta(idPauta) {
    return this.http.delete<any>(`${this.envUrl}pautas?idPauta=${idPauta}`)
  }
}
