import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddStudentComponent } from './add-student/add-student.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from './add-student/server.service';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { NotesComponent } from './notes/notes.component';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})


export class StudentComponent implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('errorModal', { static: true }) public errorModal: TemplateRef<any>;
  public students = [];
  public subItem = [];
  public selectedStudent;
  subject;
  public errorMsg;
  param1;
  param2;
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;
  idStudent;
  calc: any;
  searchForm: FormGroup;
  advancedSearch: FormGroup;
  results;
  count:number;
  public show: boolean = false;
  schools = [];
  public idTypes = [];
  public categories = [];
  age:number;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private auth: AuthService, private toastr: ToastrService, private ss: ServerService) {
    this.createForm();

    this.ss.invokeEvent.subscribe(value => {
      if (value) {
        this.onGetStudent(this.param1, this.param2);
        setTimeout(() => {
          this.openCard(this.idStudent);
        }, 400);

        console.log('ENDDDDDDD')
      }
    });
  }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    });
    this.advancedSearch = this.fb.group({
      Student_num: [null, Validators.required],
      Student_name: [null, Validators.required],
      T_ID_type_idT_ID_type: [null],
      Birth_date: [null, Validators.required],
      ID_num: [null, Validators.required],
      ID_expire_date: [null, Validators.required],
      School_idSchool: [null],
      Type_category_idType_category: [null],
      Student_license: [null, Validators.required,],
      Expiration_date: [null, Validators.required],
      Tax_num: [null],
      Drive_license_num: [null],
      Permit: [null],
      Exam_center_idExam_center: 4
    })
  }


  ngOnInit() {
    this.auth.currentUserSubject.subscribe(message => this.subject = message)
    console.log(this.subject);
    this.ss.getIdType()
    .subscribe(identification => this.idTypes  = Object.values(identification)); 

    this.ss.getSchools()
    .subscribe(school => this.schools = Object.values(school)); 

    this.ss.getCategory()
    .subscribe(category => this.categories = Object.values(category)); 
  }
  
  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  showAdd() {
    const modalRef = this.modalService.open(AddStudentComponent, { size: 'lg', backdrop: 'static' });

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  onGet() {
    this.ss.getStudents()
      .subscribe(res => {
        if (res) {
          this.results = Object.values(res)
          console.log(this.ss);
          this.count = this.students.length;
        }
        else {
          this.toastr.error('Nenhum resultado foi encontrado.', 'Notificação')
        }
      },
        error => {
          this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro');
        })
  }
  onGetStudent(param1, param2) {
    this.param1 = param1;
    this.param2 = param2;
    this.ss.getStudentbyParam(this.param1, this.param2)
      .subscribe(
        data1 => {
          if (data1) { this.students = Object.values(data1),
            this.count = this.students.length;
            }
          else { console.log('DATA NOT FOUND') }
          
        },
        error =>  this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro'));
  }

  openModal(template: TemplateRef<any>) {

    this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  deleteStudent(idStudent: number) {
    this.ss.deleteStudent1(idStudent).subscribe(res => {
      console.log('Deleted');
      this.toastr.success('O candidato foi removido.', 'Notificação');
      this.ss.sendSomething();
    });
  }

  onShow() {
    setTimeout(() => {
      this.show = true;
    },
   200)}
    

  onHide() {
    this.show = false;
  }

  onNav() {
    const modalRef = this.modalService.open(EditStudentComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.idStudent = this.selectedStudent[0];
  }

  onNotes(idStudent) {
    const modalRef = this.modalService.open(NotesComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.idStudent = idStudent;
  }

  openCard(idStudent) {
    this.idStudent = idStudent;
    this.ss.getStudent(idStudent)
      .subscribe(
        data1 => {
          if (data1) {
            this.selectedStudent = Object.values(data1),
            this.age = new Date().getFullYear() - parseInt(data1[0].Birth_date);
              console.log(this.selectedStudent)
          }
          else { console.log('DATA NOT FOUND') }
        },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro'))
    /*  this.selectedStudent = this.students.filter(
       student => { return student.idStudent === idStudent });
     console.log(`selectedStudent = ${JSON.stringify(this.selectedStudent)}`) */
  }


  public savePDF() {
    html2canvas(document.getElementById('results'), { scale: 3 }).then(canvas => {
      var imgWidth = 170;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      let img = canvas.toDataURL("image/png");
      let doc = new jsPDF('p');
      var position = 20;
      doc.addImage(img, 'PNG', 20, position, imgWidth, imgHeight);

      window.open(doc.output('bloburl', { filename: 'Print' }), '_blank');
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

    this.ss.submitAS(dirtyValues)
      .subscribe(res => {
        if (Object.values(res).length <= 100) {
          this.students = Object.values(res),
          this.count = this.students.length;
        }
        else { this.toastr.info('A pesquisa retornou muitos resultados. Por favor execute uma pesquisa mais especifica.', 'Notificação') }
        console.log(this.students)
      },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação'))
  }

  resetSearch() {
    this.advancedSearch.reset();
  }

}
