import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
 
 private url = environment.apiUrl;

  constructor(private http: HttpClient) { }


  //ID TYPES
  /*   getIds(){
      return this.http.get('https://jsonplaceholder.typicode.com/comments?postId=1')
    } */

  addID(id) {
    return this.http.post(this.url + 'tipos-id', id)
  }

  addBank(bank) {
    return this.http.post(this.url + 'bancos', bank)
  }

  addDSV(dsv) {
    return this.http.post(this.url + 'delegacoes', dsv)
  }

  addIVA(iva) {
    return this.http.post(this.url + 'taxas', iva)
  }

  addExamLocations(routes) {
    return this.http.post(this.url + 'rotas-de-exame', routes)
  }

  addResults(results) {
    return this.http.post(this.url + 'exames-resultados', results)
  }

  addCategory(category) {
    return this.http.post(this.url +'categorias', category)
  }

  addStatus(status) {
    return this.http.post(this.url +'estado-exame', status)
  }

  deleteID(id) {
    const params = new HttpParams().append('idT_ID_type', id);
    return this.http.delete(this.url +'tipos-id', { params })
  }

  deleteIVA(id) {
    const params = new HttpParams().append('idT_Tax', id);
    return this.http.delete(this.url + 'taxas', { params })
  }

  deleteExamLocation(id) {
    const params = new HttpParams().append('idExam_route', id);
    return this.http.delete(this.url +'rotas-de-exame', { params })
  }
  deleteBank(bank) {
    const params = new HttpParams().append('idBanks', bank);
    return this.http.delete(this.url + 'bancos', { params })
  }
  deleteResult(bank) {
    const params = new HttpParams().append('idT_exam_results', bank);
    return this.http.delete(this.url +'exames-resultados', { params })
  }
  deleteStatus(bank) {
    const params = new HttpParams().append('idexam_status', bank);
    return this.http.delete(this.url + 'estado-exame', { params })
  }
  deleteCategory(bank) {
    const params = new HttpParams().append('idType_category', bank);
    return this.http.delete(this.url + 'categorias', { params })
  }
  deleteExamType(bank) {
    const params = new HttpParams().append('idBanks', bank);
    return this.http.delete(this.url + 'tipo-exames', { params })
  }

  deleteDSV(dsv) {
    const params = new HttpParams().append('idDelegation', dsv);
    return this.http.delete(this.url + 'delegacoes', { params })
  }

  getIds() {
    return this.http.get(this.url +'tipos-id')
  }

  getCategories() {
    return this.http.get(this.url + 'categorias')
  }

  getExamTypes() {
    return this.http.get(this.url + 'tipo-exames')
  }

  getExamLocations() {
    return this.http.get(this.url +'centro-exames/1/rotas-de-exame')
  }

  getBanks() {
    return this.http.get(this.url + 'bancos')
  }

  getResults() {
    return this.http.get(this.url +'exames-resultados')
  }

  getStatus() {
    return this.http.get(this.url + 'estado-exame')
  }

  getIVA() {
    return this.http.get(this.url + 'taxas')
  }

  getDSV(){
    return this.http.get(this.url +'delegacoes')
  }

  patchID(dirtyValues, id) {
    const params = new HttpParams().append('idT_ID_type', id);
    return this.http.patch(this.url +'tipos-id', dirtyValues, { params });
  }

  patchBanks(dirtyValues, bankID) {
    const params = new HttpParams().append('idBanks', bankID);
    return this.http.patch(this.url +'bancos', dirtyValues, { params });
  }

  patchIVA(dirtyValues, iva) {
    const params = new HttpParams().append('idT_Tax', iva);
    return this.http.patch(this.url +'taxas', dirtyValues, { params });
  }

  patchExamLocation(dirtyValues, dsvID) {
    const params = new HttpParams().append('idExam_route', dsvID);
    return this.http.patch(this.url +'rotas-de-exame', dirtyValues, { params });
  }

  patchResult(dirtyValues, dsvID) {
    const params = new HttpParams().append('idT_exam_results', dsvID);
    return this.http.patch(this.url +'exames-resultados', dirtyValues, { params });
  }

  patchStatus(dirtyValues, dsvID) {
    const params = new HttpParams().append('idexam_status', dsvID);
    return this.http.patch(this.url +'estado-exame', dirtyValues, { params });
  }

  patchCategory(dirtyValues, dsvID) {
    const params = new HttpParams().append('idType_category', dsvID);
    return this.http.patch(this.url +'categorias', dirtyValues, { params });
  }

  patchExamType(dirtyValues, dsvID) {
    const params = new HttpParams().append('idDelegation', dsvID);
    return this.http.patch(this.url +'delegacoes', dirtyValues, { params });
  }

  patchDSV(dirtyValues, dsvID) {
    const params = new HttpParams().append('idDelegation', dsvID);
    return this.http.patch(this.url + 'delegacoes', dirtyValues, { params });
  }

}
