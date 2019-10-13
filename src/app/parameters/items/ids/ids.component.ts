import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../parameters.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-ids',
  templateUrl: './ids.component.html',
  styleUrls: ['./ids.component.css']
})
export class IdsComponent implements OnInit {

  public ids:Array<any> = [];
  selectedRow: any;
  closeResult: string;
  addID = {};
  editForm: FormGroup;
  editState: boolean = false;
  subject;

  constructor(private service: ParametersService, private modalService: NgbModal, private toastr: ToastrService, private fb: FormBuilder, private auth:AuthService) { this.createForm() }

  createForm() {
    this.editForm = this.fb.group({
      ID_name: [null],
      IMT_type: [null],
      Doc_type: [null]
      
    });
  }

  public setClickedRow(id) {
    this.selectedRow = id;
    console.log(this.selectedRow)
  };

  open(content) {
    this.modalService.open(content, { backdrop: 'static' })
  }

  getStuff() {
    this.service.getIds().subscribe(
      res => { if(res) {
        this.ids = Object.values(res)
        console.log('HELLOOOOO', this.ids)
      }
      else {
        this.toastr.error('Informação não encontrada','Erro')
      }
      })
  }

  ngOnInit() {
    this.getStuff();
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

  editID(content) {
    if (this.selectedRow.idT_ID_type) {
      this.editForm.patchValue({
        ID_name: this.selectedRow.ID_name,
        IMT_type: this.selectedRow.IMT_type,
        Doc_type: this.selectedRow.Doc_type
      });
      this.open(content);
      this.editState = true;
    }
  }
saveChanges(editForm){
  let dirtyValues = {};
  console.log(dirtyValues);

  Object.keys(editForm.controls)
      .forEach(key => {
          let currentControl = editForm.controls[key];

          if (currentControl.dirty) {
              if (currentControl.controls)
                  dirtyValues[key] = this.saveChanges(currentControl);
              else
                  dirtyValues[key] = currentControl.value;
          }
      });
  
  this.service.patchID(dirtyValues, this.selectedRow.idT_ID_type)
  .subscribe(res => { if (res) {this.toastr.success('Informação atualizada com sucesso.','Notificação');
  this.getStuff()}
  else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.','Notificação') }
  error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error,'Erro') }
  })
  
};

  deleteID(id) {
    this.service.deleteID(id).subscribe(
      res => {
        if (res) {
          this.toastr.info('O tipo de identificação foi eliminado com sucesso', 'Notificação');
          this.getStuff();
          this.selectedRow = null
        }
      }
    )
    console.log(id);
  }
resetModal(){
  this.editForm.reset();
  this.editState = false;
}
}
