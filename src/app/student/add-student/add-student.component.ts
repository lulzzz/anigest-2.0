import { Component, OnInit } from '@angular/core';
import { ServerService } from './server.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  pipe = new DatePipe('pt-PT');
  public mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
  public contribuinte = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public students: Array<any> = [];
  public schools = [];
  public idTypes = [];
  public categories = [];
  categoryName;
  errorMessage: any;
  date;
  maxBirthDate: String;
  minBirthDate: String;
  minExpDate:String;
  maxExpDate:String;
  submitted = false;
  angForm: FormGroup;
  licenseInput:string;

  constructor(public datepipe: DatePipe, private fb: FormBuilder, private bs: ServerService, private route: ActivatedRoute, public activeModal: NgbActiveModal, private toastr: ToastrService, private datePipe: DatePipe) {
    this.createForm();
  }


  createForm() {
    this.angForm = this.fb.group({
      Student_num: [null, Validators.required],
      Student_name: [null, [Validators.required, this.ValidateString]],
      T_ID_type_idT_ID_type: [null, Validators.required],
      Birth_date: [null, [Validators.required]],
      ID_num: [null, [Validators.required]],
      ID_expire_date: [null, [Validators.required]],
      School_idSchool: [null, Validators.required],
      Type_category_idType_category: [null, Validators.required],
      Student_license: [null, { validators: [Validators.required], updateOn: 'blur' }],
      Expiration_date: [null, Validators.required],
      Tax_num: [null, [Validators.required, this.ValidateTax]],
      Drive_license_num: [null],
      Obs: [null]
    });
  }

  addStudent() {
    const form = this.angForm.value;
    this.submitted = true;
   
    if (!this.angForm.valid) {
      this.toastr.warning('Os campos obrigatórios não estão preenchidos ou não estão preenchidos corretamente.','Atenção',  {
        timeOut: 10000,
        closeButton: true
      })
      return;
  }

    this.bs.addStudent(form)
      .subscribe(res => {
        this.toastr.success('Candidato foi criado com sucesso.', 'Notificação',  {
          timeOut: 10000,
          closeButton: true
        });
        if (this.students == null) {
        }
        else {
          this.bs.sendSomething()
        }
      })
    this.activeModal.close();
  }

  ngOnInit() {
    this.bs.getIdType()
      .subscribe(identification => this.idTypes = Object.values(identification));

    this.bs.getSchools()
      .subscribe(school => this.schools = Object.values(school));

    this.bs.getCategory()
      .subscribe(category => {
        this.categories = Object.values(category)
        console.log(this.categories)
      });

    this.setMinMaxBirthDate();
    this.setMinExpDate() 
  }


  sendValue(id) {
    const category = this.categories.filter(item => item.idType_category === +id);
    console.log(category)
    console.log(category[0].Category)
    this.categoryName = category[0].Category;
    if (this.categoryName != null){
      if (this.categoryName.length === 1) {
        this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/];
      }
      else if (this.categoryName === 2) {
        this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
      }
      else if (this.categoryName.length >= 3) {
        this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/, /[a-zA-Z]/];
      }
    }

  if(this.licenseInput != null) {
    this.checkValue(this.licenseInput)
  }
    
  }

  checkkValue(val) {
    const stringy = val.substring(15, 16);
    console.log(stringy)
    if (stringy === this.categoryName) {
    }
    else {

      this.angForm.controls['license'].setErrors({ 'invalid': true });
      this.errorMessage = 'O número da licença deve corresponder à categoria.'
    }
  }

  checkValue(val) {
    let stringy = val.substring(15);
    this.licenseInput = val;

    if (stringy.substr(2,1) === '_') {
      stringy = stringy.slice(0, stringy.length-1)
    }
    if (stringy.substr(1,1) === '_') {
      if (stringy.substr(2,1) !== '_') {
        let [a, b] = stringy.split('_')
        stringy = a+b
      }
      else {
        stringy = stringy.slice(0, stringy.length-1)
      }
    }
    if (this.categoryName.includes(',')) {
      let [a, b, c] = this.categoryName.split(',')
      if (a.includes('E')) {
        a = a + 'E'
      }
      if (b.includes('E')) {
        b = b + 'E'
      }
      if (c !== null && c.includes('E')) {
        c = c + 'E'
      }
      if (stringy === a || stringy === b || stringy === c) {}
      else {
        this.angForm.controls['Student_license'].setErrors({'formatError': true})
      }
    }
    else {
      let cat = this.categoryName
      if (cat.includes('+')) {
        let [a, b] = cat.split('+')
        cat = a + b
      }
      if (stringy === cat) {}
      else {
        this.angForm.controls['license'].setErrors({'formatError': true})
      }
    }
  }


  ValidateString(control: FormControl) {
    let pattern = /[*\\/|":?><0-9\-_;ºª.,!~]/gi; // can change regex with your requirement
    //if validation fails, return error name & value of true
    if (pattern.test(control.value)) {
        return { validString: true };
    }
    //otherwise, if the validation passes, we simply return null
    return null;
  }

  ValidateTax(control: FormControl) {
    let pattern = /[0-9]{9}/
    if (pattern.test(control.value)) {
      return null
    }
    return { validTax: true }
  }

  //////////////////////////////////////DATE LIMITATIONS//////////////////////////////////////////////////

  setMinMaxBirthDate() {
    let date = new Date().getFullYear();
    this.maxBirthDate = '' + (date - 14) + '-12-31';
    this.minBirthDate = '' + (date - 100) + '-12-31';
  }

  setMinExpDate() {
    let date = new Date().getFullYear();
    this.minExpDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    this.maxExpDate = '' + (date + 5) + '-12-31';
  }

  validateDate(dateVal, type) {
    console.log(dateVal, type, new Date().setHours(0,0,0,0))
    if (type === 'birthdate') {
      if ((new Date(dateVal).getFullYear()) > (new Date().getFullYear() - 14)) {
        this.angForm.controls['Birth_date'].setErrors({ 'invalid_date': true });
      }
      else if ((new Date(dateVal).getFullYear()) < (new Date().getFullYear() - 100)){
        this.angForm.controls['Birth_date'].setErrors({ 'invalid_date': true });
      }
      else { return null}
    }
    else if (type === 'idexp') {
      if ((new Date(dateVal).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) || (new Date(dateVal).getFullYear()) > (new Date().getFullYear() + 20)){
        this.angForm.controls['ID_expire_date'].setErrors({ 'invalid_date': true });
      }
      else {return null}
    }
    else if (type === 'licexp'){
      if ((new Date(dateVal).setHours(0,0,0,0) < new Date().setHours(0,0,0,0))){
        this.angForm.controls['Expiration_date'].setErrors({ 'invalid_date': true });
      }
      else if((new Date(dateVal).getFullYear()) > (new Date().getFullYear() + 2)){
        this.angForm.controls['Expiration_date'].setErrors({ 'invalid_date': true });
      }
      else {return null}
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
