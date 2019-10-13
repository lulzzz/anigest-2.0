import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../parameters.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.css']
})
export class BanksComponent implements OnInit {

  public banks: Array<any> = [];
  selectedRow: any;
  closeResult: string;
  banksForm: FormGroup;
  addBank = {};
  editState: boolean = false;
  subject;


  constructor(private service: ParametersService, private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal, private auth:AuthService) { this.createForm() }

  createForm() {
    this.banksForm = this.fb.group({
      Bank_name: [null],
      Description: [null]
    });
  }

  ngOnInit() {
    this.getList();
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  getList() {
    this.service.getBanks().subscribe(
      res => {
        if (res) {
          this.banks = Object.values(res)
          console.log(this.banks)
        }
        else {
          this.toastr.error('Informação não encontrada', 'Erro');
          this.banks=null;
        }
      })
  };

  public setClickedRow(id) {
    this.selectedRow = id;
    console.log(this.selectedRow)
  };

  open(content) {
    this.modalService.open(content, { backdrop: 'static' })
  };

  onSubmit() {
    if (this.editState === false) {
      const form = this.banksForm.value;
      console.log(form);
      this.service.addBank(form).subscribe(
        res => {
          if (res) { console.log('ID ADDED', res); this.getList() }
          else { console.log('EEERROOOORRR') }
        }
      )
    }
    else {
      console.log('Will edit!!!!')
    };
    this.banksForm.reset()
  }

  editBank(content) {
    if (this.selectedRow.Description) {
      this.banksForm.patchValue({
        Bank_name: this.selectedRow.Bank_name,
        Description: this.selectedRow.Description,
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

    this.service.patchBanks(dirtyValues, this.selectedRow.idBanks)
      .subscribe(res => {
        if (res) { this.toastr.success('Informação atualizada com sucesso.', 'Notificação');
        this.getList() }
        else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação') }
        error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error, 'Erro') }
      })

    
  };

  deleteBank(id) {
    this.service.deleteBank(id).subscribe(
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
    this.banksForm.reset();
    this.editState = false;
  }

}
