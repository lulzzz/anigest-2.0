import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

 private url = environment.apiUrl;

  constructor( private http: HttpClient) { }

  registerUser(user) {
    return this.http.post<any>(this.url + 'registo', user)
  }

  registerRole(forms) {
    return this.http.post<any>(this.url + 'permissoes', forms)
    .subscribe(res => console.log('Done'));
  }

  getRoles(){
    return this.http.get<any>(this.url + 'permissoes')
  }

  getExamCenters(){
    return this.http.get(this.url + 'centro-exames/0')
  }

  getOperators(){
    return this
           .http
           .get(this.url +'operadores');
  }

}
