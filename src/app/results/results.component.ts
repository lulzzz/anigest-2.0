import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ResultsService } from './results.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditResultsComponent } from './edit-results/edit-results.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results = [];
  searchForm: FormGroup;
  addExaminerForm: FormGroup;
  pautaStart: FormGroup;
  advancedSearch: FormGroup;
  siccForm: FormGroup;
  sendResults: FormGroup;
  public examiners = [];
  public selectedPautas = [];
  pautaID;
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;
  examTypes = [];
  show: boolean = false;
  count: number;
  assignResult = [];
  resultsOptions = [];
  candidateNo:number;
  subject;
  param1;
  param2;

  @ViewChild('notificationModal', { static: false }) public content: TemplateRef<any>;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private service: ResultsService, private toastr: ToastrService, private router: Router, private auth:AuthService) {

    this.createForm();
 
  }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    });
    this.addExaminerForm = this.fb.group({
      idExaminer: [null],
      F_reason: [null],
    })
    this.pautaStart = this.fb.group({
      Timeslot_date: [null]
    })
    this.advancedSearch = this.fb.group({
      Pauta_num: [null],
      Timeslot_date: [null],
      Timeslot_date2: [null],
      Begin_time: [null],
      End_time: [null],
      Exam_type_idExam_type: [null],
      T_exam_results_idT_exam_results: [null],
      Exam_route_idExam_route: [null]
    });
    this.siccForm = this.fb.group({
      Pauta_num: [null],
      Timeslot_date: [null],
      Timeslot_date2: [null],
      Exam_type_idExam_type: [null],
      Student_license: [null],
      Status_SICC: [null],
      sicc: "REP"
    });
    /*    this.sendResults = this.fb.group({
         results:this.fb.array([this.buildArray()])
       }) */

  }


  ngOnInit() {
    this.service.getResults().subscribe(
      res => {
        this.resultsOptions = Object.values(res);
        console.log(this.resultsOptions)
      }
    );
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  buildForm() {
    const controlArray = this.sendResults.get('results') as FormArray;

    Object.keys(this.assignResult).forEach((i) => {
      controlArray.push(
        this.fb.group({   
          idExam: this.assignResult[i].idExam,
          T_exam_results_idT_exam_results: []
        })
      )
    })

    console.log(controlArray.controls)
  }

  onShow() {
    this.show = true;
  }

  onHide() {
    this.show = false;
  }

  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  onGet() {
    this.service.getAllResults()
      .subscribe(res => {
        if (res) {
          this.results = Object.values(res)
          console.log('HELLOOOO', this.results);
          this.count = this.results.length;
          console.log(this.count)
        }
        else {
          this.toastr.error('Nenhum resultado foi encontrado.', 'Notificação')
        }
      },
        error => {
          this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro');
        })
  }

  numerarPauta() {
    const obj = this.pautaStart.value;
    console.log(obj);
    this.service.numerarPauta(obj).subscribe(
      res => {
        if (res) {
          this.toastr.success('Pautas foram numeradas.', 'Notificação')
        }
      },
      error => { this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro') }
    )
  }

  openCard(id) {
    this.pautaID = id;
     this.service.getPautaID(id)
      .subscribe(
        data1 => {
          if (data1) {
            this.selectedPautas = Object.values(data1),
            this.candidateNo = Object.values(data1).length
              console.log(this.selectedPautas)
          }
          else { console.log('DATA NOT FOUND') }
        })
  }

  onSubmitExaminer() {
    const form = this.addExaminerForm.value;
    console.log(this.selectedPautas[0].idPauta)
    this.service.patchPauta(form, this.selectedPautas[0].idPauta)
      .subscribe(res => {
        if (res) {
          this.toastr.success('Examinador foi designado com sucesso.', 'Notificação')
        }
      },
        error => {
          this.toastr.error('Ocorreu um erro. Por favor, tente novamente.');
        })
    console.log(form)

    setTimeout(() => {
      this.openCard(this.pautaID);
    }, 400);

  }

  startPauta() {
    this.service.startPauta().subscribe(
      res => {
        if (res) {
          this.toastr.success('Examinador foi designado com sucesso.', 'Notificação');
          this.examiners = Object.values(res);
          console.log(this.examiners)
        }
        else {
          this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação')
        }
      },
      error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação')
    )
  }

  openModal(template) {
    this.service.getExamType().subscribe(data => this.examTypes = Object.values(data));
    this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }

  openEdit() {
    const modalRef = this.modalService.open(EditResultsComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pauta = this.selectedPautas[0];
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
        this.results = Object.values(res),
          console.log(this.results)
      },
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Notificação'))
  }

  getPautaInfo(info) {


    console.log(info);
    this.service.getPautabyNum(info)
      .subscribe(
        data1 => {
          if (data1) {
            this.assignResult = Object.values(data1),
            this.sendResults = new FormGroup({
              results: this.fb.array([])
            })
        
            this.buildForm();
              console.log('RESULTS ASSIGNED', this.assignResult)
          }
          else { console.log('DATA NOT FOUND') }
        })
  }
  resetSearch() {
    this.advancedSearch.reset();
  }

  openSchedule() {
    this.router.navigate([`${this.router.url}/schedule`])
  }

  submitResults(value) {
    console.log(value)
  }

  onSubmit(id) {
    console.log(this.sendResults.value);
    let form = this.sendResults.value;
     this.service.sendResults(form, id).subscribe(
      res=> {
        this.toastr.success('Resultados foram atribuidos.')
      }
    ) 
  }

  cancelPauta(){}

}
