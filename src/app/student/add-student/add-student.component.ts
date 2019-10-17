import { Component, OnInit } from '@angular/core';
import { ServerService } from './server.service';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  pipe = new DatePipe('pt-PT');
  public mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[A-Z]/];
  public contribuente = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public students: Array<any> = [];
  public schools = [];
  public idTypes = [];
  public categories = [];
  categoryName;
  errorMessage: any;

  angForm: FormGroup;
  constructor(private fb: FormBuilder, private bs: ServerService, private route: ActivatedRoute, public activeModal: NgbActiveModal, private toastr: ToastrService) {
    this.createForm();
  }


  createForm() {
    this.angForm = this.fb.group({
      number: [null, Validators.required],
      name: ['', Validators.required],
      id_type: [null, Validators.required],
      birth_date: [null, Validators.required],
      id: [null, Validators.required],
      id_expiration: [null, Validators.required],
      school: [null, Validators.required],
      category: [null, Validators.required],
      license: [null, { validators: [Validators.required], updateOn: 'blur' }],
      license_expiration: [null, Validators.required],
      fiscal_number: [null, [Validators.required]],
      existing_license: [null],
      observations: [null]

    });
  }

  addStudent(number, name, type, birth_date, id, id_expiration, school, category, license, license_expiration, fiscal_number, existing_license, observations) {
    this.bs.addStudent(number, name, type, birth_date, id, id_expiration, school, category, license, license_expiration, fiscal_number, existing_license, observations)
      .subscribe(res => {
        this.toastr.success('Candidato foi criado com sucesso.', 'Notificação');
        if (this.students == null) {
          console.log('Nothing here')
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
  }

  sendValue(id) {
    const category = this.categories.filter(item => item.idType_category === +id);

    console.log(category[0].Category.substring(0, 1))
    this.categoryName = category[0].Category.substring(0, 1)
  }

  checkValue(val) {
    const stringy = val.substring(15, 16);
    console.log(stringy)
    if (stringy === this.categoryName) {
      console.log('SUCCEESS')
    }
    else {
      
        this.angForm.controls['license'].setErrors({'invalid': true});
        this.errorMessage = 'O número da licença deve corresponder à categoria.' 
    }
  }

}