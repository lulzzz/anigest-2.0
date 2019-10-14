import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ParametersService } from '../../parameters.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { isArray } from 'util';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-exam-types',
  templateUrl: './exam-types.component.html',
  styleUrls: ['./exam-types.component.css']
})
export class ExamTypesComponent implements OnInit {

  ids = [];
  selectedRow: any;
  closeResult: string;
  addID = {};
  editForm: FormGroup;
  editState: boolean = false;
  subject;

  constructor(private service: ParametersService, private modalService: NgbModal, private toastr: ToastrService, private fb: FormBuilder, private auth:AuthService) { this.createForm() }

  createForm() {
    this.editForm = this.fb.group({
      Exam_type_name: [null],
      Short: [null],
      Price: [null],
      Price_no_associated: [null],
      Tax: [null],
      Description: [null],
      Final_exam: [null],
      Has_route: [null],
      Num_examiners: [null],
      Num_students: [null],
      Duration: [null],
      Minimun_age: [null],
      Has_pair: [null],
      Category: [null],
      Code: [null],
      Has_license: [null],
      High_way: [null],
      Tax_emit_drive_license: [null],
      Condicioned_route: [null]
    });
  }

  public setClickedRow(id) {
    this.selectedRow = id;
    console.log(this.selectedRow)
  };

  open(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg' })
  }

  getStuff() {
    this.service.getExamTypes()
     .subscribe(
      res => {
        this.ids = Object.values(res)
        console.log(this.ids)
      }
    )
  }

  ngOnInit() {
    this.getStuff();
    console.log(this.selectedRow);
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

onSubmit() {
    if (this.editState === false) {
      const form = this.editForm.value;
      console.log(form);
      this.service.addID(form).subscribe(
        res => { if (res) { console.log('ID ADDED', res); this.getStuff() }
      else { console.log('EEERROOOORRR')} }
      )
    }
    else {
      console.log('Will edit!!!!')
    };
    this.editForm.reset()
  }

  editExam(content) {
    if (this.selectedRow.Description) {
      this.editForm.patchValue({
        Status: this.selectedRow.Status,
        Process: this.selectedRow.Process
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

    this.service.patchExamType(dirtyValues, this.selectedRow.idBanks)
      .subscribe(res => {
        if (res) { this.toastr.success('Informação atualizada com sucesso.', 'Notificação') }
        else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação') }
        error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error, 'Erro') }
      })

    this.getStuff()
  };

  deleteExamType(id) {
    this.service.deleteExamType(id).subscribe(
      res => {
        if (res) {
          this.toastr.info('Informação foi eliminada com sucesso.', 'Notificação');
          this.getStuff();
          this.selectedRow = null
        }
      }
    )
    console.log(id);
  }
  resetModal() {
    this.editForm.reset();
    this.editState = false;
  }
}


