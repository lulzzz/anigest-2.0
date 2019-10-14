import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  examTypes = [];

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private service: ReservationsService, private toastr: ToastrService) { this.createForm() }

  createForm() {
    this.editReservation = this.fb.group({
      Begin_time: [null],
      Birth_date: [null],
      Category: [null],
      Drive_license_num: [null],
      Duration: [null],
      End_time: [null],
      Exam_group: [null],
      Exam_type_idExam_type: [null],
      Exam_type_name: [null],
      ID_expire_date: [null],
      ID_name: [null],
      ID_num: [null],
      Obs: [null],
      School_Permit: [null],
      School_name: [null],
      Student_license: [null],
      Student_license_Expiration_date: [null],
      Student_name: [null],
      T_ID_type: [null],
      T_exam_status_idexam_status: [null],
      Timeslot_date: [null],
      Tax_num: [null]
    });
  }

  ngOnInit() {

    this.service.getStatus().subscribe(res => {
      this.status = Object.values(res),
        console.log(this.status)
    })
    this.service.getExamType().subscribe(res => {
      this.examTypes = Object.values(res),
        console.log(this.examTypes)
    });

    console.log(this.Reservation);
    this.editReservation.patchValue({
      Begin_time: this.Reservation.Begin_time,
      Birth_date: this.pipe.transform(this.Reservation.Birth_date, 'yyyy-MM-dd'),
      Category: this.Reservation.Category,
      Drive_license_num: this.Reservation.Drive_license_num,
      Duration: this.Reservation.Duration,
      End_time: this.Reservation.End_time,
      Exam_group: this.Reservation.Exam_group,
      Exam_type_idExam_type: this.Reservation.Exam_type_idExam_type,
      Exam_type_name: this.Reservation.Exam_type_name,
      ID_expire_date: this.pipe.transform(this.Reservation.ID_expire_date, 'yyyy-MM-dd'),
      ID_name: this.Reservation.ID_name,
      ID_num: this.Reservation.ID_num,
      Obs: this.Reservation.Obs,
      School_Permit: this.Reservation.School_Permit,
      School_name: this.Reservation.School_name,
      Student_license: this.Reservation.Student_license,
      Student_license_Expiration_date: this.pipe.transform(this.Reservation.Expiration_date, 'yyyy-MM-dd'),
      Student_name: this.Reservation.Student_name,
      T_ID_type: this.Reservation.T_ID_type,
      T_exam_status_idexam_status: this.Reservation.T_exam_status_idexam_status,
      Timeslot_date: this.Reservation.Timeslot_date,
      Tax_num: this.Reservation.Tax_num
    })
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

    this.service.patchReservation(dirtyValues, this.Reservation.idReservation, this.Reservation.idTemp_Student)
      .subscribe(res => { this.toastr.success('A reserva foi atualizada com sucesso.', 'Notificação'); },
      error=> this.toastr.error('Ocorreu um erro. Por favor, tente novamente.','Erro'))
    this.activeModal.close();
    this.service.sendEvent()

  }

  //this.service.sendSomething()



}
