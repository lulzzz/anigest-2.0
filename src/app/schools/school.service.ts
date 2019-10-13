import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable()



export class SchoolService {

   private url:string = environment.apiUrl;
   //Exam Center Number
    ec:number = 4;
    invokeEvent: Subject<any> = new Subject(); 


    constructor(private http: HttpClient) {}

    addSchool(forms) {      
      this.http.post(this.url + 'escolas', forms)
      .subscribe(res => console.log('Done'));
      console.log(forms)
    }


    getSchools(){
      return this
             .http
             .get(this.url +'centro-exames/' + this.ec + '/escolas');
    }

    getSchoolbyParam(param1,param2) {
        const params = new  HttpParams().append(param1, param2);
        return this
               .http
               .get(this.url +'centro-exames/' + this.ec + '/escolas', {params});
               
            } 
    
    deleteSchool(idSchool) {
      const params = new  HttpParams().append('idSchool', idSchool);
      return this
                .http
                .delete(this.url +'escolas', {params}) ;
    }

     getSchool(idSchool) {
      const params = new  HttpParams().append('idSchool', idSchool);
      return this
              .http
              .get(this.url +'centro-exames/' + this.ec + '/escolas', {params});
      }
      
      patchSchool(dirtyValues, idSchool){
        const params = new  HttpParams().append('idSchool', idSchool);
        return this.http.patch(this.url +'escolas', dirtyValues, { params })
     
      }

      getLocality(code){
        const params = new  HttpParams().append('CP', code);
        return this.http.get(this.url +'localizacao', {params}) ;
      }

      getDSV(){
        return this.http.get(this.url + 'delegacoes')
      }

      sendEvent() { 
        this.invokeEvent.next('Event');      
      }

      submitAS(form){
        return this.http.post(this.url + 'escolas?search=true', form)
      }
}

// http://192.168.0.106:4200/api/categorias
//https://fir-861f8.firebaseio.com/newdata.json
