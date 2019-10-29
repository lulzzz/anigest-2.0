import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { retry, catchError } from 'rxjs/operators'
import { DailyGroup } from '../classes/daily-group'
import { environment } from 'src/environments/environment';

/* const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJwYXNzd29yZCI6ImFkbWluIn0.hzg6dOCbW23eFXw4n71jjquAOsFGt19vT6l1cOWV2aA'
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token})
} */

@Injectable({
  providedIn: 'root'
})
export class DailyGroupService {
  private url = `${environment.apiUrl}centro-exames/4/grupos`

  constructor(private http: HttpClient) { }

  addDailyGroup(group: any): Observable<DailyGroup> {
    return this.http.post<DailyGroup>(this.url, group)
  }

  getDailyGroups(): Observable<number> {
    this.url = `${environment.apiUrl}grupos?maxid=true`
    return this.http.get<number>(this.url)
  }

  changeLock(data) {
    let idDailyGroup = data.idGroups
    return this.http.patch<any>(`${this.url}?idGroup=${idDailyGroup}`, data)
  }

  updateDailyGroup(idGroup, data) {
    return this.http.patch<any>(`${this.url}?idGroup=${idGroup}`, data)
  }
  
  deleteDailyGroup(idGroup) {
    return this.http.delete<any>(`${this.url}?idGroup=${idGroup}`)
  }
}
