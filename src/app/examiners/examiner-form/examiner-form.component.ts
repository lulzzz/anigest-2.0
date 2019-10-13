import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ExaminerServiceService } from '../examiner-service.service';
import { ToastrService } from 'ngx-toastr';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-examiner-form',
  templateUrl: './examiner-form.component.html',
  styleUrls: ['./examiner-form.component.css']
})
export class ExaminerFormComponent implements OnInit {

  @Input() idExaminer:any;
  @Input() action:any;

  addExaminerForm: FormGroup;

  constructor(private fb: FormBuilder,  public activeModal: NgbActiveModal, public es:ExaminerServiceService, private toastr:ToastrService) { 
    this.createForm();
  }
 
createForm() {
  this.addExaminerForm = this.fb.group({
    Num: [null],
    Examiner_name: [null],
    License_num:[null],
    License_expiration:[null],
    Active:[null],
    Obs:[null],
    Exam_center_idExam_center:[4],
  });
}
  ngOnInit() {
    console.log(this.idExaminer);

    if(this.idExaminer){
      this.addExaminerForm.patchValue({
        Num: this.idExaminer.Num,
        Examiner_name: this.idExaminer.Examiner_name,
        License_num: this.idExaminer.License_num,
        License_expiration: this.idExaminer.License_expiration,
        Active: this.idExaminer.Active,
        Obs:this.idExaminer.Obs,
      })
    }
  }

  onSubmit() { 
    const forms = this.addExaminerForm.value;
    this.es.addExaminer(forms)
    .subscribe(res => {
      if(res) {
        this.toastr.success('Examinador foi criado com sucesso.','Notificação')
      }
    },
    error => { 
      this.toastr.error('Ocorreu um erro. Por favor, tente novamente.');
    })
    console.log(forms)
    this.activeModal.close()
}

onEdit(addExaminerForm){
  let dirtyValues = {};
  console.log(dirtyValues);

  Object.keys(addExaminerForm.controls)
      .forEach(key => {
          let currentControl = addExaminerForm.controls[key];

          if (currentControl.dirty) {
              if (currentControl.controls)
                  dirtyValues[key] = this.onEdit(currentControl);
              else
                  dirtyValues[key] = currentControl.value;
          }
      });
  
  this.es.patchExaminer(dirtyValues, this.idExaminer.idExaminer)
  .subscribe(res => this.toastr.success('Examinador foi editado com sucesso.','Notificação'),
  error=>  this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Notificação'))
}


}
