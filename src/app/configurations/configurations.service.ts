import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  url = environment.apiUrl;
  ec:number = 4;
  
  constructor(private http: HttpClient) { }
  
  getConfig(){
    return this
    .http
    .get(this.url + 'centro-exames/' + this.ec);
  }

  patchConfig(dirtyValues){
    return this.http.patch(this.url + 'centro-exames/' + this.ec, dirtyValues)
  }

}
