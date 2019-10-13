import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServerService } from 'src/app/student/add-student/server.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentsService } from 'src/app/payments/payments.service';

@Component({
  selector: 'app-add-check',
  templateUrl: './add-check.component.html',
  styleUrls: ['./add-check.component.css']
})
export class AddCheckComponent implements OnInit {

  addChequeForm: FormGroup;
  public schools;
  public paymentTypes;
  public banks;

  constructor(private fb: FormBuilder,  public activeModal: NgbActiveModal, private ss: ServerService, private toastr: ToastrService, private service: PaymentsService) { 
    this.createForm();
  }
 
createForm() {
  this.addChequeForm = this.fb.group({
    Permit: [null],
    School_idSchool: [null],
    Transaction_num:[null],
    Banks_idBanks:[null],
    Transaction_value:[null],
    Transaction_date:[null],
    Payment_method_idPayment_method:[null],
    Exam_center_idExam_center:[4],
  });
}
  ngOnInit() {
    this.ss.getSchools().subscribe(data => this.schools = Object.values(data));
    this.service.getBanks().subscribe(data => this.banks = Object.values(data));
    this.service.getPaymentTypes().subscribe(data => {this.paymentTypes = Object.values(data); console.log('HELLO', this.paymentTypes)})
  }

  onSubmit() { 
    const forms = this.addChequeForm.value;
      this.service.addTransaction(forms)
    .subscribe(res => {
      if(res) {
        this.toastr.success('Entrada foi criada com sucesso.','Notificação')
      }
    },
    error => { 
      this.toastr.error('Ocorreu um erro. Por favor, tente novamente.');
    }) 
    console.log(forms)
    this.activeModal.close()
}


}
