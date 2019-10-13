import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { retry, catchError, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

/* const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJwYXNzd29yZCI6ImFkbWluIn0.hzg6dOCbW23eFXw4n71jjquAOsFGt19vT6l1cOWV2aA'
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token})
} */

@Injectable({
  providedIn: 'root'
})
export class DataFetchService {
  private url = `${environment.apiUrl}`
  private examCenterUrl = `${environment.apiUrl}centro-exames/4/`
  

  constructor(private http: HttpClient) { }

  getExamTypes() {
    return this.http.get<any[]>(`${this.url}tipo-exames`)
  }

  getCategories() {
    return this.http.get<any[]>(`${this.url}categorias`)
  }

  getIdTypes() {
    return this.http.get<any[]>(`${this.url}tipos-id`)
  }

  getSchools() {
    return this.http.get<any[]>(`${this.examCenterUrl}escolas`)
  }

  getPautas() {
    return this.http.get<any[]>(`${this.examCenterUrl}pautas`)
  }

  getExaminers() {
    return this.http.get<any[]>(`${this.examCenterUrl}examinadores`)
  }

  getExaminerQualifications() {
    return this.http.get<any[]>(`${this.url}examinador-habilitacoes`)
  }

  getExaminerQualificationsForce(idTimeslot) {
    return this.http.get<any[]>(`${this.url}examinador-habilitacoes?force=true&idTimeslot=${idTimeslot}`)
  }

  getExamResults() {
    return this.http.get<any[]>(`${this.url}exames-resultados`)
  }

  getExams() {
    return this.http.get<any[]>(`${this.examCenterUrl}exames`)
  }
}
