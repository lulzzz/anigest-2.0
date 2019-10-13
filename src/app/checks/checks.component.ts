import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCheckComponent } from './add-check/add-check.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-checks',
  templateUrl: './checks.component.html',
  styleUrls: ['./checks.component.css']
})
export class ChecksComponent implements OnInit {

  searchForm: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder) { 
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      param1: [null, Validators.required],
      param2: [null, Validators.required]
    });
  }

  ngOnInit() {
  }
  addCheques(){
    const modalRef1 = this.modalService.open(AddCheckComponent, {size: 'lg'});
    
    modalRef1.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

}
