import { Component, OnInit } from '@angular/core';
import { ConfigurationsService } from '../../configurations.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ce1',
  templateUrl: './ce1.component.html',
  styleUrls: ['./ce1.component.css']
})
export class Ce1Component implements OnInit {

  public configs;
  CE:FormGroup;
  Bank_acc:FormGroup;
  subject;

  constructor(private service: ConfigurationsService, private fb: FormBuilder, private auth: AuthService, private toastr: ToastrService) { }

  createForm() {
    this.CE = this.fb.group({
      Exam_center_name: [{value:this.configs[0].Exam_center_name, disabled: !this.subject.includes('PATCH_Configuration')}],
      Center_code: [{value:this.configs[0].Center_code, disabled: !this.subject.includes('PATCH_Configuration')}],
      Center_num: [{value:this.configs[0].Center_num, disabled: !this.subject.includes('PATCH_Configuration')}],
      Email1: [{value:this.configs[0].Email1, disabled: !this.subject.includes('PATCH_Configuration')}],
      Address: [{value:this.configs[0].Address, disabled: !this.subject.includes('PATCH_Configuration')}],
      Telephone1: [{value:this.configs[0].Telephone1, disabled: !this.subject.includes('PATCH_Configuration')}],
      Telephone2: [{value:this.configs[0].Telephone2, disabled: !this.subject.includes('PATCH_Configuration')}],
      Tax_num: [{value:this.configs[0].Tax_num, disabled: !this.subject.includes('PATCH_Configuration')}],
      Zip_code: [{value:this.configs[0].Zip_code, disabled: !this.subject.includes('PATCH_Configuration')}]
    });
    this.Bank_acc = this.fb.group({
      Acc_Bank:[{value:this.configs[0].Acc_Bank, disabled: !this.subject.includes('PATCH_Configuration')}],
      Acc_Bank_num:[{value:this.configs[0].Acc_Bank_num, disabled: !this.subject.includes('PATCH_Configuration')}],
      IMT_Bank_num:[{value:this.configs[0].IMT_Bank_num, disabled: !this.subject.includes('PATCH_Configuration')}]
    })
  
}

  ngOnInit() {
    this.service.getConfig().subscribe(
      res => { 
        if (res){
        this.configs = Object.values(res), 
        console.log(this.configs)
        this.createForm()    
   }});

   this.auth.currentUserSubject.subscribe(message => {
    this.subject = message,
      console.log(this.subject)
    });
  }

  getDirtyValues(editForm) {
    let dirtyValues = {};
    console.log(dirtyValues);

    Object.keys(editForm.controls)
      .forEach(key => {
        let currentControl = editForm.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.getDirtyValues(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });

    this.service.patchConfig(dirtyValues)
      .subscribe(res => { this.toastr.success('O candidato foi atualizado com sucesso.', 'Notificação'); })

  }



}
