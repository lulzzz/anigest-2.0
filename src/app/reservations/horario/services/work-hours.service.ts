import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { retry, catchError } from 'rxjs/operators'
import { WorkHours } from '../classes/work-hours'
import { environment } from 'src/environments/environment';

/* const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJwYXNzd29yZCI6ImFkbWluIn0.hzg6dOCbW23eFXw4n71jjquAOsFGt19vT6l1cOWV2aA'
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token})
} */

@Injectable({
  providedIn: 'root'
})
export class WorkHoursService {

  private url = `${environment.apiUrl}centro-exames/4/horario`

  constructor( private http: HttpClient ) { }

  getHours(): Observable<WorkHours[]> {
    return this.http.get<WorkHours[]>(this.url)
  }
}
