import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AddOperatorComponent} from './add-operator/add-operator.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoleComponent } from './add-role/add-role.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OperatorService } from './operator.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  searchForm:FormGroup;
  subject;
  param1;
  param2;
  count:number;
  searchedOperators=[];
  selectedOperator;

  constructor(private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private fb:FormBuilder, private auth:AuthService, private service: OperatorService, private toastr: ToastrService) { this.createForm() }

  ngOnInit() {
    this.auth.currentUserSubject.subscribe(message => {this.subject = message,
      console.log(this.subject)})
  }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    })
  }

  showAddOperator(){
    const modalRef = this.modalService.open(AddOperatorComponent);
    
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  showAddRole(){
    const modalRef = this.modalService.open(AddRoleComponent);
    
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  onGetOperators() {
    this.service.getOperators()
      .subscribe(
        data1 => {
        this.searchedOperators = Object.values(data1);
        this.count = Object.values(data1).length
          console.log(this.searchedOperators)
        }
       /*  else {console.log('DATA NOT FOUND'), this.openModal(this.errorModal)}},
        error =>  this.errorMsg = error); */ )
  }

 

}
