import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResultsService } from '../results.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-results',
  templateUrl: './edit-results.component.html',
  styleUrls: ['./edit-results.component.css']
})
export class EditResultsComponent implements OnInit {

  @Input() pauta:any;
  editPauta:FormGroup;
  pipe = new DatePipe('pt-PT')

  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService, private fb: FormBuilder, private service: ResultsService) { }

  createForm() {
    this.editPauta = this.fb.group({
      Begin_time: this.pauta.Begin_time,
      End_time: this.pauta.End_time,
      F_reason: this.pauta.F_reason,
      Pauta_date:  this.pipe.transform(this.pauta.Timeslot_date, 'yyyy-MM-dd'),
      Pauta_num: this.pauta.Pauta_num,
    });
  }

  ngOnInit() {
    this.createForm()
  }

  getDirtyValues(editPauta){
 let dirtyValues = {};
    console.log(dirtyValues);
/* 
    Object.keys(editPauta.controls)
      .forEach(key => {
        let currentControl = editPauta.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.getDirtyValues(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });

    this.service.patchPauta(dirtyValues, this.pauta.idPauta)
      .subscribe(res => { this.toastr.success('A reserva foi atualizada com sucesso.', 'Notificação'); })
    this.activeModal.close();
    this.service.sendEvent()
 */
  }

}
