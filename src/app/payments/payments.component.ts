import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PayFormComponent } from './pay-form/pay-form.component';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl} from '@angular/forms';
import { PaymentsService } from './payments.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  searchForm: FormGroup;
  asPagamentos: FormGroup;
  asEntradas: FormGroup;
  asTaxas: FormGroup;
  asFaturas: FormGroup;
  public results = [];
  public generalInfo = [];
  public transactionInfo = [];
  public examInfo = [];
  paymentID;
  taxasForm: FormGroup;
  hello;
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;
  count:number;
  stuff= []
  yorders;
  public show: boolean = false;
  subject;
  param1;
  param2;
  public sendEmail: boolean = false;
  @ViewChild('notificationModal', { static: false }) public content: TemplateRef<any>;

  constructor(private toastr: ToastrService, private modalService: NgbModal, private fb: FormBuilder, private service: PaymentsService, private auth:AuthService) {
    this.createForm();
   }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, [Validators.required]],
      param2: [null]
    });

    this.asPagamentos = this.fb.group({
      Transaction_num:[null],
      Banks_idBanks:[null],
      Payment_method_idPayment_method:[null],
      Transaction_date:[null],
      Payment_date:[null],
      Total_value:[null],
      Check_date:[null],
      T_Status_check_idT_Status_check:[null],
      Permit:[null],
      School_name:[null],
      T_exam_results_idT_exam_results:[null]
    })

    this.asEntradas = this.fb.group({
      Transaction_num:[null],
      Banks_idBanks:[null],
      Payment_method_idPayment_method:[null],
      Transaction_date:[null],
      Payment_date:[null],
      Total_value:[null],
      Check_date:[null],
      T_Status_check_idT_Status_check:[null],
      Permit:[null],
      School_name:[null],
      T_exam_results_idT_exam_results:[null]
    })

    this.asFaturas = this.fb.group({
      Transaction_num:[null],
      Banks_idBanks:[null],
      Payment_method_idPayment_method:[null],
      Transaction_date:[null],
      Payment_date:[null],
      Total_value:[null],
      Check_date:[null],
      T_Status_check_idT_Status_check:[null],
      Permit:[null],
      School_name:[null],
      T_exam_results_idT_exam_results:[null]
    })

    this.asTaxas = this.fb.group({
      Transaction_num:[null],
      Banks_idBanks:[null],
      Payment_method_idPayment_method:[null],
      Transaction_date:[null],
      Payment_date:[null],
      Total_value:[null],
      Check_date:[null],
      T_Status_check_idT_Status_check:[null],
      Permit:[null],
      School_name:[null],
      T_exam_results_idT_exam_results:[null]
    })
  }

  ngOnInit() {
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  addPayments(){
    const modalRef1 = this.modalService.open(PayFormComponent, {size: 'lg', backdrop: 'static'});
    
    modalRef1.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  onGet(param1, param2) {
    this.param1 = param1;
    this.param2 = param2;
    console.log(param1)
    if (param1 === 'get_all') {
      this.service.getAllPayments()
        .subscribe(res => {
          if (res) {
            this.results = Object.values(res);
            this.count = this.results.length;
            console.log(this.results);
          }
          else {
            this.toastr.error('Nenhum resultado foi encontrado.', 'Notificação')
          }
        },
          error => {
            this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro');
          })
    }
    else {
      if (!param2.length) {
        this.toastr.warning('Por favor insira um critério de pesquisa.')
      }

      else {
        this.service.getPaymentbyParams(param1, param2).subscribe(
          res => {
            if (res && param1 === 'permit_invoice') {
              this.results = Object.values(res);
              this.count = this.results.length;
              this.sendEmail = true;
              console.log(this.results);
            }
            else if(res){
              this.results = Object.values(res);
              this.count = this.results.length;
              console.log(this.results);
              this.sendEmail = false;
            }
            else {
              this.toastr.error('Nenhum resultado foi encontrado.', 'Notificação')
            }
          },
          error => {
            this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro');
          })
      }
    }
  }
 
   openCard(id) {
    this.paymentID = id;
    console.log(id)
    this.service.getPaymentID(id)
    .subscribe(
      data1 => { if(data1) { 
        this.generalInfo = Object.values(data1[0]),
        console.log(this.generalInfo),
        this.transactionInfo = Object.values(data1[2]),
        this.hello =this.transactionInfo[0].Transaction_value,
        console.log(this.transactionInfo),
        this.examInfo = Object.values(data1[1]) 
        console.log(this.examInfo)
        }
      else {console.log('DATA NOT FOUND')}})  
  }  

  openModal(template: TemplateRef<any>) {
    this.modalService.open(template, {size:'lg', centered: true, backdrop: 'static' });
  }

  openTaxas(template){

    this.modalService.open(template, {size:'lg', centered: true, backdrop: 'static' });

    this.taxasForm = this.fb.group({
      taxasF: new FormArray([])
    });
    
    this.service.getTaxes().subscribe(res => {
      if(res){
      this.yorders = Object.values(res),
      console.log(res),
      this.addBoxes2()
      }
    });
  }

  private addBoxes2() {
    this.yorders.map((o, i) => {
      const control = new FormControl();
      (this.taxasForm.controls.taxasF as FormArray).push(control);
    });
  }

  resetSearch(){
    this.asPagamentos.reset()
  }

   invoice(){
     const data = {
      Exam_center_idExam_center:4
     }

     this.service.addInvoice(data).subscribe(
      (res)=>{
        
    console.log(res)
    const linkSource = 'data:application/pdf;base64,' + res.pdf;
        const downloadLink = document.createElement("a");
        const fileName = "sample.pdf";

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
  })}

  singleInvoice(){
    const data = {
      Exam_center_idExam_center:4,
      idPayment:this.paymentID
     }
     console.log( 'HELLOOOOO', this.paymentID)
 
    this.service.singleInvoice(data).subscribe(
      (res)=>{
        
        console.log(res)
        const linkSource = 'data:application/pdf;base64,' + res.pdf;
            const downloadLink = document.createElement("a");
            const fileName = "sample.pdf";
    
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
      })
  }
  onShow(){
    this.show = true;
  }
  
  onHide() {
    this.show = false;
  }
  
    sendInvoicebyEmail(id){
    this.service.sendInvoicebyEmail(id).subscribe(
      res => {
        if (res){
        this.toastr.success('Fatura enviada com sucesso', 'Notificação',  {
          timeOut: 9000,
          closeButton: true
        })
      }

      else {
        this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro', {
          timeOut: 9000,
          closeButton: true
        });
      }
    },
    error => {
      this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro'), {
        timeOut: 9000,
        closeButton: true
      }
      }        
    )
  }

  }


  
/* getPdf(){
  this.service.getPDF().subscribe(
    (res)=>{
      this.stuff=Object.values(res.pdf.data)
      console.log(Object.values(res.pdf.data))
  let file = new Blob([res.pdf.data], { type: 'application/pdf' });          
  var fileURL = window.URL.createObjectURL(file);
  window.open(fileURL);
})} */


