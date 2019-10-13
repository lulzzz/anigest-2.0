import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSchoolComponent } from './add-school/add-school.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { SchoolService } from '../schools/school.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DualListComponent } from 'angular-dual-listbox';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit {

  school:any;
  searchedSchools = [];
  allSchools = [];
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;
  confirmed = [];
  param1;
  param2;
  schoolSearchForm: FormGroup;
  advancedSearch: FormGroup;
  public selectedSchool;
  idSchool;
  count: number;
  public show: boolean = false;
  dsv = [];
  @ViewChild('notificationModal', { static: false }) public content: TemplateRef<any>;


  constructor(private fb: FormBuilder, private schoolService: SchoolService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private auth: AuthService, private toastr: ToastrService) {
    this.createForm();

         this.schoolService.invokeEvent.subscribe(value => {
          if (value) {
            this.onGetSchools(this.param1, this.param2);
            setTimeout(() => {
              this.openCard(this.idSchool);
            }, 400);
    
            console.log('ENDDDDDDD')
          }
        });

  }

  createForm() {
    this.schoolSearchForm = this.fb.group({
      param1: [null, Validators.compose([Validators.required])],
      param2: [null]
    });
    this.advancedSearch = this.fb.group({
      Permit: [null],
      Associate_num: [null],
      School_name: [null],
      Address: [null],
      Tax_num: [null],
      Location: [null],
      Zip_code: [null],
      Telephone1: [null],
      Email1: [null],
      Invoice_name: [null],
      Invoice_email: [null],
      Delegation_idDelegation: [null],
      Send_Invoice_email: [null]
    });
  }

  ngOnInit() {
    this.auth.currentUserSubject.subscribe(message => this.school = message)
    console.log(this.school)
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage*(pageNum - 1);
  }
  
  public changePagesize(num: number): void {
  this.itemsPerPage = this.pageSize + num;
}

  onGetSchools(param1, param2) {
    this.param1 = param1;
    this.param2 = param2;
    console.log(param1)
    if (param1 == 'getAllSchools') {
      this.schoolService.getSchools()
        .subscribe(
          data => {
            if (data) {
            this.searchedSchools = Object.values(data),
              this.count = Object.values(data).length
            }
            else { this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro') }
          }
        )
    }

    else {
      this.onGetSchool(param1, param2)
    }

  }
  onGetSchool(param1, param2) {
    this.schoolService.getSchoolbyParam(param1, param2)
      .subscribe(
        data1 => {
        this.searchedSchools = Object.values(data1);
        this.count = Object.values(data1).length
          console.log(this.searchedSchools)
        }
       /*  else {console.log('DATA NOT FOUND'), this.openModal(this.errorModal)}},
        error =>  this.errorMsg = error); */ )
  }



  openCard(idSchool) {
    this.idSchool = idSchool;
    this.schoolService.getSchool(idSchool)
      .subscribe(
        data1 => {
          if (data1) {
            this.selectedSchool = Object.values(data1),
              console.log(this.selectedSchool)
          }
          else { console.log('DATA NOT FOUND') }
        },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro'))
    /*  this.selectedStudent = this.students.filter(
       student => { return student.idStudent === idStudent });
     console.log(`selectedStudent = ${JSON.stringify(this.selectedStudent)}`) */
  }
  addSchoolForm(action) {
    const modalRef1 = this.modalService.open(AddSchoolComponent, { size: 'lg', backdrop: 'static' });
    modalRef1.componentInstance.action = action;

    modalRef1.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  openModal(template: TemplateRef<any>) {
    this.schoolService.getDSV().subscribe(
      res => {
        if (res) {
          this.dsv = Object.values(res)
          console.log(this.dsv)
        }
        else {
          this.toastr.error('Informação não encontrada', 'Erro')
        }
      })
    this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  onEditSchool(action) {
    const modalRef1 = this.modalService.open(AddSchoolComponent, { size: 'lg', backdrop: 'static' });
    modalRef1.componentInstance.idSchool = this.selectedSchool[0];
    modalRef1.componentInstance.action = action;
  }

  public savePDF() {
    html2canvas(document.getElementById('results'), { scale: 3 }).then(canvas => {
      var imgWidth = 150;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      let img = canvas.toDataURL("image/png");
      let doc = new jsPDF('p');
      var position = 5;
      doc.addImage(img, 'PNG', 30, position, imgWidth, imgHeight);

      window.open(doc.output('bloburl', { filename: 'Print' }), '_blank');
    });
  }

  deleteSchool(idSchool) {
    console.log(idSchool)
    this.schoolService.deleteSchool(idSchool)
      .subscribe(res => {
        this.toastr.success('A escola foi eliminada.', 'Notificação'),
        this.schoolService.sendEvent()
      },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação'))
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

    this.schoolService.submitAS(dirtyValues)
      .subscribe(res => {
        this.searchedSchools = Object.values(res),
        this.count = Object.values(res).length
          console.log(this.searchedSchools)
      },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação'))
  }

  resetSearch() {
    this.advancedSearch.reset();
  }

  onShow() {
 
      this.show = true;
 }
    

  onHide() {
    this.show = false;
  }

}
