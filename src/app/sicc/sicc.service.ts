import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TreeNode} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SiccService {

  constructor(private http: HttpClient) { }

  postFile(fileToUpload: File){
    const endpoint = 'http://192.168.0.106:4200/api/centro-exames/4/sicc?uploadfile=true';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData)
      
  }

  getFiles() {
    return this.http.get("./assets/files.json").toPromise()
    .then(res => <TreeNode[]> res);
                
}
  
}

