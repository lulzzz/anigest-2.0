import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../parameters.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-exam-locations',
  templateUrl: './exam-locations.component.html',
  styleUrls: ['./exam-locations.component.css']
})
export class ExamLocationsComponent implements OnInit {

  selectedRow: any;
  closeResult: string;
  elocationsForm: FormGroup;
  editState: boolean = false;
  public locations:any;
  subject;

  constructor( private service: ParametersService, private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal, private auth: AuthService) { this.createForm() }
  
  createForm() {
    this.elocationsForm = this.fb.group({
      Route: [null],
      Active: [null],
      Code: [null],
      High_way: [null],
      Conditioned_route: [null],
      Exam_center_idExam_center: 1
    });
  }

  public setClickedRow(id) {
    this.selectedRow = id;
    console.log(this.selectedRow)
  };

  ngOnInit() {
    this.getList();
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  getList() {
    this.service.getExamLocations().subscribe(
      res => {
        this.locations = Object.values(res)
        console.log(this.locations)
      }
    )
  }

  open(content) {
    this.modalService.open(content, { backdrop: 'static' })
  }

  onSubmit() {
    if (this.editState === false) {     
      // this.elocationsForm.controls['Active'].setValue(+this.elocationsForm.get('Active').value); 
      const form = this.elocationsForm.value;
      console.log(form)
       this.service.addExamLocations(form).subscribe(
        res => { if (res) { console.log('ID ADDED', res); this.getList() }
      else { console.log('EEERROOOORRR')} }
      )
    }
    else {
      console.log('Will edit!!!!') 
    };
    this.elocationsForm.reset()
  }

  editExamLocation(content) {
    if (this.selectedRow.idExam_route) {
      this.elocationsForm.patchValue({
        Route: this.selectedRow.Route,
        Active: this.selectedRow.Active,
        Code: this.selectedRow.Code,
        High_way: this.selectedRow.High_way,
        Conditioned_route: this.selectedRow.Conditioned_route,
        Exam_center_idExam_center: 1
      });
      this.open(content);
      this.editState = true;
    }
  }

  saveChanges(banksForm) {
    let dirtyValues = {};
    console.log(dirtyValues);

    Object.keys(banksForm.controls)
      .forEach(key => {
        let currentControl = banksForm.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.saveChanges(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });

    this.service.patchExamLocation(dirtyValues, this.selectedRow.idExam_route)
      .subscribe(res => {
        if (res) { this.toastr.success('Informação atualizada com sucesso.', 'Notificação');
        this.getList() }
        else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação') }
        error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error, 'Erro') }
      })

   
  };

  deleteExamLocation(id) {
    this.service.deleteExamLocation(id).subscribe(
      res => {
        if (res) {
          this.toastr.info('O banco foi eliminado com sucesso', 'Notificação');
          this.getList();
          this.selectedRow = null
        }
      }
    )
    console.log(id);
  }
  resetModal() {
    this.elocationsForm.reset();
    this.editState = false;
  }

}
