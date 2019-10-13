import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../parameters.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-presults',
  templateUrl: './presults.component.html',
  styleUrls: ['./presults.component.css']
})
export class PresultsComponent implements OnInit {

  public results: any;
  selectedRow: any;
  closeResult: string;
  resultsForm: FormGroup;
  editState: boolean = false;
  subject;

  constructor(private service: ParametersService, private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal, private auth:AuthService) { this.createForm()}

  createForm() {
    this.resultsForm = this.fb.group({
      Result: [null],
      Code: [null]
  })}

  ngOnInit() {
    this.getList();
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  getList() {
    this.service.getResults().subscribe(
      res => {
        if(res){
        this.results = Object.values(res)
        console.log(this.results)}
        else { this.toastr.error('Nenhum resultado foi encontrado.', 'Notificação') }
      },
      error => this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação')
    )
  }

  public setClickedRow(id) {
    this.selectedRow = id;
    console.log(this.selectedRow)
  };

  open(content) {
    this.modalService.open(content, { backdrop: 'static' })
  }

  onSubmit() {
    if (this.editState === false) {
      const form = this.resultsForm.value;
      console.log(form);
      this.service.addResults(form).subscribe(
        res => {
          if (res) { console.log('ID ADDED', res); this.getList() }
          else { console.log('EEERROOOORRR') }
        }
      )
    }
    else {
      console.log('Will edit!!!!')
    };
    this.resultsForm.reset()
  };

  editResult(content) {
    if (this.selectedRow.idT_exam_results) {
      this.resultsForm.patchValue({
        Result: this.selectedRow.Result,
        Code: this.selectedRow.Code
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

    this.service.patchResult(dirtyValues, this.selectedRow.idT_exam_results)
      .subscribe(res => {
        if (res) { this.toastr.success('Informação atualizada com sucesso.', 'Notificação');
        this.getList() }
        else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação') }
        error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error, 'Erro') }
      })

   
  };

  deleteResult(id) {
    this.service.deleteResult(id).subscribe(
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
    this.resultsForm.reset();
    this.editState = false;
  }

}
