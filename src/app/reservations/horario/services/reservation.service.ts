import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { retry, catchError, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

/* const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJwYXNzd29yZCI6ImFkbWluIn0.hzg6dOCbW23eFXw4n71jjquAOsFGt19vT6l1cOWV2aA'
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token})
}
 */
@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  lockedReservation
  private url = `${environment.apiUrl}centro-exames/4/reservas`
  private examStatusUrl = `${environment.apiUrl}estado-exame`

  constructor( private http: HttpClient ) { }

  lockReservation(timeslot: any | number, blockAmount) {
    this.lockedReservation = timeslot.id
    
    let object =  {
      Block_number: blockAmount,
      idTimeslot: timeslot.id
    }
    if (timeslot.meta.examType == 'TEÓRICA') {
      return this.http.post<any>(`${this.url}?block=true&teorica=true`, object).pipe(map((response) => response))  
    }
    return this.http.post<any>(`${this.url}?block=true`, object).pipe(map((response) => response))
  }

  unlockReservation(lockedReservationId: string | number) {
    return this.http.delete<any>(`${this.url}?idReservation=${lockedReservationId}`)
  }

  getReservation() {
    return this.http.get<any>(this.url)
  }

  getReservationByTimeslot(timeslotId: string | number) {
    return this.http.get<any>(`${this.url}?idTimeslot=${timeslotId}`)
  }

  addReservation(reservation: any) {
    return this.http.post<any>(this.url, reservation)
  }

  updateReservation(reservationId ,reservation: any) {
    return this.http.patch<any>(`${this.url}?idReservation=${reservationId}`, reservation)
  }

  unbookReservation(reservationId) {
    return this.http.patch<any>(`${this.url}?idReservation=${reservationId}&cancel=true`, '')
  }

  askForBooking(reservationId) {
    return this.http.patch<any>(`${this.url}?idReservation=${reservationId}&aprove=true`, '')
  }

  sendFile(file, reservationId) {
    console.log(file)
    console.log(reservationId)
  }

  getExamStatus() {
    return this.http.get<any>(this.examStatusUrl)
  }
}