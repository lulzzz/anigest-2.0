import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { ServerService } from 'src/app/student/add-student/server.service';
import { PaymentsService } from '../payments.service';
import { AddCheckComponent } from '../../checks/add-check/add-check.component';
import { AddBookingComponent } from '../../bookings/add-booking/add-booking.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pay-form',
  templateUrl: './pay-form.component.html',
  styleUrls: ['./pay-form.component.css']
})
export class PayFormComponent implements OnInit {

  @ViewChild('notificationModal', { static: true }) public notificationModal: TemplateRef<any>;
  @ViewChild('paymentsModal', { static: true }) public paymentsModal: TemplateRef<any>;

  form: FormGroup;
  payment: FormGroup;
  exames: FormGroup;
  schools;
  public yorders;
  public helporders;

  orders = [{ id: 100, name: 'check 1', value: 100, bank: 'X' },
  { id: 200, name: 'check 2', value: 450, bank: 'Y' },
  { id: 300, name: 'check 3', value: 230, bank: 'Z' },
  ];


  arry = [];
  exams = [];

  constructor(private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal, private ss: ServerService, private service: PaymentsService) {

    this.payment = this.fb.group({
      School: [null],
      Checks: '',
      Exams: '',
      Payment_date: new Date().toISOString(),
      Total_value: [null]
    })

  }

  ngOnInit() {
    this.ss.getSchools().subscribe(data => this.schools = Object.values(data));


  }

  private addBoxes() {
    this.helporders.map((o, i) => {
      const control = new FormControl();
      (this.form.controls.orders as FormArray).push(control);
    });
  }

  private addBoxes2() {
    this.yorders.map((o, i) => {
      const control = new FormControl();
      (this.exames.controls.orders2 as FormArray).push(control);
    });
  }

  submitChecks() {
    const selectedOrders = this.form.value.orders
      .map((value: any, index: number) => value ? this.helporders[index].idTransactions : null)
      .filter((value: any) => value != null);

    console.log(selectedOrders);

    this.arry = this.helporders.filter(function (el) {
      return ~selectedOrders.indexOf(el.idTransactions)
    });
    console.log('ARRY', this.arry)
    this.payment.patchValue({ Checks: selectedOrders })
  }

  submitExams() {
    const selectedOrders = this.exames.value.orders2
      // .map((value: any, index: number) => value ? this.yorders[index].idPendent_payments: null)
      .map((value: any, index: number) => value ? this.yorders[index].idPendent_payments : null)
      .filter((value: any) => value != null);

    console.log(selectedOrders);

    this.exams = this.yorders.filter(function (el) {
      return ~selectedOrders.indexOf(el.idPendent_payments)
    });
    console.log(this.exams)
    this.payment.patchValue({
      Exams: selectedOrders,
      Total_value: this.helporders[0].Transaction_value
    }
    )
  }

  chequeAssociate() {
    this.form = this.fb.group({
      orders: new FormArray([])
    });
    this.service.getTransactions().subscribe(
      res => {
        if (res) {
          this.helporders = Object.values(res),
            console.log(this.helporders),
            this.addBoxes()
        }
      });

    setTimeout(()=>{  
      this.openModal(this.notificationModal)
  }, 400);
    
  }


  examsAssociate() {
    this.exames = this.fb.group({
      orders2: new FormArray([])
    });
    this.service.getPayments().subscribe(
      res => {
        if (res) {
          this.yorders = Object.values(res),
            console.log(this.yorders),
            this.addBoxes2()
        }
      });
    this.modalService.open(this.paymentsModal, { centered: true, backdrop: 'static' });
    console.log(this.yorders)
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.open(template, { centered: true, backdrop: 'static' });
  }

  onSubmit() {
    const forms = this.payment.value;
    this.service.submitPayment(forms).subscribe(
      res => this.toastr.success('O pagamento foi criado com sucesso.', 'Notificação'),
      error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação')
    )
    console.log(forms);
    this.payment.reset();
  }

  onNav() {
    const modalRef = this.modalService.open(AddCheckComponent, { size: 'lg', backdrop: 'static' });
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  onNav2() {
    const modalRef = this.modalService.open(AddBookingComponent, { size: 'lg', backdrop: 'static' });
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  resetCheques() {
    this.form.reset()
  }

  resetExams() {
    this.exames.reset()
  }
}
