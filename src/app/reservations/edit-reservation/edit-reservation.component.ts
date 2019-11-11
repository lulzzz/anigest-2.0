import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationsService } from '../reservations.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.css']
})
export class EditReservationComponent implements OnInit {

  @Input() Reservation: any;
  pipe = new DatePipe('pt-PT')
  editReservation: FormGroup;
  status = [];
  idTypes = [];
  submitted = false;
  licenseInput: string;
  public mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
  public contribuinte = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public plateMask = [/[A-Z0-9]/, /[A-Z0-9]/, '-', /[A-Z0-9]/, /[A-Z0-9]/, '-', /[A-Z0-9]/, /[A-Z0-9]/]
  minBirthDate;
  maxBirthDate;
  minExpDate;
  maxExpDate;
  userIdSchool;
  userSchoolPermit;
  schools;
  previousExamExpirationDate;
  isChecked: boolean = false



  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private service: ReservationsService, private toastr: ToastrService) { }

  /*   createForm() {
      this.editReservation = this.fb.group({
      Student_name: ['', [Validators.required, Validators.minLength(4), this.ValidateString]],
      Student_num:   [''],
      Birth_date: ['', [Validators.required]],
      ID_num: ['', [Validators.required]],
      ID_expire_date: ['', [Validators.required]],
      tax_num: ['', [Validators.required, Validators.minLength(9), this.ValidateTax]],
      Drive_license_num: [''],
      Obs: [''],
      School_Permit: ['', [Validators.required]],
      Student_license: ['', [Validators.required]],
      Expiration_date: ['', [Validators.required]],
      Type_category_idType_category: [''],
      T_ID_type_idT_ID_type: ['', [Validators.required]],
      Exam_type_idExam_type: [''],
      Car_plate: [''],
      idTimeslot: [''],
      exam_expiration_date: ['']
      });
    } */

  ngOnInit() {
    this.userIdSchool = localStorage.getItem('idSchool')

    this.service.getStatus().subscribe(res => {
      this.status = Object.values(res)})

    this.service.getIdTypes().subscribe((data) => this.idTypes = data);

    this.service.getSchools().subscribe((data) => this.schools = data, () => {

    }, () => {
      if (this.userIdSchool !== 'null') {
        let schoolPermit = this.schools.filter((school) => {
          return school.idSchool == this.userIdSchool
        })
        this.userSchoolPermit = schoolPermit[0].Permit
      }
    })

    console.log(this.Reservation);
    this.editReservation = this.fb.group({
      Student_name: [this.Reservation.Student_name, [Validators.required, Validators.minLength(4), this.ValidateString]],
      Student_num: [this.Reservation.Student_num],
      Birth_date: [this.pipe.transform(this.Reservation.Birth_date, 'yyyy-MM-dd'), [Validators.required]],
      ID_num: [this.Reservation.ID_num, [Validators.required]],
      ID_expire_date: [this.pipe.transform(this.Reservation.ID_expire_date, 'yyyy-MM-dd'), [Validators.required]],
      Tax_num: [this.Reservation.Tax_num, [Validators.required, Validators.minLength(9), this.ValidateTax]],
      Drive_license_num: [this.Reservation.Drive_license_num],
      Obs: [this.Reservation.Obs],
      School_Permit: [this.Reservation.School_Permit, [Validators.required]],
      Student_license: [this.Reservation.Student_license, [Validators.required]],
      Expiration_date: [this.pipe.transform(this.Reservation.Expiration_date, 'yyyy-MM-dd'), [Validators.required]],
      Type_category_idType_category: [this.Reservation.Type_category_idType_category, [Validators.required]],
      T_ID_type_idT_ID_type: [this.Reservation.T_ID_type_idT_ID_type,[Validators.required]],
      Car_plate: [this.Reservation.Car_plate],
      exam_expiration_date: this.pipe.transform(this.Reservation.exam_expiration_date, 'yyyy-MM-dd'),
      T_exam_status_idexam_status: [this.Reservation.T_exam_status_idexam_status, [Validators.required]],
    })

    this.setMinExpDate();
    this.setMinMaxBirthDate();

    console.log(this.Reservation.Category)
    if (this.Reservation != null) {
      if (this.Reservation.Category.length === 1) {
        this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/];
      }
      else if (this.Reservation.Category.length === 2) {
        this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
      }
      else if (this.Reservation.Category.length >= 3) {
        if (this.Reservation.Category.includes(',')) {
          let [a, b, c] = this.Reservation.Category.split(',')
          if (a.length >= 3 || b.length >= 3) {
            this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/, /[a-zA-Z]/];
          }
          else {
            if (typeof (c) !== "undefined") {
              if (c.length >= 3) {
                this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/, /[a-zA-Z]/];
              }
              else {
                if (a.length === 2 || b.length === 2 || c.length === 2) {
                  this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
                }
                else {
                  this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/];
                }
              }
            }
            else {
              if (a.length === 2 || b.length === 2) {
                this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/];
              }
              else {
                this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/];
              }
            }
          }
        }
        else {
          this.mask = [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /[a-zA-Z]/, /[A-Z0-9]/, /[a-zA-Z]/];
        }
      }
    }

    if (this.licenseInput != null) {
      this.checkValue(this.licenseInput)
    }

  }

  sendValue(id) {
    /*     const category = this.categories.filter(item => item.idType_category === +id);
        console.log(category)
        console.log(category[0].Category)
        this.categoryName = category[0].Category; */


  }

  checkValue(val) {
    console.log(typeof val)
    console.log(this.Reservation.Category)
    let stringy = val.substring(15);
    this.licenseInput = val;

    if (stringy.substr(2, 1) === '_') {
      stringy = stringy.slice(0, stringy.length - 1)
    }
    if (stringy.substr(1, 1) === '_') {
      if (stringy.substr(2, 1) !== '_') {
        let [a, b] = stringy.split('_')
        stringy = a + b
      }
      else {
        stringy = stringy.slice(0, stringy.length - 1)
      }
    }
    console.log('HEEEEEEEEEY', stringy)
    if (this.Reservation.Category.includes(',')) {
      let [a, b, c] = this.Reservation.Category.split(',');
      console.log(a,b,c)
      if (a.includes('E')) {
        a = a + 'E';
        console.log(a)
      }
      if (b.includes('E')) {
        b = b + 'E';
        console.log(b)
      }
       if (c !== undefined &&  c.includes('E')) {
        c = c + 'E';
        console.log(c)
      } 
      if (stringy === a || stringy === b || stringy === c) { }
      else {
        this.editReservation.controls['Student_license'].setErrors({ 'formatError': true })
      }
    }
    else {
      let cat = this.Reservation.Category
      if (cat.includes('+')) {
        let [a, b] = cat.split('+')
        cat = a + b
      }
      if (stringy === cat) { }
      else {
        this.editReservation.controls['Student_license'].setErrors({ 'formatError': true })
      }
    }
  }

  getDirtyValues(editForm) {
    this.submitted = true;
   
    if (!this.editReservation.valid) {
      this.toastr.warning('Os campos obrigatórios não estão preenchidos ou não estão preenchidos corretamente.','Atenção',  {
        timeOut: 10000,
        closeButton: true
      })
      return;
  }
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

    if( Object.keys(dirtyValues).length === 0){
      this.activeModal.close();

    }
    else{
      this.service.patchReservation(dirtyValues, this.Reservation.idReservation, this.Reservation.idTemp_Student)
      .subscribe(res => { this.toastr.success('A reserva foi atualizada com sucesso.', 'Notificação');
                        this.service.sendEvent()},
        error => this.toastr.error('Ocorreu um erro. Por favor, tente novamente.', 'Erro'))
        this.activeModal.close();
      
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
    return { validString: true }
  }

  checkBoxChecked() {
    if (this.editReservation.get('exam_expiration_date').value !== null) {
      this.previousExamExpirationDate = this.editReservation.get('exam_expiration_date').value
    }
    this.isChecked = !this.isChecked
    if (!this.isChecked) {
      this.editReservation.patchValue({ exam_expiration_date: null })
      this.Reservation.exam_expiration_date = null
      this.editReservation.controls['exam_expiration_date'].markAsDirty()
    }
    if (this.isChecked) {
      this.Reservation.exam_expiration_date = this.previousExamExpirationDate
      this.editReservation.patchValue({ exam_expiration_date: this.pipe.transform(this.Reservation.exam_expiration_date, 'yyyy-MM-dd')})
      this.editReservation.controls['exam_expiration_date'].markAsDirty()
    }
  }

   //////////////////////////////////////DATE LIMITATIONS//////////////////////////////////////////////////

   setMinMaxBirthDate() {
    let date = new Date(this.Reservation.Timeslot_date).getFullYear();
    this.maxBirthDate = '' + (date - 14) + '-12-31';
    this.minBirthDate = '' + (date - 100) + '-12-31';
  }

  setMinExpDate() {
    let date = new Date(this.Reservation.Timeslot_date).getFullYear();
    this.minExpDate = this.pipe.transform(new Date(this.Reservation.Timeslot_date), 'yyyy-MM-dd')
    this.maxExpDate = '' + (date + 5) + '-12-31';
  }

  validateDate(dateVal, type) {
    console.log(dateVal, type, new Date(this.Reservation.Timeslot_date).setHours(0,0,0,0))
    if (type === 'birthdate') {
      if ((new Date(dateVal).getFullYear()) > (new Date(this.Reservation.Timeslot_date).getFullYear() - 14)) {
        this.editReservation.controls['Birth_date'].setErrors({ 'invalid_date': true });
      }
      else if ((new Date(dateVal).getFullYear()) < (new Date(this.Reservation.Timeslot_date).getFullYear() - 100)){
        this.editReservation.controls['Birth_date'].setErrors({ 'invalid_date': true });
      }
      else { return null}
    }
    else if (type === 'idexp') {
      if ((new Date(dateVal).setHours(0,0,0,0) < new Date(this.Reservation.Timeslot_date).setHours(0,0,0,0)) || (new Date(dateVal).getFullYear()) > (new Date(this.Reservation.Timeslot_date).getFullYear() + 20)){
        this.editReservation.controls['ID_expire_date'].setErrors({ 'invalid_date': true });
      }
      else {return null}
    }
    else if (type === 'licexp'){
      if ((new Date(dateVal).setHours(0,0,0,0) < new Date(this.Reservation.Timeslot_date).setHours(0,0,0,0))){
        this.editReservation.controls['Expiration_date'].setErrors({ 'invalid_date': true });
      }
      else if((new Date(dateVal).getFullYear()) > (new Date(this.Reservation.Timeslot_date).getFullYear() + 4)){
        this.editReservation.controls['Expiration_date'].setErrors({ 'invalid_date': true });
      }
      else {return null}
    }

    else if (type === 'teoexp'){
      if ((new Date(dateVal).setHours(0,0,0,0) < new Date(this.Reservation.Timeslot_date).setHours(0,0,0,0))){
        this.editReservation.controls['exam_expiration_date'].setErrors({ 'invalid_date': true });
      }
      else if((new Date(dateVal).getFullYear()) > (new Date(this.Reservation.Timeslot_date).getFullYear() + 20)){
        this.editReservation.controls['exam_expiration_date'].setErrors({ 'invalid_date': true });
      }
      else {return null}
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
