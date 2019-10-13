import { Component, OnInit, Input } from '@angular/core';
import { SchoolService } from './../school.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.css']
})
export class AddSchoolComponent implements OnInit {
 
  @Input() idSchool:any;
  @Input() action:any;
  addSchool: FormGroup;
  location:any;
  dsv=[]

  constructor(private fb: FormBuilder, private bs: SchoolService, private route:ActivatedRoute, public activeModal: NgbActiveModal, private toastr: ToastrService) { 
    this.createForm();
  }

  createForm() {
    this.addSchool = this.fb.group({
      Permit: [null],
      Associate_num: [null],
      School_name:[null],
      Address:[null],
      Tax_num:[null],
      Location:[null],
      Zip_code:[null],
      Telephone1:[null],
      Email1:[null], 
      Invoice_name:[null], 
      Invoice_address:[null], 
      Invoice_location:[null], 
      Invoice_zip_code:[null], 
      Invoice_tax_number:[null],
      Invoice_email:[null],
      Invoice_email2:[null],
      Delegation_idDelegation:[null], 
      Send_Invoice_email:[null],
      Obs:[null],
      Exam_center_idExam_center:1
    });
  }

  ngOnInit() {
    this.bs.getDSV().subscribe(
      res => {
        if (res) {
          this.dsv = Object.values(res)
          console.log(this.dsv)
        }
        else {
          this.toastr.error('Informação não encontrada', 'Erro')
        }
      })

      console.log(this.idSchool);
      console.log(this.action);

    if (this.idSchool){
      this.addSchool.patchValue({
        Permit: this.idSchool.Permit,
        Associate_num:  this.idSchool.Associate_num,
        School_name: this.idSchool.School_name,
        Address: this.idSchool.Address,
        Tax_num: this.idSchool.Tax_num,
        Location: this.idSchool.Location,
        Zip_code: this.idSchool.Zip_code,
        Telephone1: this.idSchool.Telephone1,
        Email1: this.idSchool.Email1, 
        Invoice_name: this.idSchool.Invoice_name, 
        Invoice_address: this.idSchool.Invoice_address, 
        Invoice_location: this.idSchool.Invoice_location, 
        Invoice_zip_code: this.idSchool.Invoice_zip_code, 
        Invoice_tax_number: this.idSchool.Invoice_tax_number,
        Invoice_email: this.idSchool.Invoice_email,
        Invoice_email2: this.idSchool.Invoice_email2,
        Delegation_idDelegation: this.idSchool.Delegation_idDelegation, 
        Send_Invoice_email: this.idSchool.Send_Invoice_email,
        Obs: this.idSchool.Obs,
      })
    }
    

  }

  onSubmit() { 
      const forms = this.addSchool.value;
      this.bs.addSchool(forms);
      console.log(forms)
      this.activeModal.close()
  }

  doThis(){
    console.log('HELLO')
    let zomg = this.addSchool.value.Zip_code;
    let num: number = zomg.toString().length;
    if (num === 8) {
     this.bs.getLocality(zomg)
     .subscribe( res => {this.location = Object.values(res);
    this.addSchool.patchValue({
      Location:this.location
    })},
    error => {
      this.addSchool.patchValue({
        Location:'Não encontrado.',
      })
    }
      )
    }
    else {
      console.log('Not correct :( Try again');
      this.addSchool.patchValue({
        Location:'Não encontrado.',
      })}
    
  }

  doThis2(){
    console.log('HELLO')
    let zomg = this.addSchool.value.Invoice_zip_code;
    let num: number = zomg.toString().length;
    if (num === 8) {
     this.bs.getLocality(zomg)
     .subscribe( res => {this.location = Object.values(res);
    this.addSchool.patchValue({
      Invoice_location:this.location
    })},
    error => {
      this.addSchool.patchValue({
        Location:'Não encontrado.',
      })
    }
      )
    }
    else {
      console.log('Not correct :( Try again');
      this.addSchool.patchValue({
        Location:'Não encontrado.',
      })}
    
  }
    onEdit(addSchool){
      let dirtyValues = {};
      console.log(dirtyValues);
    
      Object.keys(addSchool.controls)
          .forEach(key => {
              let currentControl = addSchool.controls[key];
    
              if (currentControl.dirty) {
                  if (currentControl.controls)
                      dirtyValues[key] = this.onEdit(currentControl);
                  else
                      dirtyValues[key] = currentControl.value;
              }
          });
      
      this.bs.patchSchool(dirtyValues, this.idSchool.idSchool)
      .subscribe(res =>{this.toastr.success('Escola foi editada com sucesso.','Notificação'),
      this.bs.sendEvent()},
      error=>  this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Notificação'))
    } 
  
  }

