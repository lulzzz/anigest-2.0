import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExaminerServiceService {

 private url = environment.apiUrl;
  ec:number = 4;

  constructor(private http: HttpClient) { }


addExaminer(forms) {
  return this.http.post(this.url + 'examinadores', forms)
}

getAllExaminers(){
  return this
  .http
  .get(this.url + 'centro-exames/' + this.ec + '/examinadores')
}

deleteExaminer(idExaminer){
  const params = new HttpParams().append('idExaminer', idExaminer);
  return this
  .http
  .delete(this.url + 'examinadores', {params})
}

getActiveExaminers(){
    return this
    .http
    .get(this.url + 'centro-exames/' + this.ec + '/examinadores?Active=1')
  
}
patchExaminer(form, idExaminer){
  const params = new HttpParams().append('idExaminer', idExaminer);
  return this.http.patch(this.url + 'examinadores', form, {params})
}

submitAS(form){
  return this.http.post(this.url + 'examinadores?search=true', form)
}

getExamType(){
  return this
  .http
  .get(this.url +'tipo-exames');
}

}