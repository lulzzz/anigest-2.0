import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { ServerService } from '../add-student/server.service';
import { Student } from '../../studentmodel';
import { DatePipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})



export class EditStudentComponent implements OnInit {

@Input() idStudent: any;

pipe:DatePipe = new DatePipe('pt-PT')

 data:any;
 public schools = [];
 public idTypes = [];
 public categories = [];
 studentID;
 license;

 

  editForm: FormGroup;

  constructor( private route: ActivatedRoute, private router: Router, private bs: ServerService, private fb: FormBuilder, public activeModal: NgbActiveModal, private toastr: ToastrService) {
    this.createForm()

  }
  
  createForm() {
  this.editForm = this.fb.group({
    Student_name: [null, Validators.required],
    T_ID_type_idT_ID_type: [null, Validators.required],
    Birth_date: [null],
    ID_num: [null, Validators.required],
    ID_expire_date: [null, Validators.required],
    School_idSchool: [, Validators.required],
    Type_category_idType_category: [null, Validators.required],
    Student_license:[null, Validators.required],
    Expiration_date:[null, Validators.required],    
    Tax_num:[null, Validators.required],
    Drive_license_num:[null], 
    Obs:[null]
  })}; 

  ngOnInit() {

    this.bs.getIdType()
    .subscribe(identification1 => this.idTypes  = Object.values(identification1)); 

    this.bs.getSchools()
    .subscribe(school => this.schools = Object.values(school)); 

    this.bs.getCategory()
    .subscribe(category => this.categories = Object.values(category)); 

    console.log(this.idStudent)
          
      this.editForm.patchValue({
        Student_name: this.idStudent.Student_name,
        T_ID_type_idT_ID_type: this.idStudent.T_ID_type_idT_ID_type,  
        School_idSchool: this.idStudent.School_idSchool,
        ID_num: this.idStudent.ID_num,
        Type_category_idType_category: this.idStudent.Type_category_idType_category,
        Birth_date: this.pipe.transform(this.idStudent.Birth_date, 'yyyy-MM-dd'),
        ID_expire_date: this.pipe.transform(this.idStudent.ID_expire_date, 'yyyy-MM-dd'),
        Student_license:this.idStudent.Student_license,
        Expiration_date:  this.pipe.transform(this.idStudent.Expiration_date, 'yyyy-MM-dd'),    
        Tax_num: this.idStudent.Tax_num,
        Drive_license_num: this.idStudent.Drive_license_num, 
        Obs:this.idStudent.Obs 
      })    

/*   this.route.paramMap.subscribe(params => {
      const studId = +params.get('idStudent');
      if (studId) {
        this.getStudent(studId);
       }
     }); 

     this.bs.getStudent(this.idStudent).subscribe(
      (data:Student) => {this.editStudent(data),
      this.studentID = data[0].idStudent,
      this.license = data[0].idStudent_license})
    };


  editStudent(data){
    console.log(data);          
    this.editForm.patchValue({
      Birth_date: data.Birth_date,
      Student_name: data.Student_name,
      T_ID_type_idT_ID_type: data.T_ID_type_idT_ID_type,  
      School_idSchool: data.School_idSchool,
      ID_num: data.ID_num,
      Type_category_idType_category: data.Type_category_idType_category,
      ID_expire_date: this.pipe.transform(data.ID_expire_date, 'yyyy-MM-dd'),
      Student_license: data.Student_license,
      Expiration_date:  this.pipe.transform(data.Expiration_date, 'yyyy-MM-dd'),    
      Tax_num: data.Tax_num,
      Drive_license_num: data.Drive_license_num, 
      Obs:data.Obs
    })    
};
*/
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
  
  this.bs.patchStudent(dirtyValues, this.idStudent.idStudent, this.idStudent.Student_license)
  .subscribe(res => {this.toastr.success('O candidato foi atualizado com sucesso.','Notificação'); this.bs.sendSomething()})
  this.activeModal.close();
  
}
 
/* please(){
  setTimeout(()=>{  
    this.bs.sendSomething();
}, 400);
}; */
  //return dirtyValues;


  }
 
 
  

