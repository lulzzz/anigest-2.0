import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../parameters.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-iva',
  templateUrl: './iva.component.html',
  styleUrls: ['./iva.component.css']
})
export class IvaComponent implements OnInit {

  public iva:Array<any> = [];
  selectedRow: any;
  closeResult: string;
  ivaForm: FormGroup;
  editState: boolean = false;
  subject;

  constructor(private service: ParametersService, private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal, private auth:AuthService) { this.createForm() }

  createForm() {
    this.ivaForm = this.fb.group({
      Tax: [null]
    });
  }

  ngOnInit() {
    this.getList();
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }
  
  getList() {
    this.service.getIVA().subscribe(
      res => { if(res) {
        this.iva = Object.values(res)
        console.log(this.iva)
      }
      else {
        this.toastr.error('Informação não encontrada','Erro')
      }
      })
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
      const form = this.ivaForm.value;
      console.log(form);
      this.service.addIVA(form).subscribe(
        res => { if (res) { console.log('ID ADDED', res); this.getList() }
      else { console.log('EEERROOOORRR')} }
      )
    }
    else {
      console.log('Will edit!!!!')
    };
    this.ivaForm.reset()
  }

  editIVA(content) {
    if (this.selectedRow.idT_Tax) {
      this.ivaForm.patchValue({
        Tax: this.selectedRow.Tax,
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

    this.service.patchIVA(dirtyValues, this.selectedRow.idT_Tax)
      .subscribe(res => {
        if (res) { this.toastr.success('Informação atualizada com sucesso.', 'Notificação');
        this.getList() }
        else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação') }
        error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error, 'Erro') }
      })

    
  };

  deleteIVA(id) {
    this.service.deleteIVA(id).subscribe(
      res => {
        if (res) {
          this.toastr.info('Informação foi eliminada com sucesso.', 'Notificação');
          this.getList();
          this.selectedRow = null
        }
      }
    )
    console.log(id);
  }
  
  resetModal() {
    this.ivaForm.reset();
    this.editState = false;
  }
}
