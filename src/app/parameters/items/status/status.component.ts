import { Component, OnInit, Pipe } from '@angular/core';
import { ParametersService } from '../../parameters.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})



export class StatusComponent implements OnInit {

public status:any;
statusForm: FormGroup;
selectedRow: any;
closeResult: string;
editState: boolean = false;
list:Array<any> = [];
subject;

  constructor(private service: ParametersService, private fb:FormBuilder, private modalService: NgbModal, private toastr: ToastrService, private auth:AuthService) { this.createForm()}

  createForm() {
    this.statusForm = this.fb.group({
      Status: [null],
      Process: [null]
  })}

  ngOnInit() {
    this.getList();
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  getList() {
    this.service.getStatus().subscribe(
      res => {
        this.status = Object.values(res)
        console.log(this.status)
      }
    )
  }

  public setClickedRow(id) {
    this.selectedRow = id;
    console.log(this.selectedRow)
  };

  open(content) {
    this.modalService.open(content, { backdrop: 'static' })
    this.list =  Array.from(new Set(this.status.map(item => item.Process)))
      .map(Process => {
        return {
          Process: Process,
          Description: this.status.find(item=> item.Process === Process).Description
        }
      })
    console.log(this.list)
  }

  onSubmit() {
    if (this.editState === false) {
      const form = this.statusForm.value;
      console.log(form);
      this.service.addStatus(form).subscribe(
        res => {
          if (res) { console.log('ID ADDED', res); this.getList() }
          else { console.log('EEERROOOORRR') }
        }
      )
    }
    else {
      console.log('Will edit!!!!')
    };
    this.statusForm.reset()
  }

  editStatus(content) {
    if (this.selectedRow.idexam_status) {
      this.statusForm.patchValue({
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

    this.service.patchStatus(dirtyValues, this.selectedRow.idexam_status)
      .subscribe(res => {
        if (res) { this.toastr.success('Informação atualizada com sucesso.', 'Notificação');
        this.getList() }
        else { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.', 'Notificação') }
        error => { this.toastr.error('Um erro ocorreu. Por favor, tente novamente.' + error, 'Erro') }
      })

    
  };

  deleteStatus(id) {
    this.service.deleteStatus(id).subscribe(
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
    this.statusForm.reset();
    this.editState = false;
  }

}
