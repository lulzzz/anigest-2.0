import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ParametersService } from '../../parameters.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dsv',
  templateUrl: './dsv.component.html',
  styleUrls: ['./dsv.component.css']
})
export class DsvComponent implements OnInit {

  dsvForm: FormGroup;
  public dsv: Array<any> = [];
  selectedRow: any;
  closeResult: string;
  editState: boolean = false;
  subject;

  constructor(private service: ParametersService, private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private auth: AuthService) { this.createForm() }

  createForm() {
    this.dsvForm = this.fb.group({
      Delegation_name: [null],
      Delegation_num: [null],
      Delegation_short: [null]
    });
  }

  ngOnInit() {
    this.getList();
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  getList() {
    this.service.getDSV().subscribe(
      res => {
        if (res) {
          this.dsv = Object.values(res)
          console.log(this.dsv)
        }
        else {
          this.toastr.error('Informação não encontrada', 'Erro')
        }
      })
  };

  public setClickedRow(id) {
    this.selectedRow = id;
    console.log(this.selectedRow)
  };

  open(content) {
    this.modalService.open(content, { backdrop: 'static' })
  }

  onSubmit() {
    if (this.editState === false) {
      const form = this.dsvForm.value;
      console.log(form);
      this.service.addDSV(form).subscribe(
        res => {
          if (res) { console.log('ID ADDED', res); this.getList() }
          else { console.log('EEERROOOORRR') }
        }
      )
    }
    else {
      console.log('Will edit!!!!')
    };
    this.dsvForm.reset()
  }

  editDSV(content) {
    if (this.selectedRow.idDelegation) {
      this.dsvForm.patchValue({
        Delegation_name: this.selectedRow.Delegation_name,
        Delegation_num: this.selectedRow.Delegation_num,
        Delegation_short: this.selectedRow.Delegation_short
      });
      this.open(content);
      this.editState = true;
    }
  }

  saveChanges(dsvForm) {
    let dirtyValues = {};
    console.log(dirtyValues);

    Object.keys(dsvForm.controls)
      .forEach(key => {
        let currentControl = dsvForm.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.saveChanges(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });

    this.service.patchDSV(dirtyValues, this.selectedRow.idDelegation)
      .subscribe(res => {
        if (res) { this.toastr.success('Informação atualizada com sucesso.', 'Notificação');
      this.getList() }
        else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação') }
        error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error, 'Erro') }
      })


  };

  deleteDSV(id) {
    this.service.deleteDSV(id).subscribe(
      res => {
        if (res) {
          this.toastr.info('O dsv foi eliminado com sucesso', 'Notificação');
          this.getList();
          this.selectedRow = null
        }
      }
    )
    console.log(id);
  }
  
  resetModal() {
    this.dsvForm.reset();
    this.editState = false;
  }
}
