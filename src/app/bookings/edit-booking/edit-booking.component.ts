import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../booking.service';
import { ServerService } from 'src/app/student/add-student/server.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit {
  time = { hour: 13, minute: 30 };
  @Input() idExaminer: any;
  pipe = new DatePipe('pt-PT')
  editExam: FormGroup;
  schools = [];
  statuses = [];
  examTypes = [];
  ids = [];


  constructor(private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute, public activeModal: NgbActiveModal, private ss: ServerService, private modalService: NgbModal, private service: BookingService) { }

  createForm() {
    this.editExam = this.fb.group({
      Permit: this.idExaminer.Permit,
      School_name: this.idExaminer.School_idSchool,
      Student_num: this.idExaminer.Student_num,
      Student_name: this.idExaminer.Student_name,
      T_ID_type_idT_ID_type: this.idExaminer.T_ID_type_idT_ID_type,
      Birth_date: this.pipe.transform(this.idExaminer.Birth_date, 'yyyy-MM-dd'),
      ID_num: this.idExaminer.ID_num,
      ID_expire_date: this.pipe.transform(this.idExaminer.ID_expire_date, 'yyyy-MM-dd'),
      Student_license: this.idExaminer.Student_license,
      Expiration_date: this.pipe.transform(this.idExaminer.Expiration_date, 'yyyy-MM-dd'),
      Tax_num: this.idExaminer.Tax_num,
      Drive_license_num: this.idExaminer.Drive_license_num,
      Obs1: this.idExaminer.Obs1,
      Booked_date: this.pipe.transform(this.idExaminer.Booked_date, 'yyyy-MM-dd'),
      Timeslot_date: this.pipe.transform(this.idExaminer.Timeslot_date, 'yyyy-MM-ddTHH:mm', '-0000', 'pt-PT'),
      Exam_type_idExam_type: this.idExaminer.Exam_type_idExam_type,
      Obs: this.idExaminer.Obs,
      Student_license_idStudent_license: [null],
      Exam_center_idExam_center: [4],
      Exam_group: this.idExaminer.Exam_group,
      Timeslot_idTimeslot: this.idExaminer.Exam_group
    });
  }

  ngOnInit() {

    this.ss.getSchools().subscribe(data => { this.schools = Object.values(data), console.log(this.schools) });
    this.ss.getStatus().subscribe(data => this.statuses = Object.values(data));
    this.service.getExamType().subscribe(data => {
    this.examTypes = Object.values(data),
      console.log(this.examTypes)
    });
    this.service.getID().subscribe(data => {
    this.ids = Object.values(data),
      console.log(this.ids)
    });

    console.log(this.idExaminer.Timeslot_date.toLocaleString())
    this.createForm()
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

    this.service.patchBooking(dirtyValues, this.idExaminer.idBooked)
      .subscribe(res => { this.toastr.success('Marcação foi atualizada com sucesso.', 'Notificação', {
        timeOut: 10000,
        closeButton: true
      });  })
    this.activeModal.close();

  }

}
