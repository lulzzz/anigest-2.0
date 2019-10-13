import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PaymentsService } from '../payments/payments.service'
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  month: number;
  year: number;
  saft:FormGroup;
  subject;

  constructor(public auth: AuthService, private service: PaymentsService, private fb:FormBuilder) { this.createForm(); }

createForm(){
 this.saft = this.fb.group({
      month: [null],
      year: [null]
    });
}
  ngOnInit() {
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
    console.log(this.subject)})
  }

  submitSAFT(year, month) {
console.log(year, month);
this.saft.reset();
     this.service.getSAFT(year, month).subscribe(
      res=>{console.log(res),
        this.downloadFile(res)}
    ) 
  }

  downloadFile(res) {
    const blob = new Blob([res], { type: 'text/xml' });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.target = "_blank";
    a.download = "file"+ res +".xml";
    a.click();
  }

  openIMT() {
    window.open("https://faturas.portaldasfinancas.gov.pt/enviarSaftAppletForm.action");
  }

}

