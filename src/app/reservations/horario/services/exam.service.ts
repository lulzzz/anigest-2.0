import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { retry, catchError, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) { }
  private url = `${environment.apiUrl}exames`

  updateExam(idExam, examResult) {
    let object = {
      idT_exam_results: examResult.T_exam_results_idT_exam_results
    }
    return this.http.patch<any>(`${this.url}?idExam=${idExam}`, object)
  }
}
