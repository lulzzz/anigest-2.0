import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

 private url = environment.apiUrl;
 ec:number = 4;

  constructor(private http: HttpClient) { }

  getPayments(){
    return this.http.get(this.url + 'centro-exames/' + this.ec + '/pagamentos-pendentes??idSchool=1&examnotpaid=true')
  }

  getTransactions(){
    return this.http.get(this.url + 'centro-exames/' + this.ec + '/movimentos?School_idSchool=1&notused=true')
  }

  getPaymentTypes(){
    return this.http.get(this.url + 'tipos-pagamento')
  }

  getBanks(){
    return this.http.get(this.url + 'bancos')
  }

  addTransaction(form){
    return this.http.post(this.url + 'movimentos', form)
  }

  submitPayment(form){
    return this.http.post(this.url + 'pagamentos', form)
  }

  getAllPayments(){
    return this.http.get(this.url + 'centro-exames/' + this.ec + '/pagamentos')
  }

  getTaxes(){
     return this.http.get(this.url + 'centro-exames/' + this.ec + '/pagamentos-pendentes?taxnotpaid=true' )
  }

  getPaymentID(id){
    const params = new HttpParams().append('idPayment', id);
    return this
      .http
      .get( this.url + 'centro-exames/' + this.ec + '/pagamentos', { params });
  }

   addInvoice(data){
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    return this.http.patch<any>(this.url + 'pagamentos?invoice=true', data)
  } 

  singleInvoice(data){
    return this.http.patch<any>(this.url + 'pagamentos?invoice=true', data)
  }

  getPDF(){  
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    }; 
    
    return this.http.get<any>("./assets/mydata.json")
    
    }

    getSAFT(year, month){
      return this.http.get( this.url + 'centro-exames/' + this.ec + '/pagamentos?saft=true&year=' + year + '&month=' + month, { responseType: 'text' })
    }

}
