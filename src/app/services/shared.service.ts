import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  user;
  private data = new BehaviorSubject<any[]>([]);

  constructor( private auth: AuthService) { }

  getData(): Observable<Array<any>> {

    // called once with/by each subscription    
    this.updateData();

    return this.data.asObservable();
}

getDataValue(): Array<any> {
  return this.data.getValue();
}

setData(val: Array<any>) {
  localStorage.setItem('data', JSON.stringify(val));
  this.data.next(val);
}


private updateData() {
     const storage = localStorage.getItem('data');
     this.data.next(JSON.parse(storage));
    }


}
