import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ExaminerFormComponent } from './examiner-form/examiner-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExaminerServiceService } from './examiner-service.service';
import { ToastrService } from 'ngx-toastr';
import { ListagensComponent } from './listagens/listagens.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-examiners',
  templateUrl: './examiners.component.html',
  styleUrls: ['./examiners.component.css']
})
export class ExaminersComponent implements OnInit {

  examiners = [];

  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;
  public status:boolean = false;
  public count: Number;
  selectedExaminer;
  searchForm: FormGroup;
  advancedSearch: FormGroup;
  listagensS: FormGroup;
  changeStatusForm: FormGroup;
  public show: boolean = false;
  examTypes = [];
  examinersList = [];
  subject;
  @ViewChild('notificationModal', { static: false }) public content: TemplateRef<any>;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private service: ExaminerServiceService, private toastr: ToastrService, private auth:AuthService) {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    });
    this.advancedSearch = this.fb.group({
      Num: [null],
      Examiner_name: [null],
      License_num: [null],
      License_expiration: [null],
      Active: [null],
      Exam_center_idExam_center: 4,
    });
    this.listagensS = this.fb.group({
      idExaminer: [null],
      Timeslot_date1: [null],
      Timeslot_date2: [null],
      Exam_type_idExam_type: [null],
      Begin_hour:[null],
      End_hour: [null],
      Exam_center_idExam_center: 4,
    });
    this.changeStatusForm = this.fb.group({
      Active:0,
      Obs:[null]
    });

  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  ngOnInit() {
    this.service.getAllExaminers().subscribe(res => {this.examinersList = Object.values(res),
      console.log(this.examinersList);
      this.auth.currentUserSubject.subscribe(message => {this.subject = message,
        console.log(this.subject)})
    });
  }

  onShow() {
      this.show = true;
 }
    

  onHide() {
    this.show = false;
  }


  addExaminers(action) {
    const modalRef1 = this.modalService.open(ExaminerFormComponent, { size: 'lg', backdrop: 'static' });
    modalRef1.componentInstance.action = action;
    modalRef1.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  onGet() {
    this.service.getAllExaminers()
      .subscribe(res => {
        if (res) {
          this.examiners = Object.values(res);
          this.count = this.examiners.length;
          console.log(this.examiners);
        }
        else {
          this.toastr.error('Nenhuma reserva foi encontrada.', 'Notificação')
        }
      },
        error => {
          this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro');
        },
      )
  }

  onGetActive() {
    this.service.getActiveExaminers()
      .subscribe(res => {
        if (res) {
          this.examiners = Object.values(res);
          this.count = this.examiners.length;
          console.log(this.examiners);
        }
        else {
          this.toastr.error('Nenhuma reserva foi encontrada.', 'Notificação')
        }
      },
        error => {
          this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro');
        },
      )
  }

  openCard(id) {
    this.selectedExaminer = id;
    switch(id.Active){
      case 1:{
        console.log('Active!');
        this.status = true;
        console.log(this.status)
        break;
      }
      case 0:{
        console.log('Inactive!');
        this.status = false;
        break;
      }
      default: {this.status = false}
    }
    console.log(id.Active)
/*      if (id.Active === 1){
      this.status === true;
    }
    else {this.status === false}  */
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.open(template, {  size: 'lg', centered: true, backdrop: 'static' });
 
    
    this.service.getExamType().subscribe(data => this.examTypes = Object.values(data));
  }

  editExaminer(action) {
    const modalRef1 = this.modalService.open(ExaminerFormComponent, { size: 'lg', backdrop: 'static' });
    modalRef1.componentInstance.idExaminer = this.selectedExaminer;
    modalRef1.componentInstance.action = action;
  }

  showListagens() {
    const modalRef1 = this.modalService.open(ListagensComponent, { size: 'lg', backdrop: 'static' });
    modalRef1.componentInstance.idExaminer = this.selectedExaminer;

  }

  deleteExaminer(idExaminer: number) {
    this.service.deleteExaminer(idExaminer).subscribe(res => {
      console.log('Deleted');
    });
  }


  submitAdvancedSearch(advancedSearch) {
    let dirtyValues = {};
    console.log(dirtyValues);

    Object.keys(advancedSearch.controls)
      .forEach(key => {
        let currentControl = advancedSearch.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.submitAdvancedSearch(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });
    dirtyValues["Exam_center_idExam_center"] = "4";

    this.service.submitAS(dirtyValues)
      .subscribe(res => {
        this.examiners = Object.values(res),
        this.count = this.examiners.length;
          console.log(this.examiners)
      },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação'))
  }

  resetSearch() {
    this.advancedSearch.reset();
  }

  resetListagem() {
    this.listagensS.reset();
  }

  submitChanges(){
    const form = this.changeStatusForm.value;
      this.service.patchExaminer(form, this.selectedExaminer.idExaminer)
      .subscribe(res => {this.toastr.success('Hey hey')})
      console.log(form)
  }

    submitChanges2(){
      const form2 = { Active:1}
      this.service.patchExaminer(form2,this.selectedExaminer.idExaminer)
      .subscribe(res => {this.toastr.success('Changes made')})
    console.log(form2)}

 /*    public printData() {
      let printContents, popupWin;
      printContents = this.examiners;
      popupWin = window.open('', '_blank','resizable=yes,top=0,left=0,height=100%,width=auto'); 
      popupWin.document.write(`
        <html>
          <head>
            <title>Print</title>
          </head>
          <body onload="window.print();window.close()">${printContents}
          </body>
          </html>`
      ); 
     
      
      
    popupWin.document.close();
}*/

printData() {
  const printContent = document.getElementById("comp");
  const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  WindowPrt.document.write(printContent.innerHTML);
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
  WindowPrt.close(); 
}
  
}
