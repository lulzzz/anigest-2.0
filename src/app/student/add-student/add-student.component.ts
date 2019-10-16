import { Component, OnInit } from '@angular/core';
import { ServerService } from './server.service';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit{

  pipe = new DatePipe('pt-PT');
  public mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ' , /[A-Z]/, /\d/];
  public students:Array<any> = [];
  public schools = [];
  public idTypes = [];
  public categories = [];
  categoryName;


  angForm: FormGroup;
  constructor(private fb: FormBuilder, private bs: ServerService, private route:ActivatedRoute, public activeModal: NgbActiveModal, private toastr: ToastrService) {
    this.createForm();
  }


  createForm() {
    this.angForm = this.fb.group({
      number: [null, Validators.required],
      name: ['', Validators.required],
      id_type: [null, Validators.required],
      birth_date:[null, Validators.required],
      id: [null, Validators.required],
      id_expiration: [null, Validators.required],
      school: [null, Validators.required],
      category: [null, Validators.required],
      license:[null, Validators.required],
      license_expiration:[null, Validators.required],    
      fiscal_number:[null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      existing_license:[null], 
      observations:[null]

    });
  }

  addStudent(number, name, type, birth_date, id, id_expiration, school, category, license, license_expiration, fiscal_number, existing_license, observations) {
    this.bs.addStudent(number, name, type, birth_date, id, id_expiration,school, category, license, license_expiration, fiscal_number, existing_license, observations)
    .subscribe(res => {this.toastr.success('Candidato foi criado com sucesso.','Notificação');
  if(this.students == null ){
   console.log('Nothing here')
  }
else {
  this.bs.sendSomething()
}})
    this.activeModal.close();
  }
  
  ngOnInit() {
    this.bs.getIdType()
    .subscribe(identification => this.idTypes  = Object.values(identification)); 

    this.bs.getSchools()
    .subscribe(school => this.schools = Object.values(school)); 

    this.bs.getCategory()
    .subscribe(category => {this.categories = Object.values(category)
    console.log(this.categories)}); 
}

sendValue(id){
  const category = this.categories.filter(item => item.idType_category === +id);

  console.log(category[0].Category.substring(2))
  this.categoryName = category[0].Category.substring(2)
}

/*  licenseValidator(control: AbstractControl):{ [key: string]: boolean }  | null {

  const please =  control.value.substring(15,17)

  if ( please === this.categoryName) {
    console.log('HOORAY')
    return { 'ageRange': true };
} 

  return null;
} */

}